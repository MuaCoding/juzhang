// 百度地图

// 创建和初始化地图函数

function initMap() {
	// body...
	$("#allmap").html('');
	createMap();//创建地图
};

function createMap(){
	window.map = new BMap.Map("allmap");
	getAddressMap();
};

function getAddressMap(){
	var x = setFloat($('#zb_x').val());
	var y = setFloat($('#zb_y').val());
	if (x > 0 && y > 0) {
		window.map.centerAndZoom(new BMap.Point(x,y),16)
	}
};

function setFloat(num) {
    num = parseFloat(num);
    num = isNaN(num) ? 0 : num;
    return num;
}

initMap();//创建和初始化

$(document).ready(function() {
	var myGeo = new BMap.Geocoder();
	var business_address = $.trim($('#business_address').val());
	var x = setFloat($('#zb_x').val());
	var y = setFloat($('#zb_y').val());
	myGeo.getPoint(business_address,function(point){
		if (point) {
			var str = '';
			$.each(point, function(key,item){
				str += key + ':' + item + "\n";
			})
		}
	},business_address);
});