
	angular.module('sfexpress.controllers', [])

	.controller('HeaderController', function($scope, $location, AuthService){

		$scope.logout = function() {
			AuthService.handleLogout();
		}

		$scope.getClass = function(path) {
			return $location.path() == path ? 'selected' : '';
		}
	})

	.controller("CallbackController", function(LoginService, AuthService, $location, $window) {
		var absUrl = $location.absUrl();
		var code = AuthService.getCodeFromUrl(absUrl);
		if(code) {
			LoginService.login({code: code})
				.then(function(response) {
					AuthService.handleLogin(response.data.access_token, response.data.instance_url)
					var url = 'http://' + $location.host() + ':' + $location.port();
					$window.location.replace(url);
				}, function(error) {
					$location.path('/login')
				})
		} else {
			console.error('Error during log in');
			$location.path('/login');
		}
	})

	.controller('RecordsController', function($scope, SalesforceRecordService) {
		var recordName = 'Account';
		var fields = ['Name', 'AccountNumber', 'Owner.Name'];
		SalesforceRecordService
			.getRecords(recordName, fields)
			.then(function(response) {
				console.log("response.data => ", response);
				$scope.accounts = response.data.records;
			}, function(error) {
				console.error('Erorr in SalesforceRecordService => ', error);
			})
	})

	let SobjectsController = function($scope, SalesforceRecordService) {
		SalesforceRecordService.getListAvailableSobjects().then((response) => {
			$scope.sobjects = response.data.sobjects;
		})
	}

	SobjectsController.$inject = ['$scope', 'SalesforceRecordService'];

	angular.module('sfexpress.controllers')
		.controller("SobjectsController", SobjectsController)
