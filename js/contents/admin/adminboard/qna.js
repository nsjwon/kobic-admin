

/*********************************
 * 관리자가 답변을 등록합니다.
 *********************************/

function addQnaReplyAdmin(qnaId) {
	
	// 답변 에디터가 생성되지 않았을 경우 
	if (!isCreatedEditor()) {
		alert('서버 점검중입니다. 관리자에게 문의하세요.');	
		return false; 		
	}
		
	// 에디터 유효성 검사
	if (!isWriteContent()) {
		alert('내용을 입력하세요.')
		return false;
	}

	// 에디터의 내용을 input에 설정
	writeContent();
	
	let jsonData = JSON.stringify({
	    "qnareplyFkQnaId": qnaId,
	    "qnareplyOrder": 0,
	    "qnareplyDepth": 0,
	    "qnareplyContent": $('#contentValue').val(),
	    "qnareplyContentText": $('#contentValueText').val(),
	    "qnareplyUseYn": "Y"
	});
		
	const url = getContextPath() + '/support/qna/do_add_qnareply';	
	
	axios({
	    method: 'post',
	    url: url,
	    data: jsonData,
	    headers: { 'Content-Type': 'application/json' } // Header 설정
	}).then(function(response) {			    				    				    			           	  			    
		  switch(response.data.result) {
		  
		  // 알 수 없는 에러
		  default :
			  alert('서버 점검중입니다. 관리자에게 문의하세요.');
			  break;		  
		  // 정상 
		  case 1 :
			  alert('등록되었습니다.');
			  location.href = getContextPath() + "/admin/board/go_qna_detail?id=" + qnaId;
			  break;
			  
		  case -1 :
			  alert('서버 점검중입니다. 관리자에게 문의하세요.');
			  break;
			  
		  case -2 :
			  alert('사용자 정보 조회에 실패 했습니다. 관리자에게 문의하세요.');
			  break;
		  }
		  		    	  			    	  			    				        			        			        			  			     
	  })
	  .catch(function(error){
		console.log(error);
		alert('서버 점검중입니다. 관리자에게 문의하세요.');
	  });	
}

/*********************************
 * 관리자가 답변을 수정합니다.
 *********************************/

function modifyQnaReplyAdmin(qnaReplyId) {

	const isModified = $('.brd-reply-detail').hasClass('dis-none');
	// 답변 수정 가능하도록 에디터 표출
	if ( !isModified ) {
		$("#replyEditArea").html(raonkEditorHolderInit_qnaReplay('replyEditorAdmin', 'replyEditArea'));						  
		$('.brd-reply-add').toggleClass('dis-none');
		$('.brd-reply-detail').toggleClass('dis-none');	
	 	return ;
	}
	 	
	if ( !confirm('답변을 수정하시겠습니까?') ) {
		return false;
	}
		
	// 답변 에디터가 생성되지 않았을 경우 
	if (!isCreatedEditor()) {
		alert('서버 점검중입니다. 관리자에게 문의하세요.');	
		return false; 		
	}
		
	// 에디터 유효성 검사
	if (!isWriteContentUseId('replyEditorAdmin')) {
		alert('내용을 입력하세요.')
		return false;
	}
	
	// 에디터의 내용을 input에 설정
	writeContent();
	
	let jsonData = JSON.stringify({
	    "qnareplyId": qnaReplyId,
	    "qnareplyContent": $('#contentValue').val(),
	    "qnareplyContentText": $('#contentValueText').val(),
	});
			
	const url = getContextPath() + '/support/qna/do_modify_qnareply';
	
	axios({
	    method: 'post',
	    url: url,
	    data: jsonData,
	    headers: { 'Content-Type': 'application/json' } // Header 설정
	}).then(function(response) {			    				    				    			           	  			    
		  switch(response.data.result) {
		  
		  // 알 수 없는 에러
		  default :
			  alert('서버 점검중입니다. 관리자에게 문의하세요.');
			  break;		  
		  // 정상 
		  case 1 :
			  alert('등록되었습니다.');
			  location.reload();
			  break;
			  
		  case -1 :
			  alert('서버 점검중입니다. 관리자에게 문의하세요.');
			  break;
			  
		  case -2 :
			  alert('사용자 정보 조회에 실패 했습니다. 관리자에게 문의하세요.');
			  break;
		  }
		  		    	  			    	  			    				        			        			        			  			     
	  })
	  .catch(function(error){
		console.log(error);
		alert('서버 점검중입니다. 관리자에게 문의하세요.');	    
	  });		
}

/*********************************
 * 관리자가 답변을 삭제합니다.
 *********************************/
function deleteQnaReplyAdmin(qnaReplyId) {

  var confirm = window.confirm('해당 답변을 삭제하시겠습니까?');
  if ( confirm ) {

      axios.post('do_delete_qnareply', {id: qnaReplyId}, {headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8','Accept': '*/*'}})
      .then(function(response) {
        if ( response && response.data ) {
          var data = response.data;
          // success
          if ( data.result > 0 ) {
            alert('삭제되었습니다.');		
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
      });
      
  }
}
