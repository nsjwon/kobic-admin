$(function() {
	
	// workspace list click event
	$(document).on("click", ".pipeline_list.brd_list_box", function(e) {
		var selected = $(e.currentTarget);
		var workspaceId = selected.find("#workspaceId").val();
		location.href = encodeURI(getContextPath() + "/admin/workspace_view?raw_id=" + workspaceId);
	});
	
	// workspace view - pipeline click event
	$(document).on("click", ".brd_list", function(e) {
		var selected = e.currentTarget;
		var selectedPipeline = $(selected).find("#pipelineId").val();
		location.href = encodeURI(getContextPath() + "/admin/workspace_pipeline_view?raw_id=" + selectedPipeline);
	});
	
})


// admin - workspace list paging
function workspacePaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_workspace_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#workspace_fragment").replaceWith(response);
		}
	});
}


// admin - workspace view - pipeline paging
function pipelinePaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_ws_pipeline_paging",
		data: { page_no: pageNo,
				workspace_id: $("#workspaceId").text(),
				member_id: $("#memberId").text() },
		success: function(response) {
			$("#pipeline_fragment").replaceWith(response);
		}
	});
}