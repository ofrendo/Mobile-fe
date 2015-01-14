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
	
	this.DateToHtmlTime = function(jsDate){
		console.log(jsDate);
		var timeString =
			('0' + jsDate.getHours()).slice(-2) + ':'
			+ ('0' + jsDate.getMinutes()).slice(-2);
		console.log('Stunden: ' + jsDate.getHours() + ', Minuten: ' + jsDate.getMinutes() + ', String: ' + timeString);
		return timeString;
	}
	
	this.DateAndTime = function(htmlDate, htmlTime){
		console.log(htmlTime);
		var jsDate = new Date(htmlDate);
		if(htmlTime != null){
			jsDate = new Date(htmlDate + ' ' + htmlTime + ':00');
		}
		return jsDate;
	};
	
	// formats time from 0830 to 08:30
	this.timeFormat = function(timeString){
		var time = timeString.slice(0, 2) + ':' + timeString.slice(2, 4);
		return time;
	};
	
}]);