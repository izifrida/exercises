
/**
 * Class representing math oparation with two numbers.
 */
class Operation {
    /**
     * Create an operation instance with provided x and y.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Calculate the sum of x and y.
     * @return {number} The sum of x and y.
     */
    sum() {
        return this.x + this.y
    }
}

exports.Operation = Operation;

