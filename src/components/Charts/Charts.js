import React from 'react'
import {Container, Row, Col} from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';


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
                <Row>
                    <Col>

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