import {useEffect, useState} from 'react';
import styled from "styled-components";
import {evaluate, format} from 'mathjs/number';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ["Black Ops One"]
  }
})

const Calculator = () => {
const [input, changeInput] = useState("0");
const [result, changeResult] = useState("0");

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];
//const inputRegex = /(^[1-9]+0*\.?\d*(\+|\-|\*|\/)?$)|^(0\.{1}\d*(?<=\d)(\+|\-|\*|\/)?$)|^0$/gm;
const expressionRegex = /[\+\-\*\/]$/gm;

useEffect(()=>{
  if (result.toString().length > 25 || input.toString().length > 15) {    
    changeInput("Exceeds maxlength");
    changeResult("0");
  }
}, [result, input]);

const resetAll = () => {
  changeResult("0");
  changeInput("0");
}

const numberInput = (e) => {    
  //Pressing a number after last input is evaluate or last input exceeds length limit, it clears existing result and starts fresh
  if (result.includes("=") || input === "Exceeds maxlength") {    
    changeResult("0");
    //Automatically makes it a decimal if first input is a decimal.
    if (e.target.value === "."){
      changeInput("0.");
    }
    else {
      changeInput(e.target.value);
    }  
  }
  //Input on screen is an operator, replace the operator with input
  else if (expressionRegex.test(input)){
    if (e.target.value === ".") {
      changeInput("0.");
    }
    else {
      changeInput(e.target.value);
    }
  }
  //Starting an input
  else if (input === "0") {    
    if (e.target.value === "."){
      changeInput("0.");
    }
    else if (e.target.value !== "0"){
      changeInput(e.target.value);
    }
  }  
  //Allows 1 decimal input per input
  else if (input.includes(".")) {
    if (e.target.value !== "."){
      changeInput(prev => prev+e.target.value);
    } 
  }  
  else {
    changeInput(prev => prev+e.target.value);
  }
}

const operationInput = (e) => {
  //Do nothing if input is unnatural 
  if (input !== "NaN" || input !== "Infinity" || input !== "Exceeds maxlength") {
    //If result is already evaluated, then continue operation using the last resulted number
    if (result.toString().includes("=")) {
      changeResult(input+e.target.value);
      changeInput(e.target.value);
    }
    //Continue chaining operations if input is natural
    else {               
      //Last input is a number, put that number to result display
      if ((/[0-9]$/gm).test(input)) {
        changeInput(e.target.value);
        if (result === "0") {
          changeResult(input+e.target.value);
        }
        else {
          changeResult(prev => prev+input+e.target.value);
        } 
      }
      //Last input is an operator
      else if (expressionRegex.test(input)){
        //Last operator is the same as new operator
        if (input === e.target.value){
          return
        }
        //For following 2 else ifs..
        //If (+) is followed by (-) and vice versa, allow it. If (* or /) following, replace (+ or -)
        else if (result[result.length-1] === ("+")){
          if (e.target.value === "-"){            
            changeInput(e.target.value);
            changeResult(prev => prev+"-");
          }
          else {
            changeInput(e.target.value);
            changeResult(prev => prev.substring(0,result.length-1)+e.target.value);
          }
        }        
        else if (result[result.length-1] === ("-")){
          if (e.target.value === "+"){            
            changeInput(e.target.value);
            changeResult(prev => prev+"+");
          }
          else {
            changeInput(e.target.value);
            changeResult(prev => prev.substring(0,result.length-1)+e.target.value);
          }
        }
        //If (* or /) is followed by (+ or -), allow it. Otherwise allow signs to flip between * and /
        else if (result[result.length-1] === "*" || result[result.length-1] === "/"){
          if (e.target.value === "+" || e.target.value === "-") {
            changeInput(e.target.value);
            changeResult(prev => prev+e.target.value);
          }
          else {
            changeInput(e.target.value);
            changeResult(prev => prev.substring(0,result.length-1)+e.target.value);
          }
        }
      }      
    }
  }
  else {           
  }    
}

const calculateResult = (e) => {      
  if (result == 0) {
    changeInput(input);
    changeResult(input+"="+input);
  }
  else {
    if (!result.toString().includes("=")) {
      //Remove last input if it's an operator, then evaluate
      if (expressionRegex.test(result+input)){   
        let final = format(evaluate(result.slice(0, result.length-1)), {notation: "fixed"});
        changeInput(final);
        changeResult(prev => prev.slice(0, prev.length-1)+"="+final);         
      }
      //Last input is not an operator, evaluate on screen numbers
      else {
        let final = format(evaluate(result+input), {notation: "fixed"});
        console.log(final);
        changeInput(final);
        changeResult("="+final);        
      }
    }
  }  
}

const numberButton = numbers.map((value)=>{
  return (        
    <NumberButton key={value} value={value} onClick={numberInput}>
      {value}
    </NumberButton>        
  )
});

  return (
    <CalculatorWrapper>
      <Display>
        <div style={{color: "orange"}}>{result}</div>
        <div>{input}</div>            
      </Display>
      <AllInput>
        <TopRow>
          <ResetButton onClick={resetAll}>AC</ResetButton>
          <OperationButton value={"/"} onClick={operationInput}>/</OperationButton>
          <OperationButton value={"*"} onClick={operationInput}>X</OperationButton>
          <OperationButton value={"-"} onClick={operationInput}>-</OperationButton>
        </TopRow>
        <OneToNineWrapper>
          {numberButton}
        </OneToNineWrapper>
        <BottomRow>
          <NumberButton value={0} onClick={numberInput}>0</NumberButton>
          <NumberButton value={"."} onClick={numberInput}>.</NumberButton>
        </BottomRow>
        <PlusSign value={"+"} onClick={operationInput}>+</PlusSign>                        
        <EqualSign value={"="} onClick={calculateResult}>=</EqualSign>
      </AllInput>
    </CalculatorWrapper>
  )
}

export default Calculator

const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin: auto;
  margin-top: 50px;
  border-radius: 30px;
  background-color: black;
  font-family: "Black Ops One", monospace;
  @media only screen and (max-width: 450px){
    width: 100%;
  }
`
const Display = styled.div`
  width: 90%;
  position: relative;  
  margin: auto;
  margin-top: 20px;   
  text-align: right;
  color: white;
  font-size: 1.35em;
  overflow-wrap: break-word;
`

const AllInput = styled.div`
  width: 90%;
  position: relative;  
  margin: auto;
  margin-top: 15px;
  padding-bottom: 20px;
  display: grid;
  grid-template-areas:
    'Operation Operation Operation Operation'
    'Number Number Number Plus'
    'Number Number Number Plus'
    'Number Number Number Equals'
    'Bottom Bottom Bottom Equals';      
`

const TopRow = styled.div`
  width: 100%;
  margin: auto;
  grid-area: Operation;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%; 
`

const OneToNineWrapper = styled.div`
  width: 100%;
  grid-area: Number;
  display: grid;
  grid-template-columns: auto auto auto;
`

const NumberButton = styled.button`    
  background-color: orange;
  font-size: 30px;
  padding: 15px;  
`

const BottomRow = styled.div`
  grid-area: Bottom;
  display: grid;
  grid-template-columns: 66.6% auto;
`

const OperationButton = styled.button`
  background-color: #d4c226;
  font-size: 1.75em;    
  padding: 15px;  
`
const PlusSign = styled(OperationButton)`
  grid-area: Plus;
`

const EqualSign = styled(OperationButton)`
  grid-area: Equals;
  background-color: #ff2121;
`

const ResetButton = styled.button`
  background-color: #4079ff;
  color: black;
  font-size: 1.7em;
`

