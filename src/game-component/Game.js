import React from 'react'

export class Game extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		// console.log("        Game - Render")
		return (
			<tr className="hand-icon game-detail">
				<td className="align-middle">
					<div>{(this.props.index+1)+(this.props.pageIndex*this.props.perPage)}</div>
				</td>
				<td>
					<div>{this.getDate(this.props.game.end_time)}</div>
					<div>{this.getTime(this.props.game.end_time)}</div>
				</td>
				<td className="align-middle">
					<div>{this.getTimeControl(this.props.game.time_control)}</div>
				</td>
				<td>
					<div>{this.trimLongName(this.props.game.white.username)}</div>
					<div>({this.props.game.white.rating})</div>
				</td>
				<td>
					<div>{this.trimLongName(this.props.game.black.username)}</div>
					<div>({this.props.game.black.rating})</div>
				</td >
				<td className="align-middle">
					<div>{this.getResult(this.props.game.white.result, this.props.game.black.result)}</div>
				</td>
			</tr>
		)
	}

	getDate = (ms) => {
		let date = new Date(+(ms.toString() + "000")).toLocaleDateString()
		return date
	}

	getTime = (ms) => {
		let time = new Date(+(ms.toString() + "000")).toLocaleTimeString()
		return time
	}

	trimLongName = (name) => {
		let trimName = name
		if (name.length > 10) {
			trimName = name.slice(0,10) + "..."
		}
		return trimName 
	}

	//TODO: figure out what inputs are
	getTimeControl = (s) => {
		let timer
		if (s === "180") {
			timer = "3 min"
		}
		return timer
	}

	//TODO: edge cases like abortion
	getResult = (white_result, black_result) => {
		let result;
		if (white_result === "win") {
			result = "1-0"
		} else if (black_result === "win") {
			result = "0-1"
		} else {
			result = "1/2-1/2"
		}
		return result
	}
}

export default Game