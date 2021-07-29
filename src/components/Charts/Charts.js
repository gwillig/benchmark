import React from 'react'
import {Container, Row, Col, InputGroup, FormControl, Button, Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Bar, Chart } from 'react-chartjs-2';
import moment from 'moment';
import axios from "axios";
import {GET_DATA_STATS} from "../BACKEND_URLS";
import zoomPlugin from "chartjs-plugin-zoom";


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


Chart.register(zoomPlugin); // REGISTER PLUGIN

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
        const color_palate = ["#003f5c", "#2f4b7c", "#665191", "#a05195", "#d45087", "#f95d6a", "#ff7c43","#ffa600",
        ,"#4cff00","#ffd500","#ff003b"]
        const datasets= []
        let i= 0
        if(Object.keys(stats).length!=0){
                // 1.Step: Fil histo_dict so that each label has a value
                debugger
                Object.keys(stats).forEach(key=>{
                    datasets.push({
                      type: 'bar',
                      label: key,
                      backgroundColor: color_palate[i],
                      data: stats[key].histo_data,
                      borderColor: 'white',
                      borderWidth: 2,
                    })
                    i = i + 1
                    })
        const options1 = {
          legend:{display:false},
          title: {display: true,text: 'Açılan Sandık'},
        }
        const rand = () => Math.round(Math.random() * 20 - 10);
        const data = {
          labels: ['0',"1","2","3","4","5","6","7","8","9","10","11","12","13"],
          datasets: datasets
        };

    return(
      <Bar
        data={data}
        options={{ responsive: true,
            maintainAspectRatio: false,
            plugins:{legend:
                        { labels:
                                {usePointStyle: true, color: "black"},
                            position:'top' },
                        zoom: {
                                zoom: {
                                  wheel: {
                                    enabled: true // SET SCROOL ZOOM TO TRUE
                                  },
                                  mode: "xg",
                                  speed: 100
                                },
                                pan: {
                                  enabled: true,
                                  mode: "xy",
                                  speed: 100
                                }

                        }
        }}}
         width={250} height={500}/>
      );

        }


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
                                <p>{JSON.stringify(stats[key].count)}</p>
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
                        {this.createCharts()}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Charts