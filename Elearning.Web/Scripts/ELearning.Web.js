/// <reference path="../Views/RoutesDemo/Search.html" />
/// <reference path="../Views/RoutesDemo/Search.html" />
var ELearningWeb = angular.module('ELearning.Web', ['ngRoute']);

ELearningWeb.constant('WebAPIBaseURL', 'http://pad22991/');

ELearningWeb.controller('LandingPageController', LandingPageController);
ELearningWeb.controller('LoginController', LoginController);
ELearningWeb.controller('RegisterController', RegisterController);

ELearningWeb.factory('AuthHttpResponseInterceptor', AuthHttpResponseInterceptor);
ELearningWeb.factory('LoginFactory', LoginFactory);
ELearningWeb.factory('RegistrationFactory', RegistrationFactory);

var configFunction = function ($routeProvider, $httpProvider) {
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
         .when('/routeHome/:username/:password', {
             templateUrl: function (params) { return '/routesDemo/Home?username=' + params.username + '&password=' + params.password; }
         })
        .when('/routeCourseDetails', {
            templateUrl: 'routesDemo/CourseDetails'
        })
        .when('/login', {
            templateUrl: '/Account/Login',
            controller: LoginController
        })
        .when('/register', {
            templateUrl: '/Account/Register',
            controller: RegisterController
        });

    $httpProvider.interceptors.push('AuthHttpResponseInterceptor');
}
configFunction.$inject = ['$routeProvider', '$httpProvider'];

ELearningWeb.config(configFunction);