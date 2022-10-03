import React from 'react'

class Notations extends React.Component {
	componentDidUpdate() {
		if (this.ref) this.ref.scrollIntoView()

		console.log(this.ref)
	}

	render() {
		return (
			// <div style={{ fontSize: '12px'}}>
				<table className="table table-striped table-bordered mb-0">
					<thead className="table-dark">
						<tr>
							<td>#</td>
							<td>White</td>
							<td>Black</td>
						</tr>
					</thead>
					<tbody>
						{this.formatHistory(this.props.history).map((move, index) => {
							return (
								<tr key={index} ref={(el) => {
									if (index*2+1 === this.props.ply || (index+1)*2 === this.props.ply) {
										this.ref = el
									}
								}}>
									<td>
										<span>{move[0]}</span>
									</td>
									<td className={(index)*2+1 === this.props.ply ? 'highlight-move':''}>
										<span 
											className="hand-icon"
											onClick={event => {
												this.onNotationClick(event, 'white', index)
											}}>
											{move[1]}
										</span>
									</td>
									{move[2] && 
									<td className={(index+1)*2 === this.props.ply ? 'highlight-move':''}>
										<span
											className="hand-icon"
											onClick={event => {
												this.onNotationClick(event, 'black', index)
											}}>
											{move[2]}
										</span>
									</td>}
								</tr>
							)
						})}
					</tbody>
				</table>
			// </div>
		)
	}

	//Helper method for rendering the moves
	formatHistory = (history) => {
		let formattedHistory = []
		let move;
		history.forEach((ply, index) => {
			if (index%2===0) {
				move = []
				move.push((index+2)/2)
				move.push(ply)
			} else {
				move.push(ply)
				formattedHistory.push(move)
			}
		})
		if (move && move.length === 2) {
			formattedHistory.push(move)
		}
		return formattedHistory
	}

	//When user clicks on a move, handleMoveClick is invoked,
	//It resets the game and board to that point in time
	//Notation is not affected
	//Returns: Nothing
	onNotationClick = (event, color, index) => {
		let moveNum = color === 'white' ? index*2 : index*2+1
		this.props.onMoveClick(moveNum)
	}
}

export default Notations