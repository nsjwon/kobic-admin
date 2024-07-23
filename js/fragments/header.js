$(document).ready(function () {
	
});


/**
 * 마우스 이벤트에 따라 클래스를 동적으로 추가/삭제하는 함수.
 * @function
 * @param {HTMLElement} element - 대상이 되는 HTML 요소.
 * @param {string} hoverClass - mouseover와 mouseout 이벤트에서 사용될 클래스 이름.
 * @param {string} activeClass - mousedown과 mouseup 이벤트에서 사용될 클래스 이름.
 */
function addMouseEventHandlers(element, hoverClass, activeClass) {
    element.addEventListener('mouseover', () => {
        element.classList.add(hoverClass);
    });
    
    element.addEventListener('mouseout', () => {
        element.classList.remove(hoverClass);
    });
    
    element.addEventListener('mousedown', () => {
        element.classList.add(activeClass);
    });
    
    element.addEventListener('mouseup', () => {
        element.classList.remove(activeClass);
    });
}

/**
 * 요소의 클래스를 동적으로 추가/삭제하는 함수.
 * @function
 * @param {HTMLElement} element - 대상이 되는 HTML 요소.
 * @param {string} className - 추가/삭제할 클래스 이름.
 * @param {string} action - 'add' 또는 'remove'
 */
function toggleClass(element, className, action) {
    if (action === "add") {
        element.classList.add(className);
    } else if (action === "remove") {
        element.classList.remove(className);
    } else {
        console.error("액션은 'add' 또는 'remove'만 가능합니다.");
    }
}









/**
 * 주어진 언어 코드를 사용하여 현재 URL의 언어 쿼리 문자열을 설정하고 언어 쿠키를 저장합니다.
 * @param {string} lang - 설정할 언어 코드 ('ko' 또는 'en').
 */
function setURLWithLanguage(lang) {
    const url = new URL(window.location.href);

    // 언어 쿼리 문자열 업데이트
    url.searchParams.delete("lang");
    url.searchParams.append("lang", lang);

	/*
		쿠키를 이용한 화면 언어셋 변경을 위한 메소드
		- setLanguageCookie(lang); 
		- MessageConfig 에서 CookieLocaleResolver로 변경후 사용 		 
	*/
    
    location.href = url.toString();
}

/**
 * 언어 쿠키를 설정합니다.
 * @param {string} lang - 저장할 언어 코드.
 */
function setLanguageCookie(lang) {
    document.cookie = "KOBIC_LOCALE=" + lang + "; path=/";
}

/**
 * 저장된 언어 쿠키 값을 가져옵니다.
 * @returns {string} 저장된 언어 코드 또는 'ko' (쿠키가 없을 경우 기본값).
 */
function getLanguageCookie() {
    const cookies = document.cookie.split(";"); 

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith("KOBIC_LOCALE=")) {
            return cookie.substring("KOBIC_LOCALE=".length);
        }
    }

    return "ko"; 
}

// 'ko' 또는 'en'에 대해 동일한 로직을 사용하기 위해 함수를 재사용합니다.
function getKorURL() {
    setURLWithLanguage("ko");
}

function getEngURL() {
	

//	location.href = 'https://www.kobic.re.kr/kobic/?lang=en';
//	return;
    setURLWithLanguage("en");
}
