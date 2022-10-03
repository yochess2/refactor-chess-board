import React from "react"

export class Home extends React.Component {
	componentDidMount() {
		document.title = "YoChess"
	}
	render() {
		return (
				<div className="text-center">
					<h4>Welcome</h4>
				</div>
		)
	}
}

export default Home