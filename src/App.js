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

	componentDidMount() {
	}

	render() {
		return (
			<>	
			{/* Navbar */}
			<Navbar handleUserSearch={this.handleUserSearch} />
			{/* End Navbar */}


			<div className="container">
				<div className="row">


					{/* Sidebar */}
					<div className="col-md-3">
						<Sidebar location={this.props.location}/>
					</div>
					{/* End Sidebar */}


					<div className="col-md-9">
		
						{/* Searchbar and ApiContent */}
				    	<Searchbar handleUserSearch={this.handleUserSearch}/>
				    	<ApiContent />
				    	{/* End Searchbar */}


					    {/* Main Content */}
						<div className="table-responsive-md mt-2">
							<Routes>
								<Route 
									exact={true}
									path="/home"
									element={<Home />} 
								/>
							</Routes>
							<Routes>
								<Route 
									path="/games"
									element={<GamesComponent 
										games={this.state.games}
										navigate={this.props.navigate}
										username={this.state.username}
										saveGames={this.saveGames} />} 
								/>
								<Route 
									path="/games/:username/:id"
									element={<GamesComponent 
										games={this.state.games}
										navigate={this.props.navigate}
										username={this.state.username}
										saveGames={this.saveGames} />} 
								/>
							</Routes>
							<Routes>
								<Route 
									path="/board"
									element={<ChessWrapper chess={this.state.chess}/>} />
							</Routes>
						</div>
						{/* End Main Content */}


					</div>
				</div>
			</div>
			</>
		)
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

	getDate = (ms) => {
		let date = new Date(+(ms.toString() + "000"))
		return date
	}

	handleUserSearch = (username, toDate, fromDate) => {
		console.log("App is fetching user", username, toDate, fromDate)


		let a = parseInt(this.getDate(toDate).toLocaleString('default', { month: 'numeric' }))
		let b = parseInt(this.getDate(fromDate).toLocaleString('default', { year: 'numeric' }))

console.log(a)
		this.setState({ username }, () => {
			this.props.navigate(`/games/${this.state.username}/${1}`)

		})


		let games = {...this.state.games}
		console.log(games)
		console.log(<div>hello world</div>)


		this.setState({ 
			games: drakesGames,
			username
		}, () => {
			console.log(this.state)
		})


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