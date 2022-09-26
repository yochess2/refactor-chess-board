import React from 'react'

import ChessWebAPI from "chess-web-api"

import { drakesGames } from "./game-component/samples"
import { bbb } from "./game-component/bbb"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			// error: false,
			// errorMessage: null,
			games: []
		}

		this.api = new ChessWebAPI({ queue: true})
	}

	componentDidMount() {
		// console.log('>> mount', this.props, this.state)
	}

	// 
	componentDidUpdate = async (prevProps, prevState) => {
		let { inputs, onError, isFetch, handleFetchOnce, extractDate, getLink, navigate } = this.props
		let { fetchPlayerData, getJoinedDate, fixChessDate, getPlayer, getDates } = this

		let { username, startDate, endDate } = this.props.inputs

		if (isFetch !== prevProps.isFetch && isFetch) {
			handleFetchOnce(false)
			let res = await fetchPlayerData(username)
			let player = getPlayer(res, onError)
			if (!player) return

			navigate(getLink(username, startDate, endDate, 1))
			let dates = getDates(inputs, player, extractDate)

			this.api.dispatch(
				this.api.getPlayerCompleteMonthlyArchives, 
				this.fetchPlayerMonthly, 
				[username, dates.endDate.year, dates.endDate.month], {},
				[username, dates.endDate.year, dates.endDate.month, dates.startDate.year, dates.startDate.month]
			)


			 /////////////
			/* TESTING */
		   /////////////


			// let games = []
			// if (username === "bigbadbabar") {
			// 	// games = bbb.reverse()
			// }
			// if (username === "tiger415") {
			// 	// if games = drakesGames
			// }

			// navigate(getLink(username, startDate, endDate, 1))

			// let extractedStartDate = extractDate(startDate)
			// let extractedToDate = extractDate(endDate)


			// this.props.setGames(games, (val) => {
				// let a = this.props
				// console.log('2. back to api', val)
			// })

		}
	}

	//refer to https://www.npmjs.com/package/chess-web-api#----dispatchmethod-callback-parameters-options-callbackparameters-priority
	fetchPlayerMonthly = (response, error, username, endYear, endMonth, startYear, startMonth) => {
		if (!response.body) {
			console.log('>> response is not working', error)
			return
		}
		console.log('>> response is working', this.state.games)
		console.log(endYear, endMonth, startYear, startMonth)

	    // if (response.body.games) {
			// this.props.setGames(response.body.games, (val) => {
				console.log('trigger callback')
				this.setState({games: [...this.state.games, response.body.games]})
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
			// })
		// }
	}

	render() {
		return (
			<div style={{border: "solid"}}>
				API CONTENT
			</div>
		)
	}






	/* 1. fetchPlayerData
		return: <promise> response
	*/
	fetchPlayerData = async player => {
		let response 
		try {
			response = await this.api.getPlayer(player)
		} catch (err) {
			response = err
		}
		return response
	}



	  ////////////////////
	 /* Helper Methods */
	////////////////////

	// helper method to debug confusing async natures
	delay = ms => new Promise(resolve => setTimeout(resolve, ms))

	// fixChessDate (x) - Helper Method - Converts fetched date to <date> num
	fixChessDate = (ms) => new Date(+(ms.toString() + "000"))

	/* getPlayer - Helper Method
		params: 	<json> response
		returns: 	<obj> chess.com player data
	*/
	getPlayer = (res, onError) => {
		if (res.statusCode === 404)
			return onError(true, "404 - User doesn't Exist")
		if (res.statusCode !== 200)
			return onError(true, "Unhandled Event, likely no internet")
		return res.body
	}

	/* 
		getDates - Helper Method
		params: 	<obj> inputs (<str> username, <date> startDate, <date> endDate)
					<date> joinedDate from chess.com
					<func> extractDate
		returns: 	<obj> { <obj> startDate, <obj> endDate, <obj> joinedDate }
						each formatted like { month: <int> MM, <int> year: YYYY, <monthYear> "Month-YYYY"}
	*/
	getDates = (inputs, joinedDate, extractDate) => ({
			joinedDate: extractDate(this.fixChessDate(joinedDate.joined)),
			startDate: extractDate(inputs.startDate),
			endDate: extractDate(inputs.endDate)
	})	
}

export default ApiContent