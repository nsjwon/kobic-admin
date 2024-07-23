// var lat = 33.451744;
// var lng = 126.567803;
//클릭한 위치의 위도는 36.37735891413657 이고, 경도는 127.35840472080065 입니다
var lat = 36.376061189081774;//36.37735891413657;
var lng = 127.36018515389415;//127.35840472080065;

$(document).ready(function(){
	drawKakaoMap('.directions-map', lat, lng);
})

function drawKakaoMap(locationMap, lat, lng){
//	var mapContainer = document.getElementById(locationMap), // 지도를 표시할 div
	var mapContainer = document.querySelector(locationMap),	//.directions_map


	mapOption = {
		center : new kakao.maps.LatLng(lat, lng), // 지도의 중심좌표
		level : 3 // 지도의 확대 레벨
	};

	// 지도를 생성합니다
	var map = new kakao.maps.Map(mapContainer, mapOption);

	// 마커 정보를 입력합니다.
	var point = new kakao.maps.LatLng(lat, lng);

	// 마커를 생성합니다.
	var marker = new kakao.maps.Marker({ position : point});
	marker.setMap(map);

	// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
	var mapTypeControl = new kakao.maps.MapTypeControl();

	// 지도에 컨트롤을 추가해야 지도위에 표시됩니다
	// kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
	map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPLEFT);

	// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
	var zoomControl = new kakao.maps.ZoomControl();
	map.addControl(zoomControl, kakao.maps.ControlPosition.LEFT);

	map.relayout();
}

function openMapNewTab(startPoint) {
    window.open('https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=%2C%2C580382%2C799938&rt2=%ED%95%9C%EA%B5%AD%EC%83%9D%EB%AA%85%EA%B3%B5%ED%95%99%EC%97%B0%EA%B5%AC%EC%9B%90&rtIds=%2C&rtTypes=%2C&rt1='+encodeURIComponent(startPoint), '_blank','noopener, noreferrer');
}
