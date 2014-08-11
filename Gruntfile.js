module.exports = function(grunt) {
  grunt.initConfig({
		exec: {
			cucumber: "bundle exec cucumber",
      test: "npm test",
      jshint: "jshint ."
		}
  });

  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("default", ["exec:test"]);
  grunt.registerTask("cucumber", ["exec:cucumber"]);
  grunt.registerTask("test", ["exec:test"]);
  grunt.registerTask("lint", ["exec:jshint"]);
};
