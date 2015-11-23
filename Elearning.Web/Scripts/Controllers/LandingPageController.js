
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

        
                 
        //$http.get('http://172.25.217.78/api/User/5', { headers: { 'Content-Type': 'application/json' } }).then(

        //    function successCallback(res)
        //    {
        //        console.log(res);
        //    },
        //    function errorCallback(res)
        //    {
        //        console.log(res);
        //    }
        //);             
                
        $http.post(WebAPIBaseURL + '/api/user/validateuser/validate', angular.toJson(user_new)).then(

          function successCallback(res) {

              console.log("Login Successfull: " + res);
              $scope.authentication = true;              
              $location.path('/routeHome');  

          },
          function errorCallback(res) {
              console.log("Login Failed: "+res);
          }
      );
       
            
    };


    
    $scope.logout = function () {
        console.log("loging out..");
        $scope.authentication = false;
        $location.path('/routeSearch');
    };

    //Adding new user
    $scope.AddUser = function (myModal) {
                      
        $http.post(WebAPIBaseURL + 'api/user', angular.toJson($scope.publisher)).then(

            function successCallback(res) {
                console.log(res);
                alert("User added successfully!! Please login and continue");
            },
            function errorCallback(res) {
                console.log(res);
                alert("User insertion failed. Please try again");
            }
        );
            
    };    
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
LandingPageController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL];