import React from 'react'

import { FaTimesCircle } from "react-icons/fa"

export class Player extends React.Component {
	render() {
		console.log(this.props)
		let { extractDate, fixChessDate } = this.props
		let player = this.props.player
		return (<>

    		{this.props.player.username &&

			<div className="card mt-md-5 mt-2">
				<div class="card-header">
	    		<h2><FaTimesCircle type="button" onClick={this.onClick}/> {player.username}</h2>
					
				</div>
				<div className="card-body">
					{player.avatar &&
					<img src={player.avatar} className="card-img-top d-none d-sm-block" alt="Logo" />
					}
					<ul className="list-group list-group-flush">
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
    		}
	</>)
	}
	onClick = (e) => this.props.handlePlayer({})

}

export default Player