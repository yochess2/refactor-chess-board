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
		window.addEventListener("keydown", this.handleKey)

		let pages = this.getPages(this.props.games.length, this.state.perPage)
		this.setState({ pages })
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.games.length !== prevProps.games.length) {
			let pages = this.getPages(this.props.games.length, this.state.perPage)
			this.setState({ pages })
		}
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKey)
	}

	handleKey = (e) => {
		if (e.key === "ArrowRight") {
			if (this.props.pageIndex+1 < this.state.pages) {
				this.props.handlePage(this.props.pageIndex+1)
			}
		}
		if (e.key === "ArrowLeft") {
			if (this.props.pageIndex+1 > 1) {
				this.props.handlePage(this.props.pageIndex-1)
			}
		}
	}

	render() {
		return (<>
			<Games 
				paginatedGames={this.getPaginatedGames(this.props.games)}
				gamesLength={this.props.games.length}
				pageIndex={this.props.pageIndex}
				perPage={this.state.perPage} 
				handleGameClick={this.props.handleGameClick}
			/>		
			<ReactPaginate
				pageCount={this.state.pages}
				// initialPage={this.props.pageIndex}
				forcePage={this.props.pageIndex || -1}
				onPageChange={this.handlePage}
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

	handlePage = (event) => {
		let pageIndex = event.selected
		this.props.handlePage(pageIndex)
	}
}

export default GamesWrapper