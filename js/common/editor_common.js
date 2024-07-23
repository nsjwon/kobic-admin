/***************************************************************************************************
 *		RaonK에서 사용하는 전역변수
/***************************************************************************************************/

var G_EditorID; // 에디터 전역변수
var G_EditorThumbNailID; // 에디터 썸네일 전역변수


/***************************************************************************************************
 *		개발사 자체 제작 함수
/***************************************************************************************************/


/**
 * RAONK 에디터를 초기화합니다.
 * @param {string} editorId - 에디터를 적용할 요소의 ID
 */
function raonkEditorInit(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/handler',
    ShowTopMenu: '0',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

/**
 * RAONK 에디터를 댓글용으로 초기화합니다.
 * @param {string} editorId - 에디터를 적용할 요소의 ID
 */

function raonkReplyEditorInit(editorId, lang) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/user/qna/handler',
    ShowTopMenu: '0',
    Height: '300px',
    Lang: lang,
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

/**
 * 지정된 holder에 RAONK 에디터를 초기화합니다.
 * @param {string} editorId - 에디터를 적용할 요소의 ID
 * @param {HTMLElement} holder - 에디터를 적용할 HTML 요소
 */

function raonkEditorHolderInit_qnaReplay(editorId, holder){
  var raonkParam = {
    Id: editorId,
    EditorHolder: holder,
    HandlerUrl: getContextPath() + '/raonkeditor/user/qna/handler',
    ShowTopMenu : "0",
    Height : "300px",
    Lang : 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonkParam);
}






// 관리자 페이지 > 분석 튜토리얼 관리 에디터
function raonkEditorInit_adminTutorial(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/tutorial/handler',
    ShowTopMenu: '0',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 관리자 페이지 > 집합교육일정 관리 에디터
function raonkEditorInit_adminEducation(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/education/handler',
    ShowTopMenu: '0',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 관리자 페이지 > 문의사항 관리 에디터
function raonkEditorInit_adminQna(editorId, holder) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/qna/handler',
    ShowTopMenu: '0',
    Height: '300px',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}


// 관리자 페이지 > 공지사항 관리 에디터
function raonkEditorInit_adminNotice(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/notice/handler',
    ShowTopMenu: '0',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 관리자 페이지 > 정보공유 관리 에디터
function raonkEditorInit_adminInfo(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/info/handler',
    ShowTopMenu: '0',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 관리자 페이지 > 소식 관리 에디터
function raonkEditorInit_adminNews(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/news/handler',
    ShowTopMenu: '0',
 	InitXml: 'raonkeditor_news.config.xml',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 관리자 페이지 > KOBICian’s Story 관리 에디터
function raonkEditorInit_adminKobicians(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/kobicians/handler',
    ShowTopMenu: '0',
 	InitXml: 'raonkeditor_kobicians.config.xml',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}


// 유저 페이지 > 문의사항 에디터
function raonkEditorInit_userQna(editorId, lang) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/user/qna/handler',
    ShowTopMenu: '0',
    Lang: lang,
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 유저 페이지 > 정보공유
function raonkEditorInit_userInfo(infoId, lang) {
  var raonParam = {
    Id: infoId,
    HandlerUrl: getContextPath() + '/raonkeditor/user/info/handler',
    ShowTopMenu: '0',
    Lang: lang,
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}

// 관리자 페이지 > 홍보영상 관리 에디터
function raonkEditorInit_adminVideo(editorId) {
  var raonParam = {
    Id: editorId,
    HandlerUrl: getContextPath() + '/raonkeditor/admin/video/handler',
    ShowTopMenu: '0',
    Lang: 'ko-kr',
	SkinName: 'gray'
  };
  var editor = new RAONKEditor(raonParam);
}





// 에디터가 생성되었는지 확인하는 함수
function isCreatedEditor() {
	
	if(G_EditorID === undefined) {
		return false; // 미생성
	}
	
	return true; // 생성	
}

// 에디터에 내용이 입력되었는지 확인하는 함수
function isWriteContent() {
		
	if ( RAONKEDITOR.IsEmpty(G_UploadID) ) {		
          RAONKEDITOR.setFocusToEditor(G_UploadID);
		  return false;
    }

	return true;
	
}


// 특정 에디터가 생성되었는지 확인하는 함수
function isCreatedEditorUseId(editorId) {
	
	if(editorId == null) {
		return false; // 미생성
	}	
	return true; // 생성	
}

// 특정 에디터에 내용이 입력되었는지 확인하는 함수
function isWriteContentUseId(editorId) {
		
	if ( RAONKEDITOR.IsEmpty(editorId) ) {		
          RAONKEDITOR.setFocusToEditor(editorId);
		  return false;
    }

	return true;
}


/** 에디터 내용을 input에 넣는 함수 */
function writeContent() {
				  	   
    // 에디터의 내용을 form 안의 input에 셋팅
    var fn_callback = function (paramObj) {	
            //document.getElementById("contentValue").value = paramObj.strData;
			 document.getElementById("contentValue").value = encodeURISpecialChars(paramObj.strData);					 
    }	
  
    RAONKEDITOR.GetHtmlContents({
        type: 'body',
        callback: fn_callback
    });

	RAONKEDITOR.GetHtmlContents({
        type: 'text',
        callback: 
            function (paramObj) {
                //document.getElementById("contentValueText").value = paramObj.strData;
				document.getElementById("contentValueText").value = encodeURISpecialChars(paramObj.strData);
            }	
    });

    return true;
}


function encodeURISpecialChars(str) {
    // '·' 문자를 '**'로 임시대체 _ bsi
    let replacedStr = str.replace(/·/g, '**');
    // 기본 URL 인코딩 적용
    let encodedStr = encodeURIComponent(replacedStr);
    return encodedStr;
}






/***************************************************************************************************
 *		K-EDITOR SAMPLE 
/***************************************************************************************************/





























/***************************************************************************************************
 *		이벤트 
/***************************************************************************************************/

// K Editor 생성완료 이벤트
function RAONKEDITOR_CreationComplete(editorId) {
	G_EditorID = editorId;
}


