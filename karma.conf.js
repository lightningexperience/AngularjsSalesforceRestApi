
module.exports = function(config) {
    config.set({
        basePath: './public',

        files: [
          '../bower_components/angular/angular.js',
          '../bower_components/angular-route/angular-route.js',
          '../bower_components/angular-mocks/angular-mocks.js',
          '../bower_components/angular-local-storage/dist/angular-local-storage.js',
          './js/*.js',
          '../test/*.js'
        ],

        preprocessors: {
            '../test/*.js': ['coverage']
        },

        autoWatch: true,
        frameworks: ['jasmine'],
        singleRun: true,

        browsers: ['Chrome'],

        plugins: [
          'karma-chrome-launcher',
          'karma-firefox-launcher',
          'karma-jasmine',
          'karma-junit-reporter',
          'karma-coverage'
        ],

        junitReporter: {
          outputFile: 'test_out/unit.xml',
          suite: 'unit'
       },

       reporters: ['progress', 'coverage'],

       coverageReporter: {
            includeAllSources: true,
            dir: 'coverage/',
            reporters: [
                { type: "html", subdir: "html" },
                { type: 'text-summary' }
            ]
        }
    })
}
