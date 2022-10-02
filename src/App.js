import "./index.css"

import React from "react"
import { Route, Routes } from "react-router-dom"

import { withRouter } from "./utilities/withRouter"
import ErrorMessage from "./ErrorMessage"

import Home from "./Home"
import About from "./About"
import Navbar from "./bar-component/Navbar"
import Sidebar from "./bar-component/Sidebar"
import Searchbar from "./bar-component/Searchbar"
import ApiContent from "./ApiContent"
import Player from "./Player"

import GamesWrapper from "./game-component/GamesWrapper"
import BoardWrapper from "./board-component/BoardWrapper"

export class App extends React.Component {
	constructor(props) {
		super(props) // navigate() and location passed down as props

		this.state = {
			error: { value: false, message: "", },
			inputs: { username: null, startDate: null, endDate: null, },
			isFetch: false,
			player: {},

			// gameswrapper
			pageIndex: 0,
			games: [],

			// board, need to heavily redo
			// just getting MVP out
			chesscom: null,
		}
	}
	componentDidUpdate(prevProps, prevState) {
		this.clearErrorOnPathChange(prevProps.location.pathname)
	}
	clearErrorOnPathChange = (prevLocation) => {
		if (prevLocation !== this.props.location.pathname) 
			if (this.state.error.value) this.handleError(false, "")
	}
	render() {
		const { location, navigate } = this.props
		const { games, isFetch, error, inputs, pageIndex, player } = this.state



		const { 
			handleError, 
			handleUserSearch, 
			handlePlayer, 
			
			handleFetching, 
			extractDate, 
			getLink, 
			flipPage, 
			setGames, 
			getGame, 
			fixChessDate 
		} = this

		const ErrorProps = { error }
		const NavbarProps = { location }
		const SidebarProps = { location }
		const SearchbarProps = { handleUserSearch, handleError }
		const PlayerProps = { extractDate, fixChessDate, handlePlayer }
		const ApiContentProps = { handleError, handleFetching, flipPage, handlePlayer, extractDate, getLink, setGames, location, navigate}

		return (<>
		{/* Navbar (x)
			Minor Fix: annoying bug with react router and active on index page fixed
			with a conditional statement on if location === "/" 
		*/}
			<Navbar {...NavbarProps} />
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
						<Sidebar {...SidebarProps} />
					{/* End Sidebar */}

	    		    {/* API Content (  ) basically done, just using mock data for now

	    		    	purpose:	To fetch from chess.com API
	    		    	props:		<state><bool> isFetch - Only runs if set to true
									<state><obj> inputs
									<func> handleError
									<func> handleFetching 
									<func> getLink
									<func> navigate
									<func> setGames
	    		    */}


		    		{/* TODO, feature ideas */}

			    	{/* Displays Player Profile */}
		    		<Player player={player} {...PlayerProps} />

	    	    	<ApiContent isFetch={isFetch} inputs={inputs} {...ApiContentProps} />
	    		    {/* End API Content */}
						
					</div>

					<div className="col-md-9">


						{/* ErrorMessage (x)
							purpose:	Displays error messages
							props:		<state><obj> Error
						*/}
				    	<ErrorMessage {...ErrorProps} />
						{/* End ErrorMessage */}


						{/* Searchbar (x)
							purpose:	To allow user to search for a username by month.
							props:		<func> handleUserSearch
										<func> handleError
										<state><bool><isFetch>
							effects:	- Search input for username, start date, and end date
										- Error handling, decides if search is valid or invalid
										- Hides while API is fetching


					    	MVP Searchbar is done, lots of room for add-on features.
							Potential ideas are
								1. search history (localstorage)
								2. search suggestion (fetch or localstorage)
						 */}
				    	<Searchbar inputs={inputs} isFetch={isFetch} {...SearchbarProps} />
					    {/* End Searchbar */}


					    {/* Main Content */}
						<div className="table-responsive-md mt-2">
							<Routes>
								<Route
									path="*"
									element={<h2>404</h2>} />
								<Route exact path="/" element={<Home />} />
								<Route 
									path="games"
									element={<GamesWrapper
										games={games}
										inputs={inputs}
										isFetch={isFetch}
										pageIndex={pageIndex}
										getLink={getLink}
										flipPage={flipPage}
										extractDate={extractDate} 
										getGame={getGame} />} />
								<Route 
									path="board"
									element={<BoardWrapper 
										chesscom={this.state.chesscom}
										/>} />
								<Route 
									path="about"
									element={<About />} />
							</Routes>
						</div>
						{/* End Main Content */}


					</div>
				</div>
			</div>
	</>)
	}

	/* 1. handleError (x)
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
	handleError = (value, message, cb, isFetch) => {
		if (!isFetch) this.setState({ isFetch: false })

		if (!value && !this.state.error.value && !cb) return
		if (!value && !this.state.error.value && cb) return cb()
		message = this.checkMessage(message)
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

	// 3. handlePlayerFound - invoker: ApiContent - Component
	handlePlayer = (player, cb) => {
		this.setState({player: player}, () => { if (cb) cb() })
	}

	/* 4. handleFetching (x)
		invoker:	Searchbar -> APP.handleUserSearch
					ApiContent when done
		invokee:	ApiContent - updateState (isFetch)
						few more times by API
		params:		<bool> isFetch

		effects: 	searchbar sets isFetch to true which tells ApiContent to fetch.
					perform a lot of tasks in between (may get confusing now)
					When it's done, it is set back to false. The search bar toggles as a result.
	*/ 
	handleFetching = (isFetch, cb) => {
		this.setState({ isFetch }, () => { if (cb) cb() })
	}

	/* 4. flipPage (x)
		invoker:	ApiFetcher - on success, reset page to 0
				 	GamesWrapper - onPageClick, save stage of page on page change
		callback:	

	*/
	flipPage = (num, cb) => {
		this.setState({ pageIndex: num}, () => { if (cb) cb() })
	}

	/* 5. setGames (x)
		invoker:	ApiContent - fetch all games
		invokee:	GamesWrapper
		params:		<array> games
					<func> callback
		
		effects:	callback passes back gamesLength to Api.
						If game length is greater than 0, trigger loading (fetchAndSetGames)
						Once loading is triggered, reset state of API and goto page 1 of games component
	*/
	setGames = (games, callback) => {
		this.setState({
			games: [...this.state.games, ...games.slice().reverse()]
		}, (val) => {
			if (callback) callback(this.state.games.length)
		})
	}

	/* 6. getGame */
	// getting MVP out first
	getGame = (game) => {
		this.setState({
			chesscom: game
		}, () => {
			this.props.navigate('/board')
		})
	}

	  ////////////////////
	 /* Helper Methods */
	////////////////////

	// checkMessage (x) - Helper Method
	// More edge cases to come
	checkMessage(message) {
		let newMessage
		if (typeof message === "string") {
			// various edge cases from fetch requests goes here
			newMessage = message
		} else {
			if (message.message) {
				if (this.isJSON(message.message)) {
					JSON.parse(message.message)
					if (JSON.parse(message.message).message) {
						newMessage = JSON.parse(message.message).message
					} else {
						// console.log(">>:: ", message)
						newMessage = "Unhandled Case 1"
					}
				} else {
					// console.log(">>:: ", message)
					newMessage = "Unhandled Case 2, likely no internet"
				}
			} else {
				// console.log(">>:: ", message)
				newMessage = "unhandled case 3"
			}
		}
		return newMessage
	}

	/* getLink (x) - Helper Method
		invoker: 	ApiContent - componentDidMount
		returns:	link format

		TODO: I am just gonna forgo params, this is not a good way of using these functions
	*/ 
	getLink = (username, startDate, endDate, pageNum) => {
		// let [from, to] = [this.extractDate(startDate).monthYear, this.extractDate(endDate).monthYear]
		// return `/games/${username}/${from}/${to}/${pageNum}`
		return "/games"
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

	// used in apicontent as well
	fixChessDate = (ms) => new Date(+(ms.toString() + "000"))

}

export default withRouter(App)
