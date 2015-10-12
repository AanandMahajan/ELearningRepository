
var LandingPageController = function ($scope, $location) {
    //$scope.authentication = false;
    $scope.user = '';
    $location.path('/routeSearch');

    $scope.login = function (myModal) {
        //var result = LoginFactory($scope.loginForm.emailAddress, $scope.loginForm.password, $scope.loginForm.rememberMe);

        //result.then(function (result) {
        //    if (result.success) {
        //        if ($scope.loginForm.returnUrl !== undefined) {
        //            $location.path('/routeSearch');
        //        } else {
        //            $location.path($scope.loginForm.returnUrl);
        //        }
        //    } else {
        //        $scope.loginForm.loginFailure = true;
        //    }
        //});

        if (true) {
            $scope.authentication = true;

            console.log("Val is: " + $scope.authentication);
            $scope.user = 'Onkar';
            $location.path('/routeHome');

        }
    }


    $scope.logout = function () {
        console.log("loging out..");
        $scope.authentication = false;
        $location.path('/routeSearch');

    }

       


}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
LandingPageController.$inject = ['$scope', '$location'];