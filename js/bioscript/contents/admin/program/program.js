$(function() {
	
	// program management list click
	$(document).on("click", ".brd_list", function(e) {
		var selected = e.currentTarget;
		var programId = $(selected).find("#programId").val();
		var registProgramId = $(selected).find("#registProgramId").val();
		
		if ( programId ) {
			location.href = encodeURI(getContextPath() + "/admin/program_view?raw_id=" + programId);
		}
		else if ( registProgramId ) {
			location.href = encodeURI(getContextPath() + "/admin/program_regist_view?raw_id=" + registProgramId);
		}
	});
	
	// ProgramName Validate
	$("#programName").keyup(function() {
		if ( $("#programName").val() && $("#programName").val().length > 0 ) {
			$("#programName-error").addClass("Hidden");
		}
		else {
			$("#programName-error").removeClass("Hidden");
		}
	});

	// get root category list
	getProgramRootCategory();
})

// admin - program - program management paging
function programPaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_program_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#program_fragment").replaceWith(response);
		}
	});
}

// admin - program - regist management paging
function registProgramPaging(pageNo) {
	
	$.ajax({
		type: "post",
		url: "admin_prg_regist_mgnt_paging",
		data: { page_no: pageNo },
		success: function(response) {
			$("#program_fragment").replaceWith(response);
		}
	});
}


// admin - program - regist management - program_regist_view.html 
function confirm() {
	
	swal({
		title: "",
		text: "Do you want register this?",
		showCancelButton: true,
		confrimButtonText : "Yes, I will register.",
		cancelButtonText: "No"
	}).then(function(result) {
		
		if (result) {
			$.ajax({
				url : getContextPath() + '/admin/program_regist_confirm',
				type : 'POST',
				async : true,
				dataType : "Json",
				data : {
					"rawID" : $("#rawId").val()
				},
				
				success : function(data) {
					if(data.status == "ok"){
						swal({
							title: "",
							text: "프로그램 등록 완료되었습니다.",
							confirmButtonText: "Confirm",
						}).then(function() {
							location.href = getContextPath() + "/admin/program_regist";
						});
						
					} else {
						console.log("fail");
					}
				},
				
				error : function(e) {
					
				},
					 
				beforeSend : function(){
					
				}
			});
		}
		else {
			return false;
		}
	});
								
}


// move program_modify.html 
function modifyProgram(rawId) {
	location.href = encodeURI(getContextPath() + "/admin/program_modify?raw_id=" + rawId);
}

// modify program (program_modify.html, program_regist_modify.html)
function doModifyProgram(rawId) {
	
	// root/sub category id, name
	$("#rootCategoryId").val($("#rootCategory option:selected").val());
	$("#rootCategoryName").val($("#rootCategory option:selected").text());
	$("#subCategoryId").val($("#subCategory option:selected").val());
	$("#subCategoryName").val($("#subCategory option:selected").text());
	
	// keywords
	var keywords = $("#keyword").val();
	if ( keywords && keywords.length > 0 ) {
		keywords = keywords.split(",");
		for ( var i=0; i<keywords.length; i++ ) {
			keywords[i] = "#" + keywords[i].trim();
		}
		keywords = keywords.join(",");
	}
	$("input[name=keyword]").val(keywords);

	var data = { raw_id : rawId,
				 program_data : JSON.stringify($("#programModifyForm").serializeObject()) };
	swal({
		title: "",
		text: "프로그램 정보를 수정하시겠습니까?",
		showCancelButton: true,
		cancelButtonText: "취소",
		confirmButtonText: "수정"
	}).then(function(result) {
		if (result) {
			$.ajax({
				url: getContextPath() + "/admin/do_program_modify",
				type: "POST",
				dataType: "json",
				data: data,
				success: function(data) {

					if ( data && data.status && data.status == "ok" ) {
						var redirectUrl = window.location.pathname.split("/");
						redirectUrl = redirectUrl[2] + "/" + redirectUrl[3].replace("modify", "view");
						location.href = encodeURI(getContextPath() + "/" + redirectUrl + "?raw_id=" + rawId);
//						location.href = encodeURI(getContextPath() + "/admin/program_view?raw_id=" + rawId);
					}
				}
			});
		} 
		else {
			return false;
		}
	});

}

// move program_regist_modify.html
function modifyRegistProgram(rawId) {
	location.href = encodeURI(getContextPath() + "/admin/program_regist_modify?raw_id=" + rawId);
}

// Get Program Category List
function getProgramRootCategory() {

	$.ajax({
		url : getContextPath() + '/category/program_main_category',
		type : 'POST',
		dataType : 'Json',
		data: {},
		success : function(data) {
			
			var categoryList = "";
			$.each(data.program_main_category_list, function(index, category){
				
				categoryList += "<option value=" + category.categoryID;
				if ( category.categoryID == $("#rootCategoryId").val() ) {
					categoryList += " selected";
				}
				categoryList += ">" + category.categoryName + "</option>";
			});
			
			$("#rootCategory").html(categoryList);
			
			// Set Sub Category
			selectRootCategory();
		}
	})
}

// Root Category change event 
// Root Category에 따라 Sub Category가 달라짐.
function selectRootCategory() {
	
	var selectedRootCategory = $("#rootCategory option:selected").val();
	getProgramSubCategory(selectedRootCategory);
}

// Get Program Sub Category List
function getProgramSubCategory(categoryId) {

	$.ajax({
		url : getContextPath() + '/category/program_sub_category',
		type : 'POST',
		dataType : 'Json',
		data: {root_program_category_id:categoryId},
		success : function(data) {

			var categoryList = "";
			$.each(data.program_sub_category_list, function(index, category){
				
				categoryList += "<option value=" + category.categoryID;
				if ( category.categoryID == $("#subCategoryId").val() ) {
					categoryList += " selected";
				}
				categoryList += ">" + category.categoryName + "</option>";
			});
			
			$("#subCategory").html(categoryList);

		}
	});
}

