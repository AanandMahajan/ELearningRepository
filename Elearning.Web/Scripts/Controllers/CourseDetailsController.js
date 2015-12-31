var CourseDetailsController = function ($scope, $location, $routeParams, WebAPIBaseURL, $http, $rootScope) {

    $scope.course = {};
    $scope.courseImageUrl = "";
    $scope.isDescription = true;
    $scope.isCourseLiked = true;
    $scope.isCourseEnrolled = false;

    $scope.btnClickDescription = function () {
        $scope.isDescription = true;
    }

    $scope.btnClickOutline = function () {
        $scope.isDescription = false;
    }

    $scope.btnLikeCourse = function () {

        //api/UserCourseLikeInfoes/5
        if ($scope.user.FullName == undefined) {
            alert('Please login before enrolling !! ');
        }
        else {
            var UserCourseLike = {};

            UserCourseLike.UserID = $scope.user.ID;
            UserCourseLike.CourseID = $scope.course.ID;
           
            $http.post(WebAPIBaseURL + 'api/UserCourseLikeInfoes/UserLikeInfo/getdata', angular.toJson(UserCourseLike)).then(

                   function successCallback(res) {

                       console.log(res);
                       if (res.data[0].length == 0) {

                           UserCourseLike.TenantID = 1;
                           UserCourseLike.LikeDate = new Date();
                           UserCourseLike.CategoryID = $scope.course.CategoryID;

                           $http.post(WebAPIBaseURL + 'api/UserCourseLikeInfoes/SaveUserLike/savedata', angular.toJson(UserCourseLike)).then(

                                function successCallback(res) {
                                    console.log("Course Liked" + res);
                                    $scope.isCourseLiked = false;
                                    $scope.course.Likes+=1;
                                },
                                function errorCallback(res) {
                                    console.log("Course Like Failed" + res);
                                }
                            );                   
                       }
                       else
                       {
                           var val = {};
                           val.ID = res.data[0][0].ID;
                           $http.post(WebAPIBaseURL + 'api/UserCourseLikeInfoes/DeleteUserLike/deletelike', angular.toJson(val)).then(

                                  function successCallback(res) {
                                      console.log("Course Liked" + res);
                                      $scope.isCourseLiked = true;
                                      $scope.course.Likes -= 1;
                                  },
                                  function errorCallback(res) {
                                      console.log("Course Like Failed" + res);
                                  }
                              );
                       }
                   },
               function errorCallback(res) {
                   console.log("Course Like Failed" + res);
               }
           );
        }
    }

    $scope.$on('GoToUserDashBoard', function (event, args) {
        $location.path('/routeHome');
    });

    $scope.$on('SearchResultSuccess', function (event, args) {

        if (args.data.value.length > 0)
        {
            $rootScope.isComingFromCourseDetails = true;
        }
        $location.path('/routeHome');
        //$scope.$digest();
    });


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
                     $scope.isCourseEnrolled = true;
                     $scope.course.Enrollments += 1;
                     //alert('User Enrolled for this course !! ');
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
                            
                                if ($scope.user.FullName != undefined) {
                                    var UserCourseLike = {};

                                    UserCourseLike.UserID = $scope.user.ID;
                                    UserCourseLike.CourseID = $scope.course.ID;
                                    UserCourseLike.TenantID = 1;
                                    UserCourseLike.StartedON = new Date();
                                    UserCourseLike.CategoryID = $scope.course.CategoryID;

                                    // Get Likes details
                                    $http.post(WebAPIBaseURL + 'api/UserCourseLikeInfoes/UserLikeInfo/getdata', angular.toJson(UserCourseLike)).then(

                                                     function successCallback(res) {

                                                         console.log(res);
                                                         if (res.data[0].length == 0) {
                                                             $scope.isCourseLiked = true;
                                                         }
                                                         else {
                                                             $scope.isCourseLiked = false;
                                                         }

                                                         if (res.data[1].length == 0) {
                                                             $scope.isCourseEnrolled = false;
                                                         }
                                                         else {
                                                             $scope.isCourseEnrolled = true;
                                                         }

                                                        


                                                     },
                                                 function errorCallback(res) {
                                                     console.log("Course Like Failed" + res);
                                                 }
                                             );
                                }
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
        $('#imgExpandCollapse-' + indexer).attr('src', '../../images/expand.png');
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
            //add collpase icon
            $('#imgExpandCollapse-' + indexer).attr('src', '../../images/collapse.png');
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
            html += '<div class="modal-dialog" style="width: 800px;">';
            html += '<div class="modal-content">';
            html += '<div class="model-header-style">';
            html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
            if (b.title.length > 0) {
                html += '<h4 class="modal-title">' + b.title + "</h4>";
            }
            html += "</div>";
            html += '<div class="modal-body" ' + c + ">";
            html += b.message;
            html += "</div>";
            html += '<div class="model-footer-style">';
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

    $scope.openPdf = function (chapterTitle, chapterFileBlobURL) {
        if ($scope.user.FullName != undefined) {
            /*
            * Here is how you use it
            */
            //$(function () {
            //    $('.view-pdf').on('click', function () {
            //var pdf_link = $(this).attr('href');
            //var pdf_link = "https://elearningstrg.blob.core.windows.net/coursedocuments/jquery-tutorial-beginners.pdf";
            //var iframe = '<div class="iframe-container"><iframe src="'+pdf_link+'"></iframe></div>'
            //var iframe = '<object data="'+pdf_link+'" type="application/pdf"><embed src="'+pdf_link+'" type="application/pdf" /></object>'        
            var iframe = '<object type="application/pdf" data="' + chapterFileBlobURL + '#toolbar=0" width="100%" height="500">No Support</object>';
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
        else {
            alert("Please login!!");
        }
    }
}

// The inject property of every controller (and pretty much every other type of object in Angular) needs to be a string array equal to the controllers arguments, only as strings
CourseDetailsController.$inject = ['$scope', '$location', '$routeParams', WebAPIBaseURL, '$http','$rootScope'];
