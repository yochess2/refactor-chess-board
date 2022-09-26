import React from 'react'

import ChessWebAPI from "chess-web-api"

import { games } from "./games/games"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isDisplay: false,
			displayMonth: null,
			displayYear: null,
			spinner1: "/",
			games: [],
		}

		this.api = new ChessWebAPI({ queue: true})
	}

	componentDidMount() {
		// console.log('>> mount', this.props, this.state)
	}

	// 
	componentDidUpdate = async (prevProps, prevState) => {
		let { inputs, onError, isFetch, handleFetchOnce, extractDate, getLink, navigate, setGames } = this.props
		let { fetchPlayerData, getJoinedDate, fixChessDate, getPlayer, getDates } = this
		let { username, startDate, endDate } = this.props.inputs

		if (isFetch !== prevProps.isFetch && isFetch) {
			handleFetchOnce(false)
			let res = await fetchPlayerData(username)
			let player = getPlayer(res, onError)
			if (!player) return

			navigate(getLink(username, startDate, endDate, 1))
			let dates = getDates(inputs, player, extractDate)

			// this.api.dispatch(
			// 	this.api.getPlayerCompleteMonthlyArchives, 
			// 	this.fetchPlayerMonthly, 
			// 	[username, dates.endDate.year, dates.endDate.month], {},
			// 	[username, dates.endDate.year, dates.endDate.month, dates.startDate.year, dates.startDate.month]
			// )


			 /////////////
			/* TESTING */
		   /////////////
			if (username === "tiger415") {			
				this.setState({isDisplay: true})
				await fetch("http://localhost:8000/allgames/1/").then(res => res.json()).then((json) => {
					console.log("9. ", json)
					this.setState({
						displayMonth: 9,
						displayYear: 2022,
						spinner: "\\",
					}, () => {
						console.log('am i first?')
						setGames(json.games, () => {
							console.log('1. am i logged now')
						})
					})
					return this.delay(3000)

				}).then(() => {
					console.log('or am i second?')
					return fetch("http://localhost:8000/allgames/2/")
				}).then((res) => res.json()).then((json) => {
					console.log("8. ", json)
					this.setState({
						displayMonth: 8,
						displayYear: 2022,
						spinner: "/",
					}, () => {
						setGames(json.games, () => {
							console.log('2. am i logged now')
						})
					})
					console.log('2. or am i second?')
					return this.delay(3000)
				}).then(() => {
					return fetch("http://localhost:8000/allgames/3/")
				}).then((res) => res.json()).then((json) => {
					console.log("7. ", json)
					this.setState({
						displayMonth: 7,
						displayYear: 2022,
						spinner: "\\",
					}, () => {
						setGames(json.games, () => {
							console.log('1. am i logged now')
						})
					})
					console.log('3. or am i second?')
					return this.delay(3000)
				})
				console.log('done')
				this.setState({isDisplay: false})
						


					
			}

		}
	}

	//refer to https://www.npmjs.com/package/chess-web-api#----dispatchmethod-callback-parameters-options-callbackparameters-priority
	fetchPlayerMonthly = (response, error, username, endYear, endMonth, startYear, startMonth) => {
		if (!response.body)
			return console.log('>> response is not working', error)

		console.log('>> response is working, my games', this.state.games)
		console.log(endYear, endMonth, startYear, startMonth)

	    // if (response.body.games) {
			// this.props.setGames(response.body.games, (val) => {
				console.log('trigger callback')

				let jsonObj = {
						id: this.state.games.length+1,
						month: `${endMonth}`,
						year: `${endYear}`,
						games: response.body.games 
				}

				this.setState({ 
					games:  [...this.state.games, jsonObj]

				})
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
		let { isDisplay, displayMonth, displayYear, spinner } = this.state

		return (
			<div style={{border: "solid"}}>
				API CONTENT
				{/*Display fetching */}
				{!this.state.isDisplay ? '' :
				<h4>
					<span>Fetching</span>
					<span> ..</span>
					<span>{displayMonth}.</span>
					<span>..{spinner}..</span>
					<span>{displayYear}</span>
				</h4>
				}{/*End Display */}
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