var app = angular.module('shuttlescrap', ['ui.router', 'ngStorage', 'angular-loading-bar']);

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}])

app.service('googleService', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
    var clientId = '252254374353-5tolseqkeou96a31n293rlc3v9kkerbs.apps.googleusercontent.com',
        apiKey = 'AIzaSyDaIMGUUN9CO0UvkX13nH3lj6nTNB7qUhM',
        scopes = 'email',

        deferred = $q.defer();

    this.login = function () {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: false,

        }, this.handleAuthResult);

        return deferred.promise;
    }

    this.handleClientLoad = function () {
        gapi.client.setApiKey(apiKey);
        gapi.auth.init(function () {});
        window.setTimeout(checkAuth, 1);
    };

    this.checkAuth = function () {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: true,

        }, this.handleAuthResult);
    };

    this.handleAuthResult = function (authResult) {
        if (authResult && !authResult.error) {
            var data = {};
            gapi.client.load('oauth2', 'v2', function () {
                var request = gapi.client.oauth2.userinfo.get();
                request.execute(function (resp) {
                    console.log(resp);
                    data.email = resp.email;
                    data.name = resp.name;
                    data.image = resp.picture;
                    data.phone_number = $rootScope.user_data.phone_number;
                    deferred.resolve(data);
                });
            });
        } else {
            deferred.reject('error');
        }
    };

    this.handleAuthClick = function (event) {
        gapi.auth.authorize({
            client_id: clientId,
            scope: scopes,
            immediate: false,

        }, this.handleAuthResult);
        return false;
    };
    this.signout = function () {
        gapi.auth.setToken(null);
        gapi.auth.signOut();
        $rootScope.user.loggedIn = "false";
    }

}]);
app.service('anchorSmoothScroll', function () {

    this.scrollTo = function (eID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
            scrollTo(0, stopY);
            return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        var timer = 0;
        if (stopY > startY) {
            for (var i = startY; i < stopY; i += step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY += step;
                if (leapY > stopY) leapY = stopY;
                timer++;
            }
            return;
        }
        for (var i = startY; i > stopY; i -= step) {
            setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
        }

        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }
            return y;
        }

    };

});

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $localStorageProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('');
    $stateProvider

        .state('landingPage', {
            url: "/",
            templateUrl: "../templates/welcome.html",
            controller: "otpCtrl"

        })
        .state('register', {
            url: '/register',
            templateUrl: "../templates/register.html",
            controller: "registerCtrl",
            authenticate: true
        })
        .state('login', {
            url: '/login',
            templateUrl: "../templates/login.html",
            controller: "loginCtrl"
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
        .state('userMain.predictor.laptop', {
            url: '/laptop',
            templateUrl: "../templates/laptop.html",
            controller: "pre_laptop",
        })
        .state('userMain.predictor.fridge', {
            url: '/fridge',
            templateUrl: "../templates/fridge.html",
            controller: "pre_fridge",
        })
        .state('userMain.user_profile', {
            url: '/user_profile',
            templateUrl: "../templates/user_profile.html",
            controller: "user_profileCtrl",
        })
    $urlRouterProvider.otherwise("/");
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
//otp Controller
app.controller('otpCtrl', function ($scope, $http, $rootScope, $state, $location, anchorSmoothScroll) {
    $rootScope.user_data = {};
    $rootScope.user = {};
    $state.go('login');
    console.log($scope.show_rotp);
    $scope.gotoElement = function (eID) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID);
    };
    $scope.signup = function () {
        console.log("otp controller called");
        console.log($rootScope.user_data);
        var user_number = $rootScope.user_data.phone_number;
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
            $scope.show_rotp = false;
            $scope.show_votp = true;
            // $state.go("otp-enter");
        }, function (error) {
            console.log(error);
            alert("Retype Correct Phone Number");
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
//login Controller
app.controller('loginCtrl', function ($scope, $state, $http, $rootScope, googleService) {
    console.log('loginController called');

    $scope.go_signup = function () {
        console.log("going to register page");
        $state.go('register');
    };

    $scope.g_login = function () {
        googleService.login().then(function (data) {
            // do something with returned data

            $rootScope.user.loggedIn = "true";
            $rootScope.user_data.user_email = data.email;
            $rootScope.user_data.user_name = data.name;
            $rootScope.user_data.user_image = data.image;
            console.log($rootScope.user_data);
            $state.go('userMain.user_profile');
        }, function (err) {
            console.log('Failed: ' + err);
        });
    };


    $scope.login = function () {
        console.log($scope.user_email);
        if($scope.user_email){
        $http({
            method: 'POST',
            url: 'http://localhost:8886/register/user',
            data: {
                user_email: $scope.user_email
            }
        }).then(function (res) {

            console.log(res);
            $rootScope.user_data = res.data;
            console.log($rootScope.user_data);
            console.log("input password" + $scope.user_password);
            if ($scope.user_password == res.data.user_password) {
                $rootScope.user.loggedIn = "true";
                console.log($rootScope.user.loggedIn);

                $state.go('userMain.user_profile');
            } else {
                $rootScope.user.loggedIn = "false";
                alert('Invalid Password');
            }

        }, function (error) {
            console.log(error);
            alert("error occured");
            $rootScope.user.loggedIn = "false";
        })}else{
            alert("Please fill correct details");
        }
    }



})

//register Controller

app.controller('registerCtrl', function ($scope, $http, $rootScope, $state, googleService) {
    console.log("register controller called")
    $rootScope.user.loggedIn = "false";
    $scope.g_login = function () {
        googleService.login().then(function (data) {
            // do something with returned data

            $rootScope.user.loggedIn = "true";
            $rootScope.user_data.user_email = data.email;
            $rootScope.user_data.user_name = data.name;
            $rootScope.user_data.user_image = data.image;
            console.log($rootScope.user_data);
            $state.go('userMain');
        }, function (err) {
            console.log('Failed: ' + err);
        });
    };
    $scope.signup = function () {
        console.log("before sign up  " + $rootScope.user_data);
        if ($scope.user_name && $scope.user_password && $scope.user_email) {
            $http({
                method: 'POST',
                url: 'http://localhost:8886/register/submit_user',
                data: {
                    phone_number: $rootScope.user_data.phone_number,
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
                alert("Please fill Correct Details");

            })
        } else {
            alert("Please Fill all required fields");
        }
    }


});
//UserMAIN CONtroller
app.controller('userCtrl', function ($scope, $rootScope, $state, $http, $window) {
    if ($rootScope.user.loggedIn == "true") {
        console.log("user Main controller called")
        $scope.logout = function () {
            $rootScope.user.loggedIn = false;
            $window.localStorage.clear();
            gapi.auth.setToken(null);
            gapi.auth.signOut();
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
        if($scope.newbook.res_address &&  $scope.newbook.date && $scope.newbook.payment_method){
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


        })}else{
            alert("Please fill all the required fields");
        }
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
        $state.go("userMain.predictor.laptop");
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
        $state.go("userMain.predictor.fridge");
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
app.controller('pre_electquesCtrl', function ($scope, $state, $rootScope) {
    $scope.back = function () {
        $state.go('userMain.predictor.pre_electitems')
    }
});
app.controller('user_profileCtrl', function ($scope, $state, $rootScope) {
    console.log("User Profile Page");
})
app.controller('pre_laptop', function ($scope, $state, $rootScope, $http) {
    $rootScope.rams = {};
    $scope.laptop = {};
    $scope.total_price = {};
    console.log("Laptop prediction Controller Called");
    $http({
        method: 'GET',
        url: 'http://localhost:8886/laptop/all_ram',

    }).then(function (res) {
        console.log(res);
        $rootScope.rams = res;
    }, function (error) {
        console.log("error");


    });
    $http({
        method: 'GET',
        url: 'http://localhost:8886/laptop/all_processor',

    }).then(function (res) {
        console.log(res);
        $rootScope.processor = res;
    }, function (error) {
        console.log("error");


    })
    $http({
        method: 'GET',
        url: 'http://localhost:8886/laptop/all_hard_drives',

    }).then(function (res) {
        console.log(res);
        $rootScope.hard_drive = res;
    }, function (error) {
        console.log("error");


    })
    $http({
        method: 'GET',
        url: 'http://localhost:8886/laptop/all_cards',

    }).then(function (res) {
        console.log(res);
        $rootScope.graphic_card = res;
    }, function (error) {
        console.log("error");


    })
    $scope.calculate = function () {
        console.log($scope.laptop);
        //fetching ram price
        $http({
            method: 'POST',
            url: 'http://localhost:8886/laptop/get_mobiles',
            data: {
                ram_size: $scope.laptop.ram_size
            }
        }).then(function (res) {
            console.log(res);
            $scope.laptop.ram_price = res.data[0].ram_price;
            console.log($scope.laptop.ram_price);
        }, function (error) {
            console.log("error");
        })
        //fetching processor price
        $http({
            method: 'POST',
            url: 'http://localhost:8886/laptop/get_processor',
            data: {
                processor_name: $scope.laptop.processor_name
            }
        }).then(function (res) {
            console.log(res);
            $scope.laptop.processor_price = res.data[0].processor_price;
            console.log($scope.laptop.processor_price);
        }, function (error) {
            console.log("error");
        })

        //hdd price
        $http({
            method: 'POST',
            url: 'http://localhost:8886/laptop/get_hard_drive',
            data: {
                drive_size: $scope.laptop.hard_drive_name
            }
        }).then(function (res) {
            console.log(res);
            $scope.laptop.hard_drive_price = res.data[0].drive_price;
            console.log($scope.laptop.hard_drive_price);
        }, function (error) {
            console.log("error");
        })
        //graphic price
        //hdd price
        $http({
            method: 'POST',
            url: 'http://localhost:8886/laptop/get_card',
            data: {
                card_size: $scope.laptop.graphic_card_name
            }
        }).then(function (res) {
            console.log(res);
            $scope.laptop.graphic_card_price = res.data[0].card_price;
            console.log($scope.laptop.graphic_card_price);
            $scope.total_price = parseInt($scope.laptop.ram_price) + parseInt($scope.laptop.hard_drive_price) + parseInt($scope.laptop.graphic_card_price) + parseInt($scope.laptop.processor_price);
            alert("Rs" + " " + $scope.total_price);
        }, function (error) {
            console.log("error");
        })
    }
})

app.controller('pre_fridge', function ($scope) {
    $scope.fridge = {};
    $scope.fridge.single_door_price = "3400";
    $scope.fridge.double_door_price = "5000";
    console.log('fridge controller called');
    console.log($scope.fridge);

    $scope.calculate_fridge = function () {
        if ($scope.fridge.door_type == "single_door") {
            alert("Rs" + " " + $scope.fridge.single_door_price);
        } else {
            alert("Rs" + " " + $scope.fridge.double_door_price);
        }
    }
});