
var CourseDetailsController = function ($scope, $location) {
    
    $scope.isDescription = true;

    $scope.btnClickDescription = function () {

        $scope.isDescription = true;
    }

    $scope.btnClickOutline = function () {
        $scope.isDescription = false;
    }


    $scope.initialize=function()
    {
        console.log("in initialize");
        $scope.isDescription = true;
    }
    

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
CourseDetailsController.$inject = ['$scope', '$location'];