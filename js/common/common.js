$(document).ready(function () {
	
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
	            $("#top-btn").addClass("go-on");
	        }
	        else {
	            $("#top-btn").removeClass("go-on");
	        }
	
	    });

	    // top으로 가기
	    $("#top-btn").click(function(){
	        window.scrollTo({top : 0, behavior: 'smooth'});
	    });

    // 서브 탭
    const tabList03 = document.querySelectorAll('.s-tab-default .s-tab-list li');
    const contents03 = document.querySelectorAll('.s-tab-box .s-tab-cont')
    let activeCont03 = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

    for(var i = 0; i < tabList03.length; i++){
        tabList03[i].querySelector('.s-tab-tit').addEventListener('click', function(e){
            e.preventDefault();
            for(var j = 0; j < tabList03.length; j++){
                // 나머지 버튼 클래스 제거
                tabList03[j].classList.remove('s-t-on');

                // 나머지 컨텐츠 display:none 처리
                contents03[j].style.display = 'none';   
            }

            // 버튼 관련 이벤트
            this.parentNode.classList.add('s-t-on');

            // 버튼 클릭시 컨텐츠 전환
            activeCont03 = this.getAttribute('href');
            document.querySelector(activeCont03).style.display = 'block';
        });
    }

    // 검색 모바일 서브 탭
    const tabList04 = document.querySelectorAll('.sm-tab-default .s-tab-list li');
    const contents04 = document.querySelectorAll('.sm-tab-box .s-tab-cont')
    let activeCont04 = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

    for(var i = 0; i < tabList04.length; i++){
        tabList04[i].querySelector('.sm-tab-tit').addEventListener('click', function(e){
            e.preventDefault();
            for(var j = 0; j < tabList04.length; j++){
                // 나머지 버튼 클래스 제거
                tabList04[j].classList.remove('sm-t-on');

                // 나머지 컨텐츠 display:none 처리
                contents04[j].style.display = 'none';   
            }

            // 버튼 관련 이벤트
            this.parentNode.classList.add('sm-t-on');

            // 버튼 클릭시 컨텐츠 전환
            activeCont04 = this.getAttribute('href');
            document.querySelector(activeCont04).style.display = 'block';
        });
    }   


	// 분석 > 서비스 (service.html)
    // 메인 바이오익스프레스 탭
    const bxservice = document.querySelectorAll('.bx-service-list .service-item');

    for(var i = 0; i < bxservice.length; i++){
        bxservice[i].querySelector('.service-ctxt-box').addEventListener('click', function(e){
            for(var j = 0; j < bxservice.length; j++){
                // 나머지 버튼 클래스 제거
                bxservice[j].classList.remove('active');  
            }

            // 버튼 관련 이벤트
            this.parentNode.classList.add('active');

        });
    }


});

// controller 별로 requestMapping이 부여되어 contextPath 필요
function getContextPath() {
    return window.location.pathname.substring(0, window.location.pathname.indexOf('/',1));
}

// Input, TextArea 작성 시 체크
function validateForm() {
    
    var isEmptyElement = null;
	var message = '필수입력 값을 확인하세요.';
	var returnValue = new Object();

    const elList = $.merge($('input:not([type="hidden"])'), $('textarea'));
    if ( elList.length > 0 ) {
      for ( var i=0; i<elList.length; i++ ) {
        const el = elList[i];  
        var isTxtPoint = $(el).closest('.brd-w-item').find('.txt-point').length > 0 ? true : false;
        if ( isTxtPoint && ($.trim($(el).val()) < 1) ) {
            isEmptyElement = $(el);
            break;
        }
      }
    }
	
	returnValue.el = isEmptyElement;
	returnValue.msg = message;
    return returnValue;
}







/**
 * 현재 창의 위치에서 경로명을 추출하여 반환합니다.
 *
 * 만약 `isMove` 파라미터가 참이라면, 'go_'를 포함하는 경우에 해당 부분을 제거하고,
 * 'go_'가 포함되지 않은 문자열을 반환합니다. 'go_' 뒤의 문자열이 두 부분('_'로 구분)으로
 * 나뉠 경우 첫 두 부분만 반환합니다. 'isMove'가 거짓이면, 경로명에서 'go_' 다음에 오는
 * 부분을 반환합니다.
 *
 * @param {boolean} isMove - 경로명에서 'go_'를 제거할지 여부를 결정하는 부울 변수입니다.
 *                           이 값이 참이면 'go_' 제거 또는 앞의 두 세그먼트만 반환하고,
 *                           거짓이면 원래의 경로명을 그대로 반환합니다.
 * @returns {string} 'isMove'의 값에 따라 처리된 경로명을 문자열로 반환합니다.
 */
function getPathName(isMove) {
    var path = window.location.pathname.split('/');
    var pathName = path[path.length-1];
    if ( isMove ) {
      const arr = pathName.split("_");
      if ( arr.length < 3 ) return pathName;       // go_xxx 형태의 문자열을 반환합니다.
      else return arr[0] + "_" + arr[1];           // 'go_' 제거 후 첫 두 세그먼트 반환합니다.
    }
    // 'isMove'가 false일 경우, 'go_'를 제외한 나머지 부분을 반환합니다.
    return pathName.split("_")[1];
}








/**
 * jQuery 객체의 폼 데이터를 JSON 객체로 직렬화합니다.
 * 이 함수는 폼의 각 input 요소의 이름과 값을 객체의 속성과 값으로 매핑합니다.
 * 같은 이름을 가진 여러 값은 배열로 직렬화합니다.
 * @returns {Object} 폼 데이터의 JSON 객체 표현
 */
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray(); // 폼 데이터를 이름-값 쌍의 배열로 변환
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]]; // 단일 값이 있는 경우, 배열로 변환
            }
            o[this.name].push(this.value || ''); // 값이 undefined인 경우 빈 문자열로 대체
        } else {
            o[this.name] = this.value || ''; // 처음 나타난 이름은 바로 객체에 추가
        }
    });
    return o; // 직렬화된 객체 반환
};






/**
 * 주어진 폼에 히든 인풋을 추가하는 함수입니다.
 * - 사용법 1 : addHiddenInputToForm('myForm', 'newIdentifier', 'defaultValue');
 * - 사용법 2 : addHiddenInputToForm('myForm', 'newIdentifier', null, 'existingInputId');
 * @param {string} formId - 히든 인풋을 추가할 폼의 아이디
 * @param {string} inputName - 생성될 히든 인풋의 이름
 * @param {string} value - 히든 인풋에 설정할 값 (직접 지정된 값이 우선함)
 * @param {string} existingInputId - 기존 인풋의 아이디 (이 값을 통해 히든 인풋의 값을 설정할 경우)
 */
function addHiddenInputToForm(formId, inputName, value, existingInputId) {
  var form = document.getElementById(formId);
  if (!form) {
    console.error('Form with id ' + formId + ' not found.');
    return;
  }

  var inputValue = value;
  if (existingInputId) {
    var existingInput = document.getElementById(existingInputId);
    if (existingInput && existingInput.value) {
      inputValue = existingInput.value;
    }
  }

  var hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', inputName);
  hiddenInput.setAttribute('value', inputValue || '');

  form.appendChild(hiddenInput);
}



// realtime-clock.js
function updateDateTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    var hours = ("0" + now.getHours()).slice(-2);
    var minutes = ("0" + now.getMinutes()).slice(-2);
    var seconds = ("0" + now.getSeconds()).slice(-2);
    var dateTimeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    // 모든 'real-time' 클래스를 가진 요소를 찾아 시간을 업데이트합니다.
    var elements = document.getElementsByClassName('real-time');
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = dateTimeString;
    }
}

// 페이지가 로드될 때 함수를 호출하고, 1초마다 반복합니다.
document.addEventListener('DOMContentLoaded', function() {
    updateDateTime(); // 초기 로드 시 갱신
    setInterval(updateDateTime, 1000); // 매초 갱신
});




/************************************
 * POST 
 *************************************/
function doPostForm(formId, actionUrl, refreshUrl) {
	
	let formData = $(formId).serializeObject();
		
	// actionUrl 예시 : '/admin/board/do_add_notice'
	// refreshUrl 예시 : '/admin/board/go_notice'
	const url = getContextPath() + actionUrl;
	
	axios.post(url, formData)			    				    				    			 
      .then(function(response) {
    	  			      
    	  switch(response.data.result) {
    	  
    	  // 알 수 없는 에러
    	  default :
    		  alert(commonAlertError02);
    		  break;
    	  
    	  // 정상 
    	  case 1 :
    		  alert(commonAlertCreateComplete);	
    		  location.href = getContextPath() + refreshUrl;
    		  break;
    		  
    	  case -1 :
    		  alert(commonAlertError02);
    		  break;
    		  
    	  case -2 :
    		  alert(commonAlertError03);
    		  break;
    	  }    	      	  			    	  			    				        			        			        			  			    
      })
      .catch(function(error){
		  alert(commonAlertError02);
      });
		
}