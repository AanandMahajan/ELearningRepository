
var LandingPageController = function ($scope, $location, $http, WebAPIBaseURL,azureBlob) {
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
        
        var f = document.getElementById('file').files[0];
        //r = new FileReader();
        //r.onloadend = function (e) {
        //    var data = e.target.result;
        //}
        //r.readAsBinaryString(f);
       
        var config = {
            baseUrl: "https://elearningstrg.blob.core.windows.net/userimg/"+f.name,
            sasToken: "?sv=2015-04-05&sr=c&sig=OZGZWbDFeA9PTw%2BBsOU%2FIlC5OZ2iAHOuh8BQwOyR2Wo%3D&st=2015-12-02T09%3A10%3A44Z&se=2015-12-04T10%3A10%3A44Z&sp=rw",
            file: f,
        };
        azureBlob.upload(config);
        $scope.publisher.DisplayPicURL = "https://elearningstrg.blob.core.windows.net/userimg/" + f.name;
        $http.post(WebAPIBaseURL + 'api/user/adduser/user', angular.toJson($scope.publisher)).then(

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
LandingPageController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL,azureBlob];