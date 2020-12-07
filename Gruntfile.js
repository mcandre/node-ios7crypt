'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        exec: {
            cucumber: 'bundle exec cucumber',
            editorconfig: 'git ls-files -z | grep -av patch | xargs -0 -r -n 100 eclint check',
            eslint: 'node node_modules/eslint/bin/eslint .',
            jsdoc: 'jsdoc -d html -r lib',
            jshint: 'node node_modules/jshint/bin/jshint .',
            test: 'npm test'
        }
    });

    grunt.loadNpmTasks('grunt-exec');
    grunt.registerTask('default', ['exec:test']);

    grunt.registerTask('cucumber', ['exec:cucumber']);
    grunt.registerTask('doc', ['exec:jsdoc']);
    grunt.registerTask('test', ['exec:test']);

    grunt.registerTask('lint', [
        'exec:editorconfig',
        'exec:eslint',
        'exec:jsfmt',
        'exec:jshint'
    ]);

    grunt.registerTask('editorconfig', ['exec:editorconfig']);
    grunt.registerTask('eslint', ['exec:eslint']);
    grunt.registerTask('jsdoc', ['exec:jsdoc']);
    grunt.registerTask('jsfmt', ['exec:jsfmt']);
    grunt.registerTask('jshint', ['exec:jshint']);
};
