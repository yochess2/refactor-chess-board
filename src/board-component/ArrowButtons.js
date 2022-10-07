import React, { useState, useEffect, useCallback, useRef } from 'react'
import { 
	FaAngleLeft,
	FaAngleRight,
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaArrowsAltV,
} from "react-icons/fa"

const styles = {
	defaultDoubleArrowStyle: { 
		backgroundColor: "#8FBC8F", 
		borderStyle: "ridge" 
	},
	switchArrowStyle: { 
		backgroundColor: "lightblue", 
		borderStyle: "ridge" 
	},
}
const setStyles = {
	defaultArrowStyle:{ 
		backgroundColor: "lightgray", 
		borderStyle: "ridge" 
	},
	clickedArrowStyle:	{ 
		backgroundColor: "rgb(254 226 226)", 
		borderStyle: "ridge" 
	},
}

const ArrowButtons = ({ handleDoubleRightClick, handleLeftClick, handleRightClick, handleDoubleLeftClick, toggleBoard }) => {
	const [leftArrowStyle, setLeftArrowStyle] = useState(setStyles.defaultArrowStyle)
	const [rightArrowStyle, setRightArrowStyle] = useState(setStyles.defaultArrowStyle)
	
	const timeRef = useRef([])
	const counterRef = useRef(0)

	const handleKeyMemo = useCallback(event => {
		if (event.key === "ArrowRight") {
			if(handleRightClick()) setRightArrowStyle(setStyles.clickedArrowStyle)
		} else if (event.key === "ArrowLeft") {
			if (handleLeftClick()) setLeftArrowStyle(setStyles.clickedArrowStyle)	
		} else if (event.key === "ArrowUp") {
			Array.from({length:2}).map(() => handleLeftClick())
		} else if (event.key === "ArrowDown") {
			Array.from({length:2}).map(() => handleRightClick())
		} else {
			return
		}
	}, [handleRightClick, handleLeftClick])

	useEffect(() => {
		window.addEventListener("keydown", handleKeyMemo)
		return () => {
	        window.removeEventListener("keydown", handleKeyMemo);
	    }
	}, [handleKeyMemo])

	useEffect(() => {
		if (rightArrowStyle.backgroundColor !== setStyles.clickedArrowStyle.backgroundColor) return
		const counter = counterRef.current
		const timer = setTimeout(() => cacheAndSetArrowStyle(setRightArrowStyle, counter), 100)
		timeRef.current[counterRef.current++] = timer
	}, [rightArrowStyle])

	useEffect(() => {
		if (leftArrowStyle.backgroundColor !== setStyles.clickedArrowStyle.backgroundColor) return
		const counter = counterRef.current
		const timer = setTimeout(() => cacheAndSetArrowStyle(setLeftArrowStyle, counter), 100)
		timeRef.current[counterRef.current++] = timer
	}, [leftArrowStyle])

	useEffect(() => {
		return () => {
			// eslint-disable-next-line
			timeRef.current.filter(timer => timer).forEach(timer => clearTimeout(timer))
		}
	}, [])

	return (
		<div className="row">
			<div className="col-1"></div>
			<div className="col-2 hand-icon text-center double-left-arrow-wrapper" style={styles.defaultDoubleArrowStyle} onClick={handleDoubleLeftClick}>
				<FaAngleDoubleLeft className="double-left-arrow" />
			</div>
			<div className="col-2 hand-icon text-center left-arrow-wrapper" style={leftArrowStyle} onClick={handleLeftClick}>
				<FaAngleLeft className="left-arrow" />
			</div>
			<div className="col-2 hand-icon text-center right-arrow-wrapper" style={rightArrowStyle} onClick={handleRightClick}>
				<FaAngleRight className="double-right-arrow" />
			</div>
			<div className="col-2 hand-icon text-center double-right-arrow-wrapper" style={styles.defaultDoubleArrowStyle} onClick={handleDoubleRightClick}>
				<FaAngleDoubleRight className="right-arrow" />
			</div>
			<div className="col-2 hand-icon text-center switch-side-arrow-wrapper" style={styles.switchArrowStyle} onClick={toggleBoard}>
				<FaArrowsAltV className="switch-side-arrow" />
			</div>
			<div className="col-1"></div>
		</div>
	)

	function cacheAndSetArrowStyle(setArrowStyle, counter) {
		timeRef.current[counter] = null
		setArrowStyle(setStyles.defaultArrowStyle)
	}
}

export default React.memo(ArrowButtons)