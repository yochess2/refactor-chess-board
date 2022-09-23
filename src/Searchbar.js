import React from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

export class Searchbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			startDate: new Date(),
		}
	}

	render() {
		return (
	    	<div className="row">
				<div className="input-group">
					<button 
						className="btn btn-info dropdown-toggle" 
						type="button" 
						data-bs-toggle="dropdown" 
						aria-expanded="false">
						Dropdown
					</button>
					<ul className="dropdown-menu" onClick={this.handleCalendarDropdown}>
						<Calendar 
							maxDetail="year"
							onChange={this.handleOnDateChange}
							value={this.state.date}/>
					</ul>
					<input 
						type="search"
						placeholder="Search Username"
						className="form-control"
						value={this.state.username}
						onChange={this.handleOnUserChange} 
						aria-label="Search Username"
					/>
					<button className="btn btn-primary" onClick={this.onUserSearch}>Search</button>
				</div>
			</div>
		)
	}

	handleCalendarDropdown = (event) => {
		event.stopPropagation()
	}

	handleOnUserChange = (event) => {
		this.setState({ username: event.target.value })
	}

	handleOnDateChange = (date) => {
		this.setState({ startDate: date })
	}

	//TODO: Calendar logic
	onUserSearch = (event) => {
		console.log('event', event)
		event.preventDefault()
		this.props.handleUserSearch(this.state.username)
	}
}

export default Searchbar