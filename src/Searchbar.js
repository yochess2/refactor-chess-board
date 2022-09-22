import React from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'

export class Searchbar extends React.Component {
	render() {
		return (
			<>
			<div className="list-group mt-sm-5">

				<div className="list-group-item list-group-item-action">
					Search
				</div>
				<div>
				
				</div>
			</div>
					<Calendar maxDetail="year"/>
					</>
		)
	}
}

export default Searchbar