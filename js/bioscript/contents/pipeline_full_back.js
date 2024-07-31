function minimapSet() {
	var scrollValue = $(document).scrollTop();
	var minimap_width = $("#minimapArea").width();

	window.scrollTo(0,0);
	html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
		document.getElementById("minimapArea").appendChild(canvas);
		$('#minimapArea>canvas').attr("style","width:"+minimap_width+"px; position:absolute; top:0px; left:0px;")
		$('#minimapArea>canvas').first().remove();
	});

	if(document.getElementById("TaskPipelineArea")){
		html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
			document.getElementById("TaskPipelineArea").appendChild(canvas);
			$('#TaskPipelineArea>canvas').attr("style","width:130%;position:relative;top:-1px;left:-1px;");
			$('#TaskPipelineArea>canvas').first().remove();
			$('#TaskPipelineArea>canvas').attr("id","pipelineCanvas");
		});
	}

	window.scrollTo(0, scrollValue);
}

// 파이프라인 모식도에 사용할 데이터로 핸들링
function pipelineDataToLibraryData2(pipelineData){

	const flowchartData = new Object;
	flowchartData.operators = new Object;
	flowchartData.links = new Object;

	let linkIdx = 0
	let nodeName
	let parameterName
	let nodeX;
	let nodeY
	pipelineData.forEach(function (node){

		nodeName = node.nodeData.nodeName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_");
		nodeX =(node.nodeData.x == "") ? 500 : node.nodeData.x
		nodeY =(node.nodeData.y == "") ? 60 : node.nodeData.y
		flowchartData.operators[nodeName] = {}
		flowchartData.operators[nodeName].left = nodeX
		flowchartData.operators[nodeName].top = nodeY
		flowchartData.operators[nodeName].properties = {}
		flowchartData.operators[nodeName].properties.title = node.nodeData.nodeName
		flowchartData.operators[nodeName].properties.class = node.nodeData.status + " " + node.nodeData.scriptType

		flowchartData.operators[nodeName].properties.inputs = {}
		if(node.parameter.parameterInputSize > 0){
			node.parameter.parameterInput.forEach(function(input){
				parameterName = input.parameterName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_");
				flowchartData.operators[nodeName].properties.inputs[nodeName + "|" + parameterName] = {}
				flowchartData.operators[nodeName].properties.inputs[nodeName + "|" + parameterName].label = input.parameterName
			})
		}

		flowchartData.operators[nodeName].properties.outputs = {}
		if(node.parameter.parameterOutputSize > 0){
			node.parameter.parameterOutput.forEach(function(output){
				parameterName = output.parameterName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_")
				flowchartData.operators[nodeName].properties.outputs[nodeName + "|" + parameterName] = {}
				flowchartData.operators[nodeName].properties.outputs[nodeName + "|" + parameterName].label = output.parameterName

				if(output.targetParamName != null){
					output.targetParamName.forEach(function(target){
						const targetInfo = target.split(":")
						flowchartData.links["link" + linkIdx] = {}
						flowchartData.links["link" + linkIdx].fromOperator = nodeName
						flowchartData.links["link" + linkIdx].fromConnector = nodeName + "|" + parameterName
						flowchartData.links["link" + linkIdx].toOperator = targetInfo[0].replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_")
						flowchartData.links["link" + linkIdx].toConnector = targetInfo[0].replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_") + "|" + targetInfo[1].replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_")
						linkIdx++;
					})
				}
			})
		}
	})
	console.log(flowchartData)
	return flowchartData
}

function callPipelineData(){

	let pipeline_data

	return pipeline_data
}

function get_pipeline_detail_info(raw_id){
	if(raw_id != null){
		$.ajax({
			url : get_context_path() + '/mypage/pipeline_detail_info2',
			type : 'POST',
			async : true,
			dataType : "Json",
			data : {
				"raw_id" : raw_id
			},
			success : function(data) {

				pipeline_data = data.pipeline_detail_info;
				console.log(pipeline_data)
				if(data.pipeline_detail_info != null){
					$(".pipelineFull").attr("style","width:"+window.innerWidth+"px");
					draw_structure2(data.pipeline_detail_info,window.innerWidth-400,window.innerHeight,400,240,true);
				}
			},
			beforeSend: function() {
			}
		});
	} else {
		pipeline_data = {};
		pipeline_data.link = [];
		pipeline_data.node = [];
		pipeline_data.pipelineData = {};
		pipeline_data.pipelineData.pipelineName = pipeline_name;
		pipeline_data.pipelineData.pipelineDesc = pipeline_desc;
	}
}

function getProgramRootCategory() {

	$.ajax({
		url : get_context_path() + '/category/program_main_category',
		type : 'POST',
		dataType : 'Json',
		data: {},
		success : function(data) {

			var categoryList = "";
			$.each(data.program_main_category_list, function(index, category){
				categoryList += "<li class='close' id='"+category.categoryID+"' onclick='getProgramSubCategory(this)'>"+category.categoryName+"</li>"
				categoryList += "<ul id='"+category.categoryID+"_sub' class='element_02'></ul>";
			});

			$(".element_01").html(categoryList);
		},
		beforeSend : function() {
			$(".element_01").html("<img src='/bioexpress/img/common/loading.gif'>");
		}
	})
}

function getProgramSubCategory(el) {

	var categoryId = $(el).attr("id");
	var li_class = $(el).attr("class");

	if(li_class == "close"){
		$.ajax({
			url : get_context_path() + '/category/program_sub_category',
			type : 'POST',
			dataType : 'Json',
			data: {root_program_category_id:categoryId},
			success : function(data) {

				$(el).removeClass("close");
				$(el).addClass("open");

				var categoryList = "";
				$.each(data.program_sub_category_list, function(index, category){
					categoryList += "<li class='close' id='"+category.categoryID+"' onclick='getProgramListBySubCategory(this)'>"+category.categoryName+"</li>"
					categoryList += "<ul id='"+category.categoryID+"_sub' class='element_03'></ul>";
				});

				$("#"+categoryId+"_sub").html(categoryList);
			},
			beforeSend : function() {
				$("#"+categoryId+"_sub").html("<img src='/bioexpress/img/common/loading.gif'>");
			}
		});
	} else {
		$(el).removeClass("open");
		$(el).addClass("close");
		$("#"+categoryId+"_sub").html("");
	}
}

function getProgramListBySubCategory(el){

	const categoryId = $(el).attr("id");
	var li_class = $(el).attr("class");

	if(li_class == "close"){
		$.ajax({
			url : get_context_path() + '/program/prorgram_list_by_sub',
			type : 'POST',
			dataType : 'Json',
			data: {subCategoryId:categoryId},
			success : function(data) {

				$(el).removeClass("close");
				$(el).addClass("open");

				var programList = "";
				if(data.program_list.length > 0){

					$.each(data.program_list, function(index, program){
						programList += "<li id='"+program.rawID+"' onclick='createOperate(this,\""+program.scriptType+"\")'>"+program.programName+"</li>"
					});
				} else {
					programList += "No Data"
				}

				$("#"+categoryId+"_sub").html(programList);
			},
			beforeSend : function() {
			}
		});
	} else {
		$(el).removeClass("open");
		$(el).addClass("close");
		$("#"+categoryId+"_sub").html("");
	}
}

function createOperate(el,scriptType) {

	var operatorName = $(el).text();
	var operatorId = "";
	const rawId = $(el).attr("id");
	var chkNum = 0;
	var exsistChk = true;
	var opertorTempName = operatorName;
	console.log(pipeline_data);

	while(exsistChk){

		if(chkNum > 0){

			opertorTempName = operatorName + chkNum.toString();
		}

//		operatorId = "node_"+opertorTempName;
		if(pipeline_data.node.length > 0){

			if(!$("#pipeline_con").flowchart('doesOperatorExists', opertorTempName)){

				$.ajax({
					url : get_context_path() + '/program/program_detail_info',
					type : 'POST',
					async : true,
					dataType : "Json",
					data : {
						"raw_id" : rawId
					},
					success : function(data) {
						programDataToNodeData(data)

						var operatorData = {
							top: 60,
							left: 500,
							properties: {
								title: opertorTempName,
								inputs: {},
								outputs: {}
							}
						};

						if(data.program_detail_info.parameter.parameterInputSize > 0){
							console.log(data.program_detail_info)
							$.each(data.program_detail_info.parameter.parameterInput, function(input_index, input){
								parameterName = input.parameterName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_");
								operatorData.properties.inputs[opertorTempName + "|" + parameterName] = {}
								operatorData.properties.inputs[opertorTempName + "|" + parameterName].label = input.parameterName
							});
						}

						if(data.program_detail_info.parameter.parameterOutputSize > 0){
							$.each(data.program_detail_info.parameter.parameterOutput, function(output_index, output){
								parameterName = output.parameterName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_");
								operatorData.properties.outputs[opertorTempName + "|" + parameterName] = {}
								operatorData.properties.outputs[opertorTempName + "|" + parameterName].label = output.parameterName
							});
						}
						console.log(operatorData)
						$("#pipeline_con").flowchart('createOperator', opertorTempName, operatorData);
						$("#pipeline_con").flowchart('addClassOperator', opertorTempName, scriptType);
					},

					error : function(e) {

					},
					beforeSend : function(){

					}
				});

				exsistChk = false;

			} else {
				chkNum ++;
			}
		} else {
			$.ajax({
				url : get_context_path() + '/program/program_detail_info',
				type : 'POST',
				async : true,
				dataType : "Json",
				data : {
					"raw_id" : rawId
				},
				success : function(data) {
					programDataToNodeData(data)
					draw_structure2(pipeline_data,window.innerWidth-400,window.innerHeight,400,240,true);
				},

				error : function(e) {

				},
				beforeSend : function(){

				}
			});

			exsistChk = false;

		}
	}
}

function programDataToNodeData(data){

	let nodeLength = pipeline_data.node.length
	pipeline_data.node[nodeLength] = {}

	pipeline_data.node[nodeLength].nodeData = data.program_detail_info.programData
	pipeline_data.node[nodeLength].parameter = data.program_detail_info.parameter

	pipeline_data.node[nodeLength].nodeData.MeltiCore = data.program_detail_info.programData.isMultiCore;
	pipeline_data.node[nodeLength].nodeData.Public = data.program_detail_info.programData.isPublic;
	pipeline_data.node[nodeLength].nodeData.categoryID = data.program_detail_info.programData.subCategoryID;
	pipeline_data.node[nodeLength].nodeData.categoryName = data.program_detail_info.programData.subCategoryName;
	pipeline_data.node[nodeLength].nodeData.End = "";
	pipeline_data.node[nodeLength].nodeData.end = "";
	pipeline_data.node[nodeLength].nodeData.multiCore = data.program_detail_info.programData.isMultiCore;
	pipeline_data.node[nodeLength].nodeData.nodeName = data.program_detail_info.programData.programName;
	pipeline_data.node[nodeLength].nodeData.public = data.program_detail_info.programData.isPublic;
	pipeline_data.node[nodeLength].nodeData.registrantID = "";
	pipeline_data.node[nodeLength].nodeData.setCategoryID = data.program_detail_info.programData.setSubCategoryID;
	pipeline_data.node[nodeLength].nodeData.setCategoryName = data.program_detail_info.programData.setSubCategoryName;
	pipeline_data.node[nodeLength].nodeData.setEnd = "";
	pipeline_data.node[nodeLength].nodeData.setMultiCore = data.program_detail_info.programData.setIsMultiCore;
	pipeline_data.node[nodeLength].nodeData.setNodeName = data.program_detail_info.programData.setProgramName;
	pipeline_data.node[nodeLength].nodeData.setPublic = data.program_detail_info.programData.setIsPublic;
	pipeline_data.node[nodeLength].nodeData.setRegistrantID = data.program_detail_info.programData.setRegistrant;
	pipeline_data.node[nodeLength].nodeData.registrantID = data.program_detail_info.programData.registrant;
	pipeline_data.node[nodeLength].nodeData.setStart = "";
	pipeline_data.node[nodeLength].nodeData.setX = "";
	pipeline_data.node[nodeLength].nodeData.setY = "";
	pipeline_data.node[nodeLength].nodeData.Start = "";
	pipeline_data.node[nodeLength].nodeData.start = "";
	pipeline_data.node[nodeLength].nodeData.x = "";
	pipeline_data.node[nodeLength].nodeData.y = "";

	$.each(pipeline_data.node[nodeLength].parameter.parameterOutput,function(index, output){
		output.parameterValue = "/"+member_id+"/"+pipeline_data.node[nodeLength].nodeData.nodeName+"/output";
		console.log(output);
	});

	console.log(pipeline_data);
}

function deleteSelected(el) {

	const operatorId = $(el).attr("id");

	if(operatorId != null && operatorId != ""){

		$("#pipeline_con").flowchart('deleteOperator',operatorId);
		$('#pipeline_con').flowchart('removeClassOperators',"selected");
		$('.below_popup').animate({
			height: "0px"
		},
		1000,
		function(){
			$('#popup_button').removeClass("popup_open");
			$('#popup_button').addClass("popup_close");
			$('.DeleteSelectedBtn').attr("id", "");
		});

		$.each(pipeline_data.node, function(node_index, node){
			if(node.nodeData != null){
				if(operatorId.replace("node_","") == node.nodeData.nodeName){
					pipeline_data.node.splice(node_index,1);
					return false;
				}
			} else {
				if(operatorId.replace("node_","") == node.programData.programName){
					pipeline_data.node.splice(node_index,1);
					return false;
				}

			}
		});
	} else {
		$("#pipeline_con").flowchart('deleteSelected');
	}
	minimapSet();
}

function pipelineSave() {
	var data = $("#pipeline_con").flowchart('getData');
	//var data_json = JSON.stringify(data, null, 2);

	//노드 x,y 값 세팅
	$.each(data.operators, function(index, operator){
		$.each(pipeline_data.node, function(node_index, node){
			if(operator.properties.title == node.nodeData.nodeName){
				node.nodeData.x = operator.left;
				node.nodeData.y = operator.top;
				node.nodeData.setX = true;
				node.nodeData.setY = true;
			}
		});
	});
	console.log(pipeline_data);
	console.log(data);

	/*$.ajax({
		url : get_context_path() + '',
		type : 'POST',
		async : true,
		dataType : "Json",
		data : {
			"pipeline_data" : pipeline_data
		},
		success : function(data) {

		},
		beforeSend: function() {
		}
	});*/

}

//파이프라인 모식도
function draw_structure2(data,area_width,area_height,minimap_width,minimap_height,modify_yn){ // 데이터, 파이프라인영역 가로길이, 파이프라인영역 세로길이, 미니맵 가로길이, 미니맵 세로길이, 링크수정여부(true,false)
	//참고 -> https://github.com/sdrdis/jquery.flowchart

	$('#pipeline_con').flowchart({
		data: pipelineDataToLibraryData2(data.node),
		multipleLinksOnInput: true,			// input에 멀티링크 여부(default: false)
		multipleLinksOnOutput: true,		// output에 멀티링크 여부(default: false)
		linkWidth: 2,						// 링크 굵기(default: 11)
		defaultLinkColor: '#777777',		// 링크 기본색상(default: '#3366ff')
		defaultSelectedLinkColor: 'blue',	// 링크 선택시 색상(default: 'black')
		grid: 10,							// 그리드 크기(default: 20)s
		canUserEditLinks: modify_yn,		// 링크 수정 가능 여부 (default: true)
		canUserMoveOperators: true,			// 노드 이동 가능 여부 (default: true)
		onOperatorSelect: function(operatorId){	//노드 상단 클릭 이벤트

			$('.DeleteSelectedBtn').attr("id",operatorId);
			$('#pipeline_con').flowchart('removeClassOperators',"selected");
			$('#pipeline_con').flowchart('addClassOperator',operatorId,"selected");

			var exsistChk = false;
			if(data.nodeSize > 0){
				$.each(data.node, function(node_index, node){
					if(node.nodeData != null){
						if(operatorId.replace("node_","") == node.nodeData.nodeName){

							exsistChk = true;
							var inputStr = '<tr>';
								inputStr += 	'<th colspan="4" class="tith4">INPUT</th>';
								inputStr += '</tr>';
								inputStr += '<tr class="popup_tr">';
								inputStr += 	'<th>' + pipelinePopCol1 + '</th>';
								inputStr += 	'<th>' + pipelinePopCol2 + '</th>';
								inputStr += 	'<th>' + pipelinePopCol3 + '</th>';
								inputStr += 	'<th>' + pipelinePopCol4 + '</th>';
								inputStr += '</tr>';

							if(node.parameter.parameterInputSize > 0){
								$.each(node.parameter.parameterInput, function(param_index, param){
									inputStr += '<tr>';
									inputStr += 	'<td>'+param.parameterName+'</td>';
									inputStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
									inputStr += 	'<td style="word-break:break-all;">'
									inputStr +=			'<input type="text" name="" onchange="modifyPipelineData(this,\''+param.parameterType+'\',\''+param.nodeID+'\',\''+param.parameterID+'\')" id="input'+node_index+param_index+'Value" class="input_style wh90p inputParameterValue" value="'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'"/>';
									if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
										inputStr +=		"<button type='button' class='browserBtn' id='input"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>" + buttonBrowser +"</button>";
										inputStr +=		"<div class='browserBox'>";
						        		inputStr +=			"<h4 class='tit'>GBox Web Browser</h4>";
							        	inputStr +=			"<div class='box'>";
										inputStr +=				"<div class='table_box'>";
										inputStr +=					"<div id='input"+node_index+param_index+"Selected'></div>"
										inputStr +=					"<table id='' class='tableA treegrid_tb'>";
										inputStr +=						"<caption></caption>";
										inputStr +=						"<colgroup>";
										inputStr +=							"<col style='width:50px;'>";
										inputStr +=							"<col>";
										inputStr +=							"<col style='width:150px;'>";
										inputStr +=							"<col style='width:250px;'>";
										inputStr +=						"</colgroup>";
										inputStr +=						"<thead>";
										inputStr +=							"<tr>";
										inputStr +=								"<th></th>";
										inputStr +=								"<th>" + gboxBrowserCol1 + "</th>";
										inputStr +=								"<th>" + gboxBrowserCol2 + "</th>";
										inputStr +=								"<th>" + gboxBrowserCol3 + "</th>";
										inputStr +=							"</tr>";
										inputStr +=						"</thead>";
										inputStr +=						"<tbody id='input"+node_index+param_index+"Browser'>";
										inputStr +=						"</tbody>";
										inputStr +=					"</table>";
										inputStr +=				"</div>";
										inputStr +=				"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"input"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm + "</button></div>";
							        	inputStr +=			"</div>";
										inputStr +=			"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close2.png'></a>";
						        		inputStr +=		"</div>";
									} else if (param.parameterValueType == 'HDFS'){
										inputStr +=		"<button type='button' class='browserBtn' id='input"+node_index+param_index+"Btn' onclick='getUserHDFSRoot(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>" + buttonBrowser + "</button>";
										inputStr +=		"<div class='browserBox'>";
						        		inputStr +=			"<h4 class='tit'>HDFS Web Browser</h4>";
							        	inputStr +=			"<div class='box'>";
										inputStr +=				"<div class='table_box'>";
										inputStr +=					"<div id='input"+node_index+param_index+"Selected'></div>"
										inputStr +=					"<table id='' class='tableA treegrid_tb'>";
										inputStr +=						"<caption></caption>";
										inputStr +=						"<colgroup>";
										inputStr +=							"<col style='width:50px;'>";
										inputStr +=							"<col>";
										inputStr +=							"<col style='width:150px;'>";
										inputStr +=							"<col style='width:250px;'>";
										inputStr +=						"</colgroup>";
										inputStr +=						"<thead>";
										inputStr +=							"<tr>";
										inputStr +=								"<th></th>";
										inputStr +=								"<th>" + gboxBrowserCol1 + "</th>";
										inputStr +=								"<th>" + gboxBrowserCol2 + "</th>";
										inputStr +=								"<th>" + gboxBrowserCol3 + "</th>";
										inputStr +=							"</tr>";
										inputStr +=						"</thead>";
										inputStr +=						"<tbody id='input"+node_index+param_index+"Browser'>";
										inputStr +=						"</tbody>";
										inputStr +=					"</table>";
										inputStr +=				"</div>";
										inputStr +=				"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"input"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm + "</button></div>";
							        	inputStr +=			"</div>";
										inputStr +=			"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close2.png'></a>";
						        		inputStr +=		"</div>";
									} else {
										inputStr += 	"<div style='display:inline-block;width:63px;'></div>"
									}
									inputStr +=		'</td>';
									inputStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
									inputStr += '</tr>';
								});
							}else {
								inputStr += '<tr><td colspan="4">' + messageNoData + '</td></tr>';
							}

							var outputStr = '<tr>';
								outputStr += 	'<th colspan="4" class="tith4">OUTPUT</th>';
								outputStr += '</tr>';
								outputStr += '<tr class="popup_tr">';
								outputStr += 	'<th>' + pipelinePopCol1 + '</th>';
								outputStr += 	'<th>' + pipelinePopCol2 + '</th>';
								outputStr += 	'<th>' + pipelinePopCol3 + '</th>';
								outputStr += 	'<th>' + pipelinePopCol4 + '</th>';
								outputStr += '</tr>';
							if(node.parameter.parameterOutputSize > 0){
								$.each(node.parameter.parameterOutput, function(param_index, param){
									outputStr += '<tr>';
									outputStr += 	'<td>'+param.parameterName+'</td>';
									outputStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
									outputStr += 	'<td style="word-break:break-all;">'
									outputStr += 		'<input type="text" onchange="modifyPipelineData(this,\''+param.parameterType+'\',\''+param.nodeID+'\',\''+param.parameterID+'\')" id="output'+node_index+param_index+'Value" class="input_style wh90p inputParameterValue" value="'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'"/>'
									if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
										outputStr +=	"<button type='button' class='browserBtn' id='output"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>" + buttonBrowser +"</button>";
										outputStr +=	"<div class='browserBox'>";
						        		outputStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
							        	outputStr +=		"<div class='box'>";
										outputStr +=			"<div class='table_box'>";
										outputStr +=				"<div id='output"+node_index+param_index+"Selected'></div>"
										outputStr +=				"<table id='' class='tableA treegrid_tb'>";
										outputStr +=					"<caption></caption>";
										outputStr +=					"<colgroup>";
										outputStr +=						"<col style='width:50px;'>";
										outputStr +=						"<col>";
										outputStr +=						"<col style='width:150px;'>";
										outputStr +=						"<col style='width:250px;'>";
										outputStr +=					"</colgroup>";
										outputStr +=					"<thead>";
										outputStr +=						"<tr>";
										outputStr +=							"<th></th>";
										outputStr +=							"<th>" + gboxBrowserCol1 + "</th>";
										outputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
										outputStr +=							"<th>" + gboxBrowserCol3 + "</th>";
										outputStr +=						"</tr>";
										outputStr +=					"</thead>";
										outputStr +=					"<tbody id='output"+node_index+param_index+"Browser'>";
										outputStr +=					"</tbody>";
										outputStr +=				"</table>";
										outputStr +=			"</div>";
										outputStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"output"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm + "</button></div>";
							        	outputStr +=		"</div>";
										outputStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close2.png'></a>";
						        		outputStr +=	"</div>";
									} else if (param.parameterValueType == 'HDFS'){
										outputStr +=	"<button type='button' class='browserBtn' id='output"+node_index+param_index+"Btn' onclick='getUserHDFSRoot(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>" + buttonBrowser + "</button>";
										outputStr +=	"<div class='browserBox'>";
						        		outputStr +=		"<h4 class='tit'>HDFS Web Browser</h4>";
							        	outputStr +=		"<div class='box'>";
										outputStr +=			"<div class='table_box'>";
										outputStr +=				"<div id='output"+node_index+param_index+"Selected'></div>"
										outputStr +=				"<table id='' class='tableA treegrid_tb'>";
										outputStr +=					"<caption></caption>";
										outputStr +=					"<colgroup>";
										outputStr +=						"<col style='width:50px;'>";
										outputStr +=						"<col>";
										outputStr +=						"<col style='width:150px;'>";
										outputStr +=						"<col style='width:250px;'>";
										outputStr +=					"</colgroup>";
										outputStr +=					"<thead>";
										outputStr +=						"<tr>";
										outputStr +=							"<th></th>";
										outputStr +=							"<th>" + gboxBrowserCol1 + "</th>";
										outputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
										outputStr +=							"<th>" + gboxBrowserCol3 + "</th>";
										outputStr +=						"</tr>";
										outputStr +=					"</thead>";
										outputStr +=					"<tbody id='output"+node_index+param_index+"Browser'>";
										outputStr +=					"</tbody>";
										outputStr +=				"</table>";
										outputStr +=			"</div>";
										outputStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"output"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm + "</button></div>";
							        	outputStr +=		"</div>";
										outputStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close2.png'></a>";
						        		outputStr +=	"</div>";
									} else {
									 	outputStr += "<div style='display:inline-block;width:63px;'></div>"
									}
									outputStr +=	'</td>';
									outputStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
									outputStr += '</tr>';
								});
							}else {
								outputStr += '<tr><td colspan="4">' + messageNoData + '</td></tr>';
							}

							var optionStr = '<tr>';
								optionStr += 	'<th colspan="4" class="tith4">OPTION</th>';
								optionStr += '</tr>';
								optionStr += '<tr class="popup_tr">';
								optionStr += 	'<th>' + pipelinePopCol1 + '</th>';
								optionStr += 	'<th>' + pipelinePopCol2 + '</th>';
								optionStr += 	'<th>' + pipelinePopCol3 + '</th>';
								optionStr += 	'<th>' + pipelinePopCol4 + '</th>';
								optionStr += '</tr>';
							if(node.parameter.parameterOptionSize > 0){
								$.each(node.parameter.parameterOption, function(param_index, param){
									optionStr += '<tr>';
									optionStr += 	'<td>'+param.parameterName+'</td>';
									optionStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
									optionStr += 	'<td style="word-break:break-all;"><input type="text" onchange="modifyPipelineData(this,\''+param.parameterType+'\',\''+param.nodeID+'\',\''+param.parameterID+'\')" id="option'+node_index+param_index+'Value" class="input_style wh90p inputParameterValue" value="'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'"/>'
									if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
										optionStr +=	"<button type='button' class='browserBtn' id='option"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>" + buttonBrowser + "</button>";
										optionStr +=	"<div class='browserBox'>";
						        		optionStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
							        	optionStr +=		"<div class='box'>";
										optionStr +=			"<div class='table_box'>";
										optionStr +=				"<div id='option"+node_index+param_index+"Selected'></div>"
										optionStr +=				"<table id='' class='tableA treegrid_tb'>";
										optionStr +=					"<caption></caption>";
										optionStr +=					"<colgroup>";
										optionStr +=						"<col style='width:50px;'>";
										optionStr +=						"<col>";
										optionStr +=						"<col style='width:150px;'>";
										optionStr +=						"<col style='width:250px;'>";
										optionStr +=					"</colgroup>";
										optionStr +=					"<thead>";
										optionStr +=						"<tr>";
										optionStr +=							"<th></th>";
										optionStr +=							"<th>" + gboxBrowserCol1 + "</th>";
										optionStr +=							"<th>" + gboxBrowserCol2 + "</th>";
										optionStr +=							"<th>" + gboxBrowserCol3 + "</th>";
										optionStr +=						"</tr>";
										optionStr +=					"</thead>";
										optionStr +=					"<tbody id='option"+node_index+param_index+"Browser'>";
										optionStr +=					"</tbody>";
										optionStr +=				"</table>";
										optionStr +=			"</div>";
										optionStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"option"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button></div>";
							        	optionStr +=		"</div>";
										optionStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close2.png'></a>";
						        		optionStr +=	"</div>";
									} else if (param.parameterValueType == 'HDFS'){
										optionStr +=	"<button type='button' class='browserBtn' id='option"+node_index+param_index+"Btn' onclick='getUserHDFSRoot(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>" + buttonBrowser + "</button>";
										optionStr +=	"<div class='browserBox'>";
						        		optionStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
							        	optionStr +=		"<div class='box'>";
										optionStr +=			"<div class='table_box'>";
										optionStr +=				"<div id='option"+node_index+param_index+"Selected'></div>"
										optionStr +=				"<table id='' class='tableA treegrid_tb'>";
										optionStr +=					"<caption></caption>";
										optionStr +=					"<colgroup>";
										optionStr +=						"<col style='width:50px;'>";
										optionStr +=						"<col>";
										optionStr +=						"<col style='width:150px;'>";
										optionStr +=						"<col style='width:250px;'>";
										optionStr +=					"</colgroup>";
										optionStr +=					"<thead>";
										optionStr +=						"<tr>";
										optionStr +=							"<th></th>";
										optionStr +=							"<th>" + gboxBrowserCol1 + "</th>";
										optionStr +=							"<th>" + gboxBrowserCol2 + "</th>";
										optionStr +=							"<th>" + gboxBrowserCol3 + "</th>";
										optionStr +=						"</tr>";
										optionStr +=					"</thead>";
										optionStr +=					"<tbody id='option"+node_index+param_index+"Browser'>";
										optionStr +=					"</tbody>";
										optionStr +=				"</table>";
										optionStr +=			"</div>";
										optionStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"option"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm + "</button></div>";
							        	optionStr +=		"</div>";
										optionStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close2.png'></a>";
						        		optionStr +=	"</div>";
									} else {
									 	optionStr += "<div style='display:inline-block;width:63px;'></div>"
									}
									optionStr += 	'</td>';
									optionStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
									optionStr += '</tr>';
								});
							} else {
								optionStr += '<tr>';
								optionStr += '<td colspan="4">' + messageNoData + '</td>';
								optionStr += '</tr>';
							}
							$('#inputInfo').html(inputStr);
							$('#outputInfo').html(outputStr);
							$('#optionInfo').html(optionStr);

							$('.popup_content_wr').addClass('active');

							$('.below_popup').animate({
								height: "500px"
							},
							1000,
							function(){
								$('#popup_button').removeClass("popup_close");
								$('#popup_button').addClass("popup_open");
							});
						}
					} else {
						if(operatorId.replace("node_","") == node.programData.programName){

							exsistChk = true;
							var inputStr = '<tr>';
								inputStr += 	'<th colspan="4" class="tith4">INPUT</th>';
								inputStr += '</tr>';
								inputStr += '<tr class="popup_tr">';
								inputStr += 	'<th>' + pipelinePopCol1 + '</th>';
								inputStr += 	'<th>' + pipelinePopCol2 + '</th>';
								inputStr += 	'<th>' + pipelinePopCol3 + '</th>';
								inputStr += 	'<th>' + pipelinePopCol4 + '</th>';
								inputStr += '</tr>';

							if(node.parameter.parameterInputSize > 0){
								$.each(node.parameter.parameterInput, function(param_index, param){
									inputStr += '<tr>';
									inputStr += 	'<td>'+param.parameterName+'</td>';
									inputStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
									inputStr += 	'<td style="word-break:break-all;">'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'</td>';
									inputStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
									inputStr += '</tr>';
								});
							}else {
								inputStr += '<tr><td colspan="4">' + messageNoData + '</td></tr>';
							}

							var outputStr = '<tr>';
								outputStr += 	'<th colspan="4" class="tith4">OUTPUT</th>';
								outputStr += '</tr>';
								outputStr += '<tr class="popup_tr">';
								outputStr += 	'<th>' + pipelinePopCol1 + '</th>';
								outputStr += 	'<th>' + pipelinePopCol2 + '</th>';
								outputStr += 	'<th>' + pipelinePopCol3 + '</th>';
								outputStr += 	'<th>' + pipelinePopCol4 + '</th>';
								outputStr += '</tr>';
							if(node.parameter.parameterOutputSize > 0){
								$.each(node.parameter.parameterOutput, function(param_index, param){
									outputStr += '<tr>';
									outputStr += 	'<td>'+param.parameterName+'</td>';
									outputStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
									outputStr += 	'<td style="word-break:break-all;">'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'</td>';
									outputStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
									outputStr += '</tr>';
								});
							}else {
								outputStr += '<tr><td colspan="4">' + messageNoData + '</td></tr>';
							}

							var optionStr = '<tr>';
								optionStr += 	'<th colspan="4" class="tith4">OPTION</th>';
								optionStr += '</tr>';
								optionStr += '<tr class="popup_tr">';
								optionStr += 	'<th>' + pipelinePopCol1 + '</th>';
								optionStr += 	'<th>' + pipelinePopCol2 + '</th>';
								optionStr += 	'<th>' + pipelinePopCol3 + '</th>';
								optionStr += 	'<th>' + pipelinePopCol4 + '</th>';
								optionStr += '</tr>';
							if(node.parameter.parameterOptionSize > 0){
								$.each(node.parameter.parameterOption, function(param_index, param){
									optionStr += '<tr>';
									optionStr += 	'<td>'+param.parameterName+'</td>';
									optionStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
									optionStr += 	'<td style="word-break:break-all;">'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'</td>';
									optionStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
									optionStr += '</tr>';
								});
							} else {
								optionStr += '<tr>';
								optionStr += '<td colspan="4">' + messageNoData + '</td>';
								optionStr += '</tr>';
							}
							$('#inputInfo').html(inputStr);
							$('#outputInfo').html(outputStr);
							$('#optionInfo').html(optionStr);

							$('.popup_content_wr').addClass('active');

							$('.below_popup').animate({
								height: "500px"
							},
							1000,
							function(){
								$('#popup_button').removeClass("popup_close");
								$('#popup_button').addClass("popup_open");
							});
						}
					}
				});

				if(!exsistChk){
					$('.below_popup').animate({
						height: "0px"
					},1000);
				}
			}
		},
		onOperatorUnselect : function(operatorId) {
			$('#pipeline_con').flowchart('removeClassOperator',operatorId,"selected");
		},
		onAfterChange : function(){
			minimapSet();
		},
		onLinkCreate : function(linkID, linkData){
							
			if(linkID.length > 4 && linkID.substr(0,4) == "link"){
			} else {
				let linkLength = pipeline_data.link.length;
				pipeline_data.link[linkLength] = {};

				pipeline_data.link[linkLength].sourceName = linkData.fromOperator;
				pipeline_data.link[linkLength].targetName = linkData.toOperator;

				$.each(pipeline_data.node, function(node_index, node){
					if(node.nodeData.nodeName == linkData.fromOperator){
						pipeline_data.link[linkLength].sourceID = node.nodeID;
					}
					if(node.nodeData.nodeName == linkData.toOperator){
						pipeline_data.link[linkLength].targetID = node.nodeID;
					}
				});

				pipeline_data.link[linkLength].linkID = "";
				pipeline_data.link[linkLength].setLinkID = false;
				pipeline_data.link[linkLength].setSourceID = true;
				pipeline_data.link[linkLength].setSourceName = true;
				pipeline_data.link[linkLength].setTargetID = true;
				pipeline_data.link[linkLength].setTargetName = true;

			}

			return true;
		},
		onLinkDelete : function(linkId, forced){
			var data = $("#pipeline_con").flowchart('getData');
			var linkData = data.links[linkId];

			console.log(pipeline_data);
			$.each(pipeline_data.link, function(index, link){
				console.log(link);
				if(link != undefined){
					if(linkData.fromOperator == link.sourceName && linkData.toOperator == link.targetName){
						pipeline_data.link.splice(index,1);
					}
				}
			});



			return true;
		}

    });

	// 파이프라인 초기 위치 설정
	$('#pipeline_con').attr("style","transform:matrix(1, 0, 0, 1, 0.5, 0.5); left:-2px; top:-2px;");

	// 미니맵 미리보기 이미지 세팅
	window.scrollTo(0,0);
	html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
		document.getElementById("minimapArea").appendChild(canvas);
		$('#minimapArea>canvas').attr("style","width:"+minimap_width+"px; position:absolute; top:0px; left:0px;");
	});

	/* 미니맵 설정 */
	// Module base class for element and event management
	function Module() { }

	Module.prototype.init = function(el) {
	    this.$module = $(el);
	    this.attachEvents();

	    this.initModule();
	}

	Module.prototype.attachEvents = function () {
		this.$module.on('click.module', '[data-clickaction]', $.proxy(this.handleAction, this));
		this.$module.on('change.module', '[data-changeaction]', $.proxy(this.handleAction, this));
	}

	Module.prototype.handleAction = function (e) {
		var type = e.type,
			$el = $(e.currentTarget),
			tag = $el[0].tagName.toLowerCase(),
			action = $el.attr('data-' + type + 'action'),
			actionValue;

		if (/mouse(enter|leave)/.test(type)) {
			action = $el.attr('data-hoveraction')
		}

		// Cancel event for non-input elements (like a link's href)
		if (tag != 'input') {
			e.preventDefault();
		}

		if (/(select|input)/.test(tag)) {
			if ($el.attr("type") == "checkbox") {
				actionValue = $el.is(":checked") ? true : false;
			} else {
				actionValue = $el.val();
			}
		}
		else {
			actionValue = $el.data('actionvalue');
		}

	    e.stopPropagation();

		if (this['action_' + action]) {
			this['action_' + action]($el, actionValue, e);
		}
		else if (typeof Debug != 'undefined') {
			console.info(this.moduleId, this.$module, 'Module:handleAction', action, 'action not found');
		}

	}

	Module.prototype.$elements = {}
	Module.prototype.$el = function(name, retrieveFresh) {

	    if (!this.$elements[name] || retrieveFresh) {
	        this.$elements[name] = $(this.elementMap[name] || name, this.$module[0]);
	    }

	    return this.$elements[name];
	}


	Universe = function() {

	}
	Universe.prototype = new Module();

	Universe.prototype.elementMap = {
	    'background': 'div.pArea',
	    'minimap':'div.minimap',
	    'minimapViewport':'div.minimap div.viewport',
	}

	Universe.prototype.initModule = function() {

	    this.zoomLevel = 1;

	    this.setDimensions();

	    this.$el('background').draggable({
	        scroll: false,
	        drag: $.proxy(this.mapPanning, this)
	    });

	    this.$el('minimapViewport').draggable({
	        scroll: false,
	        containment: this.$el('minimap'),
	        drag: $.proxy(this.minimapPanning, this)
	    });

	}

	Universe.prototype.setDimensions = function() {

		//파이프라인 보이는 영역 크기
	    this.mapDimensions = {
	        width: area_width,
	        height: area_height
	    };

		//미니맵 보이는 영역 크기
	    this.minimapDimensions = {
	        width: minimap_width,
	        height: minimap_height
	    };

		//파이프라인 전체 영역 크기
	    this.backgroundDimensions = {
	        width: 2200,
	        height: 1300
	    }; // based on zoom
	}

	$(".pipelineFull .leftSide .minimap .viewport").attr("style","width:"+((area_width*minimap_width/2200)-4)+"px; height:"+((area_height*minimap_height/1300)-4)+"px;");

	Universe.prototype.mapPanning = function(e, ui) {

	    // constrain to bounding region
	    var pos = ui.position;
	    ui.position.top = Math.max(ui.position.top, this.mapDimensions.height - this.backgroundDimensions.height);
	    ui.position.left = Math.max(ui.position.left, this.mapDimensions.width - this.backgroundDimensions.width);
	    ui.position.top = Math.min(ui.position.top, -2);
	    ui.position.left = Math.min(ui.position.left, -2);


	    var widthRatio = this.minimapDimensions.width / this.backgroundDimensions.width;
	    var heightRatio = this.minimapDimensions.height / this.backgroundDimensions.height;

	    var minimapViewportPosition = {
	        left:-(pos.left * widthRatio),
	        top:-(pos.top * heightRatio)
	    };

	    this.$el('minimapViewport').css(minimapViewportPosition);

	}


	Universe.prototype.minimapPanning = function(e, ui) {

	    var pos = ui.position;

	    var widthRatio = this.backgroundDimensions.width / this.minimapDimensions.width;
	    var heightRatio = this.backgroundDimensions.height / this.minimapDimensions.height;

	    var backgroundPosition = {
	        left:-(pos.left * widthRatio),
	        top:-(pos.top * heightRatio)
	    };

	    this.$el('background').css(backgroundPosition);

	}

	new Universe().init('div.pipeline_div');

}

function modifyPipelineData(el,parameterType,nodeID,parameterID){

	var value = $(el).val();

	$.each(pipeline_data.node, function(node_index, node){
		if(parameterType == "Input" && node.parameter.parameterInputSize > 0){
			$.each(node.parameter.parameterInput, function(param_index, param){
				if(param.nodeID == nodeID && param.parameterID == parameterID){
					pipeline_data.node[node_index].parameter.parameterInput[param_index].parameterValue = value;
				}
			});
		} else if(parameterType == "Output" && node.parameter.parameterOutputSize > 0){
			$.each(node.parameter.parameterOutput, function(param_index, param){
				if(param.nodeID == nodeID && param.parameterID == parameterID){
					pipeline_data.node[node_index].parameter.parameterOutput[param_index].parameterValue = value;
				}
			});
		} else if(parameterType == "Option" && node.parameter.parameterOptionSize > 0){
			$.each(node.parameter.parameterOption, function(param_index, param){
				if(param.nodeID == nodeID && param.parameterID == parameterID){
					pipeline_data.node[node_index].parameter.parameterOption[param_index].parameterValue = value;
				}
			});
		}
	});

}

function selectValue2(val,parameterType,nodeID,parameterID) {

	var setVal;

	if($("input:radio[name="+val+"]:checked").val() != null){

		setVal = $("input:radio[name="+val+"]:checked").val().replace('/BiO/rapidant/data/group/AnonymousGroup','');
	} else {

	}


	if(setVal != undefined){
		$('#'+val+'ValueView').val(setVal);
		$('#'+val+'Value').val(setVal);
	}
	$(".browserBox").hide();
	$(".bg_opacity1").hide();

	$.each(pipeline_data.node, function(node_index, node){
		if(parameterType == "Input" && node.parameter.parameterInputSize > 0){
			$.each(node.parameter.parameterInput, function(param_index, param){
				if(param.nodeID == nodeID && param.parameterID == parameterID){
					pipeline_data.node[node_index].parameter.parameterInput[param_index].parameterValue = setVal;
				}
			});
		} else if(parameterType == "Output" && node.parameter.parameterOutputSize > 0){
			$.each(node.parameter.parameterOutput, function(param_index, param){
				if(param.nodeID == nodeID && param.parameterID == parameterID){
					pipeline_data.node[node_index].parameter.parameterOutput[param_index].parameterValue = setVal;
				}
			});
		} else if(parameterType == "Option" && node.parameter.parameterOptionSize > 0){
			$.each(node.parameter.parameterOption, function(param_index, param){
				if(param.nodeID == nodeID && param.parameterID == parameterID){
					pipeline_data.node[node_index].parameter.parameterOption[param_index].parameterValue = setVal;
				}
			});
		}
	});

}

function closeGBoxBrowser(){
	$(".browserBox").hide();
	$(".bg_opacity1").hide();
}

//파이프라인 모식도
function draw_structure(data,area_width,area_height,minimap_width,minimap_height,modify_yn){ // 데이터, 파이프라인영역 가로길이, 파이프라인영역 세로길이, 미니맵 가로길이, 미니맵 세로길이, 링크수정여부(true,false)
	//참고 -> https://github.com/sdrdis/jquery.flowchart
	console.log(data)
//	if(data.nodeSize > 0){
//
//		pipelineDataToLibraryData2(data.node)
//	}

	$('#pipeline_con').flowchart({
		data: pipelineDataToLibraryData2(data.node),
		multipleLinksOnInput: true,			// input에 멀티링크 여부(default: false)
		multipleLinksOnOutput: true,		// output에 멀티링크 여부(default: false)
		linkWidth: 2,						// 링크 굵기(default: 11)
		defaultLinkColor: '#777777',		// 링크 기본색상(default: '#3366ff')
		defaultSelectedLinkColor: 'blue',	// 링크 선택시 색상(default: 'black')
		grid: 10,							// 그리드 크기(default: 20)s
		canUserEditLinks: modify_yn,		// 링크 수정 가능 여부 (default: true)
		canUserMoveOperators: true,			// 노드 이동 가능 여부 (default: true)
		onOperatorSelect: function(operatorId){	//노드 상단 클릭 이벤트

			$('.DeleteSelectedBtn').attr("id",operatorId);
			$('#pipeline_con').flowchart('removeClassOperators',"selected");
			$('#pipeline_con').flowchart('addClassOperator',operatorId,"selected");
console.log("click!");
			$("#popupTitle").text(operatorId);
			var exsistChk = false;
			if(data.nodeSize > 0){
				$.each(data.node, function(node_index, node){
					if(operatorId.replace("node_","") == node.nodeData.nodeName){

						exsistChk = true;
						var inputStr = '<tr>';
							inputStr += 	'<th colspan="4" class="tith4">INPUT</th>';
							inputStr += '</tr>';
							inputStr += '<tr class="popup_tr">';
							inputStr += 	'<th>' + pipelinePopCol1 + '</th>';
							inputStr += 	'<th>' + pipelinePopCol2 + '</th>';
							inputStr += 	'<th>' + pipelinePopCol3 + '</th>';
							inputStr += 	'<th>' + pipelinePopCol4 + '</th>';
							inputStr += '</tr>';

						if(node.parameter.parameterInputSize > 0){
							$.each(node.parameter.parameterInput, function(param_index, param){
								inputStr += '<tr>';
								inputStr += 	'<td>'+param.parameterName+'</td>';
								inputStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
								inputStr += 	'<td style="word-break:break-all;">'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'</td>';
								inputStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
								inputStr += '</tr>';
							});
						}else {
							inputStr += '<tr><td colspan="4">' + messageNoData + '</td></tr>';
						}

						var outputStr = '<tr>';
							outputStr += 	'<th colspan="4" class="tith4">OUTPUT</th>';
							outputStr += '</tr>';
							outputStr += '<tr class="popup_tr">';
							outputStr += 	'<th>' + pipelinePopCol1 + '</th>';
							outputStr += 	'<th>' + pipelinePopCol2 + '</th>';
							outputStr += 	'<th>' + pipelinePopCol3 + '</th>';
							outputStr += 	'<th>' + pipelinePopCol4 + '</th>';
							outputStr += '</tr>';
						if(node.parameter.parameterOutputSize > 0){
							$.each(node.parameter.parameterOutput, function(param_index, param){
								outputStr += '<tr>';
								outputStr += 	'<td>'+param.parameterName+'</td>';
								outputStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
								outputStr += 	'<td style="word-break:break-all;">'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'</td>';
								outputStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
								outputStr += '</tr>';
							});
						}else {
							outputStr += '<tr><td colspan="4">' + messageNoData + '</td></tr>';
						}

						var optionStr = '<tr>';
							optionStr += 	'<th colspan="4" class="tith4">OPTION</th>';
							optionStr += '</tr>';
							optionStr += '<tr class="popup_tr">';
							optionStr += 	'<th>' + pipelinePopCol1 + '</th>';
							optionStr += 	'<th>' + pipelinePopCol2 + '</th>';
							optionStr += 	'<th>' + pipelinePopCol3 + '</th>';
							optionStr += 	'<th>' + pipelinePopCol4 + '</th>';
							optionStr += '</tr>';
						if(node.parameter.parameterOptionSize > 0){
							$.each(node.parameter.parameterOption, function(param_index, param){
								optionStr += '<tr>';
								optionStr += 	'<td>'+param.parameterName+'</td>';
								optionStr += 	'<td><i class="boolean_icon boolean_' + param.isRequire + '"></i>' + param.isRequire + '</td>';
								optionStr += 	'<td style="word-break:break-all;">'+(param.parameterValue!=null?param.parameterValue.replace('/BiO/rapidant/data/group/AnonymousGroup',''):"")+'</td>';
								optionStr += 	'<td><i class="parameter_icon parameter_'+param.parameterValueType+'"></i>'+param.parameterValueType+'</td>';
								optionStr += '</tr>';
							});
						} else {
							optionStr += '<tr>';
							optionStr += '<td colspan="4">' + messageNoData + '</td>';
							optionStr += '</tr>';
						}
						$('#inputInfo').html(inputStr);
						$('#outputInfo').html(outputStr);
						$('#optionInfo').html(optionStr);

						$('.popup_content_wr').addClass('active');

						$('.below_popup').animate({
							height: "500px"
						},
						1000,
						function(){
							$('#popup_button').removeClass("popup_close");
							$('#popup_button').addClass("popup_open");
						});
					}
				});
			}
		},
		onOperatorUnselect : function(operatorId) {
			$('#pipeline_con').flowchart('removeClassOperator',operatorId,"selected");
		},
		onOperatorMoved : function(){
			minimapSet();
		}

    });

	// 파이프라인 초기 위치 설정
	$('#pipeline_con').attr("style","transform:matrix(1, 0, 0, 1, 0.5, 0.5); left:-2px; top:-2px;");

	// 미니맵 미리보기 이미지 세팅
	window.scrollTo(0,0);
	html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
		document.getElementById("minimapArea").appendChild(canvas);
		$('#minimapArea>canvas').attr("style","width:"+minimap_width+"px; position:absolute; top:0px; left:0px;");
	});

	if(document.getElementById("TaskPipelineArea")){
		html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
			document.getElementById("TaskPipelineArea").appendChild(canvas);
			$('#TaskPipelineArea>canvas').attr("style","width:130%;position:relative;top:-1px;left:-1px;");
			$('#TaskPipelineArea>canvas').first().remove();
			$('#TaskPipelineArea>canvas').attr("id","pipelineCanvas");
		});
	}

	/* 미니맵 설정 */
	// Module base class for element and event management
	function Module() { }

	Module.prototype.init = function(el) {
	    this.$module = $(el);
	    this.attachEvents();

	    this.initModule();
	}

	Module.prototype.attachEvents = function () {
		this.$module.on('click.module', '[data-clickaction]', $.proxy(this.handleAction, this));
		this.$module.on('change.module', '[data-changeaction]', $.proxy(this.handleAction, this));
	}

	Module.prototype.handleAction = function (e) {
		var type = e.type,
			$el = $(e.currentTarget),
			tag = $el[0].tagName.toLowerCase(),
			action = $el.attr('data-' + type + 'action'),
			actionValue;

		if (/mouse(enter|leave)/.test(type)) {
			action = $el.attr('data-hoveraction')
		}

		// Cancel event for non-input elements (like a link's href)
		if (tag != 'input') {
			e.preventDefault();
		}

		if (/(select|input)/.test(tag)) {
			if ($el.attr("type") == "checkbox") {
				actionValue = $el.is(":checked") ? true : false;
			} else {
				actionValue = $el.val();
			}
		}
		else {
			actionValue = $el.data('actionvalue');
		}

	    e.stopPropagation();

		if (this['action_' + action]) {
			this['action_' + action]($el, actionValue, e);
		}
		else if (typeof Debug != 'undefined') {
			console.info(this.moduleId, this.$module, 'Module:handleAction', action, 'action not found');
		}

	}

	Module.prototype.$elements = {}
	Module.prototype.$el = function(name, retrieveFresh) {

	    if (!this.$elements[name] || retrieveFresh) {
	        this.$elements[name] = $(this.elementMap[name] || name, this.$module[0]);
	    }

	    return this.$elements[name];
	}


	Universe = function() {

	}
	Universe.prototype = new Module();

	Universe.prototype.elementMap = {
	    'background': 'div.pArea',
	    'minimap':'div.minimap',
	    'minimapViewport':'div.minimap div.viewport',
	}

	Universe.prototype.initModule = function() {

	    this.zoomLevel = 1;

	    this.setDimensions();

	    this.$el('background').draggable({
	        scroll: false,
	        drag: $.proxy(this.mapPanning, this)
	    });

	    this.$el('minimapViewport').draggable({
	        scroll: false,
	        containment: this.$el('minimap'),
	        drag: $.proxy(this.minimapPanning, this)
	    });

	}

	Universe.prototype.setDimensions = function() {

		//파이프라인 보이는 영역 크기
	    this.mapDimensions = {
	        width: area_width,
	        height: area_height
	    };

		//미니맵 보이는 영역 크기
	    this.minimapDimensions = {
	        width: minimap_width,
	        height: minimap_height
	    };

		//파이프라인 전체 영역 크기
	    this.backgroundDimensions = {
	        width: 2000,
	        height: 1200
	    }; // based on zoom
	}

	$(".pipelineFull .leftSide .minimap .viewport").attr("style","width:"+((area_width*minimap_width/2200)-4)+"px; height:"+((area_height*minimap_height/1300)-4)+"px;");

	Universe.prototype.mapPanning = function(e, ui) {

	    // constrain to bounding region
	    var pos = ui.position;
	    ui.position.top = Math.max(ui.position.top, this.mapDimensions.height - this.backgroundDimensions.height);
	    ui.position.left = Math.max(ui.position.left, this.mapDimensions.width - this.backgroundDimensions.width);
	    ui.position.top = Math.min(ui.position.top, -2);
	    ui.position.left = Math.min(ui.position.left, -2);


	    var widthRatio = this.minimapDimensions.width / this.backgroundDimensions.width;
	    var heightRatio = this.minimapDimensions.height / this.backgroundDimensions.height;

	    var minimapViewportPosition = {
	        left:-(pos.left * widthRatio),
	        top:-(pos.top * heightRatio)
	    };

	    this.$el('minimapViewport').css(minimapViewportPosition);

	}


	Universe.prototype.minimapPanning = function(e, ui) {

	    var pos = ui.position;

	    var widthRatio = this.backgroundDimensions.width / this.minimapDimensions.width;
	    var heightRatio = this.backgroundDimensions.height / this.minimapDimensions.height;

	    var backgroundPosition = {
	        left:-(pos.left * widthRatio),
	        top:-(pos.top * heightRatio)
	    };

	    this.$el('background').css(backgroundPosition);

	}

	new Universe().init('div.pipeline_div');

}
