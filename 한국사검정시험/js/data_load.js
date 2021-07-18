var chasi_num = "01";
var subject_code = "imt1701";
var maxPage = 11; //총 페이지 갯수
var move_value = [1,2,3,4,5,6,7,8,9,10,11]; /* 인덱스 넘어갈 페이지 번호 */
var down_file = '강의노트_' + chasi_num + '회차.pdf'; // 다운로드자료 파일 이름
var headerStr = '';
var menuStr = '';
var controlStr = '';
var learningMapStr = '';





controlStr += '<div class="control_wrap">';
controlStr += '    <div id="area_watermark"></div>';
controlStr += '    <form class="search_naver" method="get" action="https://search.naver.com/search.naver" target="_blank">';
controlStr += '        <input type="hidden" name="ie" value="UTF-8">';
controlStr += '        <input type="hidden" name="Where" value="post">';
controlStr += '        <input type="hidden" name="st" value="sim">';
controlStr += '        <input type="hidden" name="sm" value="tab_opt">';
controlStr += '        <input type="hidden" name="date_option" value="-1">';
controlStr += '        <input type="hidden" name="srchby" value="all">';
controlStr += '        <input type="hidden" name="dup_remove" value="1">';
controlStr += '        <input type="text" value="" class="search_text" placeholder="검색어를 입력하세요." name="query">';
controlStr += '        <input type="submit" value="" class="search_submit">';
controlStr += '    </form>';
controlStr += '    <div id="play_bar_wrap">';
controlStr += '        <div id="area-bar">';
controlStr += '            <div id="play_bar_pointer"></div>';
controlStr += '            <div id="bar_display_bg">';
controlStr += '                <div id="bar_display_fill"></div>';
controlStr += '            </div>';
controlStr += '            <div id="clickBar"></div>';
controlStr += '        </div>';
controlStr += '    </div>';
//controlStr += '    <div id="area-sub">';
//controlStr += '        <div id="btn-book"><button id="book"></button></div>';
//controlStr += '    <div id="area-sub">';
//controlStr += '    </div>';
controlStr += '    <div id="area-time">';
controlStr += '        <div id="cTime">00:00</div>';
controlStr += '        <div id="slice">/</div>';
controlStr += '        <div id="tTime">00:00</div>';
controlStr += '    </div>';
controlStr += '    <div id="area-controls">';
controlStr += '        <div id="btn-play"><button id="play"></button></div>';
controlStr += '        <div id="btn-replay"><button id="restart"></button></div>';
// controlStr += '        <div id="btn-subtitle"><button id="subtitle"></button></div>';
//controlStr += '        <div id="btn-script"><a download="newfilename" href=\'./down/'+down_file+'\' target="_blink"><button id="script"></button></a></div>';
controlStr += '        <div id="btn-sound">';
controlStr += '            <button id="sound"></button>';
controlStr += '            <div id="sound_mute"></div>';
controlStr += '        </div>';
controlStr += '        <div id="sound_bar"></div>';
controlStr += '        <div id="sound_wave">';
controlStr += '            <div id="sound_display_bg">';
controlStr += '                <div id="sound_display_fill"></div>';
controlStr += '            </div>';
controlStr += '            <div id="sound_scroll">';
controlStr += '                <div id="sound_click">';
controlStr += '                    <div id="sound_display"></div>';
controlStr += '                </div>';
controlStr += '            </div>';
controlStr += '            <div id="sound_pointer"></div>';
controlStr += '        </div>';
//controlStr += '        <div id="area-speed">';
//controlStr += '            <ul id="show-curSpeed">';
//controlStr += '                <li id="x0_8" class="speed_btn">x0.8</li>';
//controlStr += '                <li id="x1_0" class="speed_btn">x1.0</li>';
//controlStr += '                <li id="x1_5" class="speed_btn">x1.5</li>';
//controlStr += '                <li id="x2_0" class="speed_btn">x2.0</li>';
//controlStr += '                <li id="display_speed">x1.0</li>';
//controlStr += '            </ul>';
//controlStr += '        </div>';
//controlStr += '        <div id="area-full-screen">';
//controlStr += '            <button type=\"button\" id="btn-full-screen" onclick=\"openFullscreen()\" value=\"false\"><i class="fas fa-arrows-alt" style="font-size:19px;transform: rotate( 45deg );"></i></button>';
//controlStr += '        </div>';
controlStr += '    </div>';
controlStr += '    <div id="area_movePage">';
controlStr += '        <div id="btn-pagemoveL"></div>';
controlStr += '        <div id="currentPage"></div>';
controlStr += '        <div id="PageBetween"></div>';
controlStr += '        <div id="totalPage"></div>';
controlStr += '        <div id="btn-pagemoveR"></div>';
controlStr += '        <div id="next_bubble"></div>'
controlStr += '    </div>';
controlStr += '</div>';

$(document).ready(function(){
	$('#header').append(headerStr);
    $('.navigation').append(controlStr);
    $('#menu').append(menuStr);
    $('#container').append(learningMapStr);
    loadComplete();
});