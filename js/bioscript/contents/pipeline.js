function pipelinePaging(pageNo) {
	
	$.ajax({
		type: "post",
		url : getContextPath() + "/pipeline/pipeline_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#pipeline_fragment").replaceWith(response);
		}
	});
}

function programPaging(pageNo) {
	
	$.ajax({
		type: "post",
		url : getContextPath() + "/program/program_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#program_fragment").replaceWith(response);
		}
	});
}

function goInstanceExecute(pipelineRawId) {

	var url = getContextPath() + "/execute/execute?raw_id=" + pipelineRawId;
	window.open(url, "_blank");
}

//////////////////////////////////////////

function get_pipeline(page_num){
	$.ajax({
		url : getContextPath() + '/pipeline/pipeline_list',
		type : 'POST',
		async : true,
		dataType : "Json",
		data : {
			"page_num" : page_num
		},

		success : function(data) {
			console.log(data)

			let el = $("#pipelineListBox");
			el.empty();

			if ( data.pipeline_list.length > 0 ) {
				$.each(data.pipeline_list, function(index, pipeline){

					let keywords = (pipeline.keyword).split(",");
					let keywordEls = "";
					$.each(keywords, function(index, item){
//							keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + item + "</span>&nbsp;";
							keywordEls += "<span class='" + shuffle_class(index, "keyword") + "'>" + item + "</span>";
					});

					let div =
						"<div class='pipeline_list brd_list_box'>"
							+ "<div class='pp_title_box'>"
									+ "<div class='pp_tit'>"
										+ "<a href='./pipeline_view?raw_id=" + pipeline.rawID + "'>" + pipeline.pipelineName + "</a>"
									+ "</div>"
									+ "<div class='pp_text'>"
										+ pipeline.pipelineDesc
									+ "</div>"
							+ "</div>"
							+ "<div class='pp_info_g'>"
								+ "<ul>"
									+ "<li><span>" + col3 + "</span><span>" + pipeline.categoryName + "</span></li>"
									+ "<li><span>" + col2 + "</span><span>" + pipeline.exeCount + "</span></li>"
									+ "<li><span>" + col7 + "</span><span>" + pipeline.reference + "</span></li>"
								+ "</ul>"
								+ "<ul>"
									+ "<li><span>" + col4 + "</span><span>" + pipeline.registrant + "</span></li>"
									+ "<li><span>" + col5 + "</span><span>" + pipeline.createDate + "</span></li>"
									+ "<li><span>" + col6 + "</span><span>" + pipeline.updateDate + "</span></li>"
								+ "</ul>"
							+ "</div>"
							+ "<div class='p_keyword_g'>"
								+ keywordEls
							+ "</div>"
							+ "<a href='./pipeline_view?raw_id=" + pipeline.rawID + "' class='more'><span class='Hidden'>" + moreText + "</span></a>"
					 	+ "</div>";

					el.append(div);
				});
			} else {
				el.append("<div><ul><li>" + messageNoData + "</li></ul></div>");
			}

			if ( data.page_info.endPageNo > 1 ) {
				let pageLinks = "";
				for ( let i = data.page_info.startPageNo; i <= data.page_info.endPageNo; i++ ) {
					if ( data.page_info.pageNo == i) {
						pageLinks += "<a class='on' onclick=\"get_pipeline(" + i + ");\">" + i + "</a>";
					} else {
						pageLinks += "<a onclick=\"get_pipeline(" + i + ");\">" + i + "</a>";
					}
				}

				let pageLinkEls =
					 	"<span class='prev_g'>"
						+ "<a class='page_p_end' onclick='get_pipeline(1)'>"
							+ "<span class='Hidden'>" + pageFirstText + "</span>"
						+ "</a>"
						+ "<a class='page_p' onclick=\"get_pipeline(" + data.page_info.prevPageNo + ");\">"
							+ "<span class='Hidden'>" + pagePrevText + "</span>"
						+ "</a>"
					+ "</span>"
					+ pageLinks
					+ "<span class='next_g'>"
						+ "<a class='page_n' onclick=\"get_pipeline(" + data.page_info.nextPageNo + ");\">"
							+ "<span class='Hidden'>" + pageNextText + "</span>"
						+ "</a>"
						+ "<a class='page_n_end' onclick='get_pipeline("+data.page_info.endPageNo+")'>"
							+ "<span class='Hidden'>" + pageLastText + "</span>"
						+ "</a>"
					+ "</span>"

				$("#pagingBox").append(pageLinkEls);
			}
		},

		error : function(e) {
		},
		beforeSend : function(){
			$("#pagingBox").empty();
		}
	});
}
