import React from 'react'
import {Container, Row, Col, InputGroup, FormControl, Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import axios from "axios";
import {GET_DATA_STATS} from "../BACKEND_URLS";
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


class Charts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            stats:{},
            key_word:"",
            start_date:"2021-07-27 21:23:54",
            end_date:"2021-12-28 21:59:54"
        }
        this.createCharts = this.createCharts.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.renderStats = this.renderStats.bind(this)
    }
    createCharts= () =>{
        //0.Step: Define  variables
        const {stats} = this.state

        if(Object.keys(stats).length!=0){
                // 1.Step: Fil histo_dict so that each label has a value
                return Object.keys(stats).forEach(key=>{

                    /*
                    *                 for el in range(0,12):
                    if histo_data.get(el) == None:
                        histo_data[el] = 0
                    * */
                        return (
                            <Col>
                                <h6>{key}</h6>
                                <p>{stats[key]["date"]}</p>
                                {Object.entries(stats[key].stats.result).map(([itemKey, value])=>{
                                    return <p>{itemKey}: {value}</p>
                                })}
                                <p>{JSON.stringify(stats[key].histo_data)}</p>
                            </Col>
                        )
                    })
        }
        const rand = () => Math.round(Math.random() * 20 - 10);
        const data = {
          labels: ['0',"1","2","3","4","5","6","7","8","9","10","11","12","13"],
          datasets: [
            {
              type: 'line',
              label: 'Dataset 1',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 2,
              fill: false,
              data: [rand(), rand(), rand(), rand(), rand(), rand()],
            },
            {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: 'rgb(255, 99, 132)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
              borderColor: 'white',
              borderWidth: 2,
            },
                          {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: 'rgb(255, 99, 132)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
              borderColor: 'white',
              borderWidth: 2,
            },
                          {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: 'rgb(255, 99, 132)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
              borderColor: 'white',
              borderWidth: 2,
            },
                          {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: 'rgb(255, 99, 132)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
              borderColor: 'white',
              borderWidth: 2,
            },
                          {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: 'rgb(255, 99, 132)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
              borderColor: 'white',
              borderWidth: 2,
            },
                          {
              type: 'bar',
              label: 'Dataset 2',
              backgroundColor: 'rgb(255, 99, 132)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
              borderColor: 'white',
              borderWidth: 2,
            },
            {
              type: 'bar',
              label: 'Dataset 3',
              backgroundColor: 'rgb(75, 192, 192)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
            },
          ],
        };
        return data
    }

    fetchData = () =>{

        const {start_date, end_date, key_word} = this.state
        fetch(GET_DATA_STATS, {
                                      method: "POST", // or "PUT"
                                      headers: {
                                        "Content-Type": "application/json",
                                      },
                                      body: JSON.stringify({
                                          start_date:start_date,
                                          end_date:end_date, key_word:key_word}
                                      ),
                                    }).then(response => response.json()).then(data =>{
                                        debugger
                                        this.setState({stats:data.response})
        } )
    }

    renderStats= () =>{

        const {stats} = this.state

        if(Object.keys(stats).length!=0){
                debugger
                return Object.keys(stats).map(key=>{


                        return (
                            <Col>
                                <h6>{key}</h6>
                                <p>{stats[key]["date"]}</p>
                                {Object.entries(stats[key].stats.result).map(([itemKey, value])=>{
                                    return <p>{itemKey}: {value}</p>
                                })}
                                <p>{JSON.stringify(stats[key].histo_data)}</p>
                            </Col>
                        )
                    })
        }
    }

    render(){

        const {stats, start_date, end_date, key_word} = this.state

        return(
            <Container>
                <Row className="mb-3 ">
                    {/*<Col xs="12">*/}
                    {/*  <DateRangePicker*/}
                    {/*    initialSettings={{*/}
                    {/*      timePicker: true,*/}
                    {/*      startDate: moment().startOf('hour').add(-2, 'hour').toDate(),*/}
                    {/*      endDate: moment().startOf('hour').add(1, 'hour').toDate(),*/}
                    {/*      locale: {*/}
                    {/*        format: 'M/DD hh:mm A',*/}
                    {/*      },*/}
                    {/*    }}*/}
                    {/*  >*/}
                    {/*    <input type="text" className="form-control" />*/}
                    {/*  </DateRangePicker>*/}
                    {/*</Col>*/}
                </Row>
                <Row>
                    <Col xs="12">
                        <InputGroup className="mb-3 ">
                        <InputGroup.Text id="start_date">Start</InputGroup.Text>
                        <FormControl
                          onChange={event => this.setState({start_date: event.target.value})}
                          defaultValue={start_date}
                        />
                      </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3 ">
                        <InputGroup.Text id="end_date">End</InputGroup.Text>
                        <FormControl
                            onChange={event => this.setState({end_date: event.target.value})}
                            defaultValue={end_date}
                        />
                      </InputGroup>
                    </Col>
                    <Col>
                        <InputGroup className="mb-3 ">
                        <InputGroup.Text id="key_word">Key Word</InputGroup.Text>
                        <FormControl
                            onChange={event => this.setState({key_word: event.target.value})}
                            defaultValue={key_word}
                        />
                      </InputGroup>
                    </Col>
                    <Col xs="12">
                        <Button onClick={this.fetchData}> Fetch data</Button>
                    </Col>
                </Row>
                <Row>
                    {
                        this.renderStats()
                    }
                </Row>
                <Row>
                    <Col>
                            {/*Todo: Add bar chart*/}
                            {/*<Bar data={this.createCharts()} />*/}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Charts