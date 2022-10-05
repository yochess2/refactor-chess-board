import React from "react"

export class Home extends React.Component {
	componentDidMount() {
		document.title = "YoChess"
	}
	render() {
		return (
				<div className="text-center mt-4">
					<h4>Site Walkthrough</h4>

					<div className="youtube-video mt-4">
						<iframe 
							width="560" 
							height="315" 
							src="https://www.youtube.com/embed/79C_6_cPe2A" 
							title="YouTube video player" 
							frameborder="0" 
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
							allowfullscreen>
						</iframe>
					</div>
				</div>
		)
	}
}

export default Home