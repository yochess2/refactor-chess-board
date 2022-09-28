import React from "react"
import { Chessboard } from "react-chessboard" 
import { Chess } from "chess.js"

import { 
	FaAngleLeft,
	FaAngleRight,
	FaAngleDoubleLeft,
	FaAngleDoubleRight 
} from "react-icons/fa"

import Notations from "./Notations"

export class BoardWrapper extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			// chesscom: this.props.chesscom, //placeholder for now
			boardWidth: "256",
			game: new Chess(),


			fen: "start",
			history: [],
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
		document.title = "YoChess - Board"
		window.addEventListener("resize", this.handleResize)
		this.handleResize()

		if (this.props.chesscom) {
			this.handleGameClick(this.props.chesscom)
		}
	}

	componentWillUnmount = () => {
		window.removeEventListener("resize", this.handleResize)
	}

	handleResize = () => {
		let display = document.getElementsByClassName("chess-board-wrapper")[0];
		this.setState({ boardWidth: display.offsetWidth - 20 })
	}


	render() {
		return (
			<>
				{/* ROW 1 */}
				<div className="row">

					{/* Black Player Info and Black Clock */}
					<div className="col-8 col-sm-4">
						<h4>
							{this.state.black.name || this.state.black.username}
							({this.state.black.rating})
						</h4>
					</div>
					<div className="col-4">
						<h4>
							<span className={this.state.game.turn() === 'b' ? 'highlight-clock' : ''}>
								{this.state.white_time}
							</span>
						</h4>
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
								showBoardNotation={true}
								onPieceDrop={this.handlePieceDrop}
								animationDuration={0}
								areArrowsAllowed={true}
								boardWidth={this.state.boardWidth}
							/>
						</div>
					</div>

					{/* Notations */}
					<div className="col-sm-4 d-none d-sm-block" style={{border: "solid", height: this.state.boardWidth, overflow: "auto"}}>
						<Notations 
							history={this.state.history}
							onMoveClick={this.handleMoveClick}
							ply={this.state.game.history && this.state.game.history().length}

						/>
					</div>
				</div>

				{/* ROW 3 */}
				<div className="row">

					{/* Black Player Info and Black Clock */}
					{/*<div className="col-8">*/}
						{/*<div className="row">*/}
							<div className="col-8 col-sm-4">
								<h4>
									{this.state.white.name || this.state.white.username}
									({this.state.white.rating})
								</h4>
							</div>
							<div className="col-4 col-sm-4">
								<h4>
									<span className={this.state.game.turn() === 'w' ? 'highlight-clock' : ''}>
										{this.state.white_time}
									</span>
								</h4>
							</div>
						{/*</div>*/}
					{/*</div>*/}

					{/* Buttons */}
					<div className="col-sm-4">
						<div className="row">
							<div className="col-3" style={{border: "solid"}}>
								<button onClick={this.handleDoubleLeftClick}>
									<FaAngleDoubleLeft className="hand-icon" size="2em" />
								</button>
							</div>
							<div className="col-3" style={{border: "solid"}}>
								<button onClick={this.handleLeftClick}>
									<FaAngleLeft className="hand-icon" size="2em" />
								</button>
							</div>
							<div className="col-3" style={{border: "solid"}}>
								<button onClick={this.handleRightClick}>
									<FaAngleRight className="hand-icon" size="2em" />
								</button>
							</div>
							<div className="col-3" style={{border: "solid"}}>
								<button onClick={this.handleDoubleRightClick}>
									<FaAngleDoubleRight className="hand-icon" size="2em" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</>
		)
	}


	//When user drops a piece, the move gets input into the chess instance
	//  if the chess instance says the move is illegal then nothing happens
	//  else the chess instance gets updated and fen's state changes 
	//Returns: a value of true or false as required by the chessboard instance
	handlePieceDrop = (sourceSquare, targetSquare, piece) => {		
		let moved = this.state.game.move({
			from: sourceSquare, 
			to: targetSquare
		})

		let currentHistory = this.state.game.history()
		let notationHistory = this.state.history
		let index = currentHistory.length-1

		if (!moved) {
			return false
		}

		let history
		if (currentHistory.length >= notationHistory.length) {
			history = this.state.game.history()
		} else {
			if (currentHistory[index] === notationHistory[index]) {
				history = this.state.history
			} else {
				history = this.state.game.history()
			}
		}
		this.setState({
			fen: this.state.game.fen(),
			history: history,
		})
		return true
	}

	//Load game, set timer
	//Odd on length is white, even on index is black
	//Subtract 1 to get other side, just guess and check, don't think too hard!
	//edge case are abortions, figure out logic on that later!
	handleGameClick = (game) => {
		console.log("game loaded: ", game)
		let newGame = new Chess()
		newGame.loadPgn(game.pgn)
		console.log(game)

		let comments = newGame.getComments()
		let totalPly = newGame.getComments().length

		if (comments.length === 0) {
			comments = Array.from(Array(10).keys()).map(x => {
				return {comment: 'NA'}
			})
			totalPly = comments.length

		}

		this.setState({ 
			game: newGame,
			fen: newGame.fen(),
			history: newGame.history(),
			white: game.white,
			black: game.black,
			timestamps: comments.map((obj) => obj.comment),
			white_time: newGame.turn() === "w" ? comments[totalPly-2].comment : comments[totalPly-1].comment,
			black_time: newGame.turn() === "w" ? comments[totalPly-1].comment : comments[totalPly-2].comment,
		})
	}

	//done
	//Method is invoked from Notations.onMoveClick()
	//When invoked, it resets the game and board to that point in time,
	//Notation is not affected
	//Returns: Nothing
	handleMoveClick = (moveNum) => {
		this.state.game.reset()
		for (let index = 0; index <= moveNum; index++) {
			this.handleRightClick()
		}

	}

	//Done, just reset fen and timers, nothing else!
	handleDoubleLeftClick = () => {
		this.state.game.reset()
		this.setState({ 
			fen: this.state.game.fen(),
			white_time: this.state.timestamps[0],
			black_time: this.state.timestamps[0],
		})
	}

	//done, just invoke handlerightclick
	handleDoubleRightClick = () => {
		let length = this.state.game.history().length
		for (let index = length; index < this.state.timestamps.length; index++) {
			this.handleRightClick()
		}
	}

	//done, hard edge cases on 2 and 1
	handleLeftClick = () => {
		this.state.game.undo()
		let comments = this.state.game.getComments()
		let totalPly = 0

		if (comments) {
			totalPly = this.state.game.getComments().length
		} 

		if (totalPly === 1) {
			this.setState({ 
				fen: this.state.game.fen(), 
				white_time: comments[0].comment,
				black_time: comments[0].comment,
			})
		} else if (totalPly === 0) {
			this.setState({ 
				fen: this.state.game.fen(),
			})
		} else 
		this.setState({ 
			fen: this.state.game.fen(), 
			white_time: this.state.game.turn() === "w" ? comments[totalPly-2].comment : comments[totalPly-1].comment,
			black_time: this.state.game.turn() === "w" ? comments[totalPly-1].comment : comments[totalPly-2].comment,
		})
	}

	//Done, edge cases are beginning and end
	handleRightClick = () => {
		let index = this.state.game.history().length
		let move = this.state.history[index]
		this.state.game.move(move)

		if (index === 0) {
			this.setState({ 
				fen: this.state.game.fen(), 
				white_time: this.state.timestamps[index],
				black_time: this.state.timestamps[index],
			})
		} else if (index >= this.state.timestamps.length) {
			this.setState({
				fen: this.state.game.fen(),
			})
		}else {
			this.setState({ 
				fen: this.state.game.fen(),
				white_time: this.state.game.turn() === "w" ? this.state.timestamps[index-1] : this.state.timestamps[index],
				black_time: this.state.game.turn() === "w" ? this.state.timestamps[index] : this.state.timestamps[index-1],
			})

		}

	}
}

export default BoardWrapper