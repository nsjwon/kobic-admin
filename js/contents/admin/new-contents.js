// 탭 전환 효과
$(document).ready(function() {
    // .tab_tit 클릭 이벤트 설정
    $('.tab_tit').click(function(e) {
        e.preventDefault(); // 기본 동작(링크 이동) 방지

        // 클릭한 탭의 href 속성 값(#tab1, #tab2, 등)을 가져옴
        var target = $(this).attr('href');

        // 모든 탭 제목에서 'focus' 클래스 제거
        $('.brd-tab-list li').removeClass('focus');

        // 클릭한 탭 제목에 'focus' 클래스 추가
        $(this).parent('li').addClass('focus');

        // 모든 탭 콘텐츠 숨기기
        $('.tab_cont').hide();

        // 클릭한 탭과 일치하는 콘텐츠만 보이기
        $(target).show();
    });
});



//팝업 이벤트
// $(document).ready(function() {
//     $(".selectable").click(function(event) {
//         $(".selectable").removeClass("select");
//         $(this).toggleClass("select");
//     });
// });

// $(document).ready(function() {
//     const body = $('body')[0];
//     // 팝업 열기 버튼 클릭 이벤트
//     $('.popup-button').click(function() {
//         var target = $(this).data('target');
//         $(target).show();
//         //본문창 스크롤 막기
//         $('body').addClass('scrollLock');
//     });
    
//     // 팝업 닫기 버튼 클릭 이벤트
//     $('.popup-panel .close-button').click(function() {
//         $(this).closest('.popup-panel').hide();
//         //본문창 스크롤 막기 해제
//         $('body').removeClass('scrollLock');
//     });
// });


// 팝업 이벤트
$(document).ready(function() {
    $('.popup-button').click(function() {
        var target = $(this).data('target');
        $(target).show();
        // 본문창 스크롤 막기
        $('body').addClass('scrollLock');
    });

    // 팝업 닫기 버튼 클릭 이벤트
    $('.popup-panel .close-button').click(function() {
        $(this).closest('.popup-panel').hide();
        // 본문창 스크롤 막기 해제
        $('body').removeClass('scrollLock');
    });

    // confirMation 팝업 메세지 변경 함수
    window.setMessage = function(type) {
        let message = '';
        if (type === 'type01') {
            message = '회원을 강제 탈퇴 하시겠습니까?';
        } else if (type === 'type02') {
            message = '그룹원을 탈퇴 하시겠습니까?';
        } else if (type === 'type03') {
            message = '그룹을 해제 하시겠습니까?';
        } else if (type === 'type04') {
            message = '요청을 승인 하시겠습니까?';
        } else if (type === 'type05') {
            message = '요청을 보류 하시겠습니까?';
        } else if (type === 'type06') {
            message = '약관을 삭제 하시겠습니까?';
        }

        const popup = document.querySelector('#confirMation');
        const popupMessage = popup.querySelector('.popup-message');
        popupMessage.textContent = message;
    }
});