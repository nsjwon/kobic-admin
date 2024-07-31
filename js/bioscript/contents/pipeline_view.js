function get_pipeline_info_in_pipeline(raw_id, mainCategory){

	$.ajax({
		url : getContextPath() + '/pipeline/pipeline_detail_info',
		type : 'POST',
		async : true,
		dataType : "Json",
		data : {
			"raw_id" : raw_id
		},

		success : function(data) {

			if(data.pipeline_detail_info != null){

				var main_category = mainCategory;
				var sub_category = data.pipeline_detail_info.pipelineData.categoryName;
				var keywords = (data.pipeline_detail_info.pipelineData.keyword).split(",");
				var reference_papers = (data.pipeline_detail_info.pipelineData.reference).split(",");

				$("#pi_name").text(data.pipeline_detail_info.pipelineData.pipelineName);
				$("#pi_main_category").text(main_category);
				$("#pi_sub_category").text(sub_category);
				$("#pi_pipeline_id").text(data.pipeline_detail_info.pipelineData.pipelineID);
				$("#pi_pipeline_desc").text(data.pipeline_detail_info.pipelineData.pipelineDesc);
				$("#pi_pipeline_memberId").text(data.pipeline_detail_info.pipelineData.registrant);
				$("#pi_create_date").text(data.pipeline_detail_info.pipelineData.createDate);
				$("#pi_update_date").text(data.pipeline_detail_info.pipelineData.updateDate);

				$("#pi_keywords").empty();

				$.each(keywords, function(index, item){

					$("#pi_keywords").append("<a href='#none' class='" + shuffle_class(index, "keyword") +"' style='border-radius:2px;'>" + item + "</a> ");
				});

				$("#pi_reference_papers").empty();

				$.each(reference_papers, function(index, reference){

					$("#pi_reference_papers").append("<li>" + reference + "</li>");
				});

				$("#pi_pipeline_version").text(data.pipeline_detail_info.pipelineData.version);
				$("#pi_pipeline_execount").text(data.pipeline_detail_info.pipelineData.exeCount);

				$('#loadingBox').hide();
				$('#pipeline_div').show();
				draw_structure(data.pipeline_detail_info,1200,650,200,120,false);
			}else{

				location.href = getContextPath() + "/pipeline/pipeline";
			}
		},

		error : function(e) {

		},

		beforeSend : function(){
			$('#loadingBox').show();
			$('#pipeline_div').hide();
		}
	});
}
