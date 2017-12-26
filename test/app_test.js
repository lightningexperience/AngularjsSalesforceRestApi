

describe('Routes test', function(){

    var location, rootScope, route, httpBackend;

    beforeEach(module('sfexpress'));
    beforeEach(inject(function(_$location_, _$rootScope_, _$route_){
        location = _$location_;
        rootScope = _$rootScope_;
        route = _$route_;
    }));

    beforeEach(inject(function($httpBackend){
        httpBackend = $httpBackend;
        httpBackend.when('GET', 'templates/accounts.html').respond('accounts');
        httpBackend.when('GET', 'templates/login.html').respond('login');
        httpBackend.when('GET', 'templates/sobjects.html').respond('sobjects');
    }));

    it('should redirect to the accounts page on non-existent route', function() {
        location.path('some/non-existing-route');
        rootScope.$digest();
        expect(route.current.controller).toBe('RecordsController');
    })

    it('should navigate to login page', function() {
        location.path('/login');
        rootScope.$digest();
        expect(route.current.controller).toBeUndefined();
    })

    it('should navigate to callback page', function() {
        location.path('/oauth2/callback')
        rootScope.$digest();
        expect(route.current.controller).toBe('CallbackController');
    })

    it('should navigate to sobjects page', function() {
        location.path('/sobjects')
        rootScope.$digest();
        expect(route.current.controller).toBe('SobjectsController');
    })
})
