module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        stylus: {
            compile: {
                options: {},
                files: {
                    'public/stylesheets/style.css': 'app/stylesheets/style.styl'
                }
            }
        },

        uglify: {
            minify: {
                options: {
                    reserveDOMProperties: true,
                },
                files: {
                    'public/js/script.min.js': ['app/js/script.js']
                }
            }
        },

        watch: {
            files: ['gruntfile.js', 'app/stylesheets/*', 'app/js/*'],
            tasks: ['stylus', 'uglify']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['stylus', 'uglify', 'watch']);
    grunt.registerTask('publish', ['stylus', 'uglify']);
};
