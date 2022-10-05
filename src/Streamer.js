import React from 'react'
import { useParams } from 'react-router-dom'
import { TwitchPlayerNonInteractive } from 'react-twitch-embed'

const Streamer = () => {
	const { streamer } = useParams()
	return (
		<div className="mt-5">
			<TwitchPlayerNonInteractive channel={streamer} autoplay muted style={{width: "100%"}}/>
		</div>
	)
}

export default Streamer