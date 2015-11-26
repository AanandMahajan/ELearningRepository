var HomeController = function ($scope, $location, $http, WebAPIBaseURL) {
   
    $scope.getCategories = function () {
        console.log('Inside getcategory()');
        $http({ method: 'get', url: WebAPIBaseURL+'api/CategoryMasters/' }).
            then(function (response) {
                $scope.status = response.status;
                $scope.categories = response.data;
            });
    }


}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
HomeController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL];