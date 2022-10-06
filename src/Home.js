import React from "react"

export class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			width: 530,
			height: 315,
		}
	}

	componentDidMount() {
		document.title = "YoChess"
		window.addEventListener("resize", this.resize);
		this.resize();
	}
	resize = () => {
		let display = document.getElementsByClassName("home-wrapper")[0]
	    this.setState({
	    	width: display.offsetWidth, height: display.offsetWidth/1.7777
	    });
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.resize);
	}

	render() {
		return (<>
			<div className="text-center mt-4 home-wrapper">
				<h4>Site Walkthrough</h4>

				<div className="youtube-video mt-4">
					<iframe 
						width={this.state.width}
						height={this.state.height}
						src="https://www.youtube.com/embed/79C_6_cPe2A" 
						title="YouTube video player" 
						frameBorder="0" 
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
						allowFullScreen>
					</iframe>
				</div>
				<div>
					<p>Link to Repo is on <a target="_blank" rel="noreferrer" href="https://github.com/yochess2/refactor-chess-board">Github</a></p>
				</div>
			</div>
	</>)
	}
}

export default Home