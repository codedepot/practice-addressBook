var myApp = angular.module("myApp", ['ngRoute', 'firebase'])
.constant('FIREBASE_URL', 'https://addressbook-340d9.firebaseio.com/');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBxeD9_txuYD6ZdgzNTKBmR4LmEESiKLG0",
  authDomain: "addressbook-340d9.firebaseapp.com",
  databaseURL: "https://addressbook-340d9.firebaseio.com",
  storageBucket: "addressbook-340d9.appspot.com",
};
firebase.initializeApp(config);

//app routing script
myApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/favorite',{
    templateUrl: 'views/favorite.html',
    controller: "favoriteController",
    resolve:{
      factory: checkRouting
    }
  }).when('/contact-list', {
    templateUrl: 'views/contact-list.html',
    controller: 'contactListController',
    resolve:{
      factory: checkRouting
    }
  }).when('/map', {
    templateUrl: 'views/map.html',
    controller: 'mapController',
    resolve:{
      factory: checkRouting
    }
  }).when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'settingsController',
    resolve:{
      factory: checkRouting
    }
  }).when('/threads', {
      templateUrl: 'views/threads.html',
      controller: 'threadsController',
      resolve:{
        factory: checkRouting
      }
  }).when('/sign-in', {
    templateUrl: 'views/sign-in.html',
    controller: 'signInController'
  }).when('/sign-out', {
    templateUrl: 'views/sign-out.html',
    controller: 'signOutController'
  }).otherwise({
    redirectTo: '/sign-in'
    });
}]);

var checkRouting = function($q, $rootScope, $location){

  if(firebase.auth().currentUser === null){
    $location.path("/sign-in.html");
  }
};
//defining custom filters
myApp.filter('favorite', function () {
    return function (items, search) {
        var result = {};
        angular.forEach(items, function (value, key) {
          if(value.favorite == search){
            result[key] = value;
          }
        });
        return result;
    };
});

myApp.filter('nameSearch', function(){
  return function(items, search){
    var results = {};
    if(search === "" || search === undefined){
      return items;
    }else{
      angular.forEach(items, function(value, key){
        if(value.firstName.toLowerCase().indexOf(search.toLowerCase()) !=-1  ||value.lastName.toLowerCase().indexOf(search.toLowerCase())  != -1){
          results[key] = value;
        }
      });
      return results;
    }
  };
});

myApp.filter('emojiTranslate', function(){
  return function(items){
    //console.log(items);
    items = items.replace(/\|\*[0-9]*\*\|/g, function(results){
      //console.log("<img src='" + emojis[results.substring(2, results.length-2)][1] + "'>");
      return "< \&lt; img src='" + emojis[results.substring(2, results.length-2)][1] + "'>";
      //return results;
    });
    return items;
  };
});
