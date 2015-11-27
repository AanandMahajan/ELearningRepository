var HomeController = function ($scope, $location, $http, WebAPIBaseURL) {
   
    $scope.getCategories = function () {
        console.log('Inside getcategory()');
        $http({ method: 'get', url: WebAPIBaseURL+'api/CategoryMasters/' }).
            then(function (response) {
                $scope.status = response.status;
                $scope.categories = response.data;
                //$scope.categories = [{ "ID": 1, "TenantID": 1, "Category": "Software", "Description": "Software development" }, { "ID": 2, "TenantID": 1, "Category": "Automobile", "Description": "Auto" }, { "ID": 3, "TenantID": 1, "Category": "Cloud  Computing", "Description": "Cloud Computing" }, { "ID": 4, "TenantID": 1, "Category": "Finance", "Description": "Finance" }, { "ID": 5, "TenantID": 1, "Category": "HealthCare Unit", "Description": "HealthCare Unit" }, { "ID": 6, "TenantID": 1, "Category": "Banking", "Description": "Banking" }, { "ID": 7, "TenantID": 1, "Category": "E-Commerce", "Description": "E-Commerce" }, { "ID": 8, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 9, "TenantID": 1, "Category": "Software", "Description": "Software development" }, { "ID": 10, "TenantID": 1, "Category": "Automobile", "Description": "Auto" }, { "ID": 11, "TenantID": 1, "Category": "Cloud  Computing", "Description": "Cloud Computing" }, { "ID": 12, "TenantID": 1, "Category": "Finance", "Description": "Finance" }, { "ID": 13, "TenantID": 1, "Category": "HealthCare Unit", "Description": "HealthCare Unit" }, { "ID": 14, "TenantID": 1, "Category": "Banking", "Description": "Banking" }, { "ID": 15, "TenantID": 1, "Category": "E-Commerce", "Description": "E-Commerce" }, { "ID": 16, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 17, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 18, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 19, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 20, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 21, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 22, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 23, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 24, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 25, "TenantID": 1, "Category": "Administration", "Description": "Administration" }, { "ID": 26, "TenantID": 1, "Category": "Administration", "Description": "Administration" }]
            });
    }

    $scope.colors = ['army', 'purple', 'sky', 'lightpurple', 'blue', 'yellow', 'orange', 'teal', 'brown', 'plum'];
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
HomeController.$inject = ['$scope', '$location', '$http', WebAPIBaseURL];