import React from 'react'

import ChessWebAPI from "chess-web-api"
import PulseLoader from "react-spinners/PulseLoader"
import { FaStopCircle } from "react-icons/fa"

// import { drakesGames } from "./games/samples"

export class ApiContent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			count: 0,
			displayMonth: null,
			displayYear: null,
			games: [],
			// isDisplay: false,
			loading: false,
			spinner: true,
		}
		this.api = new ChessWebAPI({ queue: true})
		this.stop = false
	}

	// dont forget to toggle back isFetch, so search bar displays
	componentDidUpdate = async (prevProps, prevState) => {
		let { isFetch, onError, getLink, navigate, location } = this.props
		let { username, startDate, endDate } = this.props.inputs
		let { loading } = this.state


		// if search is invoked, go fetch player and the player's games
		if (isFetch !== prevProps.isFetch && isFetch) {
			let res = await this.fetchPlayerData(username)
			let player = this.getPlayer(res)
			if (!player) { return onError(true, res, null, false) } 

			// if player is found, reset API and then go look for games
			this.setApi(0, null, null, [], false, false, () => { 	// reset API state
				this.fetchAndProcessGames(startDate, endDate, player, username)
			})
		}

		// if game is found then loading is set to true, navigate to game link
		if (loading !== prevState.loading && loading) {
			this.props.flipPage(0, () => {
				if (location.pathname.slice(1,6) !== "games")
					navigate(getLink(username, startDate, endDate, 1))		// navigate to page 1
			})
		}

		// after clicking stop and setting to true, this.stop gets toggled right back to false
		if (!loading && this.stop === true) {
			this.stop = false
		}
	}

	// this rendering really needs design work!
	render() {
		let { displayMonth, displayYear, spinner, count, loading } = this.state

		return (
			<div className="mt-md-5 mt-2 text-start">
				{/*Display fetching */}
				<div className="row">
					<div className="col-6">
						<h6> 
							<FaStopCircle type="button" onClick={this.stopBtn} />
							<span> .</span>
							<span>{spinner ? "/" : "\\"}</span>
							<span>.</span>
							<span>{spinner ? "\\" : "/"}</span>
							<span>.</span>
							<span>{spinner ? "/" : "\\"}</span>
							<span>.</span>
						</h6>
					</div>
					<div className="col-6">
						<h6>{displayMonth} {displayYear}</h6>
					</div>
					<div className="col-6">					
						<h6>
							{loading ? 
							<span>Fetching </span> 	:
							<span>Fetched </span>	}
							({count} Games)
						</h6>
					</div>
					<div className="col-6">					
						<PulseLoader />
					</div>
				</div>



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

	// 2. processFetchGames (x) - gets the necessary params before invoking fetchAndSetGames
	fetchAndProcessGames = (startDate, endDate, player, username) => {

		let dates = this.getDates(startDate, endDate, player, this.props.extractDate)

		// Used to fetch games
		this.joinedMonth = dates.joinedDate.month
		this.joinedYear = dates.joinedDate.year

		this.api.dispatch(
			this.api.getPlayerCompleteMonthlyArchives, 
			this.fetchAndSetGames, 
			[username, dates.endDate.year, dates.endDate.month], {},
			[username, dates.endDate.year, dates.endDate.month, dates.startDate.year, dates.startDate.month]
		)
	}

	// 3. stopBtn (x) -purpose: Stops fetching, in case of recursion issues or overflow or lag
	stopBtn = async (e) => 
	{
		this.stop = true
		console.log(this.stop)
	}

	// 4. fetchAndSetGames (x) - refer to https://www.npmjs.com/package/chess-web-api
	fetchAndSetGames = (response, error, username, endYear, endMonth, startYear, startMonth) => {
		// January is tricky, because it gets set back to December
	    if 	(((endYear <= startYear) && (endMonth < startMonth)) || 
	    	((endYear <= this.joinedYear) && (endMonth < this.joinedMonth)) ||
	    	((endYear < startYear)) || (this.stop)) {
	    	return this.setState({
	    		loading: false,
	    	}, () => {
	    		this.props.isFetching(false)
	    		console.log('API: BASE CASE', this.state)
	    	})
	    }
		if (error || !response || !response.body) {
			return this.setState({
				loading: false,
			}, () => { this.props.onError(true, error, null, false) })
		}
		// Logics start here: setting games to parent component
		this.props.setGames(response.body.games, (gamesLength) => {
			let jsonObj = {
				id: this.state.games.length+1,
				month: `${endMonth}`,
				year: `${endYear}`,
				games: response.body.games 
			}
			// setting games to this component
			let count = this.state.count + response.body.games.length
			let month = this.toMonthName(endMonth)
			let games = [...this.state.games, jsonObj]
			let loading = gamesLength > 0
			let spinner = !this.state.spinner
			this.setApi(count ,month, endYear, games, loading, spinner, () => {
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
			    	this.fetchAndSetGames, 
			    	[username, endYear, endMonth], {},
			    	[username, endYear, endMonth, startYear, startMonth]
			    )
			})
		})
	}



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
	getDates = (startDate, endDate, joinedDate, extractDate) => ({
			joinedDate: extractDate(this.fixChessDate(joinedDate.joined)),
			startDate: extractDate(startDate),
			endDate: extractDate(endDate)
	})

	// setApi (x) - Helper Method
	setApi = (count, displayMonth, displayYear, games, loading, spinner, cb) => {
		this.setState({ count, displayMonth, displayYear, games, loading, spinner}, () => {
			cb()
		})
	}

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