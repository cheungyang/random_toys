DocHistory = {

	hideHistory: function(data){
		//filtering history away
		var new_doc={};
		for(var key in data.main_data) {
			if (key=="_history") continue;
			new_doc[key] = data.main_data[key];
		}		

		data.asso_data.histories = data.main_data._history && data.main_data._history.elements || {};
		data.main_data = new_doc;
		return data;
	},
	
	addHistory: function(error, old_doc, init_data){
		var that = this;
		if (error!=null){
			return callback(error, old_doc, init_data);
		}

		var history=old_doc._history || {};
		history._type="_history";

		//add all except _history to prevent circular loop
		var hist_ele={};
		for(var key in old_doc) {
			if (key=="_history") continue;
			hist_ele[key] = old_doc[key];
		}
		if (typeof history.elements=="undefined") history.elements = [];
		history.elements.unshift(hist_ele);

	    this.getCollection(init_data.coll_name, function(error, collection) {
	      if(error) callback(error)
	      else {
			collection.update(
		        {_id: collection.db.bson_serializer.ObjectID.createFromHexString(init_data.id)},
		        {"$set": {_history: that.sanityCheck(history)}},
		        function(error){
		          if(error) init_data.callback(error);
		          else init_data.callback(null, old_doc, init_data)
		        }
			);
		  }
		});
	}
}

exports.DocHistory = DocHistory;