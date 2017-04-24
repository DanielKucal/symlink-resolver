"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const config_1 = require("./config");
/**
 * You can extend this class in your project
 * Set Config.helperClass to use your own
 */
class SymlinkHelper {
    constructor(rootDir) {
        this.nestingLevel = 0;
        let startsWithSlash = false;
        if (rootDir.startsWith('./')) {
            startsWithSlash = true;
        }
        else if (rootDir.startsWith('../')) {
            startsWithSlash = true;
        }
        if (!startsWithSlash) {
            throw new Error('Directory name has to start with any of: ./, ../');
        }
        this.nestingLevel = rootDir.split('/').length - 1;
    }
    /**
     * Fetches all symlinks in given directory recursively
     * @param dir start by ./
     * @returns {Promise<T>}
     */
    findSymlinks(dir) {
        return new Promise((resolve, reject) => {
            let symlinks = {};
            fs.readdir(dir, (err, list) => {
                if (err)
                    return reject(err);
                let pending = list.length;
                if (!pending)
                    return resolve(symlinks);
                list.forEach((file) => {
                    file = dir + '/' + file;
                    fs.lstat(file, (error, stat) => {
                        if (stat.isSymbolicLink()) {
                            symlinks[file] = fs.readlinkSync(file);
                        }
                        if (stat && stat.isDirectory()) {
                            this.findSymlinks(file).then(childLinks => {
                                symlinks = Object.assign({}, symlinks, childLinks);
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
    }
    ;
    saveSymlinks(content) {
        let savedSymlinks = this.getSavedSymlinks();
        if (savedSymlinks) {
            content = Object.assign({}, savedSymlinks, content);
        }
        let stringified = JSON.stringify(content, null, '\t');
        return new Promise(resolve => {
            fs.writeFile(config_1.Config.rootDir + config_1.Config.symlinksFile, stringified, (err) => {
                if (err)
                    return console.error(err);
                resolve(true);
            });
        });
    }
    copyFile(source, target) {
        child_process.execSync('rm ' + target);
        child_process.execSync('mkdir -p ' + path.dirname(target));
        child_process.execSync('cp -R ' + path.resolve(source) + ' ' + target);
    }
    getRelativePath(path) {
        for (let i = 0; i < this.nestingLevel; i++) {
            path = path.replace('../', '');
        }
        return path;
    }
    getSavedSymlinks() {
        let savedSymlinks = null;
        try {
            savedSymlinks = require('../../' + config_1.Config.rootDir + config_1.Config.symlinksFile);
        }
        catch (e) { }
        return savedSymlinks;
    }
}
exports.SymlinkHelper = SymlinkHelper;
//# sourceMappingURL=symlink-helper.js.map