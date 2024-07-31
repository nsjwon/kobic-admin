$(function() {
	
	// Task List & Pipeline List Click Event
	$(document).on("click", ".brd_list_type01 .brd_list", function(e) {

		var selected = $(e.currentTarget);
		
		var completeTaskId = selected.find("#completeTaskId").val();
		var errorTaskId = selected.find("#errorTaskId").val();
		var pipelineId = selected.find("#pipelineId").val();
		var devPipelineId = selected.find("#devPipelineId").val();
		var instPipelineId = selected.find("#instPipelineId").val();		
		
		var url = getContextPath() + "/admin/task_list_view";
		var pipelineParam = "&pipeline_type=";
		var rawId = "";
		if ( completeTaskId ) {
			rawId = completeTaskId;
		}
		else if ( errorTaskId ) {
			rawId = errorTaskId;
		}
		else if ( pipelineId ) {
			rawId = pipelineId;
			url = getContextPath() + "/admin/workspace_pipeline_view";
			pipelineParam += "all";
		}
		else if ( devPipelineId ) {
			rawId = devPipelineId;
			url = getContextPath() + "/admin/workspace_pipeline_view";
			pipelineParam += "PT02";
		}
		else if ( instPipelineId ) {
			rawId = instPipelineId;
			url = getContextPath() + "/admin/workspace_pipeline_view";
			pipelineParam += "PT01";
		}
		
		location.href = encodeURI(url + "?raw_id=" + rawId + pipelineParam);
	});
	
})

// Task (Complete, Error) Status paging
function taskPaging(pageNo) {
	
	var selectedTaskTab = $("#task_tabs li.t_on").find("a").attr("href").split("#tab_")[1];
	var data = {page_no: pageNo, 
				category : $("#"+selectedTaskTab+"_category option:selected").val(),
				search : $("#"+selectedTaskTab+"_search").val(), 
				sorting: $("#"+selectedTaskTab+"_sorting option:selected").val(),
				task_status: selectedTaskTab };
	$.ajax({
		type: "post",
		url: "admin_task_paging",
		data: data,
		success: function(response) {
			$("#task_" + selectedTaskTab + "_fragment").replaceWith(response);
		}
	});
}

// Pipeline (All, Development, Instance) paging
function pipelinePaging(pageNo) {
	
	var selectedPipeTab = $("#pipe_tabs li.t_on").find("a").attr("href").split("#tab_")[1];
//	var type = selectedPipeTab;
//	if ( type != "all" ) {
//		type = type == "dev" ? "PT02" : "PT01";
//	}
//	var data = {page_no: pageNo,
//				type: type};

	var data = {page_no: pageNo,
				category : $("#"+selectedPipeTab+"_category option:selected").val(),
				search : $("#"+selectedPipeTab+"_search").val(), 
				sorting: $("#"+selectedPipeTab+"_sorting option:selected").val(),
				type: selectedPipeTab}
	
	$.ajax({
		type: "post",
		url: "admin_pipeline_paging",
		data: data,
		success: function(response) {
			$("#" + selectedPipeTab + "_pipe_fragment").replaceWith(response);
		}
	});
}


// Execute Task
function drawChartExecuteTask() {
	
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("adminchartdiv1", am4charts.XYChart);
	
	$.ajax({
		url : getContextPath() + '/admin/all_execute_pipeline',
		type : 'GET',
		success : function(data) {

			chart.data = data.data;
		}
	});

	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "category";
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 30;
	//categoryAxis.renderer.labels.template.rotation = 270;
	
	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	
	// Create series
	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.valueX = "value";
	series.dataFields.categoryY = "category";
	series.name = "value";
	series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.stroke = am4core.color("#8067dc"); // red outline
	series.columns.template.fill = am4core.color("#8067dc"); // green fill
	
	categoryAxis.renderer.inversed = true;
}

// Execute SubTask
function drawChartExecuteSubTask() {
	
	am4core.useTheme(am4themes_animated);
	
	var chart = am4core.create("adminchartdiv2", am4charts.XYChart);
	
	$.ajax({
		url : getContextPath() + '/admin/all_execute_program',
		type : 'GET',
		success : function(data) {

			chart.data = data.data;
		}
	});
	
	var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
	categoryAxis.dataFields.category = "category";
	categoryAxis.renderer.grid.template.location = 0;
	categoryAxis.renderer.minGridDistance = 30;
	categoryAxis.renderer.inversed = true;
	
	var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
	
	// Create series
	var series = chart.series.push(new am4charts.ColumnSeries());
	series.dataFields.valueX = "value";
	series.dataFields.categoryY = "category";
	series.name = "value";
	series.columns.template.tooltipText = "{categoryY}: [bold]{valueX}[/]";
	series.columns.template.fillOpacity = .8;
	series.columns.template.stroke = am4core.color("#8067dc"); // red outline
	series.columns.template.fill = am4core.color("#8067dc"); // green fill
	
}

// Job Resource Usage
function drawChartJob() {
	
	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end
	
	var chart = am4core.create("adminchartdiv3", am4charts.XYChart);
	//chart.padding(0, 15, 0, 15);
	
	
	$.ajax({
		url : getContextPath() + '/admin/all_resources_usage_timeline',
		type : 'GET',
		success : function(data) {
			
			var chart_data = [];
			$.each(data.timeline, function(index, data){
				chart_data.push(data);
			});
			chart.data = chart_data;
		}
	});
	
	chart.leftAxesContainer.layout = "vertical";
	
	var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
	dateAxis.renderer.grid.template.location = 0;
	dateAxis.renderer.ticks.template.length = 8;
	dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
	dateAxis.renderer.grid.template.disabled = true;
	dateAxis.renderer.ticks.template.disabled = false;
	dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
	dateAxis.renderer.minLabelPosition = 0.01;
	dateAxis.renderer.maxLabelPosition = 0.99;
	dateAxis.keepSelection = true;
	dateAxis.minHeight = 30;

	dateAxis.groupData = false;
	
	var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis.tooltip.disabled = true;
	valueAxis.renderer.baseGrid.disabled = true;
	valueAxis.renderer.labels.template.verticalCenter = "bottom";
	valueAxis.title.text = "min";
	valueAxis.min = 0;
	
	var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
	valueAxis2.renderer.opposite = true;
	valueAxis2.title.text = "GB";
	valueAxis2.min = 0;
	
	var cpu_series = chart.series.push(new am4charts.LineSeries());
	cpu_series.dataFields.dateX = "time";
	cpu_series.dataFields.valueY = "cpu";
	cpu_series.tooltipText = "{valueY.value}";
	cpu_series.name = "cpu";
	cpu_series.defaultState.transitionDuration = 0;
	cpu_series.yAxis = valueAxis;
	
	var cpuBullet = cpu_series.bullets.push(new am4charts.CircleBullet());
	
	var io_series = chart.series.push(new am4charts.LineSeries());
	io_series.dataFields.dateX = "time";
	io_series.dataFields.valueY = "io";
	io_series.tooltipText = "{valueY.value}";
	io_series.name = "io";
	io_series.defaultState.transitionDuration = 0;
	io_series.yAxis = valueAxis2;
	
	var ioBullet = io_series.bullets.push(new am4charts.CircleBullet());
	
	var mem_series = chart.series.push(new am4charts.LineSeries());
	mem_series.dataFields.dateX = "time";
	mem_series.dataFields.valueY = "mem";
	mem_series.tooltipText = "{valueY.value}";
	mem_series.name = "mem";
	mem_series.defaultState.transitionDuration = 0;
	mem_series.yAxis = valueAxis2;
	
	var memBullet = mem_series.bullets.push(new am4charts.CircleBullet());
	
	chart.cursor = new am4charts.XYCursor();

	// Add legend
	chart.legend = new am4charts.Legend();
}