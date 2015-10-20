var pageMod = require('sdk/page-mod');
var data = require('sdk/self').data;
var childProcess = require('sdk/system/child_process');
var { env } = require('sdk/system/environment');

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

pageMod.PageMod({
    include: "*.archlinux.org",
    contentScriptFile: data.url("arch-helper.js"),
    onAttach: function(worker) {
        worker.port.on('install', function(packageName) {
            env.TERM="xterm";
            var cmd = childProcess.spawn('/usr/bin/yaourt',
            ['-S', packageName, '--noconfirm'], {
                env: env
            });
            worker.port.emit('data', 'Installing ' + packageName + '...');
            cmd.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
                worker.port.emit('data', data);
            });

            cmd.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
                worker.port.emit('data', data);
            });

            cmd.on('close', function (code) {
                console.log('child process exited with code ' + code);
                worker.port.emit('data', 'exit code: ' + code)
            });
        });
    }
});

exports.dummy = dummy;
