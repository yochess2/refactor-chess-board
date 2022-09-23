import React from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

export class Searchbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
		}

		//Only workabout I can find on dropdown menu
		this.myRef = React.createRef()
	}

	componentDidUpdate(prevProps, prevState) {
		// console.log("    Searchbar - ComponentDidUpdate", this.props, prevProps, this.state, prevState)
	}

	render() {
		return (
	    	<div className="row">
				<div className="input-group">
					<button 
						ref={this.myRef}
						className="btn btn-info dropdown-toggle" 
						type="button" 
						data-bs-toggle="dropdown" 
						aria-expanded="false">
						<span>
							{!this.props.date ? 'Select Month' : this.formatMonth(this.props.date)}
						</span>
					</button>
					<ul className="dropdown-menu" onClick={this.handleCalendarDropdown}>
						<Calendar 
							maxDetail="year"
							value={this.props.date}
							onClickMonth={this.handleMonthClick}
						/>
					</ul>
					<input 
						type="search"
						placeholder="Search Username"
						className="form-control"
						value={this.state.username}
						onChange={this.handleUserChange} 
						aria-label="Search Username"
					/>
					<button className="btn btn-primary" onClick={this.onUserSearch}>Search</button>
				</div>
			</div>
		)
	}

	formatMonth = (date) => {
		console.log(date)
		return date.toLocaleString('default', { month: 'long', year: 'numeric' })
	}

	//Had to play around a bit to figure this out, not sure if right
	handleCalendarDropdown = (event) => {
		event.stopPropagation()
	}

	handleMonthClick = (date) => {
		this.props.handleDate(date)
		this.myRef.current.click()
	}

	handleUserChange = (event) => {
		this.setState({ username: event.target.value })
	}

	//TODO: Calendar logic
	onUserSearch = (event) => {
		console.log('event', event)
		event.preventDefault()
		this.props.handleUserSearch(this.state.username, this.state.date)
	}
}

export default Searchbar