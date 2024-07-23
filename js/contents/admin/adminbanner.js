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
    
    // 목록에서 항목 선택 (상세 화면 이동)
    $(document).on('click', 'tr td:not(:first-child)', function(e) {
        var td = e.currentTarget;
        td = $(td).siblings().eq(0);
        var selectedBannerId = $(td).children('input').val();

        location.href = 'go_banner_modify?id=' + selectedBannerId; 
    });

    // 목록에서 체크박스 클릭(선택 액션)
    $(document).on('click', 'td input[type="checkbox"]', function(e) {
        var checked = e.currentTarget.checked;
        var selectedBannerId = e.currentTarget.value;
        if ( checked ) {
          selectedList.push(selectedBannerId);
        }
        // 체크박스 해제 시, 배열에서 삭제 
        else {
          selectedList = $.grep(selectedList, function(value) {
            return value !== selectedBannerId;
          });
        }
        // console.log(selectedList);
      });
});


/** 배너 목록 가져오기 */
function getBannerList(pageNo) {

    // pagination에서 직접 클릭이 아닌 경우
    if ( pageNo == undefined ) {
        pageNo = $('.pagination').children('a.on').text();
    }

    const url = 'do_get_banner_list';
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
            page_no: pageNo
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
        console.log(error);
    });
}

/** 검색 초기화 */
function clearSearchCondition() {
    $('input:not([type="button"]').val('');
    $('input[type="radio"]').prop('checked', false);
    $('select').prop('selectedIndex', 0);
}


/** 선택 노출/비노출 */
function changeYnSelectedBanner(using) {

    if ( selectedList && selectedList.length < 1 ) {
      alert('선택된 항목이 없습니다.');
      return false;
    }
  
    const data = {
      list: selectedList.join(","),
      use_yn: using
    };
    if ( !data ) return false;
  
    var confirmValue = using == 'Y' ? '노출' : '비노출';
    var confirm = window.confirm('선택한 항목을 ' + confirmValue + '하시겠습니까?');
    if ( confirm ) {
  
        const url = 'do_modify_banner_useyn';
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
            console.log(error);
        });
    }
  }

/** 배너 등록 화면 이동 */
function goAddBanner() {
    location.href = getContextPath() + '/admin/banner/go_banner_add';
}

/** 배너 등록 */
function addNewBanner() {

    const validateResult = validateForm();
    if ( (validateResult.el) != null ) {
      alert(validateResult.msg);
      (validateResult.el).focus();
      return false;
    }

    const formData = $('#newForm').serialize();
    const url = 'do_add_banner';
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
            location.href = 'go_banner';
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
        console.log(error);
      });
}

/** 배너 수정 */
function modifyBanner(bannerId) {
  
    const validateResult = validateForm();
    if ( (validateResult.el) != null ) {
      alert(validateResult.msg);
      (validateResult.el).focus();
      return false;
    }
    
    const formData = $("#modifyForm").serialize();
    const url = 'do_modify_banner';
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
            location.href = 'go_banner';
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
        console.log(error);
      });
}

/** 배너 삭제 */
function deleteBanner(bannerId) {

    // bannerId 있는 경우, 상세 화면에서 해당 글 삭제 
    if ( bannerId ) {
        selectedList = [];
        selectedList.push(bannerId);
    }
    // bannerId 없을 경우, 목록에서 선택한 글 삭제 
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

    var confirmText = '선택한 항목을 삭제하시겠습니까?';
    if ( bannerId ) confirmText = '삭제하시겠습니까?';
    
    var confirm = window.confirm(confirmText);
    if ( confirm ) {

        const url = 'do_delete_banner';
        axios.post(url, data, 
                  {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
        })
        .then(function(response) {
            if ( response && response.data ) {
                var data = response.data;
                // success
                if ( data.result > 0 ) {
                    alert('정상적으로 처리되었습니다.');
                    location.href = 'go_banner';
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
            console.log(error);
        });
    }
}


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
	if (getPathName().indexOf("banner") > -1) {
		param['banner_order'] = $('select[name="bannerOrder"] option:selected').val();			
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