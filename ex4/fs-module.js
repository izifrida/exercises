// Task 10 (The 'fs' module)
const fs = require('fs');

// Uses only sync methods
function writeFile(input) {
    if (input) {
        try {
            var stats = fs.statSync(input)

            if (stats.isDirectory()) {
                console.log('Directory exists');
            }

            if (stats.isFile()) {
                console.log('File exists');

                try {
                    console.log('Reading file...');
                    const data = fs.readFileSync(input);
                    console.log(data.toString('utf8'));
                } catch (err) {
                    console.log(err)
                };
            }

        } catch (err) {
            console.log('Path doesn\'t exist');
        }
    } else {
        console.log('No path provided');
    }
}

exports.writeFile = writeFile;
