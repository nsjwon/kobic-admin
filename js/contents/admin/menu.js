$(document).ready(function() {

    // 각 .gnb-depth1 요소에 대해 active 클래스가 없으면 해당 .gnb-depth2를 숨깁니다.
    $('.gnb-depth1 > li').each(function() {
        var $link = $(this).children('a');
        if (!$link.hasClass('active')) {
            $(this).children('.gnb-depth2').hide();
        }
    });

    // .gnb-depth1 > li > a를 클릭했을 때의 이벤트 핸들러
    $('.gnb-depth1 > li > a').on('click', function(event) {
        var $this = $(this);
        var $ul = $this.next('.gnb-depth2');

        // li에 ul이 있는 경우에만 이벤트를 실행합니다.
        if ($ul.length) {
            // 기본 링크 클릭 동작을 방지합니다.
            event.preventDefault();

            // 클릭된 요소가 .active 클래스를 가지고 있는지 확인합니다.
            if ($this.hasClass('active')) {
                // .active 클래스가 있는 경우, ul을 숨기고 .active 클래스를 제거합니다.
                $this.removeClass('active');
                $this.parent('.foldable').removeClass('open');
                $ul.hide();
            } else {
                // 모든 .gnb-depth2를 숨기고 모든 .active 클래스를 제거합니다.
                $('.gnb-depth1 .gnb-depth2').hide();
                $('.gnb-depth1 > li > a').removeClass('active');
                $('.gnb-depth1 > li').removeClass('open');

                // 클릭된 요소에 .active 클래스를 추가하고 ul을 보여줍니다.
                $this.addClass('active');
                $this.parent('.foldable').addClass('open');
                $ul.show();
            }
        }
    });
});