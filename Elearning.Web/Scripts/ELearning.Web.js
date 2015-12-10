/// <reference path="../Views/RoutesDemo/Search.html" />
/// <reference path="../Views/RoutesDemo/Search.html" />
var ELearningWeb = angular.module('ELearning.Web', ['ngRoute', 'ng.httpLoader', 'angularjs-dropdown-multiselect', 'azureBlobUpload']);

//ELearningWeb.constant('WebAPIBaseURL', 'http://pad22991/');
ELearningWeb.constant('WebAPIBaseURL', 'http://localhost:49923/');
ELearningWeb.constant('search_api_key', '3C0D5A6CEA52BBDB1FF804AF56A1289D');

ELearningWeb.controller('LandingPageController', LandingPageController);
ELearningWeb.controller('LoginController', LoginController);
ELearningWeb.controller('RegisterController', RegisterController);
ELearningWeb.controller('CourseDetailsController', CourseDetailsController);
ELearningWeb.controller('HomeController', HomeController);

ELearningWeb.factory('AuthHttpResponseInterceptor', AuthHttpResponseInterceptor);
ELearningWeb.factory('LoginFactory', LoginFactory);
ELearningWeb.factory('RegistrationFactory', RegistrationFactory);


ELearningWeb.directive('search', Search);




var configFunction = function ($routeProvider, $httpProvider,httpMethodInterceptorProvider) {
    $routeProvider.
        when('/routeSearch', {
            // templateUrl: 'routesDemo/Search'
            controller: SearchController,
            templateUrl: '../RoutesDemo/Search.html'
        })
        //.when('/routeTwo/:donuts', {
        //    templateUrl: function (params) { return '/routesDemo/two?donuts=' + params.donuts; }
        //})
        //.when('/routeHome', {
        //    templateUrl: 'routesDemo/Home'
        //})
         .when('/routeHome', {
             //templateUrl: function (params) { return '/routesDemo/Home?username=' + params.username + '&password=' + params.password; }             
             controller: HomeController,
             templateUrl: '../RoutesDemo/UserHome.html'
         })
        .when('/routeCourseDetails/:id', {
            controller: CourseDetailsController,
            templateUrl: '../RoutesDemo/CourseDetails.html'
        })
    //.when('/login', {
    //    templateUrl: '/Account/Login',0
    //    controller: LoginController
    //})
    //.when('/register', {
    //    templateUrl: '/Account/Register',
    //    controller: RegisterController
    //});

    $httpProvider.interceptors.push('AuthHttpResponseInterceptor');

    httpMethodInterceptorProvider.whitelistDomain('http://localhost:49923/');
    httpMethodInterceptorProvider.whitelistDomain('https://coursesearch.search.windows.net');
    

}
configFunction.$inject = ['$routeProvider', '$httpProvider','httpMethodInterceptorProvider'];

ELearningWeb.config(configFunction);