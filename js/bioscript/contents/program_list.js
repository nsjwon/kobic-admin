function get_program_list(page_num){
	$.ajax({
		url : getContextPath() + '/program/prorgram_list',
		type : 'POST',
		async : true,
		dataType : "Json",
		data : {
			"page_num" : page_num
		},

		success : function(data) {
			let el = $("#programListBox");
			el.empty();

			if ( data.page_info.totalCount > 0){
				$.each(data.program_list, function(index, program) {

					let div =
					'<div class="program_list">'
						+ '<div class="pg_title_box">'
							+ '<div class="pg_tit"><a href="./program_view?raw_id=' + program.rawID + '">' + program.programName + '</a></div>'
							+	'<div class="pg_text">' + program.programDesc + '</div>'
						+ '</div>'
						+ '<div class="pg_info_g">'
							+ '<ul class="pg_info_list">'
									+ '<li><span>'+ col3 +'</span><span>'+ program.version +'</span></li>'
									+ '<li><span>'+ col4 +'</span><span>'+ program.registrant +'</span></li>'
									+ '<li><span>'+ col8 +'</span><span>' + program.registedDate + '</span></li>'
							+ '</ul>'
							+ '<ul class="pg_icon_list">'
									+ '<li><img src="../new/img/common/language/'+program.scriptType+'.png" alt="'+program.scriptType+'" /></li>'
									+ '<li><a href="'+ program.url + '" target="_blank"><img src="../new/img/content/link.png" alt="link" /></a></li>'
							+ '</ul>'
						+ '</div>'
					+ '</div>';

					el.append(div);
				});
			} else {
				el.append("<div><ul><li>" + messageNoData + "</li></ul></div>");
			}

			if ( data.page_info.endPageNo > 1 ) {
				let pageLinks = "";
				for ( let i = data.page_info.startPageNo; i <= data.page_info.endPageNo; i++ ) {
					if ( data.page_info.pageNo == i) {
						pageLinks += "<a class='on' onclick=\"get_program_list(" + i + ");\">" + i + "</a>";
					} else {
						pageLinks += "<a onclick=\"get_program_list(" + i + ");\">" + i + "</a>";
					}
				}

				let pageLinkEls =
					 	"<span class='prev_g'>"
						+ "<a class='page_p_end' onclick='get_program_list(1)'>"
							+ "<span class='Hidden'>" + pageFirstText + "</span>"
						+ "</a>"
						+ "<a class='page_p' onclick=\"get_program_list(" + data.page_info.prevPageNo + ");\">"
							+ "<span class='Hidden'>" + pagePrevText + "</span>"
						+ "</a>"
					+ "</span>"
					+ pageLinks
					+ "<span class='next_g'>"
						+ "<a class='page_n' onclick=\"get_program_list(" + data.page_info.nextPageNo + ");\">"
							+ "<span class='Hidden'>" + pageNextText + "</span>"
						+ "</a>"
						+ "<a class='page_n_end' onclick='get_program_list("+data.page_info.endPageNo+")'>"
							+ "<span class='Hidden'>" + pageLastText + "</span>"
						+ "</a>"
					+ "</span>"

				$("#pagingBox").append(pageLinkEls);
			}
		},

		error : function(e) {
		},

		beforeSend : function() {
			$("#program_list_tbody").empty();
			$("#program_list_tbody").html("<tr><td colspan='8' class='ta-c'><img src='/bioexpress/img/common/loading_big.gif' style='vertical-align: middle;'></td></tr>");

			$("#pagingBox").empty();
		}
	});
}
