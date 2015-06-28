/* Search the Tracking Number by Two Steps: 
	1. Find the node that Key Word "track" exists
	2. In the same node and parent node, search the tracking number
	3. if found tracking number, continue search "track", and back to step 2 till end.
	
	Depth First Search the DOM tree. 
	First, search "track". 
	Second, change keyword to RegExp of Tracking Number in the range of it's parent node's subtree.
	
*/
 

jQuery.extend({
    highlight: function (node, re, array) {
        if (node.nodeType === 3) {
            var match = node.data.match(re);
            if (match) {
				if (re.toString() == /track/i) return 1; // return found "track"
				array.push(match.toString()); //parse to String
				/*highlight the tracking number*/
                var highlight = document.createElement('span');
                highlight.className = 'highlight111';
                var wordNode = node.splitText(match.index);
                wordNode.splitText(match[0].length);
                var wordClone = wordNode.cloneNode(true);
                highlight.appendChild(wordClone);
                wordNode.parentNode.replaceChild(highlight, wordNode);
                return 2; // return found number
            }
        } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
                !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
                !(node.tagName === 'span'.toUpperCase() && node.className === 'highlight111')) { // skip if already highlighted
            
			var x = 0; // return found or not
			var flag = 0; // back to parent node or not
			for (var i = 0; i < node.childNodes.length; i++) {
				x = jQuery.highlight(node.childNodes[i], re, array);
				/*found "track"*/
				if (x == 1){
					i-=1;
					re = /\b[a-zA-Z0-9]{6,}[0-9]{6,}\b/; // go to search tracking number
				/*found tracking number*/
				}else if ( x == 2){
					i+=1;
					re = /track/i; // complete search in the same node
				/*found "track" in the subtree but not tracking number, now in the parent's subtree*/
				}else if (x == 10) {
					re = /\b[a-zA-Z0-9]{6,}[0-9]{6,}\b/; // go to search tracking number
					flag = 1; // already back to parent node, don't search in a wider range again
				}
            }
			if (flag == 1){re = /track/i;return 0;} // tracking number not found, give up
			if (re.toString() == /\b[a-zA-Z0-9]{6,}[0-9]{6,}\b/){
				return 10; // tracking number not found, go back
			}
        }
        return 0; // nothing found
    }
});




jQuery.fn.unhighlight = function (options) {
    var settings = { className: 'highlight111', element: 'span' };
    jQuery.extend(settings, options);

    return this.find(settings.element + "." + settings.className).each(function () {
        var parent = this.parentNode;
        parent.replaceChild(this.firstChild, this)
        parent.normalize();
    }).end();
};

jQuery.fn.highlight = function (array) {
    $(this).unhighlight();
	var re_number = /\b[a-zA-Z0-9]{6,}[0-9]{6,}\b/;
	var re_track = /track/i;
	var re = re_track;
	
	var domain = document.domain.split(".")[1];
	
	if (domain.toString() == "ups" || domain.toString() =="fedex" || domain.toString() == "usps"){
		atCarrierWebsite(domain.toString(),array);
	}else{
		this.each(function () {
			jQuery.highlight(this, re, array);
			array = trackingnumberList(array);
		});
		
	}
	
};



function atCarrierWebsite(carrier,array){
	if (carrier == "ups"){
		var p = document.getElementById("trkNum");
		var q = p.getElementsByTagName("input");
		var node = q.trackNums.getAttributeNode("value").childNodes[0];
		var trackingNumber = node.data;
				
		array.push(trackingNumber.toString()); //parse to String	
		alert(trackingNumber);
	}
	
}

function findTrackingNumber(){
	var array = [];
	$('body').highlight(array);
	alert("finish \n" + array.length);
	// chrome.runtime.sendMessage({trackingNumbers: array}, 
								// function(response) {console.log(response.farewell);
													// console.log(response.result);
													// trackingNumberResult = response.result}); 
	chrome.runtime.sendMessage({trackingNumbers: array}, function(response) {console.log(response.farewell);});
	
	return array.length;
	
}



function trackingnumberList(array){
	if (array.length == 0) return array;
	array.sort();
	var last = array[0];
	var index = 0;
	
	for (var i = 1; i<array.length; i++){
		if (array[i] != last){
			last = array[i];
			array[++index] = array[i];
		}
	}
	array.splice(index+1,array.length -index-1);
	return array;
}



