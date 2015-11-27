var CourseDetailsController = function ($scope, $location, $routeParams, WebAPIBaseURL, $http) {

    $scope.course = {};
    $scope.courseImageUrl = "";
    $scope.isDescription = true;

    $scope.btnClickDescription = function () {
        $scope.isDescription = true;
    }

    $scope.btnClickOutline = function () {
        $scope.isDescription = false;
    }

    $scope.initialize = function () {
        $http.get(WebAPIBaseURL + 'api/CourseDetail/' + $routeParams.id).then(

            function successCallback(res) {
                $scope.course = JSON.parse(JSON.parse(res.data));

                $http.get(WebAPIBaseURL + 'api/ImageMasters/' + $scope.course.CourseImageID).then(
                        function successCallback(res) {
                            $scope.courseImageUrl = res.data.BLOB_URL;                                                        
                        },
                        function errorCallback(res) {
                            console.log(res);
                        }
                    );
            },
            function errorCallback(res) {
                console.log(res);
            }
        );

        $scope.isDescription = true;
    }

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
CourseDetailsController.$inject = ['$scope', '$location', '$routeParams', WebAPIBaseURL, '$http'];