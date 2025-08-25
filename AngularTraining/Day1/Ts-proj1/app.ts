function calculate(operator: string): void {
    const num1 = document.getElementById("num1") as HTMLInputElement;
    const num2 = document.getElementById("num2") as HTMLInputElement;
    const resultElement = document.getElementById("result") as HTMLElement;

    const val1 = Number(num1.value);
    const val2 = Number(num2.value);
    let result: number | string;

    if (isNaN(val1) || isNaN(val2)) {
        result = "Please enter valid numbers.";
    } else {
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

    resultElement.innerText = `Result: ${result}`;
}
