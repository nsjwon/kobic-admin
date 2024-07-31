$(function() {
	
	// workspace list click event
	$(document).on("click", ".task_list.brd_list_box", function(e) {
		var selected = e.currentTarget;
		selected = $(selected).children("div");
		var selectedTask = $(selected).find("#taskId").val();
		location.href = encodeURI("go_task_view?raw_id=" + selectedTask);
	});
	
})

// task paging
function taskPaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "mypage_task_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#task_fragment").replaceWith(response);
		}
	});
}


function run(){
	
	$.ajax({
		url : getContextPath() + '/admin/execute_subtask',
		type : 'GET',
		dataType : "Json",
		data : {
			"node_id" : $("#nodeId").text(),
			"workspace_name" : $("#workspaceName").text(),
			"pipeline_name" : $("#pipelineName").text(),
			"pipeline_id" : $("#pipelineId").text(),
			"user_id" : $("#userId").text()
		},
		
		success : function(data) {
			var alertMessage;
			if(data){
				alertMessage = messageAExecute;
			} else {
				alertMessage = messageAExecuteFail;
			}
			
			swal({
				title: "",
				text: alertMessage,
				confirmButtonText: "Confirm"
			});
		},
		
		error : function(e) {
			
		},
			 
		beforeSend : function(){
			
		}
	});
}

function stop(){
	
	$.ajax({
		url : getContextPath() + '/admin/stop_subtask',
		type : 'GET',
		dataType : "Json",
		data : {
			"node_id" : $("#nodeId").text(),
			"pipeline_id" : $("#pipelineId").text()
		},
		
		success : function(data) {
			var alertMessage;
			if(data){
				alertMessage = messageAStop;
			} else {
				alertMessage = messageAStopFail;
			}
			
			swal({
				title: "",
				text: alertMessage,
				confirmButtonText: "Confirm"
			});
		},
		
		error : function(e) {
			
		},
			 
		beforeSend : function(){
			
		}
	});
}