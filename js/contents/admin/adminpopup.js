var selectedList = [];  // 목록에서 선택 액션을 위한 배열 (선택 삭제/게시종료)
var dp = null;  // 등록화면의 datepicker
$(document).ready(function() {
	
    // 검색 날짜 선택 
    $(document).on('focus', 'input[name="searchDate"]', function() {
        $(this).datepicker({
            format: 'yyyy-mm-dd',
            language: 'ko-KR',
            autoHide: true
        });
    });

    // 등록화면 시작/종료 날짜 선택
    $(document).on('focus', 'input[name="selectDate"]', function() {
        dp = $(this).datepicker({
            format: 'yyyy-mm-dd',
            language: 'ko-KR',
            autoHide: true
        });
    });

    // 목록에서 항목 선택 (상세 화면 이동)
    $(document).on('click', 'tr td:not(:first-child)', function(e) {
        var td = e.currentTarget;
        td = $(td).siblings().eq(0);
        var selectedPopupId = $(td).children('input').val();

        location.href = 'go_popup_modify?id=' + selectedPopupId; 
    });

    // 목록에서 체크박스 클릭(선택 액션)
    $(document).on('click', 'td input[type="checkbox"]', function(e) {
        var checked = e.currentTarget.checked;
        var selectedPopupId = e.currentTarget.value;
        if ( checked ) {
          selectedList.push(selectedPopupId);
        }
        // 체크박스 해제 시, 배열에서 삭제 
        else {
          selectedList = $.grep(selectedList, function(value) {
            return value !== selectedPopupId;
          });
        }
        //console.log(selectedList);
      })

      selectPopupTime();
});

/** 팝업 목록 가져오기 */
function getPopupList(pageNo) {

    // pagination에서 직접 클릭이 아닌 경우
    if ( pageNo == undefined ) {
        pageNo = $('.pagination').children('a.on').text();
    }

    const url = 'do_get_popup_list';
    axios.post(url, null, { 
        params: {
            // search param:s
            startDate: $('#startDate').val(),
            endDate: $('#endDate').val(),
            category: $('#searchCate option:selected').val(),
            keyword: $('#searchWord').val(),
            useYn: $('input[name="searchDisplay"]:checked').val(),
            sort: $('#boardSort option:selected').val(),
            sortOption: 'DESC',
            // search param:e
            page_no: pageNo,
            popup_status: $('input[name="popupStatus"]:checked').val() 
        }
    }).then(function(response) {
        //console.log(response.data);
        // th:fragment 교체 
        $(".brd-wrap").replaceWith(response.data);

        // 선택된 항목이 있다면 표시
        if ( selectedList && selectedList.length > 0 ) {
            for ( var i=0; i<selectedList.length; i++ ) {
            var checkName = "#brdCheck-" + selectedList[i];
            // 현재 화면에 있는 요소 중, 배열에는 있지만 선택이 되어있지 않은 경우
            if ( $(checkName).length > 0 && !$(checkName).prop("checked") ) {
                $("#brdCheck-" + selectedList[i]).prop("checked", true);
            }
            }
        }
    })
    .catch(function(error){
        //console.log(error);
    });
}

/** 검색 초기화 */
function clearSearchCondition() {
    $('input:not([type="button"]').val('');
    $('input[type="radio"]').prop('checked', false);
    $('select').prop('selectedIndex', 0);
}

/** 팝업 등록 화면 이동 */
function goAddPopup() {
  location.href = getContextPath() + '/admin/popup/go_popup_add';
}

/** 팝업 등록 */
function addNewPopup() {
  
    const validateResult = validateForm();
    if ( (validateResult.el) != null ) {
      alert(validateResult.msg);
      (validateResult.el).focus();
      return false;
    }


    var startDt = $('input[name="popupStartDt"]').val();
    var endDt = $('input[name="popupEndDt"]').val();
	if ( new Date(startDt) > new Date(endDt) ) {
		alert("팝업 게시 기간을 확인해주세요.");
		return false;
	}

    const formData = $('#newForm').serialize();
    const url = 'do_add_popup';
    axios.post(url, JSON.stringify(formData), {
			        headers: {
			            'Content-Type': 'application/json'
			        }
			    })
      .then(function(response) {
        if ( response && response.data ) {
          var data = response.data;
          // success
          if ( data.result ) {
            alert('등록되었습니다.');
            location.href = 'go_popup';
          }
          // fail
          else{
            alert('다시 시도해주세요.');
          }
        }
        // fail
        else {
          alert('다시 시도해주세요.');
        }
      })
      .catch(function(error){
        //console.log(error);
      });
}

/** 팝업 수정 */
function modifyPopup(popupId) {

    const validateResult = validateForm();
    if ( (validateResult.el) != null ) {
      alert(validateResult.msg);
      (validateResult.el).focus();
      return false;
    }

    var startDt = $('input[name="popupStartDt"]').val();
    var endDt = $('input[name="popupEndDt"]').val();
	if ( new Date(startDt) > new Date(endDt) ) {
		alert("팝업 게시 기간을 확인해주세요.");
		return false;
	}

    const formData = $("#modifyForm").serialize();
    const url = 'do_modify_popup';
    axios.post(url, JSON.stringify(formData), {
			        headers: {
			            'Content-Type': 'application/json'
			        }
			    })
      .then(function(response) {
        if ( response && response.data ) {
          var data = response.data;
          // success
          if ( data.result ) {
            alert('수정되었습니다.');
            location.href = 'go_popup';
          }
          // fail
          else{
            alert('다시 시도해주세요.');
          }
        }
        // fail
        else {
          alert('다시 시도해주세요.');
        }
      })
      .catch(function(error){
        //console.log(error);
      });
}


/** 팝업 삭제 */
function deletePopup(popupId) {

    // popupId 있는 경우, 상세 화면에서 해당 글 삭제 
    if ( popupId ) {
      selectedList = [];
      selectedList.push(popupId);
    }
    // popupId 없을 경우, 목록에서 선택한 글 삭제 
    else {
      if ( selectedList && selectedList.length < 1 ) {
        alert('선택된 항목이 없습니다.');
        return false;
      }
    }
  
    const data = {
      list: selectedList.join(",")
    };
    if ( !data ) return false;
  
    var confirmText = '선택한 팝업을 삭제하시겠습니까?';
    if ( popupId ) confirmText = '삭제하시겠습니까?';
    
    var confirm = window.confirm(confirmText);
    if ( confirm ) {
  
        const url = 'do_delete_popup';
        axios.post(url, data, 
                  {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
        })
        .then(function(response) {
            if ( response && response.data ) {
            var data = response.data;
            // success
            if ( data.result > 0 ) {
                alert('정상적으로 처리되었습니다.');
                location.href = 'go_popup';
            }
            // fail
            else{
                alert('다시 시도해주세요.');
            }
            }
            // fail
            else {
            alert('다시 시도해주세요.');
            }
        })
        .catch(function(error){
            //console.log(error);
        });
    }
}

/** 게시 종료 */
function closePopup() {

    if ( selectedList && selectedList.length < 1 ) {
      alert('선택된 항목이 없습니다.');
      return false;
    }
  
    const data = {
      list: selectedList.join(",")
    };
    if ( !data ) return false;
  
    var confirm = window.confirm('선택한 팝업 게시를 종료하시겠습니까?');
    if ( confirm ) {
  
        const url = 'do_close_popup';
        axios.post(url, data, 
                  {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
        })
        .then(function(response) {
            if ( response && response.data ) {
            var data = response.data;
            // success
            if ( data.result > 0 ) {
                alert('정상적으로 처리되었습니다.');
                location.reload();
            }
            // fail
            else{
                alert('다시 시도해주세요.');
            }
            }
            // fail
            else {
            alert('다시 시도해주세요.');
            }
        })
        .catch(function(error){
            //console.log(error);
        });
    }
  }


/** 등록/수정 화면 > 팝업 시작/종료 시간 변경 시 시작/종료 일자 세팅 */
function selectPopupTime() {

    if (  $('input[name="popupStartDt"]').length < 1 ) {
        return false; 
    }
    
    const startTimeH = $('#popupStartH option:selected').val();
    const startTimeM = $('#popupStartM option:selected').val();
    const endTimeH = $('#popupEndH option:selected').val();
    const endTimeM = $('#popupEndM option:selected').val();

    const startTime = startTimeH + ":" + startTimeM;
    const endTime = endTimeH + ":" + endTimeM;

    if ( $('#popupStartDate').val() == '' || $('#popupEndDate').val() == '' ) {
        return false;
    }
    var startDt = $('#popupStartDate').val() + " " + startTime;
    var endDt = $('#popupEndDate').val() + " " + endTime;
    // var startDt = changeDate($('#popupStartDate').val() + " " + startTime);
    // var endDt = changeDate($('#popupEndDate').val() + " " + endTime);

    $('input[name="popupStartDt"]').val(startDt);
    $('input[name="popupEndDt"]').val(endDt);
}

// function changeDate(dateStr) {

//     console.log(dateStr);

//     // 입력 문자열을 Date 객체로 파싱
//     var inputDate = new Date(dateStr);

//     // 원하는 포맷으로 날짜를 변환
//     var year = inputDate.getFullYear();
//     var month = String(inputDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더하고 두 자리로 포맷팅
//     var day = String(inputDate.getDate()).padStart(2, '0');
//     var hours = String(inputDate.getHours()).padStart(2, '0');
//     var minutes = String(inputDate.getMinutes()).padStart(2, '0');

//     // 변경된 포맷을 적용
//     var formattedDate =  `${year}-${month}-${day}T${hours}:${minutes}`;
//     return formattedDate;
// }