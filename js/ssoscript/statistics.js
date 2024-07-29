var today, defaultEndDate;
$(function() {
	
	// 오늘 ~ 15일 이전 기간 세팅
	today = new Date();
	var calDay = settingDateOffset(today, 15);
	var defaultStartDate = settingDateFormat(calDay);
	defaultEndDate= settingDateFormat(today);
	
	// datepicker 초기값 세팅
	var datePickers = $(this).find("input[name='statisticsDate']");
	for ( var i=0; i<datePickers.length; i++ )  {
		if ( i % 2 == 0 ) $(datePickers[i]).val(defaultStartDate);
		else $(datePickers[i]).val(defaultEndDate);
//		console.log(datePickers[i]);
	}

	// 기간 조회 datepicker
	$("input[name='statisticsDate']").datepicker({
		dateFormat: 'yy-mm-dd',
		showMonthAfterYear: true,
		changeYear: true,
		changeMonth: true,
		yearRange: 'c-100:c+100',
		maxDate: '0',
		minDate: '-100y',
		monthNamesShort: [date_month_1, date_month_2, date_month_3, date_month_4, date_month_5, date_month_6, date_month_7, date_month_8, date_month_9, date_month_10, date_month_11, date_month_12],
		dayNamesMin: [date_dayweek_1, date_dayweek_2, date_dayweek_3, date_dayweek_4, date_dayweek_5, date_dayweek_6, date_dayweek_7]
	});

	// default 회원 현황 통계 
	getMemberStatus(0);
	
	// 사이트별 누적 로그인 현황
	getLoginStatusForSite();
	
	// 사이트별 로그인 현황
	getEachSiteLoginStatus(0);
	
	
});

function settingDateOffset(date, offset) {
	return new Date(new Date().setDate(date.getDate() - offset));
}

function settingDateFormat(date) {
	return date.getFullYear() + "-" + (("00"+(date.getMonth()+1).toString()).slice(-2)) + "-" + (("00"+date.getDate().toString()).slice(-2));
}

/**
 * 회원 현황 통계를 조회하고 차트를 그리는 함수입니다.
 * 사용자가 입력한 시작일과 종료일 또는 선택한 기간(7일, 30일)을 기준으로
 * 전체 회원 수, 가입 및 탈퇴 회원 수의 통계를 서버로부터 가져와 차트를 그립니다.
 * 조회기간이 유효하지 않을 경우 경고창을 표시합니다.
 * 
 * @param {number|string} type - 조회 기간의 타입이거나, 'day' 단위의 숫자(7일, 30일)를 나타냅니다.
 */
function getMemberStatus(type) {
	var startDate = $("#memberStartDate").val();
	var endDate = $("#memberEndDate").val();
	
	// 조회기간의 시작일이 종료일보다 큰 경우 사용자에게 경고창을 표시하고 함수를 종료합니다.
	if ( new Date(startDate) > new Date(endDate) ) {
		swal({
			title: "",
			text: alertStatCheckDate,
			confirmButtonText: common_confirm
		});
		return false;
	}
	
	var memberDate = startDate + ":" + endDate;
	
	// '7일', '30일' 버튼 클릭 시 해당 기간을 설정하고 입력 필드의 값을 업데이트합니다.
	if ( type > 0 ) {
		memberDate = type;
		var temp = settingDateOffset(today, type);
		tempStartDate = settingDateFormat(temp);
		$("#memberStartDate").val(tempStartDate);
		$("#memberEndDate").val(defaultEndDate);
		$("#memberStatTypeList").val("day");
	}
	
	// 회원 현황 통계 종류를 선택합니다.
	// '7일', '30일' 버튼 클릭 시에는 일별 통계만 표출합니다.
	var memberStatType = $("#memberStatTypeList option:selected").val();
	
	// AJAX를 통해 서버로부터 통계 데이터를 요청하고, 성공적으로 받아오면 차트를 그립니다.
	$.ajax({
		type: 'post',
		data: { "stat_type": memberStatType, "member_date" : memberDate },
		url: 'get_statistics',
		success: function(result) {
			// 전체 회원 통계 차트를 그립니다.
			drawTotalJoinChart(result.total_join);
			// 가입 및 탈퇴 회원 통계 차트를 그립니다.
			drawJoinAndWithdrawalChart(result.join, result.withdrawal);
		}
	});
}


var root1, root2;
var chart1, chart2;
// 회원 현황 통계 > 전체 회원
function drawTotalJoinChart(totalJoinList) {
	
	am5.ready(function() {
	
		if ( root1 ) {
			root1.container.children.clear();
			root1.dispose();	
		}

//		var root = am5.Root.new("chartdiv1");
		root1 = am5.Root.new("chartdiv1");
		root1.setThemes([
			am5themes_Animated.new(root1)
		]);
	
		chart1 = root1.container.children.push(am5xy.XYChart.new(root1, {
			panX: true,
			panY: true,
			wheelX: "panX",
			wheelY: "zoomX",
			pinchZoomX: true
		}));
	
		var cursor = chart1.set("cursor", am5xy.XYCursor.new(root1, {}));
		cursor.lineY.set("visible", false);
	
		var xRenderer = am5xy.AxisRendererX.new(root1, { minGridDistance: 30 });
		xRenderer.labels.template.setAll({
			rotation: -90,
			centerY: am5.p50,
			centerX: am5.p100,
			paddingRight: 15
		});
	
		var xAxis = chart1.xAxes.push(am5xy.CategoryAxis.new(root1, {
			maxDeviation: 0.3,
			categoryField: "day",
			renderer: xRenderer,
			tooltip: am5.Tooltip.new(root1, {})
		}));
	
		var yAxis = chart1.yAxes.push(am5xy.ValueAxis.new(root1, {
			maxDeviation: 0.3,
			renderer: am5xy.AxisRendererY.new(root1, {})
		}));
	
		var series = chart1.series.push(am5xy.ColumnSeries.new(root1, {
			name: "Series 1",
			xAxis: xAxis,
			yAxis: yAxis,
			valueYField: "totalJoinCount",
			sequencedInterpolation: true,
			categoryXField: "day",
			tooltip: am5.Tooltip.new(root1, {
				labelText: "{valueY}"
			})
		}));
	
		series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
		series.columns.template.adapters.add("fill", function(fill, target) {
			return chart1.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		series.columns.template.adapters.add("stroke", function(stroke, target) {
			return chart1.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		var data = [];
		for ( var i=0; i<totalJoinList.length; i++ ) {
			var d = totalJoinList[i];
			var dataObj = { "day" : d.dayUnit,
							"totalJoinCount" : d.tot };
			data.push(dataObj);
		}
	
		xAxis.data.setAll(data);
		series.data.setAll(data);
	
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root1, {
		  menu: am5plugins_exporting.ExportingMenu.new(root1, {
		    container: document.getElementById("chartdiv1")
		  }),
		  dataSource: data,
		  dataFields: {
		    day: "날짜",
		    totalJoinCount: "전체회원(단위:명)"
		  },
		  dataFieldsOrder: ["day", "totalJoinCount"]
		});
		
		series.appear(1000);
		chart1.appear(1000, 100);
	});
}

/**
 * 가입 및 탈퇴 통계 차트를 그리는 함수입니다.
 * amCharts 라이브러리를 사용하여 'joinList'와 'withdrawalList'의 데이터를 차트로 표현합니다.
 * 차트는 가입한 사용자 수와 탈퇴한 사용자 수를 시간에 따라 나타냅니다.
 * 
 * @param {Array} joinList - 가입 통계 데이터를 포함하는 배열입니다. 각 요소는 'dayUnit'과 'tot' 속성을 가집니다.
 * @param {Array} withdrawalList - 탈퇴 통계 데이터를 포함하는 배열입니다. 각 요소는 'dayUnit'과 'tot' 속성을 가집니다.
 */
function drawJoinAndWithdrawalChart(joinList, withdrawalList) {
	
	am5.ready(function() {

		if ( root2 ) {
			root2.container.children.clear();
			root2.dispose();	
		}
		root2 = am5.Root.new("chartdiv2");
		root2.setThemes([am5themes_Animated.new(root2)]);
		chart2 = root2.container.children.push(
			am5xy.XYChart.new(root2, {
				panX: false,
				panY: false,
				wheelX: "panX",
				wheelY: "zoomX",
				layout: root2.verticalLayout
			})
		);
	
		chart2.set(
			"scrollbarX",
			am5.Scrollbar.new(root2, {
				orientation: "horizontal"
			})
		);
		
		var data = [];
		for ( var i=0; i<joinList.length; i++ ) {
			
			var joinData = joinList[i];
			var withdrawalData = withdrawalList[i];
			
			var dataObj = { "day" 		 : joinData.dayUnit,
							"join"		 : joinData.tot,
							"withdrawal" : withdrawalData.tot };
			data.push(dataObj);
		}
		
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root2, {
		  menu: am5plugins_exporting.ExportingMenu.new(root2, {
		    container: document.getElementById("chartdiv2")
		  }),
		  dataSource: data,
		  dataFields: {
		    day: "날짜",
		    join: "가입(단위:명)",
		    withdrawal: "탈퇴(단위:명)"
		    
		  },
		  dataFieldsOrder: ["day", "join", "withdrawal"]
		});
		
		var xAxis = chart2.xAxes.push(
			am5xy.CategoryAxis.new(root2, {
				categoryField: "day",
				renderer: am5xy.AxisRendererX.new(root2, {}),
				tooltip: am5.Tooltip.new(root2, {})
			})
		);
	
		xAxis.data.setAll(data);
	
		var yAxis = chart2.yAxes.push(
			am5xy.ValueAxis.new(root2, {
				min: 0,
				extraMax: 0.1,
				renderer: am5xy.AxisRendererY.new(root2, {})
			})
		);
	
		// 가입
		var series1 = chart2.series.push(
			am5xy.LineSeries.new(root2, {
//				name: "가입",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "join",
				categoryXField: "day",
				tooltip: am5.Tooltip.new(root2, {
					pointerOrientation: "horizontal",
					labelText: "Join : {valueY} {info}"
				})
			})
		);

		if ( data.length < 2 ) {
			series1.bullets.push(function() {
	    		return am5.Bullet.new(root2, {
					sprite: am5.Circle.new(root2, {
				        radius: 5,
				        fill: series1.get("fill")
	      			})
	    		});
	  		});
		}
  			
		series1.strokes.template.setAll({
			strokeWidth: 3,
			templateField: "strokeSettings"
		});
		series1.data.setAll(data);
	
		// 탈퇴
		var series2 = chart2.series.push(
			am5xy.LineSeries.new(root2, {
//				name: "탈퇴",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "withdrawal",
				categoryXField: "day",
				tooltip: am5.Tooltip.new(root2, {
					pointerOrientation: "horizontal",
					labelText: "Withdrawal : {valueY} {info}"					
				})
			})
		);
		
		if ( data.length < 2 ) {
			series2.bullets.push(function() {
	    		return am5.Bullet.new(root2, {
					sprite: am5.Circle.new(root2, {
				        radius: 5,
				        fill: series2.get("fill")
	      			})
	    		});
	  		});
  		}
  		
  		series2.strokes.template.setAll({
			strokeWidth: 3,
			strokeDasharray: [3,3],
			templateField: "strokeSettings"
		});
	
		series2.data.setAll(data);
	
		chart2.set("cursor", am5xy.XYCursor.new(root2, {}));
		chart2.appear(1000, 100);
		series1.appear();
	
	}); 		
}


// 사이트별 로그인 누적 현황
function getLoginStatusForSite() {
	
	$.ajax({
		type : 'post',
		data : { "group_id" : $("#groupListTop option:selected").val(),
				 "group_type" : $('#groupListTop option:selected').attr('status') },
		url : 'get_login_cumulative_stat',
		success : function(result) {
//			console.log(result);
			drawLoginStatusForSite(result.site_login);
			drawGroupMembersLoginStatusForSite(result.group_login);
		}
	});
}


// 로그인 현황 > 사이트 > 사이트 전체 로그인 누적 현황  
var root3, chart3;
function drawLoginStatusForSite(data) {
	
	am5.ready(function() {

		if ( root3 ) {
			root3.container.children.clear();
			root3.dispose();	
		}
		root3 = am5.Root.new("chartdiv3");
		root3.setThemes([
			am5themes_Animated.new(root3)
		]);
	
		chart3 = root3.container.children.push(am5xy.XYChart.new(root3, {
			panX: false,
			panY: false,
			wheelX: "none",
			wheelY: "none"
		}));
	
		chart3.zoomOutButton.set("forceHidden", true);
	
		var yRenderer = am5xy.AxisRendererY.new(root3, {
			minGridDistance: 30
		});
	
		var yAxis = chart3.yAxes.push(am5xy.CategoryAxis.new(root3, {
			maxDeviation: 0,
			categoryField: "site",
			renderer: yRenderer,
			tooltip: am5.Tooltip.new(root3, { themeTags: ["axis"] })
		}));
	
		var xAxis = chart3.xAxes.push(am5xy.ValueAxis.new(root3, {
			maxDeviation: 0,
			min: 0,
			extraMax: 0.1,
			renderer: am5xy.AxisRendererX.new(root3, {})
		}));
	
		var series = chart3.series.push(am5xy.ColumnSeries.new(root3, {
			name: "Series 1",
			xAxis: xAxis,
			yAxis: yAxis,
			valueXField: "tot",
			categoryYField: "site",
			tooltip: am5.Tooltip.new(root3, {
				pointerOrientation: "left",
				labelText: "{valueX}"
			})
		}));
	
		series.columns.template.setAll({
			cornerRadiusTR: 5,
			cornerRadiusBR: 5
		});
	
		series.columns.template.adapters.add("fill", function(fill, target) {
			return chart3.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		series.columns.template.adapters.add("stroke", function(stroke, target) {
			return chart3.get("colors").getIndex(series.columns.indexOf(target));
		});
		
		yAxis.data.setAll(data);
		series.data.setAll(data);
		sortCategoryAxis();
	
		// Get series item by category
		function getSeriesItem(category) {
			for (var i = 0; i < series.dataItems.length; i++) {
				var dataItem = series.dataItems[i];
				if (dataItem.get("categoryY") == category) {
					return dataItem;
				}
			}
		}
	
		chart3.set("cursor", am5xy.XYCursor.new(root3, {
			behavior: "none",
			xAxis: xAxis,
			yAxis: yAxis
		}));
	
	
		// Axis sorting
		function sortCategoryAxis() {
			// Sort by value
			series.dataItems.sort(function(x, y) {
				return x.get("valueX") - y.get("valueX"); // descending
			})
	
			// Go through each axis item
			am5.array.each(yAxis.dataItems, function(dataItem) {
				// get corresponding series item
				var seriesDataItem = getSeriesItem(dataItem.get("category"));
	
				if (seriesDataItem) {
					// get index of series data item
					var index = series.dataItems.indexOf(seriesDataItem);
					// calculate delta position
					var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
					// set index to be the same as series data item index
					dataItem.set("index", index);
					// set deltaPosition instanlty
					dataItem.set("deltaPosition", -deltaPosition);
					// animate delta position to 0
					dataItem.animate({
						key: "deltaPosition",
						to: 0,
						duration: 1000,
						easing: am5.ease.out(am5.ease.cubic)
					})
				}
			});
	
			yAxis.dataItems.sort(function(x, y) {
				return x.get("index") - y.get("index");
			});
		}
	
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root3, {
		  menu: am5plugins_exporting.ExportingMenu.new(root3, {
		    container: document.getElementById("chartdiv3")
		  }),
		  dataSource: data,
		  dataFields: {
		    site: "사이트",
		    tot: "로그인 누적(단위:명)"
		    
		  },
		  dataFieldsOrder: ["site", "tot"]
		});
		
		series.appear(1000);
		chart3.appear(1000, 100);
	
	}); // end am5.ready()

}

// 그룹 회원들 사이트별 로그인 누적 현황
function getGroupMembersLoginStatusForSite() {
	
	var groupId = $("#groupListTop option:selected").val();
	$.ajax({
		type : 'post',
		data : { "group_id" : groupId,
				 "group_type" : $('#groupListTop option:selected').attr('status') },
		url : 'get_group_login_cumulative_stat',
		success : function(result) {
			drawGroupMembersLoginStatusForSite(result.group_login);
		}
	});
}

var root5, chart5;
// 그룹 회원들 사이트별 로그인 누적 현황 차트 
function drawGroupMembersLoginStatusForSite(data) {
	// 로그인 현황 > 그룹 > 그룹 회원들의 사이트 전체 로그인 누적 현황  
	am5.ready(function() {
	
		if ( root5 ) {
			root5.container.children.clear();
			root5.dispose();	
		}
		root5 = am5.Root.new("chartdiv5");
		root5.setThemes([
			am5themes_Animated.new(root5)
		]);
	
		chart5 = root5.container.children.push(am5xy.XYChart.new(root5, {
			panX: false,
			panY: false,
			wheelX: "none",
			wheelY: "none"
		}));
	
		// We don't want zoom-out button to appear while animating, so we hide it
		chart5.zoomOutButton.set("forceHidden", true);
	
	
		// Create axes
		// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
		var yRenderer = am5xy.AxisRendererY.new(root5, {
			minGridDistance: 30
		});
	
		var yAxis = chart5.yAxes.push(am5xy.CategoryAxis.new(root5, {
			maxDeviation: 0,
			categoryField: "site",
			renderer: yRenderer,
			tooltip: am5.Tooltip.new(root5, { themeTags: ["axis"] })
		}));
	
		var xAxis = chart5.xAxes.push(am5xy.ValueAxis.new(root5, {
			maxDeviation: 0,
			min: 0,
			extraMax: 0.1,
			renderer: am5xy.AxisRendererX.new(root5, {})
		}));
	
	
		// Add series
		// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
		var series = chart5.series.push(am5xy.ColumnSeries.new(root5, {
			name: "Series 1",
			xAxis: xAxis,
			yAxis: yAxis,
			valueXField: "tot",
			categoryYField: "site",
			tooltip: am5.Tooltip.new(root5, {
				pointerOrientation: "left",
				labelText: "{valueX}"
			})
		}));
	
	
		// Rounded corners for columns
		series.columns.template.setAll({
			cornerRadiusTR: 5,
			cornerRadiusBR: 5
		});
	
		// Make each column to be of a different color
		series.columns.template.adapters.add("fill", function(fill, target) {
			return chart5.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		series.columns.template.adapters.add("stroke", function(stroke, target) {
			return chart5.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		yAxis.data.setAll(data);
		series.data.setAll(data);
		sortCategoryAxis();
	
		// Get series item by category
		function getSeriesItem(category) {
			for (var i = 0; i < series.dataItems.length; i++) {
				var dataItem = series.dataItems[i];
				if (dataItem.get("categoryY") == category) {
					return dataItem;
				}
			}
		}
	
		chart5.set("cursor", am5xy.XYCursor.new(root5, {
			behavior: "none",
			xAxis: xAxis,
			yAxis: yAxis
		}));
	
	
		// Axis sorting
		function sortCategoryAxis() {
			// Sort by value
			series.dataItems.sort(function(x, y) {
				return x.get("valueX") - y.get("valueX"); // descending
				//return y.get("valueY") - x.get("valueX"); // ascending
			})
	
			// Go through each axis item
			am5.array.each(yAxis.dataItems, function(dataItem) {
				// get corresponding series item
				var seriesDataItem = getSeriesItem(dataItem.get("category"));
	
				if (seriesDataItem) {
					// get index of series data item
					var index = series.dataItems.indexOf(seriesDataItem);
					// calculate delta position
					var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
					// set index to be the same as series data item index
					dataItem.set("index", index);
					// set deltaPosition instanlty
					dataItem.set("deltaPosition", -deltaPosition);
					// animate delta position to 0
					dataItem.animate({
						key: "deltaPosition",
						to: 0,
						duration: 1000,
						easing: am5.ease.out(am5.ease.cubic)
					})
				}
			});
			yAxis.dataItems.sort(function(x, y) {
				return x.get("index") - y.get("index");
			});
		}
	
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root5, {
		  menu: am5plugins_exporting.ExportingMenu.new(root5, {
		    container: document.getElementById("chartdiv5")
		  }),
		  dataSource: data,
		  dataFields: {
		    site: "사이트",
		    tot: "로그인 누적(단위:명)"
		    
		  },
		  dataFieldsOrder: ["site", "tot"]
		});
	
		series.appear(1000);
		chart5.appear(1000, 100);
	
	}); // end am5.ready()	
}



// 사용자의 사이트별 로그인 누적 현황
function getMemberAumulativeLoginStatusForSite(memberNo) {
	
	$.ajax({
		type : 'post',
		data : { "member_no" : memberNo },
		url : 'get_member_login_cumulative_stat',
		success : function(result) {
			drawMemberAumulativeLoginStatusForSite(result.member_stat_list);
		}
	});
}

var root7, chart7;
function drawMemberAumulativeLoginStatusForSite(data) {
//	console.log(data);

	// 로그인 현황 > 사용자 > 사용자별 사이트 전체 로그인 누적 현황  
	am5.ready(function() {
		
		if ( root7 ) {
			root7.container.children.clear();
			root7.dispose();	
		}
		
		root7 = am5.Root.new("chartdiv7");
		root7.setThemes([
			am5themes_Animated.new(root7)
		]);
	
		chart7 = root7.container.children.push(am5xy.XYChart.new(root7, {
			panX: false,
			panY: false,
			wheelX: "none",
			wheelY: "none"
		}));
	
		chart7.zoomOutButton.set("forceHidden", true);
	
		var yRenderer = am5xy.AxisRendererY.new(root7, {
			minGridDistance: 30
		});
	
		var yAxis = chart7.yAxes.push(am5xy.CategoryAxis.new(root7, {
			maxDeviation: 0,
			categoryField: "site",
			renderer: yRenderer,
			tooltip: am5.Tooltip.new(root7, { themeTags: ["axis"] })
		}));
	
		var xAxis = chart7.xAxes.push(am5xy.ValueAxis.new(root7, {
			maxDeviation: 0,
			min: 0,
			extraMax: 0.1,
			renderer: am5xy.AxisRendererX.new(root7, {})
		}));
	
		var series = chart7.series.push(am5xy.ColumnSeries.new(root7, {
			name: "Series 1",
			xAxis: xAxis,
			yAxis: yAxis,
			valueXField: "tot",
			categoryYField: "site",
			tooltip: am5.Tooltip.new(root7, {
				pointerOrientation: "left",
				labelText: "{valueX}"
			})
		}));
	
		series.columns.template.setAll({
			cornerRadiusTR: 5,
			cornerRadiusBR: 5
		});
	
		series.columns.template.adapters.add("fill", function(fill, target) {
			return chart7.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		series.columns.template.adapters.add("stroke", function(stroke, target) {
			return chart7.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		yAxis.data.setAll(data);
		series.data.setAll(data);
		sortCategoryAxis();
	
		// Get series item by category
		function getSeriesItem(category) {
			for (var i = 0; i < series.dataItems.length; i++) {
				var dataItem = series.dataItems[i];
				if (dataItem.get("categoryY") == category) {
					return dataItem;
				}
			}
		}
	
		chart7.set("cursor", am5xy.XYCursor.new(root7, {
			behavior: "none",
			xAxis: xAxis,
			yAxis: yAxis
		}));
	
	
		// Axis sorting
		function sortCategoryAxis() {
			series.dataItems.sort(function(x, y) {
				return x.get("valueX") - y.get("valueX"); // descending
			})
			am5.array.each(yAxis.dataItems, function(dataItem) {
				var seriesDataItem = getSeriesItem(dataItem.get("category"));
				if (seriesDataItem) {
					var index = series.dataItems.indexOf(seriesDataItem);
					var deltaPosition = (index - dataItem.get("index", 0)) / series.dataItems.length;
					dataItem.set("index", index);
					dataItem.set("deltaPosition", -deltaPosition);
					dataItem.animate({
						key: "deltaPosition",
						to: 0,
						duration: 1000,
						easing: am5.ease.out(am5.ease.cubic)
					})
				}
			});
			yAxis.dataItems.sort(function(x, y) {
				return x.get("index") - y.get("index");
			});
		}
	
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root7, {
		  menu: am5plugins_exporting.ExportingMenu.new(root7, {
		    container: document.getElementById("chartdiv7")
		  }),
		  dataSource: data,
		  dataFields: {
		    site: "사이트",
		    tot: "로그인 누적(단위:명)"
		    
		  },
		  dataFieldsOrder: ["site", "tot"]
		});
	
		series.appear(1000);
		chart7.appear(1000, 100);
	
	}); // end am5.ready()
	
}

var currentSelectedMemberInput;
$(function() {
	
	$("#selectedMemberTop").on("click", function(){
		currentSelectedMemberInput = "top";
	});
	
	$("#selectedMemberBottom").on("click", function(){
		currentSelectedMemberInput = "bottom";
	});
	
	// 로그인 현황 통계 > 사이트별 로그인 누적 현황 > 회원 목록 클릭 이벤트 
	$(document).on("click", "#stat_lp_members_fragment tbody tr", function() {
		
		var memberNo = $(this).find("#lpMemberNo").text();
		var memberNm = $(this).find("#lpMemberNm").text();
		
		$("#closeBtn").click();
		
		if ( currentSelectedMemberInput == "top" )  {
			$("#selectedMemberTop").text(memberNm);
			getMemberAumulativeLoginStatusForSite(memberNo);
		}
		else {
			$("#selectedMemberBottom").text(memberNm);
			$("#selectedMemberNoBottom").val(memberNo);
			getMemberLoginStatusForSite(0);
		}
		
	});
	
	
	// 로그인 현황 통계 > 사이트별 로그인 누적 현황 > 회원 목록 클릭 이벤트 
	$(document).on("click", "#lp_group_members_fragment tbody tr", function() {
		var memberNo = $(this).find("#lpMemberNo").text();
		var memberNm = $(this).find("#lpMemberNm").text();
		$("#selectedGroupMember").text(memberNm);
		$("#selectedGroupMemberNo").val(memberNo);
		$("#closeBtn1").click();
		
		getGroupMemberLoginStatus(0);
	});
})

// 사용자별 통계를 위한 회원 목록 페이징
function statLpMembersPaging(pageNo) {
	$.ajax({
		type : 'post',
		data : { "page_no" : pageNo,
				"category" : $("#lpMemberCategory option:selected").val(),
				"search" : $("#lpMemberSearch").val(), 
				"sorting": $("#lpMemberSorting option:selected").val() },
		url : "stat_lp_members_paging",
		success : function(data) {
			$("#stat_lp_members_fragment").replaceWith(data);
		}
	});
}

// 로그인 현황 통계 (사이트별 로그인 현황)
function getEachSiteLoginStatus(type) {

	var startDate = $("#siteStartDate").val();
	var endDate = $("#siteEndDate").val();
	
	// 조회기간 시작일이 종료일보다 큰 경우 
	if ( new Date(startDate) > new Date(endDate) ) {
		swal({
			title: "",
			text: alertStatCheckDate,
			confirmButtonText: common_confirm
		});
		return false;
	}
	
	var siteDate = startDate + ":" + endDate;
	
	// 7일, 30일 버튼 클릭
	if ( type > 0 ) {
		siteDate = type;	
		var temp = settingDateOffset(today, type);
		tempStartDate = settingDateFormat(temp);
		$("#siteStartDate").val(tempStartDate);
		$("#siteEndDate").val(defaultEndDate);
	}
	
	$.ajax({
		type : 'post',
		data : { "site_date" : siteDate,
				 "site" : $("#siteList option:selected").val() },
		url : 'get_statistics_each_site',
		success : function(result) {
//			console.log(result.site_login);
			drawEachSiteLoginStatus(result.site_login);
		}
	});
}

// 사이트별 로그인 현황 차트
var root4, chart4;
function drawEachSiteLoginStatus(data) {
	
	am5.ready(function() {

		if ( root4 ) {
			root4.container.children.clear();
			root4.dispose();	
		}
		root4 = am5.Root.new("chartdiv4");
		root4.setThemes([am5themes_Animated.new(root4)]);
		chart4 = root4.container.children.push(
			am5xy.XYChart.new(root4, {
				panX: false,
				panY: false,
				wheelX: "panX",
				wheelY: "zoomX",
				layout: root4.verticalLayout
			})
		);
	
		chart4.set(
			"scrollbarX",
			am5.Scrollbar.new(root4, {
				orientation: "horizontal"
			})
		);
		
	
		var xAxis = chart4.xAxes.push(
			am5xy.CategoryAxis.new(root4, {
				categoryField: "dayUnit",
				renderer: am5xy.AxisRendererX.new(root4, {}),
				tooltip: am5.Tooltip.new(root4, {})
			})
		);
	
		xAxis.data.setAll(data);
	
		var yAxis = chart4.yAxes.push(
			am5xy.ValueAxis.new(root4, {
				min: 0,
				extraMax: 0.1,
				renderer: am5xy.AxisRendererY.new(root4, {})
			})
		);
	
		// 가입
		var series1 = chart4.series.push(
			am5xy.LineSeries.new(root4, {
//				name: "가입",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "tot",
				categoryXField: "dayUnit",
				tooltip: am5.Tooltip.new(root4, {
					pointerOrientation: "horizontal",
//					labelText: "{name} in {categoryX}: {valueY} {info}"
					labelText: "Login : {valueY} {info}"
				})
			})
		);
	
		if ( data.length < 2 ) {
			series1.bullets.push(function() {
	    		return am5.Bullet.new(root4, {
					sprite: am5.Circle.new(root4, {
				        radius: 3,
				        fill: series1.get("fill")
	      			})
	    		});
	  		});
		}
	
		series1.strokes.template.setAll({
			strokeWidth: 3,
			templateField: "strokeSettings"
		});
		series1.data.setAll(data);
			
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root4, {
		  menu: am5plugins_exporting.ExportingMenu.new(root4, {
		    container: document.getElementById("chartdiv4")
		  }),
		  dataSource: data,
		  dataFields: {
		    dayUnit: "날짜",
		    tot: "로그인(단위:명)"
		    
		  },
		  dataFieldsOrder: ["dayUnit", "tot"]
		});
		
		chart4.set("cursor", am5xy.XYCursor.new(root4, {}));
		chart4.appear(1000, 100);
		series1.appear();
	
	}); 		
}










// 그룹 회원의 로그인 현황
function getGroupMemberLoginStatus(type) {
	
	var startDate = $("#groupStartDate").val();
	var endDate = $("#groupEndDate").val();
	
	// 조회기간 시작일이 종료일보다 큰 경우 
	if ( new Date(startDate) > new Date(endDate) ) {
		
		swal({
			title: "",
			text: alertStatCheckDate,
			confirmButtonText: common_confirm
		});
		return false;
	}
	
	var groupDate = startDate + ":" + endDate;
	
	// 7일, 30일 버튼 클릭
	if ( type > 0 ) {
		groupDate = type;	
		var temp = settingDateOffset(today, type);
		tempStartDate = settingDateFormat(temp);
		$("#groupStartDate").val(tempStartDate);
		$("#groupEndDate").val(defaultEndDate);
	}
	
	if ( $("#selectedGroupMemberNo").val() == "" ) {
		swal({
			title: "",
			text: alertStatSelectGMemeber,
			confirmButtonText: common_confirm
		});
		return false;
	}
	
	$.ajax({
		type : 'post',
		data : { "member_no" : $("#selectedGroupMemberNo").val(),
				 "group_date" : groupDate },
		url : 'get_statistics_each_group',
		success : function(result) {
			drawGroupMemberLoginStatus(result.group_login);
		}
	});
}












var root6, chart6;
function drawGroupMemberLoginStatus(data) {
	
	am5.ready(function() {

		if ( root6 ) {
			root6.container.children.clear();
			root6.dispose();	
		}
		root6 = am5.Root.new("chartdiv6");
		root6.setThemes([am5themes_Animated.new(root6)]);
		chart6 = root6.container.children.push(
			am5xy.XYChart.new(root6, {
				panX: false,
				panY: false,
				wheelX: "panX",
				wheelY: "zoomX",
				layout: root6.verticalLayout
			})
		);
	
		chart6.set(
			"scrollbarX",
			am5.Scrollbar.new(root6, {
				orientation: "horizontal"
			})
		);
		
	
		var xAxis = chart6.xAxes.push(
			am5xy.CategoryAxis.new(root6, {
				categoryField: "dayUnit",
				renderer: am5xy.AxisRendererX.new(root6, {}),
				tooltip: am5.Tooltip.new(root6, {})
			})
		);
	
		xAxis.data.setAll(data);
	
		var yAxis = chart6.yAxes.push(
			am5xy.ValueAxis.new(root6, {
				min: 0,
				extraMax: 0.1,
				renderer: am5xy.AxisRendererY.new(root6, {})
			})
		);
	
		// 가입
		var series1 = chart6.series.push(
			am5xy.LineSeries.new(root6, {
//				name: "가입",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "tot",
				categoryXField: "dayUnit",
				tooltip: am5.Tooltip.new(root6, {
					pointerOrientation: "horizontal",
//					labelText: "{name} in {categoryX}: {valueY} {info}"
					labelText: "Login : {valueY} {info}"
				})
			})
		);
	
		if ( data.length < 2 ) {
			series1.bullets.push(function() {
	    		return am5.Bullet.new(root6, {
					sprite: am5.Circle.new(root6, {
				        radius: 3,
				        fill: series1.get("fill")
	      			})
	    		});
	  		});
		}
	
		series1.strokes.template.setAll({
			strokeWidth: 3,
			templateField: "strokeSettings"
		});
		series1.data.setAll(data);
			
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root6, {
		  menu: am5plugins_exporting.ExportingMenu.new(root6, {
		    container: document.getElementById("chartdiv6")
		  }),
		  dataSource: data,
		  dataFields: {
		    dayUnit: "날짜",
		    tot: "로그인(단위:명)"
		    
		  },
		  dataFieldsOrder: ["dayUnit", "tot"]
		});
		
		chart6.set("cursor", am5xy.XYCursor.new(root6, {}));
		chart6.appear(1000, 100);
		series1.appear();
	
	}); 		
}


//var root6, chart6;
//function drawGroupMemberLoginStatus(data) {
//			
//	
//	am5.ready(function() {
//		
//		if ( root6 ) {
//			root6.container.children.clear();
//			root6.dispose();	
//		}
//		
//		root6 = am5.Root.new("chartdiv6");
//		root6.setThemes([
//			am5themes_Animated.new(root6)
//		]);
//	
//		root6.dateFormatter.setAll({
//			dateFormat: "yyyy",
//			dateFields: ["valueX"]
//		});
//	
//		chart6 = root6.container.children.push(am5xy.XYChart.new(root6, {
//			focusable: true,
//			panX: true,
//			panY: true,
//			wheelX: "panX",
//			wheelY: "zoomX",
//			pinchZoomX: true
//		}));
//	
//		var easing = am5.ease.linear;
//		var xAxis = chart6.xAxes.push(am5xy.DateAxis.new(root6, {
//			maxDeviation: 0.1,
//			groupData: false,
//			baseInterval: {
//				timeUnit: "dayUnit",
//				count: 1
//			},
//			renderer: am5xy.AxisRendererX.new(root6, {
//	
//			}),
//			tooltip: am5.Tooltip.new(root6, {})
//		}));
//	
//		var yAxis = chart6.yAxes.push(am5xy.ValueAxis.new(root6, {
//			maxDeviation: 0.2,
//			renderer: am5xy.AxisRendererY.new(root6, {})
//		}));
//	
//		var series = chart6.series.push(am5xy.LineSeries.new(root6, {
//			minBulletDistance: 10,
//			connect: false,
//			xAxis: xAxis,
//			yAxis: yAxis,
//			valueYField: "tot",
//			valueXField: "dayUnit",
//			tooltip: am5.Tooltip.new(root6, {
//				pointerOrientation: "horizontal",
//				labelText: "{valueY}"
//			})
//		}));
//	
//		series.fills.template.setAll({
//			fillOpacity: 0.2,
//			visible: true
//		});
//	
//		series.strokes.template.setAll({
//			strokeWidth: 2
//		});
//
//		series.data.processor = am5.DataProcessor.new(root6, {
//			dateFormat: "yyyy-MM-dd",
//			dateFields: ["dayUnit"]
//		});
//	
//		series.data.setAll(data);
//	
//		series.bullets.push(function() {
//			var circle = am5.Circle.new(root6, {
//				radius: 4,
//				fill: root6.interfaceColors.get("background"),
//				stroke: series.get("fill"),
//				strokeWidth: 2
//			})
//	
//			return am5.Bullet.new(root6, {
//				sprite: circle
//			})
//		});
//	
//		var cursor = chart6.set("cursor", am5xy.XYCursor.new(root6, {
//			xAxis: xAxis,
//			behavior: "none"
//		}));
//		cursor.lineY.set("visible", false);
//	
//		chart6.set("scrollbarX", am5.Scrollbar.new(root6, {
//			orientation: "horizontal"
//		}));
//	
//		chart6.appear(1000, 100);
//	
//	}); // end am5.ready()	
//	
//}


function groupListBottomChange() {
	
	$("#selectedGroupMember").text("---");
	$("#selectedGroupMemberNo").val("");
	statLpGroupMembersPaging(1);
}

// 그룹 회원별 통계를 위한 회원 목록 페이징
function statLpGroupMembersPaging(pageNo) {
	
	$.ajax({
		type : 'post',
		data : { "page_no" : pageNo,
				 "group_id" : $("#groupListBottom option:selected").val(),
				 "group_type" : $('#groupListBottom option:selected').attr('status')},
		url : "lp_group_members_paging",
		success : function(data) {
			$("#lp_group_members_fragment").replaceWith(data);
		}
	});
}


// 사용자의 사이트별 로그인 현황
function getMemberLoginStatusForSite(type) {
	
	var startDate = $("#memberSiteStartDate").val();
	var endDate = $("#memberSiteEndDate").val();
	
	// 조회기간 시작일이 종료일보다 큰 경우 
	if ( new Date(startDate) > new Date(endDate) ) {
		swal({
			title: "",
			text: alertStatCheckDate,
			confirmButtonText: common_confirm
		});
		return false;
	}
	
	var memberSiteDate = startDate + ":" + endDate;
	
	// 7일, 30일 버튼 클릭
	if ( type > 0 ) {
		memberSiteDate = type;	
		var temp = settingDateOffset(today, type);
		tempStartDate = settingDateFormat(temp);
		$("#memberSiteStartDate").val(tempStartDate);
		$("#memberSiteEndDate").val(defaultEndDate);
	}
	
	if ( $("#selectedMemberNoBottom").val() == "" ) {
		swal({
			title: "",
			text: alertStatSelectMember,
			confirmButtonText: common_confirm
		});
		return false;
	}
	
	$.ajax({
		type : 'post',
		data : { "member_no" : $("#selectedMemberNoBottom").val(),
				 "member_site_date": memberSiteDate,
				 "site" : $("#memberSiteList option:selected").val() },
		url : 'get_member_login_status_for_site',
		success : function(result) {
			drawMemberLoginStatusForSite(result.member_site_stat);
		}
	});
}

//var root8, chart8;
//function drawMemberLoginStatusForSite(data) {
//	am5.ready(function() {
//	
//		if ( root8 ) {
//			root8.container.children.clear();
//			root8.dispose();	
//		}
//		root8 = am5.Root.new("chartdiv8");
//		// Set themes
//		// https://www.amcharts.com/docs/v5/concepts/themes/
//		root8.setThemes([
//			am5themes_Animated.new(root8)
//		]);
//	
//		root8.dateFormatter.setAll({
//			dateFormat: "yyyy",
//			dateFields: ["valueX"]
//		});
//		
//		chart8 = root8.container.children.push(am5xy.XYChart.new(root8, {
//			focusable: true,
//			panX: true,
//			panY: true,
//			wheelX: "panX",
//			wheelY: "zoomX",
//			pinchZoomX: true
//		}));
//
//		var easing = am5.ease.linear;
//		var xAxis = chart8.xAxes.push(am5xy.DateAxis.new(root8, {
//			maxDeviation: 0.1,
//			groupData: false,
//			baseInterval: {
//				timeUnit: "dayUnit",
//				count: 1
//			},
//			renderer: am5xy.AxisRendererX.new(root8, {
//	
//			}),
//			tooltip: am5.Tooltip.new(root8, {})
//		}));
//	
//		var yAxis = chart8.yAxes.push(am5xy.ValueAxis.new(root8, {
//			maxDeviation: 0.2,
//			renderer: am5xy.AxisRendererY.new(root8, {})
//		}));
//	
//		var series = chart8.series.push(am5xy.LineSeries.new(root8, {
//			minBulletDistance: 10,
//			connect: false,
//			xAxis: xAxis,
//			yAxis: yAxis,
//			valueYField: "tot",
//			valueXField: "dayUnit",
//			tooltip: am5.Tooltip.new(root8, {
//				pointerOrientation: "horizontal",
//				labelText: "{valueY}"
//			})
//		}));
//	
//		series.fills.template.setAll({
//			fillOpacity: 0.2,
//			visible: true
//		});
//	
//		series.strokes.template.setAll({
//			strokeWidth: 2
//		});
//	
//		series.data.processor = am5.DataProcessor.new(root8, {
//			dateFormat: "yyyy-MM-dd",
//			dateFields: ["dayUnit"]
//		});
//	
//		series.data.setAll(data);
//	
//		series.bullets.push(function() {
//			var circle = am5.Circle.new(root8, {
//				radius: 4,
//				fill: root8.interfaceColors.get("background"),
//				stroke: series.get("fill"),
//				strokeWidth: 2
//			})
//	
//			return am5.Bullet.new(root8, {
//				sprite: circle
//			})
//		});
//	
//		var cursor = chart8.set("cursor", am5xy.XYCursor.new(root8, {
//			xAxis: xAxis,
//			behavior: "none"
//		}));
//		cursor.lineY.set("visible", false);
//		chart8.set("scrollbarX", am5.Scrollbar.new(root8, {
//			orientation: "horizontal"
//		}));
//		chart8.appear(1000, 100);
//	
//	}); // end am5.ready()
//}


var root8, chart8;
function drawMemberLoginStatusForSite(data) {
	
	am5.ready(function() {

		if ( root8 ) {
			root8.container.children.clear();
			root8.dispose();	
		}
		root8 = am5.Root.new("chartdiv8");
		root8.setThemes([am5themes_Animated.new(root8)]);
		chart8 = root8.container.children.push(
			am5xy.XYChart.new(root8, {
				panX: false,
				panY: false,
				wheelX: "panX",
				wheelY: "zoomX",
				layout: root8.verticalLayout
			})
		);
	
		chart8.set(
			"scrollbarX",
			am5.Scrollbar.new(root8, {
				orientation: "horizontal"
			})
		);
		
	
		var xAxis = chart8.xAxes.push(
			am5xy.CategoryAxis.new(root8, {
				categoryField: "dayUnit",
				renderer: am5xy.AxisRendererX.new(root8, {}),
				tooltip: am5.Tooltip.new(root8, {})
			})
		);
	
		xAxis.data.setAll(data);
	
		var yAxis = chart8.yAxes.push(
			am5xy.ValueAxis.new(root8, {
				min: 0,
				extraMax: 0.1,
				renderer: am5xy.AxisRendererY.new(root8, {})
			})
		);
	
		// 가입
		var series1 = chart8.series.push(
			am5xy.LineSeries.new(root8, {
//				name: "가입",
				xAxis: xAxis,
				yAxis: yAxis,
				valueYField: "tot",
				categoryXField: "dayUnit",
				tooltip: am5.Tooltip.new(root8, {
					pointerOrientation: "horizontal",
//					labelText: "{name} in {categoryX}: {valueY} {info}"
					labelText: "Login : {valueY} {info}"
				})
			})
		);
	
		if ( data.length < 2 ) {
			series1.bullets.push(function() {
	    		return am5.Bullet.new(root8, {
					sprite: am5.Circle.new(root8, {
				        radius: 3,
				        fill: series1.get("fill")
	      			})
	    		});
	  		});
		}
	
		series1.strokes.template.setAll({
			strokeWidth: 3,
			templateField: "strokeSettings"
		});
		series1.data.setAll(data);
			
		// 데이터 다운로드 
		am5plugins_exporting.Exporting.new(root8, {
		  menu: am5plugins_exporting.ExportingMenu.new(root8, {
		    container: document.getElementById("chartdiv8")
		  }),
		  dataSource: data,
		  dataFields: {
		    dayUnit: "날짜",
		    tot: "로그인(단위:명)"
		    
		  },
		  dataFieldsOrder: ["dayUnit", "tot"]
		});
		
		chart8.set("cursor", am5xy.XYCursor.new(root8, {}));
		chart8.appear(1000, 100);
		series1.appear();
	
	}); 		
}


















