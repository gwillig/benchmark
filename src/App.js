import React, { Component } from "react";
import './setupProxy'
import RememberNumbers from "./components/remember_number/RememberNumbers"
import Charts from './components/Charts/Charts'
import {Tabs, Tab} from 'react-bootstrap'
import './App.css'
class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
				counter:0,
				success:true
			}

		};

	render(){
		return(
			<Tabs defaultActiveKey="rememberNumbers" className="mb-3">
			  <Tab eventKey="rememberNumbers" title="Remember Numbers" className="h-100">
				<RememberNumbers />
			  </Tab>
			  <Tab eventKey="charts" title="Charts">
				<Charts />
			  </Tab>
			</Tabs>
		)
	}
}
export default App;