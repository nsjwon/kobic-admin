



var selectedList = [];  // 목록에서 선택 액션을 위한 배열 (선택 삭제/노출/비노출)
$(document).ready(function() {

	// 검색 날짜 선택 
	$(document).on('focus', 'input[name="searchDate"]', function() {
		$(this).datepicker({
			format: 'yyyy-mm-dd',
			language: 'ko-KR',
			autoHide: true
		});
	});

	// 등록 또는 수정화면 > 노출 여부 라디오 이벤트 
	$('input[name="brdDisplay"]:radio').change(function() {
		var brdDisplayValue = this.id;
		brdDisplayValue = brdDisplayValue == 'displayBlock' ? 'Y' : 'N';
		$('#useYnValue').val(brdDisplayValue);
	});
	
	// 목록에서 항목 선택 (상세 화면 이동)
	$(document).on('click', 'tr td:not(:first-child)', function(e) {
		// 현재 URL에 'detail'이 포함되어 있지 않을경우에만 실행
		if (!window.location.href.includes('detail')) {
			var td = e.currentTarget;
			td = $(td).siblings().eq(0);
			var selectedPostId = $(td).children('input').val();

			location.href = getPathName(true) + '_detail?id=' + selectedPostId;
		}
	});

	// 목록에서 체크박스 클릭(선택 액션)
	$(document).on('click', 'td input[type="checkbox"]', function(e) {
		var checked = e.currentTarget.checked;
		var selectedPostId = e.currentTarget.value;
		if (checked) {
			selectedList.push(selectedPostId);
		}
		// 체크박스 해제 시, 배열에서 삭제 
		else {
			selectedList = $.grep(selectedList, function(value) {
				return value !== selectedPostId;
			});
		}
	});
});

/** 검색 초기화 */
function clearSearchCondition() {
	$('input:not([type="button"]').val('');
	$('input[type="radio"]').prop('checked', false);
	$('select').prop('selectedIndex', 0);
}

/** 목록 새 데이터 세팅(페이징, 검색, 정렬 등) */
function getPostList(pageNo) {

	// pagination에서 직접 클릭이 아닌 경우
	if (pageNo == undefined) {
		pageNo = $('.pagination').children('a.on').text();
	}

	var param = {
		// search param:s
		startDate: $('#startDate').val(),
		endDate: $('#endDate').val(),
		category: $('#searchCate option:selected').val(),
		keyword: $('#searchWord').val(),
		useYn: $('input[name="searchDisplay"]:checked').val(),
		sort: $('#boardSort option:selected').val(),
		sortOption: 'DESC',
		// search param:e
		page_no: pageNo
	};

	// 게시판 별 검색 조건 추가 
	// 소식(언어, 유형)
	if (getPathName().indexOf("news") > -1) {
		param['news_lang'] = $('select[name="searchLang"] option:selected').val();
		param['news_type'] = $('select[name="searchType"] option:selected').val();
	}
	// 문의사항(답변상태, 유형)
	if (getPathName().indexOf("qna") > -1) {
		param['qna_status'] = $('input[name="searchState"]:checked').val();
		param['qna_type'] = $('#searchType option:selected').val();
	}
	// 논문성과(논문연도)
	if (getPathName().indexOf("paper") > -1) {
		param['paper_year'] = $('select[name="searchYear"] option:selected').val();
	}
	// 홍보영상(언어)
	if (getPathName().indexOf("video") > -1) {
		param['video_lang'] = $('select[name="searchLang"] option:selected').val();
	}
	// KOBICian’s Story
	if (getPathName().indexOf("kobicians") > -1) {
		param['kobicians_lang'] = $('select[name="searchLang"] option:selected').val();
	}

	const url = 'do_get_' + getPathName() + '_list';
	axios.post(url, null, { params: param })
		.then(function(response) {
			// th:fragment 교체 
			$(".brd-wrap").replaceWith(response.data);

			// 선택된 항목이 있다면 표시
			if (selectedList && selectedList.length > 0) {
				for (var i = 0; i < selectedList.length; i++) {
					var checkName = "#brdCheck-" + selectedList[i];
					// 현재 화면에 있는 요소 중, 배열에는 있지만 선택이 되어있지 않은 경우
					if ($(checkName).length > 0 && !$(checkName).prop("checked")) {
						$("#brdCheck-" + selectedList[i]).prop("checked", true);
					}
				}
			}
		})
		.catch(function(error) {
			//console.log(error);
		});
}

/** 새 글 등록 화면 이동 */
function goAddPost() {
	location.href = getContextPath() + '/admin/board/' + getPathName(true) + '_add';
}





/** 글 삭제 */
function deletePost(postId) {

	// postId가 있는 경우, 상세 화면에서 해당 글 삭제 
	if (postId) {
		selectedList = [];
		selectedList.push(postId);
	}
	// postId가 없을 경우, 목록에서 선택한 글 삭제 
	else {
		if (selectedList && selectedList.length < 1) {
			alert('선택된 항목이 없습니다.');
			return false;
		}
	}

	const data = {
		list: selectedList.join(",")
	};
	if (!data) return false;

	var confirmText = '선택한 항목을 삭제하시겠습니까?';
	if (postId) confirmText = '삭제하시겠습니까?';

	var confirm = window.confirm(confirmText);
	if (confirm) {

		const url = 'do_delete_' + getPathName();
		axios.post(url, data,
			{
				headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': '*/*' }
			})
			.then(function(response) {
				if (response && response.data) {
					var data = response.data;
					// success
					if (data.result > 0) {
						alert('정상적으로 처리되었습니다.');
						location.href = getPathName(true);
					}
					// fail
					else {
						alert('다시 시도해주세요.');
					}
				}
				// fail
				else {
					alert('다시 시도해주세요.');
				}
			})
			.catch(function(error) {
				//console.log(error);
			});
	}
}

/** 선택 노출/비노출 */
function changeYnSelectedPost(using) {

	if (selectedList && selectedList.length < 1) {
		alert('선택된 항목이 없습니다.');
		return false;
	}

	const data = {
		list: selectedList.join(","),
		// list: selectedList,
		use_yn: using
	};
	if (!data) return false;

	var confirmValue = using == 'Y' ? '노출' : '비노출';
	var confirm = window.confirm('선택한 항목을 ' + confirmValue + '하시겠습니까?');
	if (confirm) {

		const url = 'do_modify_' + getPathName() + '_useyn';
		axios.post(url, data,
			{
				headers: { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': '*/*' }
			})
			.then(function(response) {
				if (response && response.data) {
					var data = response.data;
					// success
					if (data.result > 0) {
						alert('정상적으로 처리되었습니다.');
						location.reload();
					}
					// fail
					else {
						alert('다시 시도해주세요.');
					}
				}
				// fail
				else {
					alert('다시 시도해주세요.');
				}
			})
			.catch(function(error) {
				//console.log(error);
			});
	}
}





















/********************** 코드 정리 ********************************/






/*********************************
 * 새 글을 등록합니다.
 *********************************/
function addNewPost() {

	// 에디터 사용 시
	if (isCreatedEditor()) {

		// 에디터 유효성 검사
		if (!isWriteContent()) {
			alert('내용을 입력하세요.')
			return false;
		}

		// 에디터의 내용을 input에 설정
		writeContent();

	}

	// 폼 유효성 검사
	var validateResult = validateForm();
	if (validateResult.el) {
		alert(validateResult.msg);
		validateResult.el.focus();
		return false;
	}


	// 파일 사용 시 업로드 (파일 메타 정보 저장은 RAONKUPLOAD_UploadComplete 이벤트 핸들러에서 저장)
	// 파일 업로드 여부와 상관 없이 raonk-upload 객체 생성 시 실행
	if (isCreatedUploader()) {		
		fn_transfer();
		return true;;
	}
	alert('서버 점검중입니다. 관리자에게 문의하세요.');
	return false;
}

/*********************************
 * 글을 수정합니다.
 *********************************/

function modifyPost(postId) {
	
	// 에디터 사용 시
	if (isCreatedEditor()) {

		// 에디터 유효성 검사
		if (!isWriteContent()) {
			alert('내용을 입력하세요.')
			return false;
		}		
		// 에디터의 내용을 input에 설정
		writeContent();

	}
		
	
	// 폼 유효성 검사
	var validateResult = validateForm();
	
	if (validateResult.el) {
		alert(validateResult.msg);
		validateResult.el.focus();
		return false;
	}
			
	// 파일 사용 시 업로드 (파일 메타 정보 저장은 RAONKUPLOAD_UploadComplete 이벤트 핸들러에서 저장)
	if (isCreatedUploader()) {		
		fn_transfer();
		return true;
	}
	
	alert('서버 점검중입니다. 관리자에게 문의하세요.');	
	return false;
		
}




/*********************************
 * 소식 새 글을 등록합니다.
 *********************************/
function addNewPost_news() {

	// 에디터 사용 시
	if (isCreatedEditor()) {

		// 에디터 유효성 검사
		if (!isWriteContent()) {
			alert('내용을 입력하세요.')
			return false;
		}

		// 에디터의 내용을 input에 설정
		writeContent();

	}

	// 폼 유효성 검사
	var validateResult = validateForm();
	if (validateResult.el) {
		alert(validateResult.msg);
		validateResult.el.focus();
		return false;
	}


	// 파일 사용 시 업로드 (파일 메타 정보 저장은 RAONKUPLOAD_UploadComplete 이벤트 핸들러에서 저장)
	// 파일 업로드 여부와 상관 없이 raonk-upload 객체 생성 시 실행
	if (isCreatedUploader()) {		
		fn_transferUpload();
		return true;;
	}
	alert('서버 점검중입니다. 관리자에게 문의하세요.');
	return false;
}


/*********************************
 * 소식 글을 수정합니다.
 *********************************/

function modifyPost_news(postId) {

	// 에디터 사용 시
	if (isCreatedEditor()) {

		// 에디터 유효성 검사
		if (!isWriteContent()) {
			alert('내용을 입력하세요.')
			return false;
		}

		// 에디터의 내용을 input에 설정
		writeContent();

	}
	
	// 폼 유효성 검사
	var validateResult = validateForm();
	if (validateResult.el) {
		alert(validateResult.msg);
		validateResult.el.focus();
		return false;
	}
	
	// 파일 사용 시 업로드 (파일 메타 정보 저장은 RAONKUPLOAD_UploadComplete 이벤트 핸들러에서 저장)
	if (isCreatedUploader()) {
		fn_transferUpload();
		return true;
	}
	
	alert('서버 점검중입니다. 관리자에게 문의하세요.');	
	return false;
		
}


/*********************************
 * KOBICian’s Story 글을 등록합니다.
 *********************************/

function addNewPost_kobicians() {
		
    // 에디터 사용 시
	if (isCreatedEditor()) {
		
		// 에디터 유효성 검사
		if (!isWriteContent()) {
			alert(commonAlertEmpty)
			return false;
		}

		// 에디터의 내용을 input에 설정
		writeContent();

	}

	// 폼 유효성 검사
	var validateResult = validateForm();
	if (validateResult.el) {
		alert(validateResult.msg);
		validateResult.el.focus();
		return false;
	}


	// 파일 사용 시 업로드 (파일 메타 정보 저장은 RAONKUPLOAD_UploadComplete 이벤트 핸들러에서 저장)
	if (isCreatedUploader()) {
		fn_transfer();
		return;
	}
}

/*********************************
 * KOBICian’s Story 글을 수정합니다.
 *********************************/

function modifyPost_kobicians(postId) {

	// 에디터 사용 시
	if (isCreatedEditor()) {

		// 에디터 유효성 검사
		if (!isWriteContent()) {
			alert('내용을 입력하세요.')
			return false;
		}

		// 에디터의 내용을 input에 설정
		writeContent();

	}
	
	// 폼 유효성 검사
	var validateResult = validateForm();
	if (validateResult.el) {
		alert(validateResult.msg);
		validateResult.el.focus();
		return false;
	}
	
	// 파일 사용 시 업로드 (파일 메타 정보 저장은 RAONKUPLOAD_UploadComplete 이벤트 핸들러에서 저장)
	if (isCreatedUploader()) {
		fn_transferUpload();
		return true;
	}
	
	alert('서버 점검중입니다. 관리자에게 문의하세요.11');	
	return false;
		
}

