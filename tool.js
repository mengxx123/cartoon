

//获取系统base路径
function getBasePath(){
	var paras = document.getElementsByTagName("base");
	return paras[0]["href"];
}


//jquery请求session过期跳转
function timeoutJump(XMLHttpRequest){
	if(XMLHttpRequest.status == 508){//服务器处理请求时检测到一个无限循环
		return;
	}
	if(XMLHttpRequest.status == 400){//请求错误
		alert("请求错误");
		return;
	}
	if(XMLHttpRequest.getResponseHeader("jumpPath") != null && XMLHttpRequest.getResponseHeader("jumpPath") != ""){//session登陆超时登陆页面响应http头
 		//收到未登陆标记，执行登陆页面跳转
 		window.location.href= getBasePath()+XMLHttpRequest.getResponseHeader("jumpPath");
 		
 		return;
 	}
}


/**
 * 获取URL参数
 * @param name 参数名称
 * @returns
 */
function getUrlParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r!=null) return unescape(r[2]); return null; //返回参数值
} 


/**
 * 读取Csrf参数
 * <meta name="csrfToken" content="${token}"/>
 */
function getCsrf(){
	var meta = document.getElementsByTagName("meta");
	for(var i=0;i <meta.length;i++){  
		if(meta[i].name == "csrfToken"){
			return meta[i].getAttribute("content");
		}
	}  
	//var token = document.getElementsByTagName("meta")["csrfToken"].getAttribute("content");//IE7获取不到信息
	//$('meta[name="csrfToken"]').attr("content")
	return "";  
}



//构造新URI   url:url中"?"符后的字串    replace:替换字符     value:值
function newURI(uri,replace,value) {
	var newURL = "";
	//是否存在
	var isExist = false;
	if (uri.indexOf("?") != -1) {
		var str = uri.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			if(strs[i] !=""){
				if(replace == strs[i].split("=")[0]){
					isExist = true;
					newURL= newURL+ "&"+strs[i].split("=")[0]+"="+value;
				}else{
					newURL= newURL+ "&"+strs[i].split("=")[0]+"="+strs[i].split("=")[1];
				}
			}
		}
	}
	if(isExist == false){
		newURL= newURL+ "&"+replace+"="+value;
	}
	//删除第一个&
	if(newURL.length >0){
		newURL= newURL.substr(1);
	}
 	if(newURL.length >0){
 		return "?"+newURL;
 	}else{
 		return newURL;
 	}
}

//到指定的分页页面
function topage(page){
	var url = "";
	//通讯协议
	var protocol = window.location.protocol;
	url = url+protocol+"//";
	//主机
	var host = window.location.host;  
	url = url+host;
	//路径部分
	var pathname = window.location.pathname;  
	url = url+pathname;
	
	var uri = location.search; //获取url中"?"符后的字串
	//参数
	var parameters = newURI(uri,"page",page);
	url = url+parameters;

	window.location.href = url;
}

//UTF8字符集实际长度计算 
function getStringLeng(str){    
	var realLength = 0;     
	var len = str.length;     
	var charCode = -1;     
	for(var i = 0; i < len; i++){         
		charCode = str.charCodeAt(i);         
		if (charCode >= 0 && charCode <= 128) {              
			realLength += 1;        
		}else{   
			// 如果是中文则长度加3             
			realLength += 3;       
		}    
	}     
	return realLength; 
} 
//去掉字符串前后空格
function trim(str){   

    str = str.replace(/^(\s|\u00A0)+/,'');   
    for(var i=str.length-1; i>=0; i--){   
        if(/\S/.test(str.charAt(i))){   
            str = str.substring(0, i+1);   
            break;   
        }   
    }   
    return str; 
}  
		
		
//取得表格的伪属性("类型:如tr;td ","name值")
var getElementsByName_pseudo = function(tag, name){
    var returns = document.getElementsByName(name);
    if(returns.length > 0) return returns;
    returns = new Array();
    var e = document.getElementsByTagName(tag);
    for(var i = 0; i < e.length; i++){
        if(e[i].getAttribute("name") == name){
            returns[returns.length] = e[i];
        }
    }
    return returns;
};	



/**
 * 精确计算
 */
function getDigits(num) {
	var digits = 0,
		parts = num.toString().split(".");
	if (parts.length === 2) {
		digits = parts[1].length;
	}
	return digits;
}

function toFixed(num, digits) {
	if (typeof digits == 'undefined') {
		return num;
	}
	return Number(num).toFixed(digits);
}
/**
 * 加法函数
 * arg1：加数；arg2加数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
function calc_add(arg1, arg2, digits) {
	arg1 = arg1.toString(), arg2 = arg2.toString();
	var maxLen = Math.max(getDigits(arg1), getDigits(arg2)),
		m = Math.pow(10, maxLen),
		result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
	return toFixed(result, digits);
}
;
/**
 * 减法函数
 * arg1：减数；arg2：被减数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
function calc_sub(arg1, arg2, digits) {
	return calc_add(arg1, -Number(arg2), digits);
}
;
/**
 * 乘法函数
 * arg1：乘数；arg2乘数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
function calc_multiply(arg1, arg2, digits) {
	// 数字化
	var num1 = parseFloat(arg1).toString(),
		num2 = parseFloat(arg2).toString(),
		m = getDigits(num1) + getDigits(num2),
		result = num1.replace(".", "") * num2.replace(".", "") / Math.pow(10, m);
	return toFixed(result, digits);
}
;
/**
 * 除法函数
 * arg1：除数；arg2被除数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
function calc_div(arg1, arg2, digits) {
	// 数字化
	var num1 = parseFloat(arg1).toString(),
		num2 = parseFloat(arg2).toString(),
		t1 = getDigits(num1),
		t2 = getDigits(num2),
		result = num1.replace(".", "") / num2.replace(".", "") * Math.pow(10, t2 - t1)
	return toFixed(result, digits);
}


var spinner = null;

//显示加载中
function startLoading(){ 
	if(spinner != null){
		return;
	}
	var height = getClientHeight()/2+getScrollTop();//图标在浏览器的高度

	//加载中图标配置
	var spinnerOpts = {
		lines:11, // 圆圈中线条的数量
		length: 5, // 每条线的长度
		width: 6, //每条线的宽度
		radius: 10, //每条线的圆角半径
		corners: 1, //角落圆度，从0到1
		rotate: 0, //旋转偏移量
		direction: 1, //旋转方向，其中1表示顺时针，0表示逆时针
		color: '#3C3E44', // 颜色
		speed: 1, //旋转速率，单位为转速/秒
		trail: 60, //余晖的百分比，即颜色变化的百分比
		shadow: false, //是否显示阴影
		hwaccel: false, //是否使用硬件加速
		className: 'spinner', // 绑定到spinner上的class名称
//		position:'relative',  // 定义spinner的位置类型，和css里的position一样
		zIndex: 2e9, //定位层，默认值是2000000000
		top: height+'px', // 相对父元素的向上定位，单位是px
		left: '50%' // 相对父元素的向左定位，单位是px
	};
	spinner = new Spinner(spinnerOpts).spin();
	
	var spinTarget = document.getElementById('loadingBody');
	if(spinTarget == null){
		//添加DIV层到Body
		var div =document.createElement("div");
		document.body.appendChild(div);
		div.id = "loadingBody";
		spinTarget = document.getElementById('loadingBody');
	}
//	spinner.spin(spinTarget);
	spinTarget.appendChild(spinner.el);
}  
//关闭加载中
function stopLoading(){ 
	if(spinner == null){
		return;
	}
	spinner.stop(); 
	spinner = null;
} 
//获取窗口可视范围的高度
function getClientHeight(){   
  var clientHeight=0;   
  if(document.body.clientHeight&&document.documentElement.clientHeight){   
      clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;           
  }else{   
      clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;       
  }   
  return clientHeight;   
}
//获取窗口滚动条高度
function getScrollTop(){   
  var scrollTop=0;   
  if(document.documentElement&&document.documentElement.scrollTop){   
      scrollTop=document.documentElement.scrollTop;   
  }else if(document.body){   
      scrollTop=document.body.scrollTop;   
  }   
  return scrollTop;   
}