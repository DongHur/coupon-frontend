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
                files: [{
                    expand: true,
                    cwd: 'app/js',
                    src: '**/*.js',
                    dest: 'public/js',
                    ext: '.min.js'
                }]
            }
        },

        watch: {
            css: {
                files: ['gruntfile.js', 'app/stylesheets/*'],
                tasks: ['stylus'],
            },
            js: {
                files: ['gruntfile.js', 'app/js/*'],
                tasks: ['uglify'],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['stylus', 'uglify', 'watch']);
    grunt.registerTask('publish', ['stylus', 'uglify']);
};
