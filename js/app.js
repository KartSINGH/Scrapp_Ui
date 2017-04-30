var app = angular.module('shuttlescrap', ['ui.router']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
/*app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.spinnerTemplate = '<div class="se-pre-con" ></div>';
}])*/

//login Controller
app.controller('otpCtrl', function ($scope,$http,$rootScope) {
    $scope.user = {};
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
        var isVerified;
        if($scope.user_otp==$rootScope.s_otp){
            console.log("OTP has been verified")
            
        }else{
           alert("Wrong OTP.Please try again")
           
        }
    }
    
});