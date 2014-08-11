module.exports = function(grunt) {
  grunt.initConfig({
		exec: {
			encrypt: "node cli.js -e monkey",
			decrypt: "node cli.js -d 00091c080f5e12",
      test: "npm test",
      jshint: "jshint ."
		}
  });

  grunt.loadNpmTasks("grunt-exec");

  grunt.registerTask("default", ["exec:encrypt", "exec:decrypt"]);
  grunt.registerTask("test", ["exec:test"]);
  grunt.registerTask("lint", ["exec:jshint"]);
};
