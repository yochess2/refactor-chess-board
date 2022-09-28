import React from 'react'

export class ErrorMessage extends React.Component {
	render(props) {
		return (
			<div>
			    {/* Err Message */}
				{this.props.error.value &&
				<div className="alert alert-danger" role="alert" >
					{this.props.error.message}
				</div>
				}{/* Err Message */}
			</div>
		)
	}
}

export default ErrorMessage