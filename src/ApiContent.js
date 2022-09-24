import React from 'react'

import ChessWebAPI from "chess-web-api"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.api = new ChessWebAPI({ queue: true})
	}
	render() {
		return (
			<div>
				loading
			</div>
		)
	}

	fetchGames = (response, error) => {
	    if (!response.body) {
	    	console.log('error', response, error)
	    	return
	    }
	    console.log('print results: ', response)

	    this.setState({ games: [...this.state.games, ...response.body.games.reverse()] }, () => {
	    	console.log('>> Fetched', this.month, this.year, this.state.games)
		    if (this.month === 1) {
		    	this.month = 12
		    	this.year-=1
		    }
		    if ((this.year <= this.joinedYear) && (this.month <= this.joinedMonth)) {
		    	return
		    }
		    if (response.body) {
		    	this.api.dispatch(this.api.getPlayerCompleteMonthlyArchives, this.fetchGames, [this.state.username, this.year, this.month-=1])
		    }
	    })

	}

	getJoinedDate = (ms) => {
		let date = new Date(+(ms.toString() + "000"))
		return date
	}
}

export default ApiContent