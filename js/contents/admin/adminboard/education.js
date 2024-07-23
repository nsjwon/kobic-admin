$(document).ready(function() {

    // 검색 날짜 선택 
    $(document).on('focus', '#eduEducationDtSt', function() {
        var dp = $(this).datepicker({
            format: 'yyyy-mm-dd',
            language: 'ko-KR',
            autoHide: true
        });
    });
    
    // 검색 날짜 선택 
    $(document).on('focus', '#eduEducationDtEd', function() {
        $(this).datepicker({
            format: 'yyyy-mm-dd',
            language: 'ko-KR',
            autoHide: true,
            getDayName: true
        });
    });
});

/** 집합교육일정 일시 > 시간 설정 */
function selectEduTime() {
	
    const startTimeH = $('#trainingStartH option:selected').val();
    const startTimeM = $('#trainingStartM option:selected').val();
    const endTimeH = $('#trainingEndH option:selected').val();
    const endTimeM = $('#trainingEndM option:selected').val();
    const startTime = startTimeH + ":" + startTimeM;
    const endTime = endTimeH + ":" + endTimeM;

    $('#eduEducationTmSt').val(startTime);
    $('#eduEducationTmEd').val(endTime);
}
