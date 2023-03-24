/*
        For this project, Calculator Logic:
        EXAMPLE: 3 + 5 x 6 - 2 / 4 =

        [] Immediate Execution Logic: 11.5
        [*] Formula/Expression Logic: 32.5
*/

const synth = window.speechSynthesis;

let computeResult = 0;
let currentOperand = "";
let equation = "0";
let isAfterDecimal = false;
let isAppendZeroAllowed = true;
let isBeginningOfOperand = true;
let mostRecentOperator = "";
let previousCurrentOperand = "";

$(document).ready(function () {
  $("#display").val(computeResult);
});

function clearDisplay() {
  computeResult = 0;
  currentOperand = "";
  equation = "0";
  isAfterDecimal = false;
  isAppendZeroAllowed = true;
  isBeginningOfOperand = true;
  mostRecentOperator = "";
  previousCurrentOperand = "";
  $("#display").val(computeResult);
  speak("clear");
}

function speak(inputValue) {
  if ($("#isVoiceEnabled").is(":checked")) {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterThis = new SpeechSynthesisUtterance(inputValue);

    utterThis.onerror = function (event) {
      console.error("SpeechSynthesisUtterance.onerror");
    };

    synth.speak(utterThis);
  }
}

function appendDigit(event) {
  speak(event.data.digit);
  if (currentOperand === "0") {
    if (event.data.digit != 0) {
      currentOperand = event.data.digit.toString();
    }
  } else {
    currentOperand += event.data.digit.toString();
  }

  $("#display").val(currentOperand);
}
function appendDecimalPt() {
  speak("point");
  if (!isAfterDecimal) {
    currentOperand += ".";
    isAfterDecimal = true;
  }
  $("#display").val(currentOperand);
}

function appendOperator(event) {
  speak(event.data.operatorName);
  if (equation === "0") {
    equation = currentOperand + event.data.operator;
  } else {
    equation += currentOperand + event.data.operator;
  }

  currentOperand = "";
  isAfterDecimal = false;
  $("#display").val(equation);
}

function compute() {
  if (equation !== "0") {
    equation += currentOperand;
  }

  // // Final Equation logic [Begin]
  let finalEquationStr = "";
  let equationArr = equation.split("");

  for (let i = 0; i < equationArr.length; i++) {
    if (equationArr[i] === ".") {
      // If is a "."
      finalEquationStr += equationArr[i];
    } else if (equationArr[i] >= 0) {
      // if is a number
      finalEquationStr += equationArr[i];
    } else {
      // if next char is a number, add current char
      // if char is "-" and next char is number, if previous char is NaN, add previous char
      if (equationArr[i + 1] >= 0) {
        // if next char is number
        if (equationArr[i] === "-") {
          if (equationArr[i - 1] >= 0 === false) {
            finalEquationStr += equationArr[i - 1];
          }
        }
        // add current char
        finalEquationStr += equationArr[i];
      }
    }
  }
  // // Final Equation logic [End]

  computeResult = Function("return " + finalEquationStr)();
  currentOperand = computeResult;
  $("#display").val(computeResult);
  speak(
    "equals to " +
      computeResult.toString().split("").join(" ").replace(".", "Point")
  );
  equation = "0";
}

// // Binding Event handlers
//
$("#clear").click(clearDisplay);
$("#zero").click({ digit: 0 }, appendDigit);
$("#one").click({ digit: 1 }, appendDigit);
$("#two").click({ digit: 2 }, appendDigit);
$("#three").click({ digit: 3 }, appendDigit);
$("#four").click({ digit: 4 }, appendDigit);
$("#five").click({ digit: 5 }, appendDigit);
$("#six").click({ digit: 6 }, appendDigit);
$("#seven").click({ digit: 7 }, appendDigit);
$("#eight").click({ digit: 8 }, appendDigit);
$("#nine").click({ digit: 9 }, appendDigit);
$("#decimal").click(appendDecimalPt);
$("#add").click({ operator: "+", operatorName: "plus" }, appendOperator);
$("#subtract").click({ operator: "-", operatorName: "minus" }, appendOperator);
$("#multiply").click({ operator: "*", operatorName: "times" }, appendOperator);
$("#divide").click(
  { operator: "/", operatorName: "divide by" },
  appendOperator
);
$("#equals").click(compute);
