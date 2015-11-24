
var LandingPageController = function ($scope, $location, $http, WebAPIBaseURL) {
    //$scope.authentication = false;
    $scope.email = '';
    $scope.publisher = {};

    $scope.user = {};

    //$scope.WebApiBaseURL = 'http://pad22991/';

    $location.path('/routeSearch');

    $scope.login = function (myModal) {

        var user_new = {}
        var md5HashedPassword = md5($scope.password);
        user_new.Password = md5HashedPassword;
        user_new.Email = $scope.email;


        $http.post(WebAPIBaseURL + '/api/user/validateuser/validate', angular.toJson(user_new)).then(

          function successCallback(res) {

              if (res.data == "null") {
                  alert("Wrong Credentials!!");
              }
              else {
                  console.log("Login Successfull: " +res);
                  $scope.user = res.data;
                  $scope.authentication = true;
                  $location.path('/routeHome');
              }

          },
          function errorCallback(res) {
              console.log("Login Failed: " +res);
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

        $scope.publisher.Password = md5($scope.publisher.Password);

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