/* Comment to task 9 point 8
Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:
    (function(exports, require, module, __filename, __dirname) {
    // Module code actually lives in here
    });

So we can't just set const module = require('./module'), as in that case identifier 'module' will already been declared as an argument of wrapping function. 

So what can we do to make line 'const module = require ('./module');' work?
1. We can redeclare variable (similar as we have in test.js) with var keyword. 
   But in that case the variable 'module' will be overwritten within the module scope (which is our script.js file).
   Note! In this case we lose access to the module, difined in function(exports, require, module, __filename, __dirname)
   
2. So another option we can scope the const 'module' within funcion:
    function getSum() {
        const module = require('./module'); 

        const operation = new module.Operation(2, 2);

        console.log(operation.sum());
    };
    getSum();

    In this case variable module is scoped within function getSum and  will be available only there. 
    And outside the scope of getSum function we still have access to the module difined in function(exports, require, module, __filename, __dirname)

3. And the easiaest way - just rename the module variable into into anything but 'module'
*/

const operation = require('./module');

/* Get parameter values 'x' and 'y', passed from the command line - ./script.js 2 7parameter values 'x' and 'y', 
process.argv is an array
[ 'C:\\Program Files\\nodejs\\node.exe',
  'D:\\Projects\\nodejs\\exercise4\\es4\\script.js',
  '2',
  '7' ]

The first argument is usually the path to nodejs, and the second one is the location of the script you're executing.

To 'normilize' arguments that are concerned, we skip the first two using array method 'slice' - process.argv.slice(2).
*/

const args = process.argv.slice(2);

// If no paramaters provided use default values x=2, y=2 
// The 'args' - is an array of strings. To make Operation's constructor work we convert strings to numbers with '+'
const op = args.length ? new operation.Operation(+args[0], +args[1]) : new operation.Operation(2, 2);

console.log(op.sum());
