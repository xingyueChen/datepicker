/*
	*date插件
	*by lpw
	*20151118
	*version of ceshi
*/

var Dates = {
	min:"1900-01-01 00:00:00",
	max:"2099-12-31 23:59:59",
	format:"yyyy-MM-dd" //y and d 请用小写
},nowTime=new Date();
Dates.isLeap = function(y){
	return (year%4 === 0 && year%100 !== 0) || year%400 === 0;
}
Dates.month=[31,null,31,30,31,30,31,31,30,31,30,31];

Dates.nowDate={};
Dates.nowDate.year=nowTime.getFullYear();
Dates.nowDate.month=nowTime.getMonth();
Dates.nowDate.day=nowTime.getDate();
Date.prototype.format =function(format){
	var o = {
	"M+" : this.getMonth()+1, //month
	"d+" : this.getDate(), //day
	"h+" : this.getHours(), //hour
	"m+" : this.getMinutes(), //minute
	"s+" : this.getSeconds(), //second
	"q+" : Math.floor((this.getMonth()+3)/3), //quarter
	"S" : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
	(this.getFullYear()+"").substr(4- RegExp.$1.length));
	for(var k in o)if(new RegExp("("+ k +")").test(format))
	format = format.replace(RegExp.$1,
	RegExp.$1.length==1? o[k] :
	("00"+ o[k]).substr((""+ o[k]).length));
	return format;
}

//====初始化日期===//
Dates.viewtds = function(y,m){
	Dates.isLeap?Dates.month[1] = 29:Dates.month[1] = 28;
	//确定当月1号
	var tmonth = m+1,smonth;
	smonth = tmonth<10?"0"+tmonth:tmonth;
	var firstDay = y+"-"+smonth+"-01";

	var n = new Date(firstDay).getDay(),num = [];
	var pre=m-1<0?Dates.month[11]:Dates.month[m-1],
	next=m+1>11?Dates.month[0]:Dates.month[m+1],
	now=Dates.month[m],k=2,c=0,str="";
	//将当月的上月的day放进num[]
	for(var i = n-1;i>=0;i--){
		num[i] = pre - c;
		c++;
	}
	num[n]=1;
	n = n+1;
	//将当月的day放进num[]
	for(var j = n;k<=now;j++,k++){
		num[j]= k;		
	}
	c = 0;
	//将当月的下月的day放进num[]
	for(var a = j;a<42;a++){
		num[a] = ++c;
	}
	//创建td
	for(i=0;i<42;i++){	
		if(i%7==0){
			str+="<tr><td>"+num[i]+"</td>";
		}else{
			if(i%7==6){
				str+="<td>"+num[i]+"</td></tr>";
			}else{
				str+="<td>"+num[i]+"</td>";
			}
		}			
	}
	return str;
}

//创建th
Dates.inilizeTh = function(){
	var week = ['日','一','二','三','四','五','六'];
	var str = "<table><tr class='tr_01'>";
	for(var i in week){
		str+="<th>"+week[i]+"</th>";
	}
	str+="</tr>";
	return str;
}
//初始化days
Dates.inilizeDays = function(){
	return Dates.inilizeTh()+Dates.viewtds(Dates.nowDate.year,Dates.nowDate.month)+"</table>";
}
//change days
Dates.changeDays = function(y,m){
	var days =  Dates.inilizeTh()+Dates.viewtds(y,m)+"</table>";
	document.getElementById("laydays").innerHTML = days;
	Dates.clickedDay(0);
	bindTDs();
}
//====初始化窗口===//
Dates.inilizeViews = function(){
	var div = document.createElement('div');
	div.id = "laydate";
	div.className = "datePanel"
	var html = '<div class="yearMonth">'+
				'<div class="year"><cite class="left"></cite><input id="layear" readonly /><cite class="right"></cite></div>'+
				'<div class="month"><cite class="left"></cite><input id="laymonth" readonly />'+
				'<cite class="right"></cite></div>'+
			'</div>'+
			'<div class="days" id="laydays">'+
				Dates.inilizeDays();
	html+='</div>'+
			'<div class="btns">'+				
				'<input type="button" value="取消" class="btn_alone" onclick="javascript:removeDates()"/>'+			
				'<input type="button" value="今天" class="btn_today" onclick="javascript:setDates()"/>'+
				'<input type="button" value="确认" class="btn_confirm" onclick="javascript:confirmDay()"/>'+
			'</div>';
	div.innerHTML = html
	object.parentNode.appendChild(div);
	document.getElementById("layear").value = Dates.nowDate.year;
	document.getElementById("laymonth").value = Dates.nowDate.month+1;
	Dates.clickedDay(1);
	setPos();	
}
Dates.clickedDay = function(f){
	var days = document.getElementById("laydays").getElementsByTagName("td");
	var y = parseInt(document.getElementById("layear").value);
	var v = parseInt(document.getElementById("laymonth").value);
	if(y==Dates.nowDate.year && v == Dates.nowDate.month+1){
		f=1;
	}
	for(var i in days){
		if(f == 1 && days[i].innerHTML == Dates.nowDate.day){
			days[i].className = "clicked";
			break;
		}else if(f==0 && days[i].innerHTML==1){		
			days[i].className = "clicked";
			break;
		}
	}
}
//====删除绑定时间===//
Dates.bindEvent = function(){	
	var c = document.getElementsByTagName("cite");
	var minMF = function(e){
		var y = parseInt(document.getElementById("layear").value);
		var v = parseInt(document.getElementById("laymonth").value);
		if(v==1){
			v = 12;
			y = y-1;
		}else {
			v = v-1;
		}
		document.getElementById("laymonth").value = v;
		document.getElementById("layear").value = y;
		Dates.changeDays(y,v-1);
	}
	var addMF = function(e){
		var y = parseInt(document.getElementById("layear").value);
		var v = parseInt(document.getElementById("laymonth").value);
		if(v==12){
			v = 1;
			y = y+1;
		}else {
			v = v+1;
		}
		document.getElementById("laymonth").value = v;
		document.getElementById("layear").value = y;
		Dates.changeDays(y,v-1);
	}
	var addYF = function(e){
		var y = parseInt(document.getElementById("layear").value);
		var v = parseInt(document.getElementById("laymonth").value);
		y++;
		document.getElementById("layear").value = y;
		Dates.changeDays(y,v-1);
	}
	var minYF = function(e){
		var y = parseInt(document.getElementById("layear").value);
		var v = parseInt(document.getElementById("laymonth").value);
		y--;
		document.getElementById("layear").value = y;
		Dates.changeDays(y,v-1);
	}
	
	if(window.addEventListener){ // Mozilla, Netscape, Firefox 
        c[3].addEventListener('click', addMF, false); 
		c[2].addEventListener('click', minMF, false);
		c[1].addEventListener('click', addYF, false);
		c[0].addEventListener('click', minYF, false);	
    } else { // IE 
        c[3].attachEvent('onclick',  addMF);
		c[2].attachEvent('onclick',  minMF);
		c[1].attachEvent('onclick', addYF);
		c[0].attachEvent('onclick', minYF);		
    } 	
	bindTDs();
}
//=====td事件绑定======
function bindTDs(){
	var days = document.getElementById("laydays").getElementsByTagName("td");
	var tdClick = function(){
		var e = this;
		for(var i in days){
			days[i].className = "";
		}
		e.className = "clicked";
	}
	for(var j = 0;j<42;j++){
		if(window.addEventListener){ // Mozilla, Netscape, Firefox 
			days[j].addEventListener('click', tdClick, false); 	
		} else { // IE 
			days[j].attachEvent('onclick',  tdClick);
		}		
	}
}
//=====设置组件位置====
function setPos(){
	var pos = GetRect(object);
	var t = document.getElementById("laydate");
	t.style.left = pos.left+"px";
	t.style.top = pos.top+pos.height+"px";
}
//===获取组件位置
function GetRect (element) {
    var rect = element.getBoundingClientRect();
    var top = document.documentElement.clientTop;
    var left= document.documentElement.clientLeft;
    return{
        top    :   rect.top - top,
        left   :   rect.left - left,
		height :   element.offsetHeight
    }
}
//====删除窗口===//
window.removeDates = function(){
	var d = document.getElementById("laydate");
	object.parentNode.removeChild(d);
}
window.setDates = function(){
	object.value = new Date().format(Dates.format);
	removeDates();
}
window.confirmDay = function(){
	var days = document.getElementById("laydays").getElementsByTagName("td");
	var y = document.getElementById("layear").value,
	    m = parseInt(document.getElementById("laymonth").value),d;
	for(var i in days){
		if(days[i].className=="clicked"){
			d = parseInt(days[i].innerHTML);
		}
	}
	m = m<10?"0"+m:m;
	d = d<10?"0"+d:d;
	object.value = new Date(y+"-"+m+"-"+d).format(Dates.format);
	removeDates();
}
//入口
window.laydate = function (e){
	object = e;
    var d = document.getElementById("laydate");
	if(d){
		return;
	}
	Dates.inilizeViews();
	Dates.bindEvent();
}
