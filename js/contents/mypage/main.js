// GBox 용량 가져오기
function getMyGBoxSize() {
	

	var idstr = $('#memberId').val();
	if ( idstr ) {
		// localStorage 
		if ( localStorage.getItem(idstr + '_size') ) {
	        var gSize = localStorage.getItem(idstr + '_size');
			// 사용량 표출 
			$('#myGBoxSize').text(gSize);
		
		}
	}
	
    axios.post(getContextPath() + '/mypage/do_get_my_gbox_size')
    .then(function(response) {

        if ( response && response.data ) {
            if ( response.data.result > 0 ) {
                var data = response.data;
				// 사용량 표출 
				$('#myGBoxSize').text(data.gbox_size);
				localStorage.setItem(idstr + '_size', data.gbox_size);
				localStorage.setItem(idstr + '_size_num', data.gbox_size_num);
            }
        }
    })
    .catch(function(error){
        //console.log(error);
    });
}


// Pipeline List
/*
function getMyPipelineList(pageNo) {

//	console.log("getMyPipelineList");
	$.ajax({
		url: getContextPath() + "/mypage/do_get_pipeline_list",
		type: "post",
		dataType: "json",
		async: false,
		data: { page_num : pageNo },
		success: function(data) {

			var isExistPp = false;
			var pipelineTotalCount = 0;
			var card = "";
			if ( data.pipeline_list != undefined ) {
				// 파이프라인 총 개수 				
				pipelineTotalCount= data.pipeline_list.length;
				if ( pipelineTotalCount > 0 ) {
					isExistPp = true;
					var pipelineCount = data.pipeline_list.length;
					for ( var i=0; i<pipelineCount; i++ ) {
						
						var pipeline = data.pipeline_list[i];		
						var status = pipeline.status == "init" ? "wait" : pipeline.status;	
						var keywords = (pipeline.keyword).split(",");
						
						card += '<div class="brd-item">';
						card += 	'<div class="brd-item-inner">';
						
						card += 		'<div class="b-cont-box">';
						card += 			'<div class="b_tit_item">';
						card += 				'<div class="b-tit"><p>' + pipeline.pipelineName + '</p></div>';
						card += 			'</div>';
						card += 			'<div class="pipeline-text">';
						card += 				'<span>' + pipeline.pipelineDesc + '</span>';
						card += 			'</div>';
						card += 			'<ul class="b-info">';
						card += 				'<li><span>' + mypagePipelineInfo01 + '</span><span>' + pipeline.createDate + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo02 + '</span><span>' + pipeline.updateDate + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo03 + '</span><span>' + pipeline.workspaceName + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo04 + '</span><span>' + pipeline.version + 'v</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo05 + '</span><span>' + pipeline.public + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo06 + '</span><span>' + pipeline.shared + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo07 + '</span><span>' + pipeline.exeCount + '</span></li>';
						card += 				'<li><span class="status-icon2 status-' + status + '">' + status + '</span></li>';
						card += 			'</ul>';						
						card += 		'</div>';
						
						card += 		'<div class="swiper mySwiper p-keyword-g-slide">';
						card += 			'<div class="swiper-wrapper">';
						$.each(keywords, function(index, item) {
							card += '<div class="swiper-slide"><span class="' + shuffleClass(index, "keyword") + '">' + item + '</span></div>';
						});
						card += 			'</div>';
						card += 			'<div class="swiper-pagination"></div>';
						card += 		'</div>';
						
						// move pipeline detail 
						var detailUrl = "";
						if ( typeof pipeline.rawID != "undefined" ) {
							detailUrl = 'goMyWorkspacePipeline(\'' + pipeline.workspaceID + '\',\'' + pipeline.pipelineID + '\',\'' + pipeline.rawID + '\');';
						}
									
						// card += 		'<div class="pipe-top">';
						// card += 			'<button class="pipe-more" onclick="' + detailUrl + '"><span class="hidden">자세히보기</span></button>';
						// card += 		'</div>';
						
						card += 	'</div>';
						card += '</div>';
					}
				}	
			}
			
			var className = ".brd-list-card";
			// if ( !isExistPp ) {
			// 	className = ".card-slider";
			// 	card = '<div class="brd_no_data">';
			// 	card += 	'<span>데이터가 없습니다.</span>';
			// 	card += "</div>";
			// }
			$(className).html(card);
			
			// 파이프라인 총 개수 
//			var title = '나의 워크스페이스에는 <span class="bold fc-red">총 ' + pipelineTotalCount + '개</span>의 파이프라인이 등록되어 있습니다.';
			var title = mypagePipelineListInfo.replace('{0}', pipelineTotalCount);
			$('p.b-list-count').text('');
			$('p.b-list-count').append(title);

			// 파이프라인 카드 Swiper 동작 구성
			var viewCount = 6;
			if ($(window).width() <= 1024) {
				viewCount = 4;
				if ($(window).width() <= 640) {
					viewCount = 2;
				}
			}
			slideAct(viewCount);
			
			$("#loadingBox").hide();
				
		}, beforeSend : function(data) {
			$("#loadingBox").show();
		}, complete : function() {
			$('#pplLoading').addClass('dis-none');
		}
	 
	})
}
*/

function getMyPipelineList(pageNo) {
    $.ajax({
        url: getContextPath() + "/mypage/do_get_pipeline_list",
        type: "post",
        dataType: "json",
        data: { page_num : pageNo },
        success: function(data) {
            requestAnimationFrame(function() {
                
			var isExistPp = false;
			var pipelineTotalCount = 0;
			var card = "";
			if ( data.pipeline_list != undefined ) {
				// 파이프라인 총 개수 				
				pipelineTotalCount= data.pipeline_list.length;
				if ( pipelineTotalCount > 0 ) {
					isExistPp = true;
					var pipelineCount = data.pipeline_list.length;
					for ( var i=0; i<pipelineCount; i++ ) {
						
						var pipeline = data.pipeline_list[i];		
						var status = pipeline.status == "init" ? "wait" : pipeline.status;	
						var keywords = (pipeline.keyword).split(",");
						
						card += '<div class="brd-item">';
						card += 	'<div class="brd-item-inner">';
						
						card += 		'<div class="b-cont-box">';
						card += 			'<div class="b_tit_item">';
						card += 				'<div class="b-tit"><p>' + pipeline.pipelineName + '</p></div>';
						card += 			'</div>';
						card += 			'<div class="pipeline-text">';
						card += 				'<span>' + pipeline.pipelineDesc + '</span>';
						card += 			'</div>';
						card += 			'<ul class="b-info">';
						card += 				'<li><span>' + mypagePipelineInfo01 + '</span><span>' + pipeline.createDate + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo02 + '</span><span>' + pipeline.updateDate + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo03 + '</span><span>' + pipeline.workspaceName + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo04 + '</span><span>' + pipeline.version + 'v</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo05 + '</span><span>' + pipeline.public + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo06 + '</span><span>' + pipeline.shared + '</span></li>';
						card += 				'<li><span>' + mypagePipelineInfo07 + '</span><span>' + pipeline.exeCount + '</span></li>';
						card += 				'<li><span class="status-icon2 status-' + status + '">' + status + '</span></li>';
						card += 			'</ul>';						
						card += 		'</div>';
						
						card += 		'<div class="swiper mySwiper p-keyword-g-slide">';
						card += 			'<div class="swiper-wrapper">';
						$.each(keywords, function(index, item) {
							card += '<div class="swiper-slide"><span class="' + shuffleClass(index, "keyword") + '">' + item + '</span></div>';
						});
						card += 			'</div>';
						card += 			'<div class="swiper-pagination"></div>';
						card += 		'</div>';
						
						// move pipeline detail 
						var detailUrl = "";
						if ( typeof pipeline.rawID != "undefined" ) {
							detailUrl = 'goMyWorkspacePipeline(\'' + pipeline.workspaceID + '\',\'' + pipeline.pipelineID + '\',\'' + pipeline.rawID + '\');';
						}
									
						card += 	'</div>';
						card += '</div>';
					}
				}	
			}
			
			var className = ".brd-list-card";
	
			$(className).html(card);
			var title = mypagePipelineListInfo.replace('{0}', pipelineTotalCount);
			$('p.b-list-count').text('');
			$('p.b-list-count').append(title);

			// 파이프라인 카드 Swiper 동작 구성
			var viewCount = 6;
			if ($(window).width() <= 1024) {
				viewCount = 4;
				if ($(window).width() <= 640) {
					viewCount = 2;
				}
			}
			slideAct(viewCount);
			
			$("#loadingBox").hide();
				
		
            });
        },
        beforeSend : function(data) {
            $("#loadingBox").show();
        }, 
        complete : function() {
            $('#pplLoading').addClass('dis-none');
        }
    });
}

function goMyWorkspacePipeline(workspaceId, pipelineId, pipelineRawId) {

	//console.log('준비중,,,');
}


// 파이프라인 리스트 Swiper
function slideAct(viewCount){
    var view = viewCount; //보이는 슬라이드 개수
    var realInx = 0; //현재 페이지
    var ppSwiper = undefined;

	//슬라이드 초기화
	if(ppSwiper != undefined) {
		ppSwiper.destroy();
		ppSwiper == undefined;
	}

    slideList();
    
    function slideList(){

        //리스트 초기화
        if ($('.card-slider .brd-item').parent().hasClass('swiper-slide')){
            $('.card-slider .swiper-slide-duplicate').remove();
            $('.card-slider .brd-item').unwrap('swiper-slide');
        }

        //리스트 그룹 생성 (swiper-slide element 추가)
        var num = 0;
        $('.card-slider').find('.brd-item').each(function(i) {
            $(this).addClass('brd-item'+(Math.floor((i+view)/view)));
            num = Math.floor((i+view)/view)
        }).promise().done(function(){
            for (var i = 1; i < num+1; i++) {
                $('.card-slider').find('.brd-item'+i+'').wrapAll('<div class="swiper-slide"></div>');
                $('.card-slider').find('.brd-item'+i+'').removeClass('brd-item'+i+'');
            }
        });

        sliderStart()
    }

    //슬라이드 시작
    function sliderStart(){

        //슬라이드 실행
        ppSwiper = new Swiper('.card-slider .brd-list-section', {
            slidesPerView: 1,
            initialSlide :Math.floor(realInx/view),
            resistanceRatio : 0,
            direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
            spaceBetween: 0, //페이지와 페이지 사이의 간격
            centeredSlides: false, //센터모드
            autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
            freeMode : false, // 슬라이드 넘길 때 위치 고정 여부
            allowTouchMove : false, // false시에 스와이핑이 되지 않으며 버튼으로만 슬라이드 조작이 가능
            watchOverflow : true, // 슬라이드가 1개 일 때 pager, button 숨김 여부 설정    
            loop : true,  // 슬라이드 반복 여부
            loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정

		    
            navigation: {
                nextEl: '.swiper-next',
                prevEl: '.swiper-prev',
            },		           
		    pagination: {                       
		         el: '.swiper-page',
  				 //clickable: true,
		          type: "fraction",
		    },
            
            on: {
                slideChange: function () {
                    realInx = this.realIndex*view
                }
            },
        });

		
		new Swiper(".p-keyword-g-slide", {
        
			direction: 'horizontal', //방향 셋팅 vertical 수직, horizontal 수평 설정이 없으면 수평
			loopAdditionalSlides : 1,// 슬라이드 반복 시 마지막 슬라이드에서 다음 슬라이드가 보여지지 않는 현상 수정        
			autoHeight : true, // 현재 활성 슬라이드높이 맞게 높이조정
	
			slidesPerView: "auto",
			spaceBetween: 0,
	
			//방향표
			navigation: {
				//다음페이지 설정
				nextEl: '.swiper-button-next',
				//이전페이지 설정
				prevEl: '.swiper-button-prev',
			},
			//접근성
			a11y: {
				prevSlideMessage: '이전 슬라이드',
				nextSlideMessage: '다음 슬라이드',
			},
	
			pagination: {
			  el: ".swiper-pagination",
			  clickable: true,
			  //type: "progressbar",
			  type: "fraction",
			},
			
			observer: true,	// 추가
			observeParents: true,	// 추가
		  });
    	}

}
	

let bWidth = window.innerWidth;
window.addEventListener("resize", () => {  
	const nWidth = window.innerWidth;  
	if ((bWidth < 1024 && nWidth >= 1024) || (bWidth > 1023 && nWidth <= 1023) || (bWidth < 640 && nWidth >= 640) || (bWidth > 639 && nWidth <= 639)) {
		    location.reload();  
		}  beforeWidth = nWidth;
});


// 랜덤으로 class 배정
function shuffleClass(index, type){
	
    var keyword_class = ["btn-keyword-green btn-keyword", "btn-keyword", "btn-keyword-gray btn-keyword", "btn-keyword-blue btn-keyword", "btn-keyword-red btn-keyword"];
    var pipeline_list_class = ["text", "text cr-red", "text cr-blue", "text cr-green", "text cr-violet"];
    var selected_class;
    var class_type;

    if(type == "keyword"){
        class_type = keyword_class;
    }else if (type == "pipeline_list"){
        class_type = pipeline_list_class;
    }

    switch (index % 5){
        case 0 :
            selected_class = class_type[0];
            break;
        case 1 :
            selected_class = class_type[1];
            break;
        case 2 :
            selected_class = class_type[2];
            break;
        case 3 :
            selected_class = class_type[3];
            break;
        case 4 :
            selected_class = class_type[4];
            break;
    }

    return selected_class;
}
