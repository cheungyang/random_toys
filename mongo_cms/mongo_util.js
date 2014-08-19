var MongoUtil = 
{
	//Db: require('mongodb').Db,
	//Connection: require('mongodb').Connection,
	//Server: require('mongodb').Server,
	//BSON: require('mongodb').BSON,
	ObjectID: require('mongodb').ObjectID,
	
	init: function(dbname, host, port, mediator) {
		var Db = require('mongodb').Db;
		var Server = require('mongodb').Server;
		
  		this.db= new Db(dbname, new Server(host, port, {auto_reconnect: true}, {}));
  		this.db.open(function(){});
		this.mediator = mediator;
	},


	getCollection: function(coll_name, callback) {
  		this.db.collection(coll_name, function(error, collection) {
    		if (error) callback(error);
			else {
				callback(null, collection);
			}
  		});
	},

	findAll: function(coll_name, callback) {
    	this.getCollection(coll_name, function(error, collection) {
      		if (error) callback(error)
      		else {
        		collection.find().toArray(function(error, results) {
          			if (error) callback(error)
          			else callback(null, results)
        		});
      		}
    	});	
	},

	findById: function(coll_name, id, callback) {
		var that=this;
		var data={
			"main_data": {},
			"asso_data": {
				"coll_name": coll_name,
				"id": id
			}
		};

    	this.getCollection(coll_name, function(error, collection) {
      		if (error) callback(error)
      		else {
				try{
					that.mediator.executeHook("getid:before", data, null);
        			collection.findOne({_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, doc) {
						data.main_data=doc;
						data = that.mediator.executeHook("getid:middle", data, null);
						data = that.mediator.executeHook("getid:after", data, callback);
        			});
				} catch (err){
					callback(err);
				}
      		}
    	});
	},

	insert: function(coll_name, datum, callback) {
		var that = this;
    	this.getCollection(coll_name, function(error, collection) {
      		if (error) callback(error)
      		else {
				collection.insert(
					that.sanityCheck(datum), 
					{"safe":true}, 
					function(error, result){
     					if (error) callback(error);
     					else callback(null, result)
    				}
				);
      		}
    	});
	},

	findAndModify: function(coll_name, id, datum, callback) {
		var that = this;
    	this.getCollection(coll_name, function(error, collection) {
      		if (error) callback(error)
      		else {
				collection.findAndModify(
					{_id: collection.db.bson_serializer.ObjectID.createFromHexString(id)}, 
					[],
					that.sanityCheck(datum), 
					{"safe":true, new:false},
					function(error, olddoc){
						//+ TODO: BRANCH		
				
						//- HISTORY
     					//if (error) callback(error);
     					//else callback(null, result)
						//+ HISTORY
						that.addHistory(
							error,
							olddoc,
							{
								"coll_name": coll_name,
								"id": id, 
								"doc": datum, 
								"callback": callback
							}
						);
    				}
				);
      		}
    	});
	},

	sanityCheck: function(datum){
		//add necessary fields
		datum._modified_at = new Date();
    	if (typeof datum._type=="undefined") datum._type="freeform";	

		//id must be removed
		delete datum._id;
	
		//sort by attribute keys
		tmpDatum = datum;
		var keys=[];
		for(var key in tmpDatum) keys.push(key);
		keys.sort();
		var datum={};
		for(var key in keys) datum[keys[key]] = tmpDatum[keys[key]];
	
		return datum;
	}
}

exports.MongoUtil = MongoUtil;