class RPNCalculator {
    constructor() {
        // Pre‑populate built‑in constants
        this.variables = {
            e: Math.E,
            π: Math.PI,
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

// Calculates the RPN expression (with implicit‑multiplication handling)
calculateRPN(rpnTokens) {
    // ----- 1. Helpers -------------------------------------------------
    const isOperand = (tok) =>
        (!isNaN(parseFloat(tok)) && isFinite(tok)) ||
        this.variables.hasOwnProperty(tok);

    const isOperatorOrFunction = (tok) =>
        this.operators.hasOwnProperty(tok) ||
        this.functions.hasOwnProperty(tok) ||
        tok === '!';

    // ----- 2. Insert explicit '*' where needed -------------------------
    const tokens = [];
    for (let i = 0; i < rpnTokens.length; i++) {
        const cur = rpnTokens[i];
        const nxt = rpnTokens[i + 1];
        const afterNxt = rpnTokens[i + 2];

        tokens.push(cur);

        // Insert '*' only if:
        //   • cur and nxt are both operands
        //   • the token after nxt is NOT an operator/function (or undefined)
        if (
            nxt !== undefined &&
            isOperand(cur) &&
            isOperand(nxt) &&
            (afterNxt === undefined || !isOperatorOrFunction(afterNxt))
        ) {
            tokens.push('*');
        }
    }

    // ----- 3. Evaluate the (now explicit) RPN -------------------------
    const stack = [];

    for (const token of tokens) {
        if (!isNaN(parseFloat(token)) && isFinite(token)) {
            stack.push(parseFloat(token));
        } else if (this.variables.hasOwnProperty(token)) {
            stack.push(this.variables[token]);
        } else if (this.operators.hasOwnProperty(token)) {
            const b = stack.pop();
            const a = stack.pop();
            if (a === undefined || b === undefined) {
                throw new Error(`Insufficient operands for operator: ${token}`);
            }
            stack.push(this.operators[token](a, b));
        } else if (this.functions.hasOwnProperty(token)) {
            // ----- function handling (unchanged) -----
            if (token === 'sqrt') {
                let arg1 = stack.pop();
                let arg2;
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

// Example Usage:
const calculator = new RPNCalculator();

console.log("--- Test Cases ---");

// Test 0: Simple arithmetic
try {
    console.log("a=4; 4(a)", calculator.calculate("a=4; 4(a)")); // Expected: 530.0946217240335
} catch (e) { console.error(e.message); }

// Test 0: Simple arithmetic
try {
    console.log("a=4,B = 3; sin(sqrt(B,27)+a)e^(B!)*2:", calculator.calculate("a=4,B = 3; sin(sqrt(B,27)+a)*e^(B!)*2")); // Expected: 530.0946217240335
} catch (e) { console.error(e.message); }

// Test 1: Simple arithmetic
try {
    console.log("2 + 3 * 4:", calculator.calculate("2 + 3 * 4")); // Expected: 14
} catch (e) { console.error(e.message); }

// Test 2: Parentheses
try {
    console.log("(2 + 3) * 4:", calculator.calculate("(2 + 3) * 4")); // Expected: 20
} catch (e) { console.error(e.message); }

// Test 3: Variables
try {
    console.log("a=2, b=2.2; (a+4)^b/25:", calculator.calculate("a=2, b=2.2; (a+4)^b/25")); // Expected: (6^2.2)/25 ≈ 2.193
} catch (e) { console.error(e.message); }

// Test 4: sqrt
try {
    console.log("sqrt(9):", calculator.calculate("sqrt(9)")); // Expected: 3
} catch (e) { console.error(e.message); }

// Test 5: sqrt with power
try {
    console.log("sqrt(8,3):", calculator.calculate("sqrt(8,3)")); // Expected: 2 (cube root of 8)
} catch (e) { console.error(e.message); }

// Test 6: e
try {
    console.log("e^2:", calculator.calculate("e^2")); // Expected: Math.E^2
} catch (e) { console.error(e.message); }

// Test 7: cos, sin, tan, log, ln
try {
    console.log("cos(0):", calculator.calculate("cos(0)")); // Expected: 1
    console.log("sin(PI/2):", calculator.calculate("sin(" + Math.PI / 2 + ")")); // Expected: 1
    console.log("tan(0):", calculator.calculate("tan(0)")); // Expected: 0
    console.log("log(100):", calculator.calculate("log(100)")); // Expected: 2
    console.log("ln(e):", calculator.calculate("ln(" + Math.E + ")")); // Expected: 1
} catch (e) { console.error(e.message); }

// Test 8: Factorial
try {
    console.log("5!:", calculator.calculate("5!")); // Expected: 120
    console.log("(2+3)!:", calculator.calculate("(2+3)!")); // Expected: 120
} catch (e) { console.error(e.message); }

// Test 9: More complex expression
try {
    console.log("a=3, b=4; sqrt(a^2 + b^2) + 1:", calculator.calculate("a=3, b=4; sqrt(a^2 + b^2) + 1")); // Expected: sqrt(9+16)+1 = sqrt(25)+1 = 5+1 = 6
} catch (e) { console.error(e.message); }

// Test 10: Variable reassignment / new calculation
try {
    console.log("x=10; x*2:", calculator.calculate("x=10; x*2")); // Expected: 20
    console.log("x + 5:", calculator.calculate("x + 5")); // x should still be 10 from previous calculation, so 15
} catch (e) { console.error(e.message); }

// Test 11: Decimals
try {
    console.log("1.5 + 2.3:", calculator.calculate("1.5 + 2.3")); // Expected: 3.8
} catch (e) { console.error(e.message); }

// Test 12: Empty variable definition, then expression
try {
    console.log(" ; 10 * 2:", calculator.calculate(" ; 10 * 2")); // Expected: 20
} catch (e) { console.error(e.message); }

// Test 13: Only variable definitions
try {
    const varsOnly = calculator.calculate("p=3.14, q=2.71;");
    console.log("Variables only:", varsOnly); // Expected: { p: 3.14, q: 2.71 }
} catch (e) { console.error(e.message); }

// Test 14: Case sensitivity
try {
    console.log("A=10, a=5; A+a:", calculator.calculate("A=10, a=5; A+a")); // Expected: 15
} catch (e) { console.error(e.message); }

// Test 15: Error handling - Mismatched parentheses
try {
    console.log("((2 + 3) * 4:", calculator.calculate("((2 + 3) * 4")); // Should throw error
} catch (e) { console.error("Error for mismatched parentheses:", e.message); }

// Test 16: Error handling - Unknown token
try {
    console.log("2 $ 3:", calculator.calculate("2 $ 3")); // Should throw error
} catch (e) { console.error("Error for unknown token:", e.message); }

// Test 17: Factorial with non-integer/negative
try {
    console.log("2.5!:", calculator.calculate("2.5!")); // Should throw error
} catch (e) { console.error("Error for 2.5!:", e.message); }
try {
    console.log("-5!:", calculator.calculate("-5!")); // Should throw error
} catch (e) { console.error("Error for -5!:", e.message); }
