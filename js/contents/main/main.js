// Themes begin
am4core.addLicense("CH331051111")
am4core.useTheme(am4themes_animated);
// Themes end

$(document).ready(function() {    
	
    // 메인 탭
    const tabList = document.querySelectorAll('.tab-default .t-list li');
    const contents = document.querySelectorAll('.tab-box .tab-cont')
    let activeCont = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

    for(var i = 0; i < tabList.length; i++){
        if ( tabList[i].querySelector('.t-tit') != null ) {
            tabList[i].querySelector('.t-tit').addEventListener('click', function(e){
                e.preventDefault();
                for(var j = 0; j < tabList.length; j++){
                    // 나머지 버튼 클래스 제거
                    tabList[j].classList.remove('t-on');

                    // 나머지 컨텐츠 display:none 처리
                    contents[j].style.display = 'none';   
                }

                // 버튼 관련 이벤트
                this.parentNode.classList.add('t-on');

                // 버튼 클릭시 컨텐츠 전환
                activeCont = this.getAttribute('href');
                document.querySelector(activeCont).style.display = 'block';
            });
        }
    }
    // 메인 바이오익스프레스 탭
    const tabList02 = document.querySelectorAll('.t-tab-default .t-t-list li');
    const contents02 = document.querySelectorAll('.t-tab-box .t-tab-cont')
    let activeCont02 = ''; // 현재 활성화 된 컨텐츠 (기본:#tab1 활성화)

    for(var i = 0; i < tabList02.length; i++){
        tabList02[i].querySelector('.t-t-tit').addEventListener('click', function(e){
            e.preventDefault();
            for(var j = 0; j < tabList02.length; j++){
                // 나머지 버튼 클래스 제거
                tabList02[j].classList.remove('t-t-on');

                // 나머지 컨텐츠 display:none 처리
                contents02[j].style.display = 'none';   
            }

            // 버튼 관련 이벤트
            this.parentNode.classList.add('t-t-on');

            // 버튼 클릭시 컨텐츠 전환
            activeCont02 = this.getAttribute('href');
            document.querySelector(activeCont02).style.display = 'block';
        });
    }

    // 메인 협력기관 슬라이드
    new Swiper('.banner-list', {
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        slidesPerView: 5, //한번에 보여지는 페이지 숫자
        slidesPerGroup: 3, 
        spaceBetween: 20, //페이지와 페이지 사이의 간격
        centeredSlides: false, //센터모드
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
        allowTouchMove : true, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
        autoplay : {  // 자동 슬라이드 설정 , 비 활성화 시 false
            delay : 8000,   // 시간 설정
            disableOnInteraction : false,  // false로 설정하면 스와이프 후 자동 재생이 비활성화 되지 않음
        },
        breakpoints: {
            300: {
                  slidesPerView: 2, 
                  spaceBetween: 10,
                },
        
            640: {
              slidesPerView: 3,  
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 4,  //브라우저가 1024보다 클 때
              spaceBetween: 14,
            },
            1240: {
              slidesPerView: 5,  
              spaceBetween: 20,
            },
         },
        loop: false, // 슬라이드 반복 여부
        loopAdditionalSlides: 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        //키보드 페이지 이동
        keyboard: {
            enabled: false,
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
        on: {
            init: function () {
              thisSlide = this;
              autoPlayBtn = document.querySelector('.banner-pause > button');
              autoPlayBtn.addEventListener('click', (e) => {
                autoPlayState = autoPlayBtn.getAttribute('aria-pressed');
                if (autoPlayState === 'false') {
                  autoPlayBtn.setAttribute('aria-pressed', 'true');
                  thisSlide.autoplay.stop();
                } else if (autoPlayState === 'true') {
                  autoPlayBtn.setAttribute('aria-pressed', 'false');
                  thisSlide.autoplay.start();
                };
              });
            },
          },
    });

    // 파이프라인 슬라이드
    new Swiper('.pipeline-list', {
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        slidesPerView: 1, //한번에 보여지는 페이지 숫자
        spaceBetween: 0, //페이지와 페이지 사이의 간격
        centeredSlides: false, //센터모드
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
        allowTouchMove : false, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
        watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
        loop : true,  // 슬라이드 반복 여부
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        //키보드 페이지 이동
        keyboard: {
            enabled: false,
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
    });

    // 파이프라인 키워드 슬라이드
    new Swiper(".pipe-keyword-slide", {        
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정        
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        slidesPerView: "auto",
        spaceBetween: 0,
        allowTouchMove : true,

        //접근성
        a11y: {
            prevSlideMessage: '이전 슬라이드',
            nextSlideMessage: '다음 슬라이드',
        },

        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          type: "fraction",
        },
        
        observer: true,	// 추가
        observeParents: true,	// 추가
      });


    // 감염병 슬라이드
    new Swiper('.virus-list', {
        direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
        slidesPerView: 1, //한번에 보여지는 페이지 숫자
        spaceBetween: 0, //페이지와 페이지 사이의 간격
        centeredSlides: false, //센터모드
        autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
        freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
        allowTouchMove : false, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
        watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정
        loop : true,  // 슬라이드 반복 여부
        loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정
        //키보드 페이지 이동
        keyboard: {
            enabled: false,
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
    });

    // 상단팝업 슬라이드
    new Swiper('.popup-list', {
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
            enabled: false,
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

    getMainGBoxData();
    drawBxPipelineChart();
    drawBxProgramChart();
    drawKbdsDataChart();
    drawEducationChart();
});

/** GBox 정보 */
function getMainGBoxData() {

    var idstr = $('.go-mypage').siblings('span').eq(0).text();
	// localStorage 
	if ( localStorage.getItem(idstr + '_list') ) {

        var gSize = localStorage.getItem(idstr + '_size');
        var gSizeNum = localStorage.getItem(idstr + '_size_num');
        var gList = JSON.parse(localStorage.getItem(idstr + '_list'));
        drawMainGBoxList(gSizeNum, gSize, gList);
	}
    else {
        
        // 로딩 켜기
        $('#gboxLoading').removeClass('dis-none');
    }

    axios.post(getContextPath() + '/do_get_main_gbox')
    .then(function(response) {

        if ( response && response.data ) {
            if ( response.data.result > 0 ) {
                var data = response.data;
                const sizeNum = data.gbox_size_num;
                const size = data.gbox_size;
                const fileList = data.file_list;
    
                var tempList = [];
                $.each(fileList, function(index, file) {
                    if ( file.dir ) {
                        tempList.push(file.name);
                    }
                });
                drawMainGBoxList(sizeNum, size, tempList);
                
				localStorage.clear();
				localStorage.setItem(idstr + '_size', data.gbox_size);
				localStorage.setItem(idstr + '_size_num', sizeNum);
				localStorage.setItem(idstr + '_list', JSON.stringify(tempList));
				
            }
        }
        else {
            $('#gbox_first').removeClass('dis-none');
            $('#gbox_user').addClass('dis-none');
            $('#gbox_list').addClass('dis-none');
        }
    })
    .catch(function(error){
        //console.log(error);
        $('#gbox_first').removeClass('dis-none');
        $('#gbox_user').addClass('dis-none');
        $('#gbox_list').addClass('dis-none');
    })
    .finally(function() {

        // 로딩 끄기 
        $('#gboxLoading').addClass('dis-none');
    });
}

function drawMainGBoxList(sizeNum, size, fileNameList) {

    // 사용량이 있는 경우
    if ( sizeNum > 0 ) {
		
		// 초기화
		$('ul.gbox-file-list').children().remove();
		
        $('#gbox_first').addClass('dis-none');

        var fileListStr = '';
        $.each(fileNameList, function(index, name) {
            fileListStr += '<li class="gbox-list-item"><a href="' + getContextPath() + '/gbox" class="" target="_blank"><span class="ellipsis">' + name + '</span></a></li>';
        });

        // GBox에 하나 이상의 디렉토리가 생성된 경우
        if ( fileListStr != '' ) {
            $('ul.gbox-file-list').append(fileListStr);

            $('#gbox_user').addClass('dis-none');
            $('#gbox_list').removeClass('dis-none');
        }
        // 디렉토리가 없는 경우(파일만 있거나, 비어있거나)
        else {
            $('#gbox_user').removeClass('dis-none');
            $('#gbox_list').addClass('dis-none');
        }

        // 사용량 표출 
		$('#userGBoxSize').text(size);
		$('#listGBoxSize').text(size);
    }
    // 사용량이 없는 경우
    else {
        $('#gbox_first').removeClass('dis-none');
        $('#gbox_user').addClass('dis-none');
        $('#gbox_list').addClass('dis-none');
    }
}

/** 감염병 정보 이동 */
function moveEpidemicDetail(el) {

    var epidemicUrl = $('div.swiper-slide.virus-item.swiper-slide-active').find('.virus-box').find('input[type=hidden]').val();
    window.open(epidemicUrl, "_blank");
}


/** 바이오익스프레스 - 등록 파이프라인 통계 차트 */
function drawBxPipelineChart() {

    if ( bxPipelineList != null ) {
        am4core.ready(function() {

            var programChart = am4core.create("bxPipelineChart", am4charts.XYChart);

			programChart.paddingTop = 0;
			programChart.paddingBottom = 0;
			programChart.paddingLeft = 0;
			programChart.paddingRight = 20;
		
		
            var categoryAxis = programChart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.minGridDistance = 1;
            categoryAxis.renderer.inversed = true;
            categoryAxis.renderer.grid.template.disabled = true;
	        categoryAxis.renderer.labels.template.horizontalCenter = "left";
	        categoryAxis.renderer.labels.template.verticalCenter = "middle";
	        categoryAxis.renderer.labels.template.fontSize = 14;
			categoryAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
            
            var valueAxis = programChart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
	        valueAxis.renderer.labels.template.fontSize = 14;
			valueAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
            
            var series = programChart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryY = "category";
            series.dataFields.valueX = "valueInt";
            series.columns.template.strokeOpacity = 0;
            series.columns.template.column.cornerRadiusBottomRight = 5;
            series.columns.template.column.cornerRadiusTopRight = 5;
            series.columns.template.tooltipText = "{category}: [bold]{valueInt}[/]";
            
            
            series.columns.template.adapter.add("fill", function(fill, target){
                return am4core.color("#7D93DD");
            });
            
            categoryAxis.sortBySeries = series;
            programChart.data = bxPipelineList;
            
        }); // end am4core.ready()
    }
}

/** 바이오익스프레스 - 등록 프로그램 통계 차트 */
function drawBxProgramChart() {

    if ( bxProgramList != null ) {
        am4core.ready(function() {

            var programChart = am4core.create("bxProgramChart", am4charts.XYChart);

			programChart.paddingTop = 0;
			programChart.paddingBottom = 0;
			programChart.paddingLeft = 0;
			programChart.paddingRight = 20;
		
            var categoryAxis = programChart.yAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = "category";
            categoryAxis.renderer.minGridDistance = 1;
            categoryAxis.renderer.inversed = true;
            categoryAxis.renderer.grid.template.disabled = true;
	        categoryAxis.renderer.labels.template.horizontalCenter = "left";
	        categoryAxis.renderer.labels.template.verticalCenter = "middle";
	        categoryAxis.renderer.labels.template.fontSize = 14;
			categoryAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
            
            var valueAxis = programChart.xAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
	        valueAxis.renderer.labels.template.fontSize = 14;
			valueAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
        
            
            var series = programChart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryY = "category";
            series.dataFields.valueX = "valueInt";
            series.columns.template.strokeOpacity = 0;
            series.columns.template.column.cornerRadiusBottomRight = 5;
            series.columns.template.column.cornerRadiusTopRight = 5;
            series.columns.template.tooltipText = "{category}: [bold]{valueInt}[/]";

            
            series.columns.template.adapter.add("fill", function(fill, target){
                return am4core.color("#7D93DD");
            });
            
            categoryAxis.sortBySeries = series;
            programChart.data = bxProgramList;
            
        }); // end am4core.ready()
    }
}


/** KBDS 주요 데이터 등록 현황 차트 - 막대 */
/*function drawKbdsDataChart() {

    am4core.ready(function() {

        var chart = am4core.create("kbdsChart", am4charts.XYChart);
        chart.data = kbdsDataList;
        
        chart.resizable = true;
		chart.paddingTop = 8;
		chart.paddingBottom = 0;
		chart.paddingLeft = 0;
		chart.paddingRight = 4;
		
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 10;
        // categoryAxis.renderer.labels.template.rotation = 270;
        // categoryAxis.renderer.labels.template.horizontalCenter = "left";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.fontSize = 13;
		categoryAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
		categoryAxis.renderer.grid.template.strokeOpacity = 0.2;
		//categoryAxis.renderer.cellStartLocation = 0.05;
		//categoryAxis.renderer.cellEndLocation = 0.95;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.renderer.labels.template.fontSize = 13;
		valueAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
        
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "valueInt";
        series.dataFields.categoryX = "category";
        series.name = "valueInt";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusTopLeft = 5;
        series.columns.template.column.cornerRadiusTopRight = 5;
		series.columns.template.width = am4core.percent(62);

        series.columns.template.adapter.add("fill", function(fill, target){
             return am4core.color("#6794dc");
             //return chart.colors.getIndex(target.dataItem.index);
         });

        
    }); // end am4core.ready()
}*/


/** KBDS 주요 데이터 등록 현황 차트 - 라인 */
function drawKbdsDataChart() {

    am4core.ready(function() {

        var chart = am4core.create("kbdsChart", am4charts.XYChart);
        chart.data = kbdsDataList;
        
        chart.resizable = true;
		chart.paddingTop = 10;
		chart.paddingBottom = 0;
		chart.paddingLeft = 0;
		chart.paddingRight = 10;
		chart.fontSize=13;
		chart.maskBullets = false;
		
		
		var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.renderer.grid.template.location = 0;
		categoryAxis.renderer.ticks.template.disabled = true;
		categoryAxis.renderer.line.opacity = 0;
		categoryAxis.renderer.grid.template.disabled = true;
		categoryAxis.renderer.minGridDistance = 10;
		categoryAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
		categoryAxis.dataFields.category = "category";
		categoryAxis.startLocation = 0.3;
		categoryAxis.endLocation = 0.7;		
		
		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.tooltip.disabled = true;
		valueAxis.renderer.line.opacity = 0;
		valueAxis.renderer.ticks.template.disabled = true;
		valueAxis.min = 0;
		valueAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
		
		var lineSeries = chart.series.push(new am4charts.LineSeries());
		lineSeries.dataFields.categoryX ="category";
		lineSeries.dataFields.valueY = "valueInt";
		lineSeries.tooltipText = "{categoryX}: [bold]{valueY}[/]";
		lineSeries.name = "valueInt";
		lineSeries.fillOpacity = 0.2;
		lineSeries.strokeWidth = 1;
  		lineSeries.stroke = am4core.color("#6794dc");
  		lineSeries.fill = am4core.color("#6794dc");
		
		var bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
		bullet.circle.radius = 6;
		bullet.circle.fill = am4core.color("#ffffff");
		bullet.circle.stroke = am4core.color("#648fd5");
		bullet.circle.strokeWidth = 3;
		
		chart.cursor = new am4charts.XYCursor();
		chart.cursor.behavior = "panX";
		chart.cursor.lineX.opacity = 0;
		chart.cursor.lineY.opacity = 0;
		
		//chart.scrollbarX = new am4core.Scrollbar();
		//chart.scrollbarX.parent = chart.bottomAxesContainer;

        
    }); // end am4core.ready()
}


/** 교육지원 누적 실적 차트 */
function drawEducationChart() {

    am4core.ready(function() {

        var chart = am4core.create("eduChart", am4charts.XYChart);
        chart.data = [{
        //    "year": "2010",
        //    "count": 2
        //}, {
        //    "year": "2011",
        //    "count": 6
        //}, {
        //    "year": "2012",
        //   "count": 13
        //}, {
        //    "year": "2013",
        //    "count": 18
        //}, {
            "year": "2014",
            "count": 23
        }, {
            "year": "2015",
            "count": 29
        }, {
            "year": "2016",
            "count": 34
        }, {
            "year": "2017",
            "count": 37
        }, {
            "year": "2018",
            "count": 40
        }, {
            "year": "2019",
            "count": 42
        }, {
            "year": "2020",
            "count": 42
        },{
            "year": "2021",
            "count": 44
        }, {
            "year": "2022",
            "count": 46
        }, {
            "year": "2023",
            "count": 48
        }];
        
        chart.resizable = true;
		chart.paddingTop = 8;
		chart.paddingBottom = 0;
		chart.paddingLeft = 0;
		chart.paddingRight = 2;
		
        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "year";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.renderer.labels.template.horizontalCenter = "left";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.fontSize = 13;
		categoryAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
		categoryAxis.renderer.grid.template.strokeOpacity = 0;
		categoryAxis.renderer.cellStartLocation = 0.1;
		categoryAxis.renderer.cellEndLocation = 0.9;
        
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
        valueAxis.renderer.labels.template.fontSize = 13;
		valueAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
        
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "count";
        series.dataFields.categoryX = "year";
        series.name = "count";
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusTopLeft = 5;
        series.columns.template.column.cornerRadiusTopRight = 5;

        series.columns.template.adapter.add("fill", function(fill, target){
             return am4core.color("#51b7e0");
             //return chart.colors.getIndex(target.dataItem.index);
         });
        
    }); // end am4core.ready()
}
