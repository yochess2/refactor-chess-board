import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import Searchbar from "./Searchbar"

export class Navbar extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<>
				<nav className="navbar navbar-expand-md bg-dark navbar-dark navbar-style">
					<div className="container-fluid">
						<NavLink 
							to="/" 
							className="navbar-brand nav-link">
							Yochess
						</NavLink>	
					    <button 
					    	className="navbar-toggler" 
					    	type="button" 
					    	data-bs-toggle="collapse" 
					    	data-bs-target="#navmenu"
					    >
					    	<span className="navbar-toggler-icon">
					    	</span>
					    </button>
					    <div className="collapse navbar-collapse" id="navmenu">
					    	<ul className="navbar-nav me-auto mb-2 mb-lg-0">
					    		<li className="nav-item">
									<NavLink 
										to="/home" 
										activeclassname="active"
										className="navbar-brand nav-link">
										Home
									</NavLink>	

					    		</li>
					    		<li className="nav-item">
						    		<NavLink 
						    			to="/board" 
						    			activeclassname="active"
						    			className="navbar-brand nav-link">
						    			Board
						    		</NavLink>	
					    		</li>
					    		<li className="nav-item">
									<NavLink 
										to="/games" 
										activeclassname="active"
										className="navbar-brand nav-link">
										Games
									</NavLink>
					    		</li>
					    	</ul>
					    </div>
					</div>
				</nav>
			</>
		)
	}

	handleWindowSizeChange = () => {
		this.setState({ width: window.innerWidth })
	}
}

export default Navbar;