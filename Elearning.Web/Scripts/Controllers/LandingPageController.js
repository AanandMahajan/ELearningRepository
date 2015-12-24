
var LandingPageController = function ($scope, $location, $http, WebAPIBaseURL, azureBlob, search_api_key, $rootScope) {
    //$scope.authentication = false;
    $scope.email = '';
    $scope.publisher = {};

    $scope.user = {};
    
    $http.get(WebAPIBaseURL + 'api/user/GetCountries/country').then(
               function successCallback(res) {
                   $scope.publisher.Countries = res.data;
                   },
               function errorCallback(res) {
                    console.log(res);
               }
           );


    //$scope.WebApiBaseURL = 'http://pad22991/';

    $location.path('/routeSearch');

    $scope.GoToUserDashBoard=function()
    {
        $scope.$broadcast('GoToUserDashBoard', { data: true });
    }

    $scope.intitalizevalues = function () {
        $scope.authentication = false;
        $scope.resultdata = [];
        $scope.categoryselected = [];

        $http({ method: 'get', url: WebAPIBaseURL + 'api/CategoryMasters/getcategories/getdata' }).
           then(function (response) {
               for (var i = 0; i < response.data.length; i++) {
                   $scope.resultdata.push({ label: response.data[i].Category });
               }
           });

        $scope.categorysettings = {
            enableSearch: true,
            //smartButtonMaxItems: 3,
            displayProp: 'label', idProp: 'label',
            //smartButtonTextConverter: function (itemText, originalItem) {
            //    return itemText;
            //}
        };

        $scope.customFilter = '';
        $scope.example5customTexts = { buttonDefaultText: 'Select Category' };

    }

    $scope.SearchUserHome=function()
    {
        $rootScope.top_result_count = 5;
        $rootScope.skip_result_count = 0;


        //var searchkey = $scope.searchkeys + '*';
        var categoryFilter = $scope.categoryselected;
        //console.log(categoryFilter);

        result_set = "";

        if (categoryFilter.length > 0) {
            result_set += "(";
            var flag = true;
            for (var i = 0; i < categoryFilter.length; i++) {

                if (!flag)
                    result_set += " OR ";
                result_set += "Category:\"" + categoryFilter[i].id + "\""
                flag = false;

            }
            result_set += ") ";
        }
        if ($scope.searchkeys != undefined) {
            if ($scope.searchkeys.length > 0) {
                var searchkey = $scope.searchkeys + '*';
                $rootScope.searchtext = $scope.searchkeys;
                result_set += "AND (CourseTitle:" + searchkey + " OR Description:" + searchkey + ")";
            }
        }


        //console.log(result_set);

        //$scope.$apply();
        searchcourse(result_set);

    }

    function searchcourse(searchkey) {
        $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + searchkey + "&$top=" + $rootScope.top_result_count + "&$skip=" + $rootScope.skip_result_count + "&$count=true&facet=Category&facet=FileTypes&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

          function successCallback(results) {

              //console.log(results);
              if (results.data.value.length > 0) {
                  $scope.searchresultcount = true;
                  $scope.searchresults = results.data.value;
                  $rootScope.globalsearchresult = results.data;
                  //$scope.$apply();
                  $scope.$broadcast('SearchResultSuccess', { data: $rootScope.globalsearchresult });
              }
              else {
                  $scope.searchresultcount = false;
                  alert("No data found");
              }


          },
          function errorCallback(res) {
              //console.log(res);
          }
      );
    }

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
        $scope.publisher.TenantID = 1;
        $scope.publisher.RoleID = 3;
        $scope.publisher.CreatedON = new Date();
       
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
LandingPageController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL, azureBlob, search_api_key, '$rootScope'];
