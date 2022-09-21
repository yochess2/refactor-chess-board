import React from 'react'
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"

export class ChessWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.chess = new Chess()

		this.state = {
			boardWidth: "256",
			fen: this.chess.fen(),
			history: this.chess.history(),
			timestamps: [],
			black_time: "",
			white_time: "",
			white: {
				name: "White Player",
				username: "White User",
				rating: "1000",
			},
			black: {
				name: "Black Player",
				username: "Black User",
				rating: "1200",
			},
		}
	}

	componentDidMount() {
		console.log('ChessWrapper - componentDidMount')
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	}

	componentWillUnmount = () => {
		console.log('ChessWrapper - componentWillUnmount')
		window.removeEventListener('resize', this.handleResize)
	}

	handleResize = () => {
		let display = document.getElementsByClassName("chess-board-wrapper")[0];
		console.log('handle resize')
		this.setState({ boardWidth: display.offsetWidth - 20 })
	}


	render() {
		return (
			<div style={{ border: "solid" }} className="container">

				{/* ROW 1 */}
				<div className="row">

					{/* Black Player Info and Black Clock */}
					<div style={{ border: "dotted" }} className="col-sm-4 align-self-end">
						<span>Player Info</span>
					</div>
					<div style={{ border: "dotted" }} className="col-sm-4 align-self-end">
						<span>Clock</span>
					</div>

					{/* Search Bar */}
					<div style={{ border: "dotted" }} className="col-sm-4 align-self-end">
						<h1>Search Bar</h1>
					</div>
				</div>

				{/* ROW 2 */}
				<div className="row">

					{/* Chess Board */}
					<div style={{ border: "dotted" }} className="col-sm-8">
						<div className="chess-board-wrapper justify-content-sm-center">
							<Chessboard 
								id="BasicBoard" 
								position={this.state.fen}
								boardWidth={this.state.boardWidth}
								showBoardNotation={true}
								animationDuration={0}
								areArrowsAllowed={true}
							/>
						</div>
					</div>

					{/* Notations */}
					<div style={{ border: "dotted" }} className="col-sm-4">
						<h1>Notations</h1>
					</div>
				</div>

				{/* ROW 3 */}
				<div className="row">

					{/* Black Player Info and Black Clock */}
					<div style={{ border: "dotted" }} className="col-sm-8">
						<div className="row">
							<div style={{ border: "dotted" }} className="col-sm-8">
								<h1>Player Info</h1>
							</div>
							<div style={{ border: "dotted" }} className="col-sm-4">
								<h1>Clock</h1>
							</div>
						</div>
					</div>

					{/* Buttons */}
					<div style={{ border: "dotted" }} className="col-sm-4">
						<h1>Buttons</h1>
					</div>
				</div>

				{/* ROW 4 */}
				<div className="row">
					<h1>GameList</h1>
					<p>Game</p>
					<p>Game</p>
					<p>Game</p>
					<p>Game</p>
					<p>Game</p>

				</div>
			</div>
		)
	}
}

export default ChessWrapper