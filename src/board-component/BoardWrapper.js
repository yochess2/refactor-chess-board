import React from "react"
import { Chess } from "chess.js"

import ArrowButtons from "./ArrowButtons"
import PlayerDetails from "./PlayerDetails"
import TimerDetails from "./TimerDetails"
import ChessBoardWrapper from "./ChessBoardWrapper"

import Notations from "./Notations"

export class BoardWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.game = new Chess()

		this.state = {
			// board properties
			boardWidth: "256",
			isFlip: true,
			fen: this.game.fen(),

			// notations
			ply: this.game.history() && this.game.history.length,
			history: [],

			// player information
			timestamps: [],
			blackTime: "",
			whiteTime: "",
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
		}
	}

	componentDidMount() {
		document.title = "YoChess - Board"
		if (this.props.chesscom) {
			this.handleGameClick(this.props.chesscom)
		}
	}

	render() {
		const { isFlip, white, black, whiteTime, blackTime, fen, ply, history, boardWidth } = this.state
		const { result } = this.props
		const { handlePieceDrop, handleNotationClick, setBoardWidth } = this

		const turn = this.game.turn()

		return (
			<div className="container">

				{/* ROW 1 */}
				<div className="row">
					<div className="col-8 col-md-6">
						<PlayerDetails isFlip={isFlip} player1={white} player2={black} />
					</div>
					<div className="col-4 col-md-2">
						<TimerDetails isFlip={isFlip} timer1={whiteTime} timer2={blackTime} turn={turn} letter="b" />
					</div>
					<div className="col-4"></div>
				</div>

				{/* ROW 2 */}
				<div className="row">
					<div className="col-md-8">
						<ChessBoardWrapper isFlip={isFlip} fen={fen} handlePieceDrop={handlePieceDrop} boardWidth={boardWidth} setBoardWidth={setBoardWidth} />
					</div>
					<div className="col-md-4 d-none d-md-block" style={{height: boardWidth, overflow: "auto"}}>
						<Notations ply={ply} history={history} onNotationClick={handleNotationClick} />
					</div>
				</div>

				{/* ROW 3 */}
				<div className="row">
					<div className="col-8 col-md-6">
						<PlayerDetails isFlip={isFlip} player1={black} player2={white} />
					</div>
					<div className="col-4 col-md-2">
						<TimerDetails isFlip={isFlip} timer1={blackTime} timer2={whiteTime} turn={turn} letter="w" />
					</div>
					<div className="col-md-4 text-center">
					{result && <h4>{result.score}, {result.description}</h4> }
					</div>
				</div>
				{/* Buttons */}
				<div className="row">
					<div className="col-md-8">
					<ArrowButtons 
						handleDoubleLeftClick={this.handleDoubleLeftClick}
						handleLeftClick={this.handleLeftClick}
						handleRightClick={this.handleRightClick}
						handleDoubleRightClick={this.handleDoubleRightClick}
						toggleBoard={this.toggleBoard}
					/>
					</div>
				</div>
				<div style={{height: "10px"}}>
				</div>
			</div>
		)
	}

	// redundantly done in child component
	setBoardWidth = (boardWidth) => this.setState({boardWidth})
	

	//DONE
	toggleBoard = () => this.setState({isFlip: !this.state.isFlip})


	//Done?
	//When user drops a piece, the move gets input into the chess instance
	//  if the chess instance says the move is illegal then nothing happens
	//  else the chess instance gets updated and fen's state changes 
	//Returns: a value of true or false as required by the chessboard instance
	handlePieceDrop = (sourceSquare, targetSquare, piece) => {		
		// here we want to see if the move is legal
		// if it is not legal then do not allow it
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
					whiteTime: newGame.turn() === "w" ? comments[totalPly-2].comment : comments[totalPly-1].comment,
					blackTime: newGame.turn() === "w" ? comments[totalPly-1].comment : comments[totalPly-2].comment,
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
				whiteTime: newGame.turn() === "w" ? comments[totalPly-2].comment : comments[totalPly-1].comment,
				blackTime: newGame.turn() === "w" ? comments[totalPly-1].comment : comments[totalPly-2].comment,
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
			return
			// console.log('Either new game or some unhandled error', this.game)
		}

		let ply = this.state.history[0] ? 0 : 1
		this.setState({ ply }, () => {
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
			return
			// console.log('Either new game or some unhandled error', this.game)
		}

		this.game = newGame

		this.setState({ 
			fen: newGame.fen(),
			whiteTime: this.state.timestamps[0],
			blackTime: this.state.timestamps[0],
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
				whiteTime: timestamps[0],
				blackTime: timestamps[0],
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
				whiteTime: this.game.turn() === "w" ? timestamps[totalPly-2] : timestamps[totalPly-1],
				blackTime: this.game.turn() === "w" ? timestamps[totalPly-1] : timestamps[totalPly-2],
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
				whiteTime: this.state.timestamps[index],
				blackTime: this.state.timestamps[index],
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
					whiteTime: this.game.turn() === "w" ? this.state.timestamps[index-1] : this.state.timestamps[index],
					blackTime: this.game.turn() === "w" ? this.state.timestamps[index] : this.state.timestamps[index-1],
					ply: prevState.ply+1
				}
			})
		}
		return true
	}
}

export default BoardWrapper