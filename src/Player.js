import React from 'react'

import { FaTimesCircle } from "react-icons/fa"

export class Player extends React.Component {
	render() {
		let { extractDate, fixChessDate } = this.props
		let player = this.props.player

		console.log('>>', this.props)
		return (<>
    		{this.props.player.username &&
    		    <div className="row mt-md-5" style={{border:"solid"}}>
	    		    <h2><FaTimesCircle type="button" onClick={this.onClick}/> Player Info </h2>
	    		    <p className="m-0">
	    		    	username: {player.username}
	    		    </p>
	    		    
	    		    <p className="m-0">
	    		    	real name: {player.name}
	    		    </p>
	    		    
	    		    {player.joined &&
	    		    <p className="m-0">
	    		    	joined date: {extractDate(fixChessDate(player.joined)).monthYear}
	    		    </p>
	    			}
	    		    
	    		    <p className="m-0">
	    		    	last seen: {extractDate(fixChessDate(player.last_online)).monthYear}
	    		    </p>


    		    </div>
    		}

	</>)
	}
	onClick = (e) => this.props.handlePlayer({})

}

export default Player