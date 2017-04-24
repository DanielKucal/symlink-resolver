"use strict";
exports.__esModule = true;
var path = require("path");
var child_process = require("child_process");
var config_1 = require("./config");
/**
 * NOTICE: This tool has been created to handle symlinks which NativeScript doesn't support for 22.04.2017
 *         Tested on MacOS Sierra, should work also on most popular linux distributions
 * WARNING: Changes made on symlinked files during compilation start will be lost!
 * USAGE: You can use direct execute command: ts-node symlink-resolver.ts build|clear
 *        Or use compiled version the same way yet run by clear node cli
 *        To add symlinks simply use command: ln -s ../../relative-to-target/source/path target
 * ACTIONS:
 *      - build: replaces all symlinks in Config.rootDir with real files
 *      - clear: restores all previously replaced symlinks in Config.rootDir
 * @Author Daniel Kucal <dkucal@gmail.com> www.danielkucal.com
 */
var script = process.argv[2];
var scripts = {};
scripts.build = function () {
    console.log('Preparing build files...');
    var builder = new (config_1.Config.helperClass)(config_1.Config.rootDir);
    builder.findSymlinks(config_1.Config.rootDir).then(function (files) {
        if (!Object.keys(files).length) {
            return console.error('No single symlink was found! Did you mean to clear?');
        }
        console.log('symlinks found, saving...');
        builder.saveSymlinks(files);
        // TODO: Move to the helper class
        for (var _i = 0, _a = Object.keys(files); _i < _a.length; _i++) {
            var file = _a[_i];
            var symlink = builder.getRelativeSymlink(files[file]);
            builder.copyFile(symlink, file);
        }
    });
};
scripts.clear = function () {
    console.log('Cleaning up after build...');
    var symlinksPath = config_1.Config.rootDir + config_1.Config.symlinksFile;
    var savedSymlinks = require(symlinksPath);
    if (!savedSymlinks) {
        return console.error('File ' + symlinksPath +
            ' doesn\'t exist! Did you mean to build?');
    }
    // TODO: move to the helper class
    Object.keys(savedSymlinks).forEach(function (file) {
        var symlink = savedSymlinks[file];
        child_process.execSync('rm -rf ' + file);
        child_process.execSync('ln -s ' + symlink + ' ' + file);
    });
    child_process.execSync('rm ' + symlinksPath);
};
if (script && typeof scripts[script] === 'function') {
    scripts[script]();
}
else {
    console.log(scripts[script]);
    console.error('USAGE: node ' + path.basename(process.argv[1]) + ' build|clear');
}
