$(function() {

	
});


// 클릭
$(function() {
	
	// 공지사항 클릭 (공지사항 상세보기 이동)
	$(document).on("click", "#notice_fragment .brd_list_type01 .brd_list", function(e) {
		var rawId = $(e.currentTarget).find("#noticeRawId").val();
		location.href = encodeURI("notice_detail?raw_id=" + rawId);
	});
	
	// 문의사항 클릭 (문의사항 상세보기 이동)
	$(document).on("click", "#question_fragment .brd_list_type01 .brd_list", function(e) {
		var rawId = $(e.currentTarget).find("#questionRawId").val();
		location.href = encodeURI("question_detail?raw_id=" + rawId);
	});
	
	// 정보공유 클릭 (정보공유 상세보기 이동)
	$(document).on("click", "#information_fragment .brd_list_type01 .brd_list", function(e) {		
		var rawId = $(e.currentTarget).find("#informationRawId").val();		
		location.href = encodeURI("information_detail?raw_id=" + rawId);
	});
	
	// 댓글달기 textarea 클릭 (에디터 보임)
	$(document).on("click", ".cmt_textarea", function() {
		showReplyEditor(0, $("#rawId").val());
	});
});



// validation
$(function() {

	// 공지사항 등록 validate
	$("#notice_form").validate({
		rules: {
			title: {
				required: true
			}
		}, 
		messages: {
			title: {
				required: messageCommunityTitle
			}
		},
		submitHandler: function(form) {
			var submitType = $(form).find('input[type=submit]').attr("id");
			// add or modify
			writeNotice(submitType);
		}, 
		errorElement: "span",
	    errorPlacement: function(error, element){
			error.addClass("error_txt");
			error.appendTo(element.parent("div"));
	    } 
	});
	
})

// 공지사항 등록 또는 수정
function writeNotice(type) {
	
	var editorName = "noticeEditor";
	//  공지사항 내용 입력 체크 
	if ( RAONKEDITOR.IsEmpty(editorName)) {
		swal({
			title: "",
			text: messageContent,
			confirmButtonText: buttonConfirm
		}).then(function() {
			$("#keditor_body").focus();
		});
		return false;
	}
	
	// 에디터의 내용을 form 안의 input에 셋팅
	var fn_callback = function (paramObj) {
		document.getElementById("noticeContent").value = paramObj.strData;
	}	
    RAONKEDITOR.GetHtmlContents({
        type: 'body',
        callback: fn_callback
    })

	var msg = messageQRegister;
	var resultMsg = messageARegister;
	var url = "do_notice_write";
	if ( type == "modify" ) {
		msg = messgaeQEdit;
		resultMsg = messgaeAEdit;
		url = "do_notice_modify";
	}


	swal({
		title: "",
		text: msg,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			// 태그를 입력하지 않은 경우, '공지' 태그를 임의로 입력해줌.
			// 태그가 입력되어있지만, '공지' 태그가 없는 경우에도 임의로 입력해줌.
			var keyword = $("#keyword").val();
			var checkNotice = false;
			if ( keyword ) {
				var keywordList = keyword.split(",");
				for ( var i=0; i<keywordList.length; i++ ) {
					if ( keywordList[i].trim() == "공지" ) {	// 언어셋 필요 
						checkNotice = true;
						break;
					}
				}
				
				if ( !checkNotice ) {
					$("#keyword").val("공지," + keyword);
				}
			}
			else {
				$("#keyword").val("공지");
			}
			
			$.ajax({
				type : 'POST',
				data : $("#notice_form").serialize(),
				dataType : "json",
				url : url,
				success: function(data) {
			
					if ( data.result == 1 ) {
						swal({
							title: "",
							text : resultMsg,
							confrimButtonText : buttonConfirm
						}).then(function() {
							location.href = "notice";
						});
					}			
					
				}
			});
		} 
		else {
			return false;
		}
	});

}




// 공지사항 페이징
function noticePaging(pageNo, sort) {
	
	// 정렬 값 미지정 시 디폴트값 지정
	if(typeof sort == "undefined" || sort == null || sort == "") {
		sort = "write_date";
	}

	var data = { 			
		page_no: pageNo,
		sorting: sort,
		"noticeSearchCategory": $("#noticeSearchCategory option:selected").val(),
		"noticeSearchWord" : $("#noticeSearchWord").val(), 		
	};
	$.ajax({
		type: "post",
		url: "notice_paging",
		data: data,
		success: function(response) {
			$("#notice_fragment").replaceWith(response);
		}
	});
}

// 공지사항 좋아요
function upvoteToggle() {

	var memberInfo = $("#memberInfo").val();
	if ( !memberInfo ) {
			
		swal({
			title: "",
			text: messageGRequiredLogin,
			confirmButtonText: buttonConfirm
		});

		return;
	}

	var rawId = $("#rawId").val();
	var bundleId = $("#bundleId").val();
	
	// brd_like, brd_like_fill
	var likeArea = $(".brd_d_bottom").find("div");
	var isLike = $(likeArea).hasClass("brd_like_fill");
	var likeCount = parseInt($(likeArea).find("span").text());

	var data = { raw_id: rawId,
				 bundle_id: bundleId,
				 is_like: isLike };
	$.ajax({
		type: "post",
		url: "community_like_toggle",
		data: data,
		success: function(response) {
			var result = parseInt(response.toggle_result);
			
			if ( !isLike ) {
				$(likeArea).addClass("brd_like_fill").removeClass("brd_like");
				$(likeArea).find("span").text(likeCount + result);
			}
			else {
				$(likeArea).addClass("brd_like").removeClass("brd_like_fill");
				$(likeArea).find("span").text(likeCount - result);
			}
		}
	});
}

// 공지사항 댓글 editor 열기 
// type: 0-add, 1-modify
var isCommunityEdit = false;
var modifyCommunityContent = null;
function showReplyEditor(type, replyRawId) {
	
	var memberInfo = $("#memberInfo").val();
	if ( !memberInfo ) {
			
		swal({
			title: "",
			text: messageGRequiredLogin,
			confirmButtonText: buttonConfirm
		});

		return;
	}
	
	// check modify	
	isCommunityEdit = type == 0 ? false : true;
		
	// 열려있는 모든 댓글 에디터 숨김
	$(".cmt_write").not("#new_reply").addClass("Dis_none");
	// 새로 등록하는 나의 댓글 에디터가 열려있다면 숨기고 textarea 다시 표출 
	var newReplyEditorBox = $("#new_reply").children("div").eq(1);
	if ( !$(newReplyEditorBox).hasClass("Dis_none") ) {
		$(newReplyEditorBox).addClass("Dis_none").removeClass("cmt_edit_box");
		$(newReplyEditorBox).prev().addClass("cmt_text_box").removeClass("Dis_none");
	}
		
	var editorNm = replyRawId + "_editor";
	// 답글 클릭된 댓글에 에디터 보임 
	$("#" + editorNm).html(raonkEditorHolderInit(editorNm));
	// 새로 등록하는 나의 댓글인 경우
	if ( $("#" + editorNm).parent("div").parent("div").attr("id") == "new_reply" ) {
		$(newReplyEditorBox).prev().addClass("Dis_none").removeClass("cmt_text_box");
	}
	$("#" + replyRawId + "_wrap").removeClass("Dis_none");
	
	// 댓글 수정인 경우 
	if ( type == 1 ) {
		$("input[name=add]").val(buttonEdit);
		modifyCommunityContent = document.getElementById(replyRawId + "_content").innerHTML;
	}
	else {
		$("input[name=add]").val(buttonRegist);
	}
}


// 댓글 수정의 경우, editor가 생성되면 댓글 내용을 editor에 입력해줌.
function RAONKEDITOR_CreationComplete(editorId) {
//	console.log(editorId);
	if( isCommunityEdit && modifyCommunityContent != null ){
		const editHtmlContents = modifyCommunityContent
		RAONKEDITOR.setBodyValue(editHtmlContents, editorId);
		isCommunityEdit = false;
	}
}


// 공지사항 댓글 editor 닫기 
// type: 0-add, 1-cancle
function hideReplyEditor(type, replyRawId) {

	var editorNm = replyRawId + "_editor";
	// 답글 클릭된 댓글에 에디터 보임 
	$("#" + editorNm).html(raonkEditorHolderInit(editorNm));

	// 새로 등록하는 나의 댓글인 경우
	if ( $("#" + editorNm).parent("div").parent("div").attr("id") == "new_reply" ) {
		var newReplyEditorBox = $("#new_reply").children("div").eq(1);
		$(newReplyEditorBox).prev().addClass("cmt_text_box").removeClass("Dis_none");
	}
	$("#" + replyRawId + "_wrap").addClass("Dis_none");
}

// 댓글 등록 또는 수정 
// type: 0-add, 1-modify
function writeReply(type, replyRawId) {
		
	var formId = replyRawId + "_form";
	var fnCallback = function(paramObj) {
		document.getElementById(formId).querySelector("input[name='content']").value = paramObj.strData;
	}
	
	RAONKEDITOR.GetHtmlContents({
		type: "body",
		callback: fnCallback
	})
	
	var editorNm = replyRawId + "_editor";	
	var url = "do_reply_write";
	var msg = messageQRegister;
	if ( $("input[name=add]").val() == buttonEdit ) {
		url = "do_reply_modify";
		msg = messgaeQEdit;
	}


	swal({
		title: "",
		text : msg,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			$.ajax({
				url: url,
				type: "POST",
				dataType : "json",
				data: $("#" + formId).serialize(),
				success: function(data) {
					if(data.result == 1){
						location.reload();
					}
				},
				error: function(response) {
					console.log('An error occurred.');
					console.log(response);
				},
		        complete: function(response) {
			
					RAONKEDITOR.Destroy(editorNm);
					setTimeout(response);
				}
			});
		} 
		else {
			return false;
		}
	});
}

// 댓글 삭제
function deleteReply(replyRawId) {
	
	swal({
		title: "",
		text : messageQDelete,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			$.ajax({
				url: "do_reply_delete",
				type: "POST",
				dataType : "json",
				data: { raw_id : replyRawId },
				success: function(data) {
					if(data.result == 1){
						location.reload();
					}
				},
				error: function(response) {
					console.log('An error occurred.');
					console.log(response);
				},
		        complete: function(response) {
			
					RAONKEDITOR.Destroy(editorNm);
					setTimeout(response);
				}
			});
		} 
		else {
			return false;
		}
	});
}


// 공지사항 삭제 
function deleteNotice() {
	
	var rawId = $("#rawId").val();

	swal({
		title: "",
		text : messageQDelete,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			$.ajax({
				url :"do_notice_delete",
				type : 'POST',
				async : true,
				data : { raw_id: rawId },
				success : function(data) {
					console.log(data)
					if(data.result == 1){
						swal({
							title: "",
							text: messageADelete,
							confirmButtonText: buttonConfirm,
						}).then(function() {
							location.href="notice";
						});
						
					} else {
						
						swal({
							title: "",
							text: messageRetry,
							confirmButtonText: buttonConfirm
						});
					}
				}
			});
		} 
		else {
			return false;
		}
	});
}


/*****************************************************************
	문의사항 
 *****************************************************************/

// 문의사항 페이징 & 정렬
function questionPaging(pageNo, sort) {
	
	// 정렬 값 미지정 시 디폴트값 지정
	if(typeof sort == "undefined" || sort == null || sort == "") {
		sort = "write_date";
	}
		
	var data = { page_no: pageNo,
				 sorting: sort };
	$.ajax({
		type: "post",
		url: "question_paging",
		data: data,
		success: function(response) {
			$("#question_fragment").replaceWith(response);
		}
	});
}

// validation
$(function() {

	// 문의사항 등록 validate
	$("#question_form").validate({
		rules: {
			title: {
				required: true
			}
		}, 
		messages: {
			title: {
				required: messageCommunityTitle
			}
		},
		submitHandler: function(form) {
			var submitType = $(form).find('input[type=submit]').attr("id");
			// add or modify
			questionNotice(submitType);
		}, 
		errorElement: "span",
	    errorPlacement: function(error, element){
			error.addClass("error_txt");
			error.appendTo(element.parent("div"));
	    } 
	});
	
})


// 문의사항 등록 또는 수정
function questionNotice(type) {
	
	var editorName = "questionEditor";
	//  문의사항 내용 입력 체크 
	if ( RAONKEDITOR.IsEmpty(editorName)) {
		
		swal({
			title: "",
			text: messageContent,
			confirmButtonText: buttonConfirm
		}).then(function() {
			$("#keditor_body").focus();
		});
		return false;
	}
	
	// 에디터의 내용을 form 안의 input에 셋팅
	var fn_callback = function (paramObj) {
		document.getElementById("questionContent").value = paramObj.strData;
	}	
    RAONKEDITOR.GetHtmlContents({
        type: 'body',
        callback: fn_callback
    })

	var msg = messageQRegister;
	var resultMsg = messageARegister;
	var url = "do_question_write";
	if ( type == "modify" ) {
		msg = messgaeQEdit;
		resultMsg = messgaeAEdit;
		url = "do_question_modify";
	}


	swal({
		title: "",
		text: msg,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			// 태그를 입력하지 않은 경우, '문의' 태그를 임의로 입력해줌.
			// 태그가 입력되어있지만, '문의' 태그가 없는 경우에도 임의로 입력해줌.
			var keyword = $("#keyword").val();
			var checkNotice = false;
			if ( keyword ) {
				var keywordList = keyword.split(",");
				for ( var i=0; i<keywordList.length; i++ ) {
					if ( keywordList[i].trim() == "문의" ) {	// 언어셋 필요 
						checkNotice = true;
						break;
					}
				}
				
				if ( !checkNotice ) {
					$("#keyword").val("문의," + keyword);
				}
			}
			else {
				$("#keyword").val("문의");
			}
			
			$.ajax({
				type : 'POST',
				data : $("#question_form").serialize(),
				dataType : "json",
				url : url,
				success: function(data) {
			
					if ( data.result == 1 ) {
						
						swal({
							title: "",
							text : resultMsg,
							confrimButtonText : buttonConfirm
						}).then(function() {
							location.href = "question";
						});
					}			
					
				}
			});
		} 
		else {
			return false;
		}
	});

}

// 문의사항 삭제 
function deleteQuestion() {
	
	var rawId = $("#rawId").val();

	swal({
		title: "",
		text : messageQDelete,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			$.ajax({
				url :"do_question_delete",
				type : 'POST',
				async : true,
				data : { raw_id: rawId },
				success : function(data) {
					console.log(data)
					if(data.result == 1){
						swal({
							title: "",
							text: messageADelete,
							confirmButtonText: buttonConfirm
						}).then(function() {						
							location.href="question";
						});
						
					} else {
						
						swal({
							title: "",
							text: messageRetry,
							confirmButtonText: buttonConfirm
						});
					}
				}
			});
		} 
		else {
			return false;
		}
	});
}






/*****************************************************************
	정보공유
 *****************************************************************/
 
// 정보공유 페이징 & 정렬
function informationPaging(pageNo, sort) {
	
	// 정렬 값 미지정 시 디폴트값 지정
	if(typeof sort == "undefined" || sort == null || sort == "") {
		sort = "write_date";
	}
		
	var data = { page_no: pageNo,
				 sorting: sort };
	$.ajax({
		type: "post",
		url: "information_paging",
		data: data,
		success: function(response) {
			$("#information_fragment").replaceWith(response);
		}
	});
}

// validation
$(function() {

	// 정보공유 등록 validate
	$("#information_form").validate({
		rules: {
			title: {
				required: true
			}
		}, 
		messages: {
			title: {
				required: messageCommunityTitle
			}
		},
		submitHandler: function(form) {
			var submitType = $(form).find('input[type=submit]').attr("id");
			// add or modify
			informationNotice(submitType);
		}, 
		errorElement: "span",
	    errorPlacement: function(error, element){
			error.addClass("error_txt");
			error.appendTo(element.parent("div"));
	    } 
	});
	
})


// 정보공유 등록 또는 수정
function informationNotice(type) {
	
	var editorName = "informationEditor";
	//  문의사항 내용 입력 체크 
	if ( RAONKEDITOR.IsEmpty(editorName)) {
		
		swal({
			title: "",
			text: messageContent,
			confirmButtonText: buttonConfirm
		}).then(function() {
			$("#keditor_body").focus();
		});
		return false;
	}
	
	// 에디터의 내용을 form 안의 input에 셋팅
	var fn_callback = function (paramObj) {
		document.getElementById("informationContent").value = paramObj.strData;
	}	
    RAONKEDITOR.GetHtmlContents({
        type: 'body',
        callback: fn_callback
    })

	var msg = messageQRegister;
	var resultMsg = messageARegister;
	var url = "do_information_write";
	if ( type == "modify" ) {
		msg = messgaeQEdit;
		resultMsg = messgaeAEdit;
		url = "do_information_modify";
	}

	swal({
		title: "",
		text: msg,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			// 태그를 입력하지 않은 경우, '정보' 태그를 임의로 입력해줌.
			// 태그가 입력되어있지만, '정보' 태그가 없는 경우에도 임의로 입력해줌.
			var keyword = $("#keyword").val();
			var checkNotice = false;
			if ( keyword ) {
				var keywordList = keyword.split(",");
				for ( var i=0; i<keywordList.length; i++ ) {
					if ( keywordList[i].trim() == "정보" ) {	// 언어셋 필요 
						checkNotice = true;
						break;
					}
				}
				
				if ( !checkNotice ) {
					$("#keyword").val("정보," + keyword);
				}
			}
			else {
				$("#keyword").val("정보");
			}
			
			$.ajax({
				type : 'POST',
				data : $("#information_form").serialize(),
				dataType : "json",
				url : url,
				success: function(data) {
			
					if ( data.result == 1 ) {
						
						swal({
							title: "",
							text: resultMsg,
							confirmButtonText: buttonConfirm
						}).then(function() {		
							location.href = "information";
						});
					}			
					
				}
			});
		} 
		else {
			return false;
		}
	});

}

// 정보공유 삭제 
function deleteInformation() {
	
	var rawId = $("#rawId").val();

	swal({
		title: "",
		text : messageQDelete,
		confirmButtonText: buttonConfirm,
		cancelButtonText : buttonCancel,
		showCancelButton : true
	}).then(function(result) {
		if (result) {
			$.ajax({
				url :"do_information_delete",
				type : 'POST',
				async : true,
				data : { raw_id: rawId },
				success : function(data) {
					console.log(data)
					if(data.result == 1){
						swal({
							title: "",
							text: messageADelete,
							confirmButtonText: buttonConfirm
						}).then(function() {					
							location.href="information";
						});
						
					} else {
						
						swal({
							title: "",
							text: messageRetry,
							confirmButtonText: buttonConfirm
						});
					}
				}
			});
		} 
		else {
			return false;
		}
	});
	
}
