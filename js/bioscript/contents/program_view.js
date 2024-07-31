function get_program_detail_info(program_raw_id){

	$.ajax({
		url : getContextPath() + '/program/program_detail_info',
		type : 'POST',
		async : true,
		dataType : "Json",
		data : {
			"raw_id" : program_raw_id
		},

		success : function(data) {
			console.log(data);

			var program_info = data.program_detail_info.programData;
			var keywords = (program_info.keyword).split(",");

			$("#pi_program_id").text(program_info.programID);
			$("#pi_program_name").text(program_info.programName);
			$("#pi_program_desc").text(program_info.programDesc);
			$("#pi_program_type").html("<i class='" + program_info.scriptType + "_icon'></i> "+program_info.scriptType);
			$("#pi_program_version").text(program_info.version);
			$("#pi_program_submission_date").text(program_info.registedDate);
			$("#pi_program_update_date").text(program_info.modifiedDate);
			$("#pi_root_category").text(program_info.rootCategoryName);
			$("#pi_sub_category").text(program_info.subCategoryName);

			var env;
			if(program_info.env == 'BX_ENV_01'){
				env = "bigdata";
			}else {
				env = "cluster";
			}

			$("#pi_program_env").text(env);

			$("#pi_script_type").html("<img src='../new/img/common/language/" + program_info.scriptType + ".png' alt='core_"+ program_info.scriptType + "'/>" + program_info.scriptType );

			var isMulti
			if(program_info.isMultiCore){
				isMulti = "Multi";
			}else {
				isMulti = "Single";
			}
//			$("#pi_core").html("<i class='core_icon core_"+isMulti+"'></i>" + isMulti);
			$("#pi_core").html("<img src='../new/img/common/core/core_" + isMulti.toLowerCase() + ".png' alt='core_"+ isMulti.toLowerCase() + "'/>" + isMulti);


			const tagBox = $("#pi_keywords");
			tagBox.empty();
			let keywordEls = "";
			$.each(keywords, function(index, item){
					keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + item + "</span>&nbsp;";
			});
			tagBox.append(keywordEls);

			// $.each(keywords, function(index, item){
			//
			// 	$("#pi_keywords").append("<a href='#none' class='" + shuffle_class(index, "keyword") +"' style='border-radius:2px;'>" + item + "</a> ");
			// });

			$("#pi_program_writer").text(program_info.registrant);

//			$("#pi_program_url").html("<img src='../new/img/content/link.png' alt='link_icon' /><a href='" + program_info.url + "' target='_blank'>"+program_info.url+"</a>");
			$("#pi_program_url").html("<a href='" + program_info.url + "' target='_blank'>"+program_info.url+"</a>");
//			$("#pi_program_cmd_ex").text("----------------------모델에 없음, 워크벤치에서 입력도 받지 않음");
		},

		error : function(e) {

		},

		beforeSend : function(){

		}
	});
}
