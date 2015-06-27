
var background = chrome.extension.getBackgroundPage(); 

// 这里的document代表了popup.html的文档流，所以也是注册这个页面中的dom事件
document.addEventListener('DOMContentLoaded', function(){
	var divs = document.querySelectorAll('div');
	for(var i=0; i<divs.length; i++){
		divs[i].addEventListener('click', function(e){
			if (e.target.id == "on"){
				chrome.tabs.insertCSS(null,{file:"highlight111.css"});
				chrome.tabs.executeScript(null,{code:"findTrackingNumber();", allFrames: false});
			}else if (e.target.id == "off"){
				chrome.tabs.executeScript(null,{code:"$('body').unhighlight();", allFrames: false});
			}else if (e.target.id == "find"){
				background.updateStatus("1ZAF95450307573509");
			}else if (e.target.id == "inquiry"){
				var list = background.trackingNumberList;
				alert(list[0].carrier);
			}
			
		});		
	}
});






