var app = angular.module('shuttlescrap', ['ui.router', 'ngStorage', 'angular-loading-bar']);

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
        .state('userMain.predictor', {
            url: '/predictor_tool',
            templateUrl: "../templates/predictor.html",
            controller: "predictCtrl",
            authenticate: true
        })
        .state('userMain.predictor.pre_1', {
            url: '/pre1',
            templateUrl: "../templates/select_prodtype.html",
            controller: "pre_1Ctrl",
            authenticate: true
        })
        .state('userMain', {
            url: '/user',
            templateUrl: "../templates/user.html",
            controller: "userCtrl",
            authenticate: true
        })
        .state('userMain.booking', {
            url: '/mybookings',
            templateUrl: "../templates/booking.html",
            controller: "bookingCtrl",

        })
        .state('userMain.newbooking', {
            url: '/newBooking',
            templateUrl: "../templates/newbooking.html",
            controller: "newbookingCtrl",

        })
        .state('userMain.predictor.pre_dryitems', {
            url: '/dry_items',
            templateUrl: "../templates/select_dryitems.html",
            controller: "pre_dryitemsCtrl",

        })
        .state('userMain.predictor.pre_electitems', {
            url: '/elect_items',
            templateUrl: "../templates/select_electitems.html",
            controller: "pre_electitemsCtrl",
        })
        .state('userMain.predictor.amount_kg', {
            url: '/dry_kg',
            templateUrl: "../templates/dry_kg.html",
            controller: "pre_electitemsCtrl",
        })
        .state('userMain.predictor.elect_questions', {
            url: '/elect_questions',
            templateUrl: "../templates/elect_questions.html",
            controller: "pre_electquesCtrl",
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
    if ($rootScope.user.loggedIn == "true") {
        console.log("user Main controller called")
        $scope.logout = function () {
            $rootScope.user.loggedIn = false;
            $window.localStorage.clear();
            $state.go('register');
        }

        $scope.check = function () {
            console.log($rootScope.user);
            if ($rootScope.user.loggedIn == "true") {
                console.log("will remain here")
            } else {
                $state.go('register');
                console.log('mai agaya wapas');
            }
        }
    } else {
        $state.go('register')
    }
});

app.controller('bookingCtrl', function ($scope, $http, $rootScope, $state) {
    console.log("Booking Controller called !")
    console.log("get booking function called");
    $http({
        method: 'POST',
        url: 'http://localhost:8886/register/booking_history',
        data: {
            user_email: $rootScope.user_data.user_email
        }
    }).then(function (res) {

        console.log(res);
        $scope.booking_data = res.data;
        console.log($scope.booking_data);
        console.log($rootScope.user_data)

    }, function (error) {
        console.log(error);
        alert("error occured");

    })

});

app.controller('newbookingCtrl', function ($scope, $http, $rootScope, $state) {
    console.log("new Booking Controller called !");
    $scope.newbook = {};

    $scope.book_pickup = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8886/register/submit_pickup',
            data: {
                user_email: $rootScope.user_data.user_email,
                user_name: $rootScope.user_data.user_email,
                res_address: $scope.newbook.res_address,
                time: $scope.newbook.date,
                booking_credits: 'Processing',
                payment_method: $scope.newbook.payment_method,
                bankaccount_details: $scope.newbook.bankaccount_details,
                ifsc_details: $scope.newbook.ifsc_details,
                booking_status: 'Initiated',
                scrap_amount: '50kg'
            }
        }).then(function (res) {
            console.log("Request has been raised");
            console.log(res);


            $state.go('userMain.booking');
        }, function (error) {
            console.log("error");


        })
    }
    $scope.book = function () {
        console.log($scope.newbook)
    }

});

app.controller('predictCtrl', function ($scope, $rootScope, $state) {
    console.log("value predictor controller called");
    $rootScope.predictor = {}
    $rootScope.predictor.price = "10";
    $scope.predict = function () {
        console.log($scope.predictor);
    }
    $scope.check_electronic = function () {
        console.log($scope.predictor);
        if ($scope.predictor.prod_type == "Electronics") {
            return true;
        } else {
            return false;
        }
    }
    $scope.check_dry = function () {
        console.log($scope.predictor);
        if ($scope.predictor.prod_type == "DryWaste") {
            return true;
        } else {
            return false;
        }
    }
    $scope.start = function () {
        $state.go('userMain.predictor.pre_1')
    }
});

app.controller('pre_1Ctrl', function ($scope, $state, $rootScope) {
    console.log('pre1 controller called');
    $scope.start_dry = function () {
        console.log("away");
        $rootScope.predictor.prod_type = "Dry Waste";
        console.log($rootScope.predictor);
        $state.go('userMain.predictor.pre_dryitems');
    }
    $scope.start_elect = function () {
        console.log("away");
        $rootScope.predictor.prod_type = "Electronics";
        console.log($rootScope.predictor);
        $state.go('userMain.predictor.pre_electitems');
    }

})
app.controller('pre_electitemsCtrl', function ($scope, $state, $rootScope) {
    console.log('electitem controller called');
    $scope.back = function () {
        console.log("Going Backwards");
        console.log($rootScope.predictor);
        $state.go('userMain.predictor.pre_1');
    }
    $scope.elect_1 = function () {
        $rootScope.predictor.prod_name = "smartphone";
        $rootScope.predictor.price = 10;
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_2 = function () {
         $rootScope.predictor.prod_name = "tablet";
        $rootScope.predictor.price = 20;
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_3 = function () {
       $rootScope.predictor.prod_name = "iphone";
        $rootScope.predictor.price = 30;
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_4 = function () {
        $rootScope.predictor.prod_name = "laptop";
        $rootScope.predictor.price = 40;
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_5 = function () {
        $rootScope.predictor.prod_name = "desktop";
        $rootScope.predictor.price = 50;
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_6 = function () {
        $rootScope.predictor.prod_name = "gaming_console";
        $rootScope.predictor.price = 60;
        console.log($rootScope.predictor);
       $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_7 = function () {
        $rootScope.predictor.prod_name = "tv";
        $rootScope.predictor.price = 20;
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_8 = function () {
        $rootScope.predictor.prod_name = "fridge";
        $state.go("userMain.predictor.elect_questions");
    }
    $scope.elect_9 = function () {
        $rootScope.predictor.prod_name = "washing_machine";
        $state.go("userMain.predictor.elect_questions");
    }
})
app.controller('pre_dryitemsCtrl', function ($scope, $state, $rootScope) {
    console.log('dry controller called');
    $scope.back = function () {
        console.log("Going Backwards");
        console.log($rootScope.predictor);
        $state.go('userMain.predictor.pre_1');
    }
    $scope.dry_1 = function () {
        $rootScope.predictor.prod_name = "Glass";
        $rootScope.predictor.price = "100";
        console.log($rootScope.predictor);
        $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_2 = function () {
        $rootScope.predictor.prod_name = "Metal";
        $rootScope.predictor.price = "200";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_3 = function () {
        $rootScope.predictor.prod_name = "Plastic";
        $rootScope.predictor.price = "300";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_4 = function () {
        $rootScope.predictor.prod_name = "Tincans";
        $rootScope.predictor.price = "400";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_5 = function () {
        $rootScope.predictor.prod_name = "Cardboard";
        $rootScope.predictor.price = "500";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_6 = function () {
        $rootScope.predictor.prod_name = "GamingConsole";
        $rootScope.predictor.price = "600";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_7 = function () {
        $rootScope.predictor.prod_name = "Furniture";
        $rootScope.predictor.price = "700";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_8 = function () {
        $rootScope.predictor.prod_name = "Books";
        $rootScope.predictor.price = "800";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
    $scope.dry_9 = function () {
        $rootScope.predictor.prod_name = "Paper";
        $rootScope.predictor.price = "900";
        console.log($rootScope.predictor);
         $state.go("userMain.predictor.amount_kg");
    }
})
app.controller('pre_electquesCtrl',function($scope,$state,$rootScope){
    $scope.back=function(){
        $state.go('userMain.predictor.pre_electitems')
    }
})