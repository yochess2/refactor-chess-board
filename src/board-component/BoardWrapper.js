import React from "react"
import { Chessboard } from "react-chessboard" 
import { Chess } from "chess.js"

import { 
	FaAngleLeft,
	FaAngleRight,
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaArrowsAltV,
} from "react-icons/fa"

import Notations from "./Notations"

export class BoardWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.game = new Chess()

		this.state = {
			boardWidth: "256",

			fen: this.game.fen(),
			history: [],
			timestamps: [],
			ply: this.game.history() && this.game.history.length,
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
				rating: "1000",
			},
			boardOrientation: true,

			leftArrow: { backgroundColor: "lightgray", borderStyle: "ridge" },
			rightArrow: { backgroundColor: "lightgray", borderStyle: "ridge" },
		}
	}

	componentDidMount() {
		document.title = "YoChess - Board"
		window.addEventListener("resize", this.handleResize)
		this.handleResize()

		window.addEventListener("keydown", this.handleKey)

		if (this.props.chesscom) {
			this.handleGameClick(this.props.chesscom)
		}
	}

	componentWillUnmount = () => {
		window.removeEventListener("keydown", this.handleKey)
		window.removeEventListener("resize", this.handleResize)
	}

	handleResize = () => {
		let display = document.getElementsByClassName("chess-board-wrapper")[0];
		if (!display) return console.log('what happened to display? ', document.getElementsByClassName("chess-board-wrapper"))
		this.setState({ boardWidth: display.offsetWidth})
	}

	handleKey = (e) => {
		if (e.key === "ArrowRight") {
			if(this.handleRightClick()) {
				this.setState({
					rightArrow: {
						backgroundColor: "orange",
						borderStyle: "ridge"
					}
				}, () => {
					setTimeout(() => {
						this.setState({
							rightArrow: {
								backgroundColor: "lightgray", 
								borderStyle: "ridge"
							}
						})

					}, 100)

				})
			}
		}
		if (e.key === "ArrowLeft") {
			if (this.handleLeftClick()) {
				this.setState({
					leftArrow: {
						backgroundColor: "orange",
						borderStyle: "ridge"
					}
				}, () => {
					setTimeout(() => {
						this.setState({
							leftArrow: {
								backgroundColor: "lightgray", 
								borderStyle: "ridge"
							}
						})

					}, 100)

				})

			}
		}

		if (e.key === "ArrowUp") {
			this.handleLeftClick()
			this.handleLeftClick()
		}

		if (e.key === "ArrowDown") {
			this.handleRightClick()
			this.handleRightClick()
		}
	}


	render() {
		return (
			<div className="container">
				{/* ROW 1 */}
				<div className="row">

					{/* Black Player Info and Black Time */}
					<div className="col-8 col-md-6">

						{this.state.boardOrientation ? 
						<h4>
							{this.state.black.name || this.state.black.username}
							<span> ({this.state.black.rating})</span>
						</h4>
						:
						<h4>
							{this.state.white.name || this.state.white.username}
							<span> ({this.state.white.rating})</span>
						</h4>
						}

					</div>
					<div className="col-4 col-md-2 text-end">
						{this.state.boardOrientation ? 
						<h4>
							<span className={this.game.turn() === 'b' ? 'highlight-clock' : ''}>
								{this.state.black_time && this.state.black_time.slice(5, 13)}
							</span>
						</h4>
						:
						<h4>
							<span className={this.game.turn() === 'w' ? 'highlight-clock' : ''}>
								{this.state.white_time && this.state.white_time.slice(5, 13)}
							</span>
						</h4>
						}

					</div>

					{/* Empty Space */}
					<div className="col-4"></div>
				</div>

				{/* ROW 2 */}
				<div className="row">

					{/* Chess Board */}
					<div className="col-md-8">
						<div className="chess-board-wrapper justify-content-md-center">
							<Chessboard 
								id="BasicBoard" 
								position={this.state.fen}
								showBoardNotation={true}
								boardOrientation={this.state.boardOrientation ? "white" : "black"}
								onPieceDrop={this.handlePieceDrop}
								animationDuration={0}
								areArrowsAllowed={true}
								boardWidth={this.state.boardWidth}
							/>
						</div>
					</div>

					{/* Notations */}
					<div className="col-md-4 d-none d-md-block" style={{height: this.state.boardWidth, overflow: "auto"}}>
						<Notations 
							history={this.state.history}
							onNotationClick={this.handleNotationClick}
							ply={this.state.ply}

						/>
					</div>
				</div>

				{/* ROW 3 */}
				<div className="row">
					{/* White Player Info and White Time */}
					{/*<div className="col-8">*/}
						{/*<div className="row">*/}
							<div className="col-8 col-md-6">
								
								{this.state.boardOrientation ? 
								<h4>
									{this.state.white.name || this.state.white.username}
									<span> ({this.state.white.rating})</span>
								</h4>
								:
								<h4>
									{this.state.black.name || this.state.black.username}
									<span> ({this.state.black.rating})</span>
								</h4>
								}

							</div>
							<div className="col-4 col-md-2 text-end">
								{this.state.boardOrientation ?
								<h4>
									<span className={this.game.turn() === 'w' ? 'highlight-clock' : ''}>
										{this.state.white_time && this.state.white_time.slice(5, 13)}
									</span>
								</h4>
								:
								<h4>
									<span className={this.game.turn() === 'b' ? 'highlight-clock' : ''}>
										{this.state.black_time && this.state.black_time.slice(5, 13)}
									</span>
								</h4>
								}
							</div>
						{/*</div>*/}
					{/*</div>*/}

					{/* Buttons */}
					<div className="col-md-4">
						<div className="row">
							<div className="col-1"></div>

							<div className="col-2 hand-icon text-center double-left-arrow" style={{backgroundColor: "#8FBC8F", borderStyle: "ridge"}} onClick={this.handleDoubleLeftClick}>
								<FaAngleDoubleLeft/>
							</div>
							<div className="col-2 hand-icon text-center left-arrow" style={this.state.leftArrow} onClick={this.handleLeftClick}>
								<FaAngleLeft/>
							</div>
							<div className="col-2 hand-icon text-center right-arrow" style={this.state.rightArrow} onClick={this.handleRightClick}>
								<FaAngleRight/>
							</div>
							<div className="col-2 hand-icon text-center double-right-arrow" style={{backgroundColor: "#8FBC8F", borderStyle: "ridge" }} onClick={this.handleDoubleRightClick}>
								<FaAngleDoubleRight/>
							</div>
							<div className="col-2 hand-icon text-center double-left-arrow" style={{backgroundColor: "lightblue", borderStyle: "ridge"}} onClick={this.toggleBoard}>
								<FaArrowsAltV />
							</div>
							<div className="col-1"></div>
						</div>
					</div>
					<div style={{height: "10px"}}>
					</div>
				</div>
			</div>
		)
	}

	//DONE
	toggleBoard = () => {
		this.setState({boardOrientation: !this.state.boardOrientation})
	}


	//Done?
	//When user drops a piece, the move gets input into the chess instance
	//  if the chess instance says the move is illegal then nothing happens
	//  else the chess instance gets updated and fen's state changes 
	//Returns: a value of true or false as required by the chessboard instance
	handlePieceDrop = (sourceSquare, targetSquare, piece) => {		
		let moved = this.game.move({
			from: sourceSquare, 
			to: targetSquare
		})
		if (!moved) {
			return false
		}

		//fix timestamp and if initial is black to move
		// really guessed and checked until the numbers matched
		let gameHistory = this.game.history()
		let notationHistory = this.state.history
		let timestamps = [...this.state.timestamps]
		let index = gameHistory.length-1
		let history = []
		let offset = 0

		// if black is first to move in initial position, set some offsets
		if ((gameHistory.length % 2 === 0 && this.game.turn() === 'b') || 
			(gameHistory.length % 2 === 1 && this.game.turn() === 'w')) {
			index+=1
			offset+=1
			history.push(null)
		}

		// if gameHistory.length is greater than notationHistory.length
		//   then rewrite history and clear timestamps
		if (gameHistory.length+offset > notationHistory.length) {
			history = [...history, ...this.game.history()]
			timestamps = []
		} else {
			// else if move is the same
			//    then keep current history
			if (gameHistory[index-offset] === notationHistory[index]) {
				history = [...this.state.history]
			} else {
				// else move is different
				//    then rewrite history and clear timestamps
				history = [...history, ...this.game.history()]
				timestamps = []
			}
		}
		this.setState(prevState => {
			return {
				fen: this.game.fen(),
				history: history,
				timestamps: timestamps, 	
				ply: prevState.ply+1,
			}
		})
		return true
	}

	//DONE,
	//Load game, set timer
	//Odd on length is white, even on index is black
	//Subtract 1 to get other side, just guess and check, don't think too hard!
	//edge case are abortions, figure out logic on that later!
	handleGameClick = (game) => {
		let newGame = new Chess()
		newGame.loadPgn(game.pgn)
		let gameComments = newGame.getComments()
		let gameHistory = newGame.history()
		let totalPly = gameHistory.length

		// if pgn doesn't include time, comments is blank
		// manually set the time if that is the case
		let comments
		if (gameComments.length !== gameHistory.length) {
			comments = gameHistory.map(ply => {
				return {comment: '[%clk No Time  ]'}
			})
		} else {
			comments = gameComments
		}

		// console.log('game from chess.js', newGame)
		// console.log('game from chess.com', game)

		// if its an analyzed game, sometimes black is first to move
		if ((totalPly % 2 === 0 && newGame.turn() === 'b') || 
			(totalPly % 2 === 1 && newGame.turn() === 'w')) {
			this.setState({history: [null]}, () => {
				this.setState({ 
					fen: newGame.fen(),
					history: [...this.state.history, ...newGame.history()],
					white: game.white,
					black: game.black,
					timestamps: comments.map((obj) => obj.comment),
					ply: comments.length+1,
					white_time: newGame.turn() === "w" ? comments[totalPly-2].comment : comments[totalPly-1].comment,
					black_time: newGame.turn() === "w" ? comments[totalPly-1].comment : comments[totalPly-2].comment,
				}, () => {
					this.game = newGame
					// console.log('>>>>', this.state)
				})
			})
		} else {
			this.setState({ 
				fen: newGame.fen(),
				history: newGame.history(),
				white: game.white,
				black: game.black,
				timestamps: comments.map((obj) => obj.comment),
				ply: comments.length,
				white_time: newGame.turn() === "w" ? comments[totalPly-2].comment : comments[totalPly-1].comment,
				black_time: newGame.turn() === "w" ? comments[totalPly-1].comment : comments[totalPly-2].comment,
			}, () => {
				this.game = newGame
				// console.log(this.state)
			})

		}
		
	}

	//DONE
	//Method is invoked from Notations.onMoveClick()
	//When invoked, it resets the game and board to that point in time,
	//Notation is not affected
	//Returns: Nothing
	handleNotationClick = (moveNum) => {
		let newGame = new Chess()

		let attempt
		if (this.props.chesscom && this.props.chesscom.initial_setup) {
			attempt = newGame.load(this.props.chesscom.initial_setup)			
		}
		if (!attempt) {
			let fen = this.game.header() && this.game.header().FEN
			if (fen) attempt = newGame.load(fen)
		}
		if (!attempt) {
			// console.log('Either new game or some unhandled error', this.game)
		}

		let ply = this.state.history[0] ? 0 : 1
		this.setState({ply}, () => {
			this.game = newGame
			let index = this.state.history[0] ? 0 : 1
			for (index; index <= moveNum; index++) {
				this.handleRightClick()
			}

		})


	}

	//DONE, just reset fen and timers, nothing else!
	handleDoubleLeftClick = () => {
		let newGame = new Chess()

		let attempt
		if (this.props.chesscom && this.props.chesscom.initial_setup) {
			attempt = newGame.load(this.props.chesscom.initial_setup)			
		}
		if (!attempt) {
			let fen = this.game.header() && this.game.header().FEN
			if (fen) attempt = newGame.load(fen)
		}
		if (!attempt) {
			// console.log('Either new game or some unhandled error', this.game)
		}

		this.game = newGame

		this.setState({ 
			fen: newGame.fen(),
			white_time: this.state.timestamps[0],
			black_time: this.state.timestamps[0],
			ply: this.state.history[0] ? 0 : 1,
		})
	}

	//DONE, just invoke handlerightclick
	handleDoubleRightClick = () => {
		let length = this.game.history().length
		for (let index = length; index < this.state.history.length; index++) {
			this.handleRightClick()
		}
	}

	//DONE, hard edge cases on 2 and 1
	handleLeftClick = () => {
		let isUndo = this.game.undo()
		// console.log(this.props.chesscom)
		// console.log(this.props.chesscom.initial_setup)
		// console.log(this.game.fen())
		if (!isUndo) return

		//todo: check lengths before invoking undo on chess
		let timestamps = this.state.timestamps
		let totalPly = this.game.history().length

		if (totalPly === 1) {
			this.setState({ 
				fen: this.game.fen(), 
				white_time: timestamps[0],
				black_time: timestamps[0],
				ply: this.state.history[0] ? 1 : 2,
			})
		} else if (totalPly === 0) {
			this.setState({ 
				fen: this.game.fen(),
				ply: this.state.history[0] ? 0 : 1,
			})
		} else 
		this.setState(prevState => {
			return { 
				fen: this.game.fen(), 
				white_time: this.game.turn() === "w" ? timestamps[totalPly-2] : timestamps[totalPly-1],
				black_time: this.game.turn() === "w" ? timestamps[totalPly-1] : timestamps[totalPly-2],
				ply: prevState.ply-1,
			}
		})
		return true
	}

	//DONE, edge cases are beginning and end
	handleRightClick = () => {
		let index = this.state.history[0] ? this.game.history().length : this.game.history().length+1
		if (index >= this.state.history.length) return
		// console.log(index)
		let move = this.state.history[index]
		let isMove = this.game.move(move)
		if (!isMove) return console.log('illegal move')

		if (index === 0) {
			this.setState({ 
				fen: this.game.fen(), 
				white_time: this.state.timestamps[index],
				black_time: this.state.timestamps[index],
				ply: 1,
			})
		} else if (index >= this.state.history.length) {
			this.setState({
				fen: this.game.fen(),
				ply: this.state.history.length,
			})
		} else {
			this.setState(prevState => {
				return { 
					fen: this.game.fen(),
					white_time: this.game.turn() === "w" ? this.state.timestamps[index-1] : this.state.timestamps[index],
					black_time: this.game.turn() === "w" ? this.state.timestamps[index] : this.state.timestamps[index-1],
					ply: prevState.ply+1
				}
			})
		}
		return true
	}
}

export default BoardWrapper