import React from "react"
import { NavLink } from "react-router-dom"
import { FaBars } from "react-icons/fa"

export class Sidebar extends React.Component {
	constructor(props) {
		super(props) // location is passed down as prop
	}

	render() {
		return (
			<>
			{/* Sidebar Heading */}
			<div className="row border-bottom sidebar-header">
				<div className="col-9">
					<span className="p-1 sidebar-heading">
						{this.getName(this.props.location.pathname.toLowerCase())}
					</span>
				</div>
				<div className="col-3">
					<span className="p-1 border-bottom collapse-sidebar-btn">
						<FaBars
							type="button" 
							data-bs-toggle="collapse" 
							data-bs-target="#sidemenu"
							role="button"
							aria-expanded="true"
							aria-controls="collapseSidebar"/>

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

	//TODO
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