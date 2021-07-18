var con_mode = "url";
// ekorea : 러닝맵, 학습노트, 페이지 이동 숨김
// edu : 페이지 이동 숨김
// bank : 러닝맵, 배속, 페이지 이동 숨김
// hrdi : 모든 버튼 다 보임
// url : 일반

var htmlChasi; //차시
var htmlPage;  //페이지
var calcPage;  //계산을위한 임시변수
var nextPage;  //다음페이지 경로
var prevPage;  //이전페이지 경로
var currentPage; //현재페이지
var intervalMs = 30;
var volSave;
var speedSave;
var isMobile;
var con_w = 1120;
var con_h = 630;
var con_scale = 1;

calcPage = jQuery(location).attr('pathname').slice(-10);
htmlChasi = parseInt(calcPage.substr(0,2));
htmlPage = parseInt(calcPage.substr(3,2));
nextPage = insertZero(htmlChasi, true, true) + "_" + insertZero(htmlPage, true, false);
prevPage = insertZero(htmlChasi, false, true) + "_" + insertZero(htmlPage, false, false);
currentPage = calcPage.substr(0,2) + "_" + calcPage.substr(3,2); // 00_00

var media; // video OR audio
var mediaURL;
var mediaCondition = '';

// 컨트롤BAR 변수 
var totalTime;
var curTime;
var intervalSet = null;
var l1 = "00"; // 현제 분
var l2 = "00"; // 현제 초
var l3 = "00"; // 합계 분
var l4 = "00"; // 합계 초
var barPercent;
var mediaPercent; 
var movePer;   // 움직인 %
var offset;    // OFFSET(좌, 상 좌표)
var clickPer;  // 클릭한 시간 %
var clickTime; // 클릭한 시간 계산값 변수

var mediaSpeed = 1.0; // media 배속

/* Get the element you want displayed in fullscreen */ 
var elem = document.documentElement;
var binfo = null;
var ainfo = null;
var resize_first = 0;
var is_fullscreen = 0;
var global_ie_f11_count = 0;

/* ========================================= */
/* S:Btn Sound Action by.AJu (zoz0312) 		 */
/* ========================================= */
var audio_func = {
	start_now:function(){
		var audio = new Audio('./Sound/Start_now.mp3');
		audio.play();
		audio = null;
	},
	answer:function(){
		var audio = new Audio('./Sound/Answer.mp3');
		audio.play();
		audio = null;
	},
	commentary:function(){
		var audio = new Audio('./Sound/Commentary.mp3');
		audio.play();
		audio = null;
	},
	click:function(){
		var audio = new Audio('./Sound/click.mp3');
		audio.play();
		audio = null;
	},
	wrong_answer:function(){
		var audio = new Audio('./Sound/Wrong_answer.mp3');
		audio.play();
		audio = null;
	}
}
/* ========================================= */
/* E:Btn Sound Action by.AJu (zoz0312) 		 */
/* ========================================= */

$(document).ready(function(){
	if(navigator.userAgent.match(/Android|Mobile|iP(hone|od|ad)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
		isMobile = true;
	}else{
		isMobile = false;
	}
	script_view = $('#script-view'); // 자막

	$(window).resize(function(){
		setIndexPos();
		response();
	});

	//Before Full Screen
	binfo = {
		"content_wrap":{
			"position":"relative",
			"background-color":""
		},
		"container":{
			"position":"absolute",
			"width":$("#container").width(),
			"height":$("#container").height(),
			"top":"50%",
			"left":"45%",
		},
		"video_contain":{
			"position":"absolute"
		},
		"mainMedia":{
			"width":'',
			"height":''
		},
		//Quiz
		"quiz_start":{
			"top":"350px",
			"right":"780px",
			"left":""
		}
	}
	// After Full Screen
	ainfo = {
		"content_wrap":{
			"position":"absolute",
			"background-color":"#FFFFFF"
		},
		"container":{
			"position":"unset",
			"width": "0",
			"height": "0",
			"top":"0",
			"left":"0",
		},
		"video_contain":{
			"position":"unset"
		},
		"mainMedia":{
			"width":"100%",
			"height":"100%"
		},
		//Quiz
		"quiz_start":{
			"top":"55%",
			"right":"",
			"left":"10%"
		}
	}
	$(document).keyup(function(e) {
		if( e.keyCode == 27 ){
			setTimeout(function(){
				$("#btn-full-screen").val("true");
				openFullscreen();
			}, 100);
		} else if( e.keyCode == 122 || e.keyCode == "F11" ){
			if( $("#btn-full-screen").val() == "true" ){
				setTimeout(function(){
					openFullscreen();
					var elem_video = document.getElementById("mainMedia");
					elem_video.controls = false;
				}, 100);
			}
		}
	});
	window.onresize = function (event) {
		if( is_fullscreen != 0 ){
			setTimeout(function(){
				if( $("#btn-full-screen").val() == "true"){
					var agent = navigator.userAgent.toLowerCase();
					if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1) ) {
						if( resize_first <= 2 ){
							resize_first++;
							return;
						}
					} else {
						if( resize_first == 0 ){
							resize_first++;
							return;
						}
					}
					openFullscreen();
					is_fullscreen = 0;
					resize_first = 0;
				}
			}, 100);
		}
	}
});

function loadComplete(){
	if(con_mode === "ekorea"){
		$('#menu').hide();
		$('#area-sub').hide();
		$('#btn-pagemoveL, #currentPage, #totalPage, #btn-pagemoveR').hide();
	}else if(con_mode === "edu"){
		$('#btn-pagemoveL, #currentPage, #totalPage, #btn-pagemoveR').hide();
	}else if(con_mode === "bank"){
		$('button#book').hide();
		$('#area-speed').hide();
		$('#btn-pagemoveL, #currentPage, #totalPage, #btn-pagemoveR').hide();
	}
	response();
	$barArea    = $('#area-bar'); // 플레이바 드래그앤드롭 인식
    $barWrap    = $('#play_bar_wrap'); // 플레이바 클릭 인식
    $play_bar_pointer = $('#play_bar_pointer');
    $bar_display_bg = $('#bar_display_bg');
    $bar_display_fill = $('#bar_display_fill');

    soundWrap   = $('#sound_wave');
    soundScroll = $('#sound_scroll'); // 사운드바 드래그앤드롭 인식
    soundClick  = $('#sound_click'); // 사운드바 클릭 인식
    fillSound   = $('#sound_display_fill');
    soundPointer = $('#sound_pointer');

    $barWrap[0].onmousedown = circle_move; // 컨트롤바 클릭 이벤트
    $barArea[0].onmousedown = function(event){ // 컨트롤 포인터 드래그 이벤트
    	document.onmousemove = circle_move;
    }
    $play_bar_pointer[0].onmousedown = function(event) { // 컨트롤바 드래그 이벤트
        document.onmousemove = circle_move; 
    }
    soundClick[0].onmousedown = control_sound; // 사운드바 클릭 이벤트
    soundPointer[0].onmousedown = function(event){ // 사운드바 포인터 드래그 이벤트
        document.onmousemove = control_sound;
    }
    soundScroll[0].onmousedown = function(event){ // 사운드바 드래그 이벤트
    	document.onmousemove = control_sound;
    }   
    document.onmouseup = function(event) { // 컨트롤바,사운드바 마우스 뗄때 이벤트
        document.onmousemove = null; 
    }

    mediaControl();
    speedControl();

    if( $('#mainMedia').is("video") ){
				mediaURL = "./vod/" + calcPage.substr(0,2)+ "_" + calcPage.substr(3,2) + ".mp4";
				//mediaURL = "http://mp4.teacherville.co.kr:8080/teacherville/1000473/m/" + calcPage.substr(0,2)+ "_" + calcPage.substr(3,2) + ".mp4";
    } else {
				mediaURL = "./sounds/" + calcPage.substr(0,2)+ "_" + calcPage.substr(3,2) + ".mp3";
				//mediaURL = "http://mp4.teacherville.co.kr:8080/teacherville/1000473/" + calcPage.substr(0,2)+ "_" + calcPage.substr(3,2) + ".mp4";
		}
    $('#mainMedia').attr('src', mediaURL);
    media = $('#mainMedia').get(0);
    media_reset();
		media.oncanplaythrough = media_reset;

    if(isMobile){ // 모바일일 때
    	$('#container').append('<div id="mobile_play"><img src="./images/mobile_play.png"/></div>'); // 재생유도버튼 추가
    	$('#mobile_play').click(function(){
    		media.play();
    		mediaCondition = 'play';
    		$('#mobile_play').hide();
    	});
    	/*if($('#mainMedia').is("video")){ // 비디오 클릭하면 멈춤
    		$('#mainMedia').click(function(){
    			media.pause();
    			mediaCondition = 'pause';
    			$('#mobile_play').show();
    		});
    	}*/
    	if(con_mode == "ekorea"){
	    	$('#area-sub').hide(); // 버튼들 숨김
	    	$('#btn-sound').hide();
	    	$('#sound_wave').hide();
				$('#area-speed').hide();
				$('#btn-pagemoveL, #currentPage, #totalPage, #btn-pagemoveR').hide();
		}	else{
			$('#btn-sound').hide();
			$('#sound_wave').hide();
		}
	}else{ // pc일 때
   		media.play(); // 영상, 음성 자동재생
   		mediaCondition = 'play';
	}

    intervalSet = setInterval( setTimer, intervalMs );

    var pageSrc = "images/paging" + htmlPage + ".png";
    var nextPageURL = nextPage+".html";
    var prevPageURL = prevPage+".html";
    var script_htmlPage = htmlPage - 1;
    pageControl();
    $('#prev').data('url', prevPageURL);
    $('#next').data('url', nextPageURL);
    $('#script-text').html(scriptValue[script_htmlPage]);
    setIndexCurrent();
    setIndexPos();
    setIndexMove();
    $('#index').on('click', function(){
        if($('#menu').hasClass('on')){
            $('#menu').removeClass('on');
        }else{
            $('#menu').addClass('on');
        }
    });
    learning_map_light();
}
function media_reset(){
	var tmpVol = getCookie('volume' + '_' + subject_code + '_' + chasi_num);
    if(tmpVol){
    	control_volume(tmpVol);
    }else{
    	control_volume(1);
    }
    if (media.volume <= 0.01){
		media.muted = true;
		$('#sound_mute').show();
	}else{
		media.muted = false;
		$('#sound_mute').hide();
	}
    soundPointer.css('left', media.volume * 100 + '%');

    var tmpSpeed = Number(getCookie('speed' + '_' + subject_code + '_' + chasi_num));
    if(tmpSpeed){
    	media.playbackRate = tmpSpeed;
    	if(tmpSpeed == 0.8){
    		$('#display_speed').html('x0.8');
    	}else if(tmpSpeed == 1.0){
    		$('#display_speed').html('x1.0');
    	}else if(tmpSpeed == 1.5){
    		$('#display_speed').html('x1.5');
    	}else if(tmpSpeed == 2.0){
    		$('#display_speed').html('x2.0');
    	}
    }else{
    	$('#display_speed').html('x1.0');
    }
}
function response(){
	var win_w = $(window).width();
	var win_h = $(window).height();
	if(win_w < con_w){
		con_scale = win_w/con_w;
	}else{
		con_scale = 1;
	}

	$('#content_wrap').css('transform', 'scale(' + con_scale + ')');
}

	var frame = $('<iframe/>',{
		id : "contentView",
		name : "contentView",
		src : contentSrc,
		allowfullscreen : true,
		allow : "autoplay",
		style : winSize + "border:none; scrolling:no; overflow:hidden; frameborder:0; marginheight:0; marginwidth:0;"
	});

function learning_map_light(){
	var chasiNum = replaceZero(htmlChasi);
	var $target = $('#learning_map_wrap #chasi' + chasiNum);
	var $target_dt = $target.siblings('dt');
	$target.addClass('on');
	$target_dt.addClass('on');
}




function setIndexCurrent(){
	for(var i = 0; i < move_value.length; i++){
		if(htmlPage >= move_value[i]){
			$('.current').removeClass('current');
			$('.p_current').removeClass('p_current');
			$('#index-move' + (i + 1)).addClass('current');
			$('#index-move' + (i + 1)).parent().parent().find('.title').addClass('p_current');
		}
	}
}
function setIndexPos(){
	var $menu = $('#menu');
	var height = $menu.height();
	var set_top = (height / 2) / con_scale;
	$menu.css('margin-top', -(set_top) + 'px');
}
function setIndexMove(){
	var total_id = move_value.length;
	var total_box = $('#menu .box').length;
	
	for(var i=1; i<=total_id; i++){
		var index_id = "#index-move"+i;
		var location_html = replaceZero(htmlChasi)+"_"+replaceZero(move_value[i-1])+".html";
		
		$(index_id).data('url', location_html);
		$(index_id).click(function(){
			self.location.href = $(this).data('url');
		});
	}

	for(var i = 1; i <= total_box; i++){
		var $target = $('#menu .box' + i + ' .items li:first-child');
		var $title_btn = $('#menu .box' + i + ' .title');
		$title_btn.data('url', $target.data('url'));
		$title_btn.click(function(){
			self.location.href = $(this).data('url');
		});
	}
}
function setTimer(){
	curTime = media.currentTime;
	totalTime = media.duration;
	if(isNaN(totalTime)){
		totalTime = 0;
	}
	if(curTime > totalTime){
		curTime = totalTime;
	}
	l1 = replaceZero(parseInt(curTime/60));
	l2 = replaceZero(parseInt(curTime%60));
	l3 = replaceZero(parseInt(totalTime/60));
	l4 = replaceZero(parseInt(totalTime%60));
	$('#cTime').text(l1+":"+l2);
	$('#tTime').text(l3+":"+l4);

	mediaPercent = (curTime/totalTime)*100;
	barPercent = (px_to_num($bar_display_fill.css('width'))/px_to_num($barArea.css('width')));
	$bar_display_fill.css('width', percent_to_px(mediaPercent));
	$play_bar_pointer.css('margin-left', 'calc(' + mediaPercent + '% - 12px)');
	if (media.paused) {
		$('#btn-play button').attr('id', 'play');
	} else {
		$('#btn-play button').attr('id', 'pause');
	}
}
function circle_move(event) {
	offset = $barArea.offset();
	clickPer = px_to_num(event.pageX - offset.left);
	movePer = clickPer/$barArea.width() * 100;
	movePer = movePer.toFixed(2);
	$bar_display_fill.css('width', percent_to_px(movePer));
	$play_bar_pointer.css('margin-left', 'calc(' + movePer + '% - 12px)');
	movePer = movePer/100;
	movePer = movePer.toFixed(2);
	clickTime = totalTime * movePer;
	clickTime = clickTime.toFixed(2);
	media.currentTime = clickTime;
}
function control_sound(event){
	var offset = soundWrap.offset();
	var clickPer = px_to_num(event.pageX - offset.left);
	var movePer = clickPer/soundWrap.width() * 100;
	movePer = Math.floor(movePer);
	if(movePer < 0){
		movePer = 0;
	}else if(movePer > 100){
		movePer = 100;
	}
	var resultVolume = movePer / 100;
	control_volume(resultVolume);
}
function control_volume(vol){
	media.volume = vol;
	fillSound.css('width', (vol * 100) + '%');
	soundPointer.css('left', (vol * 100) + '%');
	if (media.volume <= 0.01){
		media.muted = true;
		setCookie("volume" + '_' + subject_code + '_' + chasi_num, 0, 1);
		$('#sound_mute').show();
	}else{
		media.muted = false;
		setCookie("volume" + '_' + subject_code + '_' + chasi_num, vol, 1);
		$('#sound_mute').hide();
	}
}
/* area-controls SCRIPT */
function mediaControl(){
	$('#display_speed').click(function(){
		if($('#show-curSpeed').hasClass('on')){
			$('#show-curSpeed').removeClass('on');
		}else{
			$('#show-curSpeed').addClass('on');
		}		
	});
	$('#btn-book').click(function(){
		media.pause();
		$('#learning_map_wrap').addClass('on').show();
	});
	$('#learning_map_close').click(function(){
		if(mediaCondition === 'play'){
			media.play();
			media_reset();
		}
		$('#learning_map_wrap').hide();
	});
	$('#btn-disk').click(function(){
		var file = "./down/" + down_file;
		window.open(file,'','');
	});
	$('#play, #pause').click(function() {
		var button = $(this);
	   if (media.paused) {
		  media.play();
		  media_reset();
		  mediaCondition = 'play';
	   } else {
		  media.pause();
		  mediaCondition = 'pause';
	   }
	});

	$('#restart').click(function() {
		media.currentTime = 0;
		$('#next_bubble').fadeOut();
		if (media.paused) {
		  media.play();
		  mediaCondition = 'play';
	   }
	});
	
	$('#script').click(function() {
		script_view.toggle();
	});
	
	$('#sound').click(function() {
		if (media.muted) {
			media.muted = false;
			control_volume(1);
			$('#sound_mute').hide();
		} else {
			volSave = media.volume;
			media.muted = true;
			control_volume(0);
			$('#sound_mute').show();
		}

	});
}
/* movieSpeed SCRIPT */
function speedControl(){
	var $display_speed = $('#display_speed');
	$('#x0_8').click(function(){
		$display_speed.html('x0.8');
		media.playbackRate = 0.8;
		setCookie("speed" + '_' + subject_code + '_' + chasi_num, 0.8, 1);
		$('#show-curSpeed').removeClass('on');
	});
	$('#x1_0').click(function(){
		$display_speed.html('x1.0');
		media.playbackRate = 1.0;
		setCookie("speed" + '_' + subject_code + '_' + chasi_num, 1.0, 1);
		$('#show-curSpeed').removeClass('on');
	});
	$('#x1_5').click(function(){
		$display_speed.html('x1.5');
		media.playbackRate = 1.5;
		setCookie("speed" + '_' + subject_code + '_' + chasi_num, 1.5, 1);
		$('#show-curSpeed').removeClass('on');
	});
	$('#x2_0').click(function(){
		$display_speed.html('x2.0');
		media.playbackRate = 2.0;
		setCookie("speed" + '_' + subject_code + '_' + chasi_num, 2.0, 1);
		$('#show-curSpeed').removeClass('on');
	});
}

	if (objInFrame != null) {
						$(objInFrame).attr("width", "100%");
						$(objInFrame).attr("height", "100%");
						$(objInFrame).attr("allowfullscreen", true);
					}
/* movePage SCRIPT */
function pageControl(){
	var nextPageURL = nextPage+".html";
	var prevPageURL = prevPage+".html";

	if( htmlPage != 1 ){
		$('#btn-pagemoveL').click(function() {
			var audio = new Audio('./Sound/Before.mp3');
			audio.play();
			$(this).data('url', prevPageURL);
			self.location.href = $(this).data('url');
		});
	}
	
	if( htmlPage != maxPage ){
		$('#btn-pagemoveR').click(function() {
			var audio = new Audio('./Sound/Next.mp3');
			audio.play();
			$(this).data('url', nextPageURL);
			self.location.href = $(this).data('url');
		});
	}

//	if( calcPage.substr(3,2) == "03" ){
//		$("#area-full-screen").hide();
//	}

	$('#currentPage').text(calcPage.substr(3,2));
	$('#PageBetween').text("l");
	$('#totalPage').text(replaceZero(maxPage));
}
/*********** 평가하기 ***********/
function offClick(qNum){
	$('.quiz_wrap.q' + qNum + ' .select').unbind('click');
}
//----------- 정답확인 함수
function ansChk(qNum, clickNum){
	var correct = false;
	change_reTest -= 1;

	if( ans_num[qNum-1] == clickNum ){ // 정답
		audio_func.commentary();
		$('#se_quiz_correct')[0].play();
		call_alert('correct');
		ans_ani(qNum, clickNum);
		offClick(qNum);
		change_reTest = reTest;

		$('.q' + qNum + ' .display_correct').css('background', "url(./images/correct_O.png)");
		$('.q' + qNum + ' .display_correct').css("visibility", "visible");
		$('#review' + qNum + ' .re_correct').css('background', 'url(./images/review_o.png)');

		audio_func.answer();
		return true;
	} else {
		audio_func.wrong_answer();
		if( change_reTest == 0 ){ // 2번 모두 틀림
			audio_func.commentary();
			$('#se_quiz_wrong')[0].play();
			call_alert('wrong');
			ans_ani(qNum, clickNum);
			offClick(qNum);
			change_reTest = reTest;

			$('.q' + qNum + ' .display_correct').css('background', "url(./images/correct_X.png)");
			$('.q' + qNum + ' .display_correct').css("visibility", "visible");
			$('#review' + qNum + ' .re_correct').css('background', 'url(./images/review_x.png)');
			rewrong.push(qNum);
			return false;
		} else { // 1번틀림
			$('#se_quiz_wrong')[0].play();
			call_alert('re');
		}
	}
}
//----------- 패이지 넘어갈때 DIV가리는 함수 
function page_visible(num){
	$('.review').removeClass('on');
	$('#review' + num).addClass('on');
	$('.quiz_wrap').hide();
	$('.quiz_wrap.q' + num).show();
};
//----------- 정답이미지 애니메이션 함수
function ans_ani(qNum, clickNum){
	var $target = $('.quiz_wrap.q' + qNum);
	$target.find('.answer_area').show();
	$target.find('.select').addClass('end');
	$target.find('.select.quiz' + ans_num[qNum-1]).addClass('answer');
	$target.find('.select.quiz' + clickNum).addClass('click');
};
//----------- 퀴즈 초기화
function quiz_reset(list){
	$('.quiz_wrap.q1 .btnNext').removeClass('result').show();
	$('.quiz_wrap.q2 .btnNext2').removeClass('result').show();
	$('.review').unbind('click');
	$('.display_review').removeClass('review_mode');
	$('#pageAns').hide();
	$('.quiz_wrap').hide();
	if(!list){
		$('.re_correct').css('background', 'none');
		$('.display_correct').css("visibility", "hidden");
		$('.select').removeClass('end');
		$('.select').removeClass('click');
		$('.select').removeClass('answer');
		$('.answer_area').hide();
	}else{
		for(var i = 0; i < list.length; i++){
			$('#review' + list[i] + ' .re_correct').css('background', 'none');
			$('.q' + list[i] + ' .display_correct').css("visibility", "hidden");
			$('.q' + list[i] + ' .select').removeClass('end');
			$('.q' + list[i] + ' .select').removeClass('click');
			$('.q' + list[i] + ' .select').removeClass('answer');
			$('.q' + list[i] + ' .answer_area').hide();
		}
	}
};
function call_alert(str){
	$('#container').append('<div id="alert_wrap"></div>');
	if(str === "correct"){
		$('#alert_wrap').append('<div id="alert_correct" class="alert_content"></div>');
	}else if(str === "wrong"){
		$('#alert_wrap').append('<div id="alert_wrong" class="alert_content"></div>');
	}else if(str === "re"){
		$('#alert_wrap').append('<div id="alert_re" class="alert_content"></div>');
	}
	$('#alert_wrap').fadeIn(200);
	setTimeout(function(){
		$('#alert_wrap').fadeOut(200, function(){
			$('#alert_wrap').detach();
		});
	}, 1000);
}
function call_imagePopup(url){
	var urlArray = [];
	urlArray = url.split(',');
	$('#container').append('<div id="popup_wrap"><div id="popup_close"></div></div>');
	$('#popup_wrap').append('<div id="popup"></div>');
	for(var i = 0; i < urlArray.length; i++){
		$('#popup').append('<img src="' + urlArray[i] + '"/>');
	}
	$('#popup_wrap').show();
	$('#popup_close').click(function(){
		$('#popup_wrap').hide();
		$('#popup_wrap').detach();
	});
}
/*********** 요점정리 ***********/
function changeImg( next ){
	var currentPage = "#page"+imgNum;
	var movePage = "";
	$(currentPage).hide();

	if ( next ) {
		imgNum++;
		if ( imgNum < totalPage ){
			$('#page_organize_prev').removeClass('off');
		} else {
			imgNum = totalPage;
			$('#page_organize_next').addClass('off');
			$('#page_organize_prev').removeClass('off');
		}
	} else {
		imgNum--;
		if ( imgNum > 1 ){
			$('#page_organize_next').removeClass('off');
		} else {
			imgNum = 1;
			$('#page_organize_prev').addClass('off');
			$('#page_organize_next').removeClass('off');
		}
	}
	if(imgNum == totalPage){
		$('#next_bubble').fadeIn();
	}
	movePage = "#page"+imgNum;
	$(movePage).show();
	$('#paging_organize .front').html(imgNum);
};

//put('px')
function num_to_px(num) {
	return num + 'px';
}
function percent_to_px(num) {
	return num + '%';
}
//remove('px')
function px_to_num(px) {
	return Number(px.toString().replace('px',''));
}
function replaceZero( num ){
	if( num <10 ){
		return "0"+num;
	} else {
		return num;
	}
}
//0 넣어주는 함수 ( 숫자, 다음페이지 여부, 차시인지 여부, 현제페이지 )
function insertZero( num, next, chasi ){
	chasi? "" : next? num+=1 : num-=1;
	
	if( num < 10 ){
		return "0"+num;
	} else {
		return num;
	}
};

//쿠키설정
function setCookie(cName, cValue, cDay){
	var expire = new Date();
	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; 
	if(typeof cDay != 'undefined'){
		cookies += ';expires=' + expire.toGMTString() + ';';
	}
	document.cookie = cookies;
}

function setCookie2(cName, cValue){
	var expire = new Date();
	expire.setTime(expire.getTime() + 2000);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; 
	cookies += ';expires=' + expire.toGMTString() + ';';
	document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
		//log("cName : " + cName);
		cName = cName + '=';
		var cookieData = document.cookie;
		var start = cookieData.indexOf(cName);
		var cValue = '';
		if(start != -1){
			start += cName.length;
			var end = cookieData.indexOf(';', start);
			if(end == -1)end = cookieData.length;
			cValue = cookieData.substring(start, end);
		}
		return unescape(cValue);
}

// 0306 추가 돌발퀴즈, 적용하기 초기화
function sudden_quiz_reset(){
	$('#page1_quiz1 .ox').css('display', 'none');
	$('#page1_quiz1 .ox').css('opacity', 0);
	$('#page1_quiz2 .ox').css('display', 'none');
	$('#page1_quiz2 .ox').css('opacity', 0);
	$('#sudden_display_correct').css('background', 'none').hide();
	$('#page1_answer1').hide().css({
		'bottom': '0px',
		'opacity': 0
	});
	$('#page1_quiz1 .answer_display').css('display', 'none');
	$('#page1_quiz2 .answer_display').css('display', 'none');
	$('#page1_quiz1').removeClass('answer');
	$('#page1_quiz2').removeClass('answer');
	$('#page1_quiz1').removeClass('end');
	$('#page1_quiz2').removeClass('end');
}

function drag_quiz_reset(){
	$('#etc_obj .explan .label').html('보기');
	$('#etc_obj .text').hide();
	$('.drag_result').css('background', 'none');
	$('.drop_obj').each(function(idx){
		var $drop = $(this);
		$drop.attr('data-chance', 2);
		$drop.removeClass('end');
	});
	$('.drag_obj').each(function(){
		var $drag = $(this);
		$drag.show();
		$drag.css('top', $drag.attr('data-top'));
		$drag.css('left', $drag.attr('data-left'));
		$drag.attr('data-answer', $drag.attr('data-saveAnswer'));
		$drag.draggable('enable');
	});
}

function org_reset(num){
	for(var i = 1; i <= num; i++){
		changeImg(false);
	}
}

/* ========================================= */
/* S:full-screen btn action by.AJu (zoz0312) */
/* ========================================= */
function openFullscreen() {
	var elem_video = document.getElementById("mainMedia"); 
	if( $("#btn-full-screen").val() == "true" ){
		if (elem_video.exitFullscreen)
			elem_video.exitFullscreen();
		else if (elem_video.webkitExitFullscreen) // Chrome, Safari (webkit)
			elem_video.webkitExitFullscreen();
		else if (elem_video.mozCancelFullScreen) // Firefox
			elem_video.mozCancelFullScreen();
		else if (elem_video.msExitFullscreen) // IE or Edge
			elem_video.msExitFullscreen();
		elem_video.controls = false;
		$("#btn-full-screen").val("false");
	} else {
		if (elem_video.requestFullscreen) {
			elem_video.requestFullscreen();
		} else if (elem_video.mozRequestFullScreen) {
			elem_video.mozRequestFullScreen();
		} else if (elem_video.webkitRequestFullscreen) {
			elem_video.webkitRequestFullscreen();
		} else if (elem_video.msRequestFullscreen) {
			elem_video.msRequestFullscreen();
		}
		is_fullscreen = $("body").height();
		elem_video.controls = true;
		$("#btn-full-screen").val("true");
	}
}

/* ========================================= */
/* E:full-screen btn action by.AJu (zoz0312) */
/* ========================================= */
