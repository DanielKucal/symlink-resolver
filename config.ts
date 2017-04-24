import { SymlinkHelper } from './symlink-helper';

export interface ConfigInterface {
    rootDir: string;
    symlinksFile: string;
    helperClass: typeof SymlinkHelper;
}

export const Config: ConfigInterface = {
    rootDir: '../' + process.env[3],
    symlinksFile: './.symlinks.json',
    helperClass: SymlinkHelper
};
