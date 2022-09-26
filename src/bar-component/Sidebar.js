import React from "react"
import { NavLink } from "react-router-dom"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"

export class Sidebar extends React.Component {
	constructor(props) {
		super(props) // location is passed down as prop
		this.state = {
			toggle: true
		}
	}

	render() {
		console.log(this.state)
		return (
			<>
			{/* Sidebar Heading */}
			
				<div className="text-center text-sm-start border-bottom p-1">
					<div 
						className="sidebar-heading" 
						data-bs-toggle="collapse" 
						data-bs-target="#sidemenu"
						role="button"
						aria-expanded="true"
						aria-controls="collapseSidebar"
						onClick={this.toggle}>
						{this.getName(this.props.location.pathname.toLowerCase())}
						<span>
							{this.state.toggle 	? 
							<FaCaretDown /> 	:
							<FaCaretUp /> 		}
						</span>
					</div>
				</div>
			
			{/* SIdebar Heading End */}

			{/* Sidebar Content */}
			<div className="sidebar-container">
				<div className="show mt-2" id="sidemenu">
					<div className="list-group">
						<NavLink 
							to="home" 
							className="list-group-item list-group-item-action">
							Home
						</NavLink>
						<NavLink 
							to="board" 
							className="list-group-item list-group-item-action">
							Board
						</NavLink>		
						<NavLink 
							to="games" 
							className="list-group-item list-group-item-action">
							Games
						</NavLink>
					</div>
				</div>
			</div>
			{/* End Sidebar Content */}
			</>
		)
	}


	toggle = () => {
		// console.log(this.state)
		this.setState({ toggle: !this.state.toggle })
	}

	// helper method
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