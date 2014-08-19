DocBranch = {

	hideBranches: function(data){
		//filtering atributes with _branch_xxxx
		var new_doc={};
		var branches={};
		for(var key in data.main_data) {
			if (key.substr(0,7)=="_branch"){
				branches[key] = data.main_data[key];
			} else {
				new_doc[key] = data.main_data[key];
			}
		}

		data.asso_data.branches = branches;
		data.main_data = new_doc;
		return data;
	}
}

exports.DocBranch = DocBranch;