'use strict';

var app = angular.module('myApp', ['ngRoute']);
var baseUrl = "/wp-content/plugins/lpimap";


app.config(function($routeProvider) {
    $routeProvider
	    .when('/', {
	        templateUrl : baseUrl + '/templates/map.tpl.html',
	        controller  : 'viewMapCtrl'
	    })
	    .when('/:county', {
	        templateUrl : baseUrl + '/templates/county.tpl.html',
	        controller  : 'countyCtrl'
	    })
});

angular.module('myApp').filter('map_color', [function () {
    return function (input) {
        return "rgba(" + parseInt(input['r']) + "," + parseInt(input['g']) + "," + parseInt(input['b']) + ",1)";
    }
}]);

angular.module('myApp').directive('svgMap', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        templateUrl: baseUrl + '/california.svg',
        link: function (scope, element, attrs) {
            var regions = element[0].querySelectorAll('.county');
            angular.forEach(regions, function (path, key) {
                var regionElement = angular.element(path);
                regionElement.attr("region", "");
                regionElement.attr("county-data", "countyData");
                regionElement.attr("variable-select", "variableSelect");
                regionElement.attr("display-values", "displayValues");
                regionElement.attr('county-hover', 'countyHover');
                regionElement.attr('county-click', 'countyClick');
                regionElement.attr('county-selected', 'countySelected');
                $compile(regionElement)(scope);
            });
        }
    }
}]);

angular.module('myApp').directive('region', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            countyData: "=",
            variableSelect: "=",
            displayValues: "=",
            countyHover: "=",
            countyClick: "=",
            countySelected: '=',
        },
        link: function (scope, element, attrs) {
            scope.elementId = element.attr("id");
            scope.regionClick = function () {
                if(scope.countyClick == scope.elementId) {
                	scope.countyClick = null;
                	scope.countySelected = scope.elementId;
                } else {
                	scope.countyClick = scope.elementId;
                	scope.countySelected = scope.elementId;
                }
            };

            scope.regionHover = function() {
            	//If there's a county that's been clicked on, do nothing.
            	if(scope.countyClick != null)
            		return;

            	scope.countyHover = scope.elementId;
            	scope.countySelected = scope.elementId;
            }

            element.attr('ng-click', 'regionClick()');
            //element.attr("ng-attr-fill", "{{ displayValues[elementId] | map_colour: 128:64:255}}");
            element.attr("ng-attr-fill", "{{ displayValues[elementId] | map_color}}");
            element.attr("ng-mouseover", "regionHover();");

            
            element.removeAttr("region");
            $compile(element)(scope);
        }
    }
}]);

angular.module('myApp').directive('simplePieChart', ['$compile', function($compile) {
	return {
		restrict: 'A',
		template: "<canvas class='pie-chart' width='50' height='50'></canvas>",
		scope: {
			value1: "@",
			color1: '@',
			color2: '@',
		},
		link: function(scope, element, attrs) {
			scope.elementId = element.attr("id");

			var chart = document.getElementById(scope.elementId).getElementsByClassName('pie-chart')[0];
			chart.setAttribute('style', 'width: 50px; height: 50px; display: block; z-index:1000; background:white;');
			var ctx = chart.getContext("2d");

			var data = new Array();
			data[0] = {
				value: 0,
				color: scope.color1,
			};
			data[1] = {
				value: 1,
				color: scope.color2,
			};
			$compile(element.contents())(scope);

			var options = {
				segmentShowStroke : false,
				animationSteps : 1,
				animateRotate : false,
				animateScale : false,
				responsive: false,
				showTooltips: false,
			};
			var myPieChart = new Chart(ctx).Pie(data, options);

			scope.$watch('value1', function() {
				var value = parseFloat(scope.value1 * 100);

				myPieChart.segments[0].value = value.toFixed(1);
				myPieChart.segments[1].value = 100 - value.toFixed(1);
				myPieChart.update();
			});
		}
	}
}]);

app.controller('viewMapCtrl', ['$scope', '$document', function($scope, $document) {
	$scope.variableSelect = "enrollment-growth";
	$scope.countyData = countyData;
	$scope.displayValues = new Array();
	$scope.baseUrl = baseUrl;

	Number.prototype.map = function ( in_min , in_max , out_min , out_max ) {
  		return ( this - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
	};

	$scope.$watch('variableSelect', function() {
		for(var county in $scope.countyData) {
			var value = Number($scope.countyData[county][$scope.variableSelect]);
			$scope.displayValues[county] = new Array();

			//peg values greater than the high value to the high value, this is a fix for Los Angeles County
			if(value > colorData[$scope.variableSelect]['val-high'])
				value = colorData[$scope.variableSelect]['val-high'];

			$scope.displayValues[county]['r'] = value.map(colorData[$scope.variableSelect]['val-low'],
														colorData[$scope.variableSelect]['val-high'],
														colorData[$scope.variableSelect]['r-low'],
														colorData[$scope.variableSelect]['r-high']);
			$scope.displayValues[county]['g'] = value.map(colorData[$scope.variableSelect]['val-low'],
														colorData[$scope.variableSelect]['val-high'],
														colorData[$scope.variableSelect]['g-low'],
														colorData[$scope.variableSelect]['g-high']);
			$scope.displayValues[county]['b'] = value.map(colorData[$scope.variableSelect]['val-low'],
														colorData[$scope.variableSelect]['val-high'],
														colorData[$scope.variableSelect]['b-low'],
														colorData[$scope.variableSelect]['b-high']);
		}
	});
}]);

app.controller('countyCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	$scope.county = $routeParams.county;
	$scope.countyData = countyData[$routeParams.county];
	$scope.baseUrl = baseUrl;
}]);