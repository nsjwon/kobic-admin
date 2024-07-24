// 탭 전환 효과
$(document).ready(function() {
    // li 요소를 클릭했을 때 이벤트 핸들러
    $('.brd-tab-list li').on('click', function() {
        // 모든 li 요소에서 focus 클래스를 제거합니다.
        $('.brd-tab-list li').removeClass('focus');
        
        // 클릭된 li 요소에 focus 클래스를 추가합니다.
        $(this).addClass('focus');
    });
});


//팝업 이벤트
$(document).ready(function() {
    $(".selectable").click(function(event) {
        $(".selectable").removeClass("select");
        $(this).toggleClass("select");
    });
});

$(document).ready(function() {
    const body = $('body')[0];
    // 팝업 열기 버튼 클릭 이벤트
    $('.popup-button').click(function() {
        var target = $(this).data('target');
        $(target).show();
        //본문창 스크롤 막기
        $('body').addClass('scrollLock');
    });
    
    // 팝업 닫기 버튼 클릭 이벤트
    $('.popup-panel .close-button').click(function() {
        $(this).closest('.popup-panel').hide();
        //본문창 스크롤 막기 해제
        $('body').removeClass('scrollLock');
    });
});