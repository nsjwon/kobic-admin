function minimapSet() {
	var scrollValue = $(document).scrollTop();
	var minimap_width = $("#minimapArea").width();

	window.scrollTo(0,0);
	html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
		document.getElementById("minimapArea").appendChild(canvas);
		$('#minimapArea>canvas').attr("style","width:"+minimap_width+"px; position:absolute; top:0px; left:0px;")
		$('#minimapArea>canvas').first().remove();

		window.scrollTo(0, scrollValue);
	
		// 미니맵 보임 
		$("#minimapArea").removeClass("Dis_none");	
		// 우측상단 현재 활성화된 워크스페이스/파이프라인 이름	
		$(".pipeline-nav").removeClass("Dis_none");
		
		$("#loadingBox").hide();
	});

	if(document.getElementById("TaskPipelineArea")){
		html2canvas(document.querySelector("#pipeline_con")).then(canvas => {
			document.getElementById("TaskPipelineArea").appendChild(canvas);
			$('#TaskPipelineArea>canvas').attr("style","width:130%;position:relative;top:-1px;left:-1px;");
			$('#TaskPipelineArea>canvas').first().remove();
			$('#TaskPipelineArea>canvas').attr("id","pipelineCanvas");
		});
	}
}

// 파이프라인 모식도에 사용할 데이터로 핸들링
// draw_check_03
function pipelineDataToLibraryData2(pipelineData){ // List<NodeModel>

	const flowchartData = new Object;
	flowchartData.operators = new Object;
	flowchartData.links = new Object;

	let linkIdx = 0
	let nodeName
	let parameterName
	let nodeX;
	let nodeY
	
	pipelineData.forEach(function (node){
//		nodeName = node.nodeData.nodeName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_");
		nodeName = node.nodeData.nodeName.replace(/ /gi, "_").replace(/\./gi, "_");
		// node 위치.. 
		nodeX =(node.nodeData.x == "") ? 500 : node.nodeData.x					
		nodeY =(node.nodeData.y == "") ? 60 : node.nodeData.y
		flowchartData.operators[nodeName] = {}
		flowchartData.operators[nodeName].left = nodeX
		flowchartData.operators[nodeName].top = nodeY
		flowchartData.operators[nodeName].properties = {}
		flowchartData.operators[nodeName].properties.title = node.nodeData.nodeName
		flowchartData.operators[nodeName].properties.class = node.nodeData.status + " " + node.nodeData.scriptType

		/*
		console.log('::::::::::::: pipelineDataToLibraryData2 ::::::::::::::');
		console.log('nodeName : ' + node.nodeData.nodeName);
		console.log('X : ' + node.nodeData.x);
		console.log('Y : ' + node.nodeData.y);
		*/

		flowchartData.operators[nodeName].properties.inputs = {}
		if(node.parameter.parameterInputSize > 0){
			node.parameter.parameterInput.forEach(function(input){
//				parameterName = input.parameterName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_"); // 하이픈(-)을 언더바(_)로 변경, 공백( )을 언더바(_)로 변경, 점(.)을 언더바(_)로 변경
				parameterName = input.parameterName.replace(/ /gi, "_").replace(/\./gi, "_"); // 하이픈(-)을 언더바(_)로 변경, 공백( )을 언더바(_)로 변경, 점(.)을 언더바(_)로 변경
				flowchartData.operators[nodeName].properties.inputs[nodeName + "|" + parameterName] = {}
				flowchartData.operators[nodeName].properties.inputs[nodeName + "|" + parameterName].label = input.parameterName
			})
		}

		flowchartData.operators[nodeName].properties.outputs = {}
		if(node.parameter.parameterOutputSize > 0){
			node.parameter.parameterOutput.forEach(function(output){
//				parameterName = output.parameterName.replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_")
				parameterName = output.parameterName.replace(/ /gi, "_").replace(/\./gi, "_")
				flowchartData.operators[nodeName].properties.outputs[nodeName + "|" + parameterName] = {}
				flowchartData.operators[nodeName].properties.outputs[nodeName + "|" + parameterName].label = output.parameterName

				if(output.targetParamName != null){
					output.targetParamName.forEach(function(target){
						const targetInfo = target.split(":")
						flowchartData.links["link" + linkIdx] = {}
						flowchartData.links["link" + linkIdx].fromOperator = nodeName
						flowchartData.links["link" + linkIdx].fromConnector = nodeName + "|" + parameterName
//						flowchartData.links["link" + linkIdx].toOperator = targetInfo[0].replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_")
//						flowchartData.links["link" + linkIdx].toConnector = targetInfo[0].replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_") + "|" + targetInfo[1].replace(/-/gi,"_").replace(/ /gi, "_").replace(/\./gi, "_")
						flowchartData.links["link" + linkIdx].toOperator = targetInfo[0].replace(/ /gi, "_").replace(/\./gi, "_")
						flowchartData.links["link" + linkIdx].toConnector = targetInfo[0].replace(/ /gi, "_").replace(/\./gi, "_") + "|" + targetInfo[1].replace(/ /gi, "_").replace(/\./gi, "_")
						linkIdx++;
					})
				}
				/*
				console.log('::::::::::::::    link      :::::::::::::::');
				console.log(flowchartData.links);
				*/
			})
		}
	})
	// console.log(flowchartData)
	// console.log(':::::::::::::   pipelineDataToLibraryData2  :::::::::::');
	// console.log(JSON.stringify(pipeline_data));
	
	
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
				categoryList += "<li class='close' id='"+category.categoryID+"' onclick='getProgramSubCategory(this)'><span>"+category.categoryName+"</span></li>"
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
						var scriptTypeImg = "<img src='../new/img/pipeline/common/language/" + program.scriptType + ".png' class='lang_img'>";
						//programList += "<li id='"+program.rawID+"' onclick='createOperate(this,\""+program.scriptType+"\")'>" + scriptTypeImg +program.programName+"</li>"
						programList += "<li id='"+program.rawID+"' onclick='pipeDesign_createNode(this,\""+program.scriptType+"\")'>" + scriptTypeImg +program.programName+"</li>"
					});
				} else {
//					programList += "No Data"
					programList += "<span class='noData'>No Data</span>";
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

// (좌측 메뉴 두번재 메뉴) new node(program)
/**
 *	1. 좌측 두번 째 메뉴
 *  2. 신규 노드(operate, 연산자, 프로그램, 서브태스크) 추가
 */
function createOperate(el,scriptType) {

	// 태스크 상태 -> 수정됨으로 변경
	setTaskStat_modi();

	var operatorName = $(el).text();	
	const rawId = $(el).attr("id");
	var chkNum = 0;
	var exsistChk = true;
	var opertorTempName = operatorName;

	while(exsistChk){

		if(chkNum > 0){
			opertorTempName = operatorName + chkNum.toString();
		}
		
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
						$.each(data.program_detail_info.parameter.parameterInput, function(input_index, input){
							parameterName = input.parameterName.replace(/ /gi, "_").replace(/\./gi, "_");
							operatorData.properties.inputs[opertorTempName + "|" + parameterName] = {}
							operatorData.properties.inputs[opertorTempName + "|" + parameterName].label = input.parameterName
						});
					}

					if(data.program_detail_info.parameter.parameterOutputSize > 0){
						$.each(data.program_detail_info.parameter.parameterOutput, function(output_index, output){
							parameterName = output.parameterName.replace(/ /gi, "_").replace(/\./gi, "_");
							operatorData.properties.outputs[opertorTempName + "|" + parameterName] = {}
							operatorData.properties.outputs[opertorTempName + "|" + parameterName].label = output.parameterName
						});
					}
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
	});

}

function deleteSelected(el) {

//	const operatorId = $(el).attr("id");
	const operatorId = $(el).parent().siblings("h2").text();

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
		
		// 2022.09.16 
		// 우측 노드 정보 닫기:s
		$('.popup_content_wr').removeClass('active');
		$(".right-wrap").children("div").eq(1).addClass("Dis_none");
		// 우측 노드 정보 닫기:e
		
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

/**
 * 파이프라인 디자인 화면(모눈종이 화면)을 구성한다. (그린다)
 */
function draw_structure2(data,area_width,area_height,minimap_width,minimap_height,modify_yn){ // 데이터, 파이프라인영역 가로길이, 파이프라인영역 세로길이, 미니맵 가로길이, 미니맵 세로길이, 링크수정여부(true,false)

	$('#pipeline_con').flowchart({
		data: pipelineDataToLibraryData2(data.node), 	// List<NodeModel>
		multipleLinksOnInput: false,					// input에 멀티링크 여부(default: false) // 2022.10.14, 동일한 input 커넥터에 여러개의 링크를 연결할 수 없도록 설정 (워크벤치 설정과 동일)
		multipleLinksOnOutput: true,					// output에 멀티링크 여부(default: false)
		linkWidth: 2,									// 링크 굵기(default: 11)
		defaultLinkColor: '#777777',					// 링크 기본색상(default: '#3366ff')
		defaultSelectedLinkColor: 'blue',				// 링크 선택시 색상(default: 'black')
		grid: 10,										// 그리드 크기(default: 20)s
		canUserEditLinks: modify_yn,					// 링크 수정 가능 여부 (default: true)
		canUserMoveOperators: true,						// 노드 이동 가능 여부 (default: true)
		onOperatorSelect: function(operatorId) {		//노드 상단 클릭 이벤트
			
			console.log('[Event][onOperatorSelect] 노드 상단 클릭');	
									
			$('#pipeline_con').flowchart('removeClassOperators',"selected");
			$('#pipeline_con').flowchart('addClassOperator',operatorId,"selected");
			
			var exsistChk = false;
			if(data.nodeSize > 0) {
				
				// 로딩 박스 표출
				$("#loadingBox").show();
				
				$.each(data.node, function(node_index, node){
																																					
					if(operatorId.replace("node_","") == node.nodeData.nodeName){

						// (우측) 노드 설정 타이틀 세팅
						$("h2[name=nodeId]").attr("class", "h_side h_node_" + (node.nodeData.scriptType).toLowerCase());
						$("h2[name=nodeId]").children("span").text(operatorId);
						
						// (우측) 실행기록 리스트 세팅 
						console.log(node);
						if(node.nodeID) {
							showSubTaskList(node.nodeID);	
						}													
						exsistChk = true;

						// 노드 클릭 시 우측 활성화 창 : 노드설정 탭 - INPUT 탭 
						var inputStr = "";
						if(node.parameter.parameterInputSize > 0){
							$.each(node.parameter.parameterInput, function(param_index, param){
								var isRequire = param.isRequire ? "True": "False";
								inputStr += "<div class='para-cont-item'>";
								inputStr += 	"<div><span>Name</span><span>" + param.parameterName + "</spna></div>";
								inputStr += 	"<div><span>Required</span><span class='boolean_icon boolean_" + param.isRequire + "'>" + isRequire + "</span></div>";
								inputStr +=		"<div><span>Type</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueType + "</span></div>";
								inputStr += 	"<div class='para_value'>";
								inputStr += 		"<label for='input" + node_index + param_index + "Value' class=''>Value</label>";
								inputStr +=			"<input type='text' name='input" + node_index + param_index + "Value' id='input" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " readonly/>";
								
								// fs_content.css 사용중
								if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
									inputStr +=		"<div class='btn_wrap'><button class='btn btn_line_gray' id='input"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>열기</button></div>";
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
									inputStr +=			"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		inputStr +=		"</div>";
								} else if (param.parameterValueType == 'HDFS'){
									inputStr +=		"<div class='btn_wrap'><button class='btn btn_line_gray' id='input"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>열기</button></div>";
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
									inputStr +=			"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		inputStr +=		"</div>";
								} 

								inputStr += 	"</div>";
								inputStr += "</div>";
							});
						}
						else {
							inputStr = "<div class='para-cont-item'>";
							inputStr += 	"<span class='no_data'>No Data</span>";
							inputStr += "</div>";
						}
						$("#tab1").html(inputStr);

						// 노드 클릭 시 우측 활성화 창 : 노드설정 탭 - OUTPUT 탭
						var outputStr = "";
						if(node.parameter.parameterOutputSize > 0){
							$.each(node.parameter.parameterOutput, function(param_index, param){
								var isRequire = param.isRequire ? "True": "False";
								outputStr += "<div class='para-cont-item'>";
								outputStr += 	"<div><span>Name</span><span>" + param.parameterName + "</spna></div>";
								outputStr += 	"<div><span>Required</span><span class='boolean_icon boolean_" + param.isRequire + "'>" + isRequire + "</span></div>";
								outputStr +=	"<div><span>Type</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueType + "</span></div>";
								outputStr += 	"<div class='para_value'>";
								outputStr += 		"<label for='output" + node_index + param_index + "Value' class=''>Value</label>";
								outputStr +=		"<input type='text' name='output" + node_index + param_index + "Value' id='output" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " readonly/>";
								
								if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
									outputStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='output"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>열기</button></div>";
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
									outputStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		outputStr +=	"</div>";
								} else if (param.parameterValueType == 'HDFS'){
									outputStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='output"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>열기</button></div>";
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
									outputStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		outputStr +=	"</div>";
								}
								
								outputStr += 	"</div>";
								outputStr += "</div>";
							});
						}
						else {
							outputStr = "<div class='para-cont-item'>";
							outputStr += 	"<span class='no_data'>No Data</span>";
							outputStr += "</div>";
						}
						$("#tab2").html(outputStr);

						// 노드 클릭 시 우측 활성화 창 : 노드설정 탭 - OPTION 탭
						var optionStr = "";
						if(node.parameter.parameterOptionSize > 0){
							$.each(node.parameter.parameterOption, function(param_index, param){
								var isRequire = param.isRequire ? "True": "False";
								optionStr += "<div class='para-cont-item'>";
								optionStr += 	"<div><span>Name</span><span>" + param.parameterName + "</spna></div>";
								optionStr += 	"<div><span>Required</span><span class='boolean_icon boolean_" + param.isRequire + "'>" + isRequire + "</span></div>";
								optionStr +=	"<div><span>Type</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueType + "</span></div>";
								optionStr += 	"<div class='para_value'>";
								optionStr += 		"<label for='option" + node_index + param_index + "Value' class=''>Value</label>";
								optionStr +=			"<input type='text' name='option" + node_index + param_index + "Value' id='option" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " readonly/>";
								
								if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
									optionStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='option"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>열기</button></div>";
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
									optionStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		optionStr +=	"</div>";
								} else if (param.parameterValueType == 'HDFS'){
									optionStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='option"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>열기</button></div>";
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
									optionStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		optionStr +=	"</div>";
								}
								
								optionStr += 	"</div>";
								optionStr += "</div>";
							});
						} 
						else {
							optionStr = "<div class='para-cont-item'>";
							optionStr += 	"<span class='no_data'>No Data</span>";
							optionStr += "</div>";
						}
						$("#tab3").html(optionStr);
						
						// 노드 클릭 시 우측 활성화 창 : 노드설정 탭 - 노드 실행(정지) 버튼 설정
						var nodeRunStr = "";
						nodeRunStr += "<input type='hidden' value='" + node.nodeID + "'>";
						nodeRunStr += "<input type='hidden' value='" + data.pipelineData.workspaceName + "'>";
						nodeRunStr += "<input type='hidden' value='" + data.pipelineData.pipelineName + "'>";
						nodeRunStr += "<input type='hidden' value='" + data.pipelineData.pipelineID + "'>";
						nodeRunStr += "<input type='hidden' value='" + data.pipelineData.owner + "'>";
						nodeRunStr += "<input type='hidden' value='" + data.pipelineData.rawID + "'>";
						nodeRunStr += "<button class='btn btn_skyblue btn_excute' id='runSubTask" + node_index + "Btn' onclick='runSubTask(this);'>노드 실행</button>";
						nodeRunStr += "<button class='btn btn_black btn_stop' id='stopSubTask" + node_index + "Btn' onclick='stopSubTask(this);'>노드 정지</button>";
						nodeRunStr += "<button class='btn btn_gray btn_del' onclick='deleteSelected(this)'>노드 삭제</button>";
						$(".node_btn_g").html(nodeRunStr);
						
						var nodeStatus = node.nodeData.status == "init" ? "wait" : node.nodeData.status;
						if ( nodeStatus != "run" ) {
							$("#runSubTask" + node_index + "Btn").removeClass("Dis_none");
							$("#stopSubTask" + node_index + "Btn").addClass("Dis_none");
						}
						else {
							$("#runSubTask" + node_index + "Btn").addClass("Dis_none");
							$("#stopSubTask" + node_index + "Btn").removeClass("Dis_none");
						}

					}	//end - if(operatorId.replace("node_","") == node.nodeData.nodeName)														
				});

				// 로딩 박스 숨기기
				$("#loadingBox").hide();
				// 우측 데이터 영역 보임.
				$(".right-wrap").children("div").eq(1).removeClass("Dis_none");				
			}	//if(data.nodeSize > 0):end 
		},		
		onOperatorUnselect : function(operatorId) {
			$('#pipeline_con').flowchart('removeClassOperator',operatorId,"selected");
		},
		onAfterChange : function(changeType){
		  // alert('onAfterChange() : ' + changeType);
		},
		onLinkCreate : function(linkID, linkData){
			/** 2022.10.14, ninesoft, jhkim ==>  if(linkID.length > 4 && linkID.substr(0,4) == "link") : linkID.length == undefined로 로직을 탈 수 없어서 삭제함 */
			let linkIdStr = linkID + "";
						
			/** 새로고침 또는 초기 데이터를 그릴 때 발생하는 이벤트와 신규로 노드 생성 시 발생하는 이벤트를 구분하기 위한 부분 */
			if((linkIdStr.substr(0,4)) == "link") {
				return true;
			}
												
			/** 신규 링크 생성 */
			let newLink = pipeDesign_createLink(linkData);

																																			
			/** 신규 링크 추가 */
																																		
			console.log('[:::::::::: onLinkCreate : function(linkID, linkData) :::::::::::::::::]');
			console.log('[create link info]');			
			console.log(newLink);		

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

	// after에서.. 여기로..
	minimapSet();

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

//		setVal = $("input:radio[name="+val+"]:checked").val().replace('/BiO/rapidant/data/group/AnonymousGroup','');
		setVal = $("input:radio[name="+val+"]:checked").val().replace('/BiO/K-BDS/USER','');
	} else {

	}


	if(setVal != undefined){
		$('#'+val+'ValueView').val(setVal);
		$('#'+val+'Value').val(setVal);
	}
	$(".browserBox").hide();
	$(".bg_opacity1").hide();
	
//	var pipeline_data = currentPipeline;
//	console.log(pipeline_data);

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
	
//	currentPipeline = pipeline_data;
//	showSelectedPipeline();

}

function closeGBoxBrowser(){
	$(".browserBox").hide();
	$(".bg_opacity1").hide();
}

//파이프라인 모식도
// 관리자 > 파이프라인 > Regist Management 에서 사용 중.
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
		canUserEditLinks: false,		// 링크 수정 가능 여부 (default: true)
		canUserMoveOperators: false,			// 노드 이동 가능 여부 (default: true)
		onOperatorSelect: function(operatorId){	//노드 상단 클릭 이벤트

			return;
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

/**
	    -- jquery.flowchart : 매뉴얼 : https://github.com/sdrdis/jquery.flowchart --
	    -- 					: 예제  : http://sebastien.drouyer.com/jquery.flowchart-demo/
	    ====== 옵션 =====
	     
		1. canUserEditLinks(기본값: true)
		 가. 커넥터를 클릭하여 링크 추가 가능
		
		2. canUserMoveOperators
		 가. 드래그 앤 드롭을 이용하여 노드(operator) 이동 가능
		 
		3. data (default: {}) : 노드(operator, 연산자)와 링크를 정의하는 초기화 데이터	

	     가. operators : 연산자(노드), 플로우 차트에서 연산자를 정의하는 해시 값, 키 : operators ID  	       

	      1) operator(노드, 연산자) 정보
	        가) top  (단위 px)
	        나) left (단위 px)
	        다) type (옵션) : 노드(연산자)의 타입 -> data.operatorTypes 참고
	        라) properties (속성)
	         (1) title
	         (2) body 
	         (3) uncontained(옵션, 기본값: false) : true 설정 시 연산자를 컨테이너 외부로 이동할 수 있음
	         (4) class : css classes가 노드 DOM 객체(operator DOM object)에 추가 되어있음. 정의하지 않았을 경우 defaultOperatorClass와 동일함
	         (5) inputs : Box(노드)의 입력 커넥터를 정의하는 해시, 키 connectors ID를 정의, 커넥터 정보는 아래 항목을 정의한다.
	          (가) label : 커넥터 라벨, 커넥터가 여러개인 경우  '(:i)'는 서브 커넥터 ID로 변경
	          (나) multipleLinks(옵션) : true 설정 시 커넥터(connector)에 대한 여러 링크 허용 
	          (다) multiple(옵션) : true 설정 시 커넥터에 링크가 생성될 때마다 서브커넥터가 자동 생성 (다중 커넥터 데모 참조) 
	         (6) outputs : Box(노드)의 출력 커넥터를 정의하는 해시, 구조는 inputs와 동일함

	     나. links : 플로우차트(flow chart)에서 operator(노드, 연산자)간의 링크를 정의하는 해시, 키 : link ID
	     
	      1) link 정보
	        가) fromOperator : 노드(연산자) 아이디 - 링크의 출처 (source)
	        나) fromConnector : 커넥터 ID - 링크가 나오는 곳 (source)
	        다) fromSubConnector(옵션) : 다중 커넥터인 경우 서브 커넥터 ID - 링크가 나오는 곳 (source)
	        라) toOperator : 링크가 연결되는 연산자 ID (desctination)
	        마) toConnector : 링크가 연결되는 커넥터의 ID (desctination)
	        바) toSubConnector(옵션) : 다중 커넥터인 경우 서브 커넥터 ID - 링크가 연결되는 ID (desctination)
	        사) color : 링크의 색, 기본 값 : defaultLinkColor 동일

	     다. operatorTypes(옵션) : 속성의 key를 반복하지 않도록 공통 연산자 유형을 정의할 수 있는 해시 값
	      - Key는 노드(연산자)의 타입 ID를 정의
	      - Value는 properties(속성)을 정의 (data.operators.properties와 동일한 구조).
	      
		4. verticalConnection(기본값: false) : 수직 연결된 플로우차트 작성 가능 여부, 레이아웃이 손상될 수 있으므로 여러 커넥터 사용 금지
		5. distanceFromArrow (default: 3): ouput 커넥터와 link 사이의 거리
		6. defaultLinkColor (default: '#3366ff'): 링크 기본 색상
		7. defaultSelectedLinkColor (default: 'black'): 선택된 링크의 기본 색상
		8. defaultOperatorClass (default: 'flowchart-default-operator'): Default class of  the operator DOM element.		
		9. linkWidth (default: 11): Width of the links.
		10. grid (default: 20): 이동 했을 때의 노드(연산자)의 그리드, 값 0 설정 시 그리드 비활성화
		11. multipleLinksOnInput (default: false): 동일한 input 커넥터에 여러 링크 허용
		12. multipleLinksOnOutput (default: false): 동일한 output 커넥터에 여러 링크 허용
		13. linkVerticalDecal (default: 0): 링크를 수직 디코딩(정렬?)할 수 있음. (CSS를 재정의하고 링크가 해당 커넥터와 더이상 정렬되지 않은 경우)
		14. 콜백 메소드(이벤트 핸들 메소드)

		 (1) onOperatorSelect (default: function returning true)
		  - 조건 : 노드(연산자) 선택 시 호출
		  - 매개변수 :
		    - operatorId - 노드(연산자) ID		   
		  - 반환 : true/false 
		  - false 반환 시 선택 항목이 취소 됨
		  		  		 
		 (2) onOperatorUnselect (default: function returning true)		  		 
		  - 조건 : 노드(연산자) 선택하지 않으면 호출
		  - 매개변수 :		  
		  - 반환 : true/false 
		  - false 반환 시 선택 항목이 취소 됨
		  
		 (3) onOperatorMouseOver (default: function returning true)
		  - 조건 : 마우스 포인터가 노드(연산자)를 입력(호버?)하면 호출 
		  - 매개변수 :
		    - operatorId - 노드(연산자) ID		  	  
		  - 반환 : true/false 
		  - false 반환 시 선택 항목이 취소 됨		 
		
		 (4) onOperatorMouseOut (default: function returning true)			      
		  - 조건 : 마우스 포인터가 노드(연산자)를 벗어나면 호출 
		  - 매개변수 :		  	 
		  - 반환 : true/false 
		  - false 반환 시 선택취소가 취소됨	      
	      
	     (5) onLinkSelect (default: function returning true)  
		  - 조건 : 링크를 선택하면 호출 
		  - 매개변수 :		  	 
		    - linkId - 링크 ID		  
		  - 반환 : true/false 
		  - false 반환 시 선택 항목이 취소 됨	      
		  
		 (6) onLinkUnselect (default: function returning true)
		  - 조건 : 링크를 선택하지 않으면 호출 
		  - 매개변수 :		  	 		    		 
		  - 반환 : true/false 
		  - false 반환 시 선택취소가 취소 됨		 
		  
		 (7) onOperatorCreate (default: function returning true)
		  - 조건 : 노드(연산자)를 생성하면 호출 
		  - 매개변수 :		  	 
		    - operatorId - 노드(연산자) 아이디
		    - operatorData - 노드(연산자) 데이터
		    - fullElement - 노드(연산자)의 DOM 요소를 포함하는 해시 값
		     1) operator: 모든 노드(연산자)의 DOM 요소 
		     2) title : 연산자 제목에 대한 DOM 요소
		     3) connectorArrows : 커넥터 화살표에 대한 DOM 요소
		     4) connectorSmallArrows : 커넥터의 작은 화살표에 대한 DOM 요소		    		    		    		  		    		
		  - 반환 : true/false 
		  - false 반환 시 생성이 취소 됨	      
	      
	     (8) onOperatorDelete (default: function returning true)
		  - 조건 : 연산자 삭제 시 호출 
		  - 매개변수 :	
		    - operatorId - 노드(연산자) 아이디		  	  	 		    		 
		  - 반환 : true/false 
		  - false 반환 시 삭제가 취소 됨      
	        
	     (9) onLinkCreate (default: function returning true):
		  - 조건 : 링크가 생성되면 호출 
		  - 매개변수 :	
		    - linkId - 링크 아이디		  	  	 		    		 
		    - linkData - 링크 데이터		    
		  - 반환 : true/false 
		  - false 반환 시 생성이 취소 됨	      	        
		 
		 (10) onLinkDelete (default: function returning true) 
		  - 조건 : 링크가 삭제되면 호출 
		  - 매개변수 :	
		    - linkId - 링크 아이디		  	  	 		    		 
		    - forced - 연산자 삭제 중에 발생하므로 링크 삭제를 취소할 수 없음		    
		  - 반환 : true/false 
		  - false 반환 시 삭제가 취소 됨
		  
		 (11) onOperatorMoved (default: function)	      
		  - 조건 : 노드(연산자)를 이동시키면 호출 
		  - 매개변수 :	
		    - operatorId - 노드(연산자) 아이디		  	  	 		    		 
		    - position - 노드(연산자)의 신규 위치		

		 (12) onAfterChange (default: function)    
		  - 조건 : 수정사항(예: 연산자 생성)이 발생하면 호출
		  - 매개변수 :	
			- changeType : 발생된 변화, 다음 문자열 중 하나	 
	         1) operator_create
	         2) link_create
	         3) operator_delete
	         4) link_delete
	         5) operator_moved
	         6) operator_title_change
	         7) operator_body_change
	         8) operator_data_change
	         9) link_change_main_color
	         
	         
	    ====== 이벤트 =====	
	    1. 동등 이벤트 : 
	    - 모든 콜백메소드(이름이 on으로 시작하는 옵션, 위의 내용)에는 이벤트 대응 기능이 있음
	    
	    --------------------------------------------------------------
	    - e.g : onOperatorSelect(operatorId)	    
	    ---------------------------------------------------------------
	    (1) onOperatorSelect (default: function returning true)
		  - 조건 : 노드(연산자) 선택 시 호출
		  - 매개변수 :
		    - operatorId - 노드(연산자) ID		   
		  - 반환 : true/false 
		  - false 반환 시 선택 항목이 취소 됨
	    ---------------------------------------------------------------
	    >> $(flowchartEl)를 이용하여 처리할 수 있는 동등한 이벤트 존재
	    >> jquery.flowchart.js에 해당 이벤트가 정의
	    >> onOperatorSelect()가 false를 반환하지 않으면 이벤트 처리를 하도록 되어 있음
	    >> 최종 반환 값 : returnHash['result']
	    >> 모든 콜백에 적용
	    
	    // 동등 이벤트 (jquery.flowchart.js)
	     selectOperator: function (operatorId) {
            if (!this.callbackEvent('operatorSelect', [operatorId])) {
                return;
            }
            this.unselectLink();
            this._removeSelectedClassOperators();
            this._addSelectedClass(operatorId);
            this.selectedOperatorId = operatorId;
        }, 
	    
	    	    	    	    	     	
		2. 노드(연산자) 관련 메소드

	     (1) createOperator(operatorId, operatorData) : 노드 생성  	       
         (2) addOperator(operatorData) : 노드 생성, createOperator() 동일하지만 ID를 자동생성해준다.
         (3) deleteOperator(operatorId) : 노드 삭제
		 (4) getSelectedOperatorId() : 선택된 노드의 ID를 획득한다. 그렇지 않은 경우 null 반환
		 (5) selectOperator(operatorId) : operatorId에 해당하는 노드를 선택한다.
		 (6) unselectOperator() : 노드 선택을 취소한다.
		 (7) addClassOperator(operatorId, className) : operatorId에 해당하는 노드에 className을 추가한다.
		 (8) removeClassOperator(operatorId, className) : operatorId에 해당하는 노드에 className을 제거한다.
	     (9) removeClassOperators(className) : 모든 노드에 className을 제거한다.
	     (10) setOperatorTitle(operatorId, title) : operatorId 해당하는 노드에 title을 설정한다.
	     (11) setOperatorBody(operatorId, body) : operatorId 해당하는 노드에 body를 설정한다.	     
	     (12) getOperatorTitle(operatorId): operatorId 해당하는 노드의 title 반환
	     (13) getOperatorBody(operatorId): operatorId 해당하는 노드의 body 반환
	     (14) doesOperatorExists(operatorId): operatorId 해당하는 노드가 존재하는지 확인
		 (15) setOperatorData(operatorId, operatorData): operatorId에 해당하는 데이터 변경 (커넥터의 이름을 변경하거나 제거할 경우)
		 (16) getOperatorData(operatorId): operatorId에 해당하는 data 반환
		 (17) getConnectorPosition(operatorId, connectorId): 커넥터의 위치를 반환
		 (18) getOperatorCompleteData(operatorData): ?
		 (19) getOperatorElement(operatorData): 컨테이너에 노드(연산자)가 추가되기 전에 연산자를 미리 보거나, 드래그 중에 표시할 수 있음
		 (20) getLinksFrom(operatorId): operatorId에 해당하는 노드(연산자)의 모든 링크가 포함된 배열을 반환 (input)
		 (22) getLinksTo(operatorId): operatorId에 해당하는 노드(연산자)의 모든 링크가 포함된 배열을 반환 (ouput)
		 (23) getOperatorFullProperties(operatorData): ? / 노드(연산자)타입이 정의되지 않은 경우 속성 키를 입력, 그렇지 않으면 속성 키가 작업자의 타입 속성과 함께 확장 됨(?)
		 
		3. 링크 관련 메소드
		
	     (1) createLink(linkId, linkData): 링크 생성
	     (2) addLink(linkData): 링크 추가, 추가된 링크 ID를 반환
	     (3) deleteLink(linkId): 링크 삭제
	     (4) getSelectedLinkId(): 선택된 링크의 아이디 반환(또는 null)
	     (5) selectLink(linkId): linkId에 해당하는 링크 선택
	     (6) unselectLink() : 선택된 링크 취소 (해제)
	     (7) setLinkMainColor(linkId, color): linkId에 해당하는 링크의 메인 컬러 설정
	     (8) getLinkMainColor(linkId): :  linkId에 해당하는 링크의 컬러 정보 반환
	     (9) colorizeLink(linkId, color): linkId에 해당하는 링크의 임시 색을 설정(클릭 시 강조 등..)
	     (10) uncolorizeLink(linkId): linkId에 해당하는 링크의 임시 색을 해제
	     (11) redrawLinksLayer(): 모든 링크를 다시 그림
	     
		4. Misc ?
		
		 (1) getData(): 플로우차트의 데이터 반환 (데이터 옵션과 동일한 구조)
		 (2) setData(data): 플로우 차트의 데이터 설정 (데이터 옵션과 동일한 구조)
		 (3) getDataRef(): 내부 시스템의 플로우 차트 데이터 반환 (?)
		 (4) setPositionRatio(positionRatio): 마우스 위치와 DOM 요소 사이의 비율 설정  
		  - positionRatio : 마우스 위치와 DOM 요소 사이의 비율
		  - 컨테이너 확대 시 사용
		 (5) getPositionRatio(): 마우스 위치와 DOM 요소 사이의 비율 반환
		 (6) deleteSelected(): 선택한 링크 또는 연산자를 삭제	   
		 
*/