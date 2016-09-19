angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.name = localStorage.getItem('name');
  //$scope.login = localstorage.getItem(login);
  var path = localStorage.getItem('pic');
  $scope.pic = ip_server+path;
  //$state.go("app.crop");
  //alert($scope.pic);
// $scope.id = localstorage.getItem(id);

})

.controller('LoginCtrl',function($scope, $cordovaOauth, $http, $state,$ionicViewService){
  $ionicViewService.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });
  //ปรพกาศตัวแปรเป็น obj เอาไว้ใส่ค่า user
  $scope.user = { username: '', password : ''};
  var check = localStorage.getItem('login');
  //alert(check);

  if(check === true || check === "true"){
    //alert("login แล้ว");
    $state.go("app.crop");
  }


  // ฟังก์ชั่นรับตัวแปรจาก form
  $scope.doLogin = function(form) {

    //ถ้าส่งข้อมูลมาครบ
    if(form.$valid) {
      console.log('Sign-In');
      // send login data
     var data = "email="+$scope.user.username+"&password="+$scope.user.password;
     console.log(data);
     var ip = ip_server+'/index.php/services/login';
     alert(ip);
     console.log(ip);
      $http.post(ip, data, config)
        .success(function (data, status, headers, config) {
          //  alert(JSON.stringify(data.data.name));
            if(data.status === true){
              console.log("log in true");
              $scope.error = "";
              localStorage.setItem('login',true);
              localStorage.setItem('name',data.data.name);
              localStorage.setItem('pic',data.data.pic);
              localStorage.setItem('id',data.data.idUser);
              $state.go("app.crop");
            //  alert("TRUE");
            }else{
              $scope.error = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
            //  alert("FALSE");
            }
        })
        .error(function (data, status, header, config) {
            //alert("error: "+JSON.stringify(data) );
            console.log("login error");
            $scope.error = "ติดต่อ server ไม่ได้";
            alert($scope.error);
            //$state.go("app.login");
        });
        /*$scope.dataa = Auth.login($scope.user.username,$scope.user.password);
        alert("aaaaa : "+JSON.stringify($scope.dataa));*/
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
            //  alert("API OK : "+JSON.stringify(response));
              //  $scope.aaa =  JSON.stringify(response);
              var fullname = response.data.name;
              var email = response.data.email;
              var facebookid = response.data.id;
              //alert(fullname+email+facebookid+"////"+token);
              var ip = ip_server+"/index.php/services/loginfacebook";
            //  alert(ip);
              var data = "name="+fullname+"&email="+email+"&token="+token+"&acter=1&id="+facebookid;
            //  alert(data);
              $http.post(ip, data, config)
                .success(function (data, status, headers, config) {
                    if(data.status === true){
                    //  alert("TRUE");
                      var check = localStorage.getItem('login');
                    //  alert(data.data.idUser);
                      localStorage.setItem('login',true);
                      localStorage.setItem('name',data.data.name);
                      localStorage.setItem('pic',data.data.pic);
                      localStorage.setItem('id',data.data.idUser);
                      $state.go("app.crop");
                    }else{
                      alert("FALSE");
                    }
                }).error(function (data, status, header, config) {
                    //alert("error: "+JSON.stringify(data) );
                    console.log("login error");
                    $scope.error = "ติดต่อ server ไม่ได้";
                    alert($scope.error);
                    //$state.go("app.login");
                });
              //$state.go("app.crop");
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

.controller('RegisterCtrl',function($scope,$compile,$state,$ionicActionSheet,$cordovaCamera,$http,$cordovaFileTransfer){
  $scope.Tels = [{id: 'tel1'}];
  $scope.register = { name: '', lname : '',email:'',password:''};
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
                  //  encodingType: Camera.EncodingType.JPEG,
                    quality: 100,
                    allowEdit: true,
                    popoverOptions: CameraPopoverOptions,
                    targetWidth: 400,
                    targetHeight: 400,

                  }
              $cordovaCamera.getPicture(options).then(function(imageData){
                $scope.image = imageData;
                $scope.pic = imageData;
              //  $scope.image = "data:image/jpeg;base64," + imageData;

              },function(err){

              });
              break;
            case 1:
                //alert("222");
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                  //  encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 400,
                    targetHeight: 400,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true,
                    correctOrientation:true,

                    };

                $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                $scope.image = imageData;
                $scope.pic = imageData;
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

  $scope.doRegister = function(form){
    if(form.$valid) {
      //alert("ok");
      console.log($scope.register);
      console.log($scope.Tels);
      //var tel = $scope.Tels.data;
      //console.log("tel : "+$scope.Tels.length);
      var tel = [];
      datatel = "";
      for (i = 0; i < $scope.Tels.length; i++) {
        //tel.push($scope.Tels[i].data);
        tel[i] =  $scope.Tels[i].data;
        datatel = datatel+"&tel["+i+"]="+tel[i];
      }
      console.log(tel);
    //  $scope.image = $scope.image.toString();
      var data = "name="+$scope.register.name+"&lname="+$scope.register.lname+"&email="+$scope.register.email+"&pic="+$scope.image+"&acter=1&password="+$scope.register.password+datatel;
      console.log($scope.pic);
      //alert("phone : "+$scope.pic);
    //  alert($scope.image.length);
      var ip = ip_server+'/index.php/services/register';
      console.log(ip);
      //alert(ip);
    /*  var options = {
            fileKey: "file",
            fileName: "image.jpg",
            chunkedMode: false,
            mimeType: "image/jpg",
        };
        $cordovaFileTransfer.upload("http://172.18.6.120/index.php/services/file", $scope.pic, options).then(function(result) {
            alert("SUCCESS: " + JSON.stringify(result));
        }, function(err) {
            alert("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            // constant progress updates
        });*/


       $http.post(ip, data, config)
         .success(function (data, status, headers, config) {
           alert("server ok: "+JSON.stringify(data.data));
           $scope.id = data.data.idUser;
           var options = {
                   fileKey: "file",
                   fileName: "image.jpg",
                   chunkedMode: false,
                   mimeType: "image/jpg",
                   headers:{'headerParam':'headerValue'},
                   httpMethod:"POST",
                   params : {'id':$scope.id}
               };
           //var server = "http://172.18.6.120/index.php/services/file";
           var server = "http://172.18.6.120/chaokaset/upload/profile/upload.php";
           var filePath = $scope.pic;
           $cordovaFileTransfer.upload(encodeURI(server), filePath, options)
               .then(function(result) {
                 // Success!
                // alert("Success : "+JSON.stringify(result.response));
                 //$scope.datar = result;
               }, function(err) {
                 // Error
                 alert("ERROR : "+JSON.stringify(err));
               }, function (progress) {
                 // constant progress updates
               });

               if(data.status === true){
                // alert("TRUE");
                 var check = localStorage.getItem('login');
                 alert(data.data.idUser);
                 localStorage.setItem('login',true);
                 localStorage.setItem('name',data.data.name);
                 localStorage.setItem('pic',data.data.pic);
                 localStorage.setItem('id',data.data.idUser);
                 $state.go("app.crop");
               }else{
                 alert("FALSE");
               }

         })
         .error(function (data, status, header, config) {
             //alert("error: "+JSON.stringify(data) );
             console.log("login error");
             $scope.error = "ติดต่อ server ไม่ได้ 555";
             alert($scope.error);
             //$state.go("app.login");
         });


    }
  };



})

.controller('CropCtrl',function($scope, $http, $state, $ionicViewService){
  $ionicViewService.nextViewOptions({
    disableAnimate: true,
    disableBack: true
  });

  $scope.name = localStorage.getItem('name');
  var path = localStorage.getItem('pic');
  $scope.pic = ip_server+path;

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

    $scope.addAccount = function(){
      $state.go("app.addAccount");
    };

    $scope.addProblem = function(){

      $state.go("app.addProblem");
    };

    $scope.settingsTimeline = function(){
      $state.go("app.settingsTimeline");
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

 .controller('AddAccountCtrl',function($scope, $state){
   $scope.summit = function(){
     $state.go("app.tab.cropTimeline");
   };
 })

 .controller('AddProblemCtrl',function($scope, $state, $ionicActionSheet, $cordovaCamera){
   $scope.image = "img/Add_Image.png";
   $scope.summit = function(){
     $state.go("app.tab.cropTimeline");
   };
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
 })

 .controller('SettingsTimelineCtrl',function($scope, $state){
   $scope.summit = function(){
     $state.go("app.tab.cropTimeline");
   };
 })

 .controller('LogoutCtrl', function($state) {
   alert("logout");
    localStorage.removeItem('name');
    localStorage.removeItem('login');
    localStorage.removeItem('pic');
    localStorage.removeItem('id');
  /*  localStorage.setItem('name',"");
    localStorage.setItem('login',"");
    localStorage.setItem('pic',"");
    localStorage.setItem('id',"");*/
    $state.go("login");
 })

.controller('CalendarCtrl', function() {
});
