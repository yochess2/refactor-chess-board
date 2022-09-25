import "./index.css"
import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"

import { withRouter } from "./utilities/withRouter"
import { drakesGames } from "./game-component/samples"

import Home from "./Home"
import Navbar from "./bar-component/Navbar"
import Searchbar from "./bar-component/Searchbar"
import Sidebar from "./bar-component/Sidebar"
import ApiContent from "./ApiContent"
import GamesComponent from "./game-component/GamesComponent"
import ChessWrapper from "./ChessWrapper"


export class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: null,
			fromDate: null,
			toDate: null,
			games: [],
			chess: new Chess(),
			date: null,
			gameNum: null, //for use on saving game index num,
		}
		// console.log(this.state.games)
		this.chess = new Chess()
	}

	componentDidUpdate() {
		// console.log('>>>>>>>>', this.props.location.pathname)
	}

	checkActive = (match, location) => {
	    // console.log(pathname);
	    if(!location) return false
	    const {pathname} = location
	    return pathname === "/"
	}

	render() {
		let props = this.props
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
				    	<ApiContent />
					    {/* End API Content */}


					    {/* Main Content */}
						<div className="table-responsive-md mt-2">
							<Routes>
								<Route 
									exact
									path="/"
									element={<h1>index</h1>} />
								<Route 
									path="home"
									element={<Home />} />
								<Route 
									path="games"
									element={<GamesComponent 
										games={this.state.games}
										username={this.state.username}
										saveGames={this.saveGames} />}
										{...props} />
								<Route 
									path="games/:username/:fromDate/:toDate/:id"
									element={<GamesComponent 
										games={this.state.games}
										username={this.state.username}
										saveGames={this.saveGames} />}
										{...props} />
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

	getDateFromMs = (ms) => {
		let date = new Date(+(ms.toString() + "000"))
		return date
	}

	getMonth = date => date.toLocaleString('default', { month: 'short' })
	getYear = date => date.toLocaleString('default', { year: 'numeric' })
	getMonthAndYear = date => date.toLocaleString("default", { month: "short", year: "numeric" }).replace(' ', '-')

	getLink = (username, fromDate, toDate) => {
		return `/games/${username}/${this.getMonthAndYear(fromDate)}/${this.getMonthAndYear(toDate)}/1`
	}

	handleUserSearch = (username, fromDate, toDate) => {
		console.log("App is fetching user", username, toDate, fromDate)
		this.setState({ username, toDate, fromDate }, () => {
			this.props.navigate(this.getLink(username, toDate, fromDate))
		})

		// let games = {...this.state.games}
		// console.log(games)
		// console.log(<div>hello world</div>)


		// this.setState({ 
		// 	games: drakesGames,
		// 	username
		// }, () => {
		// 	console.log(this.state)
		// })


		// console.log(b,c,d)
		// let res = await this.api.getPlayer(username)
		// if (res.body) {
		// 	console.log('got res.body', res, res.body)
		// }

		// this.api.getPlayer(username).then(res => {
		// 	console.log('success!', res.body)
		// 	this.setState({ games: [], username }, () => {
		// 		console.log(this.state.username)
		// 		this.joined = this.getJoinedDate(res.body.joined)
		// 		this.joinedMonth = parseInt(this.joined.toLocaleString('default', { month: 'numeric' }))
		// 		this.joinedYear = parseInt(this.joined.toLocaleString('default', { year: 'numeric' }))
		// 		this.month = 9
		// 		this.year = 2022
		// 		this.api.dispatch(this.api.getPlayerCompleteMonthlyArchives, this.fetchGames, [this.state.username, this.year, this.month])
		// 	})
		// })
	}
}



export default withRouter(App)