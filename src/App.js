import React from "react"
import { Route, Routes } from "react-router-dom"
import { Chess } from "chess.js"

import Home from "./Home"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import ChessWrapper from "./ChessWrapper"
import Games from "./Games"

import "./index.css"

export class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			chess: new Chess()
		}
	}

	render() {
		return (
			<>	
				{/* Navbar */}
				<Navbar />
				
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
									element={<Games chess={this.state.chess}/>} 
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
}

export default App