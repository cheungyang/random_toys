YUI().use('node', function (Y) {
	//+HISTORY
	if (null!=Y.one("#select_history_view")){
		Y.one("#select_history_view").on('change', function(e){
			Y.one("#textarea_doc").set("value", JSON.stringify(history[e.target.get("value")], null, 4));
		});
	}

	//+BRANCH
	if (null!=Y.one("#select_branch_view")){
		Y.one("#select_branch_view").on('change', function(e){
			Y.one("#textarea_doc").set("value", JSON.stringify(branches[e.target.get("value")], null, 4));
		});
	}
	
	if (null!=Y.one("#btn_branch")){
		Y.one("#btn_branch").on('click', function(e){
			var branch_name = Y.one("#text_branch_name").get("value");
			if (""==branch_name){
				alert('to branch out, please enter a branch name');
			}
		});
	}
});

console.log("done loading");
