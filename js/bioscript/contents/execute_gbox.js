let rootPath = "";
let downRootPath = "";
let downPath = "";
let downDataSize = 0;
let currentPath = "";

function getUserGboxRoot(val,type,order,sort){

	// 실행중인 파이프라인 수정 불가 
	if ( isEnabledPipeline() && ( getTaskRunStat() == "run" || getTaskRunStat() == "exec" ) ) {
		swal({
			title: "",
			// text: "실행중인 파이프라인은 수정할 수 없습니다.",
			text: messageGPipelineNotEdit,			
			confirmButtonText: "확인"
		});
		return;
	}

	$.ajax({
			url: get_context_path() + '/get_user_gbox_root',
			type: 'GET',
			data: {
				user_id : member_id,
				order: order,
				sort: sort
			},
			success: function(data){
				$('#'+val+'Browser').empty();
				if(data.user_gbox_root != null){
					rootPath = data.user_gbox_root[0].parentPath;
					currentPath = rootPath;
					
					var trStr;
					var icon = "";
					$.each(data.user_gbox_root, function(index, gbox){				
												
						if(!gbox.isHidden) {
							trStr = "<tr>";
							trStr +=	"<td class='ta-c'>";
							if(gbox.isDir ){
								icon = "folder_icon";
								if(type=='Folder'){
									trStr += 	"<input type='radio' name='"+val+"' value='"+gbox.path+"'/>";
								}
							} else if( gbox.isFile){
								icon = "file_icon";
								if(type=='File'){
									trStr += 	"<input type='radio' name='"+val+"' value='"+gbox.name+"'/>";
								}
							}
							trStr +=	"</td>";

							if(gbox.isSub){
								trStr +=	"<td ondblclick='getUserGboxData(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' style='cursor:pointer;'>";
								trStr +=		"<span class='isSub "+type+" "+gbox.extension;
								if(gbox.isSymbol){
									trStr += " symbol"
								}
								trStr += 		"'><i class='"+icon+"'></i>"+gbox.name+"</span>";
								trStr +=	"</td>";
								trStr +=	"<td ondblclick='getUserGboxData(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' style='cursor:pointer;'>"+bytesToSize(gbox.size)+"</td>";
								trStr +=	"<td ondblclick='getUserGboxData(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' style='cursor:pointer;'>"+gbox.modifiedDate+"</td>";
							} else {
								trStr +=	"<td>";
								trStr +=		"<span class='"+type+" "+gbox.extension;
								if(gbox.isSymbol){
									trStr += " symbol"
								}
								trStr += 		"'><i class='"+icon+"'></i>"+gbox.name+"</span>";
								trStr +=	"</td>";
								trStr +=	"<td>"+bytesToSize(gbox.size)+"</td>";
								trStr +=	"<td>"+gbox.modifiedDate+"</td>";
							}
							trStr += "</tr>";
							
			    
							$('#'+val+'Browser').append(trStr);
							
						}
					});
				}else{

					$('#'+val+'Browser').append("<tr><td colspan='4'>" + messageNoData + "</td></tr>");
				}
				
				//RAONKUpload 폴더 및 파일 업로드 추가
				createKuploadFoler(currentPath);
			},
			error: function(){
				console.log("error");
			},
			beforeSend: function() {
				
//				$("#" + val + "Btn").parent().parent().find(".browserBox").css("display", "block");
				$('#'+val+'Btn').parent().parent().find(".browserBox").show();
				$(".bg_opacity1").show();
				$('#'+val+'Browser').empty();
				$('#'+val+'Browser').html("<tr><td colspan='4' class='ta-c'><img src='/bioexpress/img/common/loading_big.gif'></td></tr>");
			}
		});
}

function getUserGboxData(val,path,type,order,sort){

	$.ajax({
			url: get_context_path() + '/get_user_gbox_data',
			type: 'GET',
			data: {
				user_id : member_id,
				path : path,
				order: order,
				sort: sort
			},
			success: function(data){
				currentPath = path;
				
				$('#'+val+'Browser').empty();
				$('#'+val+'Browser').append("<tr class='prev_dir_tr'><td></td><td ondblclick='parentDir(\""+val+"\",\""+data.user_gbox_data[0].parentPath+"\",\""+type+"\");' style='cursor:pointer;'><span class='prev_dir'><i class='prev_dir_icon'></i>..</span></td><td></td><td></td></tr>");
				if(data.user_gbox_data.length > 0){
					var trStr;
					var icon="";
					$.each(data.user_gbox_data, function(index, gbox){

						trStr = "<tr>";
						trStr +=	"<td class='ta-c'>";
						if(gbox.isDir){
							icon = "folder_icon";
							if(type=='Folder'){
								trStr += 	"<input type='radio' name='"+val+"' value='"+gbox.path+"'/>";
							}
						} else if( gbox.isFile){
							icon = "file_icon";
							if(type=='File'){
								trStr += 	"<input type='radio' name='"+val+"' value='"+gbox.name+"'/>";
							}
						}
						trStr +=	"</td>";


						if(gbox.isSub){
							trStr +=	"<td ondblclick='getUserGboxData(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' style='cursor:pointer;'>";
							trStr +=		"<span class='"+type+" "+gbox.extension;
							if(gbox.isSymbol){
									trStr += " symbol"
								}
								trStr += 		"'><i class='"+icon+"'></i>"+gbox.name+"</span>";
							trStr +=	"</td>"
							trStr +=	"<td ondblclick='getUserGboxData(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' id='"+gbox.path+"' style='cursor:pointer;'>"+bytesToSize(gbox.size)+"</td>";
							trStr +=	"<td ondblclick='getUserGboxData(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' id='"+gbox.path+"' style='cursor:pointer;'>"+gbox.modifiedDate+"</td>";
						} else {
							trStr +=	"<td>";
							trStr +=		"<span class='"+type+" "+gbox.extension;
							if(gbox.isSymbol){
								trStr += " symbol"
							}
							trStr += 		"'><i class='"+icon+"'></i>"+gbox.name+"</span>";
							trStr +=	"</td>";
							trStr +=	"<td>"+bytesToSize(gbox.size)+"</td>";
							trStr +=	"<td>"+gbox.modifiedDate+"</td>";
						}
						trStr += "</tr>";

						$('#'+val+'Browser').append(trStr);

					});
				}else{

					$('#'+val+'Browser').append("<tr><td colspan='4'>" + messageNoData + "</td></tr>");
				}

				//RAONKUpload 폴더 및 파일 업로드 추가
				createKuploadFoler(currentPath);
			},
			beforeSend: function() {
				$('#'+val+'Browser').empty();
				$('#'+val+'Browser').html("<tr><td colspan='4' class='ta-c'><img src='/bioexpress/img/common/loading_big.gif'></td></tr>");
			}
		});
}


function getUserGboxDown(val,path,type,droot,order,sort){
	currentPath = path;
	// 실행중인 파이프라인 수정 불가 
	if ( isEnabledPipeline() && ( getTaskRunStat() == "run" || getTaskRunStat() == "exec" ) ) {
		swal({
			title: "",
			// text: "실행중인 파이프라인은 수정할 수 없습니다.",
			text: messageGPipelineNotEdit,			
			confirmButtonText: "확인"
		});
		return;
	}
	
	$.ajax({
		url: get_context_path() + '/get_user_gbox_root',
		type: 'GET',
		data: {user_id : member_id,
				order: order,
				sort: sort
		},
		success: function(data){
			if(data.user_gbox_root != null){
				rootPath = data.user_gbox_root[0].parentPath;
				downPath = "";
				paths1 = rootPath.split("/");
				paths2 = path.split("/");
				for(i=0; i<paths1.length-1; i++){
					downPath += paths1[i]
					if(i!=paths1.length-2){
						downPath += "/"
					}
				};
				for(i=0; i<paths2.length; i++){
					downPath += paths2[i]
					if(i!=paths2.length-1){
						downPath += "/"
					}
				};
				if(droot == "Y"){	//결과확인 버튼 클릭시
					downRootPath = downPath;
					path = downPath;
				}
			}
			$.ajax({
				url: get_context_path() + '/get_user_gbox_data',
				type: 'GET',
				data: {
					user_id : member_id,
					path : path,
					order: order,
					sort: sort
				},
				success: function(data){
					$('#'+val+'Browser').empty();
					
					//텍스트 끝위치 '/' 제거후 비교
					var rp_path = path.replace(/\/$/, '');
					var rp_downRootPath = downRootPath.replace(/\/$/, '');
					if(rp_path != rp_downRootPath){
						$('#'+val+'Browser').append("<tr class='prev_dir_tr'><td></td><td ondblclick='parentDir(\""+val+"\",\""+path+"\",\""+type+"\");' style='cursor:pointer;'><span class='prev_dir'><i class='prev_dir_icon'></i>..</span></td><td></td><td></td></tr>");
					}
					if(data.user_gbox_data.length > 0){
						var trStr;
						var icon="";
						$.each(data.user_gbox_data, function(index, gbox){
							
							//다운로드 항목 size 셋팅
							downDataSize = data.user_gbox_data.length;
							
							trStr = "<tr>";
							trStr +=	"<td class='ta-c'>";
							if(gbox.isDir){
								icon = "folder_icon";
								if(gbox.isSub){
									trStr += 	"<input type='checkbox' name='"+val+index+"' value='"+gbox.path+"'/>";
								}
							} else if( gbox.isFile){
								icon = "file_icon";
								trStr += 	"<input type='checkbox' name='"+val+index+"' value='"+gbox.name+"'/>";
							}
							trStr +=	"</td>";
	
							if(gbox.isSub){
								trStr +=	"<td ondblclick='getUserGboxDown(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' style='cursor:pointer;'>";
								trStr +=		"<span class='"+type+" "+gbox.extension;
								if(gbox.isSymbol){
										trStr += " symbol"
									}
									trStr += 		"'><i class='"+icon+"'></i>"+gbox.name+"</span>";
								trStr +=	"</td>"
								trStr +=	"<td ondblclick='getUserGboxDown(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' id='"+gbox.path+"' style='cursor:pointer;'>"+bytesToSize(gbox.size)+"</td>";
								trStr +=	"<td ondblclick='getUserGboxDown(\""+val+"\",\""+gbox.path+"\",\""+type+"\");' id='"+gbox.path+"' style='cursor:pointer;'>"+gbox.modifiedDate+"</td>";
							} else {
								trStr +=	"<td>";
								trStr +=		"<span class='"+type+" "+gbox.extension;
								if(gbox.isSymbol){
									trStr += " symbol"
								}
								trStr += 		"'><i class='"+icon+"'></i>"+gbox.name+"</span>";
								trStr +=	"</td>";
								trStr +=	"<td>"+bytesToSize(gbox.size)+"</td>";
								trStr +=	"<td>"+gbox.modifiedDate+"</td>";
							}
							trStr += 	"<td style='display:none'>"+path+"</td>";
							trStr += 	"<td style='display:none'>"+gbox.extension+"</td>";
							trStr += "</tr>";
	
							$('#'+val+'Browser').append(trStr);
	
						});
					}else{
	
						$('#'+val+'Browser').append("<tr><td colspan='4'>" + messageNoData + "</td></tr>");
					}
	
				},
				beforeSend: function() {
					$('input[name=downAll]').prop("checked", false);
					$('#'+val+'Box').show();
					$(".bg_opacity1").show();
					$('#'+val+'Browser').empty();
					$('#'+val+'Browser').html("<tr><td colspan='4' class='ta-c'><img src='/bioexpress/img/common/loading_big.gif'></td></tr>");
				}
			});
			
		},
		error: function(){
			console.log("error");
		}
	})
}


function parentDir(val, path, type) {

	var parentPath = path.substr(0, path.lastIndexOf("/"));

	if(parentPath == rootPath) {
		getUserGboxRoot(val, type);
	} 
	else if(downPath != ""){
		getUserGboxDown(val,parentPath,type);
	}
	else {
		getUserGboxData(val,parentPath,type);
	}
}


function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

