angular.module('starter.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, MonthPicker, ionicDatePicker, $location) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    ///// Appointment part
    $scope.selectMonth = "";
    $scope.selectYear = "";
    $scope.selectApp = [];
    var memberId = localStorage.getItem('memberId');
    /// Use for get appointment , year and month is null (so it will return the current month and year appointment)
    /// happen in home page
    var getThisMonthAppointment = function () {
    // check if there is query in url
    // and fire search in case its value is not empty
    //   $scope.todayApp = [];
    $http.get("http://localhost:60800/VA/API/Appointment?memberId=" + memberId)
     .success(function(appointments) {
       $scope.selectApp = eval(appointments);
       console.log("getTodayAppointment work");
       console.log(appointments);
       $scope.newDate = new Date();
        var month = $scope.newDate.getUTCMonth()+1;
        var year = $scope.newDate.getUTCFullYear();
        $scope.selectMonth = month;
        $scope.selectYear = year;
     });
    };

    getThisMonthAppointment();
    // Setting for month picket
    var monthPickerOptions = {
      minYear: 1990,
      maxYear: 2200,
      maxMonthIndex: 12,
      startingYear: new Date().getFullYear()

    };

    $scope.thisDate = new Date();
    MonthPicker.init(monthPickerOptions);
    //Function myevent ==> happen when user select month and year
    // happen in appointment page
    $scope.showMonthDialog = function getSelectMonthApp(val) {
      MonthPicker.show(function(res) {
      if(res.year && res.month != null){
        var year = res.year;
        var month = res.month + 1;
        $http.get("http://localhost:60800/VA/API/Appointment?memberId=" + memberId + "&month=" + month + "&year=" + year)
          .success(function(response) {
            $scope.selectApp = eval(response);
            //  old
            console.log(response);
            $scope.selectMonth = month;
            $scope.selectYear = year;
          });
        }
      });

    };




/// Timetable part

   $scope.selectTimetable = [];
    $scope.timetableDate;
// at the bottom of your controller
 var getTodayTimeTable = function () {
   //Time table
   //Show date
   /// Run from the start /// get current day timetable
   $http.get("http://localhost:60800/VA/API/CheckTimetble?day=&&month=&&year=")
    .success(function(response) {
      $scope.selectTimetable = eval(response);
  //console.log( "Get to day time table work");
      $scope.timetableDate = $scope.selectTimetable[0];
  //    var defaultMonth = $scope.timetableDate.startTime;
  //    $scope.newDate = new Date(defaultMonth);
  //      $scope.selectMonth = $scope.newDate.getUTCMonth()+1;
  //     $scope.selectYear = $scope.newDate.getUTCFullYear();
  //   console.log("getTodayTimeTable");
    });
};
// and fire it after definition
getTodayTimeTable();



var timeTable = {
     callback: function getSelectTimeTable(val) {  //Mandatory

     var selectDate =  new Date(val);
     var timeMonth = selectDate.getUTCMonth() + 1; //months from 1-12
     var timeDay = selectDate.getUTCDate()+1;
     var timeYear = selectDate.getUTCFullYear();
       $http.get("http://localhost:60800/VA/API/CheckTimetble?day=" +timeDay +"&&month=" +timeMonth +"&&year=" + timeYear)
         .success(function(response) {
           $scope.selectTimetable = eval(response);
           $scope.timetableDate = $scope.selectTimetable[0];

         });
    //   console.log('Return value from the datepicker popup is : http://localhost:60800/VA/API/CheckTimetble?memberId=' + memberId +"&&day=" +timeday +"&&month=" +timemonth +"&&year=" + timeyear);
     },
     inputDate: new Date(),      //Optional
     mondayFirst: true,          //Optional
     closeOnSelect: false,       //Optional
     templateType: 'popup'       //Optional
   };

////When datepicker has select call this and this call above^
   $scope.openDatePicker = function(){
     ionicDatePicker.openDatePicker(timeTable);
   };


  })

  ///// set format of date
  .filter('dateToISO', function() {
    return function(input) {
      return new Date(input).toISOString();
    };
  })

  .filter('monthName', [function() {
    return function (monthNumber) { //1 = January
        var monthNames = [ 'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December' ];
        return monthNames[monthNumber - 1];
    }
}])




  .controller('LoginCtrl', function($scope, $http, $state) {
    $scope.account = {};
    $scope.login = function Login() {

      $http.get("http://localhost:60800/VA/API/Login?email=" + $scope.account.email +"&&password=" +$scope.account.password )
        .success(function(response) {
          var result = response;
          if (result != 0) {
            localStorage.setItem("loginSession", "true");
            localStorage.setItem("memberId", result);
              console.log(result);
            $state.go('app.home');
          } else {
            alert("email or password is incorrect")
          }
        })
        .error(function(response) {
          $scope.Result = "Error";
        });
    }

    $scope.logout = function() {
      localStorage.setItem("loginSession", "false");
      $state.go('login');
  window.location.reload();
    }

  })

  .controller('AccountCtrl', function($scope, $stateParams, $http, $window,$ionicModal,$state) {
  $scope.Profile = '';
    $scope.reloadRoute = function() {
       $state.reload();
       $http.get("http://localhost:60800/VA/API/MemberProfile?memberID=" + memberId)
         .success(function(response) {
           $scope.Profile = eval('(' + response + ')');
       //    console.log(response);
         });

    }
      $scope.data = {};
    var memberId = localStorage.getItem('memberId');
  //  console.log(memberId)
  $scope.clearPassword = function () {
      $scope.data.changepassword = "";
     $scope.data.repassword = "";

  };

    $http.get("http://localhost:60800/VA/API/MemberProfile?memberID=" + memberId)
      .success(function(response) {
        $scope.Profile = eval('(' + response + ')');
    //    console.log(response);
      });

/*Show modal*/
/*$ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope,
     backdropClickToClose: false
  }).then(function(modal) {
    $scope.modal = modal;
  });
                $scope.modal.hide();*/
///
    $scope.changeInfo = function() {
            $http.get("http://localhost:60800/VA/API/ChangMemberInfo?id=" + memberId +
            "&&email=" +$scope.Profile.email+
            "&&name="+ $scope.Profile.name +
              "&&surname="+ $scope.Profile.surname +
                "&&address="+ $scope.Profile.address +
                  "&&phonenumber="+ $scope.Profile.phonenumber
          )
              .success(function(response) {
                var result = response;
                    console.log(response);
                if (response.Result == "Edit success") {
                  alert(response.Result)
                    $window.location.reload();
                } else {
                  alert(response.Result)
                }
              })
              .error(function(response) {
                $scope.Result = "Error";
              });


    }

    $scope.changePassword = function() {
var password ="";
var repassword = "";
       if($scope.data.changepassword  != undefined  ){
          password = $scope.data.changepassword ;
       }
              if($scope.data.repassword  != undefined ){
              repassword =  $scope.data.repassword ;
              }
      $http.get("http://localhost:60800/VA/API/ChangPassword?id=" + memberId +"&&password=" +password+ "&&rePassword="+ repassword)
        .success(function(response) {
          var result = response;
              console.log(response);
          if (response.Result == "Edit success") {
            alert(response.Result)
              $window.location.reload();
          } else {
            alert(response.Result)
          }
        })
        .error(function(response) {
          $scope.Result = "Error";
        });
    }

  })


  ;
