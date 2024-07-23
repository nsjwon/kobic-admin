/** Youtube 영상을 위한 스크립트 */
$(document).ready(function() {

    // 상세화면 > 비디오 미리보기
    if ( $('#videoContent').length > 0 ) {
        const videoLink = $('#videoContent').attr('data-url');
        if ( checkUrl(videoLink) ) {
            preview(videoLink, 'videoContent');
        }
    }

	// [Admin > 게시판관리 > 홍보영상 > 수정] 비디오 미리보기 
    if ( $('#videoId').length > 0 ) {
        preview($('#videoLink').val(), 'videoPreview');
    }
});

/** 동영상 URL 입력 후, 포커스 아웃됐을 때 썸네일 Url 획득 및 동영상 미리보기 */
function getVideoThumbnail() {
    
    const videoLink = $('#videoLink').val();
    if ( !videoLink || videoLink.length < 1 ) return false;

    if ( checkUrl(videoLink) ) {

        // 유튜브 영상 아이디 추출 
        var regExp = /(?:\?v=|\/embed\/|\/\d{1,2}\/|\/vi?\/|\/v\/|\/e\/|youtu\.be\/|\/u\/\w\/|\/embed\/|\/v=|^v?\/|\/u\/\d+\/)?([a-zA-Z0-9_-]{11})/i;
        var match = videoLink.match(regExp);
        if ( match && match[1] ) {
            const videoId = match[1];
            // const videoThumbnailLink = 'https://img.youtube.com/vi/' + videoId + '/0.jpg';
            const videoThumbnailLink = 'https://img.youtube.com/vi/' + videoId + '/mqdefault.jpg';
            $('#videoThumbnail').val(videoThumbnailLink);
            
            // 동영상 미리보기
            preview(videoLink, 'videoPreview');
        } 
    }
}

/** URL 체크 */
function checkUrl(url) {
    if ( url == undefined || !url || url.length < 1 ) return false;
    const regExp = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/; 
    return regExp.test(url);
}

function preview(videoUrl, type) {
    //https://youtu.be/nB8wS8wOLxY
    var videoData = getOembedHtml(videoUrl);
    $('#' + type).html(videoData.html);
}

function getOembedHtml(videoUrl, maxWidth=850, maxHeight=400){
    var oembedUrl;
    // wild card conversion
    // / -> \/
    // ? -> \?
    // . -> \.
    // * -> .* (마지막)
    for(var i = 0; i < OEMBED_PROVIDER.length; i++){
        var endpoints = OEMBED_PROVIDER[i].endpoints[0];
        var schemes = endpoints.schemes;
        for(var j = 0; j < schemes.length; j++){
            if(videoUrl.match(schemes[j])){
                oembedUrl = endpoints.url;
            }
        }
    }

    if(oembedUrl !== undefined)	{
        // oembed정보 가져오기
        var url = oembedUrl.replace("{format}", "json").replace("{url}", encodeURIComponent(videoUrl));
        url += "&maxwidth="+maxWidth+"&maxheight="+maxHeight;
        var result;
        $.ajax({
            url:url,
            async:false,
            success: function(data){
                result= data;
            },
            error : function(e){
                result = undefiend;
            }
        }).fail(function(){console.log('fail')})
        return result;
    } else{
        console.log("oembed error");
    }
}