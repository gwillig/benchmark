import React from 'react'
import {Container, Row, Col, InputGroup, FormControl} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';


class Charts extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }
        this.createCharts = this.createCharts.bind(this)
    }
    createCharts= () =>{
        const rand = () => Math.round(Math.random() * 20 - 10);
        const data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
              label: 'Dataset 3',
              backgroundColor: 'rgb(75, 192, 192)',
              data: [rand(), rand(), rand(), rand(), rand(), rand(), rand()],
            },
          ],
        };

        return data
    }
    render(){




        return(
            <Container>
                <Row className="mb-3 ">
                    <Col xs="12">
                      <DateRangePicker
                        initialSettings={{
                          timePicker: true,
                          startDate: moment().startOf('hour').add(-2, 'hour').toDate(),
                          endDate: moment().startOf('hour').add(1, 'hour').toDate(),
                          locale: {
                            format: 'M/DD hh:mm A',
                          },
                        }}
                      >
                        <input type="text" className="form-control" />
                      </DateRangePicker>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <InputGroup className="mb-3 ">
                        <InputGroup.Text id="intervall">@</InputGroup.Text>
                        <FormControl
                          placeholder="Username"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                        />
                      </InputGroup>
                    </Col>
                    <Col>

                        <InputGroup className="mb-3 ">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <FormControl
                          placeholder="Username"
                          aria-label="Username"
                          aria-describedby="basic-addon1"
                        />
                      </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col>
                            <div className='header'>
                              <h1 className='title'>MultiType Chart</h1>
                            </div>
                            <Bar data={this.createCharts()} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Charts