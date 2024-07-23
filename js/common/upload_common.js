/***************************************************************************************************
 *		RaonK에서 사용하는 전역변수
/***************************************************************************************************/

var G_UploadID; // 업로드 전역변수
var G_UploadThumbNailID; // 업로드 썸네일 전역변수


/***************************************************************************************************
 *		개발사 자체 제작 함수
/***************************************************************************************************/



function raonkUploadInit(uploadId) {
    var raonkParam = {
        Id: uploadId,
        FolderTransfer: '1',
        GetFolderInFile: '1',
        ButtonBarEdit:'add,add_forlder,send,remove,remove_all',
        Runtimes:'agent',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink
		SkinName: 'gray'        	
    }
    new RAONKUpload(raonkParam);
}


function raonkThumbUploadInit(uploadId) {
    var raonkParam = {
        Id: uploadId,
        mode: 'edit',
        ImgPreView: "1",
        ImgPreViewWidth: "320px",
        ImgPreViewHeight: "280px",
        Views: "thumbs",
        MaxOneFileSize: "100MB",
        MaxTotalFileSize: "100MB",
        MaxTotalFileCount: "1",
        ExtensionAllowOrLimit: '1',
        ExtensionArr: 'jpg,jpeg,png,gif',
        // HandlerUrl: get_context_path()+'/raonkupload/handler',
        // ViewerHandlerUrl: get_context_path()+'/raonkupload/handler/raonkviewer'
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink
		SkinName: 'gray'
    };
    var upload = new RAONKUpload(raonkParam); 
}







// 관리자 페이지 > 공지사항 업로드
function raonkUploadInit_adminNotice(uploadId) {
	
  var raonkParam = {

    Id: uploadId,
	HandlerUrl: getContextPath() + '/raonkupload/admin/notice/handler',
    FolderTransfer: '1',
    GetFolderInFile: '1',
    ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
    Runtimes:'html5', // agent, html5
	MaxTotalFileSize: "100MB", 	// 0 : 무제한
	MaxOneFileSize: "100MB", 	// 0 : 무제한
	FileNameRule: 'GUID',	 // GUID, REALFILENAME
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	SkinName: 'gray'	
	
  };
  var upload = new RAONKUpload(raonkParam);
}

// 관리자 페이지 > 공지사항 상세 다운로드
function raonkDownloadInit_adminNotice(uploadId) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,
	HandlerUrl: getContextPath() + '/raonkupload/admin/notice/handler',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink			
	SkinName: 'gray'    	
  };
  var upload = new RAONKUpload(raonkParam);
}



// 관리자 페이지 > 정보공유
function raonkUploadInit_adminInfo(uploadId) {
	
  var raonkParam = {

    Id: uploadId,
	HandlerUrl: getContextPath() + '/raonkupload/admin/info/handler',
    FolderTransfer: '1',
    GetFolderInFile: '1',
    ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
    Runtimes:'html5', // agent, html5
	MaxTotalFileSize: "100MB", 	// 0 : 무제한
	MaxOneFileSize: "100MB", 	// 0 : 무제한
	FileNameRule: 'GUID',	 // GUID, REALFILENAME
	SkinName: 'gray'	
	
  };
  var upload = new RAONKUpload(raonkParam);
}

// 관리자 페이지 > 공지사항 상세 다운로드
function raonkDownloadInit_adminInfo(uploadId) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,
	HandlerUrl: getContextPath() + '/raonkupload/admin/info/handler',
			AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink
	SkinName: 'gray'    	
  };
  var upload = new RAONKUpload(raonkParam);
}





// 관리자 페이지 > 집합교육일정 업로드
function raonkUploadInit_adminEducation(uploadId) {
	
  var raonkParam = {

    Id: uploadId,
	HandlerUrl: getContextPath() + '/raonkupload/admin/education/handler',
    FolderTransfer: '1',
    GetFolderInFile: '1',
    ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
    Runtimes:'html5', // agent, html5
	MaxTotalFileSize: "100MB", 	// 0 : 무제한
	MaxOneFileSize: "100MB", 	// 0 : 무제한
	FileNameRule: 'GUID',	 // GUID, REALFILENAME
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink		
	SkinName: 'gray'
	
  };
  var upload = new RAONKUpload(raonkParam);
}

// 관리자 페이지 > 집합교육 상세 다운로드
function raonkDownloadInit_adminEducation(uploadId) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,
	HandlerUrl: getContextPath() + '/raonkupload/admin/education/handler',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	SkinName: 'gray'    	
  };
  var upload = new RAONKUpload(raonkParam);
}





// 사용자 페이지 > 공지사항 상세 다운로드
function raonkDownloadInit_userNotice(uploadId, lang) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,	
	HandlerUrl: getContextPath() + '/raonkupload/user/notice/handler',
			AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink
	SkinName: 'gray',
	Lang: lang    	
  };
  var upload = new RAONKUpload(raonkParam);
}

// 사용자 페이지 > 집합교육 상세 다운로드
function raonkDownloadInit_userEducation(uploadId, lang) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,
	HandlerUrl: getContextPath() + '/raonkupload/user/education/handler',
	SkinName: 'gray',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	Lang: lang
  };
  var upload = new RAONKUpload(raonkParam);
}



// 사용자 페이지 > 문의사항 업로드
function raonkUploadInit_userQna(uploadId, lang) {
	
  var raonkParam = {

    Id: uploadId,
	HandlerUrl: getContextPath() + '/raonkupload/user/qna/handler',
    FolderTransfer: '1',
    GetFolderInFile: '1',
    ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
    Runtimes:'html5', // agent, html5
	MaxTotalFileSize: "100MB", 	// 0 : 무제한
	MaxOneFileSize: "100MB", 	// 0 : 무제한	
	FileNameRule: 'GUID',	 // GUID, REALFILENAME
	SkinName: 'gray',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	Lang: lang
	
  };
  var upload = new RAONKUpload(raonkParam);
}


// 사용자 페이지 > 문의사항 상세 다운로드
function raonkDownloadInit_userQna(uploadId, lang) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,
	HandlerUrl: getContextPath() + '/raonkupload/user/qna/handler',
	SkinName: 'gray'  ,
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	Lang: lang  	
  };
  var upload = new RAONKUpload(raonkParam);
}


// 사용자 페이지 > 정보공유 업로드
function raonkUploadInit_userInfo(uploadId, lang) {
	
  var raonkParam = {

    Id: uploadId,
	HandlerUrl: getContextPath() + '/raonkupload/user/info/handler',
    FolderTransfer: '1',
    GetFolderInFile: '1',
    ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
    Runtimes:'html5', // agent, html5
	MaxTotalFileSize: "100MB", 	// 0 : 무제한
	MaxOneFileSize: "100MB", 	// 0 : 무제한	
	FileNameRule: 'GUID',	 // GUID, REALFILENAME
	SkinName: 'gray',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	Lang: lang	
	
  };
  var upload = new RAONKUpload(raonkParam);
}


// 사용자 페이지 > 문의사항 상세 다운로드
function raonkDownloadInit_userInfo(uploadId, lang) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,
	HandlerUrl: getContextPath() + '/raonkupload/user/info/handler',
	SkinName: 'gray',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	Lang: lang    	
  };
  var upload = new RAONKUpload(raonkParam);
}



// 관리자 페이지 > 2차DB 썸네일 업로드
function raonkThumbUploadInit_adminOtherDb(uploadId) {
    var raonkParam = {
        Id: uploadId,
		HandlerUrl: getContextPath() + '/raonkupload/admin/otherdb/handler',
        mode: 'edit',
        ImgPreView: "1",
        ImgPreViewWidth: "640px",
        ImgPreViewHeight: "560px",
        Views: "thumbs",
        MaxOneFileSize: "100MB",
        MaxTotalFileSize: "100MB",
        MaxTotalFileCount: "1",
        ExtensionAllowOrLimit: '1',
        ExtensionArr: 'jpg,jpeg,png,gif',
		ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink		
		SkinName: 'gray'
    };
    var upload = new RAONKUpload(raonkParam); 
}

// 관리자 페이지 > 배너 이미지 업로드
function raonkThumbUploadInit_adminBanner(uploadId) {
    var raonkParam = {
        Id: uploadId,
		HandlerUrl: getContextPath() + '/raonkupload/admin/banner/handler',
        mode: 'edit',
        ImgPreView: "1",
        ImgPreViewWidth: "640px",
        ImgPreViewHeight: "560px",
        Views: "thumbs",
        MaxOneFileSize: "100MB",
        MaxTotalFileSize: "100MB",
        MaxTotalFileCount: "1",
        ExtensionAllowOrLimit: '1',
        ExtensionArr: 'jpg,jpeg,png,gif,svg',
		ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink		
		SkinName: 'gray'
    };
    var upload = new RAONKUpload(raonkParam); 
}





// 관리자 페이지 > 소식 관리
function raonkUploadInit_adminNews(uploadId) {
	
  var raonkParam = {

    Id: uploadId,
	HandlerUrl: getContextPath() + '/raonkupload/admin/news/handler',
    FolderTransfer: '1',
    GetFolderInFile: '1',
    ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
    Runtimes:'html5', // agent, html5
	MaxTotalFileSize: "100MB", 	// 0 : 무제한
	MaxOneFileSize: "100MB", 	// 0 : 무제한
	FileNameRule: 'GUID',	 // GUID, REALFILENAME
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	SkinName: 'gray'	
	
  };
  var upload = new RAONKUpload(raonkParam);
}

// 관리자 페이지 > 뉴스 썸네일 업로드
function raonkThumbUploadInit_adminNews(uploadId) {
    var raonkParam = {
        Id: uploadId,
		HandlerUrl: getContextPath() + '/raonkupload/admin/news/handler',
        mode: 'edit',
        ImgPreView: "1",
        ImgPreViewWidth: "640px",
        ImgPreViewHeight: "560px",
        Views: "thumbs",
        MaxOneFileSize: "100MB",
        MaxTotalFileSize: "100MB",
        MaxTotalFileCount: "1",
        ExtensionAllowOrLimit: '1',
        ExtensionArr: 'jpg,jpeg,png,gif',
		ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink		
		SkinName: 'gray'
    };
    var upload = new RAONKUpload(raonkParam);
}



// 관리자 페이지 > 소식관리 상세 다운로드
function raonkDownloadInit_adminNews(uploadId, lang) {
	
  var raonkParam = {
    Id: uploadId,
	Mode: "download",
	InitVisible: true,	
	HandlerUrl: getContextPath() + '/raonkupload/admin/news/handler',
	SkinName: 'gray',
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink	
	Lang: lang
  };
  var upload = new RAONKUpload(raonkParam);
}


// 관리자 페이지 > 2차DB 썸네일 업로드
function raonkThumbUploadInit_adminNews(uploadId) {

    var raonkParam = {
        Id: uploadId,
		HandlerUrl: getContextPath() + '/raonkupload/admin/news/handler',
        mode: 'download',
        ImgPreView: "1",
        ImgPreViewWidth: "640px",
        ImgPreViewHeight: "560px",
        Views: "thumbs",
        MaxOneFileSize: "100MB",
        MaxTotalFileSize: "100MB",
        MaxTotalFileCount: "1",
        ExtensionAllowOrLimit: '1',
        ExtensionArr: 'jpg,jpeg,png,gif',

		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink

		SkinName: 'gray'		
    };
    var upload = new RAONKUpload(raonkParam); 
}


// 관리자 페이지 > KOBICian’s Story 썸네일 업로드
function raonkThumbUploadInit_adminKobicians(uploadId) {
    var raonkParam = {
        Id: uploadId,
		HandlerUrl: getContextPath() + '/raonkupload/admin/kobicians/handler',
        mode: 'edit',
        ImgPreView: "1",
        ImgPreViewWidth: "640px",
        ImgPreViewHeight: "560px",
        Views: "thumbs",
        MaxOneFileSize: "100MB",
        MaxTotalFileSize: "100MB",
        MaxTotalFileCount: "1",
        ExtensionAllowOrLimit: '1',
        ExtensionArr: 'jpg,jpeg,png,gif',
		ButtonBarEdit:'add,add_forlder,remove,remove_all', // add,add_forlder,send,remove,remove_all
		AutoUrlDetect: '0', // not auto hyperLink
		ValidateUrlLink: '0', // not check hyperLink		
		SkinName: 'gray'
    };
    var upload = new RAONKUpload(raonkParam);
}





// 업로드가 생성되었는지 확인하는 함수
function isCreatedUploader() {
	
	if(G_UploadID === undefined) {
		return false; // 미생성
	}	
	return true; // 생성
}









/***************************************************************************************************
 *		K-UPLOAD SAMPLE 
/***************************************************************************************************/

// 멀티 업로드
function fn_transferUpload() {
    RAONKUPLOAD.MultiTransfer();
}


// 전송시작
function fn_transfer(currUploadID) {
	
    if (currUploadID) {
        RAONKUPLOAD.Transfer(currUploadID);
    } else {
        RAONKUPLOAD.Transfer(G_UploadID);
    }
}

// 파일추가 
function fn_openFileDialog(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.OpenFileDialog(currUploadID);
    } else {
        RAONKUPLOAD.OpenFileDialog(G_UploadID);
    }
}

// 모든 파일삭제
function fn_deleteAllFile(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.DeleteAllFile(currUploadID);
    } else {
        RAONKUPLOAD.DeleteAllFile(G_UploadID);
    }
}

// 선택한 파일삭제
function fn_deleteSelectedFile(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.DeleteSelectedFile(currUploadID);
    } else {
        RAONKUPLOAD.DeleteSelectedFile(G_UploadID);
    }
}

// 선택한 파일 다운로드
function fn_downloadFile(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.DownloadFile(currUploadID);
    } else {
        RAONKUPLOAD.DownloadFile(G_UploadID);
    }
}

// 모든파일 다운로드
function fn_downloadAllFile(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.DownloadAllFile(currUploadID);
    } else {
        RAONKUPLOAD.DownloadAllFile(G_UploadID);
    }
}

// 전체 파일개수
function fn_getTotalFileCount(currUploadID) {
    if (currUploadID) {
        alert(RAONKUPLOAD.GetTotalFileCount(currUploadID));
    } else {
        alert(RAONKUPLOAD.GetTotalFileCount(G_UploadID));
    }
}

// 전체 파일크기(Bytes)
function fn_getTotalFileSize(currUploadID) {
    if (currUploadID) {
        alert(RAONKUPLOAD.GetTotalFileSize(currUploadID));
    } else {
        alert(RAONKUPLOAD.GetTotalFileSize(G_UploadID));
    }
}

// 업로드 모드 변경
function fn_setUploadMode(mode, currUploadID) {
    // mode : edit / view / open / download
    if (currUploadID) {
        RAONKUPLOAD.SetUploadMode(mode, currUploadID);
    } else {
        RAONKUPLOAD.SetUploadMode(mode, G_UploadID);
    }
}

// 업로드 보이기
function fn_uploadShow(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.Show(currUploadID);
    } else {
        RAONKUPLOAD.Show(G_UploadID);
    }
}

// 업로드 숨기기
function fn_uploadHidden(currUploadID) {
    if (currUploadID) {
        RAONKUPLOAD.Hidden(currUploadID);
    } else {
        RAONKUPLOAD.Hidden(G_UploadID);
    }
}


function fn_addFile(files) {
	
	for(var i = 0; i < files.length; i++){
		// console.log(i+1, files[i].originalName , files[i].uploadPath , files[i].size, files[i].customValue, G_UploadID);
        // RAONKUPLOAD.AddUploadedFile(i+1, files[i].originalName , files[i].uploadPath , files[i].size, files[i].customValue, G_UploadID);
		RAONKUPLOAD.AddUploadedFile(i+1, files[i].attachmentName , getContextPath() + files[i].attachmentLocation , files[i].attachmentSize, files[i].attachmentId, G_UploadID);

	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// UTIL
//////////////////////////////////////////////////////////////////////////////////////////////////
function fn_RPAD(s, c, n) {
    if (!s || !c || s.length >= n) {
        return s;
    }

    var max = (n - s.length) / c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }

    return s;
}

// array
function fn_newArrayToString(arrayNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('IsLargeFile', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('CustomValue', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var customValue = '';
    var responseCustomValue = '';
    var order = '';
    var isLargeFile = '';

    var fileLen = arrayNew.length;
    for (var i = 0; i < fileLen; i++){

        originalName += arrayNew[i].originalName;
        uploadName += arrayNew[i].uploadName;
        isLargeFile += arrayNew[i].isLargeFile;
        size += arrayNew[i].size;
        uploadPath += arrayNew[i].uploadPath;
        logicalPath += arrayNew[i].logicalPath;
        fileExtension += arrayNew[i].extension;
        localPath += arrayNew[i].localPath;
        customValue += arrayNew[i].customValue;
        responseCustomValue += arrayNew[i].responseCustomValue;
        order += arrayNew[i].order;

        if (i != fileLen - 1) {
            originalName += ',';
            uploadName += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            customValue += ',';
            responseCustomValue += ',';
            order += ',';
            isLargeFile += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', isLargeFile);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', customValue);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

function fn_delArrayToString(arrayDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/><br/>';
    str += '-- 삭제된 파일 정보 끝 --<br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    var filesArrLen = arrayDel.length;
    for (var i = 0; i < filesArrLen; i++) {
        sUniqKey += arrayDel[i].uniqKey;
        sOriginalName += arrayDel[i].originalName;
        sSize += arrayDel[i].size;

        if (i != filesArrLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var log = document.getElementById("logBox");
    
}

// text
function fn_newTextToString(textNew, uploadID) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('IsLargeFile', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('CustomValue', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var customValue = '';
    var responseCustomValue = '';
    var order = '';
    var isLargeFile = '';

    var filesArr = textNew.split(RAONKUPLOAD.GetUploadByName(uploadID)._config.unitDelimiter);
    var filesArrLen = filesArr.length;
    for (var i = 0; i < filesArrLen; i++) {
        var oneFileAttr = filesArr[i].split(RAONKUPLOAD.GetUploadByName(uploadID)._config.unitAttributeDelimiter);

        originalName += oneFileAttr[0];
        uploadName += oneFileAttr[1];
        isLargeFile += oneFileAttr[10];
        size += oneFileAttr[2];
        uploadPath += oneFileAttr[3];
        logicalPath += oneFileAttr[5];
        fileExtension += oneFileAttr[6];
        localPath += oneFileAttr[7];
        customValue += oneFileAttr[8];
        responseCustomValue += oneFileAttr[9];
        order += oneFileAttr[11];

        if (i != filesArrLen - 1) {
            originalName += ',';
            uploadName += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            customValue += ',';
            responseCustomValue += ',';
            order += ',';
            isLargeFile += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', isLargeFile);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', customValue);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

function fn_delTextToString(textDel, uploadID) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/>';
    var str = '-- 삭제된 파일 정보 끝--<br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    var filesArr = textDel.split(RAONKUPLOAD.GetUploadByName(uploadID)._config.unitDelimiter);
    var filesArrLen = filesArr.length;
    for (var i = 0; i < filesArrLen; i++) {
        var oneFileAttr = filesArr[i].split(RAONKUPLOAD.GetUploadByName(uploadID)._config.unitAttributeDelimiter);

        sUniqKey += oneFileAttr[0];
        sOriginalName += oneFileAttr[1];
        sSize += oneFileAttr[2];

        if (i != filesArrLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

// json
function fn_newJsonToString(jsonNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('IsLargeFile', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('CustomValue', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = jsonNew.originalName;
    var uploadName = jsonNew.uploadName;
    var isLargeFile = jsonNew.isLargeFile;
    var size = jsonNew.size;
    var uploadPath = jsonNew.uploadPath;
    var logicalPath = jsonNew.logicalPath;
    var fileExtension = jsonNew.extension;
    var localPath = jsonNew.localPath;
    var customValue = jsonNew.customValue;
    var responseCustomValue = jsonNew.responseCustomValue;
    var order = jsonNew.order;

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', isLargeFile);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', customValue);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

function fn_delJsonToString(jsonDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/>';
    str += '-- 삭제된 파일 정보 끝 --<br/>';

    var uniqKey = jsonDel.uniqKey;
    var originalName = jsonDel.originalName;
    var size = jsonDel.size;

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    for (var i = 0; i < originalName.length; i++) {
        if (i != 0) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }

        sUniqKey += uniqKey[i];
        sOriginalName += originalName[i];
        sSize += size[i];
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

// xml
function fn_newXmlToString(xmlNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('IsLargeFile', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('CustomValue', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var customValue = '';
    var responseCustomValue = '';
    var order = '';
    var isLargeFile = '';

    var files = $(xmlNew).find('file');
    var filesLen = files.length;
    for (var i = 0; i < filesLen; i++) {

        originalName += $(files[i]).find('originalName').text();
        uploadName += $(files[i]).find('uploadName').text();
        isLargeFile += $(files[i]).find('isLargeFile').text();
        size += $(files[i]).find('size').text();
        uploadPath += $(files[i]).find('uploadPath').text();
        logicalPath += $(files[i]).find('logicalPath').text();
        fileExtension += $(files[i]).find('extension').text();
        localPath += $(files[i]).find('localPath').text();
        customValue += $(files[i]).find('customValue').text();
        responseCustomValue += $(files[i]).find('responseCustomValue').text();
        order += $(files[i]).find('order').text();

        if (i != filesLen - 1) {
            originalName += ',';
            uploadName += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            customValue += ',';
            responseCustomValue += ',';
            order += ',';
            isLargeFile += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', isLargeFile);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', customValue);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

function fn_delXmlToString(xmlDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/>';
    var str = '-- 삭제된 파일 정보 --<br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    var files = $(xmlDel).find('file');
    var filesLen = files.length;
    for (var i = 0; i < filesLen; i++) {
        sUniqKey += $(files[i]).find('uniqKey').text();
        sOriginalName += $(files[i]).find('originalName').text();
        sSize += $(files[i]).find('size').text();

        if (i != filesLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}



















/***************************************************************************************************
 *		이벤트 
/***************************************************************************************************/

function RAONKUPLOAD_CreationComplete(uploadID) {
    G_UploadID = uploadID;
	RAONKUPLOAD.AddFormData('SSO', userId, uploadID);
    fn_addFile(files);
}

// 전송 전 이벤트
function RAONKUPLOAD_BeforeUpload(uploadID) {	    
	G_UploadID = uploadID;
}




// 오류 이벤트
function RAONKUPLOAD_OnError(uploadID, paramObj) {
		  
    if (paramObj.arrUploadedFileList != null && paramObj.arrUploadedFileList != '') {

        var uploadedFileLen = paramObj.arrUploadedFileList.length;
        
	for (var i = 0; i < uploadedFileLen; i++) {
            		
            // originName: paramObj.arrUploadedFileList[i].originName
            // fileSize: paramObj.arrUploadedFileList[i].fileSize
            // uploadName: paramObj.arrUploadedFileList[i].uploadName
            // uploadPath: paramObj.arrUploadedFileList[i].uploadPath
            // logicalPath: paramObj.arrUploadedFileList[i].logicalPath
            // order: paramObj.arrUploadedFileList[i].order
            // status: paramObj.arrUploadedFileList[i].status
            // customValue: paramObj.arrUploadedFileList[i].customValue
            // responseCustomValue: paramObj.arrUploadedFileList[i].responseCustomValue
        }
    }
}

// 취소 이벤트
function RAONKUPLOAD_UploadingCancel(uploadID, paramObj) {
    G_UploadID = uploadID;

    var logBox = document.getElementById("logBox");
    logBox.innerHTML += '전송 취소 이벤트 : ' + G_UploadID + '<br/>';

    if (paramObj.arrUploadedFileList != null && paramObj.arrUploadedFileList != '') {
        logBox.innerHTML += '업로드 된 파일 리스트 - <br/>';
        var uploadedFileLen = paramObj.arrUploadedFileList.length;
        for (var i = 0; i < uploadedFileLen; i++) {
            logBox.innerHTML += paramObj.arrUploadedFileList[i].uploadName + ', ' + paramObj.arrUploadedFileList[i].uploadPath + '</br>';

            // originName: paramObj.arrUploadedFileList[i].originName
            // fileSize: paramObj.arrUploadedFileList[i].fileSize
            // uploadName: paramObj.arrUploadedFileList[i].uploadName
            // uploadPath: paramObj.arrUploadedFileList[i].uploadPath
            // logicalPath: paramObj.arrUploadedFileList[i].logicalPath
            // order: paramObj.arrUploadedFileList[i].order
            // status: paramObj.arrUploadedFileList[i].status
            // customValue: paramObj.arrUploadedFileList[i].customValue
            // responseCustomValue: paramObj.arrUploadedFileList[i].responseCustomValue
        }
    }
}