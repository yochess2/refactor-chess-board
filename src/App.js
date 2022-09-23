import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"
import ChessWebAPI from "chess-web-api"

import Home from "./Home"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import ChessWrapper from "./ChessWrapper"
import GamesComponent from "./game-component/GamesComponent"

import "./index.css"

export class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			chess: new Chess(),
			games: [],
			username: null,
			gameNum: null, //for use on saving game index num
		}
		this.api = new ChessWebAPI
	}

	render() {
		return (
			<>	
			{/* Navbar */}
			<Navbar handleUserSearch={this.handleUserSearch} />
			
			<div className="container">
				<div className="row">

					{/* Sidebar */}
					<div className="col-sm-3">
						<Sidebar />
					</div>

					{/* Website Components and Routes */}
					<div className="col-sm-9">
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
									saveGames={this.saveGames}
								/>} 
							/>
							<Route 
								path="/games/:id"
								element={<GamesComponent 
									games={this.state.games}
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
			</>
		)
	}

	saveGames = (games) => {
		console.log("App is saving games", games)
		this.setState({ games })
	}

	handleUserSearch = async (username, date) => {
		console.log("App is fetching user", username, date)

	}
}

export default App