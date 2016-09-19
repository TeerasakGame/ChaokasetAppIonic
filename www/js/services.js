angular.module('starter.services', [])

.factory('Auth', function($http) {
  // Might use a resource here that returns a JSON array

  return {
    login: function(email,password) {
      return password;
      /*var data = "email="+email+"&password="+password;
      $http.post('http://172.18.6.120/chaokaset/index.php/services/login', data, config)
        .success(function (data, status, headers, config) {
          //  alert(JSON.stringify(data.status));
            if(data.status === true){
            //  alert("TRUE");
              alert("dddd : "+JSON.stringify( data.data));
              return data.data;
            }else{
            //  alert("FALSE");
              return FALSE;
            }
        })
        .error(function (data, status, header, config) {
            //alert("ต่อเซิฟไม่ได้!!");
            return FALSE;
        });*/
    },

  };
});
