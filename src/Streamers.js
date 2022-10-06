import React, { useEffect, useState  } from 'react'
import Select from 'react-select'
import ChessWebAPI from "chess-web-api"

import Streamer from "./Streamer"
const regex = /twitch.tv\/(.*)/


const Streamers = ({handleError, handlePlayer}) => {
	// const navigate = useNavigate()
	const [options, setOptions] = useState("")
	const [selectedOption, setSelectedOption] = useState("")
	
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
			.then(res => setOptions(getStreamers(res.body.streamers)))
			.catch(err => handleError(err))

		function getStreamers(streamers) {
			return streamers.filter(s => s.is_live).map(s => ({
				value: s.username,
				label: s.username,
				url: s.twitch_url,
				username: s.twitch_url.match(regex)[1]
			}))
		}
	}, [handleError])

	useEffect(() => {
		// console.log(options)
	}, [options])

	//TODO: figure out how to use navigate correctly, this renders twice
	useEffect(() => {
		if (!selectedOption || !selectedOption.url || !(selectedOption.url.match(regex))) return 
		// console.log('selected: ', selectedOption)
		// let url = selectedOption.url.match(regex)[1]
		// navigate(url)
	}, [selectedOption])

	return (<>
		<div>
			<div className="streamer-list text-center">
				<Select options={options} onChange={setSelectedOption} defaultValue={selectedOption} />
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
