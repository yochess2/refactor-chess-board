import React from "react"
import { Chessboard } from "react-chessboard" 

export class BoardWrapper extends React.Component {
	componentDidMount() {
		document.title = "Game - YoChess"
	}

	constructor(props) {
		super(props)

		this.state = {
			boardWidth: "256",
			fen: this.props.chess.fen(),
			history: this.props.chess.history(),
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
			games: [],
		}
	}

	componentDidMount() {
		console.log("ChessWrapper - componentDidMount")
		window.addEventListener("resize", this.handleResize)
		this.handleResize()
	}

	componentWillUnmount = () => {
		console.log("ChessWrapper - componentWillUnmount")
		window.removeEventListener("resize", this.handleResize)
	}

	handleResize = () => {
		let display = document.getElementsByClassName("chess-board-wrapper")[0];
		console.log("handle resize", window.innerWidth)
		this.setState({ boardWidth: display.offsetWidth - 20 })
	}


	render() {
		return (
			<>
				{/* ROW 1 */}
				<div className="row">

					{/* Black Player Info and Black Clock */}
					<div className="col-8 col-sm-4" style={{border: "solid"}}>
						<span>Player Info</span>
					</div>
					<div className="col-4" style={{border: "solid"}}>
						<span>Clock</span>
					</div>

					{/* Empty Space */}
					<div className="col-4"></div>
				</div>

				{/* ROW 2 */}
				<div className="row">

					{/* Chess Board */}
					<div className="col-sm-8">
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
					<div className="col-sm-4 d-none d-sm-block" style={{border: "solid"}}>
						<h1>Notations</h1>
					</div>
				</div>

				{/* ROW 3 */}
				<div className="row">

					{/* Black Player Info and Black Clock */}
					{/*<div className="col-8">*/}
						{/*<div className="row">*/}
							<div className="col-8 col-sm-4" style={{border: "solid"}}>
								<span>Player Info</span>
							</div>
							<div className="col-4 col-sm-4" style={{border: "solid"}}>
								<span>Clock</span>
							</div>
						{/*</div>*/}
					{/*</div>*/}

					{/* Buttons */}
					<div className="col-sm-4" style={{border: "solid"}}>
						<span>Buttons</span>
					</div>
				</div>
			</>
		)
	}
}

export default BoardWrapper