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
					    		<li className="list-group-item">
					    		    name: {player.name}
					    		</li>
					    		    
					    		{player.joined &&
					    		<li className="list-group-item">
					    		    join date: {extractDate(fixChessDate(player.joined)).monthYear}
					    		</li>
				    			}
				    		    
				    		    <li className="list-group-item">
				    		    	last seen: {extractDate(fixChessDate(player.last_online)).monthYear}
				    		    </li>
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