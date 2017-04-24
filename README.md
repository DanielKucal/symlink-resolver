# Symlink Resolver
This tool allows to replace symbolic links by real files in given directory and revert the changes back to symlinks. All the magic in a simple cli command!

### Installation
```
npm install symlink-resolver --save-dev
```
[Node.js](https://nodejs.org/) v6.4+ and [POSIX](https://en.wikipedia.org/wiki/POSIX#POSIX-certified)-standarized operating system are required.

To your `package.json` `scripts` section add the following rule:
```
"scripts": {
    "symlink-resolver": "symlink-resolver",
}
```

## Basic Usage
For fast usage you can simply run:
+ `npm run symlink-resolver build ./symlinks/path` to **replace** symlinks by real files in ./symlinks/path
+ `npm run symlink-resolver clear ./symlinks/path` to **restore** all symlinks

First command will create `./symlinks/path/.symlinks.json` file which contains changes that have been made in this directory. It will be removed by the second command, however you can still add to your `.gitignore` the following rule: `.symlinks.json`

##### How to create a symlink?
Use `ln -s target source` command, i.e.:
```
ln -s ../../source/path/linked-dir ./project/src/linked-dir
```
  
### Advanced usage
If you need this feature to make a build, then I strongly recommend to automatize your building process:
```
"scripts": {
        "symlink-resolver": "symlink-resolver",
        "prebuild": "npm run symlink-resolver build ./symlinks/path",
        "postbuild": "npm run symlink-resolver clear ./symlinks/path",
        "build": "your build command should be under this name"
}
```
This way you will be able to make a build and edit your files without worries.

However, in some cases like emulating a device, the "post" script will not be executed. If this is also your case then take a look at example workaround for NativeScript:
```
  "scripts": {
    "symlink-resolver": "symlink-resolver",
    "prens-bundle": "npm run symlink-resolver build ./symlinks/path",
    "delay-clear": "sleep 22 && npm run symlink-resolver clear ./symlinks/path",
    "ns-bundle": "npm run delay-clear | ns-bundle",
    "start-android-bundle": "npm run ns-bundle --android --start-app",
    "start-ios-bundle": "npm run ns-bundle --ios --start-app",
    "build-android-bundle": "npm run ns-bundle --android --build-app",
    "build-ios-bundle": "npm run ns-bundle --ios --build-app"
  },
```

#### Advanced configuration
You can adjust `Config` to your needs. 
- Want to use custom symlinks file name? No problem, just set `Config.symlinksFile` to whatever you want. 
- Need some custom behavior? Simply extend `SymlinkHelper` class and set `Config.helperClass` to yours.
```
export interface ConfigInterface {
    rootDir: string;
    symlinksFile: string;
    helperClass: typeof SymlinkHelper;
}
```
 
##### Happy developing!