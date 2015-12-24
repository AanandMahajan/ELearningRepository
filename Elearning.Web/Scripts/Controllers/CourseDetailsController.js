var CourseDetailsController = function ($scope, $location, $routeParams, WebAPIBaseURL, $http) {

    $scope.course = {};
    $scope.courseImageUrl = "";
    $scope.isDescription = true;

    $scope.btnClickDescription = function () {
        $scope.isDescription = true;
    }

    $scope.btnClickOutline = function () {
        $scope.isDescription = false;
    }

    $scope.btnEnrollClick = function () {
        if ($scope.user.FullName == undefined) {
            alert('Please login before enrolling !! ');
        }
        else {
            //Logic for enrolling            
            //console.log($scope.course);

            var UserCourseEnrollment = {};
            UserCourseEnrollment.TenantID = 1;
            UserCourseEnrollment.UserID = $scope.user.ID;
            UserCourseEnrollment.CourseID = $scope.course.ID;
            UserCourseEnrollment.StartedON = new Date();
            UserCourseEnrollment.CategoryID = $scope.course.CategoryID;

            $http.post(WebAPIBaseURL + '/api/UserEnrollmentInfoes', angular.toJson(UserCourseEnrollment)).then(

                 function successCallback(res) {                  
                     console.log("Course Enrolled" + res);
                     alert('User Enrolled for this course !! ');
                 },                 
                 function errorCallback(res) {
                     console.log("Enrollment Failed: " + res);
                 }
             );

        }
    }

    $scope.initialize = function () {
        $http.get(WebAPIBaseURL + 'api/CourseDetail/' + $routeParams.id).then(

            function successCallback(res) {
                $scope.course = JSON.parse(JSON.parse(res.data));

                $http.get(WebAPIBaseURL + 'api/ImageMasters/' + $scope.course.CourseImageID).then(
                        function successCallback(res) {
                            $scope.courseImageUrl = res.data.BLOB_URL;
                        },
                        function errorCallback(res) {
                            console.log(res);
                        }
                    );
            },
            function errorCallback(res) {
                console.log(res);
            }
        );

        $scope.isDescription = true;
    }

    function close_accordion_section(indexer) {
        $('.accordion ' + '#accordionParent-' + indexer).removeClass('active');
        $('.accordion ' + '#accordionChild-' + indexer).slideUp(300).removeClass('open');
    }

    $scope.clickSectionTitle = function (indexer) {
        // Grab current anchor value
        var accordionParent = "#accordionParent-" + indexer;

        if ($(accordionParent).is('.active')) {
            close_accordion_section(indexer);
        } else {
            close_accordion_section(indexer);
            // Add active class to section title
            $(accordionParent).addClass('active');
            // Open up the hidden content panel
            $('.accordion ' + '#accordionChild-' + indexer).slideDown(300).addClass('open');
        }
    }
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
CourseDetailsController.$inject = ['$scope', '$location', '$routeParams', WebAPIBaseURL, '$http'];