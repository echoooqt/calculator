const display = document.getElementById("display");
const historyDisplay = document.getElementById("historyDisplay");
const historyPanel = document.getElementById("historyPanel");
const toggleHistoryBtn = document.getElementById("toggleHistory");
const clearHistoryBtn = document.getElementById("clearHistory");

let expression = "";

function append(value) {
  if (display.textContent === "0" && value !== ".") {
    display.textContent = "";
    expression = "";
  }
  expression += value;
  historyDisplay.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷");
  autoCalculate();
}

function clearDisplay() {
  display.textContent = "0";
  historyDisplay.textContent = "";
  expression = "";
}

function backspace() {
  expression = expression.slice(0, -1);
  historyDisplay.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷");
  autoCalculate();
}

function autoCalculate() {
  try {
    if (expression.trim() === "") {
      display.textContent = "0";
      return;
    }
    let lastChar = expression.slice(-1);
    if (["+", "-", "*", "/"].includes(lastChar)) {
      return;
    }
    display.textContent = new Intl.NumberFormat().format(Function("return " + expression)());
  } catch {
    display.textContent = "Error";
  }
}

function finalize() {
  try {
    let result = Function("return " + expression)();
    if (expression.trim() !== "") {
      addToHistory(expression, result);
    }
    display.textContent = new Intl.NumberFormat().format(result);
    historyDisplay.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷") + " =";
    expression = result.toString();
  } catch {
    display.textContent = "Error";
  }
}

function addToHistory(expr, result) {
  let item = document.createElement("div");
  item.className = "history-item";

  let exprDiv = document.createElement("div");
  exprDiv.className = "history-expression";
  exprDiv.textContent = expr.replace(/\*/g, "×").replace(/\//g, "÷") + " =";

  let resDiv = document.createElement("div");
  resDiv.className = "history-result";
  resDiv.textContent = new Intl.NumberFormat().format(result);

  item.appendChild(exprDiv);
  item.appendChild(resDiv);

  historyPanel.insertBefore(item, clearHistoryBtn);
}

// Toggle history panel
toggleHistoryBtn.addEventListener("click", () => {
  historyPanel.style.display =
    historyPanel.style.display === "none" || historyPanel.style.display === ""
      ? "flex"
      : "none";
});

// Clear all history
clearHistoryBtn.addEventListener("click", () => {
  historyPanel.querySelectorAll(".history-item").forEach(item => item.remove());
});

// Keyboard Support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (!isNaN(key)) append(key);
  else if (["+", "-", "*", "/"].includes(key)) append(key);
  else if (key === ".") append(".");
  else if (key === "Backspace") backspace();
  else if (key === "Enter") finalize();
  else if (key === "Escape") clearDisplay();
});
