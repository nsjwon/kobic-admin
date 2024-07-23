/** 페이징 */
function getPostList(pageNo) {

    //console.log("pageNo: " + pageNo);
    // pagination에서 직접 클릭이 아닌 경우
    if ( pageNo == undefined ) {
      pageNo = $('.pagination').children('a.on').text();
    }
    axios.post('do_get_my_post_list', null, {
      params: {
        // search param:s
        category: $('#searchCate option:selected').val(),
        extraCategory: $('#searchType option:selected').val(),
        keyword: $('#searchWord').val(),
        sort: $('#boardSort option:selected').val(),
        sortOption: 'DESC',
        // search param:e
        page_no: pageNo
      }
    })
    .then(function(response) {
      // th:fragment 교체 
      $('#post_fragment').replaceWith(response.data);
    })
    .catch(function(error){
      //console.log(error);
    });
}

/** 상세 화면 이동 */
function movePost(type, postId) {

  var postType = type.split('.')[2];
  for ( var i=0; i<$('.s-menu-inner').children('li').length; i++) {
    var menuA = $('.s-menu-inner').children('li').eq(i);
    menuA = $(menuA).children('a').prop('href');
    if ( menuA.indexOf(postType) > -1 ) {
      const url = getContextPath() + menuA.split(getContextPath())[1] + '/go_detail?id=' + postId;
      location.href = url;
    }
  }
}