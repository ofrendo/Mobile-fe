// service with functions needed in various cases
app.service("utils", [function() {
	
	/* converts a Date object to a html5 inputfield valid string
	 * param jsDate: the JS date object
	 * returns: string formatted 'mm-dd-yyyy'
	 * */
	this.DateToHtmlDate = function(jsDate){
		var dateString = 
			jsDate.getFullYear() + '-'
			+ ('0' + (jsDate.getMonth()+1)).slice(-2) + '-'
			+ ('0' + jsDate.getDate()).slice(-2);
		return dateString;
	};
	
	this.DateAndTime = function(htmlDate, htmlTime){
		var jsDate = new Date(htmlDate);
		if(htmlTime != null){
			jsDate = new Date(htmlDate + ' ' + htmlTime + ':00');
		}
		return jsDate;
	};
	
}]);