var ELearningWeb = angular.module('ELearning.Web', ['ngRoute']);

ELearningWeb.controller('LandingPageController', LandingPageController);
ELearningWeb.controller('LoginController', LoginController);
ELearningWeb.controller('RegisterController', RegisterController);

ELearningWeb.factory('AuthHttpResponseInterceptor', AuthHttpResponseInterceptor);
ELearningWeb.factory('LoginFactory', LoginFactory);
ELearningWeb.factory('RegistrationFactory', RegistrationFactory);

var configFunction = function ($routeProvider, $httpProvider) {
    $routeProvider.
        when('/routeOne', {
            templateUrl: 'routesDemo/one'
        })
        //.when('/routeTwo/:donuts', {
        //    templateUrl: function (params) { return '/routesDemo/two?donuts=' + params.donuts; }
        //})
        .when('/routeTwo', {
            templateUrl: 'routesDemo/two'
        })
        .when('/routeThree', {
            templateUrl: 'routesDemo/three'
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