import React from 'react'

import ChessWebAPI from "chess-web-api"

import { drakesGames } from "./game-component/samples"
import { bbb } from "./game-component/bbb"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			error: false,
			errorMessage: null,
			games: []
		}

		this.api = new ChessWebAPI({ queue: true})
	}

	componentDidMount() {
		// console.log('>> mount', this.props, this.state)
	}

	componentDidUpdate = async (prevProps, prevState) => {

		//fetch
		if (this.props.isFetch !== prevProps.isFetch) {
			let { 
				username, 
				fromDate, 
				toDate, 
				isFetch, 
				handleFetchOnce,
				getLink,
				extractDate, 
				navigate } = this.props
			let api = this.api

			if (isFetch) {
				handleFetchOnce(false)
				console.log('1. Fetching Player', username)

				// let res = await this.fetchPlayer(username)
				// if (res.statusCode === 404) {
				// 	this.setState({error: true, errorMessage: "User does not exist" })
				// 	return
				// }
				// if (res.statusCode !== 200) {
				// 	console.log("Unhandled event: ", res)
				// 	this.setState({ error: true, errorMessage: "Unhandled event" })
				// 	return
				// }
				
				// this.setState({ error: false, errorMessage: ""})
				// navigate(getLink(username, fromDate, toDate, 1))

				// let player = res.body
				// let joinedDate = this.getJoinedDate(player.joined)
				// let extractedJoinedDate = extractDate(joinedDate.date)

				// let extractedStartDate = extractDate(fromDate)
				// let extractedToDate = extractDate(toDate)


				// this.api.dispatch(
				// 	this.api.getPlayerCompleteMonthlyArchives, 
				// 	this.fetchPlayerMonthly, 
				// 	[username, extractedToDate.year, extractedToDate.month], {},
				// 	[username, extractedToDate.year, extractedToDate.month, extractedStartDate.year, extractedStartDate.month]
				// )

				let games = []
				if (username === "bigbadbabar") {
					games = bbb.reverse()
				}
				if (username === "tiger415") {
					games = drakesGames
				}

				this.setState({ error: false, errorMessage: ""})
				navigate(getLink(this.props.username, fromDate, toDate, 1))

				let extractedStartDate = extractDate(fromDate)
				let extractedToDate = extractDate(toDate)
				this.props.setGames(games)

			}
		}
	}

	//refer to https://www.npmjs.com/package/chess-web-api#----dispatchmethod-callback-parameters-options-callbackparameters-priority
	fetchPlayerMonthly = (response, error, username, endYear, endMonth, startYear, startMonth) => {
		if (!response.body) {
			console.log('>> response is not working', error)
			return
		}
		console.log('>> response is working', response.body.games)
		console.log(endYear, endMonth, startYear, startMonth)

	    if (response.body.games) {
			this.props.setGames(response.body.games, (val) => {
				console.log('trigger callback', val)
			    if ((endYear <= startYear) && (endMonth <= startMonth)) {
			    	return
			    }	    
			    if (endMonth === 1) {
			    	endMonth = 12
			    	endYear-= 1
			    } else {
			    	endMonth -=1
			    }
			    this.api.dispatch(
			    	this.api.getPlayerCompleteMonthlyArchives, 
			    	this.fetchPlayerMonthly, 
			    	[username, endYear, endMonth], {},
			    	[username, endYear, endMonth, startYear, startMonth]
			    )
			})
		}
	}

	render() {
		return (
			<div style={{border: "solid"}}>
				API CONTENT

			    {/* Error Message */}
				{this.state.error && 
				<div className="alert alert-danger" role="alert" >
					{this.state.errorMessage}
				</div>}
				{/* Error Message */}

			</div>
		)
	}

	//Fetch user from the database
	fetchPlayer = async player => {
		let response 
		try {
			response = await this.api.getPlayer(player)
		} catch (err) {
			response = err
		}
		return response
	}

	//input: int num passed as a number, probably ms from chess.com
	//returns joinedDate as { date, month, year}
	getJoinedDate = (ms) => {
		let joined = {}
		joined.date = new Date(+(ms.toString() + "000")) 
		joined.month = parseInt(joined.date.toLocaleString('default', { month: 'numeric' }))
		joined.year = parseInt(joined.date.toLocaleString('default', { year: 'numeric' }))
		return joined
	}

	//helper method to debug confusing async natures
	delay = ms => new Promise(resolve => setTimeout(resolve, ms)) 
}

export default ApiContent