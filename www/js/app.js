// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-monthpicker','ionic-datepicker'])

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(false);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .directive('ngEnter', function() {
          return function(scope, element, attrs) {
              element.bind("keydown keypress", function(event) {
                  if(event.which === 13) {
                          scope.$apply(function(){
                                  scope.$eval(attrs.ngEnter);
                          });

                          event.preventDefault();
                  }
              });
          };
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html'
          }
        }
      })

      .state('app.appointment', {
        url: '/appointment',
        views: {
          'menuContent': {
            templateUrl: 'templates/appointment.html'
          }
        }
      })

      .state('app.timetable', {
        url: '/timetable',
        views: {
          'menuContent': {
            templateUrl: 'templates/timetable.html'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html',
            controller: 'AccountCtrl'
          }
        }
      })

      .state('login', {
          cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      });

      // if none of the above states are matched, use this as the fallback
   if (localStorage.getItem("loginSession") == "null") {
       localStorage.setItem("loginSession", "false");
   }

   var checkLoginSession = localStorage.getItem("loginSession");
   if (checkLoginSession == "true") {
       $urlRouterProvider.otherwise('/app/home');
   } else {
       $urlRouterProvider.otherwise('/login');
   }


  });
