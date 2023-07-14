import { useReducer } from "react";
import "./App.css";
import DigitButton from "./DigitButton/DigitButton";
import OperationButton from "./OperationButton/OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add_digit",
  CHOOSE_OPERATION: "choose_operation",
  DELETE_DIGIT: "delete_digit",
  CLEAR: "clear",
  EQUALS: "equals",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.current === "0") {
        return state;
      }

      if (payload.digit === "." && state.current.includes(".")) {
        return state;
      }

      return {
        ...state,
        current: `${state.current || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.current == null && state.previous == null) {
        return state;
      }

      if (state.previous == null) {
        return {
          ...state,
          previous: state.current,
          operation: payload.operation,
          current: null,
        };
      }

      if (state.current == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      return {
        ...state,
        previous: evaluate(state),
        operation: payload.operation,
        current: null,
      };
    case ACTIONS.CLEAR:
      return {
        current: null,
        previous: null,
        operation: null,
        overwrite: false,
      };
    case ACTIONS.EQUALS:
      if (
        state.current == null ||
        state.previous == null ||
        state.operation == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previous: null,
        operation: null,
        current: evaluate(state),
      };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          current: null,
        };
      }

      if (state.current == null) return state;

      if (state.current.lenght === 1) {
        return {
          ...state,
          current: null,
        };
      }

      return {
        ...state,
        current: state.current.slice(0, -1),
      };
    default:
      break;
  }
}

function evaluate({ current, previous, operation }) {
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
    default:
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ current, previous, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-value">
          {formatOperand(previous)} {operation}
        </div>
        <div className="current-value">{formatOperand(current)}</div>
      </div>
      <button
        className="size-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        Del
      </button>
      <OperationButton operation={"/"} dispatch={dispatch} />
      <DigitButton digit={"1"} dispatch={dispatch} />
      <DigitButton digit={"2"} dispatch={dispatch} />
      <DigitButton digit={"3"} dispatch={dispatch} />
      <OperationButton operation={"*"} dispatch={dispatch} />
      <DigitButton digit={"4"} dispatch={dispatch} />
      <DigitButton digit={"5"} dispatch={dispatch} />
      <DigitButton digit={"6"} dispatch={dispatch} />
      <OperationButton operation={"+"} dispatch={dispatch} />
      <DigitButton digit={"7"} dispatch={dispatch} />
      <DigitButton digit={"8"} dispatch={dispatch} />
      <DigitButton digit={"9"} dispatch={dispatch} />
      <OperationButton operation={"-"} dispatch={dispatch} />
      <DigitButton digit={"."} dispatch={dispatch} />
      <DigitButton digit={"0"} dispatch={dispatch} />
      <button
        className="size-two"
        onClick={() => dispatch({ type: ACTIONS.EQUALS })}
      >
        =
      </button>
    </div>
  );
}

export default App;
