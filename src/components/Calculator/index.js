import {useState} from 'react';
import styled from "styled-components";
import {evaluate, format} from 'mathjs/number';
import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: ["Black Ops One"]
  }
})

const Calculator = () => {
const [input, changeInput] = useState(0);
const [result, changeResult] = useState(0);

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3];
const inputRegex = /(^[1-9]+0*\.?\d*(\+|\-|\*|\/)?$)|^(0\.{1}\d*(?<=\d)(\+|\-|\*|\/)?$)|^0$/gm;
const expressionRegex = /[\+\-\*\/]$/gm;

const resetAll = () => {
  changeResult(0);
  changeInput(0);
}

const numberInput = (e) => {  
  //Pressing a number right after evaluating, it clears existing result
  if (result.toString().indexOf("=") !== -1) {    
    changeResult(0);
    //Automatically makes it a decimal if first input is a decimal.
    if (e.target.value == "."){
      changeInput("0.");
    }
    else {
      changeInput(e.target.value);
    }  
  }  
  else {
    //Initial user input
    if (input===0 && e.target.value!==0){
      if (e.target.value==="."){
        changeInput(prev=>prev+".");
      }
      else {
        changeInput(e.target.value);
      }    
    }
    //Last input is an operator, replace it with current input
    else if (expressionRegex.test(input)) {
      //Automatically makes it a decimal if first input is a decimal.
      if (e.target.value == "."){
        changeInput("0.");
      }
      else {
        changeInput(e.target.value);
      }      
    }
    //Add to number
    else if (inputRegex.test(input+e.target.value)){
      //Will reset if input exceeds maximum length
      if ((input+e.target.value).length > 10) {
        changeInput("Exceeds maximum length"); 
        changeResult(0);
      }
      else {
        changeInput(prev=>prev+e.target.value);
      }      
    }
  }
}

const operationInput = (e) => {  
  //If result is already evaluated, then continue operation using the last resulted number
  if (result.toString().indexOf("=") !== -1) {
    changeResult(prev => prev.substring(prev.indexOf("=")+1)+e.target.value);
    changeInput(e.target.value);
  } 
  //Continue chaining operations
  else if (input !== "Error"){
    if (result == 0 || result == input){    
      changeResult(input+e.target.value);
      changeInput(e.target.value);
    }
    //If input is already an operator, replace it with new operator
    else if (expressionRegex.test(input)) {    
      changeResult(result.substring(0,result.length-1)+e.target.value);
      changeInput(e.target.value);
    }
    //Add the existing input (a number) and current operator to result  
    else {    
      changeResult(prev => prev+input+e.target.value);
      changeInput(e.target.value);
    }
  }       
}

const calculateResult = (e) => {  
  let final = format(evaluate(result.toString()+input.toString()),{precision:14});
  //User hits equal when equal operator exists, or result is input  
  if (result.toString().indexOf("=") !== -1){
    changeResult(prev => prev.substring(prev.indexOf("=")+1)+"="+prev.substring(prev.indexOf("=")+1));
    changeInput(result.substring(result.indexOf("=")+1));
  }
  //Change result to current input if result is 0
  else if (result == 0) {
    changeResult(`${result}+${input}=${final}`);
  }
  else {
    //User hits equal when last input is a number          
    //Resulting number is divided by 0, or resulting length is too long
      if (final == "Infinity" || final.toString() === "NaN" || final.toString().length > 15){
        changeInput("Error");
        changeResult(0);
      }
      else {        
        changeResult(prev => prev+input+"="+final);
        changeInput(final);
      }      
  }  
}

const numberButton = numbers.map((value)=>{
    return (        
            <NumberButton key={value} value={value} onClick={numberInput} >
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
              <OperationButton key={"/"} value={"/"} onClick={operationInput}>/</OperationButton>
              <OperationButton key={"*"} value={"*"} onClick={operationInput}>X</OperationButton>
              <OperationButton key={"-"} value={"-"} onClick={operationInput}>-</OperationButton>
            </TopRow>
            <OneToNineWrapper>
              {numberButton}
            </OneToNineWrapper>
            <BottomRow>
              <NumberButton key={"0"} value={0} onClick={numberInput}>0</NumberButton>
              <NumberButton key={"."} value={"."} onClick={numberInput}>.</NumberButton>
            </BottomRow>
            <PlusSign key={"+"} value={"+"} onClick={operationInput}>+</PlusSign>                        
            <EqualSign key={"equal"} value={"="} onClick={calculateResult}>=</EqualSign>
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
  font-size: 1.5em;
  
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

