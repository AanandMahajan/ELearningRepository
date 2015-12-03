
var SearchController = function ($scope, $location, $http, WebAPIBaseURL) {

    var result_set = "";
    var top_result_count;
    var skip_result_count;   
    var facetCategory = new Array();
    var facetFiletype = new Array();
    var search_api_key = "3C0D5A6CEA52BBDB1FF804AF56A1289D";
    $scope.showSearchResultRange = "";
    $scope.isPrevAvailabale = 0;
    

    function resetTopSkipValues() {
        top_result_count = 5;
        skip_result_count = 0;
        
    }

    function showSearchResultRange() {
        
//        if (skip_result_count == 0)
        
        if ($scope.searchresults != undefined) {
            if ($scope.searchresults.length != 0 && $scope.searchresults.length < 5) {
                if ($scope.searchresults.length==1)
                    $scope.showSearchResultRange = (skip_result_count + 1)
                else
                    $scope.showSearchResultRange = (skip_result_count + 1) + " - " + (skip_result_count + $scope.searchresults.length);
            }
            else {

                    $scope.showSearchResultRange = (skip_result_count + 1) + " - " + (skip_result_count + 5);
            }
        }

        $scope.isPrevAvailabale = skip_result_count;

        

    }

    $scope.intitalizevalues = function () {
        resetTopSkipValues();
        $scope.searchkeys = '';
        $scope.searchresultcount = false;
        $scope.searchresults = new Array();

        $scope.categoryselected = [];
        $scope.resultdata = [];

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


    function isFacetSelected(facets) {
        for (var i = 0; i < facets.length; i++) {
            if (facets[i].isSelected)
                return true;
        }
        return false;
    }

    $scope.applyfilter = function () {
        resetTopSkipValues();
        //Check facet selection availability 
        var isCategoryFacetSelected = false;
        var isFileTypeFacetSelected = false;

        isCategoryFacetSelected = isFacetSelected(facetCategory);
        isFileTypeFacetSelected = isFacetSelected(facetFiletype);

        if (!isCategoryFacetSelected && !isFileTypeFacetSelected) {
            alert("No Filter selected ? Please select any filter");
        }
        else {


            result_set = "";

            if (isCategoryFacetSelected) {
                result_set += "(";
                var flag = true;
                for (var i = 0; i < facetCategory.length; i++) {
                    if (facetCategory[i].isSelected) {
                        if (!flag)
                            result_set += " OR ";
                        result_set += "Category:\"" + facetCategory[i].facet + "\""
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

            $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&$top=" + top_result_count + "&$skip=" + skip_result_count + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

             function successCallback(results) {

                 console.log(results);
                 if (results.data.value.length > 0) {
                     $scope.searchresultcount = true;
                     $scope.searchresults = results.data.value;
                     showSearchResultRange();
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
        resetTopSkipValues();
        //var searchkey = $scope.searchkeys + '*';
        var categoryFilter = $scope.categoryselected;
        console.log(categoryFilter);

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
            result_set += "AND (CourseTitle:" + searchkey + " OR Description:" + searchkey + ")";
        }

        console.log(result_set);
        searchcourse(result_set);
    }

    $scope.registerCourse = function (courseid) {
        $location.path('/routeCourseDetails/' + courseid);
    }


    function searchcourse(searchkey) {
        $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + searchkey + "&$top=" + top_result_count + "&$skip=" + skip_result_count + "&$count=true&facet=Category&facet=FileTypes&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

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
                  showSearchResultRange();
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
    
    $scope.PrevPageResult = function () {        
        if (skip_result_count - 5 >= 0) {
            skip_result_count -= 5;

            if (skip_result_count < 0)
                skip_result_count = 0;

            $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&$top=" + top_result_count + "&$skip=" + skip_result_count + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

                         function successCallback(results) {

                             console.log(results);
                             if (results.data.value.length > 0) {
                                 $scope.searchresultcount = true;
                                 $scope.searchresults = results.data.value;
                                 showSearchResultRange();
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
        else {
            alert("Reached Start of page!!");
        }
    }

    $scope.NextPageResult = function () {
               
        skip_result_count += 5;

        $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&$top=" + top_result_count + "&$skip=" + skip_result_count + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

                     function successCallback(results) {

                         console.log(results);
                         if (results.data.value.length > 0) {
                             $scope.searchresultcount = true;
                             $scope.searchresults = results.data.value;
                             $scope.$apply();
                             showSearchResultRange();
                         }
                         else {                            
                             skip_result_count -= 5;
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
SearchController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL];