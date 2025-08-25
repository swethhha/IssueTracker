function calculate(operator) {
    var num1 = document.getElementById("num1");
    var num2 = document.getElementById("num2");
    var resultElement = document.getElementById("result");
    var val1 = Number(num1.value);
    var val2 = Number(num2.value);
    var result;
    if (isNaN(val1) || isNaN(val2)) {
        result = "Please enter valid numbers.";
    }
    else {
        switch (operator) {
            case "+":
                result = val1 + val2;
                break;
            case "-":
                result = val1 - val2;
                break;
            case "*":
                result = val1 * val2;
                break;
            case "/":
                result = val2 !== 0 ? val1 / val2 : "Cannot divide by zero";
                break;
            default:
                result = "Invalid operator";
        }
    }
    resultElement.innerText = "Result: ".concat(result);
}
