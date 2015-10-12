var ELearningWeb = angular.module('ELearning.Web', ['ngRoute']);

ELearningWeb.controller('LandingPageController', LandingPageController);
ELearningWeb.controller('LoginController', LoginController);
ELearningWeb.controller('RegisterController', RegisterController);

ELearningWeb.factory('AuthHttpResponseInterceptor', AuthHttpResponseInterceptor);
ELearningWeb.factory('LoginFactory', LoginFactory);
ELearningWeb.factory('RegistrationFactory', RegistrationFactory);

var configFunction = function ($routeProvider, $httpProvider) {
    $routeProvider.
        when('/routeSearch', {
            templateUrl: 'routesDemo/Search'
        })
        //.when('/routeTwo/:donuts', {
        //    templateUrl: function (params) { return '/routesDemo/two?donuts=' + params.donuts; }
        //})
        .when('/routeHome', {
            templateUrl: 'routesDemo/Home'
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