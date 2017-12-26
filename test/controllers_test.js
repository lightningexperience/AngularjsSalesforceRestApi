describe('Module: controllers', function(){

    var $controller, $rootScope, $location;

    beforeEach(function(){
        module('sfexpress.controllers');
        module('sfexpress.services');
        module('LocalStorageModule');
    });

    beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
        $controller = _$controller_;
        $rootScope = _$rootScope_;
        $location = _$location_;
    }));

    describe('HeaderController controller', function(){
        beforeEach(function() {
            $location.path('/sobjects');
        })

        describe('$scope.getClass', function(){
            it('should return selected class when pathes match', function(){
                var $scope = $rootScope.$new();
                var headerController =
                    $controller('HeaderController', {$scope: $scope});
                var returnedClass = $scope.getClass('/sobjects');
                expect(returnedClass).toEqual('selected')
            })

            it('should return void class pathes not match', function(){
                var $scope = $rootScope.$new();
                var headerController =
                    $controller('HeaderController', {$scope: $scope});
                var returnedClass = $scope.getClass('/accounts');
                expect(returnedClass).toEqual('')
            })
        })
    })

    describe('CallbackController controller', function(){

        var authServiceMock;

        beforeEach(function() {
            authServiceMock = {
                getCodeFromUrl: function(url) {
                    return null;
                }
            }
        })

        it('should redirect to login page when there is no code', function(){
            var $scope = $rootScope.$new();
            var headerController = $controller('CallbackController',
                {
                    $scope: $scope,
                    AuthService: authServiceMock
                }
            );
            expect($location.path()).toEqual('/login');
        })
    })

    /**
    *
    **/
    describe('RecordsController', function() {
        var SalesforceRecordService;
        var $scope;
        var recordsController;

        beforeEach(function() {

            SalesforceRecordService = {
                getRecords: function(recordName, fields) {}
            }

            spyOn(SalesforceRecordService, 'getRecords').and.returnValue(
                new Promise(function(resolve, reject) {
                    var accounts = [
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
                    ];
                    resolve({data:{records:accounts}});
                })
            );

            $scope = $rootScope.$new();
            recordsController = $controller('RecordsController',
                {
                    $scope: $scope,
                    SalesforceRecordService: SalesforceRecordService
                }
            );
        })

        it('should call SalesforceRecordService.getRecords() once', function() {
            expect(SalesforceRecordService.getRecords).toHaveBeenCalled();
            expect(SalesforceRecordService.getRecords.calls.count()).toEqual(1);
        })
    })

    describe('SobjectsController', function() {
        var SalesforceRecordService, SobjectsController, $scope;
        beforeEach(inject(function(_SalesforceRecordService_) {
            SalesforceRecordService = _SalesforceRecordService_;

            spyOn(SalesforceRecordService, 'getListAvailableSobjects')
                .and
                .returnValue(new Promise(function(resolve, reject) {
                    var data = {
                        sobjects:[
                            {label :"Accepted Event Relation"},
                            {label :"Account"},
                            {label :"Account Clean Info"},
                            {label :"Account Contact Role"}
                        ]
                    }
                    return resolve(data);
                }))

            $scope = $rootScope.$new();
            SobjectsController = $controller('SobjectsController', {
                $scope,
                SalesforceRecordService
            })
        }))

        it('should call SalesforceRecordService.getListAvailableSobjects() once', function() {
            expect(SalesforceRecordService.getListAvailableSobjects).toHaveBeenCalled();
            expect(SalesforceRecordService.getListAvailableSobjects.calls.count()).toEqual(1);
        })
    })
})
