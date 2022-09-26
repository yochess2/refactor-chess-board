import React from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export class Searchbar extends React.Component {
	constructor(props) {
		super(props) // handleUserSearch(), onError() are passed down as props

		//TODO: Refactor to objects someday
		this.state = {
			username: "",
			displayStartDate: null,
			displayEndDate: null,
			formStartDate: null,
			formEndDate: null
		}
		this.startDateRef = React.createRef()
		this.endDateRef = React.createRef()
	}

	//TODO: Fix Styling
	render() { 
		let { formatMonth, onStartMonthClick, onEndMonthClick, handleUserSearch, onUserChange } = this
		let { displayStartDate, displayEndDate, formStartDate, formEndDate, username } = this.state
		return (
	    	<div className="row mt-2">

	    		{/* Error Message */}
	    		{this.props.children}
		    	{/* End Error Message */}


	    		{/* First Group: Start and End Date */}
	    		<div className="col-md-6">
					<div className="input-group dropdown-button">


						{/* Start Button */}
						<button
							ref={this.startDateRef}
							className="btn btn-secondary dropdown-toggle" 
							type="button btn-outline" 
							data-bs-toggle="dropdown" 
							aria-expanded="false">
							<span>
								{!displayStartDate ? "From Month" : formatMonth(displayStartDate)}
							</span>
						</button>
						<ul className="dropdown-menu m-0"onClick={e => e.stopPropagation()}>
							<Calendar 
								maxDetail="year"
								value={formStartDate}
								onClickMonth={onStartMonthClick} />
						</ul>
						{/* End Start Button */}


						{/* Start Button */}
						<button 
							ref={this.endDateRef}
							className="btn btn-secondary dropdown-toggle" 
							type="button" 
							data-bs-toggle="dropdown" 
							aria-expanded="false">
							<span>
								{!displayEndDate ? "To Month" : formatMonth(displayEndDate)}
							</span>
						</button>
						<ul className="dropdown-menu m-0" onClick={e => e.stopPropagation()}>
							<Calendar 
								maxDetail="year"
								value={formEndDate}
								onClickMonth={onEndMonthClick} />
						</ul>
						{/* End End Button */}


					</div>
				</div>
				{/* End First Group */}


				{/* Second Group: Input and Search */}
				<div className="col-md-6">
					<div className="input-group search-inputs">

					
						{/* Username Input */}
						<input 
							type="search"
							placeholder="Search Username"
							className="form-control"
							value={username}
							onChange={onUserChange} 
							aria-label="Search Username"/>
						{/* End Username Input */}


						{/* Search Button */}
						<button
							id="usersearch01" 
							className="btn btn-primary btn-outline" 
							onClick={handleUserSearch}>
							Search
						</button>
						{/* End Search Button */}

					</div>
				</div>
			</div>
		)
	}


	/* onStartMonthClick (x)
		invoker:	Start Month Calendar (date) - User clicks on a date
		invokee:	App - onError(<bool> value, <str> message)
		effects: 	binds <dom> StartMonth to React Library
	*/
	onStartMonthClick = (date, event) => {
		this.setState({
			displayStartDate: date,
			formStartDate: date
		}, () => {
			this.toggleCalendar(true, true)
			this.props.onError(false, "", null)
		})
	}


	/* onEndMonthClick (x)
		invoker:	A) Start Month Calendar (date) - User clicks on a date
					B) onStartMonthClick() -> toggleCalendar(true, true) ->
		invokee:	App - onError(<bool> value, <str> message)
		effects: 	binds <dom> StartMonth to React Library
	*/
	onEndMonthClick = (date, event) => {
		if (date < this.state.displayStartDate) 
			return this.props.onError(true, "Ending Date cannot be less than Starting Date")
		this.setState({ displayEndDate: date, formEndDate: date }, () => {
			this.toggleCalendar(false, true)
			this.props.onError(false, "", null)
		})
	}


	// onUserChange (x) - binds <dom> Search Input to React Library
	onUserChange = (event) => this.setState({ username: event.target.value })


	/* handleUserSearch (x)
		Invoker:	Search Button (username, fromDate, toDate)
		Invokee:	App - HandleUserSearch (username, fromDate, toDate)

		params: 	<dom> event
		effect: 	Sends (username, fromDate, toDate) up to the App Component
	*/
	handleUserSearch = (event) => {
		event.preventDefault()
		let { username, formEndDate, formStartDate, } = {...this.state}
		if (!username) 
			return this.props.onError(true, "Please enter a username!")
		if (!formEndDate || !formStartDate || (formEndDate < formStartDate))
			return this.props.onError(true, "Dates are invalid!")
		this.props.onError(false, "", () => {
			this.props.handleUserSearch(username, formStartDate, formEndDate)
		})
	}


          ////////////////////
         /* Helper Methods */
        ////////////////////


	// toggleCalendar (x) - Toggles both calendars (invokes App.onError)
	toggleCalendar = (isStart, isEnd) => {
		if (isStart) this.startDateRef.current.click()
		if (isEnd) this.endDateRef.current.click()
	}

	// formatMonth (x) - Helper Method - Formats date to MM/YYYY format
	formatMonth = (date) => date.toLocaleString("default", { month: "short", year: "numeric" })
}

export default Searchbar