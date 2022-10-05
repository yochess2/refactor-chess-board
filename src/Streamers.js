import React, { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import Select from 'react-select'
import ChessWebAPI from "chess-web-api"

const Streamers = ({ handleStreamers, streamers }) => {
	const regex = /(?<=twitch.tv\/).+/
	const navigate = useNavigate()

	// console.log(streamers)
	const options = streamers.map(s => (
		{
			value: s.username,
			label: s.username,
			url: s.twitch_url
		}
	))

	useEffect(() => {
		let fetchStreamers = async () => {
			const api = new ChessWebAPI()
			try {
				const res = await api.getStreamers()
				const s = res.body.streamers.filter(streamer => streamer.is_live)
				handleStreamers(s)
			} catch(err) {
				console.log('error: ', err)
			}
		}
		fetchStreamers()
	}, [handleStreamers])

	return (<>
		<div>
			<div className="streamer-list text-center">

				<Select 
					options={options}
					onChange={option => {
						navigate(option.url.match(regex)[0])
					}}
				/>
			</div>
		</div>
		<div>
			<Outlet />
		</div>
</>)
}

export default Streamers
