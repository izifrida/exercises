// The 'fs' module
// script that uses the fs module for the string given in the command line to display whether it represents the name (an existing one) file or directory. 
// If it is a file, then using the function in the synchronous version (fs. * Sync(...)), it has to write its contents

const fsModule = require('./fs-module');

const stringInput = process.argv.slice(2)[0];

fsModule.writeFile(stringInput);
