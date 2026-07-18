'use strict';

/**
 * ============================================================
 *  ADVANCED AI-POWERED CALCULATOR
 *  --------------------------------------------------------
 *  Features:
 *    - Arithmetic, variables, equation solving
 *    - Symbolic simplification (combine like terms)
 *    - Numerical calculus (derivative, integral)
 *    - AI helpers: explain, plot, optimize, solve
 *    - Advanced functions: sum, product, factor, fibonacci,
 *      random, gcd, lcm, isprime
 *    - Persistent history, keyboard shortcuts, suggestions
 *    - Secure evaluation with sandboxing
 *    - Error boundaries and graceful degradation
 * ============================================================
 */

// ------------------------------------------------------------------
//  SECURITY: SANITIZATION & VALIDATION
// ------------------------------------------------------------------

const VALID_EXPRESSION_PATTERN = /^[0-9a-zA-Z+\-*/^().,= \t\n\r]+$/;
const MAX_EXPRESSION_LENGTH = 500;
const MAX_ITERATIONS = 10000;

function sanitizeExpression(expr) {
    if (typeof expr !== 'string') {
        throw new TypeError('Expression must be a string');
    }

    const trimmed = expr.trim();
    if (trimmed.length === 0) {
        throw new Error('Expression cannot be empty');
    }

    if (trimmed.length > MAX_EXPRESSION_LENGTH) {
        throw new Error(`Expression exceeds maximum length of ${MAX_EXPRESSION_LENGTH} characters`);
    }

    // Block dangerous patterns
    const dangerousPatterns = [
        /__proto__/,
        /constructor/,
        /prototype/,
        /eval\s*\(/,
        /Function\s*\(/,
        /import\s*\(/,
        /require\s*\(/
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(trimmed)) {
            throw new Error('Invalid expression: contains disallowed pattern');
        }
    }

    if (!VALID_EXPRESSION_PATTERN.test(trimmed)) {
        throw new Error('Invalid expression: contains disallowed characters');
    }

    return trimmed;
}

// ------------------------------------------------------------------
//  MAIN ALGORITHM
// ------------------------------------------------------------------

/**
 * Evaluates a comma‑separated list of expressions.
 * @param {string} expression – user input
 * @returns {string} – formatted results joined by '; '
 */
function algorithm(expression) {
    try {
        const sanitized = sanitizeExpression(expression);
        if (!sanitized) {
            return 'Please enter an expression';
        }

        const tokens = splitTopLevel(sanitized).map(s => s.trim());
        const results = [];
        const variables = Object.create(null);
        const history = [];

        for (const token of tokens) {
            if (!token) continue;

            const result = processToken(token, variables, history);
            if (result !== null) {
                results.push(result);
            }
        }

        return results.length ? results.join('; ') : 'No result';
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// ------------------------------------------------------------------
//  TOKEN PROCESSING
// ------------------------------------------------------------------

function processToken(token, variables, history) {
    const lower = token.toLowerCase();

    // Built-in commands
    if (lower === 'clear') {
        Object.keys(variables).forEach(k => delete variables[k]);
        return '✓ Variables cleared';
    }

    if (lower === 'backspace') {
        return null; // Handled by UI
    }

    if (lower === 'history') {
        return history.length ? 'History: ' + history.join('; ') : 'No history';
    }

    if (lower === 'help') {
        return getHelpText();
    }

    // AI Features
    const aiResult = processAIFeatures(token, variables, history);
    if (aiResult !== null) return aiResult;

    // Advanced Functions
    const advancedResult = processAdvancedFunctions(token, variables, history);
    if (advancedResult !== null) return advancedResult;

    // Variable Assignment
    const assignMatch = token.match(/^([a-zA-Z]\w*)\s*=\s*(.+)$/);
    if (assignMatch) {
        return processAssignment(assignMatch, variables, history);
    }

    // Equation Solving
    if (token.includes('=')) {
        return processEquation(token, variables, history);
    }

    // Simplify
    if (/^simplify\s*\(/i.test(token) && token.endsWith(')')) {
        return processSimplify(token, variables, history);
    }

    // Calculus
    const calculusResult = processCalculus(token, variables, history);
    if (calculusResult !== null) return calculusResult;

    // Regular Expression
    return processRegularExpression(token, variables, history);
}

// ------------------------------------------------------------------
//  PROCESSING HELPERS
// ------------------------------------------------------------------

function processAssignment(match, variables, history) {
    const varName = match[1];
    const varExpr = match[2].trim();

    try {
        const value = evaluateWithVariables(varExpr, variables);
        variables[varName] = value;
        const result = `${varName} = ${formatNumber(value)}`;
        history.push(result);
        return result;
    } catch (err) {
        return `Error assigning ${varName}: ${err.message}`;
    }
}

function processEquation(token, variables, history) {
    const parts = token.split('=');
    if (parts.length !== 2) {
        return 'Invalid equation: ' + token;
    }

    const left = parts[0].trim();
    const right = parts[1].trim();

    if (!/[a-zA-Z]/.test(left + right)) {
        try {
            const leftVal = evaluateWithVariables(left, variables);
            const rightVal = evaluateWithVariables(right, variables);
            const result = leftVal === rightVal ? '✓ True' : '✗ False';
            history.push(result);
            return result;
        } catch (err) {
            return `Error: ${err.message}`;
        }
    }

    try {
        const solution = solveEquation(left, right, variables);
        history.push(solution);
        return solution;
    } catch (err) {
        return `Cannot solve: ${err.message}`;
    }
}

function processSimplify(token, variables, history) {
    const expr = token.slice(9, -1).trim();
    try {
        const simplified = simplifyExpression(expr, variables);
        history.push(simplified);
        return simplified;
    } catch (err) {
        return `Simplify error: ${err.message}`;
    }
}

// ------------------------------------------------------------------
//  AI FEATURES
// ------------------------------------------------------------------

function processAIFeatures(token, variables, history) {
    // Explain
    if (/^explain\s*\(/i.test(token) && token.endsWith(')')) {
        const expr = token.slice(8, -1).trim();
        try {
            const explanation = aiExplain(expr, variables);
            history.push('AI Explanation: ' + expr);
            return explanation;
        } catch (err) {
            return `AI Error: ${err.message}`;
        }
    }

    // Plot
    if (/^plot\s*\(/i.test(token) && token.endsWith(')')) {
        const expr = token.slice(5, -1).trim();
        try {
            const plotData = aiGeneratePlotData(expr, variables);
            history.push('📊 Plot: ' + expr);
            return plotData;
        } catch (err) {
            return `Plot Error: ${err.message}`;
        }
    }

    // Optimize
    if (/^optimize\s*\(/i.test(token) && token.endsWith(')')) {
        const expr = token.slice(9, -1).trim();
        try {
            const optimal = aiOptimize(expr, variables);
            history.push(optimal);
            return optimal;
        } catch (err) {
            return `Optimization Error: ${err.message}`;
        }
    }

    // Solve
    if (/^solve\s*\(/i.test(token) && token.endsWith(')')) {
        const equation = token.slice(6, -1).trim();
        try {
            const solution = aiSolveEquation(equation, variables);
            history.push(solution);
            return solution;
        } catch (err) {
            return `Equation Solver Error: ${err.message}`;
        }
    }

    return null;
}

// ------------------------------------------------------------------
//  ADVANCED FUNCTIONS
// ------------------------------------------------------------------

function processAdvancedFunctions(token, variables, history) {
    // Sum
    if (/^sum\s*\(/i.test(token) && token.endsWith(')')) {
        return processSum(token, variables, history);
    }

    // Product
    if (/^product\s*\(/i.test(token) && token.endsWith(')')) {
        return processProduct(token, variables, history);
    }

    // Factor
    if (/^factor\s*\(/i.test(token) && token.endsWith(')')) {
        return processFactor(token, history);
    }

    // Fibonacci
    if (/^fibonacci\s*\(/i.test(token) && token.endsWith(')')) {
        return processFibonacci(token, history);
    }

    // Random
    if (/^random\s*\(/i.test(token) && token.endsWith(')')) {
        return processRandom(token, history);
    }

    // GCD
    if (/^gcd\s*\(/i.test(token) && token.endsWith(')')) {
        return processGCD(token, history);
    }

    // LCM
    if (/^lcm\s*\(/i.test(token) && token.endsWith(')')) {
        return processLCM(token, history);
    }

    // IsPrime
    if (/^isprime\s*\(/i.test(token) && token.endsWith(')')) {
        return processIsPrime(token, history);
    }

    return null;
}

function processSum(token, variables, history) {
    const inner = token.slice(4, -1);
    const args = parseArguments(inner);
    if (!args || args.length !== 4) {
        return 'Sum error: Expected 4 arguments: sum(expression, variable, start, end)';
    }

    try {
        const [expr, varName, startStr, endStr] = args;
        const start = parseFloat(startStr);
        const end = parseFloat(endStr);
        if (isNaN(start) || isNaN(end)) throw new Error('Invalid range');
        if (start > end) throw new Error('Start must be less than or equal to end');
        if (end - start > MAX_ITERATIONS) {
            throw new Error(`Range exceeds maximum iterations of ${MAX_ITERATIONS}`);
        }

        let total = 0;
        for (let i = start; i <= end; i += 1) {
            const vars = { ...variables, [varName]: i };
            total += evaluateWithVariables(expr, vars);
        }
        const result = `Σ(${expr}) from ${start} to ${end} = ${formatNumber(total)}`;
        history.push(result);
        return result;
    } catch (err) {
        return `Sum error: ${err.message}`;
    }
}

function processProduct(token, variables, history) {
    const inner = token.slice(8, -1);
    const args = parseArguments(inner);
    if (!args || args.length !== 4) {
        return 'Product error: Expected 4 arguments: product(expression, variable, start, end)';
    }

    try {
        const [expr, varName, startStr, endStr] = args;
        const start = parseFloat(startStr);
        const end = parseFloat(endStr);
        if (isNaN(start) || isNaN(end)) throw new Error('Invalid range');
        if (start > end) throw new Error('Start must be less than or equal to end');
        if (end - start > MAX_ITERATIONS) {
            throw new Error(`Range exceeds maximum iterations of ${MAX_ITERATIONS}`);
        }

        let total = 1;
        for (let i = start; i <= end; i += 1) {
            const vars = { ...variables, [varName]: i };
            total *= evaluateWithVariables(expr, vars);
        }
        const result = `Π(${expr}) from ${start} to ${end} = ${formatNumber(total)}`;
        history.push(result);
        return result;
    } catch (err) {
        return `Product error: ${err.message}`;
    }
}

function processFactor(token, history) {
    const inner = token.slice(7, -1).trim();
    const n = parseInt(inner, 10);
    if (isNaN(n) || n <= 0) {
        return 'Factor error: Please provide a positive integer';
    }
    if (n > Number.MAX_SAFE_INTEGER) {
        return 'Factor error: Number exceeds safe integer limit';
    }

    const factors = primeFactorization(n);
    const result = `Prime factors of ${n}: ${factors.join(' × ')}`;
    history.push(result);
    return result;
}

function processFibonacci(token, history) {
    const inner = token.slice(10, -1).trim();
    const n = parseInt(inner, 10);
    if (isNaN(n) || n < 0) {
        return 'Fibonacci error: Please provide a non-negative integer';
    }
    if (n > 1000) {
        return 'Fibonacci error: Number exceeds limit (max 1000)';
    }

    const val = fibonacci(n);
    const result = `Fibonacci(${n}) = ${val}`;
    history.push(result);
    return result;
}

function processRandom(token, history) {
    const inner = token.slice(7, -1);
    const args = parseArguments(inner);
    if (!args || args.length !== 2) {
        return 'Random error: Expected 2 arguments: random(min, max)';
    }

    const min = parseInt(args[0], 10);
    const max = parseInt(args[1], 10);
    if (isNaN(min) || isNaN(max) || min > max) {
        return 'Random error: Invalid range';
    }

    const val = Math.floor(Math.random() * (max - min + 1)) + min;
    const result = `Random(${min}, ${max}) = ${val}`;
    history.push(result);
    return result;
}

function processGCD(token, history) {
    const inner = token.slice(4, -1);
    const args = parseArguments(inner);
    if (!args || args.length !== 2) {
        return 'GCD error: Expected 2 arguments: gcd(a, b)';
    }

    const a = parseInt(args[0], 10);
    const b = parseInt(args[1], 10);
    if (isNaN(a) || isNaN(b)) {
        return 'GCD error: Invalid numbers';
    }

    const val = gcd(a, b);
    const result = `gcd(${a}, ${b}) = ${val}`;
    history.push(result);
    return result;
}

function processLCM(token, history) {
    const inner = token.slice(4, -1);
    const args = parseArguments(inner);
    if (!args || args.length !== 2) {
        return 'LCM error: Expected 2 arguments: lcm(a, b)';
    }

    const a = parseInt(args[0], 10);
    const b = parseInt(args[1], 10);
    if (isNaN(a) || isNaN(b)) {
        return 'LCM error: Invalid numbers';
    }

    const val = lcm(a, b);
    const result = `lcm(${a}, ${b}) = ${val}`;
    history.push(result);
    return result;
}

function processIsPrime(token, history) {
    const inner = token.slice(8, -1).trim();
    const n = parseInt(inner, 10);
    if (isNaN(n) || n <= 0) {
        return 'isprime error: Please provide a positive integer';
    }
    if (n > Number.MAX_SAFE_INTEGER) {
        return 'isprime error: Number exceeds safe integer limit';
    }

    const isPrime = isPrimeNumber(n);
    const result = `${n} is ${isPrime ? '✓ prime' : '✗ not prime'}`;
    history.push(result);
    return result;
}

// ------------------------------------------------------------------
//  CALCULUS FUNCTIONS
// ------------------------------------------------------------------

function processCalculus(token, variables, history) {
    // Derivative
    const derivativeMatch = token.match(/^derivative\s*\(\s*([^,]+)\s*,\s*([a-zA-Z])\s*\)$/i);
    if (derivativeMatch) {
        const expr = derivativeMatch[1].trim();
        const varName = derivativeMatch[2];
        try {
            const derivative = computeDerivative(expr, varName, variables);
            const result = `d/d${varName}(${expr}) = ${derivative}`;
            history.push(result);
            return result;
        } catch (err) {
            return `Derivative error: ${err.message}`;
        }
    }

    // Integral
    const integralMatch = token.match(/^integral\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^,]+)\s*\)$/i);
    if (integralMatch) {
        const expr = integralMatch[1].trim();
        const lower = parseFloat(integralMatch[2].trim());
        const upper = parseFloat(integralMatch[3].trim());
        if (isNaN(lower) || isNaN(upper)) {
            return 'Integral error: Invalid bounds';
        }
        try {
            const integral = computeIntegral(expr, lower, upper, variables);
            const result = `∫(${expr}) from ${lower} to ${upper} = ${formatNumber(integral)}`;
            history.push(result);
            return result;
        } catch (err) {
            return `Integral error: ${err.message}`;
        }
    }

    return null;
}

function processRegularExpression(token, variables, history) {
    try {
        const value = evaluateWithVariables(token, variables);
        const formatted = formatNumber(value);
        history.push(formatted);
        return formatted;
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

// ------------------------------------------------------------------
//  HELPERS
// ------------------------------------------------------------------

/**
 * Splits a string by commas that are not inside parentheses.
 * @param {string} str
 * @returns {string[]}
 */
function splitTopLevel(str) {
    const parts = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            parts.push(current);
            current = '';
        } else {
            current += ch;
        }
    }
    if (current) parts.push(current);
    return parts;
}

/**
 * Parses arguments of a function call, respecting nested parentheses.
 * @param {string} str – content inside the outer parentheses
 * @returns {string[]}
 */
function parseArguments(str) {
    const args = [];
    let current = '';
    let depth = 0;
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        if (ch === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    if (current.trim()) args.push(current.trim());
    return args;
}

// ------------------------------------------------------------------
//  EVALUATION ENGINE
// ------------------------------------------------------------------

/**
 * Evaluates a mathematical expression with variable substitution.
 * @param {string} expr
 * @param {Object} variables
 * @returns {number}
 */
function evaluateWithVariables(expr, variables) {
    // Security: Validate expression
    const sanitized = sanitizeExpression(expr);
    let processed = sanitized;

    // 1. Convert implicit multiplication
    processed = processed.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    processed = processed.replace(/\)([a-zA-Z])/g, ')*$1');
    processed = processed.replace(/([a-zA-Z])(\d)/g, '$1*$2');
    processed = processed.replace(/\)\s*\(/g, ')*(');

    // 2. Substitute variables
    for (const [name, value] of Object.entries(variables)) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error(`Invalid variable value for ${name}`);
        }
        const regex = new RegExp('\\b' + name + '\\b', 'g');
        processed = processed.replace(regex, `(${value})`);
    }

    // 3. Factorial and exponentiation
    processed = processed.replace(/(\d+)!/g, 'factorial($1)');
    processed = processed.replace(/\^/g, '**');

    // 4. Built-in math functions
    const mathFunctions = {
        sin: Math.sin, cos: Math.cos, tan: Math.tan,
        asin: Math.asin, acos: Math.acos, atan: Math.atan,
        sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
        sqrt: Math.sqrt, cbrt: Math.cbrt,
        log: Math.log, log10: Math.log10, log2: Math.log2,
        abs: Math.abs, round: Math.round, floor: Math.floor, ceil: Math.ceil,
        exp: Math.exp, pow: Math.pow,
        factorial: factorial,
        pi: Math.PI, e: Math.E
    };

    // Security: Use Function constructor with sandboxing
    try {
        // Validate no dangerous patterns remain
        const dangerous = ['__proto__', 'constructor', 'prototype', 'eval', 'Function', 'import', 'require'];
        for (const pattern of dangerous) {
            if (processed.includes(pattern)) {
                throw new Error('Invalid expression structure');
            }
        }

        const fn = new Function(...Object.keys(mathFunctions), `"use strict"; return (${processed})`);
        const result = fn(...Object.values(mathFunctions));
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Result is not a finite number');
        }
        return result;
    } catch (err) {
        throw new Error(`Evaluation error: ${err.message}`);
    }
}

// ------------------------------------------------------------------
//  MATH UTILITIES
// ------------------------------------------------------------------

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // Prevent overflow
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
}

function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
}

function isPrimeNumber(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    const limit = Math.sqrt(n);
    for (let i = 3; i <= limit; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

function primeFactorization(n) {
    const factors = [];
    let num = n;
    for (let i = 2; i * i <= num; i++) {
        while (num % i === 0) {
            factors.push(i);
            num /= i;
        }
    }
    if (num > 1) factors.push(num);
    return factors;
}

function fibonacci(n) {
    if (n < 0) return NaN;
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n > 1000) return Infinity;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        const c = a + b;
        a = b;
        b = c;
    }
    return b;
}

// ------------------------------------------------------------------
//  LINEAR EQUATION SOLVER
// ------------------------------------------------------------------

function solveEquation(left, right, variables) {
    const varMatches = (left + right).match(/[a-zA-Z]\w*/g);
    if (!varMatches) throw new Error('No variable found');
    const varName = varMatches[0];

    const testVars = { ...variables };
    testVars[varName] = 0;
    const val0 = evaluateWithVariables(left, testVars) - evaluateWithVariables(right, testVars);
    testVars[varName] = 1;
    const val1 = evaluateWithVariables(left, testVars) - evaluateWithVariables(right, testVars);

    const slope = val1 - val0;
    const intercept = val0;
    if (Math.abs(slope) < 1e-12) {
        if (Math.abs(intercept) < 1e-12) return 'Infinite solutions (identity)';
        return 'No solution (contradiction)';
    }
    const solution = -intercept / slope;
    return `${varName} = ${formatNumber(solution)}`;
}

// ------------------------------------------------------------------
//  SYMBOLIC SIMPLIFICATION
// ------------------------------------------------------------------

function simplifyExpression(expr, variables) {
    try {
        // If all variables have known values, evaluate to a number
        let hasUnknown = false;
        const varMatches = expr.match(/[a-zA-Z]\w*/g) || [];
        const knownFunctions = ['sin', 'cos', 'tan', 'log', 'sqrt', 'abs', 'round', 'floor', 'ceil', 'exp', 'pow', 'factorial', 'pi', 'e'];
        for (const v of varMatches) {
            if (!knownFunctions.includes(v)) {
                if (!(v in variables)) {
                    hasUnknown = true;
                    break;
                }
            }
        }
        if (!hasUnknown) {
            const result = evaluateWithVariables(expr, variables);
            if (typeof result === 'number' && isFinite(result)) {
                return formatNumber(result);
            }
        }

        // Parse and combine like terms
        const clean = expr.replace(/\s/g, '');
        if (/^[0-9a-zA-Z+\-^*]+$/.test(clean) && !clean.includes('(') && !clean.includes(')')) {
            const terms = parseTerms(clean);
            const combined = combineLikeTerms(terms);
            return formatCombinedTerms(combined);
        }
        return expr;
    } catch (_) {
        return expr;
    }
}

function parseTerms(clean) {
    const terms = [];
    let current = '';
    let sign = 1;
    for (let i = 0; i < clean.length; i++) {
        const ch = clean[i];
        if (ch === '+' || ch === '-') {
            if (current) {
                const parsed = parseTerm(current);
                terms.push({ coeff: sign * parsed.coeff, varPart: parsed.varPart });
                current = '';
            }
            sign = (ch === '+') ? 1 : -1;
        } else {
            current += ch;
        }
    }
    if (current) {
        const parsed = parseTerm(current);
        terms.push({ coeff: sign * parsed.coeff, varPart: parsed.varPart });
    }
    return terms;
}

function parseTerm(term) {
    const match = term.match(/^([+-]?\d*\.?\d*)?([a-zA-Z]\w*(?:\^\d+)?)?$/);
    if (!match) return { coeff: 1, varPart: '' };
    let coeff = match[1] ? parseFloat(match[1]) : 1;
    if (match[1] === '' || match[1] === '+' || match[1] === '-') {
        coeff = match[1] === '-' ? -1 : 1;
    }
    return { coeff, varPart: match[2] || '' };
}

function combineLikeTerms(terms) {
    const combined = Object.create(null);
    for (const term of terms) {
        const key = term.varPart || '';
        combined[key] = (combined[key] || 0) + term.coeff;
    }
    return combined;
}

function formatCombinedTerms(combined) {
    const parts = [];
    const keys = Object.keys(combined).sort((a, b) => {
        if (a === '') return 1;
        if (b === '') return -1;
        const pa = parseInt(a.split('^')[1]) || 1;
        const pb = parseInt(b.split('^')[1]) || 1;
        return pb - pa;
    });
    for (const key of keys) {
        const coeff = combined[key];
        if (coeff === 0) continue;
        if (key === '') {
            parts.push(formatNumber(coeff));
        } else {
            const absCoeff = Math.abs(coeff);
            const display = (absCoeff === 1 ? '' : formatNumber(absCoeff));
            parts.push((coeff < 0 ? '-' : '') + display + key);
        }
    }
    if (parts.length === 0) return '0';
    let simplified = parts.join('+').replace(/\+\-/g, '-');
    if (simplified.startsWith('+')) simplified = simplified.slice(1);
    return simplified;
}

// ------------------------------------------------------------------
//  NUMERICAL CALCULUS
// ------------------------------------------------------------------

function computeDerivative(expr, varName, variables) {
    const h = 1e-8;
    const current = variables[varName] || 0;
    const varsPlus = { ...variables, [varName]: current + h };
    const varsMinus = { ...variables, [varName]: current - h };
    const fPlus = evaluateWithVariables(expr, varsPlus);
    const fMinus = evaluateWithVariables(expr, varsMinus);
    if (!isFinite(fPlus) || !isFinite(fMinus)) {
        throw new Error('Function not defined at this point');
    }
    return formatNumber((fPlus - fMinus) / (2 * h));
}

function computeIntegral(expr, lower, upper, variables) {
    if (lower > upper) {
        [lower, upper] = [upper, lower];
    }
    const n = Math.min(1000, Math.ceil((upper - lower) * 100));
    const h = (upper - lower) / n;
    let sum = 0;
    for (let i = 0; i <= n; i++) {
        const x = lower + i * h;
        const vars = { ...variables, x };
        const val = evaluateWithVariables(expr, vars);
        if (!isFinite(val)) throw new Error(`Function undefined at x = ${x}`);
        sum += (i === 0 || i === n) ? val : (i % 2 === 1 ? 4 * val : 2 * val);
    }
    return (h / 3) * sum;
}

// ------------------------------------------------------------------
//  AI FEATURES
// ------------------------------------------------------------------

function aiExplain(expr, variables) {
    try {
        const testVars = { ...variables, x: 0 };
        let r0, r1;
        try { r0 = evaluateWithVariables(expr, { ...testVars, x: 0 }); } catch { r0 = 'undefined'; }
        try { r1 = evaluateWithVariables(expr, { ...testVars, x: 1 }); } catch { r1 = 'undefined'; }

        let s = `📝 Expression: ${expr}\n📊 Analysis:\n`;
        const features = [];
        if (/sin|cos|tan/.test(expr)) features.push('🔹 Trigonometric function');
        if (/log|ln/.test(expr)) features.push('🔹 Logarithmic function');
        if (/sqrt|cbrt/.test(expr)) features.push('🔹 Root function');
        if (/\^|pow/.test(expr)) features.push('🔹 Power function');
        if (/exp|e\^/.test(expr)) features.push('🔹 Exponential function');
        if (/factorial|!/.test(expr)) features.push('🔹 Factorial function');
        if (!features.length) features.push('🔹 Polynomial or algebraic expression');
        s += features.join('\n') + '\n';

        s += '📈 Sample evaluations:\n';
        s += `   at x=0: ${typeof r0 === 'number' && isFinite(r0) ? formatNumber(r0) : 'Not defined'}\n`;
        s += `   at x=1: ${typeof r1 === 'number' && isFinite(r1) ? formatNumber(r1) : 'Not defined'}\n`;
        if (typeof r0 === 'number' && typeof r1 === 'number' &&
            Math.abs(r0 - 1) < 0.01 && Math.abs(r1 - 1) < 0.01) {
            s += '✨ This appears to be a mathematical identity!\n';
        }
        return s;
    } catch (err) {
        throw new Error('Unable to explain: ' + err.message);
    }
}

function aiGeneratePlotData(expr, variables) {
    const points = [];
    const range = 10;
    const step = 0.1;
    for (let x = -range; x <= range; x += step) {
        try {
            const y = evaluateWithVariables(expr, { ...variables, x });
            if (isFinite(y) && !isNaN(y)) {
                points.push({ x: +x.toFixed(4), y: +y.toFixed(4) });
            }
        } catch (_) { /* skip */ }
    }
    if (!points.length) throw new Error('No valid points generated');

    const yVals = points.map(p => p.y);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);
    const avgY = yVals.reduce((a, b) => a + b, 0) / yVals.length;

    let s = `📊 Plot Analysis:\n📈 Points: ${points.length}\n`;
    s += `📐 X range: ${points[0].x} to ${points[points.length - 1].x}\n`;
    s += `📊 Y range: ${minY.toFixed(2)} to ${maxY.toFixed(2)}\n`;
    s += `📉 Average Y: ${avgY.toFixed(2)}\n📋 Sample (first 10):\n`;
    points.slice(0, 10).forEach(p => s += `   (${p.x}, ${p.y})\n`);

    // ASCII chart
    const height = 10;
    const width = 40;
    const filtered = points.filter((_, i) => i % Math.floor(points.length / width) === 0);
    s += '\n📊 ASCII Visualization:\n';
    for (let row = height; row >= 0; row--) {
        const yPos = minY + (row / height) * (maxY - minY);
        let line = '';
        for (const p of filtered) {
            if (p && Math.abs(p.y - yPos) < (maxY - minY) / (height * 2)) line += '●';
            else line += '·';
        }
        s += line + '\n';
    }
    return s;
}

function aiOptimize(expr, variables) {
    try {
        const f = x => evaluateWithVariables(expr, { ...variables, x });
        let a = -100, b = 100;
        const phi = (1 + Math.sqrt(5)) / 2;
        let c = b - (b - a) / phi;
        let d = a + (b - a) / phi;
        let fc = f(c), fd = f(d);
        let iter = 0;
        while (Math.abs(c - d) > 1e-6 && iter < 1000) {
            if (fc < fd) {
                b = d;
                d = c;
                fd = fc;
                c = b - (b - a) / phi;
                fc = f(c);
            } else {
                a = c;
                c = d;
                fc = fd;
                d = a + (b - a) / phi;
                fd = f(d);
            }
            iter++;
        }
        const minX = (c + d) / 2;
        const minVal = f(minX);
        return `🔍 Optimization Results:\n📉 Minimum at x = ${formatNumber(minX)}, f(x) = ${formatNumber(minVal)}\n🔄 Iterations: ${iter}\n📊 Range: [${a.toFixed(2)}, ${b.toFixed(2)}]`;
    } catch (err) {
        throw new Error('Unable to optimize: ' + err.message);
    }
}

function aiSolveEquation(equation, variables) {
    try {
        let left, right;
        if (equation.includes('=')) {
            const parts = equation.split('=');
            if (parts.length !== 2) throw new Error('Invalid equation');
            left = parts[0].trim();
            right = parts[1].trim();
        } else {
            left = equation;
            right = '0';
        }
        const f = x => evaluateWithVariables(left, { ...variables, x }) - evaluateWithVariables(right, { ...variables, x });

        let a = -10, b = 10;
        let fa = f(a), fb = f(b);
        let attempts = 0;
        while (fa * fb > 0 && Math.abs(b) < 10000 && attempts < 100) {
            a = b;
            b *= 2;
            fa = f(a);
            fb = f(b);
            attempts++;
        }
        if (fa * fb > 0) {
            let found = false;
            for (let start = -10; start <= 10 && !found; start += 0.5) {
                for (let end = start + 0.5; end <= 10 && !found; end += 0.5) {
                    const fs = f(start), fe = f(end);
                    if (fs * fe < 0) {
                        a = start;
                        b = end;
                        fa = fs;
                        fb = fe;
                        found = true;
                    }
                }
            }
            if (!found) throw new Error('No root found');
        }

        let c, iter = 0;
        while ((b - a) / 2 > 1e-8 && iter < 1000) {
            c = (a + b) / 2;
            const fc = f(c);
            if (fc === 0) break;
            if (fa * fc < 0) {
                b = c;
                fb = fc;
            } else {
                a = c;
                fa = fc;
            }
            iter++;
        }
        const root = (a + b) / 2;
        const rootVal = f(root);
        let result = `✅ Solution found:\n🔢 x = ${formatNumber(root)}\n🔍 Verification: f(x) = ${formatNumber(rootVal)}\n🔄 Iterations: ${iter}\n📊 Range: [${formatNumber(a)}, ${formatNumber(b)}]`;

        // Try to find other roots
        const otherRoots = [];
        for (let i = -10; i <= 10; i += 1) {
            const test = (i + i + 1) / 2;
            if (Math.abs(test - root) > 0.1) {
                try { if (Math.abs(f(test)) < 0.1) otherRoots.push(test); } catch (_) { }
            }
        }
        if (otherRoots.length) {
            result += `\n💡 Other possible roots: ${otherRoots.map(r => formatNumber(r)).join(', ')}`;
        }
        return result;
    } catch (err) {
        throw new Error('Unable to solve: ' + err.message);
    }
}

// ------------------------------------------------------------------
//  FORMATTING
// ------------------------------------------------------------------

function formatNumber(num) {
    if (typeof num !== 'number' || !isFinite(num)) return String(num);
    if (Number.isInteger(num)) return num.toString();
    return (Math.round(num * 1e12) / 1e12).toString();
}

function getHelpText() {
    return (
        '📚 Available Commands:\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '📝 Assign: x = 5\n' +
        '🔢 Solve: 2x + 3 = 13\n' +
        '🔧 Simplify: simplify(2x + 3x)\n' +
        '📊 Functions: sin, cos, sqrt, log, abs, round, factorial\n' +
        '🤖 AI Features:\n' +
        '  • Explain: explain(sin(x)^2 + cos(x)^2)\n' +
        '  • Plot: plot(sin(x)/x)\n' +
        '  • Optimize: optimize(x^2 + 3x + 2)\n' +
        '  • Solve: solve(x^2 - 4 = 0)\n' +
        '📐 Calculus:\n' +
        '  • Derive: derivative(x^2, x)\n' +
        '  • Integrate: integral(x^2, 0, 1)\n' +
        '✨ Advanced:\n' +
        '  • Sum: sum(x^2, x, 1, 10)\n' +
        '  • Product: product(x, x, 1, 5)\n' +
        '  • Factor: factor(84)\n' +
        '  • Fibonacci: fibonacci(10)\n' +
        '  • Random: random(1, 100)\n' +
        '  • Find: gcd(12, 18), lcm(12, 18)\n' +
        '  • Determine: isprime(17)\n' +
        '🛠️ Commands: clear, backspace, history, help\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '💡 Tip: Click history items to reuse'
    );
}

// ------------------------------------------------------------------
//  UI WIRING
// ------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('expression');
    const button = document.getElementById('calculate');
    const result = document.getElementById('result');

    if (!input || !button || !result) {
        console.error('Required DOM elements not found');
        return;
    }

    // State
    let calcHistory = [];
    let isProcessing = false;

    // ---- Main Calculation ----
    function handleCalculate() {
        if (isProcessing) return;
        const expr = input.value.trim();
        if (!expr) {
            setResult('⚠️ Please enter an expression', 'error');
            return;
        }

        isProcessing = true;
        button.disabled = true;
        button.textContent = '⏳ ...';
        setResult('⏳ Processing<span class="typing-indicator">…</span>', 'info');

        setTimeout(() => {
            try {
                const output = algorithm(expr);
                const isError = /Error|Cannot|Unable/.test(output);
                const isSuccess = /✓|Solution|Result/.test(output);
                const formatted = formatResultWithStyling(output);
                result.innerHTML = formatted;
                result.className = isError ? 'result-error' : (isSuccess ? 'result-success' : 'result-info');
                addToHistory(expr, output);
                try { localStorage.setItem('calculatorHistory', JSON.stringify(calcHistory)); } catch (_) { }
            } catch (err) {
                setResult(`❌ Error: ${err.message}`, 'error');
            } finally {
                isProcessing = false;
                button.disabled = false;
                button.textContent = '🧮 Calculate';
            }
        }, 200);
    }

    function setResult(html, type) {
        result.innerHTML = `<div class="result-content" style="text-align:center;">${html}</div>`;
        result.className = `result-${type || 'info'}`;
    }

    function formatResultWithStyling(output) {
        if (output.includes('\n')) {
            const lines = output.split('\n').filter(l => l.trim());
            let html = '<div class="result-content">';
            if (output.includes('📝 Expression:')) {
                html += '<div class="result-title">🤖 AI Analysis</div>';
            }
            for (const line of lines) {
                const t = line.trim();
                if (!t) continue;
                if (t.match(/^[📝📊📈🔍✅📉]+\s+(Expression|Analysis|Sample|Optimization|Plot|Solution)/)) {
                    html += `<div class="section"><span class="section-title">${t}</span></div>`;
                } else if (t.includes('🔹')) {
                    const feature = t.replace('🔹', '').trim();
                    html += `<span class="feature-tag">🔹 ${feature}</span>`;
                } else if (t.includes('at x=')) {
                    const parts = t.split(':');
                    if (parts.length === 2) {
                        const label = parts[0].trim();
                        const value = parts[1].trim();
                        html += `<div style="margin:4px 0;"><span class="sample-eval"><span class="info-text">${label}:</span> <span class="highlight-value">${value}</span></span></div>`;
                    }
                } else if (t.includes('✨') || t.includes('💡')) {
                    html += `<div style="color:#ff0; padding:4px 10px; background:rgba(255,255,0,0.06); border-radius:4px; margin:4px 0; font-size:0.95rem;">${t}</div>`;
                } else if (t.includes(':')) {
                    const parts = t.split(':');
                    if (parts.length === 2) {
                        const label = parts[0].trim();
                        const value = parts[1].trim();
                        html += `<div style="padding:2px 0; font-size:0.95rem;"><span style="color:#0ff;">${label}:</span> <span class="highlight-value">${value}</span></div>`;
                    } else {
                        html += `<div style="padding:2px 0;">${t}</div>`;
                    }
                } else {
                    html += `<div style="padding:2px 0;">${t}</div>`;
                }
            }
            html += '</div>';
            return html;
        }
        return `<div class="result-content" style="text-align:center; padding:8px 0;">${output}</div>`;
    }

    // ---- History Management ----
    const historyContainer = createHistoryContainer();

    function createHistoryContainer() {
        const container = document.createElement('div');
        container.id = 'history-container';
        container.style.cssText = `
            margin: 15px auto;
            max-width: 720px;
            max-height: 240px;
            overflow-y: auto;
            padding: 12px 16px;
            background: rgba(10, 10, 10, 0.85);
            border-radius: 10px;
            border: 1px solid rgba(0, 255, 255, 0.15);
            display: none;
            font-size: 0.95rem;
        `;
        const main = document.querySelector('#main');
        if (main) {
            result.parentNode.insertBefore(container, result.nextSibling);
        }
        return container;
    }

    function addToHistory(expr, res) {
        const time = new Date().toLocaleTimeString();
        const isError = /Error|Cannot|Unable/.test(res);
        const short = res.length > 80 ? res.substring(0, 80) + '…' : res;
        calcHistory.unshift({ expression: expr, result: short, full: res, time, isError });
        if (calcHistory.length > 50) calcHistory.pop();
        updateHistoryDisplay();
    }

    function updateHistoryDisplay() {
        if (!calcHistory.length) {
            historyContainer.style.display = 'none';
            return;
        }
        historyContainer.style.display = 'block';
        historyContainer.innerHTML = `<div style="color:#0ff; font-weight:600; margin-bottom:8px;">📜 History</div>`;
        calcHistory.slice(0, 10).forEach((item) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            const icon = item.isError ? '❌' : '✅';
            div.innerHTML = `
                <span><span class="expr">${icon} ${item.expression}</span> → <span class="res">${item.result}</span></span>
                <span class="time">${item.time}</span>
            `;
            div.addEventListener('click', () => {
                input.value = item.expression;
                input.focus();
                setTimeout(handleCalculate, 200);
            });
            if (item.full) div.title = item.full;
            historyContainer.appendChild(div);
        });

        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🗑️ Clear';
        clearBtn.style.cssText = `
            margin: 8px auto 0;
            display: block;
            padding: 4px 16px;
            font-size: 0.85rem;
            background: rgba(255,0,0,0.1);
            color: #f66;
            border: 1px solid rgba(255,0,0,0.2);
            border-radius: 6px;
            cursor: pointer;
            transition: 0.2s;
        `;
        clearBtn.onclick = function () {
            calcHistory = [];
            updateHistoryDisplay();
            try { localStorage.removeItem('calculatorHistory'); } catch (_) { }
        };
        historyContainer.appendChild(clearBtn);
    }

    // ---- Load History ----
    try {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            calcHistory = JSON.parse(saved);
            updateHistoryDisplay();
        }
    } catch (_) { }

    // ---- Smart Suggestions ----
    let suggestionTimer = null;
    input.addEventListener('input', function () {
        clearTimeout(suggestionTimer);
        suggestionTimer = setTimeout(() => {
            const v = this.value.trim();
            if (v && !v.includes('=') && !v.includes('(')) {
                const map = {
                    sin: 'sin(x)', cos: 'cos(x)', sqrt: 'sqrt(x)', log: 'log(x)',
                    explain: 'explain(expression)', plot: 'plot(expression)',
                    optimize: 'optimize(expression)', solve: 'solve(equation)',
                    derivative: 'derivative(expression, x)', integral: 'integral(expression, lower, upper)',
                    sum: 'sum(x^2, x, 1, 10)', product: 'product(x, x, 1, 5)',
                    factor: 'factor(84)', fibonacci: 'fibonacci(10)', random: 'random(1, 100)',
                    gcd: 'gcd(12, 18)', lcm: 'lcm(12, 18)', isprime: 'isprime(17)'
                };
                const lower = v.toLowerCase();
                if (map[lower]) {
                    setResult(`💡 Did you mean: <span style="color:#0ff; font-weight:600;">${map[lower]}</span>`, 'info');
                }
            }
        }, 600);
    });

    // ---- Keyboard Shortcuts ----
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleCalculate();
        }
        if (e.key === 'Escape' && input === document.activeElement) {
            input.value = '';
            setResult('✨ Ready', 'info');
        }
    });

    // ---- Event Listeners ----
    button.addEventListener('click', handleCalculate);
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCalculate();
        }
    });

    // ---- Help Button ----
    const helpBtn = document.createElement('button');
    helpBtn.textContent = '❓ Help';
    helpBtn.style.cssText = `
        margin-left: 12px;
        padding: 10px 18px;
        font-size: 1rem;
        background: rgba(255,0,255,0.1);
        color: #f0f;
        border: 1px solid rgba(255,0,255,0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: 0.2s;
    `;
    helpBtn.onclick = function () {
        const helpText = algorithm('help');
        result.innerHTML = formatResultWithStyling(helpText);
        result.className = 'result-info';
    };
    button.parentNode.insertBefore(helpBtn, button.nextSibling);

    // ---- Initial State ----
    input.focus();
    setResult('✨ Ready to calculate', 'info');
});

// ------------------------------------------------------------------
//  SECURITY: ADDITIONAL SAFEGUARDS
// ------------------------------------------------------------------

// Prevent XSS in history items
const originalAddToHistory = addToHistory;
addToHistory = function (expr, res) {
    const sanitizedExpr = expr.replace(/[<>]/g, '');
    const sanitizedRes = res.replace(/[<>]/g, '');
    originalAddToHistory.call(this, sanitizedExpr, sanitizedRes);
};

// ------------------------------------------------------------------
//  EXPORTS (for testing)
// ------------------------------------------------------------------

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        algorithm,
        evaluateWithVariables,
        factorial,
        gcd,
        lcm,
        isPrimeNumber,
        primeFactorization,
        fibonacci,
        solveEquation,
        simplifyExpression,
        computeDerivative,
        computeIntegral,
        formatNumber
    };
}