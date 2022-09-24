import "./index.css"
import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"
import ChessWebAPI from "chess-web-api"

import { withRouter } from "./utilities/withRouter"
import { drakesGames } from "./game-component/samples"

import Home from "./Home"
import Navbar from "./navbar-component/Navbar"
import Sidebar from "./navbar-component/Sidebar"
import ChessWrapper from "./ChessWrapper"
import GamesComponent from "./game-component/GamesComponent"


export class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			games: [],
			chess: new Chess(),
			username: "tiger415",
			date: null,
			gameNum: null, //for use on saving game index num
		}
		// console.log(this.state.games)
		this.api = new ChessWebAPI({ queue: true})
		this.chess = new Chess()
	}

	render() {
		console.log('App - render')
		return (
			<>	
			{/* Navbar */}
			<Navbar handleUserSearch={this.handleUserSearch} />
			
			<div className="container">
				<div className="row">

					{/* Sidebar */}
					<div className="col-md-3">
						<Sidebar location={this.props.location}/>
					</div>

					{/* Website Components and Routes */}
					<div className="col-md-9">
						<div className="mt-2">
							<h4 className="p-1 border-bottom">Title goes here of some sort</h4>
							<div className="table-responsive-md">
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
											saveGames={this.saveGames}
										/>} 
									/>
									<Route 
										path="/games/:username/:id"
										element={<GamesComponent 
											games={this.state.games}
											navigate={this.props.navigate}
											username={this.state.username}
											saveGames={this.saveGames}
										/>} 
									/>
								</Routes>
								<Routes>
									<Route 
										path="/board"
										element={<ChessWrapper chess={this.state.chess}/>} 
									/>
								</Routes>
							</div>
						</div>
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

	getJoinedDate = (ms) => {
		let date = new Date(+(ms.toString() + "000"))
		return date
	}

	handleUserSearch = async (username, date) => {
		console.log("App is fetching user", username, date)
		// let res = await this.api.getPlayer(username)
		// if (res.body) {
		// 	console.log('got res.body', res, res.body)
		// }

		this.api.getPlayer(username).then(res => {
			console.log('success!', res.body)
			this.setState({ games: [], username }, () => {
				console.log(this.state.username)
				this.joined = this.getJoinedDate(res.body.joined)
				this.joinedMonth = parseInt(this.joined.toLocaleString('default', { month: 'numeric' }))
				this.joinedYear = parseInt(this.joined.toLocaleString('default', { year: 'numeric' }))
				this.month = 9
				this.year = 2022
				this.api.dispatch(this.api.getPlayerCompleteMonthlyArchives, this.fetchGames, [this.state.username, this.year, this.month])
			})
		})
	}
}



export default withRouter(App)