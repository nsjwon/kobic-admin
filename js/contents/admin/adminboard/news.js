// 소식 링크 추가

/*
function addLink() {

    var linkCount = $('.brd-link-item').length;
    
    var newElStr = '';
    newElStr += '<div class="brd-link-item">';
    newElStr +=     '<label for="newsLinkName" class="hidden">링크제목</label>';
    newElStr +=     '<input type="text" name="newsLinkNameArr" id="newsLinkName" value="" placeholder="링크제목을 입력하세요." class="news-link-tit w30"> ';
    newElStr +=     '<label for="newsLinkUrl" class="hidden">링크주소</label>';    
    newElStr +=     '<input type="text" name="newsLinkUrlArr" id="newsLinkUrl" value="" placeholder="링크주소를 입력하세요." class="news-link-url w40">';
    newElStr +=     '<div class="brd-link-btn">';
    newElStr +=         '<label for="newsLinkDelBtn" class="hidden">링크삭제</label>';
    newElStr +=         '<input type="button" class="btn btn-blue-gray" value="삭제" name="newsLinkDelBtn" id="newsLinkDelBtn" onclick="delLink(this);">';
    newElStr +=         '<label for="newsLinkAddBtn" class="hidden">링크추가</label>';
    newElStr +=         '<input type="button" class="btn btn-blue" value="추가" name="newsLinkAddBtn" id="newsLinkAddBtn" onclick="addLink();">';
    newElStr +=     '</div>';
    newElStr += '</div>';

    // 링크 추가 
    $('.brd-link-item:last').after(newElStr);
    
    linkCount = $('.brd-link-item').length;
    if ( linkCount > 1 && $('input[name="newsLinkDelBtn"]:first').hasClass('btn-disabled') ) {
        // 링크 개수가 2개 이상인 경우, 첫번째 삭제 버튼 활성화
        $('input[name="newsLinkDelBtn"]:first').removeClass('btn-disabled');
        $('input[name="newsLinkDelBtn"]:first').addClass('btn-blue-gray');
        $('input[name="newsLinkDelBtn"]:first').attr('disabled', false);
    }

    // 마지막 링크에만 [추가] 버튼 
    $('input[name="newsLinkAddBtn"]:not(:last)').addClass('hidden');
}
*/

function addLink() {
    var linkCount = $('.brd-link-item').length;
    
    // 각 입력 필드에 고유 ID를 부여하기 위한 인덱스를 linkCount와 함께 사용합니다.
    var linkNameId = 'newsLinkName' + linkCount;
    var linkUrlId = 'newsLinkUrl' + linkCount;
    var linkDelBtnId = 'newsLinkDelBtn' + linkCount;
    var linkAddBtnId = 'newsLinkAddBtn' + linkCount;

    var newElStr = '';
    newElStr += '<div class="brd-link-item">';
    newElStr +=     '<label for="' + linkNameId + '" class="hidden">링크제목</label>';
    newElStr +=     '<input type="text" name="newsLinkNameArr" id="' + linkNameId + '" value="" placeholder="링크제목을 입력하세요." class="news-link-tit w30"> ';
    newElStr +=     '<label for="' + linkUrlId + '" class="hidden">링크주소</label>';    
    newElStr +=     '<input type="text" name="newsLinkUrlArr" id="' + linkUrlId + '" value="" placeholder="링크주소를 입력하세요." class="news-link-url w40">';
    newElStr +=     '<div class="brd-link-btn">';
    newElStr +=         '<label for="' + linkDelBtnId + '" class="hidden">링크삭제</label>';
    newElStr +=         '<input type="button" class="btn btn-blue-gray" value="삭제" name="newsLinkDelBtn" id="' + linkDelBtnId + '" onclick="delLink(this);">';
    newElStr +=         '<label for="' + linkAddBtnId + '" class="hidden">링크추가</label>';
    newElStr +=         '<input type="button" class="btn btn-blue" value="추가" name="newsLinkAddBtn" id="' + linkAddBtnId + '" onclick="addLink();">';
    newElStr +=     '</div>';
    newElStr += '</div>';

    // 링크 추가 
    $('.brd-link-item:last').after(newElStr);
    
    // 링크 개수 갱신
    linkCount = $('.brd-link-item').length;
    if ( linkCount > 1 && $('input[name="newsLinkDelBtn"]:first').hasClass('btn-disabled') ) {
        // 링크 개수가 2개 이상인 경우, 첫번째 삭제 버튼 활성화
        $('input[name="newsLinkDelBtn"]:first').removeClass('btn-disabled').addClass('btn-blue-gray').prop('disabled', false);
    }

    // 마지막 링크에만 [추가] 버튼 보이기
    $('input[name="newsLinkAddBtn"]:not(:last)').addClass('hidden');
}






// 소식 링크 삭제
function delLink(el) {

    var elParent = $(el).parent('div.brd-link-btn').parent('div.brd-link-item');
    var linkIndex = $(elParent).index();
    var linkCount = $('.brd-link-item').length;

    // 마지막 요소를 삭제하는 경우, 이전 요소에 [추가] 버튼 표출
    if ( linkCount == linkIndex + 1 ) {
        $(elParent).prev().find('#newsLinkAddBtn').removeClass('hidden');
    }

    // 링크 삭제 
    $(elParent).remove();
   
    // 요소 삭제 시, 링크가 1개 남는 경우 삭제 버튼 비활성화
    linkCount = $('.brd-link-item').length;
    if ( linkCount < 2 ) {
        $('input[name="newsLinkDelBtn"]:first').removeClass('btn-blue-gray');
        $('input[name="newsLinkDelBtn"]:first').addClass('btn-disabled');
        $('input[name="newsLinkDelBtn"]:first').attr('disabled', true);
    }
 
}