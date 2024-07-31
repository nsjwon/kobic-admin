$(function() {
	
	// workspace list click event
	$(document).on("click", ".pipeline_list.brd_list_box", function(e) {
		var selected = e.currentTarget;
		selected = $(selected).children("div");
		var selectedPipeline = $(selected).find("#pipelineId").val();
		var selectedTab = $("li.t_on").find("a").attr("href").split("#tab_")[1];
		var type = selectedTab == "development" ? "PT02" : "PT01";
		location.href = encodeURI("go_pipeline_view?raw_id=" + selectedPipeline + "&type=" + type);
	});
	
})

// pipeline paging
function pipelinePaging(pageNo) {
	
	var selectedTab = $("li.t_on").find("a").attr("href").split("#tab_")[1];
	var type = selectedTab == "development" ? "PT02" : "PT01";
	var data = { page_no: pageNo,
				 type:	type };
	$.ajax({
		type: "post",
		url: "mypage_pipeline_paging",
		data: data,
		success: function(response) {
			var fragment = type == "PT02" ? "dev_pipe_fragment" : "inst_pipe_fragment";
			$("#" + fragment).replaceWith(response);	
		}
	});
}


//태스크 실행
function taskExecute() {
	
	swal({
		title: "",
		text: messageQExecute,
		showCancelButton: true,
		confirmButtonText: buttonConfirm,
		cancelButtonText: buttonCancel,
	}).then(function(result) {
		if (result) {
			$.ajax({
				url: getContextPath() + '/execute/do_execute',
				type: 'POST',
				async: true,
				dataType: "json",
				data: {
					raw_id : $("#rawId").val(),
					workspace_name : $("#workspaceName").text()
				},
				success: function(data){
					
					if(data.is_execute){						
						location.href = "/bioexpress/mypage/main";
					} else {
						swal({
							title: "",
							text: messageAExecuteFail,
							confirmButtonText: buttonConfirm
						});
					}
				},
				error: function(){
					console.log("error");
				},
				beforeSend: function() {
				}
			});	
		} 
		else {
			return false;
		}
	});

}