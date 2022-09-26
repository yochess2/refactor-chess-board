import "./index.css"
import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"
import ChessWebAPI from "chess-web-api"

import { withRouter } from "./utilities/withRouter"

import Home from "./Home"
import Err from "./Err"
import Navbar from "./bar-component/Navbar"
import Searchbar from "./bar-component/Searchbar"
import Sidebar from "./bar-component/Sidebar"
import GamesComponent from "./game-component/GamesComponent"
import ChessWrapper from "./ChessWrapper"
import ApiContent from "./ApiContent"

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

			games: [],
			chess: new Chess(),
			gameNum: null, //for use on saving game index num,


		}
		// console.log(this.state.games)
		this.chess = new Chess()
		// this.api = new ChessWebAPI
	}

	componentDidUpdate(prevProps, prevState) {
		// this.clearErrorOnPathChange(prevProps.location.pathname)
		console.log(prevProps, this.props)
	}

	// If path changes then set error to false
	clearErrorOnPathChange = (prevLocation) => {
		if (prevLocation !== this.props.location.pathname) 
			if (this.state.error.value) this.onError(false, "")
	}

	render() {
		let props = this.props
		let { location, navigate } = this.props
		let { username, startDate, endDate, games, isFetch, error } = this.state
		let { handleUserSearch, onError } = this

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
						TODO: FaBar needs styling and doesn't seem to work on my mobile phone.
						Right now, App is still in early stages, so undecided on the formatting. 
					*/}
					<div className="col-md-3">
						<Sidebar location={location} />
					</div>
					{/* End Sidebar */}


					<div className="col-md-9">


						{/* Err 
							Under progress
						*/}
				    	<Err error={error} />
						{/* End Err */}


						{/* Searchbar (x)
							purpose:	To allow user to search for a username by month.
							inputs: 	<func> handleUserSearch, onError
							effects:	1) user search - obtains username, start date, and end date
										2) error - decides if search is valid or invalid

					    	MVP Searchbar is done, lots of room for add-on features.
							Potential ideas are
								1. search history (localstorage)
								2. search suggestion (fetch or localstorage)
						 */}
				    	<Searchbar handleUserSearch={handleUserSearch} onError={onError} />
					    {/* End Searchbar */}


		    		    {/* API Content
		    		    	TODO RIGHT NOW
		    				MVP is to fetch games based on month
		    				Potential ideas are
		    					1. store games in localstorage
		    						- fetch first the desired dates
		    		    */}
		    	    	<ApiContent 
			    	    	// isFetch={isFetch}
		    	    		onError={onError}
			    	    	username={username}

			    	    	// fromDate={startDate}
			    	    	// toDate={endDate}

			    	    	// handleFetchOnce={this.handleFetchOnce} 
			    	    	// setGames={this.setGames}
			    	    	// getLink={this.getLink}
			    	    	// extractDate={this.extractDate} 
			    	    	/>
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
									element={<GamesComponent 
										games={games}
										username={username}
										fromDate={startDate}
										toDate={endDate}
										isFetch={isFetch}
										getLink={this.getLink}
										extractDate={this.extractDate}
										{...props} />} />
								<Route 
									path="games/:username/"
									element={<GamesComponent 
										games={games}
										username={username}
										fromDate={startDate}
										toDate={endDate}
										isFetch={isFetch}
										getLink={this.getLink}
										extractDate={this.extractDate}
										{...props} />} />
								<Route 
									path="games/search/:username/:fromDate/:toDate/:id"
									element={<GamesComponent 
										games={games}
										username={username}
										fromDate={startDate}
										toDate={endDate}
										isFetch={isFetch}
										getLink={this.getLink}
										extractDate={this.extractDate}
										{...props} />} />

								<Route 
									path="board"
									element={<ChessWrapper chess={this.state.chess}/>} />
							</Routes>
						</div>
						{/* End Main Content */}


					</div>
				</div>
			</div>
	</>)
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


	getLink = (username, startDate, endDate, page) => {
		return `/games/search/${username}/${this.extractDate(startDate).monthYear}/${this.extractDate(endDate).monthYear}/${page}`
	}

	//sets date as month, year, and month-year format
	extractDate = (date) => {
		return {
			month: date.toLocaleString('default', { month: 'numeric' }),
			year: date.toLocaleString('default', { year: 'numeric' }),
			monthYear: date
				.toLocaleString('default', { month: 'short', year: 'numeric' })
				.replace(' ', '-')
		}
	}

	setGames = (games, callback) => {
		this.setState({
			games: [...this.state.games, ...games.slice().reverse()]
		}, (val) => {
			console.log('1. setting games', callback)
			callback(callback)
		})
	}

	//Called by ApiContent, resets the need to fetch
	handleFetchOnce = (isFetch) => {
		this.setState({ isFetch }, () => {
		})
	}


	/* OnError (x)
		invoker:	Searchbar - Search Button
					App - ComponentWillUpdate(prevPath, currentPath)
		invokee:	App - Error Element
		params:		<bool> value
					<str> message
					[optional] <function> cb
		effect:		Toggles Error Message
		TODO: 		Don't have screen render on same error message
	*/
	onError = (value, message, cb) => {
		if (!value && !this.state.error.value && !cb) return
		if (cb && !this.state.error.value) return cb()
		this.setState(({error}) => ({ 
			error: { ...error, value, message }
		}), () => { 
			if (cb) cb() 
		})
	}

	/* handleUserSearch (x)
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
}


export default withRouter(App)
