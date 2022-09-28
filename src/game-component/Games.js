import React from 'react'

import Game from "./Game"

export class Games extends React.Component {
	render() {
		return (
			<table className="table table-hover table-striped">
				<thead className="table-dark">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Date</th>
						<th scope="col">Time</th>
						<th scope="col">White</th>
						<th scope="col">Black</th>
						<th scope="col">Result</th>
					</tr>
				</thead>
				<tbody>
				{this.props.paginatedGames.map((game, index) => 
					<Game
						id={game.uuid}
						key={game.uuid}
						game={game}
						index={index}
						pageIndex={this.props.pageIndex}
						perPage={this.props.perPage}
						getGame={this.props.getGame}
					/>
				)}
				</tbody>
				<caption>
					{this.formatCaption(
						this.props.pageIndex, 
						this.props.perPage, 
						this.props.paginatedGames.length, 
						this.props.gamesLength
					)}
				</caption>
			</table>
		)
	}

	formatCaption = (pageIndex, perPage, paginatedGamesLength, gamesLength) => {
		if (gamesLength === 0) return null
		let startNum = pageIndex*perPage+1
		let endNum = paginatedGamesLength+pageIndex*perPage
		return 	`Displaying ${startNum} to ${endNum} of ${gamesLength} games`
	}
}

export default Games