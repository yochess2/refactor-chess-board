import React from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

export class Searchbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			fromDate: null,
			toDate: null,
		}
		this.fromRef = React.createRef()
		this.toRef = React.createRef()
	}

	render() {
		console.log(this.state)
		return (
	    	<div className="row">

	    		<div 
	    			className="col-md-6" 
					style={{margin: 0, padding: 0}}

	    		>


					<div className="input-group search-inputs">
						{/* From Button */}
						<button 
							style={{width: "50%"}}
							ref={this.fromRef}
							className="btn btn-dark dropdown-toggle" 
							type="button" 
							data-bs-toggle="dropdown" 
							aria-expanded="false">
							<span>
								{!this.state.fromDate ? 'From Month' : this.formatMonth(this.state.fromDate, null)}
							</span>
						</button>
						<ul 
							className="dropdown-menu m-0"
							onClick={this.handleCalendarDropdown}
							title="from-calendar"
						>
							<Calendar 
								maxDetail="year"
								value={this.props.fromDate}
								onClickMonth={(toDate) => this.onMonthClick(toDate, "fromDate")}
							/>
						</ul>



						{/* To Button */}
						<button 
							style={{width: "50%"}}
							ref={this.toRef}
							className="btn btn-info dropdown-toggle" 
							type="button" 
							data-bs-toggle="dropdown" 
							aria-expanded="false">
							<span>
								{!this.state.toDate ? 'To Month' : this.formatMonth(this.state.toDate, null)}
							</span>
						</button>
						<ul 
							className="dropdown-menu m-0" 
							onClick={this.handleCalendarDropdown}
							title="to-calendar"
						>
							<Calendar 
								maxDetail="year"
								value={this.props.toDate}
								onClickMonth={(toDate) => this.onMonthClick(toDate, "toDate") }
							/>
						</ul>
					</div>
				</div>

				<div 
					className="col-md-6" 
					style={{margin: 0, padding: 0}}
				>
					<div className="input-group search-inputs">
						{/* Search Input */}
						<input 
							type="search"
							placeholder="Search Username"
							className="form-control"
							value={this.state.username}
							onChange={this.onUserChange} 
							aria-label="Search Username"
						/>

						

						{/* Search Button */}
						<button
							id="usersearch01" 
							className="btn btn-primary" 
							onClick={this.handleUserSearch}>
							Search
						</button>
					</div>
				</div>


			</div>
		)
	}

	formatMonth = (date, monthVal) => {
		return date.toLocaleString('default', { month: monthVal || 'short', year: 'numeric' })
	}

	handleCalendarDropdown = (event) => {
		event.stopPropagation()
	}

	onMonthClick = (date, type) => {
		if (type === "fromDate") {
			this.setState({ fromDate: date }, () => {
				this.fromRef.current.click()
				this.toRef.current.click()
			})
		}
		if (type === "toDate") {
			this.setState({ toDate: date })
			this.toRef.current.click()
		}
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

		this.props.handleUserSearch(this.state.username, this.state.fromDate, this.state.toDate)
		this.props.handleMobile()
	}
}

export default Searchbar