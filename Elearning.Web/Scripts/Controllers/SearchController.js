
var SearchController = function ($scope, $location, $http) {
   
    $scope.intitalizevalues=function()
    {
        $scope.searchkeys = '';
        $scope.searchresultcount = false;
        $scope.searchresults = new Array();
        $scope.facetresults = new Array();        
    }    
       
    $scope.applyfacets=function()
    {
        alert("in facets click");

    }


    $scope.search=function()
    {
        //var facetfilters = "Database";
        var searchkey = $scope.searchkeys + '*';

        //var searchfacetfilter = "$filter=Tags eq " + facetfilters;

        
               
        searchcourse(searchkey);



    }

    $scope.registerCourse = function (courseid) {        
        $location.path('/routeCourseDetails/' + courseid);
    }


    function searchcourse(searchkey)
    {
        $http.get("https://coursesearch.search.windows.net/indexes/course/docs?search=" + searchkey + "&$count=true&facet=Tags&api-version=2015-02-28", { headers: { 'api-key': '3C0D5A6CEA52BBDB1FF804AF56A1289D' } }).then(

          function successCallback(results) {

              console.log(results);
              if (results.data.value.length > 0) {
                  $scope.searchresultcount = true;
                  $scope.searchresults = results.data.value;
                  $scope.facetresults = results.data['@search.facets'].Tags;
                  //results.data['@search.facets'].Tags



                  $scope.$apply();
              }
              else {
                  $scope.searchresultcount = false;
                  alert("No data found");
              }


          },
          function errorCallback(res) {
              console.log(res);
          }
      );
    }

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
SearchController.$inject = ['$scope', '$location','$http'];