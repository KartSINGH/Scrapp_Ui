var app = angular.module('shuttlescrap', ['ui.router', 'ngStorage','angular-loading-bar']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $localStorageProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $stateProvider

        .state('landingPage', {
            url: "/",
            templateUrl: "../templates/welcome.html",

        })
        .state('register', {
            url: '/register',
            templateUrl: "../templates/register.html",
            controller: "registerCtrl",
            authenticate: true
        })
        .state('userMain', {
            url: '/user',
            templateUrl: "../templates/user.html",
            controller: "userCtrl",
            authenticate: true
        })

});


app.run(function ($rootScope, $state, $timeout) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.authenticate == true) {
            if ($rootScope.user.loggedIn == false) {
                $timeout(function () {
                    console.log("app.run")
                    $state.go('register')
                })

            }
        }
    })
});

//login Controller
app.controller('otpCtrl', function ($scope, $http, $rootScope, $state) {
    $rootScope.user = {};
    $state.go('register');
    $scope.signup = function () {

        console.log("otp controller called");
        console.log($rootScope.user);
        var user_number = $rootScope.user.user_number;

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
    $scope.verify_otp = function () {
        console.log("Your Otp is getting under verification");
        console.log($scope.user_otp);

        if ($scope.user_otp == $rootScope.s_otp) {
            console.log("OTP has been verified");
            $state.go('register');

        } else {
            alert("Wrong OTP.Please try again")

        }
    }

});

//register Controller

app.controller('registerCtrl', function ($scope, $http, $rootScope, $state) {
    console.log("register controller called")
    $rootScope.user.loggedIn = "false";
    $scope.signup = function () {
        console.log("before sign up  " + $rootScope.user);
        $http({
            method: 'POST',
            url: 'http://localhost:8886/register/submit_user',
            data: {
                phone_number: $scope.phone_number,
                user_name: $scope.user_name,
                user_password: $scope.user_password,
                user_email: $scope.user_email,
                user_totalcredits: '0'
            }
        }).then(function (res) {
            console.log("User has been registered!");
            console.log(res);
            $rootScope.user_data = res.config.data;
            console.log("user_data " + $rootScope.user_data);
            $rootScope.user.loggedIn = "true";

            $state.go('userMain');
        }, function (error) {
            console.log("error");
            $rootScope.user.loggedIn = "false";
            console.log("After failed sign up user rootscope " + $rootScope.user);
            alert("error occured");

        })
    }

    $scope.login = function () {
        console.log('login function called');
        $http({
            method: 'POST',
            url: 'http://localhost:8886/register/user',
            data: {
                user_email: $scope.userlogin_email
            }
        }).then(function (res) {

            console.log(res);
            $rootScope.user_data = res.data;
            console.log($rootScope.user_data);
            console.log("input password" + $scope.userlogin_password);
            if ($scope.userlogin_password == res.data.user_password) {
                $rootScope.user.loggedIn = "true";
                console.log($rootScope.user.loggedIn);

                $state.go('userMain');
            } else {
                $rootScope.user.loggedIn = "false";
                alert('Invalid Password');
            }

        }, function (error) {
            console.log(error);
            alert("error occured");
            $rootScope.user.loggedIn = "false";
        })
    }
});
//UserMAIN CONtroller
app.controller('userCtrl', function ($scope, $rootScope, $state, $http, $window) {
if($rootScope.user.loggedIn=="true"){
    console.log("user Main controller called")
    $scope.logout = function () {
        $rootScope.user.loggedIn = false;
        $window.localStorage.clear();
        $state.go('register');
    }

    $scope.check = function () {
        console.log($rootScope.user);
        if ($rootScope.user.loggedIn=="true") {
            console.log("will remain here")
        } else {
            $state.go('register');
            console.log('mai agaya wapas');
        }
    }
}else{
    $state.go('register')
}
});