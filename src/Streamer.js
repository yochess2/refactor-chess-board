import React from 'react'
import { useParams } from 'react-router-dom'
import { TwitchPlayerNonInteractive } from 'react-twitch-embed'

const Streamer = () => {
	const { streamer } = useParams()
	return (
		<>
			<TwitchPlayerNonInteractive channel={streamer} autoplay muted style={{width: "100%"}}/>
		</>
	)
}

export default Streamer