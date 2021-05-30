import './calculate.css';
import React, { useState, useEffect } from "react";



import Button from "./Button"
import  Menu  from "../assets/menu.png";

export const App = () => {
    const [date, setDate] = useState(new Date())
    const [value, setValue] = useState("0")
    const [prevNum, setPrevNum] = useState(null)
    const [operator, setOperator] = useState(null)

    useEffect(() => {
       setInterval(() => {
  setDate(new Date())
}, 6000);
       //return () => clearInterval(intervalID);
    },)
    const handleButtonPress = content => () => {
        if (content === ".") {
            if (value.includes('.')) return;
            setValue(value + ".")
            return;
        }
        if (content === "AC") {
            setOperator(null)
            setValue("0")
            return;
        }
        if (content === '±') {
            setValue((parseFloat(value) * -1).toString())
            setOperator(null)
            return;
        }
        if (content === '%') {
            setValue((parseFloat(value) * 0.01).toString())
            setOperator(null)
            return;
        }
        if (content === '+') {
            if (operator !== null) {
                if (operator === '+') {
                    setPrevNum((prevNum + parseFloat(value)))
                }
                else if (operator === '-') {
                    setPrevNum((prevNum - parseFloat(value)))
                }
                else if (operator === '÷') {
                    setPrevNum((prevNum / parseFloat(value)))
                }
                else if (operator === '×') {
                    setPrevNum((prevNum * parseFloat(value)))
                }
            }
            else {
                setPrevNum(parseFloat(value))
            }
            setValue("0")
            setOperator('+')
            return;
        }
        if (content === '-') {
            if (operator !== null) {
                if (operator === '+') {
                    setPrevNum((prevNum + parseFloat(value)))
                }
                else if (operator === '-') {
                    setPrevNum((prevNum - parseFloat(value)))
                }
                else if (operator === '÷') {
                    setPrevNum((prevNum / parseFloat(value)))
                }
                else if (operator === '×') {
                    setPrevNum((prevNum * parseFloat(value)))
                }
            }
            else {
                setPrevNum(parseFloat(value))
            }
            setValue("0")
            setOperator('-')
            return;
        }
        if (content === '×') {
            if (operator !== null) {
                if (operator === '+') {
                    setPrevNum((prevNum + parseFloat(value)))
                }
                else if (operator === '-') {
                    setPrevNum((prevNum - parseFloat(value)))
                }
                else if (operator === '÷') {
                    setPrevNum((prevNum / parseFloat(value)))
                }
                else if (operator === '×') {
                    setPrevNum((prevNum * parseFloat(value)))
                }
            }
            else {
                setPrevNum(parseFloat(value))
            }
            setValue("0")
            setOperator('×')
            return;
        }
        if (content === '÷') {
            if (operator !== null) {
                if (operator === '+') {
                    setPrevNum((prevNum + parseFloat(value)))
                }
                else if (operator === '-') {
                    setPrevNum((prevNum - parseFloat(value)))
                }
                else if (operator === '÷') {
                    setPrevNum((prevNum / parseFloat(value)))
                }
                else if (operator === '×') {
                    setPrevNum((prevNum * parseFloat(value)))
                }
            }
            else {
                setPrevNum(parseFloat(value))
            }
            setValue("0")
            setOperator('÷')
            return;
        }
        if (content === '=') {
            if (!operator) return;
            if (operator === '+') {
                setValue((prevNum + parseFloat(value)).toString())
            }
            else if (operator === '-') {
                setValue((prevNum - parseFloat(value)).toString())
            }
            else if (operator === '÷') {
                setValue((prevNum / parseFloat(value)).toString())
            }
            else if (operator === '×') {
                setValue((prevNum * parseFloat(value)).toString())
            }
            setPrevNum(null)
            setOperator(null)
            return
        }
        setValue(parseFloat((value) + content).toString());
    };
    return <div className="App">
        <div className="top">
        <div className="time">{`${date.getHours().toString().padStart(2, "0")} : ${date.getMinutes().toString().padStart(2, "0")}`}</div>
        <div className="menu">
            <img src={Menu} alt="menu" />
        </div>
        </div>
        <div className="display">{value}</div>
        <div className="buttons">
            <Button content="AC" onButtonClick={handleButtonPress} types="function" />
            <Button content="±" onButtonClick={handleButtonPress} types="function" />
            <Button content="%" onButtonClick={handleButtonPress} types="function" />
            <Button content="÷" onButtonClick={handleButtonPress} types="operator" />
            <Button content="7" onButtonClick={handleButtonPress} />
            <Button content="8" onButtonClick={handleButtonPress} />
            <Button content="9" onButtonClick={handleButtonPress} />
            <Button content="×" onButtonClick={handleButtonPress} types="operator" />
            <Button content="4" onButtonClick={handleButtonPress} />
            <Button content="5" onButtonClick={handleButtonPress} />
            <Button content="6" onButtonClick={handleButtonPress} />
            <Button content="-" onButtonClick={handleButtonPress} types="operator" />
            <Button content="1" onButtonClick={handleButtonPress} />
            <Button content="2" onButtonClick={handleButtonPress} />
            <Button content="3" onButtonClick={handleButtonPress} />
            <Button content="+" onButtonClick={handleButtonPress} types="operator" />
            <Button content="0" onButtonClick={handleButtonPress} />
            <Button content="." onButtonClick={handleButtonPress} />
            <Button content="=" onButtonClick={handleButtonPress} types="operator" />
        </div>
        <div className="bottom">-</div>

    </div>
}