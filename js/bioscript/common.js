$(document).ready(function() {

	// 최상단으로 
	window.onload = function() {
		setTimeout(function() {
			scrollTo(0, 0);
		}, 100);
		
		// top_popup이 있으면 보임(새로고침시 top_popup내 글자 위치가 변경되는 현상이 있으므로 페이지 로드후 class 추가)
		if ( $("#tpop_check").val() == 1 ) {
			$("body").addClass("popup_on");
			$(".tpopup-wrap").removeClass("Dis_none");
		}
	};

//	// main
//	if ( window.location.pathname == "/bioexpress/") {
//		// 마우스 휠 사용 시에도 Scroll Down 버튼 누른것처럼 공지사항으로 내려감.
//		var scrollableElement = document.body;
//		scrollableElement.addEventListener('wheel', checkScrollDirection);
//		function checkScrollDirection(event) {
//		  if (!checkScrollDirectionIsUp(event)) {
//		    if ( window.pageYOffset < window.innerHeight ) {
//	        	window.scrollTo({top : window.innerHeight, behavior: 'smooth'});
//			}
//		  }
//		}
//	
//		function checkScrollDirectionIsUp(event) {
//		  if (event.wheelDelta) {
//		    return event.wheelDelta > 0;
//		  }
//		  return event.deltaY < 0;
//		}
//	}
	
    /* 텝 */
    const tabList = document.querySelectorAll('.tab_default .tab_list li');
    const contents = document.querySelectorAll('.tab_box .tab_cont')
    let activeCont = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

    for(var i = 0; i < tabList.length; i++){
        tabList[i].querySelector('.tab_tit').addEventListener('click', function(e){
            e.preventDefault();
            for(var j = 0; j < tabList.length; j++){
                // 나머지 버튼 클래스 제거
                tabList[j].classList.remove('t_on');

                // 나머지 컨텐츠 display:none 처리
                contents[j].style.display = 'none';
            }

            // 버튼 관련 이벤트
            this.parentNode.classList.add('t_on');

            // 버튼 클릭시 컨텐츠 전환
            activeCont = this.getAttribute('href');
            document.querySelector(activeCont).style.display = 'block';
        });
    }


    // 상단 메뉴
	$(".gnb > li, .header_bg").on({
		mouseover: function() {
			$(this).find(".gnb_on").addClass("gnb_ov");
			$("#header").addClass("header_on");
		},
		mouseleave: function() {
			$(this).find(".gnb_on").removeClass("gnb_ov");
			$("#header").removeClass("header_on");
		}
	});


    $('.pp_check_box > ul').scroll(function(){
        $('body').removeClass('scrollDown');
        $('body').removeClass('scrollUp');
    });

    $(window).scroll(function(){
        // 스크롤시 body에 class 추가
        if($(window).scrollTop() <= 200) {
            $('body').removeClass('scrollUp');
            $('body').removeClass('scrollDown');
        }else{
            $('body').addClass('scrollDown');
        }

        $(window).on('scroll', function(e){
            var E = e.originalEvent;
            delta = 0;
            if (E.detail) {
                delta = E.detail * -40;
            }else{
                delta = E.wheelDelta;
            }

            if(delta < 0 && $(window).scrollTop() > 50) {
                if(!$('body').hasClass('scrollDown')) {
                    $('body').addClass('scrollDown');
                    $('body').removeClass('scrollUp');
                }
            }
            if(delta > 0 && $(window).scrollTop() > 50) {
                if(!$('body').hasClass('scrollUp')) {
                    $('body').addClass('scrollUp');
                    $('body').removeClass('scrollDown');
                }
            }
            if($(window).scrollTop() <= 50) {
                if($('body').hasClass('scrollUp')) {
                    $('body').removeClass('scrollUp');
                }
                if($('body').hasClass('scrollDown')) {
                    $('body').removeClass('scrollDown');
                }
            }

        });

        // top으로 가기 클래스 추가
        if($(this).scrollTop() > 100 ) {
            $("#top_btn").addClass("go_on");
        }
        else {
            $("#top_btn").removeClass("go_on");
        }

    });


    // top으로 가기
    $("#top_btn").click(function(){
        window.scrollTo({top : 0, behavior: 'smooth'});
    });


    // 공지로 가기
    $(".scr-down-arrow").click(function(){
        window.scrollTo({top : window.innerHeight, behavior: 'smooth'});
    });



    // 레이어팝업
    // jQuery 환경에서만 작동할 수 있게 처리
    if (typeof jQuery === "undefined") throw new Error("Modal requires jQuery.");

    // 레이어 팝업 열기 버튼 클릭 시 팝업 보이기
    //$(".open_lp").on("click", function() {
	$(document).on("click", ".open_lp", function() {
        var op = $(this);
        var lp = $("#" + $(this).attr("aria-controls"));
        var lpObj = lp.children(".layer_pop_inner");
        var lpObjClose = lp.find(".layer_pop_close, .quick_close");
        var lpObjTabbable = lpObj.find("a, button, input:not([type='hidden']), select, iframe, textarea, [href], [tabindex]:not([tabindex='-1'])");
        var lpObjTabbableFirst = lpObjTabbable && lpObjTabbable.first();
        var lpObjTabbableLast = lpObjTabbable && lpObjTabbable.last();
        var lpOuterObjHidden = $("#skip_nav, #header, #footer, #wrap"); // 레이어 바깥 영역의 요소
        var all = $("#header, #footer").add(lp);
        var tabDisable;
        var nowScrollPos = $(window).scrollTop();

        $("body").css("top", - nowScrollPos).addClass("scroll-off").on("scroll touchmove mousewheel", function(event){
            event.preventDefault(); // iOS 레이어 열린 상태에서 body 스크롤되는 문제 방지
        });

        function lpClose() { // 레이어 닫기 함수
            $("body").removeClass("scroll-off").css("top", "").off("scroll touchmove mousewheel");
            $(window).scrollTop(nowScrollPos); // 레이어 닫은 후 화면 최상단으로 이동 방지
            if (tabDisable === true) lpObj.attr("tabindex", "-1");
            all.removeClass("on");
            lpOuterObjHidden.removeAttr("aria-hidden");
            op.focus(); // 레이어 닫은 후 원래 있던 곳으로 초점 이동
            $(document).off("keydown.lp_keydown");
        }

        $(this).blur();
        all.addClass("on");
        lpOuterObjHidden.attr("aria-hidden", "true"); // 레이어 바깥 영역을 스크린리더가 읽지 않게
        lpObjTabbable.length ? lpObjTabbableFirst.focus().on("keydown", function(event) {
            // 레이어 열리자마자 초점 받을 수 있는 첫번째 요소로 초점 이동
            if (event.shiftKey && (event.keyCode || event.which) === 9) {
                // Shift + Tab키 : 초점 받을 수 있는 첫번째 요소에서 마지막 요소로 초점 이동
                event.preventDefault();
                lpObjTabbableLast.focus();
            }
        }) : lpObj.attr("tabindex", "0").focus().on("keydown", function(event){
            tabDisable = true;
            if ((event.keyCode || event.which) === 9) event.preventDefault();
            // Tab키 / Shift + Tab키 : 초점 받을 수 있는 요소가 없을 경우 레이어 밖으로 초점 이동 안되게
        });

        lpObjTabbableLast.on("keydown", function(event) {
            if (!event.shiftKey && (event.keyCode || event.which) === 9) {
                // Tab키 : 초점 받을 수 있는 마지막 요소에서 첫번째 요소으로 초점 이동
                event.preventDefault();
                lpObjTabbableFirst.focus();
            }
        });

        lpObjClose.on("click", lpClose); // 닫기 버튼 클릭 시 레이어 닫기

        $(".layer_pop_bg").on("click", function(event){
            if (event.target === event.currentTarget) {
                // 반투명 배경 클릭 시 레이어 닫기
                lpClose();
            }
        });

        $(document).on("keydown.lp_keydown", function(event) {
            // Esc키 : 레이어 닫기
            var keyType = event.keyCode || event.which;

            if (keyType === 27 && lp.hasClass("on")) {
            lpClose();
            }
        });
    });
//
//    //숫자 카운팅
//    $('.num').each(function() {
//        var $this = $(this),
//            countTo = $this.attr('data-count');
//
//        $({ countNum: $this.text()}).animate({
//          countNum: countTo
//        },
//        {
//          duration: 1000,
//          easing:'linear',
//          step: function() {
//            $this.text(numberWithCommas(Math.floor(this.countNum)));
//          },
//          complete: function() {
//            $this.text(numberWithCommas(Math.floor(this.countNum)));
//          }
//        });
//
//        function numberWithCommas(x) {
//            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//        }
//    });

    AOS.init({
        offset: 120,
        delay: 0,
        duration: 900,
        easing: 'ease',
        once: true,
        mirror: false,
        disable: false, // 'phone', 'tablet', 'mobile'
    });

    // 비쥬얼 슬라이드
    new Swiper('.mvisual-wrap', {
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        slidesPerView: 1, //한번에 보여지는 페이지 숫자
        spaceBetween: 0, //페이지와 페이지 사이의 간격
        centeredSlides: true, //센터모드
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
        allowTouchMove : true, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
        watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
        loop : false,  // 슬라이드 반복 여부
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        // 페이지 전환효과 slidesPerView효과와 같이 사용 불가
        effect: 'fade',

        //키보드 페이지 이동
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        //방향표
        navigation: {
            //다음페이지 설정
            nextEl: '.swiper-button-next',
            //이전페이지 설정
            prevEl: '.swiper-button-prev',
        },
        //접근성
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
        },
        //페이징
        pagination: {
            //페이지 기능
            el: '.swiper-pagination',
            //클릭 가능여부
            clickable: false,
        },
        observer: true,	// 추가
        observeParents: true,	// 추가
    });



    // 공지 슬라이드
    new Swiper('.notice_list', {
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        slidesPerView: 3, //한번에 보여지는 페이지 숫자
        spaceBetween: 40, //페이지와 페이지 사이의 간격
        centeredSlides: false, //센터모드
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
        allowTouchMove : true, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
        watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
        loop : false,  // 슬라이드 반복 여부
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        // 페이지 전환효과 slidesPerView효과와 같이 사용 불가
        // effect: 'fade',

        //키보드 페이지 이동
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        //방향표
        navigation: {
            //다음페이지 설정
            nextEl: '.swiper-button-next',
            //이전페이지 설정
            prevEl: '.swiper-button-prev',
        },
        //접근성
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
        },
        //페이징
        pagination: {
            //페이지 기능
            el: '.swiper-pagination',
            //클릭 가능여부
            clickable: false,
        },
        observer: true,	// 추가
        observeParents: true,	// 추가
    });


    // 상단팝업 슬라이드
    new Swiper('.popup_list', {
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        slidesPerView: 1, //한번에 보여지는 페이지 숫자
        spaceBetween: 0, //페이지와 페이지 사이의 간격
        centeredSlides: false, //센터모드
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
        allowTouchMove : true, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
        watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
        loop : true,  // 슬라이드 반복 여부
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        // 페이지 전환효과 slidesPerView효과와 같이 사용 불가
        // effect: 'fade',

        //키보드 페이지 이동
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        //방향표
        navigation: {
            //다음페이지 설정
            nextEl: '.swiper-button-next',
            //이전페이지 설정
            prevEl: '.swiper-button-prev',
        },
        //접근성
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
        },
        //페이징
        pagination: {
            //페이지 기능
            el: '.swiper-pagination',
            //클릭 가능여부
            clickable: false,
        },
        observer: true,	// 추가
        observeParents: true,	// 추가
    });

    new Swiper(".p_keyword_g_slide", {
        
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정        
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정

        slidesPerView: "auto",
        spaceBetween: 0,

        //방향표
        navigation: {
            //다음페이지 설정
            nextEl: '.swiper-button-next',
            //이전페이지 설정
            prevEl: '.swiper-button-prev',
        },
        //접근성
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
        },

        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          //type: "progressbar",
          type: "fraction",
        },
        
        observer: true,	// 추가
        observeParents: true,	// 추가
      });


});



// 랜덤으로 class 배정
function shuffle_class(index, type){

    var keyword_class = ["btn_keyword_green btn_keyword", "btn_keyword", "btn_keyword_gray btn_keyword", "btn_keyword_blue btn_keyword", "btn_keyword_red btn_keyword"];
    var pipeline_list_class = ["text", "text cr_red", "text cr_blue", "text cr_green", "text cr_violet"];
    var selected_class;
    var class_type;

    if(type == "keyword"){
        class_type = keyword_class;
    }else if (type == "pipeline_list"){
        class_type = pipeline_list_class;
    }

    switch (index % 5){

        case 0 :

            selected_class = class_type[0];
            break;

        case 1 :

            selected_class = class_type[1];
            break;

        case 2 :

            selected_class = class_type[2];
            break;

        case 3 :

            selected_class = class_type[3];
            break;

        case 4 :

            selected_class = class_type[4];
            break;
    }

    return selected_class;
}

// controller 별로 requestMapping이 부여되어 contextPath 필요
function getContextPath(){
	var host_index = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(host_index, location.href.indexOf('/', host_index + 1));
}