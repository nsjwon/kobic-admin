$(function() {
	
	// task management list click event
	$(document).on("click", ".task_list.brd_list_box", function(e) {
		var selected = $(e.currentTarget);
		var taskId = selected.find("#taskId").val();
		location.href = encodeURI(getContextPath() + "/admin/task_list_view?raw_id=" + taskId);
	});
})

// w_task_list - task_fragment paging
function taskPaging(pageNo) {
	$.ajax({
		type: "post",
		url: "admin_task_mgnt_paging",
		data: { page_no: pageNo },
		success: function(response) {
			console.log(response);
			$("#task_fragment").replaceWith(response);
		}
	});
}

function run(){
	$.ajax({
		url : get_context_path() + '/admin/execute_subtask',
		type : 'GET',
		dataType : "Json",
		data : {
			"node_id" : $("#nodeId").val(),
			"workspace_name" : $("#workspaceName").val(),
			"pipeline_name" : $("#pipelineName").val(),
			"pipeline_id" : $("#pipelineId").val(),
			"user_id" : $("#userId").val()
		},
		
		success : function(data) {
			var alertMessage;
			if(data){
				alertMessage = "Subtask Execute Success";
			} else {
				alertMessage = "Subtask Execute Fail";
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
		url : get_context_path() + '/admin/stop_subtask',
		type : 'GET',
		dataType : "Json",
		data : {
			"node_id" : $("#nodeId").val(),
			"pipeline_id" : $("#pipelineId").val()
		},
		
		success : function(data) {
			var alertMessage;
			if(data){
				alertMessage = "Subtask Stop Success";
			} else {
				alertMessage = "Subtask Stop Fail";
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

function get_context_path(){
	var host_index = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(host_index, location.href.indexOf('/', host_index + 1));
}