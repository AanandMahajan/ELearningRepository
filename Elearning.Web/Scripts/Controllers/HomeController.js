var HomeController = function ($scope, $location, $http, WebAPIBaseURL, $rootScope, search_api_key) {
       
    $scope.showsearchresult = false;

    $scope.isDescription = true;

    $scope.btnGetAllSearchResultForCategory=function(category)
    {
        $rootScope.top_result_count = 5;
        $rootScope.skip_result_count = 0;
        result_set = '';

        if (category!="")
            result_set = "(Category:" + category + ")";
                
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



    $scope.btnClickDescription = function () {
        $scope.isDescription = true;
    }

    $scope.btnClickOutline = function () {
        $scope.isDescription = false;
    }

    $scope.getCategories = function () {
        $scope.showsearchresult = false;
        console.log('Inside getcategory()');
        $http({ method: 'get', url: WebAPIBaseURL + 'api/CategoryMasters/topcategories/getdata' }).
            then(function (response) {
                $scope.status = response.status;
                $scope.categories = response.data;

                //$scope.categories = [{ "ID": 1, "TenantID": 1, "Category": "Software", "Description": "Software development" }, { "ID": 2, "TenantID": 1, "Category": "Automobile", "Description": "Auto" }, { "ID": 3, "TenantID": 1, "Category": "Cloud  Computing", "Description": "Cloud Computing" }, { "ID": 4, "TenantID": 1, "Category": "Finance", "Description": "Finance" }, { "ID": 5, "TenantID": 1, "Category": "HealthCare Unit", "Description": "HealthCare Unit" }, { "ID": 6, "TenantID": 1, "Category": "Banking", "Description": "Banking" }, { "ID": 7, "TenantID": 1, "Category": "E-Commerce", "Description": "E-Commerce" }, { "ID": 8, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 9, "TenantID": 1, "Category": "Software", "Description": "Software development" }, { "ID": 10, "TenantID": 1, "Category": "Automobile", "Description": "Auto" }, { "ID": 11, "TenantID": 1, "Category": "Cloud  Computing", "Description": "Cloud Computing" }, { "ID": 12, "TenantID": 1, "Category": "Finance", "Description": "Finance" }, { "ID": 13, "TenantID": 1, "Category": "HealthCare Unit", "Description": "HealthCare Unit" }, { "ID": 14, "TenantID": 1, "Category": "Banking", "Description": "Banking" }, { "ID": 15, "TenantID": 1, "Category": "E-Commerce", "Description": "E-Commerce" }, { "ID": 16, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 17, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 18, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 19, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 20, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 21, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 22, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 23, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 24, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 25, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 26, "TenantID": 1, "Category": "Administration", "Description": "Administration" }]
            });
    }

    $scope.colors = ['army', 'purple', 'sky', 'lightpurple', 'blue', 'yellow', 'orange', 'teal', 'brown', 'plum'];

    $scope.$on('SearchResultSuccess', function (event, args) {            
        
        if (args.data.value.length > 0)
            $scope.showsearchresult = true;
            //$scope.$digest();
    });

    $scope.$on('GoToUserDashBoard', function (event, args) {

        if (args.data == true)
            $scope.showsearchresult = false;
        //$scope.$digest();
    });

    $scope.getCourseDetails = function ($filter) {
        $scope.showsearchresult = false;
        console.log('Inside getcourse()');
        $http({ method: 'get', url: WebAPIBaseURL + 'api/CourseDetail/GetRecommendedCourseDetails/1' }).
            then(function (response) {
                $scope.status = response.status;
                $scope.courses = response.data;                
            });        
    }
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
HomeController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL, '$rootScope', search_api_key];
