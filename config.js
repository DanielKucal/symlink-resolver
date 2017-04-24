"use strict";
exports.__esModule = true;
var symlink_helper_1 = require("./symlink-helper");
exports.Config = {
    rootDir: '../' + process.env[3],
    symlinksFile: './.symlinks.json',
    helperClass: symlink_helper_1.SymlinkHelper
};
