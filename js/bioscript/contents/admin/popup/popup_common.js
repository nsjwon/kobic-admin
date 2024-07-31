/************************ [페이지 진입 시 바로 동작 로직 (초기화)] *************************************/
$(function() {
	
	/** 
	 * datePicker : 달력 선택 기능 
	 */
	 
	 // 초기값 설정	 
//	today = new Date();
//	var calDay = settingDateOffset(today, 15);
//	var defaultStartDate = settingDateFormat(calDay);
//	defaultEndDate= settingDateFormat(today); 
//		
////	var datePickers = $(this).find("input[name='brdDateSt']");
//	var datePickers = $(this).find("input[class='brdDate']");
//	for ( var i=0; i<datePickers.length; i++ )  {
//		if ( i % 2 == 0 ) $(datePickers[i]).val(defaultEndDate);
//		else $(datePickers[i]).val(defaultStartDate);
//	}
	
	// 기간 조회 datepicker
//	$("input[name='brdDateSt']").datepicker({
	$("input[class='brdDate']").datepicker({
		dateFormat: 'yy-mm-dd',
		showMonthAfterYear: true,
		changeYear: true,
		changeMonth: true,
		yearRange: 'c-50:c+50',
		// maxDate: '0',
		// monthNamesShort: [date_month_1, date_month_2, date_month_3, date_month_4, date_month_5, date_month_6, date_month_7, date_month_8, date_month_9, date_month_10, date_month_11, date_month_12],
		monthNamesShort: [
			  'Jan'
			, 'Feb'
			, 'Mar'
			, 'Apr'
			, 'May'
			, 'Jun'
			, 'Jul'
			, 'Aug'
			, 'Sep'
			, 'Oct'
			, 'Nov'
			, 'Dec'
		],
						
		// dayNamesMin: [date_dayweek_1, date_dayweek_2, date_dayweek_3, date_dayweek_4, date_dayweek_5, date_dayweek_6, date_dayweek_7]		
		dayNamesMin: [
			  'MON'
			, 'TUE'
			, 'WED'
			, 'THU'
			, 'FIR'
			, 'SAT'
			, 'SUN'
		]
		
	});
	
});






function get_context_path(){
	
	var host_index = location.href.indexOf(location.host) + location.host.length;
	return location.href.substring(host_index, location.href.indexOf('/', host_index + 1));
		
}



/************************ [RaonK Editor] ************************************ */

function raonkWritePopupInit(editorId){
		
	var raonkParam = {
		Id: editorId,
		HandlerUrl: get_context_path() + '/raonkeditor/handler',
		ShowTopMenu : "0",
//		Lang : raonLanguage
	};
	var editor =  new RAONKEditor(raonkParam);
}

function raonkEditorHolderPopupInit(editorId){

	var raonkParam = {
		EditorHolder: editorId,
		HandlerUrl: get_context_path() + '/raonkeditor/handler',
		ShowTopMenu : "0",
		Height : "200px",
//		Lang : raonLanguage
	};
	var editor =  new RAONKEditor(raonkParam);
}


/************************ [Utils] *************************************/

/** datepicker 관련 서브 함수 : 금일 기준 offset 이후 날짜를 반환한다. */
function settingDateOffset(date, offset) {
	return new Date(new Date().setDate(date.getDate() + offset));
}
/** datepicker 관련 서브 함수 : 금일 날짜를 반환한다. */
function settingDateFormat(date) {
	return date.getFullYear() + "-" + (("00"+(date.getMonth()+1).toString()).slice(-2)) + "-" + (("00"+date.getDate().toString()).slice(-2));
}

