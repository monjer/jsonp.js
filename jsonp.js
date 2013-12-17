/**
 * Just another simple jsonp util
 * 
 * @author manjun.han
 */
(function(opt_ns,opt_win){

	opt_win = opt_win || top ;
	
	/**
	 * jsonp默认的配置
	 */
	var defaultCfgs = {
			timeout:4000,
			callback:"jsonp"
	};
	
	/**
	 * 空函数，当做默认参数
	 */
	function emptyFn(){}
	
	/**
	 * 对象的浅拷贝
	 * @param desObj 目标对象
	 * @param srcObj 源对象
	 */
	function lowCopy(desObj , srcObj){
		
		desObj = desObj || {} ;
		srcObj = srcObj || {} ;
		
		for(var k in srcObj){
			if(srcObj.hasOwnProperty(k)){
				desObj[k] = srcObj[k];	
			}						
		}
		
		return desObj;
	}
	
	/**
	 * 从指定的url中加载script代码
	 * @params url {String}  目标url
	 * @params callback {Function} 回调函数 
	 */
	function loadScript(url,callback){
		
		var script = document.createElement("script");
		
		script.src	= url ;
		
		// IE 
		if(script.readyState){						
			script.onreadystatechange = function(){
				 if(this.readyState == "complete" || this.readyState == "loaded"){
					 callback();
				 }
				 script.onreadystatechange = null ;
				 script.parentNode.removeChild(script);
			 };
		// standard 
		}else{
			script.onload = function(){
				callback();
				script.onload = null ;
				script.parentNode.removeChild(script); 
			} ;
		}
		
		document.body.appendChild(script);
	}
	
	/**
	 * 将对象encode为url后的查询字符串
	 * @return {String} encode后的字符串
	 * @param obj {Object} 要encode的值对象
	 */
	function encodeObjToqueryString(obj){
		obj = obj || {} ;
		var queryString = "";
		var pairs = [];
		for(var k in obj){
			if(obj.hasOwnProperty(k)){
				pairs.push(k+"="+encodeURIComponent(obj[k]));
			}
		}
		queryString = pairs.join("&");						
		
		return queryString;
	};
	
	/**
	 * jsonp对象
	 */
	var jsonp = {
			
			/**
			 * jsonp的调用接口
			 * @param url {String} script的目标url
			 * @param opt {Object} 本次请求的可选参数
			 */
			call:function(url,opt){

				opt = lowCopy({
					params:{},
					callback:emptyFn,
					timeout:defaultCfgs.timeout,
					timeoutFn:emptyFn,
					callbackName:defaultCfgs.callback
				},opt);

				var suffix = "&";
				
				if(url.lastIndexOf("?") < 0){
					suffix = "?";
				} ;
				
				// 本次调用的唯一标签
				var uid = new Date().getTime();
				
				var callbackName = opt.callbackName+uid;
				
				opt.params["callback"]=callbackName;
				
				// 生成最终的url
				url+=suffix+encodeObjToqueryString(opt.params);
				
				// 启动定时器
				var timer = setTimeout(function(){
					opt.timeoutFn();								
				},opt.timeout);
				
				//构建实际调用的函数，将导出到全局作用域
				opt_win[callbackName] = function(){
					clearTimeout(timer);
					opt.callback();
					delete opt_win[callbackName];
				};
				
				// 从server端加载script
				loadScript(url,opt_win[defaultCfgs.callback+uid]);
			},
			
			/**
			 * 设置jsonp默认的配置
			 * @param opt 
			 * 		  timeout {Number} 默认的超时时间
			 * 		  callback {String} 默认的回调函数名称
			 */
			setDefaults:function(opt){
				opt = opt || {};
				lowCopy(defaultCfgs , opt);
			}
	};
	
	// export	
	opt_ns = opt_ns || opt_win;
	opt_ns.jsonp = jsonp ;
	
})();
