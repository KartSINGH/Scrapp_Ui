var app = angular.module('shuttlescrap', ['ui.router']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
/*app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.spinnerTemplate = '<div class="se-pre-con" ></div>';
}])*/
app.config(function ( $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
     $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $stateProvider

        .state('landingPage', {
            url: "/",
            templateUrl: "../templates/welcome.html",
            
        })
        .state('register',{
            url:'/register',
            templateUrl: "../templates/register.html",
            controller: "registerCtrl"
        })
         .state('userMain',{
            url:'/user',
            templateUrl: "../templates/user.html",
            controller: "userCtrl"
        })
        
});
//login Controller
app.controller('otpCtrl', function ($scope,$http,$rootScope,$state) {
    $scope.user = {};
    $state.go('register');
    $scope.signup = function () {

        console.log("logincontroller called");
        console.log($scope.user);
        var user_number = $scope.user.user_number;

        $http({
            method: 'POST',
            url: 'https://sendotp.msg91.com/api/generateOTP',
            headers: {
                "application-Key": "w7gEzSbCuU7xnHloQyf1Cq8SFtbEBOq0aShp5EVo2iJ6-IleyhL7ZVCIIGasO2_EfcDk-4YgwahdGaTQf9nRSD3KIflNgjB0QKyqAEGgUlhfQPwSHp4HqzlabTtSiYydAZafinYK8GsUudgYOkQeXw=="
            },
            data: {
                countryCode: 91,
                mobileNumber: user_number,
                getGeneratedOTP: true
            }
        }).then(function (data) {

            $rootScope.s_otp = data.data.response.oneTimePassword;
            console.log($rootScope.s_otp);

           // $state.go("otp-enter");


        }, function (error) {
            console.log("error");
            alert("error occured");
        })
    }
    $scope.verify_otp=function(){
        console.log("Your Otp is getting under verification");
        console.log($scope.user_otp);
        
        if($scope.user_otp==$rootScope.s_otp){
            console.log("OTP has been verified");
            $state.go('register');
            
        }else{
           alert("Wrong OTP.Please try again")
           
        }
    }
    
});

//register Controller

app.controller('registerCtrl',function($scope,$http,$rootScope,$state){
    console.log("register controller called")
    $scope.signup=function(){
        console.log($scope.register);
           $http({
            method: 'POST',
            url: 'http://localhost:8886/register/submit_user',
            data: {
                phone_number: $scope.register.phone_number,
                user_name: $scope.register.name,
                user_password: $scope.register.password,
                user_email:$scope.register.email,
                user_totalcredits:'0'
            }
        }).then(function (res) {
            console.log("User has been registered!");
            console.log(res);
            $state.go('userMain');



        }, function (error) {
            console.log("error");
            alert("error occured");
        })
    }

    $scope.login=function(){
        console.log('login function called');
            $http({
            method: 'POST',
            url: 'http://localhost:8886/register/user',
            data:{
                user_email: $scope.userlogin_email
            }
        }).then(function (res) {
           
            console.log(res.data.user_password);
            console.log("input password"+$scope.userlogin_password);
            if($scope.userlogin_password==res.data.user_password){
                $state.go('userMain');
            }else{
                alert('Invalid Password');
            }
            
        }, function (error) {
            console.log(error);
            alert("error occured");
        })
    }
});
//UserMAIN CONtroller
app.controller('userCtrl',function($scope){
    console.log("user Main controller called")
});