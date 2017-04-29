var app = angular.module('shuttlescrap', ['ui.router']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
/*app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.spinnerTemplate = '<div class="se-pre-con" ></div>';
}])*/

//login Controller
app.controller('otpCtrl',function($scope){
$scope.user = {};
$scope.signup = function(){
    
  console.log("logincontroller called");
    console.log($scope.user);
    var user_number = $scope.user_number;
}
});