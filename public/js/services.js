
angular.module('sfexpress.services', [])
	.factory('LoginService', ($http)=>{
		return {
			login: function(code) {
				return $http.post('/RestTest/oauth/callback', code)
			}
		}
	})

	.factory('SalesforceRecordService', ($http, localStorageService) => {
		return {
			getRecords: function(recordName, fields) {
				var query = 'SELECT%20' + fields.join(',')
					+ '%20FROM%20Account';
				var config = {params: {q: decodeURI(query)}}
				var instanceUrl = localStorageService.get('instanceUrl');
				var url = instanceUrl + '/services/data/v29.0/queryAll';
				return $http.get(url, config);
			},

			getListAvailableSobjects: function() {
				var instanceUrl = localStorageService.get('instanceUrl');
				var url = instanceUrl + '/services/data/v39.0/sobjects';
				return $http.get(url);
			},
		}
	})

	.factory('AuthService', (localStorageService, $rootScope, $location)=>{
		var regExp = /\?code=(\S+)#/g;
		return {
			handleLogin: function(token, url) {
				localStorageService.set('instanceUrl', url);
				localStorageService.set('accessToken', token);
				localStorageService.set('isAuthorized', true);

				$rootScope.auth = {
					isAuthorized: true
				}
			},

			handleLogout: function() {
				localStorageService.remove('accessToken');
				localStorageService.set('isAuthorized', false);
				$rootScope.auth = {
					isAuthorized: false
				},
				$location.path('/login');
			},

			getCodeFromUrl: function(url) {
				var result = regExp.exec(url);
				if(result && result.length) {
					return result[1];
				} else {
					return null;
				}
			}
		}
	})
