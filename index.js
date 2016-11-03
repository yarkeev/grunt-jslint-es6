module.exports = function (grunt) {

    var _ = require('lodash'),
        spawn = require('child_process').spawn,
        binPath = './node_modules/jslint/bin/jslint.js';

    grunt.registerMultiTask('jslint', 'check source code by jslint', function () {
        var done = this.async(),
            options = _.merge({
                directives: [],
                edition: 'es6'
            }, this.options()),
            promises;

        promises = this.filesSrc.forEach(function (item) {
            return new Promise(function (resolve, reject) {
                var child;

                child = spawn(binPath,
                    options.directives.map(function (directive) {
                        return '--' + directive;
                    })
                    .concat([
                        '--edition=' + options.edition,
                        item
                    ]), {
                        cwd: '.'
                    });

                child.stdout.on('data', function (data) {
                    grunt.log.ok(data);
                });
                child.stderr.on('data', function (data) {
                    grunt.log.fail('ERROR: ' + data);
                    done(false);
                });
                child.on('close', function (code) {
                    if (code > 1) {
                        done(false);
                    } else {
                        done();
                    }
                });
            });
        });

        Promise.all(promises)
            .then(done)
            .catch(function () {
                done(false);
            });
    });

};