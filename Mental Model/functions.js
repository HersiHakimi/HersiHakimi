function add(a, b, ...numbers) {
    return numbers.reduce((sum, num) => sum + num, a + b);
}
function multiply(a, b, ...numbers) {
    return numbers.reduce((sum, num) => {
        return sum * num;
    }, a * b);
}
console.log(add(1, 2, 3, 4, 5)) // 15;
console.log(add(5, 4, 3, 2, 1)) // 15;
console.log(multiply(1, 2, 3, 4, 5)) // 120;
console.log(multiply(5, 4, 3, 2, 1)) // 120;
console.log(multiply(2, 4)) // 8;
console.log(multiply(-2, 4)) // -8;
// EOF