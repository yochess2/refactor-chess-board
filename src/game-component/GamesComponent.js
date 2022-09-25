import React from "react"
import ChessWebAPI from "chess-web-api"
import ReactPaginate from "react-paginate"
import Calendar from "react-calendar"

import Games from "./Games"
import Game from "./Game"

export class GamesComponent extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			perPage: 50,
			pageIndex: 0,
			pages: this.getPages(props.games.length, 50),
		}
		// console.log(this.props, 'games')
	}

	componentDidMount() {
		document.title = "YoChess - Games"
		// console.log('from mount', this.props)
		// if (this.props.isFetch) {
		// 	console.log('fetching')
		// 	this.props.handleFetchOnce(false)
		// }
	}

	componentWillUnmount() {
		// console.log('unmounted')
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.games.length !== prevProps.games.length) {
			let pages = this.getPages(this.props.games.length, this.state.perPage)
			this.setState({ pages })
		}

		if (this.props.isFetch !== prevProps.isFetch) {
			if (this.props.isFetch) {
				console.log('hhhhhhhhhh')
				this.props.handleFetchOnce(false)
			}
		}

		// console.log('i am invoked from update', this.props)
	}

	render() {
		return (<>
			{!this.props.games || this.props.games.length <= 0 ? 

				/* If no games */
				<p>No Games</p> :

				/* else */
				<>
					<Games 
						paginatedGames={this.getPaginatedGames(this.props.games)}
						gamesLength={this.props.games.length}
						pageIndex={this.state.pageIndex}
						perPage={this.state.perPage} />				
					<ReactPaginate
						onPageChange={this.onPageClick}
						activePage={this.state.activePage}
						pageCount={this.state.pages}
						renderOnZeroPageCount={null}
						nextLabel="next >"
						previousLabel="< previous"
						containerClassName="pagination"
						activeClassName='active'
						pageClassName="page-item"
				        pageLinkClassName="page-link"
				        previousClassName="page-item"
				        previousLinkClassName="page-link"
				        breakLabel="..."
				        breakClassName="page-item"
				        breakLinkClassName="page-link"
				        nextClassName="page-item"
				        nextLinkClassName="page-link" />
				</>
			}</>
		)
	}

	getPages = (gamesLength, perPage) => {
		return Math.ceil(gamesLength / perPage)
	}

	getPaginatedGames = (games) => {
		let paginatedGames = games.slice(
			(this.state.pageIndex * this.state.perPage), 
			(this.state.pageIndex + 1) * this.state.perPage
		)
		return paginatedGames
	}

	onPageClick = (event) => {
		let { username, fromDate, toDate, navigate, getLink } = this.props
		let pageIndex = event.selected
		this.setState({ pageIndex })
		navigate(getLink(username, fromDate, toDate, pageIndex+1))
	}
}

export default GamesComponent