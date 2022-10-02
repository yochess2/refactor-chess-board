import React from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export class Searchbar extends React.Component {
	constructor(props) {
		super(props) // handleUserSearch(), handleError() are passed down as props
		console.log(this.props)
		//TODO: Refactor to objects someday
		this.state = {
			username: "",
			displayStartDate: null,
			displayEndDate: null,
			formStartDate: null,
			formEndDate: null,
		}
		this.startDateRef = React.createRef()
		this.endDateRef = React.createRef()
	}

	//TESTING: Clear when done, checking how many re-renders 
	componentDidUpdate() {
		// console.log('TEST - searchbar updates')
	}

	//TODO: Fix Styling
	render() { 
		let { formatMonth, onStartMonthClick, onEndMonthClick, handleUserSearch, onUserInput } = this
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
							disabled={this.props.isFetch}
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
							disabled={this.props.isFetch}
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
							disabled={this.props.isFetch}
							value={username}
							onChange={onUserInput} 
							aria-label="Search Username"/>
						{/* End Username Input */}


						{/* Search Button */}
						<button
							id="usersearch01" 
							disabled={this.props.isFetch}
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


	/* 1. onStartMonthClick (x)
		invoker:	Start Month Calendar (date) - User clicks on a date
		invokee:	App - handleError(<bool> value, <str> message)
		effects: 	binds <dom> StartMonth to React Library
	*/
	onStartMonthClick = (date, event) => {
		this.setState({
			displayStartDate: date,
			formStartDate: date
		}, () => {
			this.toggleCalendar(true, true)
			this.props.handleError(false, "", null)
		})
	}

	/* 2. onEndMonthClick (x)
		invoker:	A) Start Month Calendar (date) - User clicks on a date
					B) onStartMonthClick() -> toggleCalendar(true, true) ->
		invokee:	App - handleError(<bool> value, <str> message)
		effects: 	binds <dom> StartMonth to React Library
	*/
	onEndMonthClick = (date, event) => {
		if (date < this.state.displayStartDate) 
			return this.props.handleError(true, "Ending Date cannot be less than Starting Date")
		this.setState({ displayEndDate: date, formEndDate: date }, () => {
			this.toggleCalendar(false, true)
			this.props.handleError(false, "", null)
		})
	}

	// 3. onUserInput (x) - binds <dom> Search Input to React Library
	onUserInput = (event) => this.setState({ username: event.target.value })

	/* 4. handleUserSearch (x)
		Invoker:	Search Button (username, fromDate, toDate)
		Invokee:	App - HandleUserSearch (username, fromDate, toDate)

		params: 	<dom> event
		effect: 	Sends (username, fromDate, toDate) up to the App Component
	*/
	handleUserSearch = (event) => {
		event.preventDefault()
		let { username, formEndDate, formStartDate, } = {...this.state}
		if (!username) 
			return this.props.handleError(true, "Please enter a username!")
		if (!formEndDate || !formStartDate || (formEndDate < formStartDate))
			return this.props.handleError(true, "Dates are invalid!")
		this.props.handleError(false, "", () => {
			this.props.handleUserSearch(username, formStartDate, formEndDate)
		})
	}


          ////////////////////
         /* Helper Methods */
        ////////////////////

	// toggleCalendar (x) - Toggles both calendars (invokes App.handleError)
	toggleCalendar = (isStart, isEnd) => {
		if (isStart) this.startDateRef.current.click()
		if (isEnd) this.endDateRef.current.click()
	}

	// formatMonth (x) - Helper Method - Formats date to MM/YYYY format
	formatMonth = (date) => date.toLocaleString("default", { month: "short", year: "numeric" })
}

export default Searchbar