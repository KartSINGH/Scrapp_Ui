var app = angular.module('shuttlescrap', ['ui.router']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
/*app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.spinnerTemplate = '<div class="se-pre-con" ></div>';
}])*/
app.config(function ($locationProvider, $httpProvider,$stateProvider) {


    $locationProvider.hashPrefix('');

    /*$stateProvider
    .state('login', {
            url: "/login",
            templateUrl: "./reqForm.html",
            controller: "step2Control"
        })*/
        
});
app.controller('loginCtrl',function($scope,$state,$http){
console.log("logincontroller called");
$scope.signup = function($scope){
  $scope.email1="kartik"
    console.log($scope.email1);
    
}
});