$(function() {
	
	// workspace list click event
	$(document).on("click", ".workspace_list.brd_list_box", function(e) {
		var selected = e.currentTarget;
		selected = $(selected).children("div");
		var selectedWorkspace = $(selected).find("#workspaceId").val();
		location.href = encodeURI("go_worksapce_view?raw_id=" + selectedWorkspace);
	});
	
	// workspace view - pipeline click event
	$(document).on("click", ".brd_list", function(e) {
		var selected = e.currentTarget;
		var selectedPipeline = $(selected).find("#pipelineId").val();
		location.href = encodeURI("go_pipeline_view?raw_id=" + selectedPipeline);
	});
	
//	$("#workspace-create").find("input").keyup(checkNewWorkspaceValidate);
	$("#workspace-create").children().keyup(checkNewWorkspaceValidate);
	
	// remove keyword (create workspace lp)
	$(document).on("click", ".keyword_txt button", function(e) {
		var selected = e.currentTarget;
		var selectedKeyword = $(selected).parent("span").attr("id");
		$("#" + selectedKeyword).remove();
		keywordList.splice(keywordList.findIndex(el => el.id === selectedKeyword), 1);
	});
})


// Create Workspace Validate
function checkNewWorkspaceValidate() {
	
	// Workspace Name
	var workspaceName = $("#workspaceName").val().trim();
	if ( !workspaceName ) {
		$("#workspaceNm-error").text(workspacePopMsg1);
		$("#workspaceNm-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceNm-error").addClass("Dis_none");
	}
	
	// WorkspaceName 공백체크 
	if ( workspaceName.indexOf(" ") > -1 ) {
		$("#workspaceNm-error").text(workspacePopMsg2);
		$("#workspaceNm-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceNm-error").addClass("Dis_none");
	}
	
	// Workspace Description
	var workspaceDesc = $("#workspaceDesc").val().trim();
	if ( !workspaceDesc ) {
		$("#workspaceRs-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceRs-error").addClass("Dis_none");
	}
	
	// Workspace Keywords
	if ( keywordList.length < 1 ) {
		$("#workspaceKw-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceKw-error").addClass("Dis_none");
	}
}


// Create workspace
var keywordList = [];
function createWorkspace() {

	var invalid = 0;
	var workspaceName = $("#workspaceName").val().trim();
	if ( !workspaceName ) {
		$("#workspaceNm-error").text(workspacePopMsg1);
		$("#workspaceNm-error").removeClass("Dis_none");
		invalid++;
	}
	
	var workspaceDesc = $("#workspaceDesc").val().trim();
	if ( !workspaceDesc ) {
		$("#workspaceRs-error").removeClass("Dis_none");
		invalid++;
	}
	
	if ( invalid > 0 ) {
		return;
	}
	
	// WorkspaceName 공백체크 
	if ( workspaceName.indexOf(" ") > -1 ) {
		$("#workspaceNm-error").text(workspacePopMsg2);
		$("#workspaceNm-error").removeClass("Dis_none");
		return;
	}
	
	// Keywords 
	var keywordCount = keywordList.length;
	var keywords = "";
	if ( keywordCount < 1 ) {
		$("#workspaceKw-error").removeClass("Dis_none");
		return;
	}
	else {
		keywords = $.map(keywordList, function(obj){
			return obj.text}).join(',');
	}
	

	swal({
		title: "",
		text: workspaceQCreate,
		showCancelButton: true,
		cancelButtonText: buttonCancel,
		confirmButtonText: buttonCreate
	}).then(function(result) {
		if (result) {


			$.ajax({
				type : "POST",
				url : getContextPath() + "/mypage/workspace_create",
				async : true,
				data : {
					"workspace_name" : workspaceName,
					"workspace_desc" : workspaceDesc,
					"workspace_keyword" : keywords
				},
				
				success : function(data){
					
					if(data.result_count == "1"){
						swal({
							title: "",
							text: workspaceACreate,
							confirmButtonText: buttonConfirm
						}).then(function() {
							location.reload();
						});
					}
					else{
						swal({
							title: "",
							text: workspaceAFCreate,
							confirmButtonText: buttonConfirm
						});
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

// add keyword for new workspace
function addWorkspaceKeyword() {
	
	var keywordCount = $(".layer_keyword_box span.keyword_txt").length;
	var workspaceKeyword = $("#workspaceKeyword").val().trim();
	if(workspaceKeyword.length < 1){
		return;
	}
	
	//<span class="keyword_txt">키워드1<button class="keyword_close"><span class="Hidden">닫기</span></button></span>
	var keywordSpan = "<span class='keyword_txt' id='keyword_"  +keywordCount + "'>" + workspaceKeyword + "<button class='keyword_close'><span class='Hidden'>닫기</span></button></button></span>";
	keywordList.push({id: "keyword_" + keywordCount, text: workspaceKeyword});
	$(".layer_keyword_box").append(keywordSpan);
	$("#workspaceKeyword").val("");
}

// workspace paging
function workspacePaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "mypage_workspace_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#workspace_fragment").replaceWith(response);
		}
	});
}

// workspace view - pipeline paging
function pipelinePaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "mypage_ws_pipeline_paging",
		data: { page_no: pageNo,
				workspace_id: $("#workspaceId").text() },
		success: function(response) {
			$("#pipeline_fragment").replaceWith(response);
		}
	});
}