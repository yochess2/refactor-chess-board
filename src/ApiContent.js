import React from 'react'

import ChessWebAPI from "chess-web-api"
import PulseLoader from "react-spinners/PulseLoader"
import { FaStopCircle } from "react-icons/fa"

import { tiger415 } from "./games/tiger415"
import { games } from "./games/games"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isDisplay: false,
			displayMonth: null,
			displayYear: null,
			loading: false,
			spinner: true,
			games: [],
			count: 0,
		}

		this.api = new ChessWebAPI({ queue: true})
		this.stop = false
	}


	// dont forget to toggle isFetch, so search bar displays
	componentDidUpdate = async (prevProps, prevState) => {
		let { inputs, isFetch, onError, extractDate, getLink, navigate, setGames } = this.props
		let { fetchPlayerData, getJoinedDate, fixChessDate, getPlayer, getDates } = this
		let { username, startDate, endDate } = this.props.inputs

		if (isFetch !== prevProps.isFetch && isFetch) {
			let res = await fetchPlayerData(username)
			let player = getPlayer(res)
			if (!player) return onError(true, res, null, false)

			//reset state
			this.setState({
				isDisplay: false,
				displayMonth: null,
				displayYear: null,
				loading: false,
				spinner: true,
				games: [],
				count: 0,
			}, () => {
				navigate(getLink(username, startDate, endDate, 1))
				let dates = getDates(inputs, player, extractDate)

				this.joinedMonth = dates.joinedDate.month
				this.joinedYear = dates.joinedDate.year

				this.api.dispatch(
					this.api.getPlayerCompleteMonthlyArchives, 
					this.fetchPlayerMonthly, 
					[username, dates.endDate.year, dates.endDate.month], {},
					[username, dates.endDate.year, dates.endDate.month, dates.startDate.year, dates.startDate.month]
				)				
			})
		}
	}

	//refer to https://www.npmjs.com/package/chess-web-api#----dispatchmethod-callback-parameters-options-callbackparameters-priority
	fetchPlayerMonthly = (response, error, username, endYear, endMonth, startYear, startMonth) => {
		// January is tricky, because it gets set back to December
	    if 	(((endYear <= startYear) && (endMonth < startMonth)) || 
	    	((endYear <= this.joinedYear) && (endMonth < this.joinedMonth)) ||
	    	((endYear < startYear)) || (this.stop)) {

	    	return this.setState({
	    		loading: false,
	    		displayMonth: null,
	    		displayYear: null,
	    		isDisplay: false,
	    		count: 0,
	    	}, () => {
	    		this.props.handleFetchOnce(false)
	    		console.log('API: BASE CASE', this.state)
	    	})
	    }
		if (error || !response || !response.body) {
			return this.setState({
				loading: false,
				displayMonth: null,
				displayYear: null,
				isDisplay: false,
				count: 0,
			}, () => {
				this.props.onError(true, error, null, false)
			})
		}
		console.log('API: SUCCESS: response is working, my games', response)

		// Logics start here: setting games to parent component
		this.props.setGames(response.body.games, (val) => {
			let jsonObj = {
				id: this.state.games.length+1,
				month: `${endMonth}`,
				year: `${endYear}`,
				games: response.body.games 
			}

			// setting games to this component
			this.setState({
				loading: true,
				displayMonth: this.toMonthName(endMonth),
				displayYear: endYear,
				spinner: !this.state.spinner,
				isDisplay: true,
				games: [...this.state.games, jsonObj],
				count: this.state.count + response.body.games.length, // stackoverflow says it works
			}, () => {
			    // Going backwards one month
			    if (endMonth === 1) {
			    	endMonth = 12
			    	endYear-= 1
			    } else {
			    	endMonth -=1
			    }
			    // recursive call
			    this.api.dispatch(
			    	this.api.getPlayerCompleteMonthlyArchives, 
			    	this.fetchPlayerMonthly, 
			    	[username, endYear, endMonth], {},
			    	[username, endYear, endMonth, startYear, startMonth]
			    )
			})
		})
	}

	render() {
		let { isDisplay, displayMonth, displayYear, spinner } = this.state

		return (
			<div>

				{/*Display fetching */}
				{this.state.isDisplay ? 
				<h4>
					<span><FaStopCircle onClick={this.stopBtn} /></span>
					<span>Fetched ({this.state.count} Games)</span>
					<span><PulseLoader /></span>
					<span>{this.state.displayMonth}</span>
					<span>.</span>
					<span>{this.state.spinner ? "\\" : "\/"}</span>
					<span>.</span>
					<span>{this.state.displayYear}</span>
				</h4>
				: ''}
				{/*End Display */}
			</div>
		)
	}






	/* 1. fetchPlayerData (x)
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

	// 2. stopBtn (x) -purpose: Stops fetching, in case of recursion issues or overflow or lag
	stopBtn = (e) => this.stop = true



	  ////////////////////
	 /* Helper Methods */
	////////////////////


	// fixChessDate (x) - Helper Method - Converts fetched date to <date> num
	fixChessDate = (ms) => new Date(+(ms.toString() + "000"))

	/* getPlayer (x) - Helper Method
		params: 	<json> response
		returns: 	<obj> chess.com player data

		TODO:	take a look at various situations
	*/
	getPlayer = (res) => {
		if (res.statusCode === 404) {
			console.log('>>>>>>', res)
			return this.props.onError(true, res, null, false)
		}
		if (res.statusCode !== 200) {
			console.log('>>>>>>', res)
			return this.props.onError(true, res, null, false)
		}
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

	// toMonthName (x) - https://bobbyhadz.com/blog/javascript-convert-month-number-to-name
	toMonthName(monthNumber) {
		let date = new Date()
		date.setMonth(monthNumber -1)

		return date.toLocaleString([], {
			month: 'short',
		})
	}

	  ////////////////////////
	 /* Additional Methods */
	/*  Used for Testing  */
   ////////////////////////


	// delay (x) - helper method to debug confusing async natures
	delay = ms => new Promise(resolve => setTimeout(resolve, ms))

	// printResult (x) - Helper Method - Used for testing purposes, pass into dispatch for test
	printResult = (response, error, username, endYear, endMonth) => {
		if (!response.body) return
		if (!response.body.games) return
		console.log(response)
	}
}

export default ApiContent