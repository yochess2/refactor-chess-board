import React from "react"
import { NavLink } from "react-router-dom"

export class Sidebar extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className="list-group mt-2">
				<h4 className="p-1 border-bottom">
					{this.getName(this.props.location.pathname.toLowerCase())}
				</h4>
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

	getName = (pathname) => {
		if (pathname.match("/games")) {
			return "Games"
		} else if (pathname.match("/home")) {
			return "Home"
		} else if (pathname.match("/board")) {
			return "Board"
		} else {
			return "Sidebar"
		}
	}
}

export default Sidebar