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
			// games: []
		}

		this.api = new ChessWebAPI({ queue: true})
	}

	componentDidMount() {
		// console.log('>> mount', this.props, this.state)
	}

	// 
	componentDidUpdate = async (prevProps, prevState) => {
		let { inputs, onError, isFetch, handleFetchOnce, extractDate, getLink, navigate } = this.props
		let { fetchPlayer, getJoinedDate, fixChessDate } = this

		let { username, startDate, endDate } = this.props.inputs
		let api = this.api

		if (isFetch !== prevProps.isFetch && isFetch) {
			handleFetchOnce(false)
			
			 ///////////
			/* FETCH */
		   ///////////

			// let res = await fetchPlayer(username)
			// if (res.statusCode === 404)
			// 	return onError(true, "404 - User doesn't Exist")

			// if (res.statusCode !== 200)
			// 	return onError(true, "Unhandled Event, likely no internet")
			
			// navigate(getLink(username, startDate, endDate, 1))
			// let player = res.body

			// let extractedJoinedDate = extractDate(fixChessDate(player.joined))

			// let extractedStartDate = extractDate(startDate)
			// let extractedToDate = extractDate(endDate)

			// console.log(extractedStartDate, extractedToDate, extractedJoinedDate)


			// this.api.dispatch(
			// 	this.api.getPlayerCompleteMonthlyArchives, 
			// 	this.fetchPlayerMonthly, 
			// 	[username, extractedToDate.year, extractedToDate.month], {},
			// 	[username, extractedToDate.year, extractedToDate.month, extractedStartDate.year, extractedStartDate.month]
			// )


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

			navigate(getLink(username, startDate, endDate, 1))

			let extractedStartDate = extractDate(startDate)
			let extractedToDate = extractDate(endDate)


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
			</div>
		)
	}






	/* fetchPlayer
		return: <promise> response
	*/
	fetchPlayer = async player => {
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

	//helper method to debug confusing async natures
	delay = ms => new Promise(resolve => setTimeout(resolve, ms))

	//fixChessDate (x) - Helper Method - Converts fetched date to <date> num
	fixChessDate = (ms) => new Date(+(ms.toString() + "000"))
}

export default ApiContent