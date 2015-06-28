/**
 * 注册标签页更新时的事件
 * 这里调用了initialize()事件，把func.js注入当前标签页中 
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	initialize(tabId);
});

/**
 * 注册切换标签页时的事件
 * 这里调用了initialize()事件，把func.js注入当前标签页中
 */
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
	initialize(tabId);
});

/**
 * 初始化方法 ，注入func.js事件
 * @param {Object} tabId
 */
function initialize(tabId){
	chrome.tabs.executeScript(tabId, {file: "jquery-1.11.3.min.js", allFrames: true});
	chrome.tabs.executeScript(tabId, {file: "highlight.js", allFrames: true});
}


var trackingNumberList =[];


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(sender.tab ?
			"from a content script:" + sender.tab.url :
            "from the extension");
		if (request.trackingNumbers.length != 0){
			addTrackingNumber(request.trackingNumbers);	
		} 

		sendResponse({farewell: request.trackingNumbers.length.toString() +" Received Tracking Number: "+request.trackingNumbers[0].toString()});
  });
  

function addTrackingNumber(array){
	if (array.length == 0) return;
	for (var i =0; i< array.length; i++){
		//处理数组 加上快递公司
		var pkgcarrier = identifyCarrier(array[i].toString())
		var trackingNumberWithCarrier = {number : array[i].toString(),carrier : pkgcarrier.toString()};

		trackingNumberList.push( trackingNumberWithCarrier);	
	}
	
	//trackingNumberList = trackingNumberList.concat(array);
}



function identifyCarrier(trackingNumber){
	var regexp_UPS = /\b1Z[0-9a-zA-Z]{16}\b/;
	var regexp_USPS = /\b92[0-9]{20}\b/;
	
	if (trackingNumber.match(regexp_UPS)) return "UPS";
	else if (trackingNumber.match(regexp_USPS)) return "USPS";
	else return "FedEx";
	
}



















  
 