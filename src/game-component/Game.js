import React from 'react'

export class Game extends React.Component {
	render() {
		return (
			<tr 
				className="hand-icon game-detail"
				onClick={(event) => { this.onGameClick(event, this.props.index) }}
			>
				<td className="align-middle">
					<div>{this.getGameNum(this.props.index, this.props.pageIndex, this.props.perPage)}</div>
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

	onGameClick = (event, index) => {
		this.props.getGame(this.props.game, index)
	}

	getGameNum = (index, pageIndex, perPage) => {
		return (index+1) + (pageIndex*perPage)
	}

	trimLongName = (name) => {
		let trimName = name
		if (name.length > 10) {
			trimName = name.slice(0,10) + "..."
		}
		return trimName 
	}

	getDate = (ms) => {
		let date = new Date(+(ms.toString() + "000")).toLocaleDateString()
		return date
	}

	getTime = (ms) => {
		let time = new Date(+(ms.toString() + "000")).toLocaleTimeString()
		return time
	}

	//TODO: figure out what inputs are
	getTimeControl = (s) => {
		let type = s
		if (s === "60") {
			type = "1 min"
		} else if (s === "180") {
			type = "3 min"
		} else if (s === "300") {
			type = "5 min"
		} else if (s === "600") {
			type = "10 min"
		} else if (s === "900") {
			type = "15 min"
		} else if (s === "1800") {
			type = "30 min"
		} else if (s === "2700") {
			type = "45 min"
		} else if (s === "3600") {
			type = "60 min"
		} else if (s === "1/259200") {
			type = "Slow"
		}
		return type
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