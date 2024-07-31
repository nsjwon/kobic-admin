$(function() {
	
	// my workspacelist click event
	$(document).on("click", ".myw_inner", function(e) {
		var selected = $(e.currentTarget);
		var selectedParent = selected.parent("div");
		$(selectedParent).toggleClass("on");
		
		var selectedParentId = $(selectedParent).attr("id");
		$("#" + selectedParentId + "_pipelines").toggleClass("Dis_none");
	});
})

// Resources Usage
function drawChartAllResourcesUsage(){
	$.ajax({
		url: getContextPath() + '/mypage/resources_usage',
		type: 'GET',
		success: function(data){
	
			var cpu_total = Number(data.cpu_total);			
			var cpu_standby_resource = Number(data.cpu_standby_resource);		
			var cpu_usage = Number(data.cpu_usage);		
				
			var mem_total = Number(data.mem_total);			
			var mem_standby_resource = Number(data.mem_standby_resource);		
			var mem_usage = Number(data.mem_usage);
			
			// 2023.03.15, jhkim
			// - 총 메모리보다 사용 메모리가 넘어가는 경우 처리
			// - 보호코드 적용, 사용 메모리가 총 메모리를 넘어가는 이유 추가 확인 및 수정 예정
			if(mem_usage >= mem_total) {
				mem_usage = mem_total;
			}			

			// cpu 
			drawCpuChart(cpu_usage);
			
			// memory
			drawMemoryChart(mem_total, mem_usage);
		}
	});	
}
	
// draw CPU Chart
function drawCpuChart(cpuData) {
		
	am5.ready(function() {
	
	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	var root = am5.Root.new("chartdiv2_1");
	
	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
	  am5themes_Animated.new(root)
	]);
	
	// Create chart
	// https://www.amcharts.com/docs/v5/charts/radar-chart/
	var chart = root.container.children.push(am5radar.RadarChart.new(root, {
	  panX: false,
	  panY: false,
	  startAngle: 160,
	  endAngle: 380
	}));
	
	// Create axis and its renderer
	// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
	var axisRenderer = am5radar.AxisRendererCircular.new(root, {
	  innerRadius: 75	
	});
	
	axisRenderer.grid.template.setAll({
	  stroke: root.interfaceColors.get("background"),
	  visible: true,
	  strokeOpacity: 0.8
	});
	
	var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
	  maxDeviation: 0,
	  min: 0,
	  max: 100,
	  strictMinMax: true,
	  renderer: axisRenderer
	}));
	
	// Add clock hand
	// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
	var axisDataItem = xAxis.makeDataItem({
		value: 0
	});
	
	var clockHand = am5radar.ClockHand.new(root, {
	  pinRadius: 20,			// 침 중심 원 크기
	  radius: am5.percent(80),	// 침 길이
	  bottomWidth: 15			// 침 bottom 길이
	})
	
	var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
	  sprite: clockHand
	}));
	
	xAxis.createAxisRange(axisDataItem);
	
	// 바늘 label 
	var label = chart.radarContainer.children.push(am5.Label.new(root, {
	  fill: am5.color(0xffffff),
	  centerX: am5.percent(50),
	  textAlign: "center",
	  centerY: am5.percent(50),
	  fontSize: "20px"
	}));
	
//	axisDataItem.set("value", cpuData);
	axisDataItem.set("value", 0);	// 바늘 증가 animation을 위함
	bullet.get("sprite").on("rotation", function () {
	  var value = axisDataItem.get("value");
//	  var text = Math.round(axisDataItem.get("value")).toString();
	  var fill = am5.color(0x000000);
	  xAxis.axisRanges.each(function (axisRange) {
	    if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
	      fill = axisRange.get("axisFill").get("fill");
	    }
	  })
	
	  // 실제 CPU 데이터 입력 (String)
	  label.set("text", Math.round(value).toString());
	
	  clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
	  clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
	});
	
	setInterval(function () {
	  axisDataItem.animate({
	    key: "value",
	    to: cpuData,
	    duration: 500,
	    easing: am5.ease.out(am5.ease.cubic)
	  });
	}, 2000)
	
	chart.bulletsContainer.set("mask", undefined);
	
	
	// Create axis ranges bands
	// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
	var bandsData = [{
	  title: "1",
	  color: "#b0d136",
	  lowScore: 0,
	  highScore: 20
	}, {
	  title: "2",
	  color: "#f3eb0c",
	  lowScore: 20,
	  highScore: 40
	}, {
	  title: "3",
	  color: "#fdae19",
	  lowScore: 40,
	  highScore: 60
	}, {
	  title: "4",
	  color: "#f04922",
	  lowScore: 60,
	  highScore: 80
	}, {
	  title: "5",
	  color: "#ee1f25",
	  lowScore: 80,
	  highScore: 100
	}];
	// 위의 bandsData 세팅 
	am5.array.each(bandsData, function (data) {
	  var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
	
	  axisRange.setAll({
	    value: data.lowScore,
	    endValue: data.highScore
	  });
	
	  axisRange.get("axisFill").setAll({
	    visible: true,
	    fill: am5.color(data.color),
	    fillOpacity: 0.8
	  });
	
	  axisRange.get("label").setAll({
	    text: data.title,
	    inside: true,
	    radius: 15,
	    fontSize: "0.9em",
	    fill: root.interfaceColors.get("background")
	  });
	});
	
	
	// Make stuff animate on load
	chart.appear(1000, 100);
	
	}); // end am5.ready()
}


// draw Memory Chart
function drawMemoryChart(totalMemory, memoryData) {
		
	am5.ready(function() {
	
	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	var root = am5.Root.new("chartdiv2_2");
	
	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
	  am5themes_Animated.new(root)
	]);
	
	// Create chart
	// https://www.amcharts.com/docs/v5/charts/radar-chart/
	var chart = root.container.children.push(am5radar.RadarChart.new(root, {
	  panX: false,
	  panY: false,
	  startAngle: 160,
	  endAngle: 380
	}));
	
	// Create axis and its renderer
	// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Axes
	var axisRenderer = am5radar.AxisRendererCircular.new(root, {
	  innerRadius: 75	
	});
	
	axisRenderer.grid.template.setAll({
	  stroke: root.interfaceColors.get("background"),
	  visible: true,
	  strokeOpacity: 0.8
	});
	
	var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
	  maxDeviation: 0,
	  min: 0,
	  max: totalMemory,
	  strictMinMax: true,
	  renderer: axisRenderer
	}));
	
	// Add clock hand
	// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands
	var axisDataItem = xAxis.makeDataItem({
		value: 0
	});
	
	var clockHand = am5radar.ClockHand.new(root, {
	  pinRadius: 30,			// 침 중심 원 크기
	  radius: am5.percent(80),	// 침 길이
	  bottomWidth: 15			// 침 bottom 길이
	})
	
	var bullet = axisDataItem.set("bullet", am5xy.AxisBullet.new(root, {
	  sprite: clockHand
	}));
	
	xAxis.createAxisRange(axisDataItem);
	
	// 바늘 label 
	var label = chart.radarContainer.children.push(am5.Label.new(root, {
	  fill: am5.color(0xffffff),
	  centerX: am5.percent(50),
	  textAlign: "center",
	  centerY: am5.percent(50),
	  fontSize: "20px"
	}));
	
//	axisDataItem.set("value", memoryData);
	axisDataItem.set("value", 0);	// 바늘 증가 animation을 위함
	bullet.get("sprite").on("rotation", function () {
	  var value = axisDataItem.get("value");
//	  var text = Math.round(axisDataItem.get("value")).toString();
	  var fill = am5.color(0x000000);
	  xAxis.axisRanges.each(function (axisRange) {
	    if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
	      fill = axisRange.get("axisFill").get("fill");
	    }
	  })
	
	  // 실제 Memory 데이터 입력 (String)
	  label.set("text", Math.round(value).toString());
	
	  clockHand.pin.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
	  clockHand.hand.animate({ key: "fill", to: fill, duration: 500, easing: am5.ease.out(am5.ease.cubic) })
	});
	
	setInterval(function () {
	  axisDataItem.animate({
	    key: "value",
	    to: memoryData,
	    duration: 500,
	    easing: am5.ease.out(am5.ease.cubic)
	  });
	}, 2000)
	
	chart.bulletsContainer.set("mask", undefined);
	
	// Create axis ranges bands
	// https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Bands
	var bandsData = [{
	  title: "1",
	  color: "#b0d136",
	  lowScore: 0,
	  highScore: totalMemory/5
	}, {
	  title: "2",
	  color: "#f3eb0c",
	  lowScore: totalMemory/5,
	  highScore: (totalMemory/5)*2
	}, {
	  title: "3",
	  color: "#fdae19",
	  lowScore: (totalMemory/5)*2,
	  highScore: (totalMemory/5)*3
	}, {
	  title: "4",
	  color: "#f04922",
	  lowScore: (totalMemory/5)*3,
	  highScore: (totalMemory/5)*4
	}, {
	  title: "5",
	  color: "#ee1f25",
	  lowScore: (totalMemory/5)*4,
	  highScore: (totalMemory/5)*5
	}];
	// 위의 bandsData 세팅 
	am5.array.each(bandsData, function (data) {
	  var axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
	
	  axisRange.setAll({
	    value: data.lowScore,
	    endValue: data.highScore
	  });
	
	  axisRange.get("axisFill").setAll({
	    visible: true,
	    fill: am5.color(data.color),
	    fillOpacity: 0.8
	  });
	
	  axisRange.get("label").setAll({
	    text: data.title,
	    inside: true,
	    radius: 15,
	    fontSize: "0.9em",
	    fill: root.interfaceColors.get("background")
	  });
	});
	
	
	// Make stuff animate on load
	chart.appear(1000, 100);
	
	}); // end am5.ready()
}



// Resources Usage
function drawChartResourcesUsage_back(){
	
	am4core.useTheme(am4themes_animated);
	
	/** CPU (pie chart) **/
	var cpu_chart = am4core.create("chartdiv2_1", am4charts.PieChart);
	cpu_chart.innerRadius = am4core.percent(40);
//	cpu_chart.padding(15);
	
	var cpu_title = cpu_chart.titles.create();
	cpu_title.text = "CPU";	
	cpu_title.fontSize = 15;
	cpu_title.fontWeight = "bold";
	cpu_title.fill = am4core.color("white");
	
	// Add and configure Series
	var cpu_pieSeries = cpu_chart.series.push(new am4charts.PieSeries());
	cpu_pieSeries.dataFields.value = "value";
	cpu_pieSeries.dataFields.category = "category";
	cpu_pieSeries.slices.template.stroke = am4core.color("#fff");
	cpu_pieSeries.innerRadius = 10;
	cpu_pieSeries.slices.template.fillOpacity = 0.5;
	cpu_pieSeries.slices.template.propertyFields.fill = "fill";
	cpu_pieSeries.labels.template.text = "";
	
	cpu_pieSeries.slices.template.propertyFields.disabled = "labelDisabled";
	cpu_pieSeries.labels.template.propertyFields.disabled = "labelDisabled";
	cpu_pieSeries.ticks.template.propertyFields.disabled = "labelDisabled";

	// Disable sliding out of slices
	cpu_pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	cpu_pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
	
	// Add second series
	var cpu_pieSeries2 = cpu_chart.series.push(new am4charts.PieSeries());
	cpu_pieSeries2.dataFields.value = "value";
	cpu_pieSeries2.dataFields.category = "category";
	cpu_pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	cpu_pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;
	cpu_pieSeries2.slices.template.propertyFields.fill = "fill";
	cpu_pieSeries2.labels.template.text = "";

	cpu_pieSeries.adapter.add("innerRadius", function(innerRadius, target){
		return am4core.percent(40);
	})
	
	cpu_pieSeries2.adapter.add("innerRadius", function(innerRadius, target){
		return am4core.percent(60);
	})
	
	cpu_pieSeries.adapter.add("radius", function(innerRadius, target){
		return am4core.percent(100);
	})
	
	cpu_pieSeries2.adapter.add("radius", function(innerRadius, target){
		return am4core.percent(80);
	})
	/** //CPU (pie chart) **/
	
	
	/** MEMORY (pie chart) **/
	var memory_chart = am4core.create("chartdiv2_2", am4charts.PieChart);
	memory_chart.innerRadius = am4core.percent(40);
//	memory_chart.padding(15);
	
	var memory_title = memory_chart.titles.create();
	memory_title.text = "MEMORY";	
	memory_title.fontSize = 15;
	memory_title.fontWeight = "bold";
	memory_title.fill = am4core.color("white");
	
	// Add and configure Series
	var memory_pieSeries = memory_chart.series.push(new am4charts.PieSeries());
	memory_pieSeries.dataFields.value = "value";
	memory_pieSeries.dataFields.category = "category";
	memory_pieSeries.slices.template.stroke = am4core.color("#fff");
	memory_pieSeries.innerRadius = 10;
	memory_pieSeries.slices.template.fillOpacity = 0.5;
	memory_pieSeries.slices.template.propertyFields.fill = "fill";
	memory_pieSeries.labels.template.text = "";
	
	memory_pieSeries.slices.template.propertyFields.disabled = "labelDisabled";
	memory_pieSeries.labels.template.propertyFields.disabled = "labelDisabled";
	memory_pieSeries.ticks.template.propertyFields.disabled = "labelDisabled";
	
	// Disable sliding out of slices
	memory_pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	memory_pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
	
	// Add second series
	var memory_pieSeries2 = memory_chart.series.push(new am4charts.PieSeries());
	memory_pieSeries2.dataFields.value = "value";
	memory_pieSeries2.dataFields.category = "category";
	memory_pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	memory_pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;
	memory_pieSeries2.slices.template.propertyFields.fill = "fill";
	memory_pieSeries2.labels.template.text = "";
	
	memory_pieSeries.adapter.add("innerRadius", function(innerRadius, target){
		return am4core.percent(40);
	})
	
	memory_pieSeries2.adapter.add("innerRadius", function(innerRadius, target){
		return am4core.percent(60);
	})
	
	memory_pieSeries.adapter.add("radius", function(innerRadius, target){
		return am4core.percent(100);
	})
	
	memory_pieSeries2.adapter.add("radius", function(innerRadius, target){
		return am4core.percent(80);
	})
	/** //MEMORY (pie chart) **/
	
	/** SWAP (pie chart) **/
	var swap_chart = am4core.create("chartdiv2_3", am4charts.PieChart);
	swap_chart.innerRadius = am4core.percent(40);
//	swap_chart.padding(15);
	
	var swap_title = swap_chart.titles.create();
	swap_title.text = "SWAP";	
	swap_title.fontSize = 15;
	swap_title.fontWeight = "bold";
	swap_title.fill = am4core.color("white");
	
	// Add and configure Series
	var swap_pieSeries = swap_chart.series.push(new am4charts.PieSeries());
	swap_pieSeries.dataFields.value = "value";
	swap_pieSeries.dataFields.category = "category";
	swap_pieSeries.slices.template.stroke = am4core.color("#fff");
	swap_pieSeries.innerRadius = 10;
	swap_pieSeries.slices.template.fillOpacity = 0.5;
	swap_pieSeries.slices.template.propertyFields.fill = "fill";
	swap_pieSeries.labels.template.text = "";
	
	swap_pieSeries.slices.template.propertyFields.disabled = "labelDisabled";
	swap_pieSeries.labels.template.propertyFields.disabled = "labelDisabled";
	swap_pieSeries.ticks.template.propertyFields.disabled = "labelDisabled";
	
	// Disable sliding out of slices
	swap_pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	swap_pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
	
	// Add second series
	var swap_pieSeries2 = swap_chart.series.push(new am4charts.PieSeries());
	swap_pieSeries2.dataFields.value = "value";
	swap_pieSeries2.dataFields.category = "category";
	swap_pieSeries2.slices.template.states.getKey("hover").properties.shiftRadius = 0;
	swap_pieSeries2.slices.template.states.getKey("hover").properties.scale = 1;
	swap_pieSeries2.slices.template.propertyFields.fill = "fill";
	swap_pieSeries2.labels.template.text = "";
	
	swap_pieSeries.adapter.add("innerRadius", function(innerRadius, target){
		return am4core.percent(40);
	})
	
	swap_pieSeries2.adapter.add("innerRadius", function(innerRadius, target){
		return am4core.percent(60);
	})
	
	swap_pieSeries.adapter.add("radius", function(innerRadius, target){
		return am4core.percent(100);
	})
	
	swap_pieSeries2.adapter.add("radius", function(innerRadius, target){
		return am4core.percent(80);
	})
	/** //SWAP (pie chart) **/
	
	
	$.ajax({
		url: getContextPath() + '/mypage/resources_usage',
		type: 'GET',
		success: function(data){

			var cpu_standby_resource = Number(data.cpu_standby_resource);			
			var cpu_total = Number(data.cpu_total);			
			var cpu_usage = Number(data.cpu_usage);			
		
			cpu_pieSeries.data = [{
				"category": resourceUsage + " + " + resourceStandBy,
				"value":  cpu_usage + cpu_standby_resource
			}, {
				"category": resourceUnused,
				"value": cpu_total - (cpu_usage + cpu_standby_resource),
				"labelDisabled":true
			}];
			
			cpu_pieSeries2.data = [{
				"category": resourceUsage,
				"value": cpu_usage
			}, {
				"category": resourceStandBy,
				"value": cpu_standby_resource
			}, {
				"category": resourceUnused,
				"value": cpu_total - (cpu_usage + cpu_standby_resource),
				"fill":"#dedede"
			}];
			
			var mem_standby_resource = Number(data.mem_standby_resource);			
			var mem_total = Number(data.mem_total);			
			var mem_usage = Number(data.mem_usage);			

			memory_pieSeries.data = [{
				"category": resourceUsage + " + " + resourceStandBy,
				"value":  mem_usage + mem_standby_resource
			}, {
				"category": "Unused",
				"value": mem_total - (mem_usage + mem_standby_resource),
				"labelDisabled":true
			}];
			
			// Add data
			memory_pieSeries2.data = [{
				"category": resourceUsage,
				"value": mem_usage
			}, {
				"category": resourceStandBy,
				"value": mem_standby_resource
			}, {
				"category": resourceUnused,
				"value": mem_total - (mem_usage + mem_standby_resource),
				"fill":"#dedede"
			}];
			
			var swap_usage = Number(data.swap_usage);
			var swap_standby_resource = Number(data.swap_standby_resource);
			var swap_total = Number(data.swap_total);
			
			swap_pieSeries.data = [{
				"category": resourceUsage + " + " + resourceStandBy,
				"value":  swap_usage + swap_standby_resource
			}, {
				"category": resourceUnused,
				"value": swap_total - (swap_usage + swap_standby_resource),
				"labelDisabled":true
			}];
			
			// Add data
			swap_pieSeries2.data = [{
				"category": resourceUsage,
				"value": swap_usage
			}, {
				"category": resourceStandBy,
				"value": swap_standby_resource
			}, {
				"category": resourceUnused,
				"value": swap_total - (swap_usage + swap_standby_resource),
				"fill":"#dedede"
			}];
		}
	});
}

//Job Resource Usage 차트(분석 실행 현황)	
function drawChartResourcesAndTaskUsage(){
	$.ajax({
		url : 'resources_usage_timeline',
		type : 'GET',
	    dataType : "JSON",
		success : function(data) {
			
			// 작업 단위 자원 사용량 차트 그리기 
			drawResourcesChart(data.timeline);
										
			$.each(data.timeline, function(index, data){
				data.time = new Date(data.time);	// timestamp -> date
			});
			// 분석 실행 현황 차트 그리기 
			drawTaskChart(data.timeline);
		}
	});
}

// 작업 단위 자원 사용량
function drawResourcesChart(data) {
	
	am5.ready(function() {

	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	var root = am5.Root.new("chartdiv1");
	
	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
	  am5themes_Animated.new(root)
	]);
	
	
	// Create chart
	// https://www.amcharts.com/docs/v5/charts/xy-chart/
	var chart = root.container.children.push(am5xy.XYChart.new(root, {
	  panX: false,
	  panY: false,
	  wheelY: "none",
//	  height: 370,
	  paddingTop: 25,
	  paddingBottom: 50,
	}));
	
//	chart.zoomOutButton.set("forceHidden", true);
//	chart.get("colors").set("step", 2);
	var legend = chart.children.push(
	  am5.Legend.new(root, {
	    centerX: am5.p50,
	    x: am5.p50,
	    y: am5.p100,
		  paddingTop: 10,
	  })
	);

	// Create axes
	// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
	var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
	  baseInterval: { timeUnit: "day", count: 1 },
	  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
	  tooltip: am5.Tooltip.new(root, {})
	}));
	xAxis.data.setAll(data);
	
	var ioAxisRenderer = am5xy.AxisRendererY.new(root, { opposite: true });
	ioAxisRenderer.grid.template.set("forceHidden", true);
	var ioAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
	  renderer: ioAxisRenderer,
	  tooltip: am5.Tooltip.new(root, {}),
	}));
	// for io
	var rightLabel = am5.Label.new(root, {
	  text: "(GB)",
	  rotation: 90,
	  y: -20,
	})
	ioAxis.children.push(rightLabel);

	var cpuAxisRenderer = am5xy.AxisRendererY.new(root, {});
	cpuAxisRenderer.grid.template.set("forceHidden", true);
	var cpuAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
//	  paddingLeft: 50,
	  renderer: cpuAxisRenderer,
//	  forceHidden: true
	}));
	// for cpu, mem
	var leftLabel = am5.Label.new(root, {
	  text: "(min)",
	  y: 40,
	  rotation: -90,
	})
	cpuAxis.children.unshift(leftLabel);
	
	var memAxisRenderer = am5xy.AxisRendererY.new(root, {});
	memAxisRenderer.grid.template.set("forceHidden", true);
	var memAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
	  renderer: memAxisRenderer,
	  forceHidden: true
	}));

	// Create series
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
	var ioSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
	  xAxis: xAxis,
	  yAxis: ioAxis,
	  valueYField: "ioNum",
	  valueXField: "time",
	  legendLabelText: "io",
	  tooltip:am5.Tooltip.new(root, {
	    labelText:"{valueY}"
	  })
	}));
	
	ioSeries.data.processor = am5.DataProcessor.new(root, {
	  dateFields: ["time"],
	  dateFormat: "yyyy-MM-dd"
	});
	ioSeries.data.setAll(data);
	legend.data.push(ioSeries);
	
	var cpuSeries = chart.series.push(am5xy.LineSeries.new(root, {
	  xAxis: xAxis,
	  yAxis: cpuAxis,
	  valueYField: "cpuNum",
	  valueXField: "time",
	  legendLabelText: "cpu",
	  tooltip:am5.Tooltip.new(root, {
	    labelText:"cpu: {valueY}"
	  })  
	}));
	
	cpuSeries.strokes.template.setAll({ strokeWidth: 2 });
	
	// Add circle bullet
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
	cpuSeries.bullets.push(function() {
	  var graphics = am5.Circle.new(root, {
	    strokeWidth: 2,
	    radius: 5,
	    stroke: cpuSeries.get("stroke"),
	    fill: root.interfaceColors.get("background"),
	  });
	
	  graphics.adapters.add("radius", function(radius, target) {
	    return target.dataItem.dataContext.townSize;
	  })
	
	  return am5.Bullet.new(root, {
	    sprite: graphics
	  });
	});
	cpuSeries.data.setAll(data);
	legend.data.push(cpuSeries);
	
	var memSeries = chart.series.push(am5xy.LineSeries.new(root, {
	  xAxis: xAxis,
	  yAxis: ioAxis,//memAxis
	  valueYField: "memNum",
	  valueXField: "time",
	  legendLabelText: "memory",
	  tooltip:am5.Tooltip.new(root, {
	    labelText:"memory: {valueY}"
	  }) 
	}));
	
	memSeries.strokes.template.setAll({ strokeWidth: 2 });
	
	// Add circle bullet
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets
	memSeries.bullets.push(function() {
	  var graphics = am5.Rectangle.new(root, {
	    width:10, 
	    height:10,
	    centerX:am5.p50,
	    centerY:am5.p50,
	    fill: memSeries.get("stroke")
	  });
	
	  return am5.Bullet.new(root, {
	    sprite: graphics
	  });
	});
	memSeries.data.setAll(data);
	legend.data.push(memSeries);
	
	// Add cursor
	// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
	chart.set("cursor", am5xy.XYCursor.new(root, {
	  xAxis: xAxis,
	  yAxis: ioAxis
	}));
	
	// Make stuff animate on load
	// https://www.amcharts.com/docs/v5/concepts/animations/
//	ioSeries.appear(1000);
	chart.appear(1000, 100);
	
	}); // end am5.ready()
}

// 분석 실행 현황 
function drawTaskChart(data) {

	am5.ready(function() {
	
	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	var root = am5.Root.new("chartdiv0");
	
	
	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
	  am5themes_Animated.new(root)
	]);

	// Create chart
	// https://www.amcharts.com/docs/v5/charts/xy-chart/
	var chart = root.container.children.push(am5xy.XYChart.new(root, {
	  panX: false,
	  panY: false,
	  wheelX: "panX",
	  wheelY: "zoomX",
	  layout: root.verticalLayout
	}));
	
	
	// Add legend
	// https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
	var legend = chart.children.push(
	  am5.Legend.new(root, {
	    centerX: am5.p50,
	    x: am5.p50
	  })
	);

	// Create axes
	// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
	var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
	  categoryField: "time",
	  renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 50 }),
	  tooltip: am5.Tooltip.new(root, {})
	}));
	xAxis.data.setAll(data);
	
	var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
	  renderer: am5xy.AxisRendererY.new(root, {})
	}));
	
	
	// Add series
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
	function makeSeries(name, fieldName) {
		
	  var series = chart.series.push(am5xy.ColumnSeries.new(root, {
	    name: name,
	    xAxis: xAxis,
	    yAxis: yAxis,
	    valueYField: fieldName,
	    categoryXField: "time"
	  }));
		
	  series.columns.template.setAll({
	    tooltipText: "{name}: {valueY}",
	    width: am5.percent(90),
	    tooltipY: 0
	  });
	
	  series.data.setAll(data);
	
	  // Make stuff animate on load
	  // https://www.amcharts.com/docs/v5/concepts/animations/
	  series.appear();
	
	  series.bullets.push(function () {
	    return am5.Bullet.new(root, {
	      locationY: 0,
	      sprite: am5.Label.new(root, {
	        text: "{valueY}",
	        fill: root.interfaceColors.get("alternativeText"),
	        centerY: 0,
	        centerX: am5.p50,
	        populateText: true
	      })
	    });
	  });
	
	  legend.data.push(series);
	}
	
	makeSeries("Task", "taskNum");
	makeSeries("Sub Task", "subtaskNum");
	
	
	// Make stuff animate on load
	// https://www.amcharts.com/docs/v5/concepts/animations/
	chart.appear(1000, 100);
	
	}); // end am5.ready()
}



//Job Resource Usage 차트
function drawChartResourcesUsageTimeline_back(){

	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end
	
	var stock_chart = am4core.create("chartdiv1", am4charts.XYChart);
	stock_chart.padding(0, 15, 0, 15);
	
	
	$.ajax({
		url : 'resources_usage_timeline',
		type : 'GET',
		success : function(data) {
			var chart_data = [];
			$.each(data.timeline, function(index, data){
				chart_data.push(data);
			});
			stock_chart.data = chart_data;
		}
	});
	
	// the following line makes value axes to be arranged vertically.
	stock_chart.leftAxesContainer.layout = "vertical";
	//stock_chart.dateFormatter.inputDateFormat = "yyyy-MM-dd K:mm:ss";
	// uncomment this line if you want to change order of axes
	//chart.bottomAxesContainer.reverseOrder = true;
	
	var stock_dateAxis = stock_chart.xAxes.push(new am4charts.DateAxis());
	stock_dateAxis.renderer.grid.template.location = 0;
	stock_dateAxis.renderer.ticks.template.length = 8;
	stock_dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
	stock_dateAxis.renderer.grid.template.disabled = true;
	stock_dateAxis.renderer.ticks.template.disabled = false;
	stock_dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
	stock_dateAxis.renderer.minLabelPosition = 0.01;
	stock_dateAxis.renderer.maxLabelPosition = 0.99;
	stock_dateAxis.keepSelection = true;
	stock_dateAxis.minHeight = 30;

	stock_dateAxis.groupData = false;
	stock_dateAxis.minZoomCount = 5;
	
	var stock_valueAxis = stock_chart.yAxes.push(new am4charts.ValueAxis());
	stock_valueAxis.tooltip.disabled = true;
	stock_valueAxis.renderer.baseGrid.disabled = true;
	// height of axis
	stock_valueAxis.height = am4core.percent(65);
	stock_valueAxis.renderer.gridContainer.background.fill = am4core.color("#000000");
	stock_valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
	stock_valueAxis.renderer.labels.template.verticalCenter = "bottom";
	stock_valueAxis.title.text = "min";
	stock_valueAxis.min = 0;
	
	var stock_valueAxis_2 = stock_chart.yAxes.push(new am4charts.ValueAxis());
	stock_valueAxis_2.renderer.opposite = true;
	stock_valueAxis_2.height = am4core.percent(65);
	stock_valueAxis_2.title.text = "GB";
	stock_valueAxis_2.min = 0;
	
	var stock_series = stock_chart.series.push(new am4charts.LineSeries());
	stock_series.dataFields.dateX = "time";
	stock_series.dataFields.valueY = "cpu";
	stock_series.tooltipText = "{valueY.value}";
	stock_series.name = "cpu";
	stock_series.defaultState.transitionDuration = 0;
	stock_series.yAxis = stock_valueAxis;
	
	var stock_series_2 = stock_chart.series.push(new am4charts.LineSeries());
	stock_series_2.dataFields.dateX = "time";
	stock_series_2.dataFields.valueY = "io";
	stock_series_2.tooltipText = "{valueY.value}";
	stock_series_2.name = "io";
	stock_series_2.defaultState.transitionDuration = 0;
	stock_series_2.yAxis = stock_valueAxis_2;
	
	var stock_series_3 = stock_chart.series.push(new am4charts.LineSeries());
	stock_series_3.dataFields.dateX = "time";
	stock_series_3.dataFields.valueY = "mem";
	stock_series_3.tooltipText = "{valueY.value}";
	stock_series_3.name = "mem";
	stock_series_3.defaultState.transitionDuration = 0;
	stock_series_3.yAxis = stock_valueAxis_2;
	
	var stock_valueAxis2 = stock_chart.yAxes.push(new am4charts.ValueAxis());
	stock_valueAxis2.tooltip.disabled = true;
	// height of axis
	stock_valueAxis2.height = am4core.percent(35);
	stock_valueAxis2.zIndex = 3
	// this makes gap between panels
	stock_valueAxis2.marginTop = 30;
	stock_valueAxis2.renderer.baseGrid.disabled = true;
	stock_valueAxis2.renderer.inside = true;
	stock_valueAxis2.renderer.labels.template.verticalCenter = "bottom";
	stock_valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
	//valueAxis.renderer.maxLabelPosition = 0.95;
	stock_valueAxis2.renderer.fontSize = "0.8em"
	
	stock_valueAxis2.renderer.gridContainer.background.fill = am4core.color("#000000");
	stock_valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;
	
	var stock_series2 = stock_chart.series.push(new am4charts.ColumnSeries());
	stock_series2.dataFields.dateX = "time";
	stock_series2.dataFields.valueY = "task";
	stock_series2.yAxis = stock_valueAxis2;
	stock_series2.tooltipText = "{valueY.value}";
	stock_series2.name = "task";
	// volume should be summed
	stock_series2.groupFields.valueY = "sum";
	stock_series2.defaultState.transitionDuration = 0;
	
	var stock_series2_2 = stock_chart.series.push(new am4charts.ColumnSeries());
	stock_series2_2.dataFields.dateX = "time";
	stock_series2_2.dataFields.valueY = "subtask";
	stock_series2_2.yAxis = stock_valueAxis2;
	stock_series2_2.tooltipText = "{valueY.value}";
	stock_series2_2.name = "subtask";
	
	stock_chart.cursor = new am4charts.XYCursor();
	
	var stock_scrollbarX = new am4charts.XYChartScrollbar();
	stock_scrollbarX.series.push(stock_series);
	stock_scrollbarX.marginBottom = 20;
	stock_scrollbarX.scrollbarChart.xAxes.getIndex(0).minHeight = undefined;
	stock_chart.scrollbarX = stock_scrollbarX;

	// Add legend
	stock_chart.legend = new am4charts.Legend();

}

//Execute Pipeline (bar_chart)
function drawChartExecutePipeline() {
	
	$.ajax({
		url: getContextPath() + '/mypage/execute_pipeline',
		type: 'GET',
		success: function(data){
			drawExecutePipelineChart(data.data);
		}
	});
	
}

var root3, chart3;
function drawExecutePipelineChart(data) {
	
	am5.ready(function() {
		root3 = am5.Root.new("chartdiv3_1");
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
			categoryField: "category",
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
			valueXField: "valueInt",
			categoryYField: "category",
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
	
//		console.log(data);
	
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
		series.appear(1000);
		chart3.appear(1000, 100);
	
	}); // end am5.ready()
}

//Execute Program (bar_chart)
function drawChartExecuteProgram() {
	$.ajax({
		url: getContextPath() + '/mypage/execute_program',
		type: 'GET',
		success: function(data){
			drawExecuteProgramChart(data.data);
		}
	});
}

var root3_2, chart3_2;
function drawExecuteProgramChart(data) {
	
	am5.ready(function() {
		root3_2 = am5.Root.new("chartdiv3_2");
		root3_2.setThemes([
			am5themes_Animated.new(root3_2)
		]);
	
		chart3_2 = root3_2.container.children.push(am5xy.XYChart.new(root3_2, {
			panX: false,
			panY: false,
			wheelX: "none",
			wheelY: "none"
		}));
	
		chart3_2.zoomOutButton.set("forceHidden", true);
	
		var yRenderer = am5xy.AxisRendererY.new(root3_2, {
			minGridDistance: 30
		});
	
		var yAxis = chart3_2.yAxes.push(am5xy.CategoryAxis.new(root3_2, {
			maxDeviation: 0,
			categoryField: "category",
			renderer: yRenderer,
			tooltip: am5.Tooltip.new(root3_2, { themeTags: ["axis"] })
		}));
	
		var xAxis = chart3_2.xAxes.push(am5xy.ValueAxis.new(root3_2, {
			maxDeviation: 0,
			min: 0,
			extraMax: 0.1,
			renderer: am5xy.AxisRendererX.new(root3_2, {})
		}));
	
		var series = chart3_2.series.push(am5xy.ColumnSeries.new(root3_2, {
			name: "Series 1",
			xAxis: xAxis,
			yAxis: yAxis,
			valueXField: "valueInt",
			categoryYField: "category",
			tooltip: am5.Tooltip.new(root3_2, {
				pointerOrientation: "left",
				labelText: "{valueX}"
			})
		}));
	
		series.columns.template.setAll({
			cornerRadiusTR: 5,
			cornerRadiusBR: 5
		});
	
		series.columns.template.adapters.add("fill", function(fill, target) {
			return chart3_2.get("colors").getIndex(series.columns.indexOf(target));
		});
	
		series.columns.template.adapters.add("stroke", function(stroke, target) {
			return chart3_2.get("colors").getIndex(series.columns.indexOf(target));
		});
	
//		console.log(data);
	
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
	
		chart3_2.set("cursor", am5xy.XYCursor.new(root3_2, {
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
		series.appear(1000);
		chart3_2.appear(1000, 100);
	
	}); // end am5.ready()
}


// 20220927_jhkim
function getWorkspaceList() {
		
	$.ajax({
		url: getContextPath() + "/mypage/workspace_list",
		type: "post",
		dataType: "json",
		success: function(data) {
			$(".my-workspace-wrap").empty();
			var content = "";
			
			// 데이터가 없을 때
			if ( data.page_info.totalCount <= 0 ) {
						
			}
			// 데이터가 있을 때 
			else {
				content += "<button class='workspace_create open_lp btn_line_blue' aria-controls='workspace-create'><span>"+buttonWorkSpaceCreate+"</span></button>";
			}			
			
			if ( data.page_info.totalCount > 0 ) {
				$.each(data.workspace_list, function(index, workspace) {
					
					var workspaceClass = "my-workspace-item";
					var pipelineClass = "myw_pipeline Dis_none";
					
					content += "<div class='" + workspaceClass + "' id='" + workspace.workspaceID + "' >";
					content +=		"<div class='myw_inner'>";
					content += 			"<div class='myw_title'>";
					content += 				"<div class='myw_tit'>" + workspace.workspaceName + "</div>";
//					// move workspace detail 
//					var detailWsUrl = "";
//					if ( typeof workspace.workspaceID != "undefined" ) {
//						detailWsUrl = "goMyWorkspacePipeline(\"" + workspace.workspaceID + "\");";
//					}
//					content += 				"<div class='myw_tit'><a onclick='" + detailWsUrl + "'>" + workspace.workspaceName + "</a></div>";
					content +=				"<div class='myw_txt scroll'>";
					content += 					"<span>" + workspace.description + "</span>";
					content += 				"</div>";
					content += 			"</div>";
					content	+=			"<div class='myw_info_g'>";
					content += 				"<ul class='myw_info'>";
					content += 					"<li><span>ID</span><span>" + workspace.workspaceID + "</span></li>";
					content += 					"<li><span>"+workspaceListCol1+"</span><span>" + workspace.createDate + "</span></li>";
					content += 					"<li><span>"+workspaceListCol2+"</span><span>" + workspace.updateDate + "</span></li>";
					content += 				"</ul>";
					content +=			"</div>";
					content +=			"<span class='myw_pipe_count'>"+workspaceListCol3+"<span class='bold fc_blue'>" + workspace.pipelineCount + "</span>"+workspaceListCol4+"</span>";
					content += 		"</div>";	// myw_inner:e
					
					if ( workspace.pipelineCount  > 0 ) {
						$.ajax({
							url: getContextPath() + "/mypage/workspace_pipeline_list",
							type: "post",
							async: false, 
							dataType: "json",
							data: { workspace_id : workspace.workspaceID, 
									page_size: "total" },
							success: function(pipelineData) {
//								console.log(pipelineData);
								var status;															
								content += "<div class='" + pipelineClass + "' id='" + workspace.workspaceID + "_pipelines'>";
								$.each(pipelineData.pipeline_list, function(p_index, pipeline) {
									status = pipeline.status == "init" ? "wait" : pipeline.status;
									
									// move pipeline detail 
									var detailUrl = "";
									if ( typeof pipeline.rawID != "undefined" ) {
										// detailUrl = 'location.href="' + getContextPath() + '/mypage/pipeline_view?raw_id=' + pipeline.rawID + '&pipeline_type=";';
//										detailUrl = 'location.href="' + getContextPath() + '/execute/execute";';
										detailUrl = "goMyWorkspacePipeline(\"" + pipeline.workspaceID + "\",\"" + pipeline.pipelineID + "\",\"" + pipeline.rawID +"\");";
									}
									
									content += 		"<div class='myw_p_detail_box' onclick='" + detailUrl + "'>";
//									content += 		"<div class='myw_p_detail_box'>";
									content += 			"<div class='myw_p_detail_title'>";
									content += 				"<div class='myw_p_tit'>"
									content +=					"<span class='p_detail_id'><span class='bold'>ID: </span> <span id='pi_id'>" + pipeline.pipelineID + "</span></span>";
									content += 					"<p>" + pipeline.pipelineName + "</p>";
									content += 				"</div>";
									content +=				"<div class='myw_p_txt scroll'>";
									content += 					"<p class='myw_p_detail_text'>" + pipeline.pipelineDesc + "</p>";
									content += 				"</div>";
									content +=			"</div>";	
									content += 			"<div class='myw_p_detail_g'>";
									content +=				"<ul class='myw_p_detail_list'>";
									content +=					"<li><span>"+pipelineAreaCol1+"</span><span>" + pipeline.categoryName + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol2+"</span><span>" + pipeline.version + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol3+"</span><span>" + pipeline.reference + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol4+"</span><span>" + pipeline.createDate + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol5+"</span><span>" + pipeline.updateDate + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol6+"</span><span>" + status + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol7+"</span><span>" + pipeline.isPublic + "</span></li>";
									content +=					"<li><span>"+pipelineAreaCol8+"</span><span>" + pipeline.isShared + "</span></li>";
									content +=				"</ul>";
									content +=			"</div>";
									
									// keywords
									content += 			"<div class='p_keyword_g'>";
									var keywords = pipeline.keyword;
									keywords = keywords.split(",");
									$.each(keywords, function(index, item){
										content += "<span class='" + shuffle_class(index, "keyword") + "'>" + item + "</span>";
									});
									content += 			"</div>";
									
									content += 			"<div class='pipe_top'>";
									content += 				"<span class='task_count'>"+pipelineAreaCol9+"<span class='bold fc_blue'> " + pipeline.exeCount + " </span>"+pipelineAreaCol10+"</span>";
									content += 				"<button class='pipe_more' onclick='" + detailUrl + "'><span class='Hidden'>자세히보기</span></button>";
									content += 			"</div>";
									
									content += 	"</div>";
								});
								content += "</div>";	// class:myw_pipeline
								content += "</div>";	// class:my-workspace-item
							}
						});	// pipeline ajax
					}
					else {
						content += "<div class='myw_pipeline Dis_none' id='" + workspace.workspaceID + "_pipelines'>";
						content += 		"<div class='myw_p_detail_box'>";
						var newPipelineUrl = 'window.open("' + getContextPath() + '/execute/execute", "_blank");';
						content += 			"<button class='pipeline_create btn btn_line_blue' onclick='"+newPipelineUrl+"'><span>"+buttonPipelineShortcuts+"</span></button>";
						content += 		"</div>";
						content += "</div>";
						
						
						content += "</div>";	// class:my-workspace-item
					}
				});	// workspace each
				$(".my-workspace-wrap").append(content);
			}
			else {
								
				content += "<div class='wrokspace_none'>";
				content += "<p class='b_list_count'>";
				content += "<span class='bold'>"+workspacePopMsg3+"</span>";
				content += "</p>";
				content += "<button class='open_lp btn_line_blue' aria-controls='workspace-create'><span>"+buttonWorkSpaceCreate+"</span></button>";
				content += "</div>";
				
				$(".my-workspace-wrap").append(content);
			}
		}
	});
}

function goMyWorkspacePipeline(workspaceId, pipelineId, pipelineRawId) {

	$("#pipeline_info").find("input[name=raw_id]").val(pipelineId);
	$("#pipeline_info").find("input[name=pp_id]").val(pipelineRawId);
	$("#pipeline_info").find("input[name=ws_id]").val(workspaceId);
	
	var pipelineInfoForm = document.pipeline_info;
	var url = getContextPath() + "/execute/execute";
	window.open("" ,"pipeline_info", ""); 
	pipelineInfoForm.action =url; 
	pipelineInfoForm.method="post";
	pipelineInfoForm.target="pipeline_info";
	pipelineInfoForm.submit();
	
	
}

// Workspace List
function getWorkspaceList_back() {
	
	$.ajax({
		url: getContextPath() + "/mypage/workspace_list",
		type: "post",
		dataType: "json",
		success: function(data) {
			$(".my-workspace-wrap").empty();
			var content = "";
			if ( data.page_info.totalCount > 0 ) {
				$.each(data.workspace_list, function(index, workspace) {
					
					var workspaceClass = "my-workspace-item";
					var pipelineClass = "myw_pipeline Dis_none";
//					if ( index == 0 && workspace.pipelineCount > 0 ) {
//						workspaceClass = "my-workspace-item on";
//						pipelineClass = "myw_pipeline";
//					}
					
					content += "<div class='" + workspaceClass + "' id='" + workspace.workspaceID + "' >";
					content +=		"<div class='myw_inner'>";
					content += 			"<div class='myw_title'>";
					content += 				"<div class='myw_tit'>" + workspace.workspaceName + "</div>";
					content +=				"<ul class='myw_info'>";
					content += 					"<li><span>생성일</span><span>" + workspace.createDate + "</span></li>";
					content += 					"<li><span>수정일</span><span>" + workspace.updateDate + "</span></li>";
					content += 				"</ul>";
					content += 			"</div>";
					content +=			"<span class='myw_pipe_count'>파이프라인 <span class='bold fc_blue'>" + workspace.pipelineCount + "</span> 건</span>";
					content += 		"</div>";
					
					if ( workspace.pipelineCount  > 0 ) {
						$.ajax({
							url: getContextPath() + "/mypage/workspace_pipeline_list",
							type: "post",
							async: false, 
							dataType: "json",
							data: { workspace_id : workspace.workspaceID, 
									page_size: "total" },
							success: function(pipelineData) {
								
								var status;
								content += "<div class='" + pipelineClass + "' id='" + workspace.workspaceID + "_pipelines'>";
								$.each(pipelineData.pipeline_list, function(p_index, pipeline) {
									status = pipeline.status == "init" ? "wait" : pipeline.status;
									
									content += 		"<div class='myw_p_detail_box'>";
									content += 			"<div class='myw_p_detail_title'>";
									content +=				"<p class='myw_p_detail_tit'>" + pipeline.pipelineName + "</p>";
									content +=				"<p class='myw_p_detail_text'>" + pipeline.pipelineDesc + "</p>";
									content +=			"</div>";
									content += 			"<div class='myw_p_detail_g'>";
									content +=				"<ul class='myw_p_detail_list'>";
									content +=					"<li><span>버전</span><span>" + pipeline.version + "</span></li>";
									content +=					"<li><span>실행 횟수</span><span>" + pipeline.exeCount + "</span></li>";
									content +=					"<li><span>상태</span><span class='status_icon2 status_" + status + "'>" + status + "</span></li>";
									content +=				"</ul>";
									content +=				"<ul class='myw_p_detail_list'>";
									content +=					"<li><span>생성일</span><span>" + pipeline.createDate + "</span></li>";
									content +=					"<li><span>수정일</span><span>" + pipeline.updateDate + "</span></li>";
									content +=					"<li><span>공개</span><span class='boolean_icon boolean_" + pipeline.isPublic + "'>" + pipeline.isPublic + "</span></li>";
									content +=				"</ul>";
									content +=			"</div>";
									
									// move pipeline detail 
									var detailUrl = "";
									if ( typeof pipeline.rawID != "undefined" ) {
										detailUrl = 'location.href="' + getContextPath() + '/mypage/pipeline_view?raw_id=' + pipeline.rawID + '&pipeline_type=";';										
									}
									content += 			"<button class='pipe_more' onclick='" + detailUrl + "'><span class='Hidden'>자세히보기</span></button>";
									content += 		"</div>";
									
								});
								content += "</div>";	// class:myw_pipeline
								content += "</div>";	// class:my-workspace-item
							}
						});	// pipeline ajax
					}
					else {
						content += "</div>";	// class:my-workspace-item
					}
				});	// workspace each
				$(".my-workspace-wrap").append(content);
			}
			else {
				
			}
		}
	});
}


// Pipeline List
function getPipelineList(pageNo) {
	
	$.ajax({
		url: getContextPath() + "/mypage/pipeline_list",
		type: "post",
		dataType: "json",
		async: false,
		data: { page_num : pageNo },
		success: function(data) {
			
			var isExistPp = false;
			var pipelineTotalCount = 0;
			var card = "";
			if ( data.pipeline_list != undefined ) {
				// 파이프라인 총 개수 				
				pipelineTotalCount= data.pipeline_list.length;
				if ( pipelineTotalCount > 0 ) {
					isExistPp = true;
					var pipelineCount = data.pipeline_list.length;
					for ( var i=0; i<pipelineCount; i++ ) {
						
						var pipeline = data.pipeline_list[i];		
						var status = pipeline.status == "init" ? "wait" : pipeline.status;	
						var keywords = (pipeline.keyword).split(",");
						
						card += '<div class="brd_item">';
						card += 	'<div class="brd_item_inner">';
						
						card += 		'<div class="b_cont_box">';
						card += 			'<div class="b_tit_item">';
						card += 				'<div class="b_tit"><p>' + pipeline.pipelineName + '</p></div>';
						card += 			'</div>';
						card += 			'<div class="pipeline_text">';
						card += 				'<span>' + pipeline.pipelineDesc + '</span>';
						card += 			'</div>';
						card += 			'<ul class="b_info">';
						card += 				'<li><span>생성일</span><span>' + pipeline.createDate + '</span></li>';
						card += 				'<li><span>수정일</span><span>' + pipeline.updateDate + '</span></li>';
						card += 				'<li><span>워크스페이스명</span><span>' + pipeline.workspaceName + '</span></li>';
						card += 				'<li><span>버전</span><span>' + pipeline.version + 'v</span></li>';
						card += 				'<li><span>공개</span><span>' + pipeline.isPublic + '</span></li>';
						card += 				'<li><span>공유</span><span>' + pipeline.isShared + '</span></li>';
						card += 				'<li><span>실행</span><span>' + pipeline.exeCount + '</span></li>';
						card += 				'<li><span class="status_icon2 status_' + status + '">' + status + '</span></li>';
						card += 			'</ul>';						
						card += 		'</div>';
						
						card += 		'<div class="swiper mySwiper p_keyword_g_slide">';
						card += 			'<div class="swiper-wrapper">';
						$.each(keywords, function(index, item) {
							card += '<div class="swiper-slide"><span class="' + shuffle_class(index, "keyword") + '">' + item + '</span></div>';
						});
						card += 			'</div>';
						card += 			'<div class="swiper-pagination"></div>';
						card += 		'</div>';
						
						// move pipeline detail 
						var detailUrl = "";
						if ( typeof pipeline.rawID != "undefined" ) {
							detailUrl = 'goMyWorkspacePipeline(\'' + pipeline.workspaceID + '\',\'' + pipeline.pipelineID + '\',\'' + pipeline.rawID + '\');';
						}
									
						card += 		'<div class="pipe_top">';
						card += 			'<button class="pipe_more" onclick="' + detailUrl + '"><span class="Hidden">자세히보기</span></button>';
						card += 		'</div>';
						
						card += 	'</div>';
						card += '</div>';
					}
				}	
			}
			
			var className = ".brd_list_card";
			if ( !isExistPp ) {
				className = ".card_slider";
				card = '<div class="brd_no_data">';
				card += 	'<span>데이터가 없습니다.</span>';
				card += "</div>";
			}
			$(className).html(card);
			
			
			var pipelineTotalCountStr = "총 " + pipelineTotalCount + "개";
			if (locale != "ko") {
		    	pipelineTotalCountStr = "a total of "+pipelineTotalCount;
			}
			
			// 파이프라인 총 개수 
			$(".b_list_count").children("span").text(pipelineTotalCountStr);

			// 파이프라인 카드 Swiper 동작 구성
			slideAct();
			
			$("#loadingBox").hide();
				
		}, beforeSend : function(data) {
			$("#loadingBox").show();
		}
	})
}

function getPipelineList_back(pageNo) {
	
	$.ajax({
		url: getContextPath() + "/mypage/pipeline_list",
		type: "post",
		dataType: "json",
		data: { page_num : pageNo },
		success: function(data) {
			
			if ( data.pipeline_list != undefined ) {
				if ( data.pipeline_list.length > 0 ) {
					
					var pipeline = data.pipeline_list[0];

					var keywords = (pipeline.keyword).split(",");
					var reference_papers = (pipeline.reference).split(",");
					var status = pipeline.status == "init" ? "wait" : pipeline.status;
					var registStatus;
					if(pipeline.registCode == "PI-REG-0010"){
						registStatus = "ready";
					} else if(pipeline.registCode == "PI-REG-0020"){
						registStatus = "request";
					} else if(pipeline.registCode == "PI-REG-0030"){
						registStatus = "complete";
					} else if(pipeline.registCode == "PI-REG-0040"){
						registStatus = "reject";
					}
					
					// Detail Infomation.
					$("#pi_id").text(pipeline.pipelineName);
					$("#pi_name").text(pipeline.pipelineName);
					$("#pi_desc").text(pipeline.pipelineDesc);
					$("#pi_category").text(pipeline.categoryName);
					$("#pi_workspace").text(pipeline.worksapceName);
					$("#pi_version").text(pipeline.version);
					$("#pi_execount").text(pipeline.exeCount);
					$("#pi_reference").text(pipeline.reference);
					$("#pi_regist_status").text(registStatus);
					$("#pi_registrant").text(pipeline.registrant);
					$("#pi_create_date").text(pipeline.createDate);
					$("#pi_update_date").text(pipeline.updateDate);
					$("#pi_status").text(status);
					$("#pi_status").attr("class", "status_icon2 status_" + status);
					$("#pi_public").text(pipeline.isPublic);
					$("#pi_public").attr("class", "boolean_icon boolean_" + pipeline.isPublic);
					$("#pi_share").text(pipeline.isShared);
					$("#pi_share").attr("class", "boolean_icon boolean_" + pipeline.isShared);
					
					var detail = "";
					$.each(keywords, function(index, item) {
						console.log(index + "> " + item);
						detail += 	"<span class='" + shuffle_class(index, "keyword") + "'>" + item + "</span>";
					});
					$("#pi_keywords").html(detail);
					
					var controlBox = "";
					controlBox = "<button class='pipeline_full' onclick='goPipelineFull(\""+pipeline.rawID+"\")' title='크게보기'></button>";
					var page = parseInt(data.pipeline_page);
					if ( data.pipeline_page <= 1 ) {
						controlBox += "<button class='pipeline_prev' disabled title='이전'></button>";
						controlBox += "<span class='fc_blue bold'>" + data.pipeline_page + "</span><span>/" + data.pipeline_count + "</span>";
						controlBox += "<button class='pipeline_next' onclick='getPipelineList(\""+(page+1)+"\")' title='다음'></button>";
					}
					else if ( data.pipeline_page >= data.pipeline_count ) {
						controlBox += "<button class='pipeline_prev' onclick='getPipelineList(\""+(page-1)+"\")' title='이전'></button>";
						controlBox += "<span class='fc_blue bold'>" + data.pipeline_page + "</span><span>/" + data.pipeline_count + "</span>";
						controlBox += "<button class='pipeline_next' disabled title='다음'></button>";
					}
					else {
						controlBox += "<button class='pipeline_prev' onclick='getPipelineList(\""+(page-1)+"\")' title='이전'></button>";
						controlBox += "<span class='fc_blue bold'>" + data.pipeline_page + "</span><span>/" + data.pipeline_count + "</span>";
						controlBox += "<button class='pipeline_next' onclick='getPipelineList(\""+(page+1)+"\")' title='다음'></button>";
					}
					$(".pipeline-slide-control").html(controlBox);

					// pipeline detail info (for draw structure)
					$.ajax({
						url : getContextPath() + '/mypage/pipeline_detail_info2',
						type : 'POST',
						async : false,
						dataType : "Json",
						data : { "raw_id": pipeline.rawID },
						success : function(data) {
							
							$(".pipeline-wrap").empty();
							
							var pipelineBox = "";
							pipelineBox = "<div class='pipeline-box' id='pipeline_area'>";
							pipelineBox += 	"<div id='pipeline_div'>";
							pipelineBox += 		"<div id='pipeline_con' class='pArea'></div>";
							pipelineBox += 	"</div>"; 
							pipelineBox += 	"<div class='minimap' id='minimapArea'>";
							pipelineBox += 		"<div class='viewport'></div>";
							pipelineBox += 	"</div>"; 
							pipelineBox += 	"<div id='loadingBox'><img alt='loading' src='/bioexpress/img/common/loading_big.gif'></div>";
							pipelineBox += "</div>";
							$(".pipeline-wrap").append(pipelineBox);
							
							draw_structure(data.pipeline_detail_info, 1600, 600, 200, 120, false);
						}
					});
				}	
			}
			$("#loadingBox").hide();
				
		}, beforeSend : function(data) {
			$("#loadingBox").show();
		}
	})
}


// Statistics(실행 파이프라인/실행 프로그램/완료 파이프라인)
function setStatistics() {
	
	$.ajax({
		url: getContextPath() + '/mypage/task_count',
		type: 'GET',
		success: function(data){
			var num = data;
			// 숫자에 콤마 
			num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$(".static01 .stat_num").text(num);
		}
	});
	
	$.ajax({
		url: getContextPath() + '/mypage/subtask_count',
		type: 'GET',
		success: function(data){
			var num = data;
			// 숫자에 콤마 
			num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$(".static02 .stat_num").text(num);
		}
	});
	
	$.ajax({
		url: getContextPath() + '/mypage/complete_task',
		type: 'GET',
		success: function(data){
			var num = data;
			// 숫자에 콤마 
			num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			$(".static03 .stat_num").text(num);
		}
	});
}

function goPipelineFull(raw_id){
	window.open(getContextPath() + '/mypage/pipeline_full?raw_id='+raw_id,"","");
}

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

// 파이프라인 리스트 Swiper
function slideAct(){
    var view = 6; //보이는 슬라이드 개수
    var realInx = 0; //현재 페이지
    var ppSwiper = undefined;

    slideList();
    
    function slideList(){
        //리스트 초기화
        if ($('.card_slider .brd_item').parent().hasClass('swiper-slide')){
            $('.card_slider .swiper-slide-duplicate').remove();
            $('.card_slider .brd_item').unwrap('swiper-slide');
        }

        //리스트 그룹 생성 (swiper-slide element 추가)
        var num = 0;
        $('.card_slider').find('.brd_item').each(function(i) {
            $(this).addClass('brd_item'+(Math.floor((i+view)/view)));
            num = Math.floor((i+view)/view)
        }).promise().done(function(){
            for (var i = 1; i < num+1; i++) {
                $('.card_slider').find('.brd_item'+i+'').wrapAll('<div class="swiper-slide"></div>');
                $('.card_slider').find('.brd_item'+i+'').removeClass('brd_item'+i+'');
            }
        });

        sliderStart()
    }

    //슬라이드 시작
    function sliderStart(){
        //슬라이드 초기화
        if(ppSwiper != undefined) {
            ppSwiper.destroy();
            ppSwiper == undefined;
        }

        //슬라이드 실행
        ppSwiper = new Swiper('.card_slider .brd_list_section', {
            slidesPerView: 1,
            initialSlide :Math.floor(realInx/view),
            resistanceRatio : 0,
            direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
            spaceBetween: 0, //페이지와 페이지 사이의 간격
            centeredSlides: false, //센터모드
            autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
            freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
            allowTouchMove : false, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
            watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정    
            loop : true,  // 슬라이드 반복 여부
            loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정

		    
            navigation: {
                nextEl: '.swiper-next',
                prevEl: '.swiper-prev',
            },		           
		    pagination: {                       
		         el: '.swiper-page',
  				 //clickable: true,
		          type: "fraction",
		    },
            
            on: {
                slideChange: function () {
                    realInx = this.realIndex*view
                }
            },
        });
    }
}


