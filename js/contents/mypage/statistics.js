// Themes begin
am4core.addLicense("CH331051111")
am4core.useTheme(am4themes_animated);
// Themes end

// 나의 분석 활용 파이프라인 현황 (bar_chart)
/*
function drawChartExecutePipeline() {
	
	$.ajax({
		url: getContextPath() + '/mypage/do_get_pipeline_agg',
		type: 'POST',
		success: function(res){
			
			if ( res && res.data && res.data.length > 0 ) {
				drawExecutePipelineChart(res.data);
			}
			else {
				$('#myPipelineChart').addClass('dis-none');
				$('#myPipelineChart').siblings('.chart-item-none').removeClass('dis-none');
			}
		}, 
		complete : function() {
			$('#ppLoading').addClass('dis-none');
		}
	});
	
}
*/
function drawChartExecutePipeline() {
    // DOM 업데이트를 최소화하기 위해 데이터 불러오기와 차트 그리기를 분리
    $.ajax({
        url: getContextPath() + '/mypage/do_get_pipeline_agg',
        type: 'POST',
        success: function(res){
            // 데이터가 준비되면, 렌더링을 비동기적으로 연기
            requestAnimationFrame(function() {
                if (res && res.data && res.data.length > 0) {
                    drawExecutePipelineChart(res.data);
                } else {
                    $('#myPipelineChart').addClass('dis-none');
                    $('#myPipelineChart').siblings('.chart-item-none').removeClass('dis-none');
                }
            });
        }, 
        complete : function() {
            $('#ppLoading').addClass('dis-none');
        }
    });
}

// 나의 분석 활용 파이프라인 현황 그래프 
function drawExecutePipelineChart(data) {

    am4core.ready(function() {

        var pipelineChart = am4core.create("myPipelineChart", am4charts.XYChart);

			pipelineChart.paddingTop = 0;
			pipelineChart.paddingBottom = 0;
			pipelineChart.paddingLeft = 0;
			pipelineChart.paddingRight = 20;
		
		
        var categoryAxis = pipelineChart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.minGridDistance = 1;
        categoryAxis.renderer.inversed = true;
        categoryAxis.renderer.grid.template.disabled = true;
		categoryAxis.renderer.labels.template.fontSize = 14;
		categoryAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
        
        var valueAxis = pipelineChart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.min = 0;
		valueAxis.renderer.labels.template.fontSize = 14;
		valueAxis.renderer.grid.template.stroke = am4core.color("#aaaaaa");
        
        var series = pipelineChart.series.push(new am4charts.ColumnSeries());
        series.dataFields.categoryY = "category";
        series.dataFields.valueX = "valueInt";
        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusBottomRight = 5;
        series.columns.template.column.cornerRadiusTopRight = 5;
        series.columns.template.tooltipText = "{category}: [bold]{valueInt}[/]";
        
        series.columns.template.adapter.add("fill", function(fill, target){
          return pipelineChart.colors.getIndex(target.dataItem.index);
        });
        
        categoryAxis.sortBySeries = series;
        pipelineChart.data = data;
        
    }); // end am4core.ready()
}


// 나의 분석 활용 프로그램 현황 (bar_chart)
/*
function drawChartExecuteProgram() {
	$.ajax({
		url: getContextPath() + '/mypage/do_get_program_agg',
		type: 'POST',
		success: function(res){

			if ( res && res.data && res.data.length > 0 ) {
				drawExecuteProgramChart(res.data);
			}
			else {
				$('#myProgramChart').addClass('dis-none');
				$('#myProgramChart').siblings('.chart-item-none').removeClass('dis-none');
			}
		}, 
		complete : function() {
			$('#pgLoading').addClass('dis-none');
		}
	});
}
*/
function drawChartExecuteProgram() {
    $.ajax({
        url: getContextPath() + '/mypage/do_get_program_agg',
        type: 'POST',
        success: function(res){
            requestAnimationFrame(function() {
                if (res && res.data && res.data.length > 0) {
                    drawExecuteProgramChart(res.data);
                } else {
                    $('#myProgramChart').addClass('dis-none');
                    $('#myProgramChart').siblings('.chart-item-none').removeClass('dis-none');
                }
            });
        }, 
        complete : function() {
            $('#pgLoading').addClass('dis-none');
        }
    });
}


// 나의 분석 활용 프로그램 현황 그래프
function drawExecuteProgramChart(data) {
	
    am4core.ready(function() {

        var programChart = am4core.create("myProgramChart", am4charts.XYChart);
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
          return programChart.colors.getIndex(target.dataItem.index);
        });
        
        categoryAxis.sortBySeries = series;
        programChart.data = data;
        
    }); // end am4core.ready()
}
