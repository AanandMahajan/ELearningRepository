
var SearchController = function ($rootScope, $scope, $location, $http, WebAPIBaseURL, search_api_key) {
       
    $rootScope.searchtext = '';
    $rootScope.top_result_count = 5;;
    $rootScope.skip_result_count = 0;
    $scope.searchkeys = '';
    
    $scope.intitalizevalues = function () {
        
        $scope.resultdata = [];
        $scope.categoryselected = [];

        $http({ method: 'get', url: WebAPIBaseURL + 'api/CategoryMasters/' }).
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

    $scope.search = function () {
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

        if ($scope.searchkeys.length > 0) {
            var searchkey = $scope.searchkeys + '*';
            $rootScope.searchtext = $scope.searchkeys;
            result_set += "AND (CourseTitle:" + searchkey + " OR Description:" + searchkey + ")";
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


}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
SearchController.$inject = ['$rootScope', '$scope', '$location', '$http', WebAPIBaseURL, search_api_key];