$(document).ready(function() {


    // 레이어팝업
    // jQuery 환경에서만 작동할 수 있게 처리
    if (typeof jQuery === "undefined") throw new Error("Modal requires jQuery.");

    // 레이어 팝업 열기 버튼 클릭 시 팝업 보이기
    $(".open_lp").on("click", function() {
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

 

    /* 텝1 */
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

   /* 텝2 */
   const tabList02 = document.querySelectorAll('.tab_default02 .tab_list02 li');
   const contents02 = document.querySelectorAll('.tab_box02 .tab_cont02')
   let activeCont02 = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

   for(var i = 0; i < tabList02.length; i++){
       tabList02[i].querySelector('.tab_tit').addEventListener('click', function(e){
           e.preventDefault();
           for(var j = 0; j < tabList02.length; j++){
               // 나머지 버튼 클래스 제거
               tabList02[j].classList.remove('t_on');

               // 나머지 컨텐츠 display:none 처리
               contents02[j].style.display = 'none';   
           }

           // 버튼 관련 이벤트
           this.parentNode.classList.add('t_on');

           // 버튼 클릭시 컨텐츠 전환
           activeCont02 = this.getAttribute('href');
           document.querySelector(activeCont02).style.display = 'block';
       });
   }

   /* 텝3 */
   const tabList03 = document.querySelectorAll('.tab_default03 .tab_list03 li');
   const contents03 = document.querySelectorAll('.tab_box03 .tab_cont03')
   let activeCont03 = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

   for(var i = 0; i < tabList03.length; i++){
       tabList03[i].querySelector('.tab_tit').addEventListener('click', function(e){
           e.preventDefault();
           for(var j = 0; j < tabList03.length; j++){
               // 나머지 버튼 클래스 제거
               tabList03[j].classList.remove('t_on');

               // 나머지 컨텐츠 display:none 처리
               contents03[j].style.display = 'none';   
           }

           // 버튼 관련 이벤트
           this.parentNode.classList.add('t_on');

           // 버튼 클릭시 컨텐츠 전환
           activeCont03 = this.getAttribute('href');
           document.querySelector(activeCont03).style.display = 'block';
       });
   }

});


// controller 별로 requestMapping이 부여되어 contextPath 필요
function getContextPath(){
	var host_index = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(host_index, location.href.indexOf('/', host_index + 1));
}


/* queryString(serialize)을 json으로 바꿔주는 함수 jquery 적용 */
jQuery.fn.serializeObject = function() {
	var obj = null;
	try {
		if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) {
			var arr = this.serializeArray();
			if(arr){ obj = {};
			jQuery.each(arr, function() {
				obj[this.name] = this.value; });
			}
		}
	}catch(e) {
		alert(e.message);
	}finally {}
	return obj;
}

