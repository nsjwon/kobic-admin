$(function() {
	
});

// 클릭
$(function() {	
	// 팝업관리 클릭 (팝업 게시글 상세보기 이동)	
	$(document).on("click", ".brd_list", function(e) {			
		var rawId = $(e.currentTarget).find("#popupRawId").val();
		location.href = encodeURI("popup_detail?raw_id=" + rawId);
	});	
});

// 팝업관리 페이징
function popupPaging(pageNo, sort) {
	
	alert(pageNo);
	alert(sort);
	
	// 정렬 값 미지정 시 디폴트값 지정
	if(typeof sort == "undefined" || sort == null || sort == "") {
		sort = "instDt";
	}

	var data = { 			
		page_no: pageNo,
		sorting: sort,
		"popupSearchCategory": $("#popupSearchCategory option:selected").val(),
		"popupSearchWord" : $("#popupSearchWord").val(), 		
	};
	$.ajax({
		type: "post",
		url: "popup_paging",
		data: data,
		success: function(response) {
			$("#popup_fragment").replaceWith(response);
		}
	});
}


// validation
$(function() {

	// 팝업 게시물 등록 validate
//	$("#popup_form").validate({
	$("form[name=popup_form]").validate({
		rules: {
			titleMain: {
				required: true,
        		rangelength: [1, 30]
			},
			contentMain: {
				required: true,
        		rangelength: [1, 50]
			}
		}, 
		messages: {
			titleMain: {
				required: "Title을 입력해주세요."
			},
			contentMain: {
				required: "Sub Content를 입력해주세요."
			}
		},
		submitHandler: function(form) {
			
			// 수정시 날짜 인코딩 필요!!!!!!! 
			var startDate = $("#brdDateSt").val();
			var startDateTime = $("#brdDateStH option:selected").val() + ":" + $("#brdDateStM option:selected").val();
//			$("#stDt").val(encodeURIComponent(startDate + ", " + startDateTime));
			$("#stDt").val(startDate + ", " + startDateTime);
			
			var endDate = $("#brdDateEd").val();
			var endDateTime = $("#brdDateEdH option:selected").val() + ":" + $("#brdDateEdM option:selected").val();
//			$("#edDt").val(encodeURIComponent(endDate + ", " + endDateTime));
			$("#edDt").val(endDate + ", " + endDateTime);
			
			var data = $("#popup_form").serialize();
			var url = "do_popup_write";
			var msg = "등록하시겠습니까?";
			if ( $(form).attr("id").indexOf("modify") > -1  ) {
				data = $("#popup_modify_form").serialize();
				url = "do_popup_modify";
				msg = "수정하시겠습니까?";
			}
			
			swal({
				title: "",
				text: msg,
				showCancelButton: true,
				confirmButtonText: "확인",
				cancelButtonText: "취소",
			}).then(function(result) {
				if (result) {
					$.ajax({
						type : 'POST',
						data : data,
						dataType : "json",
						url : url,
						success: function(data) {
						
							if ( data.result == 1 ) {
								location.href = "popup";
							}
							
						}
					});
				} 
				else {
					return false;
				}
			});
			
		}, 
		errorElement: "span",
	    errorPlacement: function(error, element){
			error.addClass("error_txt");
			error.appendTo(element.parent("div"));
	    } 
	});
	
})
//
//// 팝업 게시물 등록 또는 수정
//function writePopup(type) {
//	
//	var editorName = "popupEditor";
//	//  팝업 게시물 내용 입력 체크 
//	if ( RAONKEDITOR.IsEmpty(editorName)) {
//		swal.fire({
//			title: "",
//			text: "내용을 입력해주세요.",
//			icon: "warning",
//			confirmButtonText: "확인"
//		}).then(function(){
//			$("#keditor_body").focus();
//		});
//		return false;
//	}
//	
//	// 에디터의 내용을 form 안의 input에 셋팅
//	var fn_callback = function (paramObj) {
//		document.getElementById("popupContent").value = paramObj.strData;
//	}	
//    RAONKEDITOR.GetHtmlContents({
//        type: 'body',
//        callback: fn_callback
//    })
//
//	var msg = "등록하시겠습니까?";
//	var resultMsg = "등록되었습니다.";
//	var url = "do_popup_write";
//	if ( type == "modify" ) {
//		msg = "수정하시겠습니까?";
//		resultMsg = "수정되었습니다.";
//		url = "do_popup_modify";
//	}
//
//	swal.fire({
//		icon: "info",
//		text: msg,
//		confirmButtonText: "확인",
//		cancelButtonText : "취소",
//		showCancelButton : true
//	}).then((result) => {
//		
//		// 등록하기 
//		if( result.isConfirmed ){
//			
//			// 태그를 입력하지 않은 경우, '팝업' 태그를 임의로 입력해줌.
//			// 태그가 입력되어있지만, '팝업' 태그가 없는 경우에도 임의로 입력해줌.
//			var keyword = $("#keyword").val();
//			var checkNotice = false;
//			if ( keyword ) {
//				var keywordList = keyword.split(",");
//				for ( var i=0; i<keywordList.length; i++ ) {
//					if ( keywordList[i].trim() == "팝업" ) {	// 언어셋 필요 
//						checkNotice = true;
//						break;
//					}
//				}
//				
//				if ( !checkNotice ) {
//					$("#keyword").val("공지," + keyword);
//				}
//			}
//			else {
//				$("#keyword").val("공지");
//			}
//			
//			$.ajax({
//				type : 'POST',
//				data : $("#popup_form").serialize(),
//				dataType : "json",
//				url : url,
//				success: function(data) {
//			
//					if ( data.result == 1 ) {
//						
//						swal.fire({
//							icon : "success",
//							text : resultMsg,
//							confrimButtonText : "확인"
//						}).then(function(){
//							
//							location.href = "popup";
//						});
//					}			
//					
//				}
//			});
//		}
//		else {
//			return false;
//		}
//	});
//    
//}
//
//
//
//
//
//
//// 팝업 게시글 삭제 
//function deletePopup() {
//	
//	var rawId = $("#rawId").val();
//
//	swal.fire({
//		title : "",
//		text : "삭제하시겠습니까?",
//		icon : "info",
//		confirmButtonText: "확인",
//		cancelButtonText : "취소",
//		showCancelButton : true
//	}).then((result) => {
//		if(result.isConfirmed){
//			
//			$.ajax({
//				url :"do_popup_delete",
//				type : 'POST',
//				async : true,
//				data : { raw_id: rawId },
//				success : function(data) {
//					console.log(data)
//					if(data.result == 1){
//						swal.fire({
//							html: "삭제되었습니다.",
//							confirmButtonText: "확인",
//							closeOnConfirm : true,
//						}).then((result) => {
//							if(result.isConfirmed){
//								location.href="popup";
//							}
//						});
//						
//					} else {
//						
//						swal.fire({
//							title: "",
//							text: "다시 시도해주세요.",
//							icon: "warning",
//							confirmButtonText: "확인"
//						});
//					}
//				}
//			});
//		}
//	});
//}
//
//
//
