import React from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'
// import { FaSearch } from "react-icons/fa"


export class Searchbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			date: null,
		}
		this.myRef = React.createRef()
	}

	render() {
		console.log(this.state)
		return (
	    	<div className="row">
				<div className="input-group search-inputs">
					<button 
						ref={this.myRef}
						className="btn btn-info dropdown-toggle" 
						type="button" 
						data-bs-toggle="dropdown" 
						aria-expanded="false">
						<span>
							{!this.state.date ? 'Set Month' : this.formatMonth(this.state.date, null)}
						</span>
					</button>
					<ul className="dropdown-menu m-0" onClick={this.handleCalendarDropdown}>
						<Calendar 
							maxDetail="year"
							value={this.props.date}
							onClickMonth={this.onMonthClick}
						/>
					</ul>
					<input 
						type="search"
						placeholder="Search Username"
						className="form-control"
						value={this.state.username}
						onChange={this.onUserChange} 
						aria-label="Search Username"
					/>
					<button
						id="usersearch01" 
						className="btn btn-primary" 
						onClick={this.handleUserSearch}>
						Search
					</button>
				</div>
			</div>
		)
	}

	formatMonth = (date, monthVal) => {
		return date.toLocaleString('default', { month: monthVal || 'short', year: 'numeric' })
	}

	//Had to play around a bit to figure this out, not sure if right
	handleCalendarDropdown = (event) => {
		event.stopPropagation()
	}

	onMonthClick = (date) => {
		this.setState({ date })
		this.myRef.current.click()
	}

	onUserChange = (event) => {
		let username = event.target.value
		this.setState({ username })
	}

	//TODO: don't allow search if no name typed
	handleUserSearch = (event) => {
		event.preventDefault()
		if (this.state.username.length === 0) {
			return
		}

		this.props.handleUserSearch(this.state.username, this.state.date)
		this.props.handleMobile()
	}
}

export default Searchbar