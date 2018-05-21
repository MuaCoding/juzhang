/* 
 * 百度地图
 */
//创建和初始化地图函数：
function initMap() {
    $("#allmap").html('');
    createMap();//创建地图
    setMapEvent();//设置地图事件
    addMapControl();//向地图添加控件
}
//创建地图函数：
function createMap() {
    window.map = new BMap.Map("allmap");//在百度地图容器中创建一个地图
    getAddressMap();
}

//地图事件设置函数：
function setMapEvent() {
    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
    map.enableScrollWheelZoom();//启用地图滚轮放大缩小
    map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
    map.enableKeyboard();//启用键盘上下左右键移动地图
}

//地图控件添加函数：
function addMapControl() {
    //向地图中添加缩放控件
    var ctrl_nav = new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_LEFT, type: BMAP_NAVIGATION_CONTROL_LARGE});
    map.addControl(ctrl_nav);
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮
    //向地图中添加缩略图控件
    var ctrl_ove = new BMap.OverviewMapControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, isOpen: 1});
    map.addControl(ctrl_ove);
    //向地图中添加比例尺控件
    var ctrl_sca = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT});
    map.addControl(ctrl_sca);
}
//
function getCurrentPosition() {
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            window.map.addOverlay(mk);
            window.map.panTo(r.point);
            window.my_point = r.point;
            window.map.centerAndZoom(r.point, 13);
        } else {
            getAddressMap();
            alert('定位服务已关闭，无法使用导航！');
        }
    }, {enableHighAccuracy: true});
}
//根据地址 显示地图--在无法开启GPS时使用
function getAddressMap() {
    var x = setFloat($('#zb_x').val());
    var y = setFloat($('#zb_y').val());
    if (x > 0 && y > 0) {
        window.map.centerAndZoom(new BMap.Point(x, y), 16);
        addOverlay(x, y);
        $('#bdmap').attr('href', 'http://api.map.baidu.com/marker?location=' + y + ',' + x + '&title=' + $('#lbs_company_name').val() + '&content=' + $('#business_address').val() + '&output=html');
    } else {
//        x = '118.035773';
//        y= '24.492589';
//        window.map.centerAndZoom(new BMap.Point(x, y), 16);
//        addOverlay(x, y);
//        $('#bdmap').attr('href', 'http://api.map.baidu.com/marker?location=' + y + ',' + x + '&title=福建省厦门市二五八集团&content=福建省厦门市海沧区钟林南路12号商务大厦28楼&output=html');
        var myGeo = new BMap.Geocoder();
        var address = $('#province').find("option:selected").text()+$('#city').find("option:selected").text()+$('#area').find("option:selected").text()+$('#business_address').val();
//        console.log(address);
        // 将地址解析结果显示在地图上,并调整地图视野
        myGeo.getPoint(address, function(point) {
            if (point) {
                window.map.centerAndZoom(point, 16);
                window.map.addOverlay(new BMap.Marker(point));
                addOverlay(point.lng, point.lat);
                $('#zb_x').val(point.lng);
                $('#zb_y').val(point.lat);
                $('#bdmap').attr('href', 'http://api.map.baidu.com/marker?location=' + point.lat + ',' + point.lng + '&title=' + $('#lbs_company_name').val() + '&content=' + $('#business_address').val() + '&output=html');
            }
        }, address);
    }
}
function setFloat(num) {
    num = parseFloat(num);
    num = isNaN(num) ? 0 : num;
    return num;
}

function mapClick(e) {
    $('#zb_x').val(e.point.lng);
    $('#zb_y').val(e.point.lat);
    window.map.clearOverlays();
    addOverlay(e.point.lng, e.point.lat);
    window.map.setDefaultCursor();
    window.map.removeEventListener("click", mapClick);
}

//添加侦听鼠标点击事件
function addEventListen() {
    window.map.addEventListener('click', mapClick);
}
//在地图添加标注
function addOverlay(lng, lat) {
    window.pt = new BMap.Point(lng, lat);
    var myIcon = new BMap.Icon("/Public/Images/mark.png", new BMap.Size(30, 30));
    window.mark = new BMap.Marker(pt);  // 创建标注
    window.map.addOverlay(mark);
    addInfo();
}
//显示标注信息
function addInfo() {
    var lbs_company_name = $('#company_name').val();
    var lbs_address = $('#business_address').val();
    var content = '<div style="margin:0;padding:0;margin:0;line-height:18px;">' +
            "公司名称：" + lbs_company_name + '<br>地址：' + lbs_address + '</div>';
    var infoWindow = new BMap.InfoWindow(content, {enableMessage: false});
    window.mark.openInfoWindow(infoWindow);
    window.mark.addEventListener("click", function() {
        this.openInfoWindow(infoWindow);
    });
}
//设置坐标
function setMark() {
    window.map.setDefaultCursor('crosshair');
    addEventListen();
}

initMap();//创建和初始化地图


//soso 街景
function sosoMap() {
    $("#allmap").html('');
    //地址解析
    var qqgeocoder, qqmap, qqmarker = null;
    qqmap = new qq.maps.Map(document.getElementById('allmap'));
    qqgeocoder = new qq.maps.Geocoder({
        complete: function(result) {
            qqmap.setCenter(result.detail.location);

            //标记
            qqmarker = new qq.maps.Marker({
                map: qqmap,
                position: result.detail.location
            });

            //街景地图
            var panoService = new qq.maps.PanoramaService();
            panoService.getPano(result.detail.location, 1000, function(result) {
                var pano = result ? result.svid : "false";
                if (pano == 'false') {
                    alert('此处无街景地图');
                    initMap();
                } else {
                    new qq.maps.Panorama(document.getElementById('allmap'), {
                        pano: pano,
                        disableMove: false,
                        disableFullScreen: false,
                        zoom: 1,
                        pov: {
                            heading: 20,
                            pitch: 10
                        }
                    });
                }
            });
        }
    });
    //坐标
    var x = setFloat($('#zb_x').val());
    var y = setFloat($('#zb_y').val());
    if (!x || !y) {
        //地址解析
        var qqaddress = document.getElementById("business_address").value;
        qqgeocoder.getLocation(qqaddress);
    } else {
        //转换百度坐标为腾讯坐标
        qq.maps.convertor.translate(new qq.maps.LatLng(y, x), 3, function(res) {
            latlng = res[0];
            var panoService = new qq.maps.PanoramaService();
            panoService.getPano(latlng, 1000, function(result) {
                var pano = result ? result.svid : "false";
                if (pano == 'false') {
                    alert('此处无街景地图');
                    initMap();
                } else {
                    new qq.maps.Panorama(document.getElementById('allmap'), {
                        pano: pano,
                        disableMove: false,
                        disableFullScreen: false,
                        zoom: 1,
                        pov: {
                            heading: 20,
                            pitch: 10
                        }
                    });
                }
            });
        });


    }
}


$(document).ready(function() {
    // 创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    var business_address = $.trim($('#business_address').val());
    var x = setFloat($('#zb_x').val());
    var y = setFloat($('#zb_y').val());
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(business_address, function(point) {
        if (point) {
            var str = '';
            $.each(point, function(key, item) {
                str += key + ':' + item + "\n";
            });
            //$('#bdmap').attr('href','http://api.map.baidu.com/marker?location='+y+','+x+'&title='+business_address+'&content='+business_address+'&output=html');

        }
    }, business_address);
});

