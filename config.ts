import { SymlinkHelper } from './symlink-helper';

export interface ConfigInterface {
    rootDir: string;
    symlinksFile: string;
    helperClass: typeof SymlinkHelper;
}

export const Config: ConfigInterface = {
    rootDir: '../../' + process.argv[3], // TODO: make sure path is provided
    symlinksFile: './.symlinks.json',
    helperClass: SymlinkHelper
};
