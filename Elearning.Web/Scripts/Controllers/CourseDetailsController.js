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

    /*
    * This is the plugin
    */
    $(function (a) {
        a.createModal = function (b) {
            defaults = { title: "", message: "Your Message Goes Here!", closeButton: true, scrollable: false };
            var b = a.extend({}, defaults, b);
            var c = (b.scrollable === true) ? 'style="max-height: 420px;overflow-y: auto;"' : "";
            html = '<div class="modal fade" id="myModal">';
            html += '<div class="modal-dialog">';
            html += '<div class="modal-content">';
            html += '<div class="modal-header">';
            html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
            if (b.title.length > 0) {
                html += '<h4 class="modal-title">' + b.title + "</h4>";
            }
            html += "</div>";
            html += '<div class="modal-body" ' + c + ">";
            html += b.message;
            html += "</div>";
            html += '<div class="modal-footer">';
            if (b.closeButton === true) {
                html += '<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>';
            }
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            a("body").prepend(html);
            a("#myModal").modal().on("hidden.bs.modal", function () { a(this).remove() });
        }
    })

    $scope.openPdf = function (chapterTitle) {
        /*
        * Here is how you use it
        */
        //$(function () {
        //    $('.view-pdf').on('click', function () {
        //var pdf_link = $(this).attr('href');
        var pdf_link = "https://elearningstrg.blob.core.windows.net/coursedocuments/jquery-tutorial-beginners.pdf";
                //var iframe = '<div class="iframe-container"><iframe src="'+pdf_link+'"></iframe></div>'
                //var iframe = '<object data="'+pdf_link+'" type="application/pdf"><embed src="'+pdf_link+'" type="application/pdf" /></object>'        
                var iframe = '<object type="application/pdf" data="' + pdf_link + '#toolbar=0" width="100%" height="500">No Support</object>';
                $.createModal({
                    title: chapterTitle,
                    message: iframe,
                    closeButton: true,
                    scrollable: false
                });
                //return false;
        //    });
        //})
    }
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
CourseDetailsController.$inject = ['$scope', '$location', '$routeParams', WebAPIBaseURL, '$http'];