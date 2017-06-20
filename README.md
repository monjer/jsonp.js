jsonp.js


Just another simple jsonp util

## API

### jsonp.call(url,opt)	
 	`url` {String} 请求地址
	`opt` {Object}
		`params` {Object} url后的附加请求参数
		`callback` {Function} jsonp 成功请求后的回调
		`timeout` {Number} 超时时间
		`timeoutFn` {Function} 超时回调

### json.setDefaults(opt)
	`opt` {Object} 配置参数
		`callbackName` {String} jsonp函数名称前缀
		`timeout`	 {Number} timeout时间
		
## Use
	<script src="jsonp.js"/>

	jsonp.call("scriptURL.do",{
		params:{
			k:"v"
		},
		callback:function(data){
			console.log(data)
		}
	})
	
	jsonp.setDefaults({
		callbackName:"jsonpCall"
	});
