import React from 'react'

export class Err extends React.Component {
	constructor(props) {
		super(props) // error is passed down
	}

	render(props) {
		return (
			<div>
			    {/* Error Message */}
				{this.props.error.value &&
				<div className="alert alert-danger" role="alert" >
					{this.props.error.message}
				</div>
				}{/* Error Message */}
			</div>
		)
	}
}

export default Err