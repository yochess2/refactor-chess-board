import React from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

export class Searchbar extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			displayFromDate: null,
			displayToDate: null,
			formUsername: "",
			formFromDate: null,
			formToDate: null,
			errorMessage: "",
			error: false,
		}
		this.fromRef = React.createRef()
		this.toRef = React.createRef()
	}

	render() {
		let { displayFromDate, formFromDate, displayToDate, formToDate, formUsername } = this.state
		return (
	    	<div className="row mt-2">


		    {/* Error Message */}
			{this.state.error && 
			<div className="alert alert-danger" role="alert" >
				{this.state.errorMessage}
			</div>}
			{/* Error Message */}


	    		{/* First Group: From and To Date */}
	    		<div className="col-md-6">
					<div className="input-group dropdown-button">


						{/* From Button */}
						<button
							ref={this.fromRef}
							className="btn btn-secondary dropdown-toggle" 
							type="button btn-outline" 
							data-bs-toggle="dropdown" 
							aria-expanded="false">
							<span>
								{!displayFromDate ? "From Month" : this.formatMonth(displayFromDate)}
							</span>
						</button>
						<ul className="dropdown-menu m-0"onClick={e => e.stopPropagation()}>
							<Calendar 
								maxDetail="year"
								value={formFromDate}
								onClickMonth={this.onFromMonthClick} />
						</ul>
						{/* End From Button */}


						{/* To Button */}
						<button 
							ref={this.toRef}
							className="btn btn-secondary dropdown-toggle" 
							type="button" 
							data-bs-toggle="dropdown" 
							aria-expanded="false">
							<span>
								{!displayToDate ? "To Month" : this.formatMonth(displayToDate)}
							</span>
						</button>
						<ul className="dropdown-menu m-0" onClick={e => e.stopPropagation()}>
							<Calendar 
								maxDetail="year"
								value={formToDate}
								onClickMonth={this.onToMonthClick} />
						</ul>
						{/* End To Button */}


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
							value={formUsername}
							onChange={this.onUserChange} 
							aria-label="Search Username"/>
						{/* End Username Input */}


						{/* Search Button */}
						<button
							id="usersearch01" 
							className="btn btn-primary btn-outline" 
							onClick={this.handleUserSearch}>
							Search
						</button>
						{/* End Search Button */}


					</div>
				</div>
			</div>
		)
	}

	//Formats date to MM/YYYY format
	formatMonth = (date) => date.toLocaleString("default", { month: "short", year: "numeric" })

	//On From Calendar Dropdown Click, 
	//    After setting,
	//        Trigger From Calendar Dropdown after
	onFromMonthClick = (date, event) => {
		this.setState({ 
			displayFromDate: date, 
			formFromDate: date, 
			error: false ,
			errorMessage: "",
		}, () => {
			this.fromRef.current.click()
			this.toRef.current.click()
		})
	}

	//On To Calendar Dropdown Click,
	//    If toDate is less than fromDate, 
	//        Reset dates and give warning
	onToMonthClick = (date, event) => {
		if (date < this.state.displayFromDate) {
			this.setState({ 
				error: true,
				errorMessage: "Ending Date cannot be less than Starting Date"
			})
			return
		}
		this.setState({ 
			displayToDate: date,
			formToDate: date,
			error: false,
			errorMessage: "",
		}, () => {
			this.toRef.current.click()
		})
	}

	//Bind input form
	onUserChange = (event) => {	
		let formUsername = event.target.value
		this.setState({ formUsername })
	}

	//Handle Submit
	handleUserSearch = (event) => {
		event.preventDefault()
		let { formUsername, formToDate, formFromDate, error } = {...this.state}
		if (!formUsername) {
			this.setState({ error: true, errorMessage: "Please enter a username" })
			return
		}

		if (!formToDate || !formFromDate || (formToDate < formFromDate)) {
			this.setState({ error: true, errorMessage: "Invalid Dates" })
			return
		}

		this.setState({ formUsername: "", error: false, errorMessage: "",}, 
			() => this.props.handleUserSearch(formUsername, formFromDate, formToDate))
	}
}

export default Searchbar