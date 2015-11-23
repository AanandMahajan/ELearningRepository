var CourseDetailsController = function ($scope, $location, $routeParams, WebAPIBaseURL, $http) {
    
    $scope.course = {};
    $scope.isDescription = true;

    $scope.btnClickDescription = function () {

        $scope.isDescription = true;
    }

    $scope.btnClickOutline = function () {
        $scope.isDescription = false;
    }

    $scope.initialize=function()
    {     
        $http.get(WebAPIBaseURL + 'api/CourseDetail/' + $routeParams.id, { headers: { 'Content-Type': 'application/json' } }).then(

            function successCallback(res)
            {                
                $scope.course = res.data;
                console.log($scope.course);
            },
            function errorCallback(res)
            {
                console.log(res);
            }
        );  
                        
        $scope.isDescription = true;
    }   

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
CourseDetailsController.$inject = ['$scope', '$location','$routeParams',WebAPIBaseURL,'$http'];