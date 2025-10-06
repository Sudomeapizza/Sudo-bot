class RPNCalculator {
    constructor() {
        // Pre‑populate built‑in constants
        this.variables = {
            e: Math.E,
            'pi': Math.PI,
        };
        this.operators = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '^': (a, b) => Math.pow(a, b),
        };
        this.functions = {
            'sqrt': (a, b = 2) => Math.pow(a, 1 / b),
            'cos': Math.cos,
            'sin': Math.sin,
            'tan': Math.tan,
            'log': Math.log10, // Base 10 logarithm
            'ln': Math.log, // Natural logarithm
            '!': (n) => {
                if (n < 0 || !Number.isInteger(n)) {
                    throw new Error('Factorial only defined for non-negative integers');
                }
                if (n === 0) return 1;
                let result = 1;
                for (let i = 2; i <= n; i++) {
                    result *= i;
                }
                return result;
            },
        };
    }

    setVariables(varString) {
        if (!varString || varString.trim() === '') return;

        const parts = varString.split(';');
        if (parts.length > 0) {
            const varDeclarations = parts[0].split(',');
            for (const declaration of varDeclarations) {
                const trimmed = declaration.trim();
                if (trimmed.includes('=')) {
                    const [key, value] = trimmed.split('=');
                    this.variables[key.trim()] = parseFloat(value.trim());
                }
            }
        }
    }

    // Converts an infix expression to RPN
    // This is a simplified shunting-yard algorithm
    infixToRPN(expression) {
        const output = [];
        const operatorStack = [];
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2,
            '^': 3,
        };

        const isOperator = (token) => ['+', '-', '*', '/', '^'].includes(token);
        const isFunction = (token) => Object.keys(this.functions).includes(token);
        const isNumber = (token) => !isNaN(parseFloat(token)) && isFinite(token);

        const tokens = expression
            .replace(/\s+/g, '') // Remove all whitespace
            .replace(/([+\-*/^()!])/g, ' $1 ') // Add spaces around operators and parentheses
            .replace(/(\b(?:sqrt|cos|sin|tan|log|ln)\b)/g, ' $1 ') // Add spaces around function names
            .trim()
            .split(/\s+|,/); // Split by spaces or commas (for function arguments)

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];

            if (isNumber(token) || this.variables.hasOwnProperty(token)) {
                output.push(token);
            } else if (isFunction(token)) {
                operatorStack.push(token);
            } else if (isOperator(token)) {
                while (
                    operatorStack.length > 0 &&
                    isOperator(operatorStack[operatorStack.length - 1]) &&
                    precedence[operatorStack[operatorStack.length - 1]] >= precedence[token] &&
                    !(token === '^' && operatorStack[operatorStack.length - 1] === '^') // Right-associativity for ^
                ) {
                    output.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    output.push(operatorStack.pop());
                }
                if (operatorStack[operatorStack.length - 1] === '(') {
                    operatorStack.pop(); // Pop '('
                } else {
                    throw new Error('Mismatched parentheses');
                }
                // If there's a function on top of the stack, pop it
                if (operatorStack.length > 0 && isFunction(operatorStack[operatorStack.length - 1])) {
                    output.push(operatorStack.pop());
                }
            } else {
                throw new Error(`Unknown token: ${token}`);
            }
        }

        while (operatorStack.length > 0) {
            const op = operatorStack.pop();
            if (op === '(' || op === ')') {
                throw new Error('Mismatched parentheses');
            }
            output.push(op);
        }

        return output;
    }

    // Calculates the RPN expression
    calculateRPN(rpnTokens) {
        const stack = [];

        for (const token of rpnTokens) {
            if (!isNaN(parseFloat(token)) && isFinite(token)) {
                stack.push(parseFloat(token));
            } else if (this.variables.hasOwnProperty(token)) {
                stack.push(this.variables[token]);
            } else if (this.variables.hasOwnProperty(token)) {
                // constants like e, π or user‑defined variables
                stack.push(this.variables[token]);
            } else if (this.operators.hasOwnProperty(token)) {
                const b = stack.pop();
                const a = stack.pop();
                if (a === undefined || b === undefined) {
                    throw new Error(`Insufficient operands for operator: ${token}`);
                }
                stack.push(this.operators[token](a, b));
            } else if (this.functions.hasOwnProperty(token)) {
                if (token === 'sqrt') {
                    // Special handling for sqrt(val, power) or sqrt(val)
                    let arg1 = stack.pop();
                    let arg2;
                    // Check if the previous token was a number, indicating a 'power' argument
                    if (typeof stack[stack.length - 1] === 'number') {
                        arg2 = stack.pop();
                        stack.push(this.functions[token](arg1, arg2));
                    } else {
                        stack.push(this.functions[token](arg1));
                    }
                } else if (token === '!') {
                    const arg = stack.pop();
                    if (arg === undefined) {
                        throw new Error(`Insufficient operand for function: ${token}`);
                    }
                    stack.push(this.functions[token](arg));
                } else {
                    // General case for single-argument functions
                    const arg = stack.pop();
                    if (arg === undefined) {
                        throw new Error(`Insufficient operand for function: ${token}`);
                    }
                    stack.push(this.functions[token](arg));
                }
            } else {
                throw new Error(`Unknown token or undefined variable: ${token}`);
            }
        }

        if (stack.length !== 1) {
            throw new Error('Invalid expression: stack did not resolve to a single value');
        }

        return stack[0];
    }

    calculate(input) {
        // Separate variable definitions from the expression
        const parts = input.split(';');
        let varString = '';
        let expression = input;

        if (parts.length > 1) {
            varString = parts[0];
            expression = parts.slice(1).join(';');
        } else if (input.includes('=') && !/^[a-zA-Z]/.test(input.trim())) {
            // If no semicolon, but it looks like a var assignment for the whole input
            varString = input;
            expression = ''; // No expression to calculate
        }


        this.setVariables(varString);

        if (expression.trim() === '') {
            // If only variable assignments were provided, return the variables object
            return this.variables;
        }

        const rpnTokens = this.infixToRPN(expression);
        return this.calculateRPN(rpnTokens);
    }
}

function doMath(exp) {
    try {
        return new RPNCalculator().calculate(exp)
    } catch (e) { console.error(e.message); }
}

module.exports = { doMath }