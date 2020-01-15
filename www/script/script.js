$(document).ready(function(){

    var lat;
    var lon;
    $.ajax({
        url: "https://ipinfo.io/geo", // 위치 정보를 알려 줌
        dataType: "json",
        success: function(res){
            var loc = res.loc;
            loc = loc.split(",");
            lat = loc[0];
            lon = loc[1];
//        alert(lat +","+ lon);
        }
    });
    
    //헤더바, 섹션 높이 설정해 주기
    var vh = $(window).outerHeight();
    var vw = $(window).outerWidth();
    function set(){
        var hh = $("#hdbar").outerHeight();
        var mh = $("#mid").outerHeight();
        var bh = $("#bot").outerHeight();
        $("section").height(vh-hh);
        $("#top").height(vh-hh-mh-bh);
        if(vw > vh){
            $("#midbot").css("margin-top", vh-hh-220 +"px");
        }else{
            $("#midbot").css("margin-top", "0px");
        }
    }
    
    set();
    
    $(window).resize(function(){
        set();                 
    });
    
    // city글자수에 따라 글자 크기 지정하기 
    function clen(){
        var len = $("#city").text().length;
        if(len >= 14){
           $("#city").addClass("stxt");
       }else{
           $("#city").removeClass("stxt");
       }
    }
    clen();
    
/****************** OpenWeatherMap *******************/    
//    http://api.openweathermap.org/data/2.5/forecast
//    q=London
//    mode=json
//    units=metric
//    appid=88635a8523ccb97c3e7dc2859405d1c2
    
    var link = "http://api.openweathermap.org/data/2.5/forecast";
    var myid = "88635a8523ccb97c3e7dc2859405d1c2";
    
    var icon = "";
    function id2icon(id){
        if(200 <= id && id < 300){
            icon = "fas fa-bolt";
        }else if(300 <= id && id <= 400){
            icon = "fas fa-cloud-rain";
        }else if(500 <= id && id < 600){
            icon = "fas fa-cloud-showers-heavy";
         }else if(600 <= id && id < 700){
            icon = "fas fa-snowflake";
         }else if(700 <= id && id < 800){
            icon = "fas fa-smog";
         }else if(800 == id){
            icon = "fas fa-sun";
         }else if(801 <= id){
            icon = "fas fa-cloud";
         }
        return icon;
    }

     var arr;
     function suc(res){
         var tz = ( (res.city.timezone / 3600) / 3);
         tz = Math.floor(tz);
         if(tz < 0){ arr = 0; }else{ arr = tz-1; }
//            $("#o-time").text(res.list[arr].dt_txt); 
             var city = res.city.name;
            $("#city").text(city); 
            var pw = res.list[arr].weather[0];
            var icontxt = id2icon(pw.id);
            $("#icon").removeClass().addClass(icontxt);
            $("#info").text(pw.description);
            var pm = res.list[arr].main;
            var temp = pm.temp;
            temp = temp.toFixed(1);
            $(".temp").text(temp);
            var pi = res.list[arr].wind;
            var speed = pi.speed;
            speed = speed.toFixed(1);
            $("#speed").text(speed);
            $("#hum").text(pm.humidity);
            var deg = pi.deg;
            $("#dir").css("transform","rotate("+ deg +"deg)");
            var max = pm.temp_max;
            var min = pm.temp_min;
            max = max.toFixed(1);
            min = min.toFixed(1);
            $("#max").text(max);
            $("#min").text(min);
        clen();
        for(i=0; i<5; i++){
            var fdate = new Date(res.list[i*8+2].dt*1000);
            var fmonth = fdate.getMonth() +1;
            var fday = fdate.getDate();
            $(".fdate").eq(i).text(fmonth +"/"+ fday);
            var code = res.list[i*8+2].weather[0].id;
            var icon = id2icon(code);
            $(".fc").eq(i).children("svg").removeClass().addClass(icon);
            var ftemp = res.list[i*8+2].main.temp;
            ftemp = ftemp.toFixed(1);
            $(".fc").eq(i).children(".ftemp").text(ftemp);
        }
        var sunset = res.city.sunset * 1000;
        sunset = new Date(sunset);
        var now = new Date();
        if(now < sunset){ // 낮
            if(city == "Seoul"){ // 선택 가능 도시
                
                $("section").css("background-image","url(images/seoul_day.jpg)");
            
            }else if(city == "Daejeon"){
                
                $("section").css("background-image","url(images/daejeon_day.jpg)");
                
            }else if(city == "Daegu"){
                
                $("section").css("background-image","url(images/daegu_day.jpg)");
            
            }else if(city == "Chiba-shi"){
                     
                $("section").css("background-image","url(images/chiba_day.jpg)");
            
            }else if(city == "Manila"){
                
               if(vw < vh){ // 세로보기
                   
                    $("section").css("background-image","url(images/manila_day.jpg)");
               
               }else{ // 가로보기
                   
                    $("section").css("background-image","url(images/manila_dayW.jpg)");
               }
            
            }else if(city == "Phnom Penh"){
                
                if(vw < vh){
                    
                    $("section").css("background-image","url(images/phnompenh_day.jpg)");
                
                }else{
                    
                    $("section").css("background-image","url(images/phnompenh_dayW.jpg)");
                    
                }
                
            }else if(city == "Busan"){
                
                $("section").css("background-image","url(images/busan_day.jpg)");
            
            }else if(city == "Bangkok"){
                
                $("section").css("background-image","url(images/bangkok_day.jpg)");
           
            }else{ // 그 외 도시
                if(icontxt == "fas fa-cloud-rain" || icontxt == "fas fa-cloud-showers-heavy"){
                    
                    $("section").css("background-image","url(images/rain_day.jpg)");
                
                }else if(icontxt == "fas fa-snowflake"){
                    
                    $("section").css("background-image","url(images/snow_day.jpg)");
                
                }else if(icontxt == "fas fa-sun"){
                    
                    $("section").css("background-image","url(images/sun_day.jpg)");
               
                }else if(icontxt == "fas fa-cloud"){
                    
                    $("section").css("background-image","url(images/cloud_day.jpg)");
                }
            }
            
        }else{ // 밤
            if(city == "Seoul"){ // 선택 가능 도시
                
                $("section").css("background-image","url(images/seoul_night.jpg)");
            
             }else if(city == "Daejeon"){
                
                $("section").css("background-image","url(images/daejeon_night.jpg)");
                
            }else if(city == "Busan"){
                
                $("section").css("background-image","url(images/busan_night.jpg)");
            
            }else if(city == "Daegu"){
                     
                $("section").css("background-image","url(images/daegu_night.jpg)");
            
            }else if(city == "Chiba-shi"){
                
                $("section").css("background-image","url(images/chiba_night.jpg)");
            
            }else if(city == "Manila"){
                
                if(vw < vh){ 
                    
                    $("section").css("background-image","url(images/manila_night.jpg)");
                }else{
                    
                    $("section").css("background-image","url(images/manila_nightW.jpg)");
                }
                
            }else if(city == "Bangkok"){
                
                $("section").css("background-image","url(images/bangkok_night.jpg)");
                
            }else if(city == "Phnom Penh"){
                
                if(vw < vh){
                    
                    $("section").css("background-image","url(images/phnompenh_night.jpg)");
                }else{
                    
                    $("section").css("background-image","url(images/phnompenh_nightW.jpg)");
                    
                }
            
            }else{ // 그 외의 도시
                if(icontxt == "fas fa-cloud-rain" || icontxt == "fas fa-cloud-showers-heavy"){
                    
                    $("section").css("background-image","url(images/rain_night.jpg)");
                
                }else if(icontxt == "fas fa-snowflake"){
                    
                    $("section").css("background-image","url(images/snow_night.jpg)");
                
                }else if(icontxt == "fas fa-sun"){
                    
                    $("section").css("background-image","url(images/sun_night.jpg)");
               
                }else if(icontxt == "fas fa-cloud"){
                    
                    $("section").css("background-image","url(images/cloud_night.jpg)");
                
                }
            }
        }
    }
    
    function upd(subject){
        var city = $(subject).attr("data");
        if(city != "custom"){  // 도시명 검색
            $.ajax({
                url: link,
                method: "GET",
                dataType: "json",
                data: {
                    "q":city,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric"
                },
                success: suc
            });
        }else{
             $.ajax({
                url: link,
                method: "GET",
                dataType: "json",
                data: {
                    "lat":lat,
                    "lon":lon,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric"
                },
                success: suc
            });
        }     
    }
    
    upd($(".cbtn:nth-of-type(2)")); // 기본값 대전으로 setting
    
    $(".cbtn").click(function(){
        upd(this);
    });
    
});