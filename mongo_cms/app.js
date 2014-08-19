
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jage');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "haha" }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('view options', { pretty: true });
});

app.configure('production', function(){
  app.use(express.errorHandler());
});




var dochistory = require('./plugins/doc_history').DocHistory;
var docbranch = require('./plugins/doc_branch').DocBranch;

var mediator = require('./mediator').Mediator;
mediator.registerHook("getid:middle", dochistory.hideHistory)
	.registerHook("getid:middle", docbranch.hideBranches);

var mongoUtil = require('./mongo_util').MongoUtil;
mongoUtil.init('docs', 'localhost', 27017, mediator);


// Routes
app.get('/test', test);
app.get('/', getDocData);
app.get('/new', getNewForm);
app.get('/:id', getDocData);
app.post('/new', insertDoc);
app.post('/:id', updateDoc);

function test(req, res) {
	console.log("it works!");
	res.send("it works!");
}

function insertDoc(req, res) {
	try{
		var doc= JSON.parse(req.param('doc'));
		mongoUtil.insert("doc", doc, function(error, result) {
			if (null==error){
				req.flash('info', 'doc '+result[0]._id+' created');
				res.redirect('/'+result[0]._id);
			} else {
				req.flash('info', 'insertDoc error:%s', error);
				res.redirect('/');
			}
		});		
	} catch (err){
		console.log("insertDoc error:"+err)
		req.flash('info', 'insertDoc error:%s', err);		
		res.redirect('/'+req.params.id);
	}
}

function updateDoc(req, res) {
	try{
		var doc= JSON.parse(req.param('doc'));
		mongoUtil.findAndModify("doc", req.params.id, doc, function(error, result) {
			if (null==error){
				req.flash('info', 'update done');
			} else {
				req.flash('info', 'updateDoc error:%s', error);
			}
			res.redirect('/'+req.params.id);
		});		
	} catch (err){
		console.log("updateDoc error:"+err)
		req.flash('info', 'updateDoc error:%s', err);
		res.redirect('/'+req.params.id);
	}
}

function getNewForm(req, res){
	getListing(req, res, {record: {}}, "Docpusher - new");
}

function getDocData(req, res){
	if (typeof req.params.id!="undefined"){			
		mongoUtil.findById('doc', req.params.id, function(error, data){
			if (null!=error){
				req.flash('info', 'getDocData error:%s', error);
				res.redirect('/');
			} else {
				//-HISTORY
				//getListing(req, res, doc, 'Doc Pusher - '+req.params.id);
				//+HISTORY
				getListing(req, res, data, 'Doc Pusher - '+req.params.id);
			}
		});
	} else {
		getListing(req, res, {}, 'Doc Pusher');		
	} 
}

function getListing(req, res, data, title_text){
	mongoUtil.findAll('doc', function(error,docs){
		data["listing"]=docs;
		res.render('doc_pusher.jade', { locals: {
           	title: title_text,
			data:data,
			flash:req.flash('info')
    	}});
	});
}


app.listen(3011);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
