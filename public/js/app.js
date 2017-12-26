
angular.module('sfexpress', ['sfexpress.services',
	'sfexpress.controllers',
	'sfexpress.directives',
	'ngRoute',
	'LocalStorageModule'])

	.config(($locationProvider)=>{
		$locationProvider.hashPrefix('');
	})

	.config(function($routeProvider) {

		$routeProvider.when('/login', {
			templateUrl : "templates/login.html"
		})

		.when('/oauth2/callback', {
			template : '<p class="callback">Please wait...<p>',
        	controller : "CallbackController"
		})

		.when('/accounts', {
			templateUrl : 'templates/accounts.html',
        	controller : "RecordsController"
		})

        .when('/sobjects', {
            templateUrl : 'templates/sobjects.html',
            controller : "SobjectsController"
        })

		.otherwise('/accounts')
	})

	.factory('SalesforceResponseObserver', ($location, $q, AuthService, $rootScope)=>{
		var reg = /salesforce.com/
		return {
			'request': function(config) {
				if(reg.test(config.url)) {
					$rootScope.$broadcast('spinner:show', {})
				}
				return config;
			},
			'response': function(response) {
				if(reg.test(response.config.url)) {
					$rootScope.$broadcast('spinner:hide', {})
				}
				return response;
			},
			'responseError': function(errorResponse) {
				var status = errorResponse.status;
				if(status == '-1' || status == '401' || status == '403') {
					$rootScope.$broadcast('spinner:hide', {})
					AuthService.handleLogout();
					$location.path('/login')
				}
				return $q.reject(errorResponse)
			}
		}
	})

    .config(($httpProvider) => {
        $httpProvider.interceptors.push('SalesforceResponseObserver');
    })

    .run(function(localStorageService, $http, $rootScope) {
		let accessToken = 'Bearer ' + localStorageService.get('accessToken');
        $http.defaults.headers.common.Authorization = accessToken;
		$rootScope.auth = {
			isAuthorized : localStorageService.get('isAuthorized')
		}
    })
