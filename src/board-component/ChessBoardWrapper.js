import React, { useEffect } from 'react'
import { Chessboard } from "react-chessboard" 

const ChessBoardWrapper = ({ isFlip, fen, handlePieceDrop, boardWidth, setBoardWidth }) => {
	const boardOrientation = isFlip ? "white" : "black"
	useEffect(() => {
		window.addEventListener("resize", handleResize)
		handleResize()
		return () => window.removeEventListener("resize", handleResize)
		function handleResize() {
			let display = document.getElementsByClassName("chess-board-wrapper")[0]
			setBoardWidth(display.offsetWidth)
		}
	})
	return (
		<div className="chess-board-wrapper">
			<Chessboard 
				id="BasicBoard" 
				boardOrientation={boardOrientation}
				boardWidth={boardWidth}
				position={fen}
				onPieceDrop={handlePieceDrop} //either true or false is returned
				showBoardNotation={true}
				animationDuration={0}
				areArrowsAllowed={true}
			/>
		</div>
	)
}

export default React.memo(ChessBoardWrapper)