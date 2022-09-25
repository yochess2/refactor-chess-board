import "./index.css"
import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"
import ChessWebAPI from "chess-web-api"

import { withRouter } from "./utilities/withRouter"
import { drakesGames } from "./game-component/samples"

import Home from "./Home"
import Navbar from "./bar-component/Navbar"
import Searchbar from "./bar-component/Searchbar"
import Sidebar from "./bar-component/Sidebar"
import GamesComponent from "./game-component/GamesComponent"
import ChessWrapper from "./ChessWrapper"
import ApiContent from "./ApiContent"

export class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: null,
			fromDate: null,
			toDate: null,
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
		if (this.props.location.pathname !== prevProps.location.pathname) {
			// console.log('>>>>>>>>', this.props.location.pathname)
		}
	}

	render() {
		let props = this.props
		let { username, fromDate, toDate, games, isFetch } = this.state
		return (<>

		{/* Navbar
			Minor Fix: annoying bug with react router and active on index page fixed
			with a conditional statement on if location === "/" 
		*/}
			<Navbar {...props} />
		{/* End Navbar */}


			<div className="container">
				<div className="row">


					{/* Sidebar
						TODO: FaBar needs styling and doesn't seem to work on my mobile phone.
						Right now, App is still in early stages, so undecided on the formatting. 
					*/}
					<div className="col-md-3">
						<Sidebar {...props} />
					</div>
					{/* End Sidebar */}


					<div className="col-md-9">

		
						{/* Searchbar 
					    	MVP Searchbar is done, lots of room for algo related improvements
							Potential ideas are
								1. search history (fetch or localstorage)
								2. search suggestion (fetch)
						 */}
				    	<Searchbar handleUserSearch={this.handleUserSearch} />

		    		    {/* API Content
		    		    	TODO RIGHT NOW
		    				MVP is to fetch games based on month
		    				Potential ideas are
		    					1. store games in localstorage
		    						- fetch first the desired dates
		    		    */}
		    	    	<ApiContent 
			    	    	isFetch={isFetch}
			    	    	username={username}
			    	    	fromDate={fromDate}
			    	    	toDate={toDate}
			    	    	handleFetchOnce={this.handleFetchOnce} 
			    	    	setGames={this.setGames}
			    	    	getLink={this.getLink}
			    	    	extractDate={this.extractDate}
			    	    	{...props} />
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
										fromDate={fromDate}
										toDate={toDate}
										getLink={this.getLink}
										extractDate={this.extractDate}
										{...props} />} />
								<Route 
									path="games/:username/"
									element={<GamesComponent 
										games={games}
										username={username}
										fromDate={fromDate}
										toDate={toDate}
										getLink={this.getLink}
										extractDate={this.extractDate}
										{...props} />} />
								<Route 
									path="games/search/:username/:fromDate/:toDate/:id"
									element={<GamesComponent 
										games={games}
										username={username}
										fromDate={fromDate}
										toDate={toDate}
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


	getLink = (username, fromDate, toDate, page) => {
		return `/games/search/${username}/${this.extractDate(fromDate).monthYear}/${this.extractDate(toDate).monthYear}/${page}`
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

	setGames = (games) => {
		this.setState({
			games: [...this.state.games, ...games.slice().reverse()]
		}, () => {
			console.log('success')
		})
	}

	//Invoked by Search Component
	handleUserSearch = (username, fromDate, toDate) => {
		this.setState({ username, toDate, fromDate, isFetch: true, games: []  }, () => {
		})
	}

	//Called by ApiContent, resets the need to fetch
	handleFetchOnce = (isFetch) => {
		this.setState({ isFetch }, () => {
		})
	}
}

export default withRouter(App)
