import React, { Component } from "react";
import './setupProxy'
import RememberNumbers from "./components/remember_number/RememberNumbers"

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				counter:0,
				success:true
			}

		};

	render(){
		return(<RememberNumbers></RememberNumbers>)
	}
}
export default App;