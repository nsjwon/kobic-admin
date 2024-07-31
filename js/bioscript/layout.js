 function getKorURL() {	 
	 	 	
	 // URL 객체 생성
	 const url = new URL(window.location.href);
	 		 
	 if(url.searchParams.has("lang") == false) {
		 
		 url.searchParams.append("lang", "ko");
		 setLanguageCookie("ko"); // Save "ko" as the language cookie
		 location.href=url.toString();
		 
	 }else {
		 url.searchParams.delete("lang");
		 url.searchParams.append("lang", "ko");
		 setLanguageCookie("ko"); // Save "ko" as the language cookie
		 location.href=url.toString();
	 } 
	 	 	 	 	 	 	
 }
 
 
 function getEngURL() {	 
	 
	// URL 객체 생성
	 const url = new URL(window.location.href);
	 		 
	 if(url.searchParams.has("lang") == false) {
		 
		 url.searchParams.append("lang", "en");
		 setLanguageCookie("en"); // Save "en" as the language cookie
		 location.href=url.toString();
		 
	 }else {
		 url.searchParams.delete("lang");
		 url.searchParams.append("lang", "en");
		 setLanguageCookie("en"); // Save "en" as the language cookie
		 location.href=url.toString();
	 } 	 	 	
 }

function setLanguageCookie(lang) {
    document.cookie = "lang=" + lang + "; path=/";
}


function getLanguageCookie() {
    const cookies = document.cookie.split(";"); // Split the cookies string into individual cookies

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith("lang=")) {
            const cookieValue = cookie.substring("lang=".length); // Extract the value of the lang cookie
            return cookieValue;
        }
    }

    return "ko"; // Return null if lang cookie is not found
}

