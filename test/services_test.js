
describe('Module: services', ()=>{

    var $httpBackend;

    beforeEach(function(){
        module('sfexpress.services');
        module('LocalStorageModule');
    });
    beforeEach(inject(function(_$httpBackend_){
        $httpBackend = _$httpBackend_;
    }));

    describe('Unit test: LoginService', ()=>{

        var LoginService;

        beforeEach(inject(function(_LoginService_){
            LoginService = _LoginService_;
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('login method', ()=>{

            it('login method should return token and instanceUrl', function() {
                $httpBackend.expectPOST('/RestTest/oauth/callback')
                    .respond({
                        access_token: 'someToken',
                        instance_url: 'https://myorg.salesforce.com'
                    })

                LoginService
                    .login({code: 'someCode'})
                    .then((response)=>{
                        var data = response.data;
                        expect(data.access_token).toEqual('someToken');
                        expect(data.instance_url)
                            .toEqual('https://myorg.salesforce.com');
                    })

                $httpBackend.flush();
            })
        })
    })

    describe('Unit test: SalesforceRecordService', ()=>{

        var SalesforceRecordService;

        beforeEach(inject(function(localStorageService, _SalesforceRecordService_){
            SalesforceRecordService = _SalesforceRecordService_;
            localStorageService.set('instanceUrl', 'https://myorg.salesforce.com');
        }))

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('getRecords method', ()=>{
            it('should return accounts', function() {
                $httpBackend
                    .expectGET('https://myorg.salesforce.com/services/data/v29.0/queryAll' +
                        '?q=SELECT+AccountNumber,Name,Owner.Name+FROM+Account')
                    .respond([
                        {
                            AccountNumber:"CC978213",
                            Name:"GenePoint",
                            Owner:{Name:"Evgen Kasyan"}
                        },
                        {
                            AccountNumber:"CD355119-A",
                            Name:"United Oil & Gas, UK",
                            Owner:{Name:"Evgen Kasyan"}
                        }
                    ])
                SalesforceRecordService.getRecords('Account',
                    ['AccountNumber', 'Name', 'Owner.Name'])
                    .then(function(response) {
                        var accounts = response.data;
                        expect(accounts.length).toBe(2)
                        expect(accounts[0].AccountNumber).toEqual('CC978213')
                        expect(accounts[0].Name).toEqual('GenePoint')
                        expect(accounts[0].Owner.Name).toEqual('Evgen Kasyan')
                    })
                $httpBackend.flush();
            })
        })

        describe('getListAvailableSobjects method', ()=>{
            it('should return list of sobjects', function() {
                $httpBackend
                    .expectGET('https://myorg.salesforce.com/services/data/v39.0/sobjects')
                    .respond({sobjects:[
                        {label :"Accepted Event Relation"},
                        {label :"Account"},
                        {label :"Account Clean Info"},
                        {label :"Account Contact Role"}
                    ]})

                SalesforceRecordService
                    .getListAvailableSobjects()
                    .then((response)=>{
                        var sobjects = response.data.sobjects;
                        expect(sobjects.length).toBe(4);
                        expect(sobjects[0].label).toEqual('Accepted Event Relation')
                        expect(sobjects[3].label).toEqual('Account Contact Role')
                    })

                $httpBackend.flush();
            })
        })
    })


    describe('Unit test: AuthService', ()=>{

        var AuthService,
            localStorageService, $rootScope;

        beforeEach(inject(function(_AuthService_, _localStorageService_, _$rootScope_){
            AuthService = _AuthService_;
            localStorageService = _localStorageService_;
            $rootScope = _$rootScope_;
        }))

        describe('handleLogin method', ()=>{

            it('localStorage should has instanceUrl, accessToken,' +
                'isAuthorized and rootScope should has isAuthorized true', ()=>{
                AuthService.handleLogin('someToken', 'https://myorg.salesforce.com');
                var instanceUrl = localStorageService.get('instanceUrl');
                var accessToken = localStorageService.get('accessToken');
                var isAuthorized = localStorageService.get('isAuthorized');

                expect(instanceUrl).toEqual('https://myorg.salesforce.com')
                expect(accessToken).toEqual('someToken')
                expect(isAuthorized).toBeTruthy()
                expect($rootScope.auth.isAuthorized).toBeTruthy()
            })
        })

        describe('getCodeFromUrl method', ()=>{
            it('should return code parameter when it present', ()=>{
                var url = 'https://myapp.com?code=someCode#/somePath';
                var code = AuthService.getCodeFromUrl(url);
                expect(code).toEqual('someCode');
            })

            it('should return null when there is no parameter', ()=>{
                var url = 'https://myapp.com';
                var code = AuthService.getCodeFromUrl(url);
                expect(code).toBeNull();
            })
        })

        describe('handleLogout method', ()=>{

            beforeEach(function() {
                AuthService.handleLogin('someToken', 'https://myorg.salesforce.com');
            })

            it('accessToken should be removed from local storage', ()=>{
                AuthService.handleLogout();
                var accessToken = localStorageService.get('accessToken');
                var isAuthorized = localStorageService.get('isAuthorized');
                expect(accessToken).toBeNull()
                expect(isAuthorized).toBeFalsy()
                expect($rootScope.auth.isAuthorized).toBeFalsy()
            })
        })
    })

})
