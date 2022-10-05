import React from 'react'
import { useParams } from 'react-router-dom'
import { TwitchPlayerNonInteractive } from 'react-twitch-embed'

const Streamer = () => {
	const { streamer } = useParams()
	return (
		<div>
			<TwitchPlayerNonInteractive channel={streamer} autoplay muted style={{width: "100%", maxHeight: "400px"}}/>
		</div>
	)
}

export default Streamer