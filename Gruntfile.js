module.exports = function(grunt) {
  grunt.initConfig({
		exec: {
			cucumber: "bundle exec cucumber",
      test: "npm test",
      jshint: "jshint .",
      lili: "bundle exec lili ."
		}
  });

  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("default", ["exec:test"]);
  grunt.registerTask("cucumber", ["exec:cucumber"]);
  grunt.registerTask("test", ["exec:test"]);

  grunt.registerTask("lint", [
    "exec:jshint",
    "exec:lili"
  ]);

  grunt.registerTask("jshint", ["exec:jshint"]);
  grunt.registerTask("lili", ["exec:lili"]);
};
