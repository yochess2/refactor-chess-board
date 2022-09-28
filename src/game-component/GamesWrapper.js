import React from "react"
import ReactPaginate from "react-paginate"

import Games from "./Games"

// TODO: Take some time to slowly document this, tired now
// Hacked around until numbers worked. Took a lot of guess and checking
export class GamesWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			perPage: 20,
			pages: this.getPages(props.games.length, 20),
			pageIndex: this.props.pageIndex
		}
	}

	componentDidMount() {
		document.title = "YoChess - Games"
		let pages = this.getPages(this.props.games.length, this.state.perPage)
		this.setState({ pages })
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.games.length !== prevProps.games.length) {
			let pages = this.getPages(this.props.games.length, this.state.perPage)
			this.setState({ pages })
		}
	}

	render() {
		return (<>
			<Games 
				paginatedGames={this.getPaginatedGames(this.props.games)}
				gamesLength={this.props.games.length}
				pageIndex={this.props.pageIndex}
				perPage={this.state.perPage} 
				getGame={this.props.getGame}
			/>		
			<ReactPaginate
				pageCount={this.state.pages}
				// initialPage={this.props.pageIndex}
				forcePage={this.props.pageIndex || -1}
				onPageChange={this.flipPage}
				renderOnZeroPageCount={null}
				nextLabel=" >"
				previousLabel="<"
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
		        nextLinkClassName="page-link" 
			/>
		</>)
	}

	getPages = (gamesLength, perPage) => {
		return Math.ceil(gamesLength / perPage)
	}

	getPaginatedGames = (games) => {
		let paginatedGames = games.slice(
			(this.props.pageIndex * this.state.perPage), 
			(this.props.pageIndex + 1) * this.state.perPage
		)
		return paginatedGames
	}

	flipPage = (event) => {
		let pageIndex = event.selected
		this.props.flipPage(pageIndex)
	}
}

export default GamesWrapper