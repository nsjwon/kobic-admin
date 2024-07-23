/** 사용자 그룹 리스트 가져오기 */
function getMyGroupList(pageNo) {

    const url = getContextPath() + '/mypage/do_get_group_list';
    const data = {  page_no: pageNo,
                    sorting: $("#boardSort option:selected").val()};
    axios.post( url, data, {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
    }).then(function(response) {
        // th:fragment 교체 
        $('#fragment').replaceWith(response.data);
    }).catch(function(error) {
        //console.log(error);
    });
}

/** 사용자 그룹 상세 화면 > 그룹원 리스트 가져오기 */
function getMyGroupMemberList(pageNo) {
    
    const url = getContextPath() + '/mypage/do_get_group_member_list';
    const data = {  page_no: pageNo,
                    group_id: $('#groupId').val(),
                    sorting: $("#boardSort option:selected").val()};
    axios.post( url, data, {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
    }).then(function(response) {
        // th:fragment 교체 
        $('#group_member_fragment').replaceWith(response.data);
    }).catch(function(error) {
        //console.log(error);
    });
}

/** 관리자 그룹 리스트 가져오기 */
function getMyAdminGroupList(pageNo) {

    const url = getContextPath() + '/mypage/admingroup/do_get_group_list';
    const data = {  page_no: pageNo,
                    sorting: $("#boardSort option:selected").val()};
    axios.post( url, data, {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
    }).then(function(response) {
        // th:fragment 교체 
        $('#fragment').replaceWith(response.data);
    }).catch(function(error) {
        //console.log(error);
    });
}

/** 관리자 그룹 상세 화면 > 그룹원 리스트 가져오기 */
function getMyAdminGroupMemberList(pageNo) {
    
    const url = getContextPath() + '/mypage/admingroup/do_get_group_member_list';
    const data = {  page_no: pageNo,
                    group_id: $('#groupAdminId').val(),
                    sorting: $("#boardSort option:selected").val()};
    axios.post( url, data, {headers: {'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}
    }).then(function(response) {
        // th:fragment 교체 
        $('#group_member_fragment').replaceWith(response.data);
    }).catch(function(error) {
        //console.log(error);
    });
}


/** 그룹 가입 이동 */
function goGroupJoin(tab) {
    location.href = 'https://www.kobic.re.kr/sso/go_group_list?tab=' + tab;
}
