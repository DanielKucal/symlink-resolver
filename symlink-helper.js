"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var child_process = require("child_process");
var config_1 = require("./config");
/**
 * You can extend this class in your project
 * Set Config.helperClass to use your own
 */
var SymlinkHelper = (function () {
    function SymlinkHelper(rootDir) {
        this.nestingLevel = 0;
        if (rootDir)
            this.nestingLevel = config_1.Config.rootDir.split('/').length - 1;
    }
    /**
     * Fetches all symlinks in given directory recursively
     * @param dir start by ./
     * @returns {Promise<T>}
     */
    SymlinkHelper.prototype.findSymlinks = function (dir) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var symlinks = {};
            fs.readdir(dir, function (err, list) {
                if (err)
                    return reject(err);
                var pending = list.length;
                if (!pending)
                    return resolve(symlinks);
                list.forEach(function (file) {
                    file = dir + '/' + file;
                    fs.lstat(file, function (error, stat) {
                        if (stat.isSymbolicLink()) {
                            symlinks[file] = fs.readlinkSync(file);
                        }
                        if (stat && stat.isDirectory()) {
                            _this.findSymlinks(file).then(function (childLinks) {
                                symlinks = Object.assign(symlinks, childLinks);
                                if (!--pending)
                                    resolve(symlinks);
                            });
                        }
                        else {
                            if (!--pending)
                                resolve(symlinks);
                        }
                    });
                });
            });
        });
    };
    ;
    SymlinkHelper.prototype.saveSymlinks = function (content) {
        var stringified = JSON.stringify(content, null, '\t');
        return new Promise(function (resolve) {
            fs.writeFile(config_1.Config.rootDir + config_1.Config.symlinksFile, stringified, function (err) {
                if (err)
                    return console.error(err);
                resolve(true);
            });
        });
    };
    SymlinkHelper.prototype.copyFile = function (source, target) {
        child_process.execSync('rm ' + target);
        child_process.execSync('mkdir -p ' + path.dirname(target));
        child_process.execSync('cp -R ' + path.resolve(source) + ' ' + target);
    };
    SymlinkHelper.prototype.getRelativeSymlink = function (symlink) {
        for (var i = 0; i < this.nestingLevel; i++) {
            symlink = symlink.replace('../', '');
        }
        return symlink;
    };
    return SymlinkHelper;
}());
exports.SymlinkHelper = SymlinkHelper;
