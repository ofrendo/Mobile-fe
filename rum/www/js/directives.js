// shows the buttons for the content header (chat button, menu button)
app.directive('contentHeader', function(){
	return {
		restrict: 'E',
		templateUrl: 'partials/content-header.html'
	};
});

// directive to avoid event propagation (copied from: http://stackoverflow.com/questions/15193539/whats-the-best-way-to-cancel-event-propagation-between-nested-ng-click-calls)
// just add stop-event as an attribute to the object where the event is fired
app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });