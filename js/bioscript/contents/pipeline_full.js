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
				if ( category.isPublic ) {
					categoryList += "<li class='close' id='"+category.categoryID+"' onclick='getProgramSubCategory(this)'><span>"+category.categoryName+"</span></li>"
					categoryList += "<ul id='"+category.categoryID+"_sub' class='element_02'></ul>";
				}
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
					if ( category.isPublic ) {
						categoryList += "<li class='close' id='"+category.categoryID+"' onclick='getProgramListBySubCategory(this)'>"+category.categoryName+"</li>"
						categoryList += "<ul id='"+category.categoryID+"_sub' class='element_03'></ul>";
					}
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
						if ( program.isPublic ) {
							var scriptTypeStr = program.scriptType;
							var scriptTypeImg = "<img src='../new/img/pipeline/common/language/" + scriptTypeStr.toLowerCase() + ".png' class='lang_img'>";
	//						var scriptTypeImg = "<img src='../new/img/pipeline/common/language/" + program.scriptType + ".png' class='lang_img'>";
							//programList += "<li id='"+program.rawID+"' onclick='createOperate(this,\""+program.scriptType+"\")'>" + scriptTypeImg +program.programName+"</li>"
							programList += "<li id='"+program.rawID+"' onclick='pipeDesign_createNode(this,\""+program.scriptType+"\")'>" + scriptTypeImg +program.programName+"</li>"
						}
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
	
	// 실행중인 파이프라인 수정 불가 
	if ( isEnabledPipeline() && ( getTaskRunStat() == "run" || getTaskRunStat() == "exec" ) ) {
		swal({
			title: "",
			text: messageGPipelineNotEdit,
			confirmButtonText: buttonConfirm
		});
		return;
	}

//	const operatorId = $(el).attr("id");
	const operatorId = $(el).parent().siblings("h2").text();

	if(operatorId != null && operatorId != ""){
		
		swal({
			title: "",
			text: messageQRemoveNode,	
			showCancelButton: true,
			cancelButtonText: buttonCancel,
			confirmButtonText: buttonDelete
		}).then(function(result) {
			if (result) {
				
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
			} 
			else {
				return false;
			}
		});	

	} 
	else {
		$("#pipeline_con").flowchart('deleteSelected');
	}
	minimapSet();
}


// 다중 노드 삭제 
function deleteMultipleSelected() {

	swal({
		title: "",
		text: messageQDelNodes,		// [한글]
		showCancelButton: true,
		cancelButtonText: buttonCancel,
		confirmButtonText: buttonDelete
	}).then(function(result) {
		if (result) {
			
			var removeNodeIndexList = [];
			$.each(selectedNodes, function(index, node) {
		
				var operatorId = node;
				if(operatorId != null && operatorId != ""){
			
					$("#pipeline_con").flowchart('deleteOperator',operatorId);
					$('#pipeline_con').flowchart('removeClassOperators',"selected");
					
					$.each(pipeline_data.node, function(node_index, node){
						if(node.nodeData != null){
							if(operatorId.replace("node_","") == node.nodeData.nodeName){
								removeNodeIndexList.push(node_index);
							}
						} else {
							if(operatorId.replace("node_","") == node.programData.programName){
								removeNodeIndexList.push(node_index);
							}
						}
					});	
				} 
			});
			
			// 배열 정렬 후 저장한 index의 데이터 삭제 
			if ( removeNodeIndexList.length > 0 ) {
				removeNodeIndexList.sort(function(a,b){ return b - a; });
				$.each(removeNodeIndexList, function(idx, nodeIndex) {
					pipeline_data.node.splice(nodeIndex, 1);
				})
			}
			
		} 
		else {
			return false;
		}
	});	
			
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
//	console.log(pipeline_data);
//	console.log(data);

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

// 다중 노드 이동 테스트:s
var selectedNodesObj;
var nodesDraggableOptions = {
    start: function(event, ui) {
        //get all selected...
        if (ui.helper.hasClass('selected')) selectedNodesObj = $('div.selected');
        else {
            selectedNodesObj = $(ui.helper);
            $('div.selected').removeClass('selected')
        }
    },
    drag: function(event, ui) {
        var currentLoc = $(this).position();
        var prevLoc = $(this).data('prevLoc');
        if (!prevLoc) {
            prevLoc = ui.originalPosition;
        }

        var offsetLeft = currentLoc.left-prevLoc.left;
        var offsetTop = currentLoc.top-prevLoc.top;

        moveSelectedNodes(offsetLeft, offsetTop);
        $(this).data('prevLoc', currentLoc);
    },
    stop: function(event, ui) {
		$("#pipeline_con").flowchart("redrawLinksLayer");
	}
};

function moveSelectedNodes(ol, ot){
//    console.log("moving to: " + ol + ":" + ot);
    selectedNodesObj.each(function(){
        $this =$(this);
        var position = $this.position();
        var left = position.left;
        var top = position.top;
        var operatorId = $(this).data('operator_id');
//        console.log({id: operatorId, l: l, t: t});

        $this.css('left', left+ol);
        $this.css('top', top+ot);
        
        $("#pipeline_con").flowchart("getData").operators[operatorId].top = top;
        $("#pipeline_con").flowchart("getData").operators[operatorId].left = left;
        
        $("#pipeline_con").flowchart("getDataRef").operators[operatorId].top = top;
        $("#pipeline_con").flowchart("getDataRef").operators[operatorId].left = left;
        
        for (var linkId in  $("#pipeline_con").flowchart("getData").links) {
            if ( $("#pipeline_con").flowchart("getData").links.hasOwnProperty(linkId)) {
                var linkData =  $("#pipeline_con").flowchart("getData").links[linkId];
                if (linkData.fromOperator == operatorId || linkData.toOperator == operatorId) {
//    			    _refreshLinkPositions(linkId);
					$("#pipeline_con").flowchart("refreshLinkPositions", linkId);
                }
            }
        }
                
    })
}
// 다중 노드 이동 테스트:e


/**
 * 파이프라인 디자인 화면(모눈종이 화면)을 구성한다. (그린다)
 */
var selectedNodes = [];	// 다중 노드 선택을 위한 배열 
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
//			console.log('[Event][onOperatorSelect] 노드 상단 클릭');	
			$('#pipeline_con').flowchart('removeClassOperators',"selected");
			$('#pipeline_con').flowchart('addClassOperator',operatorId,"selected");

			selectedNodes = [];
			selectedNodes.push(operatorId);
//			// 기존 선택된 노드가 있는 경우
//			if ( selectedNodes.length > 0 ) {
//				// 지금 선택된 노드 id가 이미 배열에 있는경우 
//				if ( ($.inArray(operatorId, selectedNodes)) > -1 ) {
//					// 단일 노드 선택
//					if ( !window.event.ctrlKey ) {
//						var nodeCnt = selectedNodes.length;
//						selectedNodes = [];
//						if ( nodeCnt > 1 ) {
//							selectedNodes.push(operatorId);	
//						}
//					}
//					// 다중 노드 선택
//					else {
//						selectedNodes.splice($.inArray(operatorId, selectedNodes), 1);	
//					}
//				}
//				else {
//					// 단일 노드 선택
//					if ( !window.event.ctrlKey ) {
//						selectedNodes = [];
//					}
//					selectedNodes.push(operatorId);	
//				}
//			}			
//			// 노드 최초 선택
//			else {
//				// 단일 노트 선택
//				if ( !window.event.ctrlKey ) {
//					selectedNodes = [];
//				}
//				selectedNodes.push(operatorId);
//			}	
//
//			// selected 상태로 css 변경 
//			$.each(selectedNodes, function(idx, selectedNode) {
//				$('#pipeline_con').flowchart('addClassOperator',selectedNode,"selected");		
//			});
//			
//			// 다중노드 이동 이벤트 
//			$('.selected').draggable(nodesDraggableOptions);
			
			var exsistChk = false;
			if(data.nodeSize > 0) {
				
				// 로딩 박스 표출
				$("#loadingBox").show();
				
				$.each(data.node, function(node_index, node){
																																					
					if(operatorId.replace("node_","") == node.nodeData.nodeName){

						// (우측) 노드 설정 타이틀 세팅
						$("h2[name=nodeId]").attr("class", "h_side h_node_" + (node.nodeData.scriptType).toLowerCase());
						$("h2[name=nodeId]").children("span").text(operatorId);
						$("h2[name=nodeId]").siblings("div.status-item").children("span").text(node.nodeData.status);
						$("h2[name=nodeId]").siblings("div.status-item").children("span").attr("class", "status_icon2 status_" + node.nodeData.status);
						
						// (우측) 실행기록 리스트 세팅 
//						console.log(node);
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
								inputStr += 	"<div><span>"+nodeCol4+"</span><span>" + param.parameterName + "</spna></div>";
								inputStr += 	"<div><span>"+nodeCol5+"</span><span class='boolean_icon boolean_" + param.isRequire + "'>" + isRequire + "</span></div>";
								var parameterValueTypeStr = param.parameterValueType;
								if ( parameterValueTypeStr == "Folder" ) parameterValueTypeStr = nodeCol6Item1;
								else if ( parameterValueTypeStr == "File" ) parameterValueTypeStr = nodeCol6Item2;
//								inputStr +=		"<div><span>유형</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueType + "</span></div>";
								inputStr +=		"<div><span>"+nodeCol6+"</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + parameterValueTypeStr + "</span></div>";
								inputStr += 	"<div class='para_value'>";
								inputStr += 		"<label for='input" + node_index + param_index + "Value' class=''>"+nodeCol7+"</label>";

								// 파라미터 타입이 Folder,File,HDFS가 아닌 경우 사용자가 입력하려 수정 가능.
								if ( parameterValueTypeStr != "Folder" && parameterValueTypeStr != "File" && parameterValueTypeStr != "HDFS" ) {
									inputStr +=		"<input type='text' name='input" + node_index + param_index + "Value' id='input" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " onchange='modifyPipelineData(this,\""+node.nodeID+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\")'>";
								}
								// 파라미터 타입이 Folder,File,HDFS인 경우, GBox Browser 사용하여 수정 가능.
								else {
									inputStr +=		"<input type='text' name='input" + node_index + param_index + "Value' id='input" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " readonly/>";
								}
								
								// fs_content.css 사용중
								if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
									inputStr +=		"<div class='btn_wrap'><button class='btn btn_line_gray' id='input"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>"+buttonOpen+"</button></div>";
									inputStr +=		"<div class='browserBox uploadBox'>";
					        		inputStr +=			"<h4 class='tit'>GBox Web Browser</h4>";
						        	inputStr +=			"<div class='box'>";
						        	
									//20230612 BSI 첨부파일 업로드영역 추가						        	 	
									inputStr +=		"<table class='tstyle_write tableA' style='margin-bottom: 5px;'>"
									inputStr +=			"<caption></caption>";
									inputStr +=			"<thead>";
									inputStr +=				"<tr>";
									inputStr +=					"<th scope='row'>";
									inputStr +=						"<label aria-label='"+dataFileTransfer+"'>"+dataFileTransfer+"</label>";
									inputStr +=					"</th>";
									inputStr +=				"</tr>";
									inputStr +=			"</thead>";
									inputStr +=			"<tr id='kupload_foler'></tr>";
									inputStr +=		"</table>";
						        	
									inputStr +=				"<div class='table_box'>";
									inputStr +=					"<div id='input"+node_index+param_index+"Selected'></div>"
									inputStr +=					"<table id='' class='tableA treegrid_tb sort_table'>";
									inputStr +=						"<caption></caption>";
									inputStr +=						"<colgroup>";
									inputStr +=							"<col style='width:50px;'>";
									inputStr +=							"<col>";
									inputStr +=							"<col style='width:10.0rem;'>";
									inputStr +=							"<col style='width:15.0rem;'>";
									inputStr +=						"</colgroup>";
									inputStr +=						"<thead>";
									inputStr +=							"<tr>";
									inputStr +=							"<th></th>";
									inputStr +=							"<th>" + gboxBrowserCol1
									inputStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									inputStr +=							"</th>";
									inputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
									inputStr +=							"<th>" + gboxBrowserCol3
									inputStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									inputStr +=							"</th>";
									inputStr +=							"</tr>";
									inputStr +=						"</thead>";
									inputStr +=						"<tbody id='input"+node_index+param_index+"Browser'>";
									inputStr +=						"</tbody>";
									inputStr +=					"</table>";
									inputStr +=				"</div>";
									inputStr +=				"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"input"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button>"+"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";	
						        	inputStr +=			"</div>";
									//inputStr +=			"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		inputStr +=		"</div>";
								} else if (param.parameterValueType == 'HDFS'){
									inputStr +=		"<div class='btn_wrap'><button class='btn btn_line_gray' id='input"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>"+buttonOpen+"</button></div>";
									inputStr +=		"<div class='browserBox'>";
					        		inputStr +=			"<h4 class='tit'>HDFS Web Browser</h4>";
						        	inputStr +=			"<div class='box'>";
									inputStr +=				"<div class='table_box'>";
									inputStr +=					"<div id='input"+node_index+param_index+"Selected'></div>"
									inputStr +=					"<table id='' class='tableA treegrid_tb sort_table'>";
									inputStr +=						"<caption></caption>";
									inputStr +=						"<colgroup>";
									inputStr +=							"<col style='width:50px;'>";
									inputStr +=							"<col>";
									inputStr +=							"<col style='width:10.0rem;'>";
									inputStr +=							"<col style='width:15.0rem;'>";
									inputStr +=						"</colgroup>";
									inputStr +=						"<thead>";
									inputStr +=							"<tr>";
									inputStr +=							"<th></th>";
									inputStr +=							"<th>" + gboxBrowserCol1
									inputStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									inputStr +=							"</th>";
									inputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
									inputStr +=							"<th>" + gboxBrowserCol3
									inputStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"input"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									inputStr +=							"</th>";
									inputStr +=							"</tr>";
									inputStr +=						"</thead>";
									inputStr +=						"<tbody id='input"+node_index+param_index+"Browser'>";
									inputStr +=						"</tbody>";
									inputStr +=					"</table>";
									inputStr +=				"</div>";
									inputStr +=				"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"input"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button>"+"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";	
						        	inputStr +=			"</div>";
									//inputStr +=			"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
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
								outputStr += 	"<div><span>"+nodeCol4+"</span><span>" + param.parameterName + "</spna></div>";
								outputStr += 	"<div><span>"+nodeCol5+"</span><span class='boolean_icon boolean_" + param.isRequire + "'>" + isRequire + "</span></div>";
								parameterValueTypeStr = param.parameterValueType;
								if ( parameterValueTypeStr == "Folder" ) parameterValueTypeStr = nodeCol6Item1;
								else if ( parameterValueTypeStr == "File" ) parameterValueTypeStr = nodeCol6Item2;
//								outputStr +=	"<div><span>유형</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueType + "</span></div>";
								outputStr +=	"<div><span>"+nodeCol6+"</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + parameterValueTypeStr + "</span></div>";
								outputStr += 	"<div class='para_value'>";
								outputStr += 		"<label for='output" + node_index + param_index + "Value' class=''>"+nodeCol7+"</label>";
								
								// 파라미터 타입이 Folder,File,HDFS가 아닌 경우 사용자가 입력하려 수정 가능.
								if ( parameterValueTypeStr != "Folder" && parameterValueTypeStr != "File" && parameterValueTypeStr != "HDFS" ) {
									outputStr +=	"<input type='text' name='output" + node_index + param_index + "Value' id='output" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " onchange='modifyPipelineData(this,\""+node.nodeID+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\")'>";
								}
								// 파라미터 타입이 Folder,File,HDFS인 경우, GBox Browser 사용하여 수정 가능.
								else {
									outputStr +=	"<input type='text' name='output" + node_index + param_index + "Value' id='output" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " readonly/>";
								}
								
								if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
									outputStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='output"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>"+buttonOpen+"</button></div>";
									outputStr +=	"<div class='browserBox'>";
					        		outputStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
						        	outputStr +=		"<div class='box'>";
									outputStr +=			"<div class='table_box'>";
									outputStr +=				"<div id='output"+node_index+param_index+"Selected'></div>"
									outputStr +=				"<table id='' class='tableA treegrid_tb sort_table'>";
									outputStr +=					"<caption></caption>";
									outputStr +=					"<colgroup>";
									outputStr +=						"<col style='width:50px;'>";
									outputStr +=						"<col>";
									outputStr +=						"<col style='width:10.0rem;'>";
									outputStr +=						"<col style='width:15.0rem;'>";
									outputStr +=					"</colgroup>";
									outputStr +=					"<thead>";
									outputStr +=						"<tr>";
									outputStr +=							"<th></th>";
									outputStr +=							"<th>" + gboxBrowserCol1
									outputStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									outputStr +=							"</th>";
									outputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
									outputStr +=							"<th>" + gboxBrowserCol3
									outputStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									outputStr +=							"</th>";
									outputStr +=						"</tr>";
									outputStr +=					"</thead>";
									outputStr +=					"<tbody id='output"+node_index+param_index+"Browser'>";
									outputStr +=					"</tbody>";
									outputStr +=				"</table>";
									outputStr +=			"</div>";
									outputStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"output"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button>"+"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";	
						        	outputStr +=		"</div>";
									//outputStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		outputStr +=	"</div>";
								} else if (param.parameterValueType == 'HDFS'){
									outputStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='output"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>"+buttonOpen+"</button></div>";
									outputStr +=	"<div class='browserBox'>";
					        		outputStr +=		"<h4 class='tit'>HDFS Web Browser</h4>";
						        	outputStr +=		"<div class='box'>";
									outputStr +=			"<div class='table_box'>";
									outputStr +=				"<div id='output"+node_index+param_index+"Selected'></div>"
									outputStr +=				"<table id='' class='tableA treegrid_tb sort_table'>";
									outputStr +=					"<caption></caption>";
									outputStr +=					"<colgroup>";
									outputStr +=						"<col style='width:50px;'>";
									outputStr +=						"<col>";
									outputStr +=						"<col style='width:10.0rem;'>";
									outputStr +=						"<col style='width:15.0rem;'>";
									outputStr +=					"</colgroup>";
									outputStr +=					"<thead>";
									outputStr +=						"<tr>";
									outputStr +=							"<th></th>";
									outputStr +=							"<th>" + gboxBrowserCol1
									outputStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									outputStr +=							"</th>";
									outputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
									outputStr +=							"<th>" + gboxBrowserCol3
									outputStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"output"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									outputStr +=							"</th>";
									outputStr +=						"</tr>";
									outputStr +=					"</thead>";
									outputStr +=					"<tbody id='output"+node_index+param_index+"Browser'>";
									outputStr +=					"</tbody>";
									outputStr +=				"</table>";
									outputStr +=			"</div>";
									outputStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"output"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button>"+"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";	
						        	outputStr +=		"</div>";
									//outputStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		outputStr +=	"</div>";
								}
								
								outputStr += 	"</div>";
								outputStr += "</div>";
								
								
								// 실행기록 클릭 시 우측 하단 버튼 : 분석 결과 확인 및 다운로드
								var downRunStr = "";
								downRunStr += "<button class='btn btn_skyblue btn_check' id='downBtn' onclick='getUserGboxDown(\"down"+"\",\""+param.parameterValue+"\",\""+param.parameterValueType+"\",\""+"Y"+"\")'>"+checkResult+"</button>";	
								$("#down_btn_g").html(downRunStr);
								
								var downBoxStr = "";
								downBoxStr +=	"<div class='browserBox' id='downBox'>";
				        		downBoxStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
					        	downBoxStr +=		"<div class='box'>";
								downBoxStr +=			"<div class='table_box'>";
								downBoxStr +=				"<div id='downSelected'></div>"
								downBoxStr +=				"<table id='' class='tableA treegrid_tb sort_table'>";
								downBoxStr +=					"<caption></caption>";
								downBoxStr +=					"<colgroup>";
								downBoxStr +=						"<col style='width:50px;'>";
								downBoxStr +=						"<col>";
								downBoxStr +=						"<col style='width:10.0rem;'>";
								downBoxStr +=						"<col style='width:15.0rem;'>";
								downBoxStr +=					"</colgroup>";
								downBoxStr +=					"<thead>";
								downBoxStr +=						"<tr>";
								downBoxStr +=							"<th><input type='checkbox' name='downAll' value='' onclick='downCheckAll()'/></th>";
								downBoxStr +=							"<th>" + gboxBrowserCol1
								downBoxStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"down"+"\",\""+ param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"down"+"\",\""+ param.parameterValueType+"\",this);'>▼</button></li></ul>";
								downBoxStr +=							"</th>";
								downBoxStr +=							"<th>" + gboxBrowserCol2 + "</th>";
								downBoxStr +=							"<th>" + gboxBrowserCol3
								downBoxStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"down"+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"down"+"\",\""+ param.parameterValueType+"\",this);'>▼</button></li></ul>";
								downBoxStr +=							"</th>";
								downBoxStr +=						"</tr>";
								downBoxStr +=					"</thead>";
								downBoxStr +=					"<tbody id='downBrowser'>";
								downBoxStr +=					"</tbody>";
								downBoxStr +=				"</table>";
								downBoxStr +=			"</div>";
								downBoxStr +=			"<div class='s_txt'>※ "+agentInfo+"</div>";
								downBoxStr +=			"<div class='btn_box' style='padding-top: 0px'>";
								downBoxStr +=				"<button type='button' class='btn btn_black btn_down' onclick='fileDownload(\"agent\");'>" + fileDown1 + "</button>";
								downBoxStr +=				"<button type='button' class='btn btn_black btn_down' style='margin-left:0.8rem;' onclick='fileDownload(\"html5\");'>" + fileDown2 + "</button>";
								downBoxStr +=				"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";	
								downBoxStr +=			"</div>";
					        	downBoxStr +=		"</div>";
								//downBoxStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
				        		downBoxStr +=	"</div>";
								
								$("#down1").html(downBoxStr);
								
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
								optionStr += 	"<div><span>"+nodeCol4+"</span><span>" + param.parameterName + "</spna></div>";
								optionStr += 	"<div><span>"+nodeCol5+"</span><span class='boolean_icon boolean_" + param.isRequire + "'>" + isRequire + "</span></div>";
								parameterValueTypeStr = param.parameterValueType;
								if ( parameterValueTypeStr == "Folder" ) parameterValueTypeStr = nodeCol6Item1;
								else if ( parameterValueTypeStr == "File" ) parameterValueTypeStr = nodeCol6Item2;
//								optionStr +=	"<div><span>유형</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueTypeStr + "</span></div>";
								optionStr +=	"<div><span>"+nodeCol6+"</span><span class='parameter_icon parameter_" + param.parameterValueType + "'>" + param.parameterValueType + "</span></div>";
								optionStr += 	"<div class='para_value'>";
								optionStr += 		"<label for='option" + node_index + param_index + "Value' class=''>"+nodeCol7+"</label>";

								// 파라미터 타입이 Folder,File,HDFS가 아닌 경우 사용자가 입력하려 수정 가능.
								if ( parameterValueTypeStr != "Folder" && parameterValueTypeStr != "File" && parameterValueTypeStr != "HDFS" ) {
									optionStr +=	"<input type='text' name='option" + node_index + param_index + "Value' id='option" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " onchange='modifyPipelineData(this,\""+node.nodeID+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\")'>";
								}
								// 파라미터 타입이 Folder,File,HDFS인 경우, GBox Browser 사용하여 수정 가능.
								else {
									optionStr +=	"<input type='text' name='option" + node_index + param_index + "Value' id='option" + node_index + param_index + "Value' class='' value=" + param.parameterValue + " readonly/>";
								}
								
								if(param.parameterValueType == 'Folder' || param.parameterValueType == 'File'){
									optionStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='option"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>"+buttonOpen+"</button></div>";
									optionStr +=	"<div class='browserBox'>";
					        		optionStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
						        	optionStr +=		"<div class='box'>";
									optionStr +=			"<div class='table_box'>";
									optionStr +=				"<div id='option"+node_index+param_index+"Selected'></div>"
									optionStr +=				"<table id='' class='tableA treegrid_tb sort_table'>";
									optionStr +=					"<caption></caption>";
									optionStr +=					"<colgroup>";
									optionStr +=						"<col style='width:50px;'>";
									optionStr +=						"<col>";
									optionStr +=						"<col style='width:10.0rem;'>";
									optionStr +=						"<col style='width:15.0rem;'>";
									optionStr +=					"</colgroup>";
									optionStr +=					"<thead>";
									optionStr +=						"<tr>";
									optionStr +=							"<th></th>";
									outputStr +=							"<th>" + gboxBrowserCol1
									outputStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									outputStr +=							"</th>";
									outputStr +=							"<th>" + gboxBrowserCol2 + "</th>";
									outputStr +=							"<th>" + gboxBrowserCol3
									outputStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									outputStr +=							"</th>";
									optionStr +=						"</tr>";
									optionStr +=					"</thead>";
									optionStr +=					"<tbody id='option"+node_index+param_index+"Browser'>";
									optionStr +=					"</tbody>";
									optionStr +=				"</table>";
									optionStr +=			"</div>";
									optionStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"option"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button>"+"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";							
						        	optionStr +=		"</div>";
									//optionStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
					        		optionStr +=	"</div>";
								} else if (param.parameterValueType == 'HDFS'){
									optionStr +=	"<div class='btn_wrap'><button class='btn btn_line_gray' id='option"+node_index+param_index+"Btn' onclick='getUserGboxRoot(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\")'>"+buttonOpen+"</button></div>";
									optionStr +=	"<div class='browserBox'>";
					        		optionStr +=		"<h4 class='tit'>GBox Web Browser</h4>";
						        	optionStr +=		"<div class='box'>";
									optionStr +=			"<div class='table_box'>";
									optionStr +=				"<div id='option"+node_index+param_index+"Selected'></div>"
									optionStr +=				"<table id='' class='tableA treegrid_tb sort_table'>";
									optionStr +=					"<caption></caption>";
									optionStr +=					"<colgroup>";
									optionStr +=						"<col style='width:50px;'>";
									optionStr +=						"<col>";
									optionStr +=						"<col style='width:10.0rem;'>";
									optionStr +=						"<col style='width:15.0rem;'>";
									optionStr +=					"</colgroup>";
									optionStr +=					"<thead>";
									optionStr +=						"<tr>";
									optionStr +=							"<th></th>";
									optionStr +=							"<th>" + gboxBrowserCol1
									optionStr +=								"<ul class='sort_btn'><li><button id='name' name='desc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='name' name='asc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									optionStr +=							"</th>";
									optionStr +=							"<th>" + gboxBrowserCol2 + "</th>";
									optionStr +=							"<th>" + gboxBrowserCol3
									optionStr +=								"<ul class='sort_btn'><li><button id='modifiedDate' name='desc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▲</button></li><li><button id='modifiedDate' name='asc' onclick='sortingTable(\"option"+node_index+param_index+"\",\""+param.parameterValueType+"\",this);'>▼</button></li></ul>";
									optionStr +=							"</th>";
									optionStr +=						"</tr>";
									optionStr +=					"</thead>";
									optionStr +=					"<tbody id='option"+node_index+param_index+"Browser'>";
									optionStr +=					"</tbody>";
									optionStr +=				"</table>";
									optionStr +=			"</div>";
									optionStr +=			"<div class='btn_box'><button type='button' class='btn_bace' onclick='selectValue2(\"option"+node_index+param_index+"\",\""+param.parameterType+"\",\""+param.nodeID+"\",\""+param.parameterID+"\");'>" + buttonConfirm +"</button>"+"<button type='button' class='btn btn_gray' style='margin-left:0.8rem;' onclick='closeGBoxBrowser();'>" + buttonClose + "</button>"+"</div>";	
						        	optionStr +=		"</div>";
									//optionStr +=		"<a href='#none' class='closeBtn' id='browserCloseBtn' onclick='closeGBoxBrowser();'><img alt='창닫기' src='./../img/layout/close.png'></a>";
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
						nodeRunStr += "<button class='btn btn_skyblue btn_excute' id='runSubTask" + node_index + "Btn' onclick='runSubTask(this);'>"+buttonRunNode+"</button>";
						nodeRunStr += "<button class='btn btn_black btn_stop' id='stopSubTask" + node_index + "Btn' onclick='stopSubTask(this);'>"+buttonStopNode+"</button>";
						nodeRunStr += "<button class='btn btn_gray btn_del' id='deleteNodeBtn' onclick='deleteSelected(this)'>"+buttonRemoveNode+"</button>";
						$("#node_btn_g").html(nodeRunStr);
						
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
				
				if ( selectedNodes.length == 1 ) {
					// 우측 데이터 영역 보임.
					$(".right-wrap").children("div").eq(1).removeClass("Dis_none");	
				}	
				// 다중 노드 선택한 경우(또는 단일 노드 선택 해제한 경우) 우측 데이터 영역 숨김.
				else {
					$(".right-wrap").children("div").eq(1).addClass("Dis_none");	
				}	
					
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
			
			/** 이미 연결된 링크의 경우 링크가 추가되지 않도록 하단 로직을 타지 않게 한다. */
			/** bugfix_20221019_01_아웃풋타겟노드_중복 */			
			let checkOut = false;
									
			$.each(pipeline_data.node, function(node_index, node){
				
				if(node.parameter.parameterOutput[0].targetParamName != null) {
												
					if(node.nodeData.nodeName == linkData.fromOperator) {
						ouputConnSize = node.parameter.parameterOutput[0].targetParamName.length;
						for(let idx = 0; idx < ouputConnSize; idx++) {
							
							let outputTargetNm = node.parameter.parameterOutput[0].targetParamName[idx];
							if(outputTargetNm == linkData.toConnector.replace(/\|/gi, ":")) {							
								node.parameter.parameterOutput[0].targetParamName.splice(idx, 1);																					
							}
						}
					}				
				}
				
			});	
			
//			if(checkOut) {
//				checkOut = false;
//				return;
//			}
//			console.log(linkData);
//			console.log(pipeline_data);
										
			/** 신규 링크 생성 */
			pipeDesign_createLink(linkData);
			return true;													
		},
		onLinkDelete : function(linkId, forced){
			var data = $("#pipeline_con").flowchart('getData');
			var linkData = data.links[linkId];
//			console.log(isSelectedDeleteLink);
//			console.log(linkId);
			if ( isSelectedDeleteLink ) {
				$.each(pipeline_data.link, function(index, link){
					if(link != undefined){
						if(linkData.fromOperator == link.sourceName && linkData.toOperator == link.targetName){
							pipeline_data.link.splice(index,1);
							$.each(pipeline_data.node, function(index, node){
								if(node != undefined){
									// if ( link.sourceName == node.nodeData.programName ) {
									if ( link.sourceName == node.nodeData.nodeName ) {
										var output = node.parameter.parameterOutput;
										var outputTargetNames = output[0].targetParamName;
										if ( outputTargetNames && outputTargetNames.length > 0 ) {
											outputTargetNames.forEach(function(targetName, t_index) {
												if ( targetName.split(":")[0] == link.targetName ) {
													outputTargetNames.splice(t_index, 1);
													return;
												}
											});
										}
										
									}
								}
							});
							
							return false;
						}
					}
				});
			}
			else {
				$.each(pipeline_data.link, function(index, link){
					if(link != undefined){
						
						if(linkData.fromOperator == link.sourceName && linkData.toOperator == link.targetName){
						
							pipeline_data.link.splice(index,1);
																										
								/** 노드 정보 재설정 */
							$.each(pipeline_data.node, function(node_index, node){
								
								// 링크의 소스 노드 획득
								if(node.nodeID == link.sourceID) {
																								
									// 소스 노드의 node.parameter.parameterOutput[0].targetParamName[i] == linkId.toConnector
									let tpNameLength = node.parameter.parameterOutput[0].targetParamName.length;
									for(let idx = 0; idx < tpNameLength; idx++) {
										if(node.parameter.parameterOutput[0].targetParamName[idx] == linkData.toConnector.replace(/\|/gi, ":")) {
											node.parameter.parameterOutput[0].targetParamName.splice(idx,1);
										}
									}
									
								}													
							});	
													
						}
																	
					}
				});

			}
			
			return true;
		},
		onLinkSelect : function(linkId) {
			$('#pipeline_con').flowchart('colorizeLink',linkId,"blue");
			return true;
		}
    });

	// 파이프라인 초기 위치 설정
	$('#pipeline_con').attr("style","transform:matrix(1, 0, 0, 1, 0.5, 0.5); left:-2px; top:-2px;");


	// 2023.07.13 확대축소
	// 파이프라인 확대/축소 상태 유지를 위함:s
	$("#pipeline_con").flowchart("setPositionRatio", chartScale);
	onZoom();
	// 파이프라인 확대/축소 상태 유지를 위함:e
		

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

// 노드 설정 (Input/Output/Option 값 비었있을 경우 경고창 후 입력하도록 포커싱)
$(function() {
   $(document).on("focusout", "div.para_value > input", function(e) {
		if ( $(e.currentTarget).val().length < 1 ) {
			swal({
				title: "",
				text: messageGEnterValue,	// [한글]
				confirmButtonText: buttonConfirm
			}).then(function(){
				$(e.currentTarget).focus();
			});
		}
	});
})

// 노드 설정 (현재는 Input/Output/Option 값 변경 시 사용 중)
function modifyPipelineData(el,nodeID,parameterType,pNodeID,parameterID){
	
	var value = $(el).val().trim();
	if ( value.length < 1 ) {
		return
	}

	$.each(pipeline_data.node, function(node_index, node){
		if ( node.nodeID == nodeID ) {	// parameterOption의 param.nodeID 가 NA인 경우가 있어서 node.nodID 한번더 넘겨줘서 체크 필요.
			if(parameterType == "Input" && node.parameter.parameterInputSize > 0){
				$.each(node.parameter.parameterInput, function(param_index, param){
					if(param.nodeID == pNodeID && param.parameterID == parameterID){
						pipeline_data.node[node_index].parameter.parameterInput[param_index].parameterValue = value;
					}
				});
			} else if(parameterType == "Output" && node.parameter.parameterOutputSize > 0){
				$.each(node.parameter.parameterOutput, function(param_index, param){
					if(param.nodeID == pNodeID && param.parameterID == parameterID){
						pipeline_data.node[node_index].parameter.parameterOutput[param_index].parameterValue = value;
					}
				});
			} else if(parameterType == "Option" && node.parameter.parameterOptionSize > 0){
				$.each(node.parameter.parameterOption, function(param_index, param){
					if(param.nodeID == pNodeID && param.parameterID == parameterID){
						pipeline_data.node[node_index].parameter.parameterOption[param_index].parameterValue = value;
					}
				});
			}
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

//체크박스 전체 선택
function downCheckAll(){
	var checkAllYn = $('input[name=downAll]').is(":checked");
	for(var i=0;i<downDataSize;i++){
		if(checkAllYn){
			$('input[name=down'+i+']').prop("checked", true);
		}else{
			$('input[name=down'+i+']').prop("checked", false);
		}
	}
};

//실제 파일 다운로드 로직
function downloadAction(uploadID){
	
	$(".bg_opacity1").css("zIndex", 9999);
	RAONKUPLOAD.ResetUpload(uploadID);
	var check_name; var path;
	var checkArray = []; var checkPathStr = "";
	$('input:checkbox[type=checkbox]:checked').each(function () {
		var td = $(this).parent().parent().children();
		td.each(function(i){
	        check_name = td.eq(1).text();
	        path = td.eq(4).text();
	    });
	    checkArray.push({"check_name":check_name, "path":path});
	    checkPathStr += path+"/"+check_name+",";
	});
	if(checkArray.length <= 0){
		swal({
			title: "",
			text: messageGSelectFile,	// [한글]
			confirmButtonText: buttonConfirm
		});
		$("#loadingBox").hide();
	}else {
		path = checkArray[0].path;
		if(path == ""){
			path = checkArray[1].path;
		}
		
		$.ajax({
			url: get_context_path() + '/set_file_lsit_data',
			type: 'POST',
			data: {
				path : path,
				checkPathStr : checkPathStr.substring(0, checkPathStr.length - 1)
			},
			success: function(data){
				$("#loadingBox").hide();
				$.ajax({
					url: get_context_path() + '/get_file_lsit_data',
					type: 'GET',
					data: {
						user_id : member_id,
						path : path
					},
					success: function(data){
						if(data.file_lsit_data.length > 0){
							$.each(data.file_lsit_data, function(index, gbox){
								var folder_name = gbox.path.replace(path+"/","");
								var folder_path = gbox.path;
								var folder_size = calculate(bytesToSize(gbox.size));
								if(gbox.isFile == true){ 
									RAONKUPLOAD.AddUploadedFile(gbox.name+"_"+index, folder_name, folder_path, folder_size, 'CustomValue', uploadID);
								}
							})
						};
					},
					complete : function(){
						RAONKUPLOAD.DownloadAllFile(uploadID);
					}
				});
			}
		});
	}
}

//다운로드 분기처리
function fileDownload(type) {
	
	var uploadID = "gsaFileDownload_"+type;
	if(type == "agent"){
		$("#loadingBox").show();
		$(".bg_opacity1").css("zIndex", 10001);
		raonkParam_agent = {
			Id: uploadID,
			InitVisible: false,
			Mode: 'view',
			FolderTransfer: '1',
			Runtimes: 'agent',
			UploadHolder:"agentholder",
			MessageTitle: "Bioexpress Upload"
		}; 
		new RAONKUpload(raonkParam_agent);
		
		//agent 클라이언트 설치 되었는지 확인
		RAONKUPLOAD.IsAgentInstalled(fn_callback);
		
	}else if(type == "html5"){
		$("#loadingBox").show();
		$(".bg_opacity1").css("zIndex", 10001);
		downloadAction(uploadID);
	}
}

//RAONKUpload 객체 생성후 처리할 내용
function RAONKUPLOAD_CreationComplete(uploadID) {
	 if(uploadID != "gsaFileDownload_agent"){
		return;
	}
	downloadAction(uploadID);
}

//RAONKUpload 설치확인 및 설치진행
var fn_callback = function (value) {
    if(value == false){ // value가 false이면 설치되지 않음
		RAONKUPLOAD.StartAgentInstall("gsaFileDownload_agent");
	}
};

// Agent 파일 다운로드시 사용자가 agent 설치팝업을 강제로 닫은 후 처리내용
function RAONKUPLOAD_CloseInstallPopup(uploadID) {
    RAONKUPLOAD.Destroy(uploadID);
    $("#loadingBox").hide();
    $(".bg_opacity1").css("zIndex", 9999);
}

function RAONKUPLOAD_OnLanguageDefinition(uploadID, uploadLang) {
     uploadLang.install_guide.desc1 = 'Bioexpress Agent 설치를 시작합니다.'
    /*uploadLang.install_guide.desc2 = '텍스트2'
     uploadLang.install_guide.desc3 = '텍스트3'
     uploadLang.install_guide.desc4 = '텍스트4'
     uploadLang.install_guide.agent_info = '텍스트5'*/
}


//RAONKUpload 폴더 및 파일 업로드 추가
function createKuploadFoler(currentPath) {
	
	currentPath = currentPath.replace("/BiO/K-BDS", "")+"/";
	updatePath = currentPath;
	var isLoaded = RAONKUPLOAD.IsLoadedUploadEx("kupload_foler");
	
	var locale = getLanguageCookie();
	var raonLanguage = "";
	if(locale === "ko"){
		raonLanguage = "ko-kr";
	}else if(locale === "en"){
		raonLanguage = "en-us";
	}
	
	if(isLoaded){
		RAONKUPLOAD.SetConfig("FolderNameRule", currentPath, "kupload_foler");
	}else{
		var raonkParam = {
			Id:'kupload_foler',
			Width:'100%',
			Height:'250px',
			UploadHolder:'kupload_foler',
			FolderTransfer:'1',
			GetFolderInFile: '1',
			ButtonBarEdit:'add,add_folder,send,remove,remove_all',
			Runtimes:'agent',
			Lang: raonLanguage,
			FolderNameRule:updatePath
		};
		new RAONKUpload(raonkParam);
	}
}

// 파일 업로드 완료 후 처리할 내용
function RAONKUPLOAD_UploadComplete(uploadID) {
	if(uploadID == "kupload_foler"){
		parentDir("input00",currentPath+"/","Folder");
	}
}


//시간지연 함수
function wait(sec) {
    let start = Date.now(), now = start;
    while (now - start < sec * 1000) {
        now = Date.now();
    }
}

//size byte단위로 변환
function calculate(size){
	invalue = size.split(" ")[0];
	selectunit = size.split(" ")[1];
	var bytevalue=0
	if (selectunit=="Bytes")
		bytevalue=invalue
	else if (selectunit=="KB")
		bytevalue=invalue*1024
	else if (selectunit=="MB")
		bytevalue=invalue*1024*1024
	else if (selectunit=="GB")
		bytevalue=invalue*1024*1024*1024
	return bytevalue;
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