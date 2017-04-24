#! /usr/bin/env node
// console.log(process.argv);
require('child_process').spawn('node',
    ['./node_modules/symlink-resolver/symlink-resolver.js', process.argv[2], process.argv[3]],
    {stdio: 'inherit' });
