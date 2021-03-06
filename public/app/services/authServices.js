var app = angular.module('authServices', []);
app.factory('Auth', ['$http', 'AuthToken', function($http, AuthToken) {
   var authFactory = {};
   //Auth.login(loginData);
   authFactory.login = function(loginData) {
      return $http.post('/api/authenticate', loginData).then(function(response) {
         //console.log(response.data.token);
         AuthToken.setToken(response.data.token);
         return response;
      });
   };
   //Auth.isLoggedIn();
   authFactory.isLoggedIn = function() {
      if (AuthToken.getToken()) {
         return true;
      } else {
         return false;
      }
   };
   //Auth.getUser();
   authFactory.getUser = function() {
      if (AuthToken.getToken()) {
         return $http.post('/api/me');
      } else {
         $q.reject({
            message: "User Has No Token"
         });
      }
   };
   //Auth.logout();
   authFactory.logout = function() {
      AuthToken.setToken();
   };
   return authFactory;
}]);
app.factory('AuthToken', [function() {
   var authTokenFactory = {};

   //AuthToken.setToken(token);
   authTokenFactory.setToken = function(token) {
      if (token) {
         window.localStorage.setItem('token', token);
      } else {
         window.localStorage.removeItem('token');
      }

   };
   //AuthToken.getToken();
   authTokenFactory.getToken = function() {
      return window.localStorage.getItem('token');
   };

   return authTokenFactory;
}]);
app.factory('AuthInterceptors', ['AuthToken',function(AuthToken) {
   var authInterceptorsFactory = {};
   authInterceptorsFactory.request = function(config) {
      var token = AuthToken.getToken();
      if (token) {
         config.headers['x-access-token'] = token;
      }
      return config;
   };
   return authInterceptorsFactory;
}]);
