import useInterval from "@/scripts/useInterval";
import { useEffect, useState } from "react";
const DEBUG = true;
const REFRESH_RATE = 20

export default function useEase(target: number, duration: number, precision: number = 4){
	const [currentNumber, setCurrentNumber] = useState(roundToPrecision(target, precision))
	const [delay, setDelay] = useState<null | number>(null)
	const [changeAmt, setChangeAmt] = useState(1)
	const [count, setCount] = useState(0);
	const [countTarget, setCountTarget] = useState(duration/REFRESH_RATE);
	useEffect(() => {
		const preciseTarget = roundToPrecision(target, precision)
		if(preciseTarget !== currentNumber){
			const steps = duration/REFRESH_RATE;
			const interval = roundToPrecision((preciseTarget - currentNumber)/steps, precision)
			DEBUG && console.log("starting ease", target, currentNumber, interval);
			setDelay(REFRESH_RATE);
			setChangeAmt(interval);
			setCount(0);
		}
	}, [target]);

	useEffect(() => {
		setCountTarget(duration/REFRESH_RATE);
	}, [duration])
	
	useInterval(() => {
		DEBUG && console.log("easing", target, currentNumber)

		if(count === countTarget){
			DEBUG && console.warn("easing over by count", currentNumber, target);
			setCurrentNumber(target);
			setDelay(null);
			return;
		}
		if(count > countTarget){
			DEBUG && console.warn("removing setInterval");
			setDelay(null);
			return;
		}
		setCurrentNumber(roundToPrecision(currentNumber+changeAmt, precision));
		setCount(count=> count+1)
	}, delay)
	return currentNumber
}

// function roundToPrecision(num: number, precision: number){
// 	return Math.round(num*(10^(precision-1)))/(10^(precision-1))
// }

function roundToPrecision(num : number, precision: number) {
    return (parseFloat(num.toPrecision(precision)));
}