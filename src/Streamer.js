import React, { useEffect } from 'react'
import { TwitchPlayerNonInteractive } from 'react-twitch-embed'
import ChessWebAPI from "chess-web-api"

const Streamer = ({handlePlayer, handleError, selectedOption}) => {
	useEffect(() => {
		if (!selectedOption) return
		const fetchPlayerData = async () => {
			const api = new ChessWebAPI()
			let res
			try {
				res = await api.getPlayer(selectedOption.value) // gets chess.com username to display on display card on side
			} catch (err) {
				console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>', err)
				res = err
			}
			return res
		}
		fetchPlayerData()
			.then(res => handlePlayer(res.body))
			.catch(err => handleError(err))
	}, [handleError, handlePlayer, selectedOption])

	return (
		<>
			{selectedOption &&
			<TwitchPlayerNonInteractive channel={selectedOption.username} autoplay muted/>
			}
		</>
	)
}

export default Streamer