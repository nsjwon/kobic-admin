/** KOBICians 페이징 */
function getKOBICiansList(pageNo) {

    //console.log("pageNo: " + pageNo);
    // pagination에서 직접 클릭이 아닌 경우
    if ( pageNo == undefined ) {
      pageNo = $('.pagination').children('a.on').text();
    }
    axios.post('./kobicians/do_get_kobicians_list', null, {
      params: {
        // search param:s
        category: $('#searchCate option:selected').val(),
        
        keyword: $('#searchWord').val(),
        sort: $('#boardSort option:selected').val(),
        sortOption: 'DESC',
        // search param:e
        page_no: pageNo
      }
    })
    .then(function(response) {
      // th:fragment 교체 
      $('#kobicians_fragment').replaceWith(response.data);
    })
    .catch(function(error){
      //console.log(error);
    });
}