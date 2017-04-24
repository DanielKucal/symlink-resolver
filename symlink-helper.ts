import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import { Config } from './config';

/**
 * You can extend this class in your project
 * Set Config.helperClass to use your own
 */
export class SymlinkHelper {
    public nestingLevel: number = 0;

    constructor(rootDir: string) {
        let startsWithSlash = false;
        if (rootDir.startsWith('./')) {
            startsWithSlash = true;
        } else if (rootDir.startsWith('../')) {
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
    public findSymlinks(dir: string): Promise<Object> {
        return new Promise((resolve, reject) => {
            let symlinks = {};
            fs.readdir(dir, (err, list) => {
                if (err) return reject(err);
                let pending = list.length;
                if (!pending) return resolve(symlinks);

                list.forEach((file) => {
                    file = dir + '/' + file;
                    fs.lstat(file, (error, stat) => {
                        if (stat.isSymbolicLink()) {
                            symlinks[file] = fs.readlinkSync(file);
                        }
                        if (stat && stat.isDirectory()) {
                            this.findSymlinks(file).then(childLinks => {
                                symlinks = Object.assign({}, symlinks, childLinks);
                                if (!--pending) resolve(symlinks);
                            });
                        } else {
                            if (!--pending) resolve(symlinks);
                        }
                    });
                });
            });
        });
    };

    public saveSymlinks(content: any): Promise<true> {
        let savedSymlinks = this.getSavedSymlinks();
        if (savedSymlinks) {
            content = Object.assign({}, savedSymlinks, content);
        }
        let stringified = JSON.stringify(content, null, '\t');
        return new Promise(resolve => {
            fs.writeFile(Config.rootDir + Config.symlinksFile, stringified, (err) => {
                if (err) return console.error(err);
                resolve(true);
            });
        });
    }

    public copyFile(source: string, target: string): void {
        child_process.execSync('rm ' + target);
        child_process.execSync('mkdir -p ' + path.dirname(target));
        child_process.execSync('cp -R ' + path.resolve(source) + ' ' + target);
    }

    public getRelativePath(path: string): string {
        for (let i = 0; i < this.nestingLevel; i++) {
            path = path.replace('../', '');
        }
        return path;
    }

    public getSavedSymlinks(): Object {
        let savedSymlinks: any = null;
        try {
            savedSymlinks = require('../../' + Config.rootDir + Config.symlinksFile);
        } catch (e) { }
        return savedSymlinks;
    }
}
