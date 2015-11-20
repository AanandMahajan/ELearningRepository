
var LandingPageController = function ($scope, $location, $http, WebAPIBaseURL) {
    //$scope.authentication = false;
    $scope.user = '';
    $scope.publisher = {};    

    //$scope.WebApiBaseURL = 'http://pad22991/';

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

        var user_new = {}                    
        user_new.Password = $scope.password;
        user_new.Email = $scope.user;

        var test = angular.toJson(user_new);          
                 
        $http.get('http://172.25.217.78/api/User/5', { headers: { 'Content-Type': 'application/json' } }).then(

            function successCallback(res)
            {
                console.log(res);
            },
            function errorCallback(res)
            {
                console.log(res);
            }
        );             

        

        //Validate User
       // $http.post('http://localhost:49923/api/User/', angular.toJson(user_new)).then(

       //    function successCallback(res) {
       //        console.log(res);
       //    },
       //    function errorCallback(res) {
       //        console.log(res);
       //    }
       //);
       
        //$scope.authentication = true;
        //console.log("Username: " + $scope.user + " pwd:" + $scope.password);
        //$location.path('/routeHome/' + $scope.user + '/' + $scope.password);        
    };


    
    $scope.logout = function () {
        console.log("loging out..");
        $scope.authentication = false;
        $location.path('/routeSearch');
    };

    $scope.AddUser = function (myModal) {

        //console.log("Full name " + $scope.publisher.fullname);
        //console.log("Email " + $scope.publisher.email);

        //$http.post('http://172.25.217.78/api/User/', angular.toJson($scope.publisher)).then(

        //    function successCallback(res) {
        //        console.log(res);
        //    },
        //    function errorCallback(res) {
        //        console.log(res);
        //    }
        //);
        
        //$http.defaults.headers.common = {};
        //$http.defaults.headers.post = {};
        //$http.defaults.headers.put = {};
        //$http.defaults.headers.patch = {};
        
        $http.post('http://172.25.217.78/api/user/onkar/1', angular.toJson($scope.publisher)).then(

            function successCallback(res) {
                console.log(res);
            },
            function errorCallback(res) {
                console.log(res);
            }
        );

      //  $http.post('http://localhost:49923/api/User/', angular.toJson($scope.publisher)).then(

      //    function successCallback(res) {
      //        console.log(res);
      //    },
      //    function errorCallback(res) {
      //        console.log(res);
      //    }
      //);

    };    
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
LandingPageController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL];