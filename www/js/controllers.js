angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('LoginCtrl',function($scope, $cordovaOauth, $http, $state){
  //ปรพกาศตัวแปรเป็น obj เอาไว้ใส่ค่า user
  $scope.user = { username: '', password : ''};
  // ฟังก์ชั่นรับตัวแปรจาก form
  $scope.doLogin = function(form) {
    //ถ้าส่งข้อมูลมาครบ
    if(form.$valid) {
      console.log('Sign-In', $scope.user.username);
       $state.go("app.crop");
    }
  };
  $scope.LoginFacebook = function(){
    console.log("LoginFacebook");
    $cordovaOauth.facebook(id_Facebook, ["email","public_profile"]).then(function(result) {
            //alert( JSON.stringify(result));
            //alert(result.access_token);
            var token = result.access_token;
          //  alert(token);
            var urlna = "https://graph.facebook.com/v2.7/me?fields=id%2Cname%2Cemail%2Cpicture&access_token="+token;

            $http.get(urlna).then(function(response) {
              alert("API OK : "+JSON.stringify(response));
              //  $scope.aaa =  JSON.stringify(response);
              //  alert(response.data);
              $state.go("app.crop");
            },function(error) {
              alert("error API : "+JSON.stringify(error));
            //  $scope.aaa = "error";
            });
        }, function(error) {
            // error
            alert(error);
        });
  };
})

.controller('RegisterCtrl',function($scope,$compile,$state,$ionicActionSheet,$cordovaCamera){
  $scope.Tels = [{id: 'tel1'}];
  $scope.addTel = function(){
    if ($scope.Tels.length < 3){
      var newItemNo = $scope.Tels.length+1;
      $scope.Tels.push({'id':'choice'+newItemNo});
    }else {
      console.log("no add");
    }

  };
  $scope.Remove = function(){
    if($scope.Tels.length <= 1){
      console.log("no remove");
    }else {
      var newItemNo = $scope.Tels.length-1;
      console.log("remove: "+newItemNo);
      $scope.Tels.pop();
    }

  };

  $scope.image = "img/Add_Image.png";
  $scope.showDetail = function() {
    $ionicActionSheet.show({
      //titleText: 'การนำเข้ารูป',
      buttons: [
        { text: '<center>จากเครื่อง</center>' },
        { text: '<center>จากกล้อง</center>' },
      ],
      cancelText: 'ยกเลิก',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
          switch (index) {
            case 0:
            //  alert("111");
              var options = {
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
                    correctOrientation: true,
                    quality: 100,
                    allowEdit: true,
                  }
              $cordovaCamera.getPicture(options).then(function(imageData){
                $scope.image = imageData;
                //$scope.imgURI = "data:image/jped;base64," + results;
              },function(err){

              });
              break;
            case 1:
                //alert("222");
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    //  targetWidth: 300,
                    //targetHeight: 400,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true,
                    correctOrientation:true
                    };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                $scope.image = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                // error
                });
              break;
          }
        console.log('BUTTON CLICKED', index);
        return true;
      },
    });
  };
  $scope.addMember = function(){
    console.log("addd");
    $state.go("app.crop");
  };

})

.controller('CropCtrl',function($scope, $http, $state){
  $scope.myVar = 'closed';
  $scope.api = [  { Name: 'แปลงสาธิต', Plant: 'ข้าว',Seed:'กข.45' },];
  $scope.shouldShowDelete = false;
  $scope.shouldShowReorder = false;
  $scope.listCanSwipe = true;
  $scope.doRefresh = function() {
    $http.get("http://angsila.cs.buu.ac.th/~55160287/ionic_res.php").then(function(resp){
    $scope.api = [
        { Name: 'แปลงสาธิต', Plant: 'ข้าว',Seed:'กข.45' },
        { Name: 'แปลงสาธิต2', Plant: 'ข้าว',Seed:'หอมมะลิ' },
      ];
    }, function(err){
        console.error('ERR', err);
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    })
  };
  console.log('Crop');
  $scope.add = function(){
    console.log("add crop fn");
    $state.go("app.addCrop");
  }
})

  .controller('AddCropCtrl',function($state){
    console.log('add crop');

  })

 .controller('CropDetailCtrl',function($scope){
   console.log('Detail');
 })

 .controller('CropTimelineCtrl',function($scope, $state){
   $scope.timeline = [{
      date: new Date(),
      title: "การเตรียมดิน",
      author: "วันที่ 1 ส.ค.59 - 10 ส.ค.59",
      profilePicture: "img/chaokaset_logo.png",
      Picture:"true",
      text: "รายละเอียด",
      a:'0',
      type: "picture"

    }, {
      date: new Date(),
      title: "กู้เงิน",
      author: "วันที่ 2 ส.ค.59",
      profilePicture: "",
      Picture:"false",
      text: "รายละเอียด",
      a:'1',
      type: "video"

    }, {
      date: new Date(),
      title: "เพลี้ยลง",
      author: "วันที่ 10 ส.ค.59",
      profilePicture: "img/chaokaset_logo.png",
      Picture:"true",
      text: "รายละเอียด",
      a:'1',
      type: "location"

    }, {
      date: new Date(),
      title: "เอาน้ำเข้านา",
      author: "วันที่ 12 ส.ค.59",
      profilePicture: "img/chaokaset_logo.png",
      Picture:"5555",
      text: "รายละเอียด",
      a:'1',
      type: "picture"
    }]
    $scope.addActivities = function(){
      console.log("add Act");
      $state.go("app.addActivities");
    };

 })

 .controller('CropAccountCtrl',function(){

 })

 .controller('CropProblemCtrl',function(){

 })

 .controller('AddActivitiesCtrl',function($scope, $state){
   $scope.summit = function(){
     $state.go("app.tab.cropTimeline");
   };
 })

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
