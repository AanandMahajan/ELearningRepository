
var SearchController = function ($scope, $location) {
   
    $scope.intitalizevalues=function()
    {
        $scope.searchkeys = '';
        $scope.searchresultcount = false;
        $scope.searchresults = new Array();        
    }    

    $scope.search=function()
    {

        var client = AzureSearch({
            url: "https://coursesearch.search.windows.net",
            key: "4BEE793B2F21408AEBBE53231C31EB11"
        });

        var searchkey = $scope.searchkeys + '*';

        client.search('course', { search: searchkey, $facet:CourseTitle}, function (err, results) {
            // results is an array of matching documents

            console.log(results);
            if (results.length > 0) {                
                $scope.searchresultcount = true;                
                $scope.searchresults = results;                
                $scope.$apply();
            }
            else {
                $scope.searchresultcount = false;
                alert("No data found");
            }
            

        });

        



    }

}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
SearchController.$inject = ['$scope', '$location'];