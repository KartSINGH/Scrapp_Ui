var app = angular.module('shuttlescrap', ['ui.router']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
/*app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.spinnerTemplate = '<div class="se-pre-con" ></div>';
}])*/
app.config(function ($locationProvider, $httpProvider,$stateProvider,$urlRouterProvider) {


    $locationProvider.hashPrefix('');

   /* $stateProvider
    .state('login', {
            url: "/",
            
            controller: "loginCtrl"
        })*/
        
});


//login Controller
app.controller('loginCtrl123',function($scope,$state,$http){
$scope.user = {};
$scope.signup = function($scope,$state){
    
  console.log("logincontroller called");
    console.log($scope.user.email);
    
}
});