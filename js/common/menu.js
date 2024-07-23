/** 메뉴 */
$(document).ready(function() {
    
    // 상단 메뉴 열기 
    $('#gnb > li').mouseover(function() {
        $(this).siblings().removeClass('gnb-ov');
        $('#headerIn').removeClass('header-ov-bf').addClass('header-ov');
        $(this).addClass('gnb-ov');
        if (!$(".header-ov .gnb-sub-menu").is(":animated")) {
            $(".header-ov .gnb-sub-menu").slideDown(200);
        }
        // $('.header-ov .gnb-sub-menu').slideDown(200)
    });

    // 상단 메뉴 닫기 
    $('#headerIn').mouseleave(function() {
        if (!$(".header-ov .gnb-sub-menu").is(":animated")) {
            $(".header-ov .gnb-sub-menu").slideUp(200);
        }
        // $('.header-ov .gnb-sub-menu').slideUp(200);
        $(this).removeClass('header-ov').addClass('header-ov-bf');
        $('ul.gnb-inner').children('li').removeClass('gnb-ov');
    });

    // 중간 메뉴 클릭 이벤트 (side_nav.html)  
    $('li.snb-item').click(function() {
        $(this).siblings().find('a').removeClass('snb-ov');
        $(this).children('a').toggleClass('snb-ov');
    });
    // 중간 메뉴 포커스 아웃
    $('li.snb-item').focusout(function(e) {
		if ( e.relatedTarget == null ) {
	        $(this).find('a').removeClass('snb-ov');
		}
    });

    // 모바일 메뉴 열기
    $('#m-nav-wrap').click(function() {
        $(this).addClass('m-nav-ov');
    });
    // 모바일 서브 메뉴 
    $('#m-gnb > li').click(function() {
        $(this).siblings().removeClass('m-gnb-ov');
        $(this).toggleClass('m-gnb-ov');
    });
});

