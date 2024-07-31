var isInstancePipeline = false;
var isRefresh = false;	// 새로고침 버튼 사용 유무
var copy_pipeline_data;

$(function() {
	
	// 초기 로딩 박스 보임 
	$("#loadingBox").show();
	
	// project_create.html 에서 프로젝트 타입 선택 
	$(document).on("click", ".p_select_list li", function(e) {
		var clicked = e.currentTarget;
		$(".project-select-wrap").eq(0).addClass("Dis_none");
		$(".project-select-wrap").eq(1).removeClass("Dis_none");
		
		var selectedExecuteType = $(clicked).attr("id");
		$("#execute_type").val(selectedExecuteType);
	});
	
	// 좌측 메뉴 선택 
	$(document).on("click", "ul.side-menu-list li", function(e) {
		var clicked = e.currentTarget;
		var clickedId = $(clicked).attr("id");

		// 메뉴 콘텐츠 영역 보임
		$("#left_menu").removeClass("Dis_none");
		
		// info 
		if ( clickedId.indexOf("info") > -1 ) {
			// 선택한 메뉴에 따른 콘텐츠 영역 보임
			$("#left_menu").children("div").eq(0).removeClass("Dis_none");
			$("#left_menu").children("div").eq(1).addClass("Dis_none");
			// 메뉴 아이콘 class 변경
			$("#left_menu_info").children("a").addClass("active");
			$("#left_menu_node").children("a").removeClass("active");
		}
		// node
		else {
										
			// 파이프라인 활성화 여부 확인
			if(!isEnabledPipeline()) {
				alertPopup("", "파이프라인을 활성화 해주세요.", "확인", "닫기", false)
				return ;	
			}										
						
			// 선택한 메뉴에 따른 콘텐츠 영역 보임
			$("#left_menu").children("div").eq(0).addClass("Dis_none");
			$("#left_menu").children("div").eq(1).removeClass("Dis_none");
			// 메뉴 아이콘 class 변경
			$("#left_menu_info").children("a").removeClass("active");
			$("#left_menu_node").children("a").addClass("active");
		}
	});
	
	// 좌측 메뉴 영역 닫기 버튼 클릭 
	$(document).on("click", ".btn_close", function(e) {
		
		var clicked = e.currentTarget;
		// 좌측
		if ( !$(clicked).parent("div").hasClass("parameter-wrap") ) {
			// 메뉴 콘텐츠 영역 숨김
			$("#left_menu").addClass("Dis_none");
			// 메뉴 아이콘 class 변경
			$(".side-menu-list").children("li").children("a").removeClass("active");
		}
		// 우측 
		else {
			$(".right-wrap").children("div").eq(1).addClass("Dis_none");
		}
	});
	
	// (좌측 메뉴) 워크스페이스 리스트 클릭 
	$(document).on("click", ".ws-list-tit", function(e) {
		var clicked = e.currentTarget;
		clicked = $(clicked).parent("li");
		
		// 워크스페이스가 이미 선택되어있고, 파이프라인 생성 버튼을 클릭했을 때 워크스페이스가 안닫히도록함.
		var isPipelineBtn = $(e.target).is("button");
		if ( isPipelineBtn && $(clicked).hasClass("open") ) {
			return;
		}
		
		showWorkspaceInfo($(clicked));
		// TASK 초기화		
	});
	
	// (좌측 메뉴) 워크스페이스 리스트 > 파이프라인 리스트 클릭 
	$(document).on("click", "ul.pp-list > li", function(e) {
		var clicked = e.currentTarget;
		showWorkspacePipelineInfo($(clicked));		
	});
	
	
	/**
	 * 유효성 체크 
	 */
	
	// 워크스페이스 생성 데이터 유효성 체크 
	$("#workspace-create").children().keyup(checkNewWorkspaceValidate);
	// 파이프라인 생성 데이터 유효성 체크
	$("#pipeline-create").children().keyup(pipeDesign_PipelineValidateKeyupCreate);
	
	
	// 워크스페이스 수정 데이터 유효성 체크
	$("#workspace-modify").children().keyup(checkModiWorkspaceValidate);		
	// 파이프라인 수정 데이터 유효성 체크
	$("#pipeline-modify").children().keyup(pipeDesign_PipelineValidateKeyupUpdate);
	
	
	
	
		
	
	// 파이프라인 생성 시 타입 선택 이벤트 
//	$('input[type=radio][name=selectPipelineType]').on('change', function() {
//		if ( $(this).val() == "develop" ) {
//			$(".public-pipe-list").addClass("Dis_none");
//		}
//		else {
//			$(".public-pipe-list").removeClass("Dis_none");
//		}
////		var disabled = $(this).val() == "develop" ? true : false;
////		$(".public-pipe-list").children("select").attr("disabled", disabled);
//	});
	$(document).on("change", "input[type=radio][name=selectPipelineType]", function() {
		if ( $(this).val() == "develop" ) {
			$(".public-pipe-list").addClass("Dis_none");
		}
		else {
			$(".public-pipe-list").removeClass("Dis_none");
		}
	});
	
	
	// My Workspace 목록 가져오기
	getMemberWorkspace();
	
	// (좌측 메뉴) Program Node List (using pipeline_full.js)
	getProgramRootCategory();
	
	// 공개 파이프라인 사용의 경우 파이프라인 생성 시 선택할 수 있도록 세팅
	getPipelineMainCategoryInExecute();
	
});


// Zoom In/Out:start
$(function() {
	// 마우스 
    window.addEventListener('mousewheel', function(e) {
        if(e.ctrlKey == true){
			var zoomType = e.deltaY > 0 ? "out" : "in";
			onZoom(zoomType);
			e.preventDefault();
        }
	}, { passive: false });
	
	
	window.addEventListener('keydown', function(e) {
		// 숫자판의 +/-
//	    if((e.keyCode == 107 && e.ctrlKey == true) || (e.keyCode == 109 && e.ctrlKey == true)){
//			var zoomType = e.keyCode == 107 ? "in" : "out";
	    if((e.code == "NumpadAdd" && e.ctrlKey == true) || (e.code == "NumpadSubtract" && e.ctrlKey == true)){
			var zoomType = e.code == "NumpadAdd" ? "in" : "out";
			onZoom(zoomType);
	        e.preventDefault(); 
	    }	    
	    // delete키
//	    if((e.keyCode == 46)) {	
		if ( e.code == "Delete" ) {											
			deleteSelected_link();
//	        e.preventDefault();	        
	    }	    	   
	}, { passive: false });
	
	
	
})

function onZoom(zoomType) {
	var zoom = $("#pipeline_div").css("zoom");
	
	// 최소 0.1까지만 축소됨.
	if ( zoom == 0.1 && zoomType == "out" ) return;

	var zoomOffset = zoomType == "in" ? 0.1 : -0.1;
	$("#pipeline_div").css("zoom", Number(zoom) + zoomOffset);
	
	var updateZoom = $("#pipeline_div").css("zoom");
	updateZoom = Math.floor(updateZoom*100);
	$("#zoomValue").text(updateZoom + "%");
}
// Zoom In/Out:end
var isSelectedDeleteLink = false;
function deleteSelected_link() {
	// alert('삭제!');
	isSelectedDeleteLink = true;
				
	// 링크 삭제 
	var linkId = $("#pipeline_con").flowchart("getSelectedLinkId");
	if ( linkId != null ) {
		swal({
			title: "",
			text: "해당 링크를 삭제하시겠습니까?",	
			showCancelButton: true,
			cancelButtonText: "취소",
			confirmButtonText: "삭제"
		}).then(function(result) {
			
			if (result) {
				$("#pipeline_con").flowchart("deleteLink", linkId);
				isSelectedDeleteLink = false;
			} 
			else {
				isSelectedDeleteLink = false;
				return false;
			}
		});	
	}
	// 노드 삭제 
	else {
		if ( !$(".right-wrap").children("div").hasClass("Dis_none") ) {
			var deleteBtn = $(".right-wrap").children("div").find("#deleteNodeBtn");
			deleteSelected(deleteBtn);
		}
	}
}

// 공개 컨텐츠 > 분석 파이프라인 > 분석활용 클릭해서 진입 시 
// project_create.html > 파이프라인 정보 입력 후 > 시작하기 버튼 클릭 
function createPipeline() {
	
	var pipelineName = $("#pipelineName").val();
	var pipelineDesc = $("#pipelineDesc").val();
	
	var err = 0;
	if ( pipelineName == "" ) {
		err++;
		$("#pipelineNm-error").text("파이프라인명을 입력해주세요.");
		$("#pipelineNm-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineNm-error").addClass("Dis_none");
	}
	
	if ( pipelineDesc == "" ) {
		err++;
		$("#pipelineDesc-error").text("파이프라인 정보를 입력해주세요.");
		$("#pipelineDesc-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineDesc-error").addClass("Dis_none");
	}
	
	
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi;
	if( regExp.test(pipelineName) ){
		err++;
		$("#pipelineNm-error").text("특수문자가 포함되었습니다.");
		$("#pipelineNm-error").removeClass("Dis_none");		
	}
	
		
	// 파이프라인 생성 후, execute 페이지로 이동
	if ( err == 0 ) {

		var data = {
			"pupblic_pipeline_rawId" : $("#rawId").val(),
			"workspace_id" : $("#myWorkspace option:selected").val(),
			"workspace_name" : $("#myWorkspace option:selected").text(),
			"pipeline_name" : pipelineName,
			"pipeline_desc" : pipelineDesc,
			"pipeline_keyword" : $("#pipelineKeyword").val(),
			"pipeline_version" : $("#pipelineVersion").val(),
			"pipeline_reference" : $("#pipelineReference").val()					
		};
		pipeDesign_createInstancePipeline(data);
	
	}
}

// Get Workspace List
// project_execute.html > 워크스페이스 목록 세팅
function getMemberWorkspace(workspace_id) {
	
	$.ajax({
//		url: get_context_path() + '/mypage/workspace_list',
		url: get_context_path() + "/pipedesign/workspace_list", 
		async: false,
		type: 'POST',
		dataType: "Json",
		success: function(data) {

			if (data.page_info.totalCount > 0) {
				
				// 좌측 워크스페이스 목록 관련
				var workspaceList = "";
				var selectedWorkspaceId = $("#createWorkspaceId").val();
								
				// 파이프라인 수정의 워크스페이스 목록 관련				
				var workList = "";
				
				
				$.each(data.workspace_list, function(index, workspace) {
					
					// 좌측 메뉴 워크스페이스 리스트
					workspaceList += "<li class='close' id='" + workspace.workspaceID + "'>";
					workspaceList += 	"<input type='hidden' value='" + workspace.rawID + "'>";
					workspaceList += 	"<div class='ws-list-tit'>";
					workspaceList += 		"<span id='" + workspace.workspaceID + "_Name'>" + workspace.workspaceName + "(" + workspace.pipelineCount + ")</span>";
					workspaceList += 		"<button class='pp-create open_lp' aria-controls='pipeline-create'>";
					workspaceList += 		"<span class='Hidden'>파이프라인 생성</span></button>";
					workspaceList += 	"</div>";
					workspaceList += "</li>";
					
					// 파이프라인 수정 팝업의 워크스페이스리스트	
					workList += "<option value=" + workspace.workspaceID + " name=" + workspace.workspaceName + ">" + workspace.workspaceName + "</option>";								
				});
				$("#myWorkspaceList").html(workspaceList);
				$("#myWorkList").append(workList);				
				
				// 공공파이프라인선택해서 들어오거나, 파이프라인 수정 시 워크스페이스 정보가 변경되었을 때
				// [INSTANCE]
				if ( $("#instanceWorkspaceId").val() || workspace_id) {
					isInstancePipeline = true;
					// 공공파이프라인 선택
					if ( $("#instanceWorkspaceId").val() ) {
						selectedWorkspaceId = $("#instanceWorkspaceId").val();
					}
					// 파이프라인 수정 시 워크스페이스 정보가 변경됨 
					if ( workspace_id ) {
						selectedWorkspaceId = workspace_id;
					}
					// 선택한 워크스페이스 정보 보이도록 클릭
					showWorkspaceInfo($("#" + selectedWorkspaceId));
				}
			
			}
		},
		error: function(e) {

		},
		beforeSend: function() {
			$("#myWorkList").empty();
		}
	});
}

// 워크스페이스 목록 > 워크스페이스 클릭 시 
// 워크스페이스 정보 및 파이프라인 리스트 가져오기
function showWorkspaceInfo(el, is_update) {

	if ( !is_update && $(el).hasClass("open") ) {
		$(el).removeClass("open").addClass("close");
		$(el).children("ul.pp-list").addClass("Dis_none");
		$("#workspaceInfo").addClass("Dis_none");
		$("#pipelineInfo").addClass("Dis_none");
		return;
	}
	
	$("li.open").removeClass("open").addClass("close");
	$("ul.pp-list").addClass("Dis_none");

//	var workspaceId = $(el).attr("id");
	var workspaceId = $(el).children("input").val();	// workspace의 rawID
	$("#clickWorkspaceId").val($(el).attr("id"));		// 클릭된 워크스페이스의 workspaceID 저장
	$("#clickWorkspaceRawId").val(workspaceId);			// 클릭된 워크스페이스의 rawID 저장
	
	$(el).removeClass("close").addClass("open");
	$(el).children("ul").removeClass("Dis_none");
	
	$.ajax({
		url: get_context_path() + '/pipedesign/workspace_view',
		type: 'POST',
		async: false,
		dataType: "Json",
		data: {
			"raw_id": workspaceId
		},
		success: function(data) {

			if ( data.workspace_info ) {
				var workspaceInfo = data.workspace_info;
				
				// (좌측 메뉴) 워크스페이스 클릭 시, 워크스페이스 정보 영역 세팅:start
				$("#wsInfoName").text(workspaceInfo.workspaceName);
				$("#wsInfoDesc").text(workspaceInfo.description);
				$("#wsInfoId").text(workspaceInfo.workspaceID);
				$("#wsInfoCreateDt").text(workspaceInfo.createDate);
				$("#wsInfoUpdateDt").text(workspaceInfo.updateDate);
			
				var keywords = workspaceInfo.keyword;
				keywords = keywords.split(",");
				var keywordEls = "";
				$.each(keywords, function(index, keyword){
					keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + keyword + "</span>";
				});
				$("#wsInfoKeywords").html(keywordEls);
				// (좌측 메뉴) 워크스페이스 클릭 시, 워크스페이스 정보 영역 세팅:end
				
				// (좌측 메뉴) 워크스페이스 정보 영역 > 워크스페이스 수정 팝업:start
				$("#workspaceModiRawId").val(workspaceInfo.rawID); 			// 워크스페이스 수정 시 전달 인자 - 워크스페이스 아이디
				$("#workspaceNameUpdate").val(workspaceInfo.workspaceName);	// 워크스페이스 수정 시 전달 인자 - 워크스페이스 이름
				$("#workspaceDescUpdate").text(workspaceInfo.description);	// 워크스페이스 수정 시 전달 인자 - 워크스페이스 설명
//				$("#workspaceKeywordUpdate").val(workspaceInfo.keyword);	// 워크스페이스 수정 시 전달 인자 - 워크스페이스 키워드	
				var workspaceKeyword = workspaceInfo.keyword;
				if ( workspaceKeyword.length > 0 ) {
					workspaceKeyword = workspaceKeyword.replace(/#/g, "");
				}		
				$("#workspaceKeywordUpdate").val(workspaceKeyword);	// 워크스페이스 수정 시 전달 인자 - 워크스페이스 키워드	
				// (좌측 메뉴) 워크스페이스 정보 영역 > 워크스페이스 수정 팝업:end
				
							
				// (좌측 메뉴) 파이프라인 정보 영역 > 파이프라인 수정 팝업:start
				$("#createPpWsName").text(workspaceInfo.workspaceName);  	// 파이프라인 생성 팝업 내 워크스페이스 이름
				$("#pipeParentWsId").val(workspaceInfo.workspaceID); 		// 파이프라인 생성 시 전달 인자 - 워크스페이스 아이디
				$("#pipeParentWsName").val(workspaceInfo.workspaceName);	// 파이프라인 생성 시 전달 인자 - 워크스페이스 이름
				// (좌측 메뉴) 파이프라인 정보 영역 > 파이프라인 수정 팝업:end
																					 											
			}
			
			// 워크스페이스 내 파이프라인 개수가 변경 될 수도 있으므로..
			$("#" + $(el).attr("id") + "_Name").text(workspaceInfo.workspaceName + "(" + data.pipeline_list.length + ")");

			var ppList = "";
			if ( data.pipeline_list.length > 0 ) {
				ppList += "<ul class='pp-list open'>";
				$.each(data.pipeline_list, function(pipeline_index, pipeline){
					ppList += "<li><span id='" + pipeline.rawID + "'>" + pipeline.pipelineName + "</span></li>";																				
				});
				ppList += "</ul>";
			}
			$(el).append(ppList);
			
			$("#pipelineInfo").addClass("Dis_none");
			$("#workspaceInfo").removeClass("Dis_none");	
			
			
			// 공공파이프라인선택해서 들어옴.
			// [INSTANCE]
//			if ( isInstancePipeline && $("#instancePipelineId").val() ) {
//				selectedPipelineId = $("#instancePipelineId").val();
//				// 선택한 파이프라인 정보 보이도록 클릭
//				showWorkspacePipelineInfo($("#" + selectedPipelineId).parent());
//			}
			if ( isInstancePipeline ) {
				var selectedPipelineId;
				if ( $("#instancePipelineId").val() ){
					selectedPipelineId = $("#instancePipelineId").val();
				}
				else if ( $("#pipeModiRawId").val() ) {
					selectedPipelineId = $("#pipeModiRawId").val();
				}
				// 선택한 파이프라인 정보 보이도록 클릭
				if ( selectedPipelineId ) {
					showWorkspacePipelineInfo($("#" + selectedPipelineId).parent());
				}
			}
		},
		error: function(e) {
		},
		beforeSend: function() {
			$("ul.pp-list").removeClass("open").addClass("close");
			$(el).children("ul").remove();
		}
	});
}

// 워크스페이스 목록 > 워크스페이스 클릭 > 파이프라인 목록 > 파이프라인 클릭 
// 파이프라인 클릭 시 정보 표출
var currentPipeline = null;
var currentTask_status = null;
function showWorkspacePipelineInfo(el, pipeline_id) {
	
	var pipelineId = "";
	$(".pp-list").children("li").removeClass("pp_on");
	if ( pipeline_id) {
		pipelineId = pipeline_id;
	}
	else {
//		$(".pp-list").children("li").removeClass("pp_on");
//		$(el).addClass("pp_on");
		pipelineId = $(el).children("span").attr("id");
	}
	$("#" + pipelineId).parent("li").addClass("pp_on");
//	if ( pipeline_id) {
//		pipelineId = pipeline_id;
//	}
//	else {
//	
//		$(".pp-list").children("li").removeClass("pp_on");
//		$(el).addClass("pp_on");
//		
//		pipelineId = $(el).children("span").attr("id");
//	}
	$("#clickPipelineRawId").val(pipelineId);	// 클릭된 파이프라인 rawID 저장 
	
	// 다른 파이프라인 활성화 전, 현재 표출중인 파이프라인 저장을 위한 데이터 
	if( typeof pipeline_data !== "undefined" ) {
		if( pipeline_data ) {
			if ( pipeline_data.rawID != pipelineId ) {
				copy_pipeline_data = pipeline_data;
			}
		} 
	}
	
	
	$.ajax({
		url: get_context_path() + '/pipedesign/pipeline_view',
		type: 'POST',
		async: false,
		dataType: "Json",
		data: {
			"raw_id": pipelineId
		},
		success: function(data) {

			if ( data.pipeline_info != null ) {
				
				currentPipeline = data.pipeline_info;
				currentTask_status = data.task_status;
				
				var pipelineInfo = data.pipeline_info.pipelineData;

					
				// (좌측 메뉴) 파이프라인 상세 정보 세팅:start
				$("#ppInfoName").text(pipelineInfo.pipelineName);
				$("#ppInfoDesc").text(pipelineInfo.pipelineDesc);
				$("#ppInfoId").text(pipelineInfo.pipelineID);
				$("#ppInfoCategory").text(pipelineInfo.categoryName);
				$("#ppInfoExeCnt").text(pipelineInfo.exeCount);
				var registStatus;
				if(pipelineInfo.registCode == "PI-REG-0010"){
					registStatus = "ready";
				} else if(pipelineInfo.registCode == "PI-REG-0020"){
					registStatus = "request";
				} else if(pipelineInfo.registCode == "PI-REG-0030"){
					registStatus = "complete";
				} else if(pipelineInfo.registCode == "PI-REG-0040"){
					registStatus = "reject";
				}
				$("#ppInfoRegistStatus").text(registStatus);
				$("#ppInfoPublic").text(pipelineInfo.isPublic);
				$("#ppInfoShare").text(pipelineInfo.isShare);
				var status = pipelineInfo.status == "init" ? "wait" : pipelineInfo.status;
				$("#ppInfoStatus").text(status);
				$("#ppInfoVersion").text(pipelineInfo.version);
				$("#ppInfoReference").text(pipelineInfo.reference);
				$("#ppInfoCreateDt").text(pipelineInfo.createDate);
				$("#ppInfoUpdateDt").text(pipelineInfo.updateDate);
			
				var keywords = pipelineInfo.keyword;
				keywords = keywords.split(",");
				var keywordEls = "";
				$.each(keywords, function(index, keyword){
					keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + keyword + "</span>";
				});
				$("#ppInfoKeywords").html(keywordEls);
				// (좌측 메뉴) 파이프라인 상세 정보 세팅:end 
				
				// 좌측 메뉴 파이프라인 상세 정보 영역 표출 
				$("#workspaceInfo").addClass("Dis_none");	
				$("#pipelineInfo").removeClass("Dis_none");
				
//				// 좌측 메뉴 파이프라인 상세 정보에서 더보기 클릭시 팝업 정보 세팅:start
//				$("#pipeline-detail").find("#ppDetailId").text(pipelineInfo.pipelineID);
//				$("#pipeline-detail").find("#ppDetailName").text(pipelineInfo.pipelineName);
//				$("#pipeline-detail").find("#ppDetailDesc").text(pipelineInfo.pipelineDesc);
//				$("#pipeline-detail").find("#ppDetailRootCategory").text(pipelineInfo.categoryName);	// 대분류 중분류....
//				$("#pipeline-detail").find("#ppDetailSubCategory").text("");
//				$("#pipeline-detail").find("#ppDetailExeCnt").text(pipelineInfo.exeCount);
//				
//				var registStatus;
//				if(pipelineInfo.registCode == "PI-REG-0010"){
//					registStatus = "ready";
//				} else if(pipelineInfo.registCode == "PI-REG-0020"){
//					registStatus = "request";
//				} else if(pipelineInfo.registCode == "PI-REG-0030"){
//					registStatus = "complete";
//				} else if(pipelineInfo.registCode == "PI-REG-0040"){
//					registStatus = "reject";
//				}
//				$("#pipeline-detail").find("#ppDetailRegistStatus").text(registStatus);
//				$("#pipeline-detail").find("#ppDetailPublic").text(pipelineInfo.isPublic);
//				$("#pipeline-detail").find("#ppDetailShare").text(pipelineInfo.isShare);
//				$("#pipeline-detail").find("#ppDetailStatus").text(status);
//				$("#pipeline-detail").find("#ppDetailVersion").text(pipelineInfo.version);
//				$("#pipeline-detail").find("#ppDetailReference").text(pipelineInfo.reference);
//				$("#pipeline-detail").find("#ppDetailCreateDt").text(pipelineInfo.createDate);
//				$("#pipeline-detail").find("#ppDetailUpdateDt").text(pipelineInfo.updateDate);
//				
//				var keywordEls = "";
//				$.each(keywords, function(index, keyword){
//					keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + keyword + "</span>";
//				});
//				$("#pipeline-detail").find("#ppDetailKeywords").html(keywordEls);
//				// 좌측 메뉴 파이프라인 상세 정보에서 더보기 클릭시 팝업 정보 세팅:end
				
				// (좌측 메뉴) 파이프라인 정보 영역 > 파이프라인 수정 팝업:start
				//$("#pipeline-modify").find("[name=pipelineName]").val(pipelineInfo.pipelineName);
				//$("#pipeline-modify").find("[name=version]").val(pipelineInfo.version);
				//$("#pipeline-modify").find("[name=reference]").val(pipelineInfo.reference);
				//$("#pipeline-modify").find("[name=keyword]").val(pipelineInfo.keyword);
				//$("#pipeline-modify").find("[name=pipelineDesc]").text(pipelineInfo.pipelineDesc);							
				//$("#pipeline-modify").find("[name=myWorkList]").val(pipelineInfo.workspaceID).prop("selected", true);														
				$("#pipelineNameUpdate").val(pipelineInfo.pipelineName);
				$("#pipelineVersionUpdate").val(pipelineInfo.version);
				$("#pipelineReferenceUpdate").val(pipelineInfo.reference);
//				$("#pipelineKeywordsUpdate").val(pipelineInfo.keyword);
				var pipelineKeyword = pipelineInfo.keyword;
				if ( pipelineKeyword.length > 0 ) {
					pipelineKeyword = pipelineKeyword.replace(/#/g, "");
				}		
				$("#pipelineKeywordsUpdate").val(pipelineKeyword);
				$("#workspaceKeywordUpdate").val(workspaceKeyword);	// 워크스페이스 수정 시 전달 인자 - 워크스페이스 키워드	
				$("#pipelineDescUpdate").text(pipelineInfo.pipelineDesc);														
				$("#pipeline-modify").find("[name=myWorkList]").val(pipelineInfo.workspaceID).prop("selected", true);
				$("#pipeModiRawId").val(pipelineInfo.rawID);
				
				// (좌측 메뉴) 파이프라인 정보 영역 > 파이프라인 수정 팝업:end
//				if ( pipeline_id || (isInstancePipeline && $("#instancePipelineId").val()) ) {
//					initSelectedPipeline();
//				}
				var selectCheck = 0;
				if ( pipeline_id ) selectCheck++;
				if ( isInstancePipeline ) {
					// 공공 파이프라인을 분석 활용한 경우 
					if ( $("#instacePipelineId").val() ) selectCheck++;
					// 파이프라인이 생성/수정된 경우 
					if ($("#pipeModiRawId").val()==$("#pipelineNavId").val()) {
						isRefresh = true;
						selectCheck++;	
					}
				}

				if ( selectCheck > 0 ) {
					initSelectedPipeline();
				}
				
				$("#loadingBox").hide();
			}
		},
		error: function(e) {
		},
		beforeSend: function() {
			$("#loadingBox").show();
		}
	});
}

// 파이프라인 디자인 영역 초기화 
// project_execute.html 활성화버튼 click
function initSelectedPipeline() {
	
	/**  
	 * 파이프라인 활성화 시 변경사항 저장 저장 경고창 출력
	 * - 최초 활성화 : 경고창 없이 바로 활성화
	 * - 활성화 상태에서 활성화 : 변경사항 저장 경고창 출력
	 */	
	 	
	
	/** 파이프라인 활성화 여부 확인 */
	if(isEnabledPipeline() && !isRefresh) {
		
		
		/** 플로우차트에 그려진 노드(연산자, operator)의 정보를 획득한다. */	
		var data = $("#pipeline_con").flowchart('getData');	
		 /** flowChart에 그려진 노드 정보 루프를 돌며 좌표 값을 설정한다. */
		 $.each(data.operators, function(index, operator) {
					
//			$.each(copy_pipeline_data.node, function(node_index, node){
			$.each(pipeline_data.node, function(node_index, node){
				if(operator.properties.title == node.nodeData.nodeName){
			
					node.nodeData.x = operator.left;
					node.nodeData.y = operator.top;
					node.nodeData.setX = true;
					node.nodeData.setY = true;
				}
			});
		});
					
//		let pipelineModelStr = JSON.stringify(copy_pipeline_data);
		let pipelineModelStr = JSON.stringify(pipeline_data);
		
		let sendData = {
			pipelineModelStr : pipelineModelStr
		};
	
		swal({
			title: "",
			text: "작업중인 파이프라인을 저장하시겠습니까?",	
			showCancelButton: true,
			showCloseButton: true,
			cancelButtonText: "저장안함",
			confirmButtonText: "저장"
		}).then(function(result) {
			
			if ( result == undefined ) return false;
			if (result) {
				
					$.ajax({
						type : "POST",
						url : get_context_path() + "/pipedesign/save_pipeline",
						async: false, 
						data : sendData,
						success : function(data){
												
							if(data.result_stat == "STAT_OK"){
								swal({
									title: "",
									text: "저장되었습니다.",
									confirmButtonText: "확인"
								}).then(function() {										
									// 태스크 상태 -> 저장됨으로 변경
									setTaskStat_save();
									clear();	
									copy_pipeline_data = null;
								});
							}
							else{
																		
								swal({
									title: "",
									text: "파이프라인 저장에 실패하였습니다.",
									confirmButtonText: "확인"
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
				clear();
			}
		});				
	}
	else {
		clear();
	}
}

function clear() {

	isRefresh = false;
			
	var pipelineDivStr = "<div id='pipeline_div'>";
	pipelineDivStr += 		"<div id='pipeline_con' class='pArea'></div>";
	pipelineDivStr +=	 "</div>";
	
	$("#pipeline_div").html(pipelineDivStr);	
	$("#minimapArea").empty();
	$("#minimapArea").append("<div class='viewport'></div>");
	$("#loadingBox").show();
	$(".right-wrap").children("div").eq(1).addClass("Dis_none");
	
	showSelectedPipeline();
	
	if (isInstancePipeline) {
		isInstancePipeline = false;	
	}	
}


// 해당 파이프라인 활성화 
function showSelectedPipeline() {
	
	if(currentTask_status == 'exec' || currentTask_status == 'run') {
		setStopBtn();		
	}else {
		setRunBtn();
		isRefresh = false;
	}
		
	if ( currentPipeline ) {
	
	pipeline_data = currentPipeline;
	console.log("======== draw!");
	console.log(pipeline_data);
	console.log(currentPipeline);
		// TASK 상태 초기화				 						 
		initRunTaskInfo("save", "stop", currentPipeline.pipelineData.workspaceName, currentPipeline.pipelineData.rawID);
								 
		// 우측 상단 [워크스페이스명/파이프라인명] 정보 세팅 
		$(".pipe-location").html(currentPipeline.pipelineData.workspaceName + " / " +  "<span class='bold'>" + currentPipeline.pipelineData.pipelineName + "</span>");
		$("#pipelineNavId").val(currentPipeline.rawID);
		
		// draw_check_01
		draw_structure2(currentPipeline,window.innerWidth-400,window.innerHeight,400,240,true);

//		$("#loadingBox").hide();
		var pipelineInfo = currentPipeline.pipelineData;
		// console.log(pipelineInfo);
		// 우측 상단 파이프라인 상세 팝업 정보 세팅:start
		$("#showing-pipeline-detail").find("#ppDetailId").text(pipelineInfo.pipelineID);
		$("#showing-pipeline-detail").find("#ppDetailName").text(pipelineInfo.pipelineName);
		$("#showing-pipeline-detail").find("#ppDetailDesc").text(pipelineInfo.pipelineDesc);
		$("#showing-pipeline-detail").find("#ppDetailRootCategory").text(pipelineInfo.categoryName);	// 대분류 중분류....
		$("#showing-pipeline-detail").find("#ppDetailSubCategory").text("");
		$("#showing-pipeline-detail").find("#ppDetailExeCnt").text(pipelineInfo.exeCount);
		
		var registStatus;
		if(pipelineInfo.registCode == "PI-REG-0010"){
			registStatus = "ready";
		} else if(pipelineInfo.registCode == "PI-REG-0020"){
			registStatus = "request";
		} else if(pipelineInfo.registCode == "PI-REG-0030"){
			registStatus = "complete";
		} else if(pipelineInfo.registCode == "PI-REG-0040"){
			registStatus = "reject";
		}
		$("#showing-pipeline-detail").find("#ppDetailRegistStatus").text(registStatus);
		$("#showing-pipeline-detail").find("#ppDetailPublic").text(pipelineInfo.isPublic);
		$("#showing-pipeline-detail").find("#ppDetailShare").text(pipelineInfo.isShare);
		
		var status = pipelineInfo.status == "init" ? "wait" : pipelineInfo.status;
		$("#showing-pipeline-detail").find("#ppDetailStatus").text(status);
		$("#showing-pipeline-detail").find("#ppDetailVersion").text(pipelineInfo.version);
		$("#showing-pipeline-detail").find("#ppDetailReference").text(pipelineInfo.reference);
		$("#showing-pipeline-detail").find("#ppDetailCreateDt").text(pipelineInfo.createDate);
		$("#showing-pipeline-detail").find("#ppDetailUpdateDt").text(pipelineInfo.updateDate);
		
		var keywords = pipelineInfo.keyword;
		keywords = keywords.split(",");
		var keywordEls = "";
		$.each(keywords, function(index, keyword){
			keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + keyword + "</span>";
		});
		$("#showing-pipeline-detail").find("#ppDetailKeywords").html(keywordEls);
		// 우측 상단 파이프라인 상세 팝업 정보 세팅:end
	}
	else {
		// 미니맵 숨김
		$("#minimapArea").addClass("Dis_none");	
		// 우측상단 현재 활성화된 워크스페이스/파이프라인 이름	
		$(".pipeline-nav").addClass("Dis_none");
		$("#loadingBox").hide();
	}
	
}

// 노트 실행 기록 리스트 
function showSubTaskList(nodeId) {
	
	$.ajax({
		type : "POST",
		url : get_context_path() + "/pipedesign/get_subtask_list",
		async : false,
		data : {
			"node_id" : nodeId
		},
		success: function(data) {
			var logStr = "";
			var isEmpty = true;
			if ( data.subtask_list ) {
				var len = (data.subtask_list).length;
				if ( len > 0 ) {
					isEmpty = false;
					$.each(data.subtask_list, function(stIndex, subTask) {
						logStr += "<div class='para-cont-item'>";
						logStr += 	"<div><span>실행시각</span><span>" + subTask.submissionTime + "</span></div>";
						logStr += 	"<div><span>상태</span><span class='status_icon2 status_" + subTask.status + "'>" + subTask.status + "</span></div>";
						logStr += 	"<div><button class='btn btn_line_blue open_lp' aria-controls='task-detail' onclick='showSubTaskLogs(\""+ subTask.rawID +"\");'>실행 및 장애 로그</button></div>"; 
						logStr += "</div>";
					});
				}
			}
			// 실행 기록이 없을 경우
			if ( isEmpty ) {
				logStr = "<div class='para-cont-item'>";
				logStr += 	"<span class='no_data'>No Data</span>";
				logStr += "</div>";
			}
			$(".task-cont").html(logStr);
		},
		error : function(e) {
		},
		beforeSend : function(){
			$(".task-cont").empty();
		}
	});
}

// 실행 및 장애 로그 팝업 세팅
function showSubTaskLogs(rawId) {
	
	$.ajax({
		type : "POST",
		url : get_context_path() + "/pipedesign/get_subtask_logs",
		data : {
			"raw_id" : rawId
		},
		success: function(data) {
//			console.log(data);
//			console.log(data.task_info);		
//			console.log(data.task_info.shellList);		
//			console.log(data.execute_contents);
//			console.log(data.error_contents);

			var taskInfo = data.task_info;
			var executeContents = data.execute_contents;
			var errorContents = data.error_contents;	

			$("#task_node_name").text(taskInfo.nodeName);			
			$("#task_submission_time").text(taskInfo.submissionTime);			
			$("#task_status").text(taskInfo.status);			
			$("#task_execute_log").text(executeContents);
			$("#task_error_log").text(errorContents);
			$("#task_shell_list").text(taskInfo.shellList);
			
			$("#loadingBox").hide();
			$("#task-detail").addClass("on");					
		},
		error : function(e) {
		},
		beforeSend : function() {			
			 $("#loadingBox").show();
		}
	});
	
	
}

// 노드 실행
function runSubTask(btn){
	
	var subTaskInfo = $($(btn).siblings("input"));
	if ( !subTaskInfo ) {
		return false;
	}
	
	swal({
		title: "",
		text: "노드를 실행하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "실행"
	}).then(function(result) {
		if (result) {
			$.ajax({
				url : get_context_path() + '/pipedesign/execute_subtask',
				type : 'GET',
				dataType : "Json",
				data : {
					"node_id" : subTaskInfo.eq(0).val(),//node_id,
					"workspace_name" : subTaskInfo.eq(1).val(),//workspace_name,
					"pipeline_name" : subTaskInfo.eq(2).val(),//pipeline_name,
					"pipeline_id" : subTaskInfo.eq(3).val(),//pipeline_id,
					"user_id" : subTaskInfo.eq(4).val()//user_id
				},
				
				success : function(data) {
					var alertMessage;
					if(data){
						// alertMessage = "Subtask Execute Success";
						alertMessage = "노드가 실행되었습니다.";
						
						$(btn).addClass("Dis_none");
						$(btn).siblings("button").removeClass("Dis_none");
						
						updateNode("run", subTaskInfo.eq(0).val());
					} else {
						// alertMessage = "Subtask Execute Fail";
						alertMessage = "다시 시도해주세요.";
					}
					
					$("#loadingBox").hide();
					swal({
						title: "",
						text: alertMessage,
						confirmButtonText: "확인"
					}).then(function(result) {
					});
				},
				
				error : function(e) {
					
				},
					 
				beforeSend : function(){
					$("#loadingBox").show();
				}
			});
		} 
		else {
			return false;
		}
	});


}

// 노드 정지
function stopSubTask(btn){
	
	var subTaskInfo = $($(btn).siblings("input"));
	if ( !subTaskInfo ) {
		return;
	}
	
	swal({
		title: "",
		text: "해당 노드을 정지하시겠습니까?",
		showCancelButton: true,
		confirmButtonText: "정지",
		cancelButtonText: "취소",
	}).then(function(result) {
		if (result) {
			$.ajax({
				url : get_context_path() + '/pipedesign/stop_subtask',
				type : 'GET',
				dataType : "Json",
				data : {
					"node_id" : subTaskInfo.eq(0).val(),//node_id,
					"pipeline_id" : subTaskInfo.eq(3).val()//pipeline_id,
				},
				
				success : function(data) {
					var alertMessage;
					if(data){
						alertMessage = "Subtask Stop Success";
								
						$(btn).addClass("Dis_none");
						$(btn).siblings("button").removeClass("Dis_none");
						
						updateNode("stop", subTaskInfo.eq(0).val());
					} else {
						alertMessage = "Subtask Stop Fail";
					}
					
					$("#loadingBox").hide();
					swal({
						title: "",
						text: alertMessage,
						confirmButtonText: "확인"
					}).then(function(result) {
					});
				},
				error : function(e) {
					
				},
					 
				beforeSend : function(){
					$("#loadingBox").show();
				}
			});
		} 
		else {
			return false;
		}
	});
}


function updateNode(status, nodeId) {

	var operatorId = $("#r_tab1").find("h2[name=nodeId]").text();
	if ( operatorId != null && operatorId != "" ) {
		var operatorData = $("#pipeline_con").flowchart("getOperatorData", operatorId);
		var operatorClass = operatorData.properties.class;
		operatorClass = operatorClass.split(" ");
		operatorClass[0] = status;//"run";
		operatorData.properties.class = operatorClass.join(" ");
		$("#pipeline_con").flowchart("setOperatorData", operatorId, operatorData);
		
		$.each(pipeline_data.node, function(node_index, node){
			if(node.nodeData != null){
				if(operatorId.replace("node_","") == node.nodeData.nodeName){
					node.nodeData.status = status;
					return false;
				}
			} 
			else {
				if(operatorId.replace("node_","") == node.programData.programName){
					node.programData.status = status;
					return false;
				}
				
			}
		});
	}
	minimapSet();
	showSubTaskList(nodeId);
}


////////////////////////////////////////////////////////////////////
// 파이프라인 디자인 관련 신규 함수 정의 : 2022.09.26 : NineSoft jhkim
// 기존 js의 함수들과 함수명이 겹치는 것을 방지하기 위해 pipeDesign_를 붙임 
////////////////////////////////////////////////////////////////////

/*
	워크스페이스 관련
	1. function pipeDesign_createWorkspace() : 워크스페이스 생성
	 1-1. checkNewWorkspaceValidate() : 워크스페이스 모달창 keyup 검증 - 생성
	 1-2. checkModiWorkspaceValidate() : 워크스페이스 모달창 keyup 검증 - 수정
	2. function pipeDesign_updateWorkspace() : 워크스페이스 수정	 
	 2-1. checkNewWorkspaceValidate() : 워크스페이스 모달창 keyup 검증
	3. function pipeDesign_deleteWorkspace() : 워크스페이스 삭제
	
*/

// 워크스페이스 생성 
function pipeDesign_createWorkspace() {
	
	/**
	 * 필수 값 검증
	 */
	var invalid = 0;
	/** 워크스페이스 명 */
	var workspaceName = $("#workspaceName").val().trim();
	if ( !workspaceName ) {
		$("#workspaceName-error").text("이름을 입력해주세요.");
		$("#workspaceName-error").removeClass("Dis_none");
		invalid++;
	}

	/** 워크스페이스 설명 */
	var workspaceDesc = $("#workspaceDesc").val().trim();
	if ( !workspaceDesc ) {
		$("#workspaceDesc-error").text("설명을 입력해주세요.");
		$("#workspaceDesc-error").removeClass("Dis_none");
		invalid++;
	}
	
	if ( invalid > 0 ) {
		return;
	}
	
	/** 워크스페이스 키워드 */
	var workspaceKeyword = $("#workspaceKeyword").val().trim();
	if ( !workspaceKeyword ) {
		$("#workspaceKeyword-error").text("키워드를 입력해주세요.");
		$("#workspaceKeyword-error").removeClass("Dis_none");
		return;		
	}else {
		$("#workspaceKeyword-error").addClass("Dis_none");
	}
	
	/**
	 * 공백 체크
	 */
	 
	/** 워크스페이스명 */ 
	if ( workspaceName.indexOf(" ") > -1 ) {
		$("#workspaceName-error").text("공백을 제거해주세요.");
		$("#workspaceName-error").removeClass("Dis_none");
		return;
	}else {
		$("#workspaceName-error").addClass("Dis_none");
	}
	
	/**
	 * 특수문자 체크
	 */
	
	/** 워크스페이스명 */
	// var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi; 		
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi;
	if( regExp.test(workspaceName) ){
		$("#workspaceName-error").text("특수문자가 포함되었습니다.");
		$("#workspaceName-error").removeClass("Dis_none");
		return;
	}else {
		$("#workspaceName-error").addClass("Dis_none");
	}
		
	var data = {						
			"workspace_name" : workspaceName,
			"workspace_desc" : workspaceDesc,
			"workspace_keyword" : workspaceKeyword			
		};
	
	swal({
		title: "",
		text: "워크스페이스를 생성하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "생성"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/create_workspace",
					data : data,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "생성되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {
								
									
								/*				
								var rawIdStr = "";
								if ( $("#rawId").val() != "" ) {
									rawIdStr = "?raw_id=" + $("#rawId").val();
								}				
								location.href = get_context_path() + "/execute/execute" + rawIdStr;
								
								// 2022.10.03, jhkim : 워크스페이스 생성 시 ExecuteController의 
								// /execute/execute에서 rawId가 'undefined' 되면서 공개컨텐츠 로직을 타게 됨
								// -> pipelineDetailInfo = pipeline.getPipeline(rawId); NullPointerException 발생
								// rawId가 undefined일 때 ""으로 변경하여 처리
								
								*/
								var rawIdStr = "";										
								if ( utils_isEmptyToDefStr($("#rawId").val(),"") != "" ) {
									rawIdStr = "?raw_id=" + $("#rawId").val();
								}								
								location.href = get_context_path() + "/execute/execute" + rawIdStr;
																							
							});
						}
						else{
																	
							swal({
								title: "",
								text: "워크스페이스 생성에 실패하였습니다.",
								confirmButtonText: "확인"
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
// project_create.html, project_execute.html의 id=workspace-crreate 모달창 내 데이터 유효성 체크
// keyup 이벤트에 엮여있음. (상단 참고)
function checkNewWorkspaceValidate() {
	
	// Workspace Name
	var workspaceName = $("#workspaceName").val().trim();

	if ( !workspaceName ) {
		$("#workspaceName-error").text("이름을 입력해주세요.");
		$("#workspaceName-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceName-error").addClass("Dis_none");
	}
	
	// WorkspaceName 공백체크 
	if ( workspaceName.indexOf(" ") > -1 ) {
		$("#workspaceName-error").text("공백을 제거해주세요.");
		$("#workspaceName-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceName-error").addClass("Dis_none");
	}
	
	// Workspace Description
	var workspaceDesc = $("#workspaceDesc").val().trim();
	if ( !workspaceDesc ) {
		$("#workspaceDesc-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceDesc-error").addClass("Dis_none");
	}
	
	// Workspace Keywords
	var workspaceKeywords = $("#workspaceKeyword").val().trim();
	if ( !workspaceKeywords ) {
		$("#workspaceKeyword-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceKeyword-error").addClass("Dis_none");
	}
}

function checkModiWorkspaceValidate() {
	
	// Workspace Name
	var workspaceName = $("#workspaceNameUpdate").val().trim();
		
	if ( !workspaceName ) {
		$("#workspaceNameUpdate-error").text("이름을 입력해주세요.");
		$("#workspaceNameUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceNameUpdate-error").addClass("Dis_none");
	}
	
	// WorkspaceName 공백체크 
	if ( workspaceName.indexOf(" ") > -1 ) {
		$("#workspaceNameUpdate-error").text("공백을 제거해주세요.");
		$("#workspaceNameUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceNameUpdate-error").addClass("Dis_none");
	}
	
	// Workspace Description
	var workspaceDesc = $("#workspaceDescUpdate").val().trim();
	if ( !workspaceDesc ) {
		$("#workspaceDescUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceDescUpdate-error").addClass("Dis_none");
	}
	
	// Workspace Keywords
	var workspaceKeywords = $("#workspaceKeywordUpdate").val().trim();
	if ( !workspaceKeywords ) {
		$("#workspaceKeywordUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#workspaceKeywordUpdate-error").addClass("Dis_none");
	}
}


// 워크스페이스 수정
function pipeDesign_updateWorkspace() {
		
	/**
	 * 필수 값 검증
	 */
	var invalid = 0;
	/** 워크스페이스 명 */
	var workspaceName = $("#workspaceNameUpdate").val().trim();
	if ( !workspaceName ) {
		$("#workspaceNameUpdate-error").text("이름을 입력해주세요.");
		$("#workspaceNameUpdate-error").removeClass("Dis_none");
		invalid++;
	}

	/** 워크스페이스 설명 */
	var workspaceDesc = $("#workspaceDescUpdate").val().trim();
	if ( !workspaceDesc ) {
		$("#workspaceDescUpdate-error").text("설명을 입력해주세요.");
		$("#workspaceDescUpdate-error").removeClass("Dis_none");
		invalid++;
	}
	
	if ( invalid > 0 ) {
		return;
	}
	
	/** 워크스페이스 키워드 */
	var workspaceKeyword = $("#workspaceKeywordUpdate").val().trim();
	if ( !workspaceKeyword ) {
		$("#workspaceKeywordUpdate-error").text("키워드를 입력해주세요.");
		$("#workspaceKeywordUpdate-error").removeClass("Dis_none");
		return;		
	}else {
		$("#workspaceKeywordUpdate-error").addClass("Dis_none");
	}
	
	/**
	 * 공백 체크
	 */
	 
	/** 워크스페이스명 */ 
	if ( workspaceName.indexOf(" ") > -1 ) {
		$("#workspaceNameUpdate-error").text("공백을 제거해주세요.");
		$("#workspaceNameUpdate-error").removeClass("Dis_none");
		return;
	}else {
		$("#workspaceNameUpdate-error").addClass("Dis_none");
	}
	
	/**
	 * 특수문자 체크
	 */
	
	/** 워크스페이스명 */
	// var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi; 		
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi;
	if( regExp.test(workspaceName) ){
		$("#workspaceNameUpdate-error").text("특수문자가 포함되었습니다.");
		$("#workspaceNameUpdate-error").removeClass("Dis_none");
		return;
	}else {
		$("#workspaceNameUpdate-error").addClass("Dis_none");
	}
	
	var workspaceRawID = $("#workspaceModiRawId").val().trim();
	
	
	
	var data = {						
			"raw_id" : workspaceRawID,
			"workspace_name" : workspaceName,
			"workspace_desc" : workspaceDesc,
			"workspace_keyword" : workspaceKeyword 				
		};
	
	
	swal({
		title: "",
		text: "워크스페이스 정보를 수정하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "수정"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/update_workspace",
					data : data,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "수정되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
								console.log(data.result_msg);		
//								location.href = get_context_path() + "/execute/execute";
								getMemberWorkspace();
								showWorkspaceInfo($("#" + $("#clickWorkspaceId").val()), true);	// 생성된 파이프라인의 워크스페이스가 선택될 수 있고, 위 데이터를 사용해 파이프라인 표출까지 진행 
								closePopup();		
							});
						}
						else{
																	
							swal({
								title: "",
								text: "워크스페이스 정보 수정에 실패하였습니다.",
								confirmButtonText: "확인"
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

// 워크스페이스 삭제
function pipeDesign_deleteWorkspace() {
		
	var workspaceRawID = $("#workspaceModiRawId").val().trim();
		
	var data = {						
			"raw_id" : workspaceRawID 			
		};
		
	swal({
		title: "",
		text: "워크스페이스를 삭제하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "삭제"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/delete_workspace",
					data : data,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "삭제되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
								console.log(data.result_msg);		
								location.href = get_context_path() + "/execute/execute";
							});
						}
						else{
																	
							swal({
								title: "",
								text: "워크스페이스 삭제에 실패하였습니다.",
								confirmButtonText: "확인"
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


/*
	파이프라인 관련
	0. function pipeDesign_createPipeline() : 파이프라인 생성 (개발 / 인스턴스 분기하여 실행)
	 0-1. function pipeDesign_PipelineValidateCreate() : 파이프라인 생성 검증
	 0-2. function pipeDesign_PipelineValidateKeyupCreate() : 워크스페이스 모달창 keyup 검증
	 0-3. function pipeDesign_PipeclineValidateUpdate() : 파이프라인 수정 검증	 	 
	1. function pipeDesign_createDevelopPipeline() : 개발 파이프라인 생성(일반 파이프라인, 빈 모눈종이 화면)
	2. function pipeDesign_createInstancePipeline() : 인스턴스 파이프라인 생성(공공 파이프라인 활용, 공개된 파이프라인 화면을 복사하여 기본 구성)
	3. function pipeDesign_updatePipeline() : 파이프라인 수정
	4. function pipeDesign_deletePipeline() : 파이프라인 삭제
	5. function pipeDesign_savePipeline() : 파이프라인 저장
	
*/

/**
 * 파이프라인 생성 (개발 / 인스턴스 분기하여 파이프라인 생성 메소드 호출)
 */
function pipeDesign_createPipeline() {
	
	const type = $('input[name="selectPipelineType"]:checked').val();	
		
	if(type == 'develop') {
		pipeDesign_createDevelopPipeline();
	}else { // instance		
	
		var isSelectedRootCate = $('#rootCate option').index($('#rootCate option:selected')) < 1 ? false : true;
		var isSelectedSubCate = $('#subCate option').index($('#subCate option:selected')) < 1 ? false : true;
		var isSelectedPipeline = $('#pipelineList option').index($('#pipelineList option:selected')) < 1 ? false : true;
		
		if ( !isSelectedRootCate || !isSelectedSubCate || !isSelectedPipeline ) {
			swal({
				title: "",
				text: "파이프라인 타입을 선택해주세요.",
				confirmButtonText: "확인"
			});
			return;	
		}	
		
		pipeDesign_createInstancePipeline();	
	}
		
}
/**
 * 파이프라인 생성 검증
 */
function pipeDesign_PipelineValidateCreate() {
	
	/**
	 * 필수 값 검증
	 */
	var invalid = 0;
	
	/** 파이프라인명 명 */
	var pipelineName = $("#pipelineName").val().trim();	
	if ( !pipelineName ) {
		$("#pipelineName-error").text("이름을 입력해주세요.");
		$("#pipelineName-error").removeClass("Dis_none");
		invalid++;
	}else {
		$("#pipelineName-error").addClass("Dis_none");
	}

	/** 파이프라인 설명 */
	var pipelineDesc = $("#pipelineDesc").val().trim();
	if ( !pipelineDesc ) {
		$("#pipelineDesc-error").text("설명을 입력해주세요.");
		$("#pipelineDesc-error").removeClass("Dis_none");
		invalid++;
	}else {
		$("#pipelineDesc-error").addClass("Dis_none");
	}
	
	/** 파이프라인 키워드 */
	var pipelineKeywords = $("#pipelineKeywords").val().trim();
	if ( !pipelineKeywords ) {
		$("#pipelineKeywords-error").text("키워드를 입력해주세요.");
		$("#pipelineKeywords-error").removeClass("Dis_none");
		invalid++;		
	}else {
		$("#pipelineKeywords-error").addClass("Dis_none");
	}
			
	if ( invalid > 0 ) {
		return false;
	}
		
	/**
	 * 공백 체크
	 */
	 /** 파이프라인명 */ 
	if ( pipelineName.indexOf(" ") > -1 ) {		
		$("#pipelineName-error").text("공백을 제거해주세요.");
		$("#pipelineName-error").removeClass("Dis_none");
		return false;
	}else {
		$("#pipelineName-error").addClass("Dis_none");
	}
	 	
	/**
	 * 특수문자 체크
	 */
	
	/** 파이프라인 명 */
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi; 		
	if( regExp.test(pipelineName) ){
		$("#pipelineName-error").text("특수문자가 포함되었습니다.");
		$("#pipelineName-error").removeClass("Dis_none");
		return false;
	}else {
		$("#pipelineName-error").addClass("Dis_none");
	}
	
	return true;
	
}

function pipeDesign_PipelineValidateKeyupCreate() {

	// pipeline Name
	var pipelineName = $("#pipelineName").val().trim();
	if ( !pipelineName ) {
		$("#pipelineName-error").text("이름을 입력해주세요.");
		$("#pipelineName-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineName-error").addClass("Dis_none");
	}
	
	// pipelineName 공백체크 
	if ( pipelineName.indexOf(" ") > -1 ) {
		$("#pipelineName-error").text("공백을 제거해주세요.");
		$("#pipelineName-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineName-error").addClass("Dis_none");
	}
	
	// pipeline Description
	var pipelineDesc = $("#pipelineDesc").val().trim();
	if ( !pipelineDesc ) {
		$("#pipelineDesc-error").text("설명을 입력해주세요");
		$("#pipelineDesc-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineDesc-error").addClass("Dis_none");
	}
	
	// pipeline Keywords
	var pipelineKeywords = $("#pipelineKeywords").val().trim();
	if ( !pipelineKeywords ) {
		$("#pipelineKeywords-error").text("키워드를 입력해주세요");
		$("#pipelineKeywords-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineKeywords-error").addClass("Dis_none");
	}
	
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi; 		
	if( regExp.test(pipelineName) ){
		$("#pipelineName-error").text("특수문자가 포함되었습니다.");
		$("#pipelineName-error").removeClass("Dis_none");		
	}else {
		$("#pipelineName-error").addClass("Dis_none");
	}
	
}


function pipeDesign_PipelineValidateKeyupUpdate() {

	// pipeline Name
	var pipelineName = $("#pipelineNameUpdate").val().trim();
	if ( !pipelineName ) {
		$("#pipelineNameUpdate-error").text("이름을 입력해주세요.");
		$("#pipelineNameUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineNameUpdate-error").addClass("Dis_none");
	}
	
	// pipelineName 공백체크 
	if ( pipelineName.indexOf(" ") > -1 ) {
		$("#pipelineNameUpdate-error").text("공백을 제거해주세요.");
		$("#pipelineNameUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineNameUpdate-error").addClass("Dis_none");
	}
	
	// pipeline Description
	var pipelineDesc = $("#pipelineDescUpdate").val().trim();
	if ( !pipelineDesc ) {
		$("#pipelineDescUpdate-error").text("설명을 입력해주세요");
		$("#pipelineDescUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineDescUpdate-error").addClass("Dis_none");
	}
	
	// pipeline Keywords
	var pipelineKeywords = $("#pipelineKeywordsUpdate").val().trim();
	if ( !pipelineKeywords ) {
		$("#pipelineKeywordsUpdate-error").text("키워드를 입력해주세요");
		$("#pipelineKeywordsUpdate-error").removeClass("Dis_none");
	}
	else {
		$("#pipelineKeywordsUpdate-error").addClass("Dis_none");
	}
	
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi; 		
	if( regExp.test(pipelineName) ){
		$("#pipelineNameUpdate-error").text("특수문자가 포함되었습니다.");
		$("#pipelineNameUpdate-error").removeClass("Dis_none");		
	}else {
		$("#pipelineNameUpdate-error").addClass("Dis_none");
	}
	
}

/**
 * 파이프라인 수정 검증 
 */

// pipeDesign_PipelineValidateUpdate
//  $("#workspace-modify").find("[name=workspaceName]")
function pipeDesign_PipelineValidateUpdate() {
			
	/**
	 * 필수 값 검증
	 */
	var invalid = 0;
	
	/** 파이프라인명 명 */
	var pipelineName = $("#pipelineNameUpdate").val().trim();	
	if ( !pipelineName ) {
		$("#pipelineNameUpdate-error").text("이름을 입력해주세요.");
		$("#pipelineNameUpdate-error").removeClass("Dis_none");
		invalid++;
	}else {
		$("#pipelineNameUpdate-error").addClass("Dis_none");
	}

	/** 파이프라인 설명 */
	var pipelineDesc = $("#pipelineDescUpdate").val().trim();
	if ( !pipelineDesc ) {
		$("#pipelineDescUpdate-error").text("설명을 입력해주세요.");
		$("#pipelineDescUpdate-error").removeClass("Dis_none");
		invalid++;
	}else {
		$("#pipelineDescUpdate-error").addClass("Dis_none");
	}
	
	/** 파이프라인 키워드 */
	var pipelineKeywords = $("#pipelineKeywordsUpdate").val().trim();
	if ( !pipelineKeywords ) {
		$("#pipelineKeywordsUpdate-error").text("키워드를 입력해주세요.");
		$("#pipelineKeywordsUpdate-error").removeClass("Dis_none");
		invalid++;		
	}else {
		$("#pipelineKeywordsUpdate-error").addClass("Dis_none");
	}
			
	if ( invalid > 0 ) {
		return false;
	}
		
	/**
	 * 공백 체크
	 */
	 /** 파이프라인명 */ 
	if ( pipelineName.indexOf(" ") > -1 ) {		
		$("#pipelineNameUpdate-error").text("공백을 제거해주세요.");
		$("#pipelineNameUpdate-error").removeClass("Dis_none");
		return false;
	}else {
		$("#pipelineNameUpdate-error").addClass("Dis_none");
	}
	 	
	/**
	 * 특수문자 체크
	 */
	
	/** 파이프라인 명 */
	var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\+┼<>@\#$%&\'\"\\\(\=]/gi; 		
	if( regExp.test(pipelineName) ){
		$("#pipelineNameUpdate-error").text("특수문자가 포함되었습니다.");
		$("#pipelineNameUpdate-error").removeClass("Dis_none");
		return false;
	}else {
		$("#pipelineNameUpdate-error").addClass("Dis_none");
	}
	
	return true;
	
}


/**
 * 일반 파이프라인 생성 (개발 파이프라인) 
 */
function pipeDesign_createDevelopPipeline() {
		
	/** 입력 값 검증 */
	if(!pipeDesign_PipelineValidateCreate()) {
		return;
	}
	
	const workspaceId = $("#pipeParentWsId").val().trim();
	const workspaceName = $("#pipeParentWsName").val().trim();	
	const pipelineName = $("#pipelineName").val().trim();
	const pipelineDesc = $("#pipelineDesc").val().trim();
	const pipelineKeywords = $("#pipelineKeywords").val().trim();
	const pipelineVersion = $("#pipelineVersion").val().trim();
	const pipelineReference = $("#pipelineReference").val().trim();
	
	
	var data = {			
			"workspace_id" : workspaceId,
			"workspace_name" : workspaceName,
			"pipeline_name" : pipelineName,
			"pipeline_desc" : pipelineDesc,
			"pipeline_keyword" : pipelineKeywords,
			"pipeline_version" : pipelineVersion,
			"pipeline_reference" : pipelineReference					
		};
	
				
	swal({
		title: "",
		text: "파이프라인을 생성하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "생성"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/create_pipeline_develop",
					data : data,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "생성되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
								console.log(data.result_msg);		
//								location.href = get_context_path() + "/execute/execute";
								if ( data && (data.result_msg != "STAT_ERR")) {
									
											
									isInstancePipeline = true;	// 공공 파이프라인을 이용한 파이프라인 생성하는 것처럼 	
									$("#pipeModiRawId").val(data.result_msg);	// 해당 아이디를 선택해 표출할 수 있도록
									getMemberWorkspace(workspaceId);
									closePopup();
									$("#pipeline-create").load(" #pipeline-create > *");	// 파이프라인 생성 팝업 데이터 초기화 
									getPipelineMainCategoryInExecute();
									
									
									
//									isInstancePipeline = true;	// 공공 파이프라인을 이용한 파이프라인 생성하는 것처럼 			
//									$("#pipeModiRawId").val(data.result_msg);	// 해당 아이디를 선택해 표출할 수 있도록
//									showWorkspaceInfo($("#" + workspaceId), true);	// 생성된 파이프라인의 워크스페이스가 선택될 수 있고, 위 데이터를 사용해 파이프라인 표출까지 진행 
//									closePopup();
//									$("#pipeline-create").load(" #pipeline-create > *");	// 파이프라인 생성 팝업 데이터 초기화 
//									getPipelineMainCategoryInExecute();
								}
							});
						}
						else{
																	
							swal({
								title: "",
								text: "파이프라인 생성에 실패하였습니다.",
								confirmButtonText: "확인"
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



/**
 * 공공 파이프라인을 이용한 파이프라인 생성 (인스턴스 파이프라인) 
 */
function pipeDesign_createInstancePipeline(newPipelineData) {
		
	var data = newPipelineData;
	if ( !data ) {
		/** 입력 값 검증 */
		if(!pipeDesign_PipelineValidateCreate()) {
			return;
		}
		const publicPipelineRawId = $("#pipelineList option:selected").val(); 
		const workspaceId = $("#pipeParentWsId").val().trim();
		const workspaceName = $("#pipeParentWsName").val().trim();	
		const pipelineName = $("#pipelineName").val().trim();
		const pipelineDesc = $("#pipelineDesc").val().trim();
		const pipelineKeywords = $("#pipelineKeywords").val().trim();
		const pipelineVersion = $("#pipelineVersion").val().trim();
		const pipelineReference = $("#pipelineReference").val().trim();
	
		data = {
			"pupblic_pipeline_rawId" : publicPipelineRawId,
			"workspace_id" : workspaceId,
			"workspace_name" : workspaceName,
			"pipeline_name" : pipelineName,
			"pipeline_desc" : pipelineDesc,
			"pipeline_keyword" : pipelineKeywords,
			"pipeline_version" : pipelineVersion,
			"pipeline_reference" : pipelineReference					
		};
	}


	swal({
		title: "",
		text: "파이프라인을 생성하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "생성"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/create_pipeline_instance",
					data : data,
					async: false, 
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "생성되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
								console.log(data.result_msg);		
								
////								location.href = get_context_path() + "/execute/execute";
//								var rawIdStr = "";										
//								if ( utils_isEmptyToDefStr($("#rawId").val(),"") != "" ) {
//									rawIdStr = "?raw_id=" + $("#rawId").val();
//								}								
//								location.href = get_context_path() + "/execute/execute" + rawIdStr;
//								
								if ( $("#rawId").val() ) {
									$("#pipeline_info").find("input[name=raw_id]").val($("#rawId").val());
									$("#pipeline_info").find("input[name=pp_id]").val(data.result_msg);
									$("#pipeline_info").find("input[name=ws_id]").val($("#myWorkspace option:selected").val());
									$("#pipeline_info").action = get_context_path() + "/execute/execute";
									$("#pipeline_info").submit();	
								}
								else {
									isInstancePipeline = true;	// 공공 파이프라인을 이용한 파이프라인 생성하는 것처럼 	
									$("#pipeModiRawId").val(data.result_msg);	// 해당 아이디를 선택해 표출할 수 있도록
									getMemberWorkspace($("#pipeParentWsId").val().trim());
									closePopup();
									$("#pipeline-create").load(" #pipeline-create > *");	// 파이프라인 생성 팝업 데이터 초기화 
									getPipelineMainCategoryInExecute();
								}
								
							});
						}
						else{
																	
							swal({
								title: "",
								text: "파이프라인 생성에 실패하였습니다.",
								confirmButtonText: "확인"
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
/**
 * 파이프라인 수정
 */
function pipeDesign_updatePipeline() {

	/** 입력 값 검증 */
	if(!pipeDesign_PipelineValidateUpdate()) {
		return;
	}
	
	const workspaceId = $("#myWorkList option:selected").val();				// 상위 워크스페이스 아이디		
	const workspaceName = $("#myWorkList option:selected").attr('name');		// 상위 워크스페이스 이름
	const pipelineName = $("#pipelineNameUpdate").val().trim();				// 파이프라인 이름
	const pipelineDesc = $("#pipelineDescUpdate").val().trim();				// 파이프라인 설명
	const pipelineKeywords = $("#pipelineKeywordsUpdate").val().trim();		// 파이프라인 키워드  
	const pipelineVersion = $("#pipelineVersionUpdate").val().trim();		// 파이프라인 버전
	const pipelineReference = $("#pipelineReferenceUpdate").val().trim();	// 파이프라인 참조
	const pipelineRawId = $("#pipeModiRawId").val().trim();				// 파이프라인 rawID

	data = {
		"pipeline_rawId" : pipelineRawId,		
		"workspace_id" : workspaceId,
		"workspace_name" : workspaceName,		
		"pipeline_name" : pipelineName,
		"pipeline_desc" : pipelineDesc,
		"pipeline_keyword" : pipelineKeywords,
		"pipeline_version" : pipelineVersion,
		"pipeline_reference" : pipelineReference					
	};
	
	
	// 현재 활성화된 파이프라인과 수정할 파이프라인이 같은 경우 
	if ( $("#pipelineNavId").val() == pipelineRawId ) {

		swal({
			title: "",
			text: "파이프라인 노드 정보를 저장 후 수정하시겠습니까?",
			showCancelButton: true,
			showCloseButton: true,
			cancelButtonText: "기본 정보만 수정",
			confirmButtonText: "저장 후 수정"
		}).then(function(result) {
			
			// close button click
			if ( result == undefined ) {
				return false;
			}
			
			// 노드 정보 우선 저장 
			if ( result ) {
				pipeDesign_savePipeline_force();
			}
			
			$.ajax({
				type : "POST",
				url : get_context_path() + "/pipedesign/update_pipeline",
				data : data,
				success : function(data){
										
					if(data.result_stat == "STAT_OK"){
						swal({
							title: "",
							text: "수정되었습니다.",
							confirmButtonText: "확인"
						}).then(function() {	
							console.log(data.result_msg);
							
							isInstancePipeline = true;	// 공공 파이프라인을 이용한 파이프라인 생성하는 것처럼 			
							$("#pipeModiRawId").val(pipelineRawId);	// 해당 아이디를 선택해 표출할 수 있도록
							getMemberWorkspace(workspaceId);
							closePopup();		
						});
					}
					else{
																
						swal({
							title: "",
							text: "파이프라인 정보 수정에 실패하였습니다.",
							confirmButtonText: "확인"
						});
					}
				},
				error : function(e) {
				},
				beforeSend : function(){
				}
			});
		
		});	
		
		
	}
	// 현재 활성화된 파이프라인과 수정할 파이프라인이 다른 경우 (origin code)
	else {
		
		swal({
			title: "",
			text: "파이프라인 정보를 수정하시겠습니까?",
			showCancelButton: true,
			cancelButtonText: "취소",
			confirmButtonText: "수정"
		}).then(function(result) {
			if (result) {
				
					$.ajax({
						type : "POST",
						url : get_context_path() + "/pipedesign/update_pipeline",
						data : data,
						success : function(data){
												
							if(data.result_stat == "STAT_OK"){
								swal({
									title: "",
									text: "수정되었습니다.",
									confirmButtonText: "확인"
								}).then(function() {	
									console.log(data.result_msg);
									
									isInstancePipeline = true;	// 공공 파이프라인을 이용한 파이프라인 생성하는 것처럼 			
									$("#pipeModiRawId").val(pipelineRawId);	// 해당 아이디를 선택해 표출할 수 있도록
									getMemberWorkspace(workspaceId);
									closePopup();	
//	//								location.href = get_context_path() + "/execute/execute";
								});
							}
							else{
																		
								swal({
									title: "",
									text: "파이프라인 정보 수정에 실패하였습니다.",
									confirmButtonText: "확인"
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
	
}
/**
 * 파이프라인 삭제
 */
function pipeDesign_deletePipeline() {
		
	const pipelineRawId = $("#pipeModiRawId").val().trim();		// 파이프라인 rawID
	const workspaceId = $("#clickWorkspaceId").val().trim();	// 워크스페이스 workspaceID
	data = {
		"pipeline_rawId" : pipelineRawId				
	};
		
	swal({
		title: "",
		text: "파이프라인을 삭제하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "삭제"
	}).then(function(result) {
		if (result) {
		
			$.ajax({
				type : "POST",
				url : get_context_path() + "/pipedesign/delete_pipeline",
				data : data,
				success : function(data){
										
					if(data.result_stat == "STAT_OK"){
						swal({
							title: "",
							text: "삭제되었습니다.",
							confirmButtonText: "확인"
						}).then(function() {	
							console.log(data.result_msg);		
							
							
							isInstancePipeline = true;	// 공공 파이프라인을 이용한 파이프라인 생성하는 것처럼 
							 $("#pipeModiRawId").val("");			
							getMemberWorkspace(workspaceId);
							
							// 현재 활성화된 파이프라인인 경우 화면 초기화 시켜줘야함.
							if ( !$("#pipelineNavId").val() || pipelineRawId == $("#pipelineNavId").val() ) {
								currentPipeline = null;
								runTaskInfo.pipeline_rawID = "";
								clear();		
							}
							
							closePopup();
						});
					}
					else{
																
						swal({
							title: "",
							text: "파이프라인 삭제에 실패하였습니다.",
							confirmButtonText: "확인"
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


/*
	태스크 관련
	1. function pipeDesign_runTask() : 태스크 실행 (파이프라인 RUN)
	2. function pipeDesign_stopTask() : 태스크 정지 (파이프라인 STOP)
		
*/



/**
 * 태스크 실행 (디자인된 파이프라인 실행) 
 */
function pipeDesign_runTask() {
			
	/** 파이프라인 활성화 여부 확인 */	
	if(!isEnabledPipeline()) {
		alertPopup("", "파이프라인을 활성화 해주세요.", "확인", "닫기", false)
		return;	
	}
		
	/** 노드 정보가 없을 경우 노드 추가 경고창 */
	if(getNodeCount() <= 0) {
		alertPopup("", "노드를 추가해주세요.", "확인", "닫기", false)
		return;	
	}
	
	/** 실행 시 항상 파이프라인을 저장한다. */
	// pipeDesign_savePipeline();	
	pipeDesign_savePipeline_force();
	
					
	data = {		
		"pipeline_rawId" : runTaskInfo.pipeline_rawID							
	};
		
	swal({
		title: "",
		text: "파이프라인을 실행하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "실행"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/run_task",
					data : data,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "실행되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
						
								console.log(data.result_msg);		
						
								/** 실행 버튼 숨김, 정지 버튼 활성화 */
								setStopBtn();
	
		
								initRunTaskInfo("save", data.result_msg, runTaskInfo.workspace_name, runTaskInfo.pipeline_rawID);
								 
								
								showWorkspacePipelineInfo(null, runTaskInfo.pipeline_rawID);
								
							});
						}else if(data.result_stat == "STAT_OK_WITH_MSG") {
							swal({
								title: "",
								text: "파이프라인이 이미 실행중입니다.",
								confirmButtonText: "확인"
							}).then(function() {	
						
								console.log(data.result_msg);		
						
								/** 실행 버튼 숨김, 정지 버튼 활성화 */
								setStopBtn();
											
								initRunTaskInfo("save", data.result_msg, runTaskInfo.workspace_name, runTaskInfo.pipeline_rawID);
								 
								
								showWorkspacePipelineInfo(null, runTaskInfo.pipeline_rawID);
								
							});
						}
						else{
																	
							swal({
								title: "",
								text: "파이프라인 실행에 실패하였습니다.",
								confirmButtonText: "확인"
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

/**
 * 태스크 정지 (실행중인 파이프라인 정지) 
 */
function pipeDesign_stopTask() {
	
	/** 파이프라인 활성화 여부 확인 */	
	if(!isEnabledPipeline()) {
		alertPopup("", "파이프라인을 활성화 해주세요.", "확인", "닫기", false)
		return;	
	}
		
	/** 파이프라인 디자인 변경 여부 확인 */
	if(isModified()) {		
		pipeDesign_savePipeline();	
	}	
	
	/** 노드 정보가 없을 경우 노드 추가 경고창 */
	if(getNodeCount() <= 0) {
		alertPopup("", "노드를 추가해주세요.", "확인", "닫기", false)
		return;	
	}
	
					
	data = {		
		"pipeline_rawId" : runTaskInfo.pipeline_rawID							
	};
		
	swal({
		title: "",
		text: "파이프라인을 실행을 정지하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "정지"
	}).then(function(result) {
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/stop_task",
					async : true,
					data : data,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "정지되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
						
								console.log(data.result_msg);		
					
								/** 실행 버튼 숨김, 정지 버튼 활성화 */
								setRunBtn();	
								initRunTaskInfo("save", data.result_msg, runTaskInfo.workspace_name, runTaskInfo.pipeline_rawID);								 							
								showWorkspacePipelineInfo(null, runTaskInfo.pipeline_rawID);							
							});
						}
						else{
																	
							swal({
								title: "",
								text: "파이프라인 실행 정지에 실패하였습니다.",
								confirmButtonText: "확인"
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


/**
 * 태스트 새로고침  
 */
function pipeDesign_refreshTask() {
					
	if ( !isEnabledPipeline() ) {
		alertPopup("", "파이프라인을 활성화 해주세요.", "확인", "닫기", false);
		return;
	}	
						
	swal({
		title: "",
		text: "데이터를 최신화합니다.",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "확인"
	}).then(function(result) {
		if (result) {
			
			isRefresh = true;
			/** 파이프라인 활성화 여부 확인 */	
			if(isEnabledPipeline()) {
				showWorkspacePipelineInfo(null, runTaskInfo.pipeline_rawID);
			}else {
				location.href = get_context_path() + "/execute/execute";
			}											
		} 
		else {
			return false;
		}
	});	
	
}


/*
 *	노드 관련
 */

//function pipeDesign_createNode(el,scriptType) {
//	
//	alert('pipeDesign_createNode()');		
//	
//	/** 신규 노드명 */
//	const createNodeName = pipeDesign_createNodeName('#pipeline_con', $(el).text());
//	/** 프로그램 rawID */
//	const programRawId = $(el).attr("id");
//		
//	data = {		
//		"pipeline_rawId" : runTaskInfo.pipeline_rawID,
//		"program_rawId" : programRawId,
//		"create_nodeName" : createNodeName								
//	};
//		
//	$.ajax({
//		type : "POST",
//		url : get_context_path() + "/pipedesign/create_node",
//		async : true,	// true : 비동기(default), false(동기)
//		data : data,
//		success : function(data){
//											
//			if(data.result_stat == "STAT_OK"){
//											
//				/** 
//				 * data.result_msg == nodeModel == 프로그램 정보가 정상적으로 설정된 경우				 				
//				 */	
//				 
//				// console.log('pipeDesign_createNode() : /pipedesign/create_node : 성공(success : STAT_OK) ')
//				// console.log(data);
//				 
//				 				 				 				 	
//				 /**
//				  * [참고]
//				  * 
//				  * 1. pipeline_data.node 
//				  * == PipelineModel.node 
//				  * == List<NodeModel> node 
//				  * == 현재 페이지에서 관리하고 있는 노드모델 배열				
//				  * 
//				  * 2. data.result_msg
//				  * == NodeModel
//				  * 
//				  * 3. pipeline_data : 전역변수			  				
//				  */
//
////				  
//				  /**
//				   * PipelineModel 모델 설정
//				   */
//				  
//				  /** pipeline_data.node(리스트)의 마지막에 신규 생성된 노드 정보 추가 */
//				  const nodeLength = pipeline_data.node.length
//				  pipeline_data.node[nodeLength] = data.result_msg;
//				  				  
//				  // 플로우차트 화면(디자인 화면, 모눈종이 화면)에 표시될 노드 정보 출력
//				  console.log('[::::::: 노드 정보(pipeline_data.node) ::::::::::]');
//				  console.log(pipeline_data.node);
//				  				  				  				
//				  /**
//				   * jquery.flowchart.js의 operator(노드, 연산자) 설정, 디자인 관점에서 노드를 연산자로 명명함.
//				   */
//				   
//				   				  
//				   /** 연산자 객체 생성 */
//				   var operatorData = {
//						top: 0,
//						left: 0,
//						properties: {
//							title: "",
//							inputs: {},
//							outputs: {}
//						}
//					};
//				   
//				   				   
//				   /** 연산자 title 설정 */
//				   let operatorTitle = pipeline_data.node[nodeLength].nodeData.nodeName;				   				  
//				   operatorData.properties.title = operatorTitle;
//				   				   
//				   /** 연산자 위치 : y축 값 */
//				   let operatorTop = 60;
//				   operatorData.top = operatorTop;
//				   
//				   /** 연산자 위치 : x축 값 */
//				   let operatorleft = 500;
//				   operatorData.left = operatorleft;
//				   				   				   				  				   				   				   				   				   				   				   	
//				   /** 연산자 inputs 설정 */
//				   $.each(pipeline_data.node[nodeLength].parameter.parameterInput, function(input_index, input){
//						let inputParamNm = input.parameterName.replace(/ /gi, "_").replace(/\./gi, "_");
//						operatorData.properties.inputs[operatorTitle + "|" + inputParamNm] = {};
//						operatorData.properties.inputs[operatorTitle + "|" + inputParamNm].label = input.parameterName;
//					});				   				   							
//				   
//				   /** 연산자 outputs 설정 */
//				   $.each(pipeline_data.node[nodeLength].parameter.parameterOutput, function(input_index, output){
//						let outputParamNm = output.parameterName.replace(/ /gi, "_").replace(/\./gi, "_");
//						operatorData.properties.outputs[operatorTitle + "|" + outputParamNm] = {};
//						operatorData.properties.outputs[operatorTitle + "|" + outputParamNm].label = output.parameterName;
//					});
//														
//					console.log('[::::::: 연산자 정보(operatorData) ::::::::::]');
//				  	console.log(operatorData);
//				  					  											   				  		
//				   /** 연산자 객체를 플로우차트화면에 추가 */				   
//				   $("#pipeline_con").flowchart('createOperator', operatorTitle, operatorData);				   
//				   				   
//				   /** css 클래스 적용 / 스크립트타입 추가 */
//				   let operatorScriptType = pipeline_data.node[nodeLength].nodeData.scriptType;
//				   $("#pipeline_con").flowchart('addClassOperator', operatorTitle, operatorScriptType);									
//			}
//									
//			else{
//				console.log('pipeDesign_createNode() : /pipedesign/create_node : 성공(success : STAT_ERR) ')
//				console.log(data);
//			}
//		},
//		error : function(e) {
//			// 실패 후 로직
//			console.log('pipeDesign_createNode() : /pipedesign/create_node : 실패(error) ')
//			
//		},
//		beforeSend : function(){
//			// Ajarx가 서버에 요청하기 전에 실행하는 로직 (e.g 로딩바 실행)
//			// console.log('pipeDesign_createNode() : /pipedesign/create_node : 준비(beforeSend) ')
//		},
//		complete: function() {
//			// 성공, 실패 여부와 관계 없이 무조건 실행됨 (e.g 로딩바 제거)
//			// console.log('pipeDesign_createNode() : /pipedesign/create_node : 완료(complete) ')
//		}
//	});				
//}


function pipeDesign_createNode(el) {
				
	/** 신규 노드명 */
	const createNodeName = pipeDesign_createNodeName('#pipeline_con', $(el).text());
	/** 프로그램 rawID */
	const programRawId = $(el).attr("id");
		
	data = {		
		"pipeline_rawId" : runTaskInfo.pipeline_rawID,
		"program_rawId" : programRawId,
		"create_nodeName" : createNodeName								
	};
		
	$.ajax({
		type : "POST",
		url : get_context_path() + "/pipedesign/create_node",
		async : true,	
		data : data,
		success : function(data){
											
			if(data.result_stat == "STAT_OK"){
																										
				/**
				 * PipelineModel 모델 설정
				 */
				
				/** pipeline_data.node(리스트)의 마지막에 신규 생성된 노드 정보 추가 */
				const nodeLength = pipeline_data.node.length
				pipeline_data.node[nodeLength] = data.result_msg;
				
				let newNodeInfo = pipeline_data.node[nodeLength];
									
				/** 연산자 속성 정보 - 연산자 title */
				const operatorTitle = newNodeInfo.nodeData.nodeName;				
																			   				
				   /** 연산자 객체 생성 */
				   var opData = {
						top: 60,							// 연산자 위치 : y축 값
						left: 500,							// 연산자 위치 : x축 값
						properties: {							
							title: operatorTitle, 			// 연산자 속성 정보 - 연산자 title 설정
							inputs: {},						// 연산자 속성 정보 - 연산자 inputs 설정
							outputs: {}						// 연산자 속성 정보 - 연산자 outputs 설정
						}
					};

				   /** 연산자 inputs 설정 : input_index 반드시 필요(없을 경우 에러 발생) */
				   $.each(newNodeInfo.parameter.parameterInput, function(input_index, input){
						let inputParamNm = input.parameterName.replace(/ /gi, "_").replace(/\./gi, "_");
						opData.properties.inputs[operatorTitle + "|" + inputParamNm] = {};
						opData.properties.inputs[operatorTitle + "|" + inputParamNm].label = input.parameterName;
					});				   				   							
				   
				   /** 연산자 outputs 설정 : output_index 반드시 필요(없을 경우 에러 발생) */
				   $.each(newNodeInfo.parameter.parameterOutput, function(output_index, output){
						let outputParamNm = output.parameterName.replace(/ /gi, "_").replace(/\./gi, "_");
						opData.properties.outputs[operatorTitle + "|" + outputParamNm] = {};
						opData.properties.outputs[operatorTitle + "|" + outputParamNm].label = output.parameterName;
					});
																						   				  	
				   /** 연산자 객체를 플로우차트화면에 추가 */				   
				   $("#pipeline_con").flowchart('createOperator', operatorTitle, opData);				   
				   				   
				   /** css 클래스 적용 / 스크립트타입 추가 */
				   let operatorScriptType = newNodeInfo.nodeData.scriptType;
				   $("#pipeline_con").flowchart('addClassOperator', operatorTitle, operatorScriptType);									
			}else{

			}
		},
		error : function(e) { },								
		beforeSend : function(){},
		complete: function() {}
	});				
}




/**
 * 노드명 생성
 * 1) 프로그램명을 기본 노드명으로 한다.
 * 2) 노드명이 존재할 경우 두 번째 노드명부터 1을 시작으로 카운팅하며 생성한다.
 * e.g : K-Means / K-Means1 / K-Means2 / K-Means3 ...
 */
function pipeDesign_createNodeName(flowChartDiv, nodeName) {
		 
	 let nodeNmNew = '';
	 let idx = 0;
	 let isExist = true;
	
	 while(isExist) {
								
		/** 노드명 존재 여부 확인 */		
		if(idx == 0) {
			nodeNmNew = nodeName;			
		}else {
			nodeNmNew = nodeName + idx;	
		}					
		isExist = $(flowChartDiv).flowchart('doesOperatorExists', nodeNmNew);
		
		if(!isExist) {
			break;
		}
		
		idx++;						
	 }
	 
	 return nodeNmNew;	 
	
}



/*
	링크 관련
	- 링크 생성 로직 정리
	
	1. 세팅 정보
	 가. PipelineModel.LinkModel
	 나. PipelineModel.NodeModel.ParameterModel.ParameterDataModel(output).targetParamName[] : String 배열
	  - 시작노드의 ouput ParameterDataModel에 끝 노드의 어느 커넥터에 연결할지를 링크 정보로 설정해주는 작업
	 다. PipelineModel.NodeModel.ParameterModel.ParameterDataModel(input).sourceParamName : String
	  - 시작노드의 input ParameterDataModel에 시작 노드의 어느 커넥터에서 연결되었는지를 링크 정보로 설정해주는 작업
	  - 시작노드(이전노드)의 output 커넥터는 1개뿐이므로 현재노드(끝노드)의 sourceParamName은 배열이 아니다.
*/

function pipeDesign_createLink(linkData) {
				
	let linkModel = {};
	
	/** 링크의 시작점 노드명 */
	linkModel.sourceName = linkData.fromOperator;
	/** 링크의 끝점 노드명 */
	linkModel.targetName = linkData.toOperator;	
	
	$.ajax({
		type : "POST",
		url : get_context_path() + "/pipedesign/create_link",
		async : false,		// 동기 방식(true로 설정 시 비동기 방식으로 되면서 설정되지 않은 데이터가 링크에 추가될 수 있음)
		data : linkModel,
		success : function(data){
								
			/** 링크 정보 설정 실패 : null 리턴 */
			if(data.result_stat != "STAT_OK"){				
				return null;
			}																															
											
			linkModel = data.result_msg;
						
			/**
			 * 시작 노드와 시작 링크 정보 설정
			 */
			 
			 /**
			  * 노드 구성이 아래와 같을 때 :  
			  * [1번노드] - [2번노드]
			  *
			  * 링크의 시작 정보를 활용하여 [1번노드]의 output 커넥터가 [2번노드]의 어떤 input 커넥터에 연결되는지 정보를 설정한다.
			  * - PipelineModel.NodeModel.ParameterModel.ParameterDataModel(output).targetParamName[]
			  */
			  			 			 						
			 var inputStr = "";																																									
			$.each(pipeline_data.node, function(node_index, node){
																								
				/** (노드명 == 링크의 시작 연산자명) : 링크의 시작 노드 */ 
				if(node.nodeData.nodeName == linkData.fromOperator){
														
					/**
				 	 * 링크 모델 정보 설정 : sourceID == 시작 노드 ID == node.nodeID
				 	 */				
					linkModel.sourceID = node.nodeID;
																														   		
					/** 1번 노드의 paramterOutput은 항상 1개 밖에 없기 때문에 pipeline_data.node[node_index].parameter.parameterOutput[0]는 0인덱스로 고정 */													
					if(pipeline_data.node[node_index].parameter.parameterOutput[0].targetParamName == null) {
						pipeline_data.node[node_index].parameter.parameterOutput[0].targetParamName = new Array();	
					} 					
					let tParamSize = pipeline_data.node[node_index].parameter.parameterOutput[0].targetParamName.length;																							
					pipeline_data.node[node_index].parameter.parameterOutput[0].targetParamName[tParamSize] = linkData.toConnector.replace(/\|/gi, ":")					
					pipeline_data.node[node_index].parameter.parameterOutput[0].nodeID = node.nodeID;
					
					inputStr = pipeline_data.node[node_index].parameter.parameterOutput[0].parameterValue;													
				}
			});
				
			/**
			 * 종료 노드와 종료 링크 정보 설정
			 */	
			 			
			/**
			 * 노드 구성이 아래와 같을 때 :  
			 * [1번노드] - [2번노드]
			 *
			 * 링크의 종료 정보를 활용하여 [2번노드]의 input 커넥터가 [1번노드]의 어떤 output 커넥터에 연결되는지 정보를 설정한다.
			 * - PipelineModel.NodeModel.ParameterModel.ParameterDataModel(input).sourceParamName
			*/ 			
			 			
			$.each(pipeline_data.node, function(node_index, node){
																								
				/** (노드명 == 링크의 종료 연산자명) : 링크의 종료 노드 */ 
				if(node.nodeData.nodeName == linkData.toOperator){
														
					/**
				 	 * 링크 모델 정보 설정 : targetID == 종료 노드 ID == node.nodeID
				 	 */				
					linkModel.targetID = node.nodeID;
																										
				    /**
					* 종료 노드의 커넥터 정보 입력
					* - 전제 1. 종료 노드의 input 파라미터 중 첫 번째 파라미터는 파일형식
					* - 전제 2. 종료 노드의 input 파라미터 중 첫 번째를 제외한 나머지 파라미터는 디렉토리 형식
					* - 전제 3. 링크의 끝점은 종료노드의 파일형식 커넥터에만 연결 가능
					* - 로직 1. 전제 1,2,3에 의해 링크의 끝점은 종료 노드의 첫 번째 파라미터에 무조건 매칭
					* 			
					*/
				
					let paramLength = pipeline_data.node[node_index].parameter.parameterInput.length;
					let connSplitStr = linkData.toConnector.split('|')[1];					
					
					for(let i = 0; i < paramLength; i++) {
						
						// 2번 노드의 파라미터 input의 각 커넥터별(파라미터별) nodeID 설정
						pipeline_data.node[node_index].parameter.parameterInput[i].nodeID = node.nodeID;
												
						// 2번 노드의 파라미터 input의 커넥터들(파라미터들)중 링크의 끝점 노드의 커텍터이름(linkData.toConnector.split('|')[1])과 같으면
						if(pipeline_data.node[node_index].parameter.parameterInput[i].parameterName == connSplitStr) {
							//2번 노드의 input 파라미터의 해당 커넥터에 1번 노드의 output 파라미터의 커넥터 정보	(linkData.fromConnector)를 설정한다.						
							pipeline_data.node[node_index].parameter.parameterInput[i].sourceParamName = linkData.fromConnector.replace(/\|/gi, ":");
							if ( inputStr ) {
								pipeline_data.node[node_index].parameter.parameterInput[i].parameterValue = inputStr;	
								$("#input" + node_index + "0Value").val(inputStr);
							}
						}											
					}																																
				}
			});	 				 				
					
				 
				 
				 
				 
				/* 
				 				 							
				if(node.nodeData.nodeName == linkData.fromOperator){
					console.log('linkData.fromOperator : ' + linkData.fromOperator);
					console.log('linkData.fromConnector : ' + linkData.fromConnector);												
					
					// 링크 설정
					linkModel.sourceID = node.nodeID;									
					
					// 노드 파라미터 설정
					let paramLenght = pipeline_data.node[node_index].parameter.parameterInput.length;
					for(let i = 0; i < paramLenght; i++) {
						
						console.log('parameterInput[i].parameterName : ' + pipeline_data.node[node_index].parameter.parameterInput[i].parameterName);
						console.log('linkData.fromConnector : ' + linkData.fromConnector);
						let connSplitStr = linkData.fromConnector.split('|')[1];
						console.log('connSplitStr : ' + connSplitStr);
																	
						if(pipeline_data.node[node_index].parameter.parameterInput[i].parameterName == connSplitStr) {							
							pipeline_data.node[node_index].parameter.parameterInput[i].sourceParamName = linkData.fromConnector;
							pipeline_data.node[node_index].parameter.parameterInput[i].targetParamName = 'NA';
							break;								
						}						
					}
				}
				if(node.nodeData.nodeName == linkData.toOperator){
					console.log('linkData.fromOperator : ' + linkData.toOperator);
					console.log('linkData.toConnector : ' + linkData.toConnector);
										
					// 링크 설정
					linkModel.targetID = node.nodeID;
							
					// 노드 파라미터 설정
					let paramLenght = pipeline_data.node[node_index].parameter.parameterOutput.length;
					for(let i = 0; i < paramLenght; i++) {
						
						console.log('parameterOutput[i].parameterName : ' + pipeline_data.node[node_index].parameter.parameterOutput[i].parameterName);
						console.log('linkData.toConnector : ' + linkData.toConnector);
						let connSplitStr = linkData.toConnector.split('|')[1];
						console.log('connSplitStr : ' + connSplitStr);
						
						
						if(pipeline_data.node[node_index].parameter.parameterOutput[i].parameterName == connSplitStr) {							
							pipeline_data.node[node_index].parameter.parameterOutput[i].sourceParamName = 'NA';
							pipeline_data.node[node_index].parameter.parameterOutput[i].targetParamName = linkData.toConnector;
							break;								
						}						
					}														
				}
			});
				
			linkModel.setLinkID = true;
			linkModel.setSourceID = true;
			linkModel.setSourceName = true;
			linkModel.setTargetID = true;
			linkModel.setTargetName = true;
			*/
			
			/** 신규 링크 추가 */
			let linkLength = pipeline_data.link.length;																							
			pipeline_data.link[linkLength] = {};				
			pipeline_data.link[linkLength] = linkModel;
					
			return linkModel;
			
			/*
			let isExistLink = false;
			let isDupId = false;
			let isDupParamNm = false;			
			
			
			$.each(pipeline_data.link, function(link_index, link){										
				if(newLink.sourceID == link.sourceID && newLink.targetID == link.targetID) {
					isDupId = true;
				}																								
			});
			
					*/													
		},
		error : function(e) { return null;	},										 							
		beforeSend : function(){},
		complete: function() {}
	});
		
	return linkModel;				
}






/*
	저장 관련
	1. function pipeDesign_savePipeline()
	
*/

function pipeDesign_savePipeline() {
	
	/** 파이프라인 활성화 여부 확인 */
	if(!isEnabledPipeline()) {
		alertPopup("", "파이프라인을 활성화 해주세요.", "확인", "닫기", false);
		return;
	}
	
	/** 플로우차트에 그려진 노드(연산자, operator)의 정보를 획득한다. */	
	var data = $("#pipeline_con").flowchart('getData');	
	console.log(data);
		
	
	
	/** 
	 * DB에 저장할 수 있도록 PipelineModel(pipeline_data)를 설정한다.
	 * - 설정 정보
	 *  1. String rawID;						// 파이프라인 rawID  
	 *  2. List<NodeModel> node; 				// 노드(프로그램, 서브태스크, operator) 정보
	 *  3. List<LinkModel> link; 
	 *  4. PipelineDataModel pipelineData;
	 *  5. List<ShareModel> share; 
	 */
	 	 
	 	 
	 	 
	 /***********************************************
	  * 1. String rawID : 이미 설정되어 있음 
	  ***********************************************/
	 
	 
	 /***********************************************
	  * 2. List<NodeModel> node 
	  ***********************************************/
	 
	 /** 
	 * pipeline_data.node == PipelineModel.node ==  List<NodeModel> node
	 * 
	 * - NodeModel의 구성
	 *  String rawID;						// 사용 용도 확인 요망
	 *  String nodeID;						// TASK(파이프라인)에 종속적이며, 노드 생성 시 신규로 생성하여 설정한다. 노드를 여러번 실행하면 BX_SUB_TASK_TABLE(노드 실행 이력 테이블)에 동일한 nodeID로 여러 레코드가 추가된다.
	 *  NodeDataModel nodeData;
	 *  ParameterModel parameter;
	 */	
	 	
	 		 		 		 
	/** 플로우차트에 그려진 노드(연산자, operator)의 정보를 획득한다. */	
	 
	 /** flowChart에 그려진 노드 정보 루프를 돌며 좌표 값을 설정한다. */
	 $.each(data.operators, function(index, operator) {
				
		$.each(pipeline_data.node, function(node_index, node){
			if(operator.properties.title == node.nodeData.nodeName){
		
				node.nodeData.x = operator.left;
				node.nodeData.y = operator.top;
				node.nodeData.setX = true;
				node.nodeData.setY = true;
			}
		});
	});
				
	let pipelineModelStr = JSON.stringify(pipeline_data);	
	 	
	 	 	 	 	 	 
//	 /** flowChart에 그려진 노드 정보 루프를 돌며 좌표 값을 설정한다. */
//	 $.each(data.operators, function(index, operator) {
//				
//		$.each(pipeline_data.node, function(node_index, node){
//			
//			if(operator.properties.title == node.nodeData.nodeName){
//		
//				node.nodeData.x = operator.left;
//				node.nodeData.y = operator.top;
//				node.nodeData.setX = true;
//				node.nodeData.setY = true;
//			}
//		});
//	});
	
	
	
	
	/***********************************************
	 * 3. List<LinkModel> link
	 ***********************************************/
	 
	 /** 
	 * pipeline_data.link == PipelineModel.link ==  List<LinkModel> link
	 * 
	 * - LinkModel의 구성
	 *  String linkID;					
	 *  String sourceID;					
	 *  String targetID;
	 *  String sourceName;
	 *  String targetName;
	 */	
	
	/**
	 * 링크 생성 시 아래 순서에 따라 링크 정보가 설정된다.
	 * 0) onLinkCreate: function (linkId, linkData) : true를 리턴 시키도록 설정 되어 있다는 전제하에 아래 동작 실행
	 * 1) jquery.flowchart.js : createLink()
	 * 2) pipeline_full.js : onLinkCreate() 
	 *  -> 전역변수로 설정되어 있는 pipeline_data.link(리스트)에 신규 링크 정보를 추가
	 */

	/***********************************************
	 * 4. 컨트롤 단에 넘길 수 있도록 PipelineModel로 객체 구성
	 ***********************************************/
	console.log('::::::::::: pipeDesign_savePipeline 1 ::::::::::::::'); 
	console.log(pipeline_data);

//	let pipelineModelStr = JSON.stringify(pipeline_data);
	
	let sendData = {
		pipelineModelStr : pipelineModelStr
	};

	swal({
		title: "",
		text: "작업중인 파이프라인을 저장하시겠습니까?",
		showCancelButton: true,
		showCloseButton: true,
		cancelButtonText: "저장안함",
		confirmButtonText: "저장"
	}).then(function(result) {
		
		if ( result == undefined ) return false;
		if (result) {
			
				$.ajax({
					type : "POST",
					url : get_context_path() + "/pipedesign/save_pipeline",
					async : false,
					data : sendData,
					success : function(data){
											
						if(data.result_stat == "STAT_OK"){
							swal({
								title: "",
								text: "저장되었습니다.",
								confirmButtonText: "확인"
							}).then(function() {	
								
								// 태스크 상태 -> 저장됨으로 변경
								setTaskStat_save();
								console.log(data.result_msg);		
								// location.href = get_context_path() + "/execute/execute";
								isRefresh = true;
								showWorkspacePipelineInfo(null, pipeline_data.rawID);
								// pipeline_data.rawID
							});
						}
						else{
																	
							swal({
								title: "",
								text: "파이프라인 저장에 실패하였습니다.",
								confirmButtonText: "확인"
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

function pipeDesign_savePipeline_force() {
	
	
	
	
	
		
				
		/** 플로우차트에 그려진 노드(연산자, operator)의 정보를 획득한다. */	
		var data = $("#pipeline_con").flowchart('getData');	
		 /** flowChart에 그려진 노드 정보 루프를 돌며 좌표 값을 설정한다. */
		 $.each(data.operators, function(index, operator) {
					
			$.each(pipeline_data.node, function(node_index, node){
				if(operator.properties.title == node.nodeData.nodeName){
			
					node.nodeData.x = operator.left;
					node.nodeData.y = operator.top;
					node.nodeData.setX = true;
					node.nodeData.setY = true;
				}
			});
		});
					
		let pipelineModelStr = JSON.stringify(pipeline_data);	
	 	
	
	
	
	
//	/** 플로우차트에 그려진 노드(연산자, operator)의 정보를 획득한다. */	
//	var data = $("#pipeline_con").flowchart('getData');	
//					 	 	 	 	
//	 /** flowChart에 그려진 노드 정보 루프를 돌며 좌표 값을 설정한다. */
//	 $.each(data.operators, function(index, operator) {
//				
//		$.each(pipeline_data.node, function(node_index, node){
//			
//			if(operator.properties.title == node.nodeData.nodeName){
//		
//				node.nodeData.x = operator.left;
//				node.nodeData.y = operator.top;
//				node.nodeData.setX = true;
//				node.nodeData.setY = true;
//			}
//		});
//	});
//	
//	
//	console.log('::::::::::: pipeDesign_savePipeline 2 ::::::::::::::'); 
//	console.log(pipeline_data);
//
//	let pipelineModelStr = JSON.stringify(pipeline_data);
	
	let sendData = {
		pipelineModelStr : pipelineModelStr
	};

	$.ajax({
		type : "POST",		
		async: false,
		url : get_context_path() + "/pipedesign/save_pipeline",					
		data : sendData,		
		success : function(data){
								
			if(data.result_stat == "STAT_OK"){
				swal({
					title: "",
					text: "저장되었습니다.",
					confirmButtonText: "확인"
				}).then(function() {	
					
					// 태스크 상태 -> 저장됨으로 변경
					setTaskStat_save();
					console.log(data.result_msg);		
					location.href = get_context_path() + "/execute/execute";
				});
			}
			else{
														
				swal({
					title: "",
					text: "파이프라인 저장에 실패하였습니다.",
					confirmButtonText: "확인"
				});
			}
		},
		error : function(e) {
		},
		beforeSend : function(){
		}
	});
		
}















// commone.js 사용하지 않으므로 필요한 메소드를 따로 모아둠.
// 랜덤으로 class 배정
function shuffle_class(index, type){

    var keyword_class = ["btn_keyword_green btn_keyword", "btn_keyword", "btn_keyword_gray btn_keyword", "btn_keyword_blue btn_keyword", "btn_keyword_red btn_keyword"];
    var pipeline_list_class = ["text", "text cr_red", "text cr_blue", "text cr_green", "text cr_violet"];
    var selected_class;
    var class_type;

    if(type == "keyword"){
        class_type = keyword_class;
    }else if (type == "pipeline_list"){
        class_type = pipeline_list_class;
    }

    switch (index % 5){
        case 0 :
            selected_class = class_type[0];
            break;
        case 1 :
            selected_class = class_type[1];
            break;
        case 2 :
            selected_class = class_type[2];
            break;
        case 3 :
            selected_class = class_type[3];
            break;
        case 4 :
            selected_class = class_type[4];
            break;
    }
    return selected_class;
}

// controller 별로 requestMapping이 부여되어 contextPath 필요
function get_context_path(){
	var host_index = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(host_index, location.href.indexOf('/', host_index + 1));
}




// Get Root Category 
// 파이프라인 생성 시 타입을 [공개 파이프라인] 선택한 경우, 대분류 리스트 가져오기 
function getPipelineMainCategoryInExecute() {

	$.ajax({
		url: get_context_path() + '/category/pipeline_main_category',
		type: 'POST',
		dataType: "Json",
		data: {
			"member_id": member_id
		},
		success: function(data) {
			
			// 초기 로딩박스 숨김
			$("#loadingBox").hide();

			if (data.pipeline_main_category_list.length > 0) {
				
				var rootCategoryList = "";
				$.each(data.pipeline_main_category_list, function(index, category) {
					rootCategoryList += "<option value=" + category.categoryID + ">" + category.categoryName + "</option>";
				});
				$("#rootCate").append(rootCategoryList);
				
			} 
		},
		error: function(e) {
		},
		beforeSend: function() {
			$("#rootCate").children('option:not(:first)').remove();
		}
	});
}

// 대분류(Root Category) change event
// project_execute.html > 파이프라인 생성 모달 > 공개 파이프라인 > 대분류 선택
function selectRootCategory() {
	var selectedRootCategory = $("#rootCate option:selected").val();
	if ( selectedRootCategory == "" ) {
		$("#subCate").children('option:not(:first)').remove();
		$("#pipelineList").children('option:not(:first)').remove();
		return;	
	}
	
	getPipelineSubCategory(selectedRootCategory);
}

// Get Sub Category
// project_execute.html > 파이프라인 생성 모달 > 공개 파이프라인 > 중분류 리스트 가져오기 
function getPipelineSubCategory(rootCategoryId) {
	
	$.ajax({
		url: get_context_path() + '/category/pipeline_sub_category',
		type: 'POST',
		dataType: "Json",
		data: {
			"root_pipeline_category_id": rootCategoryId,
			"member_id": member_id
		},
		success: function(data) {

			var subCategoryList = "";
			if (data.pipeline_sub_category_list.length > 0) {
				$.each(data.pipeline_sub_category_list, function(index, category) {
					subCategoryList += "<option value=" + category.categoryID + ">" + category.categoryName + "</option>";
				});
			} 
			$("#subCate").append(subCategoryList);
		},
		error: function(e) {

		},
		beforeSend: function() {
			$("#subCate").children('option:not(:first)').remove();
			$("#pipelineList").children('option:not(:first)').remove();
		}
	});
}

// 중분류(Sub Category) change event
// project_execute.html > 파이프라인 생성 모달 > 공개 파이프라인 > 중분류 선택 
function selectSubCategory() {
	var selectedSubCategory = $("#subCate option:selected").val();
	if ( selectedSubCategory == "" ) {
		$("#pipelineList").children('option:not(:first)').remove();
		return;
	}
	
	getPipelineBySubCategory(selectedSubCategory);
}

// project_execute.html > 파이프라인 생성 모달 > 공개 파이프라인 > 파이프라인 리스트 가져오기 
function getPipelineBySubCategory(subCategoryId) {
	
	$.ajax({
		url: get_context_path() + '/pipeline/pipeline_list_by_category',
		type: 'POST',
		dataType: "Json",
		data: {
			"pipeline_category_id": subCategoryId
		},
		success: function(data) {
			
			var pipelineList = "";
			if (data.pipeline_list.length > 0) {
				$.each(data.pipeline_list, function(index, pipeline) {
					pipelineList += "<option value=" + pipeline.rawID + ">" + pipeline.pipelineName + "</option>";
				});
			} 
			$("#pipelineList").append(pipelineList);
		},
		error: function(e) {

		},
		beforeSend: function() {
			$("#pipelineList").children('option:not(:first)').remove();
		}
	});
}

// 파이프라인 change event
// project_execute.html > 파이프라인 생성 모달 > 공개 파이프라인 > 파이프라인 선택  
function selectPipeline() {
	var selectedPipeline = $("#pipelineList option:selected").val();	
	if ( selectedPipeline == "" ) return;
}



// new_execute 에서 New Project 버튼 클릭시 
function createNewProject() {
	var url = get_context_path() + "/execute/execute";
	window.open(url, "_blank");
}


/** 2022.10.03, jhkim : 문자열 체크 : undefined, null, "" 일 경우 defaultStr을 리턴한다. */
function utils_isEmptyToDefStr(str, defaultStr) {
	
	if(typeof str == "undefined" || str == null || str == "") {
		str = defaultStr;
	}
	return str;
} 












/*******************************************************************************
 * 디자인 화면(프로그램)의 상태 제어 관련
 *******************************************************************************/


// 상태 제어 변수 : TASK 실행 정보 (파이프라인 실행 정보)
const runTaskInfo =  {	
	status : "save",								// save : 저장, modi : 수정사항 있음
	run_stat : "stop",								// run : 실행 중, stop : 정지
	workspace_name : "",							// 파이프라인의 상위 워크스페이스 이름		
	pipeline_rawID : ""								// 파이프라인 아이디	
}


function initRunTaskInfo(stat, rStat, workNm, pipeRawId) {
	
	runTaskInfo.status = stat;
	runTaskInfo.run_stat = rStat;
	runTaskInfo.workspace_name = workNm;
	runTaskInfo.pipeline_rawID = pipeRawId;
	
}

/** 태스크 상태 정보 설정 - 저장된 상태 : 실행 가능 */
function setTaskStat_save() {
	runTaskInfo.status = "save";
}
/** 태스크 상태 정보 설정 - 수정된 상태 : 실행 시 디자인된 정보를 저장 후 실행이 가능 */
function setTaskStat_modi() {
	runTaskInfo.status = "modi";
}
/** 태스크 상태 정보를 조회한다. */
function getTaskStat() {
	return runTaskInfo.status;
}


/** 태스크 실행 정보 설정 - 실행 상태 : 태스크 실행 후 해당 메소드를 호출한다. */
function setTaskRunStat_run() {
	runTaskInfo.run_stat = "run";
}
/** 태스크 실행 정보 설정 - 정지 상태 : 태스크 종료 후 해당 메소드를 호출한다. */
function setTaskRunStat_stop() {
	runTaskInfo.run_stat = "stop";
}
/** 태스트 실행 정보를 조회한다. */
function getTaskRunStat() {
	return runTaskInfo.run_stat;
}

/** 파이프라인 활성화 여부 확인 */
function isEnabledPipeline() {
	
	if(runTaskInfo.pipeline_rawID == "") {
		return false;	
	}	
	return true;
}

/** 수정 여부 확인 */
function isModified() {
	
	if(runTaskInfo.stat == "modi") {
		return true;	
	}	
	return false;
}

/** 노드 개수 확인  */
function getNodeCount() {
	return $("#pipeline_div").children("div").children("div").children().length;
}

/*
	title : 경고창 제목(?)
	msg : 경고 문구
	confBtn : 확인 버튼 글자
	cancelBtn : 취소 버튼 글자
	useCancel : 취소 버튼 사용 여부	
*/

function alertPopup(title, msg, confBtn, cancelBtn, useCancel) {
		
	title = utils_isEmptyToDefStr(title, "");
	msg = utils_isEmptyToDefStr(msg, "진행하시겠습니까?");
	useCancel = utils_isEmptyToDefStr(useCancel, false);	
	confBtn = utils_isEmptyToDefStr(confBtn, "확인");
	cancelBtn = utils_isEmptyToDefStr(cancelBtn, "닫기");
	
	
	swal({
		title: title,
		text: msg,
		showCancelButton: useCancel,
		cancelButtonText: cancelBtn,				
		confirmButtonText: confBtn
	}).then(function(result) {
		if (result) {
			return true;
		} 
		else {
			return false;
		}
	});
	
		
}


/**
	실행 / 종료 버튼 컨트롤
 */
 
function setRunBtn() {
	
	isRefresh = true;			
	/** 정지 버튼 숨김, 실행 버튼 활성화 */
	$("#taskRun").removeClass("Dis_none");
	$("#taskStop").removeClass("Dis_none");
	$("#taskStop").addClass("Dis_none");
	
}

function setStopBtn() {
	
	isRefresh = true;
	/** 실행 버튼 숨김, 정지 버튼 활성화 */
	$("#taskRun").removeClass("Dis_none");
	$("#taskStop").removeClass("Dis_none");
	$("#taskRun").addClass("Dis_none");
}

// 팝업의 닫기 버튼을 직접 누르지 않고, ajax 이후 닫아주기 위함.
function closePopup() {
	$(".layer_pop_close").trigger("click");
}

function closeBrowser() {
	window.close();
} 