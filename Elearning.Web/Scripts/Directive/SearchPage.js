
var Search = function () {

    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: ['$rootScope', '$scope', '$http','$location', SearchResultFunction],
        templateUrl: '../Search/SearchResult.html'
    };

};

function SearchResultFunction($rootScope, $scope, $http, $location) {

    var search_api_key = '3C0D5A6CEA52BBDB1FF804AF56A1289D';
    //$scope.testmessage = 'Patil';
    //console.log($rootScope.testmessage);
    //console.log($rootScope.searchtext);

    $rootScope.$watch('globalsearchresult', function (value) {

        if (value != undefined)
            searchcourse(value);
    }, true);

    $rootScope.$watch('searchtext', function (value) {

        $scope.searchkeys = value;
    }, true);


    


    var result_set = "";

    var facetCategory = new Array();
    var facetFiletype = new Array();

    $scope.showSearchResultRange = "";
    $scope.isPrevAvailabale = 0;

    $scope.searchkeys = '';
    $scope.searchresultcount = false;
    $scope.searchresults = new Array();

    $scope.categoryselected = [];

    //console.log(search_api_key);

    function resetTopSkipValues() {
        $rootScope.top_result_count = 5;
        $rootScope.skip_result_count = 0;

    }

    function showSearchResultRange() {


        if ($scope.searchresults != undefined) {
            if ($scope.searchresults.length != 0 && $scope.searchresults.length < 5) {
                if ($scope.searchresults.length == 1)
                    $scope.showSearchResultRange = ($rootScope.skip_result_count + 1)
                else
                    $scope.showSearchResultRange = ($rootScope.skip_result_count + 1) + " - " + ($rootScope.skip_result_count + $scope.searchresults.length);
            }
            else {

                $scope.showSearchResultRange = ($rootScope.skip_result_count + 1) + " - " + ($rootScope.skip_result_count + 5);
            }
        }

        $scope.isPrevAvailabale = $rootScope.skip_result_count;



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

            //console.log(result_set);

            $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&$top=" + $rootScope.top_result_count + "&$skip=" + $rootScope.skip_result_count + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

             function successCallback(results) {

                 //console.log(results);
                 if (results.data.value.length > 0) {
                     $scope.searchresultcount = true;
                     $scope.searchresults = results.data.value;
                     showSearchResultRange();
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




    $scope.registerCourse = function (courseid) {
        $location.path('/routeCourseDetails/' + courseid);
    }


    function searchcourse(resultset) {
        
        //split filetypes from column and save it in array
        $scope.searchresults = resultset.value;
        var filetypearray = resultset['@search.facets'].FileTypes;
        var uniquefiletypes = new Array();
        for (var i = 0; i < filetypearray.length; i++) {
            var spilt_data = filetypearray[i].value.split(",");
            for (var j = 0; j < spilt_data.length; j++) {
                uniquefiletypes.push(spilt_data[j]);
            }
        }

        var uniquefiletypes = uniquefiletypes.filter(function (item, i, ar) { return ar.indexOf(item) === i; });

        prepareFacetEntity(resultset['@search.facets'].Category, uniquefiletypes);
        showSearchResultRange();
        //$scope.$apply();
        
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
        if ($rootScope.skip_result_count - 5 >= 0) {
            $rootScope.skip_result_count -= 5;

            if ($rootScope.skip_result_count < 0)
                $rootScope.skip_result_count = 0;

            $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&$top=" + $rootScope.top_result_count + "&$skip=" + $rootScope.skip_result_count + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

                         function successCallback(results) {

                             //console.log(results);
                             if (results.data.value.length > 0) {
                                 $scope.searchresultcount = true;
                                 $scope.searchresults = results.data.value;
                                 showSearchResultRange();
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
        else {
            alert("Reached Start of page!!");
        }
    }

    $scope.NextPageResult = function () {

        $rootScope.skip_result_count += 5;

        $http.get("https://coursesearch.search.windows.net/indexes/courseindex/docs?search=" + result_set + "&$top=" + $rootScope.top_result_count + "&$skip=" + $rootScope.skip_result_count + "&searchMode=all&api-version=2015-02-28-Preview&querytype=full", { headers: { 'api-key': search_api_key } }).then(

                     function successCallback(results) {

                         //console.log(results);
                         if (results.data.value.length > 0) {
                             $scope.searchresultcount = true;
                             $scope.searchresults = results.data.value;
                             //$scope.$apply();
                             showSearchResultRange();
                         }
                         else {
                             $rootScope.skip_result_count -= 5;
                             alert("No data found");
                         }
                     },
                     function errorCallback(res) {
                         //console.log(res);
                     }
                 );
    }


}
