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
		}
	}

	componentDidMount() {
		document.title = "YoChess - Games"
		// console.log('>>i am loading')
		let pages = this.getPages(this.props.games.length, this.state.perPage)
		this.setState({ pages })
	}

	componentDidUpdate(prevProps, prevState) {
		// console.log('i am also loading')
		if (this.props.games.length !== prevProps.games.length) {
			let pages = this.getPages(this.props.games.length, this.state.perPage)
			this.setState({ pages })
		}
	}

	render() {
		console.log(this.props)
		return (<>
			{!this.props.games || this.props.games.length <= 0 ? 

				/* If no games */
				'' :

				/* else */
				<>
					<Games 
						paginatedGames={this.getPaginatedGames(this.props.games)}
						gamesLength={this.props.games.length}
						pageIndex={this.props.pageIndex}
						perPage={this.state.perPage} />				
					<ReactPaginate
						initialPage={this.props.pageIndex}
						onPageChange={this.flipPage}
						pageCount={this.state.pages}
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
				        nextLinkClassName="page-link" />
				</>
			}
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
		let { inputs, navigate, getLink } = this.props
		let { username, startDate, endDate } = inputs
		let pageIndex = event.selected
		this.props.flipPage(pageIndex, () => {
			navigate(getLink(username, startDate, endDate, pageIndex+1))

		})
	}
}

export default GamesWrapper