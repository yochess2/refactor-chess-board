import "./index.css"
import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"
import ChessWebAPI from "chess-web-api"

import { withRouter } from "./utilities/withRouter"

import Home from "./Home"
import ErrorMessage from "./ErrorMessage"

import Navbar from "./bar-component/Navbar"
import Searchbar from "./bar-component/Searchbar"
import Sidebar from "./bar-component/Sidebar"

import ApiContent from "./ApiContent"
import GamesWrapper from "./game-component/GamesWrapper"

import BoardWrapper from "./board-component/BoardWrapper"


export class App extends React.Component {
	constructor(props) {
		super(props) // navigate() and location passed down as props

		this.state = {
			error: {
				value: false,
				message: "",
			},
			inputs: {
				username: null,
				startDate: null,
				endDate: null,
			},

			isFetch: false,
			pageIndex: 0,
			games: [],


			chess: new Chess(),
			gameNum: null, //for use on saving game index num,


		}
	}

	componentDidUpdate(prevProps, prevState) {
		console.log(this.state)
		this.clearErrorOnPathChange(prevProps.location.pathname)
	}

	// If path changes then set error to false
	clearErrorOnPathChange = (prevLocation) => {
		if (prevLocation !== this.props.location.pathname) 
			if (this.state.error.value) this.onError(false, "")
	}

	render() {
		let props = this.props
		let { location, navigate } = this.props
		let { username, startDate, endDate, games, isFetch, error, inputs, pageIndex } = this.state
		let { handleUserSearch, onError, isFetching, extractDate, getLink, setPageChange, setGames } = this

		return (<>
		{/* Navbar (x)
			Minor Fix: annoying bug with react router and active on index page fixed
			with a conditional statement on if location === "/" 
		*/}
			<Navbar location={location} />
		{/* End Navbar */}


			<div className="container">
				<div className="row">


					{/* Sidebar ( )
						purpose: 	Allows user to navigate between links
						props:	 	<router><obj> location
						
						features:	- Collapse bar 
									- dynamic highlighted links
									- responsive 
						
						TODO: 		- Needs styling
									- FaBar not showing on mobile
						
					*/}
					<div className="col-md-3">
						<Sidebar location={location} />
					</div>
					{/* End Sidebar */}


					<div className="col-md-9">


						{/* Err (x)
							purpose:	Displays error messages
							props:		<state><obj> Error
						*/}
				    	<ErrorMessage error={error} />
						{/* End Err */}


						{/* Searchbar (x)
							purpose:	To allow user to search for a username by month.
							props:		<func> handleUserSearch
										<func> onError
										<state><bool><isFetch>
							effects:	- Search input for username, start date, and end date
										- Error handling, decides if search is valid or invalid
										- Hides while API is fetching


					    	MVP Searchbar is done, lots of room for add-on features.
							Potential ideas are
								1. search history (localstorage)
								2. search suggestion (fetch or localstorage)
						 */}
						{!isFetch &&
				    	<Searchbar 
				    		handleUserSearch={handleUserSearch} 
				    		onError={onError} 
				    		inputs={inputs} 
				    	/>
					    }{/* End Searchbar */}


		    		    {/* API Content (  ) basically done, just using mock data for now

		    		    	purpose:	To fetch from chess.com API
		    		    	props:		<state><bool> isFetch - Only runs if set to true
										<state><obj> inputs
										<func> onError
										<func> isFetching 
										<func> getLink
										<func> navigate
										<func> setGames
		    		    */}
		    	    	<ApiContent 
			    	    	isFetch={isFetch}
			    	    	inputs={inputs}
		    	    		onError={onError}
			    	    	isFetching={isFetching}
			    	    	setPageChange={setPageChange}

			    	    	extractDate={extractDate}
			    	    	getLink={getLink}
							navigate={navigate}
			    	    	setGames={setGames} />
		    		    {/* End API Content */}


					    {/* Main Content */}
						<div className="table-responsive-md mt-2">
							<Routes>
								<Route 
									path="/"
									element={<></>} />
								<Route 
									path="home"
									element={<Home />} />
								<Route 
									path="games"
									element={<GamesWrapper
										games={games}
										inputs={inputs}
										isFetch={isFetch}
										pageIndex={pageIndex}
										getLink={this.getLink}
										setPageChange={this.setPageChange}


										extractDate={this.extractDate}
										{...props} />} />
								<Route 
									path="games/:username/"
									element={<GamesWrapper
										games={games}
										inputs={inputs}
										isFetch={isFetch}
										pageIndex={pageIndex}
										getLink={this.getLink}
										setPageChange={this.setPageChange}


										extractDate={this.extractDate}
										{...props} />} />
								<Route 
									path="games/:username/:fromDate/:toDate/:id"
									element={<GamesWrapper
										games={games}
										inputs={inputs}
										isFetch={isFetch}
										pageIndex={pageIndex}
										getLink={this.getLink}
										setPageChange={this.setPageChange}


										extractDate={this.extractDate}
										{...props} />} />

								<Route 
									path="board"
									element={<BoardWrapper chess={this.state.chess}/>} />
							</Routes>
						</div>
						{/* End Main Content */}


					</div>
				</div>
			</div>
	</>)
	}


	/* 1. OnError (x)
		invoker:	Searchbar - Search Button
					ApiContent - Error
					App - ComponentWillUpdate(prevPath, currentPath)
		invokee:	Err Component - updateState (error)
		params:		<bool> value
					<str> message
					[optional] <function> cb
					[optional] <bool> isFetch
		effect:		Toggles Error Message
		returns:	undefined

		TODO: 	- maybe move to err (parent class?) Component`
				- various edge cases of message/error objects from fetch requests
	*/
	onError = (value, message, cb, isFetch) => {
		if (!isFetch) {
			this.setState({ isFetch: false })
		}

		if (!value && !this.state.error.value && !cb) return
		if (!value && !this.state.error.value && cb) return cb()

		if (typeof message === "string") {
			// various edge cases from fetch requests goes here
		} else {
			if (message.message) {
				if (this.isJSON(message.message)) {
					JSON.parse(message.message)
					if (JSON.parse(message.message).message) {
						message = JSON.parse(message.message).message
					} else {
						console.log(">>:: ", message)
						message = "Unhandled Case 1"
					}
				} else {
					console.log(">>:: ", message)
					message = "Unhandled Case 2"
				}
			} else {
				console.log(">>:: ", message)
				message = "unhandled case 3"
			}
		}
		return this.setState(({error}) => ({ 
			error: { ...error, value, message }
		}), () => { if (cb) cb() })
	}

	/* 2. handleUserSearch (x)
		invoker:	Searchbar (username, startDate, endDate)
		invokee:	ApiContent - updateState (username, startDate, endDate, isFetch)

		params: 	<str> username
					<date> startDate
					<date> endDate
		effects: 	Toggles fetch to true, clears games, and sends params to ApiContent
	*/
	handleUserSearch = (username, startDate, endDate) => {
		this.setState(({inputs}) => ({
			inputs: {...inputs, username, startDate, endDate},
			isFetch: true,
			games: []
		}))
	}

	/* 3. isFetching (x)
		invoker:	Searchbar -> APP.handleUserSearch
					ApiContent when done
		invokee:	ApiContent - updateState (isFetch)
						few more times by API
		params:		<bool> isFetch

		effects: 	searchbar sets isFetch to true which tells ApiContent to fetch.
					perform a lot of tasks in between (may get confusing now)
					When it's done, it is set back to false. The search bar toggles as a result.
	*/ 
	isFetching = (isFetch, cb) => {
		this.setState({ isFetch }, () => { if (cb) cb() })
	}


	/* 4. setPageChange (x)
		invoker:	ApiFetcher - on success, reset page to 0
				 	GamesWrapper - onPageClick, save stage of page on page change

	*/
	setPageChange = (num, cb) => {
		this.setState({ pageIndex: num}, () => {
			if (cb) cb()
		})
	}

	/* 5. setGames (x)
		invoker:	ApiContent - fetch all games
		invokee:	GamesWrapper
		params:		<array> games
					<func> callback
		effects:	
	*/
	setGames = (games, callback) => {
		this.setState({
			games: [...this.state.games, ...games.slice().reverse()]
		}, (val) => {
			if (callback) callback()
		})
	}


	  ////////////////////
	 /* Helper Methods */
	////////////////////

	/* getLink (x) - Helper Method
		invoker: 	ApiContent - componentDidMount
		returns:	link format
	*/ 
	getLink = (username, startDate, endDate, pageNum) => {
		let [from, to] = [this.extractDate(startDate).monthYear, this.extractDate(endDate).monthYear]
		return `/games/${username}/${from}/${to}/${pageNum}`
	}

	/*
		extractDate (x) - Helper Method
		invoker:	ApiContent - componentDidMount
		params: 	<date> Date
		return: 	<obj> formattedDate { <int> Month, <int> Year, <string> MonthYear}
	*/
	extractDate = (date) => {
		return {
			month: parseInt(date.toLocaleString('default', { month: 'numeric' })),
			year: parseInt(date.toLocaleString('default', { year: 'numeric' })),
			monthYear: date
				.toLocaleString('default', { month: 'short', year: 'numeric' })
				.replace(' ', '-')
		}
	}

	// isJSON (x) - got from stackoverflow
	isJSON = (str) => {
	    if( typeof( str ) !== 'string' ) { 
	        return false;
	    }
	    try {
	        JSON.parse(str);
	        return true;
	    } catch (e) {
	        return false;
	    }
	}
}

export default withRouter(App)
