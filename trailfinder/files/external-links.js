function externalLinks() {
var url_test = false;
var anchors = document.getElementsByTagName("a");
	for (var i=anchors.length; i>=0; i--) {
		var anchor = anchors[i];
  	anchor_url = encodeURI(anchor);
	url_test = /baynature/.test(anchor_url);
	if (url_test == false){
		if (anchor_url != "undefined"){
			anchor.target = "_blank";
		}
	}
}
}
window.onload = externalLinks;