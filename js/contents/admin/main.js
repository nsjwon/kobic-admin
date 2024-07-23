// Themes begin
// am4core.addLicense("CH331051111")
// am4core.useTheme(am4themes_animated);
// Themes end

var today, defaultEndDate;
$(document).ready(function() {

    // 검색 날짜 선택 
    $(document).on('focus', 'input[name="searchDate"]', function() {
        $(this).datepicker({
            format: 'yyyy-mm-dd',
            language: 'ko-KR',
            autoHide: true
        });
    });

	defaultChart();

    // 실시간 로그인 현황 차트
    getLoginStatistics();

    // 게시물 등록 현황 차트
    getPostStatistics();
});


function defaultChart() {
    
	// 오늘 ~ 15일 이전 기간 세팅
	today = new Date();
	var calDay = settingDateOffset(today, 15);
	var defaultStartDate = settingDateFormat(calDay);
	defaultEndDate= settingDateFormat(today);
	
	// datepicker 초기값 세팅
	var datePickers = $(this).find("input[name='searchDate']");
	for ( var i=0; i<datePickers.length; i++ )  {
		if ( i % 2 == 0 ) $(datePickers[i]).val(defaultStartDate);
		else $(datePickers[i]).val(defaultEndDate);
		//console.log(datePickers[i]);
	}
}


/** 실시간 로그인 현황 차트 데이터 가져오기 */
function getLoginStatistics(type) {

    // 7일, 30일 버튼 클릭시
    if ( type > 0 ) {
		var temp = settingDateOffset(today, type);
		tempStartDate = settingDateFormat(temp);
		$("#loginStartDate").val(tempStartDate);
		$("#loginEndDate").val(defaultEndDate);
    }

    var searchStartDate = $('#loginStartDate').val();
    var searchEndDate = $('#loginEndDate').val();
    const param = {
        startDate: searchStartDate,
        endDate: searchEndDate
    }

	// 조회기간 시작일이 종료일보다 큰 경우 
	if ( new Date(searchStartDate) > new Date(searchEndDate) ) {
		alert("조회기간을 확인해주세요.");
		return false;
	}
	
    axios.post('get_login_stat', null, { params: param })
    .then(function(response) {
	
		if ( response.data.stat_data && response.data.stat_data.length < 1 ) {
			alert("조회된 데이터가 없습니다.");
			defaultChart();
		    // 실시간 로그인 현황 차트
		    //getLoginStatistics();
			return false;
		}
		
        drawLoginChart(response.data.stat_data);
    })
    .catch(function(error){
      //console.log(error);
    });
}

/** 실시간 로그인 현황 차트 그리기 */
function drawLoginChart(data) {
	var chart = am4core.create("loginChartDiv", am4charts.XYChart);
	chart.data = data;
	
    // Add category axis
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.renderer.labels.template.fontSize = 15;
	if ( data.length < 16 ) {
		categoryAxis.renderer.minGridDistance = 50;
	}
    // categoryAxis.title.text = "일자";

    // Add value axis
	var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
    valueAxis.renderer.labels.template.fontSize = 15;
    // valueAxis.title.text = "로그인 건수;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.categoryX = "day";
    series.dataFields.valueY = "loginCount";
    series.strokeWidth = 3;
	
    if (data.length < 2) {
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 5;
        bullet.circle.fill = series.stroke;
     }
//    chart.legend = new am4charts.Legend();
    chart.cursor= new am4charts.XYCursor();
}


/** 게시물 등록 현황 차트 데이터 가져오기 */
function getPostStatistics(type) {

    // 7일, 30일 버튼 클릭시
    if ( type > 0 ) {
		var temp = settingDateOffset(today, type);
		tempStartDate = settingDateFormat(temp);
		$("#postStartDate").val(tempStartDate);
		$("#postEndDate").val(defaultEndDate);
    }

    var searchStartDate = $('#postStartDate').val();
    var searchEndDate = $('#postEndDate').val();
    const param = {
        startDate: searchStartDate,
        endDate: searchEndDate
    }

	// 조회기간 시작일이 종료일보다 큰 경우 
	if ( new Date(searchStartDate) > new Date(searchEndDate) ) {
		alert("조회기간을 확인해주세요.");
		return false;
	}
		
    axios.post('get_post_stat', null, { params: param })
    .then(function(response) {
	
		if ( response.data.stat_data && response.data.stat_data.length < 1 ) {
			alert("조회된 데이터가 없습니다.");
			defaultChart();
		    // 게시물 등록 현황 차트
		    getPostStatistics();
			return false;
		}
        drawPostChart(response.data.stat_data);
    })
    .catch(function(error){
      //console.log(error);
    });
}

/** 게시물 등록 현황 차트 그리기 */
function drawPostChart(data) {
	var chart = am4core.create("postChartDiv", am4charts.XYChart);
	chart.data = data;
	
    // Add category axis
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.renderer.labels.template.fontSize = 15;
	if ( data.length < 16 ) {
		categoryAxis.renderer.minGridDistance = 50;
	}
    // categoryAxis.title.text = "일자";

    // Add value axis
	var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.min = 0;
    valueAxis.renderer.labels.template.fontSize = 15;
    // valueAxis.title.text = "게시물 등록 건수";

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.categoryX = "day";
    series.dataFields.valueY = "totalCount";
    series.strokeWidth = 3;
	
    if (data.length < 2) {
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.radius = 5;
        bullet.circle.fill = series.stroke;
     }
//    chart.legend = new am4charts.Legend();
    chart.cursor= new am4charts.XYCursor();
}

function settingDateOffset(date, offset) {
	return new Date(new Date().setDate(date.getDate() - offset));
}

function settingDateFormat(date) {
	return date.getFullYear() + "-" + (("00"+(date.getMonth()+1).toString()).slice(-2)) + "-" + (("00"+date.getDate().toString()).slice(-2));
}