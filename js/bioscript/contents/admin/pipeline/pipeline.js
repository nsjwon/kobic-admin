$(function() {

	// pipeline list click event
	$(document).on("click", ".pipeline_list.brd_list_box", function(e) {
		var selected = $(e.currentTarget);
		var pipelineId = selected.find("#pipelineId").val();
		location.href = encodeURI(getContextPath() + "/admin/pipeline_list_view?raw_id=" + pipelineId);
	});
		
	$(document).on("click", ".brd_list_type01 .brd_list", function(e) {
		
		var selected = $(e.currentTarget);
		var taskId = selected.find("#taskId").val();
		var pipelineId = selected.find("#pipelineId").val();
		if ( taskId ) {
			location.href = encodeURI(getContextPath() + "/admin/task_list_view?raw_id=" + taskId);
		}
		else if ( pipelineId ) {
			location.href = encodeURI(getContextPath() + "/admin/pipeline_regist_view?raw_id=" + pipelineId);
		}
		
	});
})

// admin - pipeline - pipeline management paging
function pipelinePaging(pageNo) {
	$.ajax({
		type: "post",
		url: "admin_pipeline_mgnt_paging",
		data: { page_no: pageNo },
		success: function(response) {
			console.log(response);
			$("#pipeline_fragment").replaceWith(response);
		}
	});
}

// admin - pipeline - pipeline management - task management paging
function taskPaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_pipeline_task_paging",
		data: { page_no: pageNo,
				pipeline_id: $("#pipelineId").val() },
		success: function(response) {
			$("#task_fragment").replaceWith(response);
		}
	});
}


// admin - pipeline - Regist management paging
function registPipelinePaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_pp_regist_mgnt_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#pipeline_fragment").replaceWith(response);
		}
	});
}

// pipeline_regist_view - [Register] Button click
function confirm() {
	
	swal({
		title: "",
		text : "Do you want register this?",
		showCancelButton: true,
		cancelButtonText: "No",
		confrimButtonText : "Yes, I will register."
	}).then(function(result) {
		if (result) {
			$.ajax({
				url : getContextPath() + '/admin/pipeline_regist_confirm',
				type : 'POST',
				async : true,
				dataType : "Json",
				data : {
					"rawID" : $("#rawId").val()
				},
				
				success : function(data) {
					if(data.status == "ok"){
						swal({
							title: "",
							text: "Program registration is complete.",
							confirmButtonText: "Confirm",
						}).then(function() {
							location.href = get_context_path() + "/admin/pipeline_regist_list";
						});
						
					} else {
						console.log("fail")
					}
				},
				
				error : function(e) {
					
				},
					 
				beforeSend : function(){
					
				}
			});
		} 
		else {
			return false;
		}
	});

}


//function goPipelineDesign() {
//	
//	var pipelineInfoForm = document.pipeline_info;
//	var url = getContextPath() + "/execute/execute";
//	window.open("" ,"pipeline_info", ""); 
//	pipelineInfoForm.action =url; 
//	pipelineInfoForm.method="post";
//	pipelineInfoForm.target="pipeline_info";
//	pipelineInfoForm.submit();
//	
//}

// move pipeline_modify.html
function modifyPipeline(rawId) {
	location.href = encodeURI(getContextPath() + "/admin/pipeline_modify?raw_id=" + rawId);
}

// do modify pipeline_modify.html
function doModifyPipeline() {
	var rawId = $("#rawId").val();
	
	// workspace id, name
	$("#workspaceID").val($("#workspace option:selected").val());
	$("#workspaceName").val($("#workspace option:selected").text());
	
	// keywords
	var keywords = $("#keyword").val();
	if ( keywords && keywords.length > 0 ) {
		keywords = keywords.split(",");
		for ( var i=0; i<keywords.length; i++ ) {
			keywords[i] = "#" + keywords[i].trim();
		}
		keywords = keywords.join(",");
	}
	$("input[name=keyword]").val(keywords);

	var data = { raw_id : rawId,
				 pipeline_data : JSON.stringify($("#pipelineModifyForm").serializeObject()) };
	swal({
		title: "",
		text: "파이프라인 정보를 수정하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "수정"
	}).then(function(result) {
		if (result) {
			$.ajax({
				url: getContextPath() + "/admin/do_pipeline_modify",
				type: "POST",
				dataType: "json",
				data: data,
				success: function(data) {

					if ( data && data.status && data.status == "ok" ) {
						location.href = encodeURI(getContextPath() + "/admin/pipeline_list_view?raw_id=" + rawId);
					}
				}
			});
		} 
		else {
			return false;
		}
	});
	
}

// move pipeline_regist_modify.html
function modifyRegistPipeline(rawId) {
	location.href = encodeURI(getContextPath() + "/admin/pipeline_regist_modify?raw_id=" + rawId);
}

// do modify pipeline_regist_modify.html
function doModifyRegistPipeline() {
	var rawId = $("#rawId").val();

	// workspace id, name
	$("#workspaceID").val($("#workspace option:selected").val());
	$("#workspaceName").val($("#workspace option:selected").text());
	// category id, name
	$("#categoryID").val($("#category option:selected").val());
	$("#categoryName").val($("#category option:selected").text());
	
	// keywords
	var keywords = $("#keyword").val();
	if ( keywords && keywords.length > 0 ) {
		keywords = keywords.split(",");
		for ( var i=0; i<keywords.length; i++ ) {
			keywords[i] = "#" + keywords[i].trim();
		}
		keywords = keywords.join(",");
	}
	$("input[name=keyword]").val(keywords);

	var data = { raw_id : rawId,
				 pipeline_data : JSON.stringify($("#pipelineModifyForm").serializeObject()) };
	swal({
		title: "",
		text: "파이프라인 정보를 수정하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "수정"
	}).then(function(result) {
		if (result) {
			$.ajax({
				url: getContextPath() + "/admin/do_regist_pipeline_modify",
				type: "POST",
				dataType: "json",
				data: data,
				success: function(data) {

					if ( data && data.status && data.status == "ok" ) {
						location.href = encodeURI(getContextPath() + "/admin/pipeline_regist_view?raw_id=" + rawId);
					}
				}
			});
		} 
		else {
			return false;
		}
	});
	
}
