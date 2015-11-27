
var SearchController = function ($scope, $location, $http) {

    var facetCategory = new Array();
    var facetFiletype = new Array();

    $scope.intitalizevalues = function () {
        $scope.searchkeys = '';
        $scope.searchresultcount = false;
        $scope.searchresults = new Array();
    }


    function isFacetSelected(facets) {
        for (var i = 0; i < facets.length; i++) {
            if (facets[i].isSelected)
                return true;
        }
        return false;
    }

    $scope.applyfilter = function () {

        //Check facet selection availability 
        var isCategoryFacetSelected = false;
        var isFileTypeFacetSelected = false;

        isCategoryFacetSelected = isFacetSelected(facetCategory);
        isFileTypeFacetSelected = isFacetSelected(facetFiletype);

        if (!isCategoryFacetSelected && !isFileTypeFacetSelected) {
            alert("No Filter selected ? Please select any filter");
        }
        else {


            var result_set = "";

            if (isCategoryFacetSelected) {
                result_set += "(";
                var flag = true;
                for (var i = 0; i < facetCategory.length; i++) {
                    if (facetCategory[i].isSelected) {
                        if (!flag)
                            result_set += " OR ";
                        result_set += "Category:\"" + facetCategory[i].facet+"\""
                        flag = false;
                    }
                }
                result_set += ") ";
            }

            if (isFileTypeFacetSelected) {

                if (isCategoryFacetSelected)
                    result_set = "AND ";
                result_set = "(";

                var flag = true;
                for (var i = 0; i < facetFiletype.length; i++) {
                    if (facetFiletype[i].isSelected) {
                        if (!flag)
                            result_set += " OR ";
                        result_set += "FileTypes:" + facetFiletype[i].facet + "*"
                        flag = false;
                    }
                }
                result_set += ") ";
            }
          

            if ($scope.searchkeys.length > 0) {
                var searchkey = $scope.searchkeys + '*';
                result_set += "AND (CourseTitle:" + searchkey + " OR Description:" + searchkey + ")";
            }

            console.log(result_set);

            $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': '3C0D5A6CEA52BBDB1FF804AF56A1289D' } }).then(

             function successCallback(results) {

                 console.log(results);
                 if (results.data.value.length > 0) {
                     $scope.searchresultcount = true;
                     $scope.searchresults = results.data.value;

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


    $scope.search = function () {
        var searchkey = $scope.searchkeys + '*';
        searchcourse(searchkey);
    }

    $scope.registerCourse = function (courseid) {
        $location.path('/routeCourseDetails/' + courseid);
    }


    function searchcourse(searchkey) {
        $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + searchkey + "&$count=true&facet=Category&facet=FileTypes&api-version=2015-02-28", { headers: { 'api-key': '3C0D5A6CEA52BBDB1FF804AF56A1289D' } }).then(

          function successCallback(results) {

              console.log(results);
              if (results.data.value.length > 0) {
                  $scope.searchresultcount = true;
                  $scope.searchresults = results.data.value;

                  //split filetypes from column and save it in array
                  var filetypearray = results.data['@search.facets'].FileTypes;
                  var uniquefiletypes = new Array();
                  for (var i = 0; i < filetypearray.length; i++) {
                      var spilt_data = filetypearray[i].value.split(",");
                      for (var j = 0; j < spilt_data.length; j++) {
                          uniquefiletypes.push(spilt_data[j]);
                      }
                  }

                  var uniquefiletypes = uniquefiletypes.filter(function (item, i, ar) { return ar.indexOf(item) === i; });

                  prepareFacetEntity(results.data['@search.facets'].Category, uniquefiletypes);

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
    
    //Prepare entity and bind it to ng-checkbox
    function prepareFacetEntity(facetresults, facetfiletypes) {

        facetCategory = new Array();
        facetFiletype = new Array();

        for (var i = 0; i < facetresults.length; i++) {
            facetCategory.push({ "facet": facetresults[i].value, "isSelected": false, "count": facetresults[i].count });
        }
        $scope.facetresults = facetCategory;

        for (var i = 0; i < facetfiletypes.length; i++) {
            facetFiletype.push({ "facet": facetfiletypes[i], "isSelected": false });
        }

        $scope.facetfiletypes = facetFiletype;

    }

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
SearchController.$inject = ['$scope', '$location', '$http'];