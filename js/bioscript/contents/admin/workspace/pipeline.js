$(function() {

	$(document).on("click", ".brd_list_type01 .brd_list", function(e) {
		
		var selected = $(e.currentTarget);
		var taskId = selected.find("#taskId").val();
		location.href = encodeURI(getContextPath() + "/admin/task_list_view?raw_id=" + taskId);
	});
})


// Admin - Workspace - pipeline - task list paging
function taskPaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_pipeline_task_paging",
		data: { page_no: pageNo,
				pipeline_id: $("#pipelineId").text() },
		success: function(response) {
			$("#task_fragment").replaceWith(response);
		}
	});
}