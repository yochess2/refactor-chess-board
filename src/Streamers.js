import React, { useEffect, useState  } from 'react'
import Select from 'react-select'
import ChessWebAPI from "chess-web-api"

import Streamer from "./Streamer"
const regex = /twitch.tv\/(.*)/

// const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


const Streamers = ({handleError, handlePlayer}) => {
	// const navigate = useNavigate()
	const [options, setOptions] = useState()
	const [selectedOption, setSelectedOption] = useState()
	
	useEffect(() => {
		let fetchStreamers = async () => {
			const api = new ChessWebAPI()
			let res
			try {
				res = await api.getStreamers()
			} catch (err) {
				res = err
			}
			return res
		}
		fetchStreamers()
			.then(res => res.body ? getStreamers(res.body.streamers) : handleError(true, "no response from chess.com"))
			.then(streamers => { setOptions(streamers) })
			.catch(err => handleError(true, err))

		function getStreamers(streamers) {
			if (!streamers) return handleError(true, "streamers not provided by response")
			return streamers.filter(s => s.is_live).map(s => ({
				value: s.username,
				label: s.username,
				url: s.twitch_url,
				username: s.twitch_url.match(regex)[1]
			}))
		}
	}, [handleError])

	return (<>
		<div>
			<div className="streamer-list text-center">
				<Select 
					options={options} 
					onChange={setSelectedOption}
					placeholder='Search Twitch Streamer' 
					defaultValue={selectedOption} />
			</div>
		</div>
		<div className="mt-5 row">
			<Streamer 
				handlePlayer={handlePlayer}
				handleError={handleError} 
				selectedOption={selectedOption} />
		</div>
</>)
}

export default Streamers
