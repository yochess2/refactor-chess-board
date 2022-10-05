import React, { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import ChessWebAPI from "chess-web-api"

import useWindowDimensions from "./utilities/useWindowDimensions"

const Streamers = ({ handleStreamers, streamers }) => {
	const api = new ChessWebAPI()
	const regex = /(?<=twitch.tv\/).+/

	useEffect(() => {
		let fetchStreamers = async () => {
			try {
				const res = await api.getStreamers()
				const s = res.body.streamers.filter(streamer => streamer.is_live)
				handleStreamers(s)
			} catch(err) {
				console.log('error: ', err)
			}
		}
		fetchStreamers()
	}, [])

	return (
		<div className="row">
			<div className="col-12 col-lg-4">
				<div className="list-group" style={{overflow:"auto", height: "400px"}}>
					{streamers.map((streamer, index) => {
						return (
							<NavLink 
								id={`streamer_${index+1}`}
							 	key ={`streamer_${index+1}`}
								to={`streamers/${streamer.twitch_url.match(regex)}`} 
								className="list-group-item list-group-item-action">
								{streamer.username}
							</NavLink>
						)
					})}
					
				</div>
			</div>
			<div className="col-12 col-lg-8">
				<Outlet />
			</div>

		</div>
	)
}




export default Streamers
