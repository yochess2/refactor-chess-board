import React from 'react'

const TimerDetails = ({ isFlip, timer1, timer2, turn, letter }) => {
	if (!timer1 && !timer2) return
	const timer = isFlip ? timer2 : timer1
	let className = getClassName()
	return (
		<div className="timer-details-wrapper">
			<h4 className="text-end">
				<span className={className}>
					{timer && timer.slice(5, 13)}
				</span>
			</h4>
		</div>
	)
	function getClassName() {
		let className
		if (turn === letter) { className = isFlip ? "highlight-clock" : "" }
		else { className = isFlip ? "" : "highlight-clock" }
		return className
	}
}

export default React.memo(TimerDetails)