/*  Request delivery status from UPS website 
	format: http://wwwapps.ups.com/etracking/tracking.cgi?tracknum=1Z867F6RP239907338
	
	And crawl information

*/


function updateStatus(trackingNumber){
	var document = requestUPS(trackingNumber);
	
	var p = document.getElementById('tt_spStatus');
	var status_brief = p.childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "");
	
	
	var status = new Object();
	
	var status_present = new Object();
	var status_previous = new Object();
	
	status.present = status_present;
	status.previous = status_previous;
	
	status.brief = status_brief.toString();
	
	
	if (status_brief.toString() == "Delivered"){
		alert("Delivered");
	}else if (status_brief.toString() == "Order Processed: Ready for UPS"){
		alert("Order Processed: Ready for UPS");
	}else{
		alert(status_brief.toString());
		var q = document.getElementsByClassName('secLvl gradient gradientGroup7 module3');
		var pkg_progress = q[0].getElementsByTagName('tr');
		
		var present = pkg_progress[1].getElementsByTagName('td');
		var previous = pkg_progress[2].getElementsByTagName('td');
		
		status_present.location   = present[0].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();
		status_present.date       = present[1].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();
		status_present.localTime  = present[2].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();
		status_present.activity   = present[3].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();

		status_previous.location  = previous[0].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();
		status_previous.date      = previous[1].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();
		status_previous.localTime = previous[2].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();
		status_previous.activity  = previous[3].childNodes[0].data.replace(/(^\s+)|(\s+$)/g, "").replace(/\s+/g, " ").toString();		
		
		
	}
	return status;
}

/*

*/
function requestUPS(trackingNumber){

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","http://wwwapps.ups.com/etracking/tracking.cgi?tracknum="+trackingNumber.toString(),false);
	xmlhttp.send();
	parser = new DOMParser();
	doc = parser.parseFromString(xmlhttp.responseText, "text/html");
	return doc;
}


function requestUSPS(trackingNumber){

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1="+trackingNumber.toString(),false);
	xmlhttp.send();
	parser = new DOMParser();
	doc = parser.parseFromString(xmlhttp.responseText, "text/html");
	return doc;
}

function requestFedEx(trackingNumber){

	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET","https://www.fedex.com/apps/fedextrack/?action=track&action=track&tracknumbers="+trackingNumber.toString(),false);
	xmlhttp.send();
	parser = new DOMParser();
	doc = parser.parseFromString(xmlhttp.responseText, "text/html");
	return doc;
}

