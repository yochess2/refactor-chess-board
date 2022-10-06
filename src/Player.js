import React from 'react'

import { FaTimesCircle } from "react-icons/fa"

export class Player extends React.Component {
	render() {
		let { extractDate, fixChessDate } = this.props
		let player = this.props.player
		return (<>
    		{this.props.player.username &&


			<div className="card mt-lg-5" style={{maxWidth: "574px"}}>
				<div className="row d-none d-lg-block ms-2">
					<div className="col">
			    		<h2><FaTimesCircle className="hand-icon" onClick={this.onClick}/> {player.username}</h2>
					</div>
				</div>

				<div className="row">
					{player.avatar &&
					<div className="col-12 col-sm-6 col-lg-12 d-none d-sm-block">
						<div className="card-header">
							<img src={player.avatar} className="card-img-top" alt="Logo" />
						</div>

					</div>
					}
					<div className="col-12 col-sm-6 col-lg-12">
						<div className="card-body">
							<div className="d-lg-none ms-2">
				    			<h2><FaTimesCircle className="hand-icon" onClick={this.onClick}/> {player.username}</h2>
				    		</div>

							<ul className="list-group">

								{(player.name || player.fide) &&
						    		<li className="list-group-item">
						    		    <p style={{margin: "0"}}>
						    		    	{player.title && <b>{player.title} </b> }
						    		    	<b>{player.name}</b>
						    		    </p>
						    		    {!!player.fide &&
						    		    <p style={{margin: "0"}}><b>Fide:</b> {player.fide}</p>
						    		    }
						    		</li>
								}
					    		    
					    		{player.joined &&
					    		<li className="list-group-item">
					    		    <p style={{margin: "0"}}><b>join date:</b> {extractDate(fixChessDate(player.joined)).monthYear}</p>
				    		    	<p style={{margin: "0"}}><b>last seen:</b> {extractDate(fixChessDate(player.last_online)).monthYear}</p>
					    		</li>
				    			}

				    		    {(player.chess_blitz || player.chess_bullet || player.chess_rapid) &&	
				    		    <li className="list-group-item">
				    		    	{player.chess_rapid &&
				    		    		<p style={{margin: "0"}}><b>Rapid:</b> {player.chess_rapid.last.rating}</p>
				    		    	}
				    		    	{player.chess_blitz &&
				    		    		<p style={{margin: "0"}}><b>Blitz:</b> {player.chess_blitz.last.rating}</p>
				    		    	}
				    		    	{player.chess_bullet &&
				    		    		<p style={{margin: "0"}}><b>Bullet:</b> {player.chess_bullet.last.rating}</p>
				    		    	}
				    		    </li>
				    		    }
			    		    </ul>
					  	</div>
					</div>
				</div>
			</div>

    		}
    			{/*		<div className="card mt-md-5 mt-2">
			</div>*/}
	</>)
	}
	onClick = (e) => this.props.handlePlayer({})

}

export default Player