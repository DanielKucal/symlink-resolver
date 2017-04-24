#! /usr/bin/env node
require('child_process').spawn('node', ['../symlink-resolver.js'], {stdio: 'inherit'});
