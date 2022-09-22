import React from "react"
import ChessWebAPI from "chess-web-api"
import ReactPaginate from "react-paginate"

import Game from "./game-component/Game"
import Games from "./game-component/Games"

export class GamesComponent extends React.Component {
	constructor(props) {
		// console.log(    "GamesComponent - Constructor")
		super(props)
		this.state = {
			perPage: 20,
			pageIndex: 0,
			pages: 0,
		}
		this.api = new ChessWebAPI
	}

	componentDidMount() {
		document.title = "YoChess - Games"
		// console.log("    GamesComponent - ComponentDidMount", this.props)
		this.setState({ pages: Math.ceil(this.props.games.length / this.state.perPage) })
		if (this.props.games.length === 0) {
			this.fetchandSetGames()
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// console.log("    GamesComponent - ComponentDidUpdate", this.props, prevProps, this.state, prevState)
	}

	componentWillUnmount() {
		// console.log("    GamesComponent - ComponentWillUnmount", this.state)
	}

	fetchandSetGames = async (username) => {
		let res = await this.api.getPlayerCompleteMonthlyArchives("tiger415", 2022, 9)
		let games = res.body.games.slice().reverse()
		if (res.body && res.body.games && res.body.games.length > 0) {
			this.props.saveGames(games)
			this.setState({ pages: Math.ceil(this.props.games.length / this.state.perPage) })
		}
		return res.body
	}

	render() {
		// console.log("    GamesComponent - Render", this.state)
		return (
			<>
				<h2>Games</h2>
				<div className="table-responsive-sm">
					<Games 
						paginatedGames={this.getPaginatedGames(this.props.games)}
						gamesLength={this.props.games.length}
						pageIndex={this.state.pageIndex}
					/>
				</div>
				
				<div className="pagination-nav">	
					<ReactPaginate
						onPageChange={this.handlePageClick}
						activePage={this.state.activePage}
						pageCount={this.state.pages}
						renderOnZeroPageCount={null}
						nextLabel="next >"
						previousLabel="< previous"
						containerClassName="pagination"
						activeClassName={'active'}
						pageClassName="page-item"
				        pageLinkClassName="page-link"
				        previousClassName="page-item"
				        previousLinkClassName="page-link"
				        breakLabel="..."
				        breakClassName="page-item"
				        breakLinkClassName="page-link"
				        nextClassName="page-item"
				        nextLinkClassName="page-link"
					/>
				</div>
			</>
		)
	}

	getPaginatedGames = (games) => {
		let paginatedGames = games.slice(
			(this.state.pageIndex * this.state.perPage), 
			(this.state.pageIndex + 1) * this.state.perPage
		)
		return paginatedGames
	}

	handlePageClick = (event) => {
	  let pageIndex = event.selected
	  this.setState({ pageIndex })
	}
}

export default GamesComponent