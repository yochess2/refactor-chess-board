import React from "react"
import { NavLink } from "react-router-dom"

export class Sidebar extends React.Component {
	render() {
		return (
			<div className="list-group mt-2">
				<h4 className="p-1 border-bottom">Sidebar</h4>
				<NavLink 
					to="/home" 
					exact="true"
					className="list-group-item list-group-item-action">
					Home
				</NavLink>
				<NavLink 
					to="/board" 
					exact="true"
					className="list-group-item list-group-item-action">
					Board
				</NavLink>		
				<NavLink 
					to="/games" 
					exact="true"
					className="list-group-item list-group-item-action">
					Games
				</NavLink>	
			</div>
		)
	}
}

export default Sidebar