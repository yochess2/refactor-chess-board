import React from 'react'

import Game from "./Game"

export class Games extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<>
			<table className="table table-hover table-striped">
				<thead className="table-dark">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Date</th>
						<th scope="col">Time</th>
						<th scope="col">Clock</th>
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
					/>
				)}
				</tbody>
				<caption>
					Displaying 
					{' '+( this.props.pageIndex * this.props.perPage + 1 )+' '} 
					to 
					{' '+( this.props.paginatedGames.length + ( this.props.pageIndex * this.props.perPage ) )+' '}
					of 
					{' '+this.props.gamesLength} games
				</caption>
			</table>
			</>
		)
	}
}

export default Games