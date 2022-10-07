import React from 'react'

const PlayerDetails = ({ isFlip, player1, player2 }) => {
	const player = isFlip ? player2 : player1
	return (
		<div className="player-details-wrapper">
			<h4>
				<span>{player.name || player.username}</span>
				<span> ({player.rating})</span>
			</h4>
		</div>
	)
}

export default React.memo(PlayerDetails)