var Mediator = {
	
	hooks: {},
	
	registerHook: function(hook_name, callback){	
		if (this.hooks[hook_name]==undefined){
			this.hooks[hook_name] = [];
		}
		this.hooks[hook_name].unshift(callback);
		return this;
	},
	
	executeHook: function (hook_name, data, callback){
		//run hooks
		if (this.hooks[hook_name]!=undefined){
			for(var key in this.hooks[hook_name]) {
				data = this.hooks[hook_name][key](data);
			}
		}
		
		//end, fire callback
		if (null != callback){
			callback(null, data);	
		}

		//return data anyway
		return data;		
	}
};

exports.Mediator = Mediator;