//var userName = "testeruser@me.com";
var uid = "-KPY5JnxA95tOaVthVYh";
var name = "default name";
var emojis;


myApp.run(function($rootScope){
  //get all the contacts
  $rootScope.currentUser = firebase.auth().currentUser;
  if(firebase.auth().currentUser !== null){
    uid = firebase.auth().currentUser.uid;


    firebase.database().ref(uid+"/info").once("value", function(snapshot){
      name = snapshot.val().name;
    });
  }


  $rootScope.delete = function(key){
    firebase.database().ref(uid + "/contacts/" + key).remove();
  };

  //updating contact
  $rootScope.editContactModal = function(key){
    var modal = $("#editContact");
    modal.attr("data-key", key);
    //console.log(firebase.database().ref(key));
    firebase.database().ref(uid + "/contacts/" + key).once("value", function(snapshot){
      var user = snapshot.val();
      modal.find("#firstName").val(user.firstName);
      modal.find("#lastName").val(user.lastName);
      modal.find("#phoneNum").val(user.phoneNum);
      modal.find("#desc").val(user.description);
      modal.find("#address").val(user.address);
      //modal.find("address").val(user.address);
    });
  };

  //gets values from edit modal and updates database
  $rootScope.updateContactVals = function(){
    var modal = $("#editContact");
    var updates = {
      firstName: modal.find("#firstName").val(),
      lastName: modal.find("#lastName").val(),
      description: modal.find("#desc").val(),
      phoneNum: modal.find("#phoneNum").val(),
      address: modal.find("#address").val(),
      favorite: "" + modal.find("#fav")[0].checked
    };
    firebase.database().ref(uid + "/contacts/" + modal.attr("data-key")).set(updates);
    if(modal.find("#address").val() !== ""){
      generateCord(modal.find("#address").val(), function(position){
        firebase.database().ref(uid + "/contacts/" + modal.attr("data-key") + "/position").set(position);
      });
    }
    modal.modal("hide");
  };

  $rootScope.deleteContactModalPop = function(key){
    $("#deleteContactModal").attr("data-key", key);
  };

  $rootScope.deleteContact = function(){
    var key = $("#deleteContactModal").attr("data-key");
    firebase.database().ref(uid + "/contacts/" + key).remove().then(function(){
      $("#deleteContactModal").modal("hide");
    });
  };
});

myApp.controller("contactListController", ['$rootScope', '$scope', function($rootScope, $scope){
    $rootScope.currentUser = firebase.auth().currentUser;
    uid = firebase.auth().currentUser.uid;
    //get the list of contacts
    firebase.database().ref(uid + "/contacts").on("value", function(snapshot){

      $scope.list = snapshot.val();
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    });

    $scope.saveContact = function(first, last, phone, desc, addr, fav){
      favorite = "false";
      if(fav){
        favorite = "true";
      }
      var writeObj ={
        address: addr,
        firstName: first,
        lastName: last,
        description: desc,
        phoneNum: phone,
        favorite: favorite
      };
      //inserting a new datapoint
      var key = firebase.database().ref(uid + "/contacts").push().key;
      firebase.database().ref(uid  + "/contacts/" + key).set(writeObj).then(function(){
          $("#addNewContact").modal("hide");
          $("#addNewContact").find("input[type=text]").val("");
      });

      //updating the lat and lng
      if(addr !== ""){
        generateCord(addr, function(position){
          firebase.database().ref(uid  + "/contacts/" + key + "/position").set(position);
        });
      }

      //firebase.ref.push();
    };
    $scope.setFav = function(key, value){
      //var updates = {};
      //updates[key] = {'favorite':'true'};
      firebase.database().ref(uid  + "/contacts/" + key + '/favorite').set(value);
    };

}]);

myApp.controller("favoriteController",['$rootScope', '$scope', function($rootScope, $scope){
  $rootScope.currentUser = firebase.auth().currentUser;
  uid = firebase.auth().currentUser.uid;
  firebase.database().ref(uid + "/contacts").on("value", function(snapshot){
    $scope.list = snapshot.val();
    //$scope.$apply();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
  });

  $scope.removeFav = function(key){
    firebase.database().ref(uid  + "/contacts/" + key + "/favorite").set('false');
  };

}]);

myApp.controller('mapController', ['$rootScope','$scope', function($rootScope, $scope){
  $rootScope.currentUser = firebase.auth().currentUser;
  uid = firebase.auth().currentUser.uid;

  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBxeD9_txuYD6ZdgzNTKBmR4LmEESiKLG0&callback=initMap',
    dataType: 'script'
  });
  var contacts;
  setTimeout(function(){
    firebase.database().ref(uid ).on("value", function(snapshot){
      contacts = snapshot.val().contacts;
      var bounds = new google.maps.LatLngBounds();
      angular.forEach(contacts, function(value, key){
        if(value.position){
          var marker = new google.maps.Marker({
            position: value.position,
            map: map,
            title: value.firstName + " " + value.lastName,
            label: value.firstName.substring(0,1)
          });
          bounds.extend(marker.position);
        }
      });
      if(snapshot.val().info.position !== undefined){
        bounds.extend(snapshot.val().info.position );
        var marker = new google.maps.Marker({
          position: snapshot.val().info.position ,
          map: map,
          title: "you",
          label: 'YOU'
        });
      }
      map.fitBounds(bounds);
    });
  }, 1500);


}]);

myApp.controller('threadsController', ['$rootScope', '$scope', function($rootScope, $scope){
  $scope.uid = firebase.auth().currentUser.uid;
  $rootScope.currentUser = firebase.auth().currentUser;
  uid = firebase.auth().currentUser.uid;
  firebase.database().ref(uid+"/info").once("value", function(snapshot){
    name = snapshot.val().firstName + " " + snapshot.val().lastName;
  });

  //getting the threads
  firebase.database().ref("threads").on("value", function(snapshot){
    $scope.threads = snapshot.val();
    if(!$scope.$$phase) {
      $scope.$apply();
    }
    //replacing the emoji codes with actual imgs
    // $(".post-content").each(function(){
    //   $(this).html($(this).html().replace(/\|\*[0-9]*\*\|/g, function(results){
    //     var key = results.substring(2, results.length -2);
    //     return "<img title='" + emojis[key][0] + "' src='" + emojis[key][1] + "'>";
    //   }));
    // });

  });

  //emojicon json processing

  $.getJSON("../js/lib/emojis.json", function(data){
    $scope.emojis = data;
    emojis = data;
  });

  $scope.addReply = function(){
    //if something is open
    if($(".collapse.in").length ===1){
      var tid = $(".thread-posts.collapse.in").attr("id");
      var postKey = firebase.database().ref("threads/" + tid + "/content").push();
      //var name =
      firebase.database().ref("threads/" + tid + "/content/" + "" + Date.now() + ":" + uid + "(" + name + ")").set($("#replyText").val()).then(function(){
        $("#replyText").val("");
      });
    }else{
    }

  };
  $scope.deletePost = function(thread_key, key){
    firebase.database().ref("threads/" + thread_key + "/content/" + key).remove();
  };

  $scope.insertEmoji = function(key){
    var identifier1 = "|*";
    var identifier2 = "*|";
    $("#replyText").val($("#replyText").val() + identifier1 + key + identifier2);
  };

  $scope.createThread = function(title){
    var key = firebase.database().ref("threads/").push().key;
    firebase.database().ref("threads/" + key + "/title").set(title);
  };

}]);

myApp.controller('settingsController', ['$rootScope', '$scope', function($rootScope, $scope){
 $rootScope.currentUser = firebase.auth().currentUser;
 uid = firebase.auth().currentUser.uid;
 var originalAddress;

 firebase.database().ref(uid + "/info").once("value", function(snapshot){
   var info = snapshot.val();
   $("#firstName").val(info.firstName);
   $("#lastName").val(info.lastName);
   $("#address").val(info.address);
   originalAddress  = info.address;
 });

 $scope.saveChanges = function(){
   writeObj = {
     firstName: $("#firstName").val(),
     lastName: $("#lastName").val(),
     address: $("#address").val(),
     //phoneNum: $("#phone").val()
   };

   firebase.database().ref(uid + "/info").update(writeObj);
   if($("#address").val() !== originalAddress){
     generateCord($("#address").val(), function(position){
       firebase.database().ref(uid + "/info/position").set(position);
     });
   }
 };

}]);

myApp.controller('signInController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location){
    $rootScope.currentUser = firebase.auth().currentUser;
    if($rootScope.currentUser  !== null){
      $location.path('/contact-list');
    }
    $scope.signin = function(email, password){
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        uid = firebase.auth().currentUser.uid;
        $location.path('/contact-list');
        //$("#loginError").html("logging in...");
        if (!$scope.$phase) {
          $scope.$apply();
        }
      }).catch(function(error){
        $("#loginError").html("" + error);
        $("#loginError").show();
      });

    };

    $scope.register = function(fname, lname, email, password, address, phone){

      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error){
        console.log(error);
      }).then(function(){
        uid = firebase.auth().currentUser.uid;
        var writeObj = {
          address: address,
          firstName: fname,
          lastName: lname,
          phoneNum: phone
        };
        firebase.database().ref(uid + "/info").set(writeObj);
        $rootScope.currentUser = firebase.auth().currentUser;
        uid = firebase.auth().currentUser.uid;
        $location.path("/contact-list");
        if(address !== ""){
          generateCord(address, function(position){
            firebase.database().ref(uid + "/info/position").set(position);
          });
        }
        if (!$scope.$phase) {
          $scope.$apply();
        }
      });
    };
    $("#email, #password").on("keydown", function(e){
      if(e.keyCode === 13){
        $("#loginBtn").click();
      }
    });
}]);


myApp.controller('signOutController', ['$rootScope', '$scope', '$location', function($rootScope, $scope, $location){
  firebase.auth().signOut().then(function(){
    $rootScope.currentUser = firebase.auth().currentUser;
    $location.path("/sign-in");
    if (!$scope.$$phase) {
      $scope.$apply();
    }
  });


}]);
