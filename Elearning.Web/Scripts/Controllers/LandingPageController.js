
var LandingPageController = function ($scope, $location, $http, WebAPIBaseURL, azureBlob, search_api_key, $rootScope, $q) {
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

    $scope.GoToUserDashBoard = function () {
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

    $scope.SearchUserHome = function () {
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

                if (categoryFilter.length > 0)
                    result_set += "AND ";
                
                result_set += "(CourseTitle:" + searchkey + " OR Description:" + searchkey + ")";
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
                  console.log("Login Successfull: " + res);
                  $scope.user = res.data;
                  $scope.authentication = true;
                  $location.path('/routeHome');
              }

          },
          function errorCallback(res) {
              console.log("Login Failed: " + res);
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
        var file = document.getElementById('file').files[0];
        if (selectedFile == null) {
            alert("Please select a file first.");
        }
        else {
            var fileContent = selectedFile.slice(0, selectedFile.size - 1);

            //1. Add/Update CORS rule.
            $http({ method: 'get', url: WebAPIBaseURL + 'api/BlobUpload/AddCorsRuleStorage/addrule' }).
                    then(function (response) {
                        if (response.data) {
                            //2. Get shared access signature.
                            $http({ method: 'get', url: WebAPIBaseURL + 'api/BlobUpload/GetSAS/?containerName=userimg&blobName=' + file.name }).
                                then(function (response) {
                                    if (response) {
                                        //SAS = response.data.toString();
                                        SAS = response.data.substring(1,response.data.length-1);
                                        reader.readAsArrayBuffer(fileContent);
                                    } else {
                                        alert("Can't get the Shared Access Signature");
                                    }
                            });
                        } else {
                            alert('CORS not updated...');
                        }
                    });
        }
    };

    var SAS = null;
    var reader = null;
    var selectedFile = null;
    $(document).ready(function () {
        reader = new FileReader();
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                //var baseUrl = $("#sasUrl").val();
                //var indexOfQueryStart = baseUrl.indexOf("?");
                //submitUri = baseUrl.substring(0, indexOfQueryStart) + '/' + selectedFile.name + baseUrl.substring(indexOfQueryStart);
                var baseUrl = 'https://elearningstrg.blob.core.windows.net/userimg/';
                submitUri = baseUrl + selectedFile.name + SAS.substring(SAS.indexOf("?"),SAS.length);
                console.log(submitUri);

                var requestData = new Uint8Array(evt.target.result);

                //2. Upload blob to azure.
                $.ajax({
                    url: submitUri,
                    type: "PUT",
                    data: requestData,
                    processData: false,
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                        xhr.setRequestHeader('x-ms-blob-content-type', selectedFile.type);
                        //xhr.setRequestHeader('Content-Length', requestData.length);
                    },
                    success: function (data, status) {
                        $scope.publisher.DisplayPicURL = 'https://elearningstrg.blob.core.windows.net/userimg/' + selectedFile.name;
                        $scope.publisher.TenantID = 1;
                        $scope.publisher.RoleID = 3;
                        $scope.publisher.CreatedON = new Date();

                        //4. Submit user data.
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

                        //alert("user image uploaded successfully");
                        console.log(data);
                        console.log(status);
                    },
                    error: function (xhr, desc, err) {
                        alert("Failed to upload user image.");
                        console.log(desc);
                        console.log(err);
                    }
                });
            }
        };
        $("#file").bind('change', function (e) {
            var files = e.target.files;
            selectedFile = files[0];
        });
        //$("#buttonUploadFile").click(function (e) {
        //    if (selectedFile == null) {
        //        alert("Please select a file first.");
        //    }
        //    else {
        //        var fileContent = selectedFile.slice(0, selectedFile.size - 1);
        //        reader.readAsArrayBuffer(fileContent);
        //    }
        //});
    })

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
LandingPageController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL, azureBlob, search_api_key, '$rootScope'];
