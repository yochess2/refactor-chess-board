import React, { Component } from "react";

class Navbar extends Component {
	render() {
		return (
			<>
				<nav className="navbar navbar-expand-sm bg-dark navbar-dark">
					<div className="container-fluid">
					    <a className="navbar-brand" href="#">YoChess</a>
					    <button 
					    	className="navbar-toggler" 
					    	type="button" 
					    	data-bs-toggle="collapse" 
					    	data-bs-target="#navmenu"
					    >
					    	<span className="navbar-toggler-icon"></span>
					    </button>
					    <div className="collapse navbar-collapse" id="navmenu">
					    	<ul className="navbar-nav ms-auto">
					    		<li className="nav-item">
					    			<a href="#learn" className="nav-link">Home</a>
					    		</li>
					    		<li className="nav-item">
					    			<a href="#projects" className="nav-link">Projects</a>
					    		</li>
					    		<li className="nav-item">
					    			<a href="#resume" className="nav-link">Resume</a>
					    		</li>
					    	</ul>
					    </div>
					</div>
				</nav>
			</>
		)
	}
}

export default Navbar;