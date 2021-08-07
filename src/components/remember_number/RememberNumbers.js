import React from "react"
import {Container, Row, Col, Button, Card} from "react-bootstrap"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import axios from "axios";
import "./RememberNumbers.css"
import {POST_RESULTS, GET_DISTINCT_NOTE} from "../BACKEND_URLS";
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


class RememberNumbers extends React.Component{
    constructor(props) {
        super();
        this.state={
            counter:0,
            data:"",
            displayNewGame:"",
            displayGame:"d-none",
            displayUserInput:"d-none",
            displayResult:"d-none",
            isPlaying:false,
            level:0,
            prevLevel:0,
            randomNumber:"",
            userInput:"",
            currentState:",",
            note:"",
            countDownTimer:2,
            timePerLevel:2,
            inputOptions:[]
        }
        this.startBtn = this.startBtn.bind(this)
        this.onComplete = this.onComplete.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeTextarea = this.handleChangeTextarea.bind(this)
        this.get_distinct_notes = this.get_distinct_notes.bind(this)
        this.createCountdown = this.createCountdown.bind(this)
    }

    startBtn=()=>{
        const {level, timePerLevel} = this.state
        //1.Step: Create random number based on level
        let number=""
        for (let i=0;i<=level; i++){
            let randomNumber = Math.floor(Math.random() * 10)
            console.log(randomNumber)
            number +=randomNumber
        }
        //2.Step: Calculate the countdown time
         let countDownTimer= level*timePerLevel
         if (countDownTimer == 0){
             countDownTimer = 2
         }
         debugger
        //3.Step: Set the state of the component
        this.setState({displayNewGame:"d-none", isPlaying:true, displayGame:"",randomNumber:number,displayResult:"d-none",
                            userInput:"", countDownTimer:countDownTimer})

    }

    onComplete = ()=>{
        console.log("Count down finished")
        this.setState({displayUserInput:"",displayGame:"d-none",isPlaying:false})
        return [true, 1 ]
    }

    handleChange(event) {
        this.setState({userInput: event.target.value});

    }
    handleChangeTextarea(event) {

        this.setState({note: event.target.value});

    }

    onSubmit = () => {
        const {userInput,randomNumber,level, note} = this.state

        //1.Step: Compare userInput
        let compareResult
        let newLevel
        if(userInput==randomNumber){
            compareResult="Right"
            newLevel = level + 1

            this.setState({
                                displayResult:"",currentState:compareResult, displayUserInput:"d-none",
                                level:newLevel,prevLevel:level
                            }
            )
        }
        else{
            compareResult="False"
            newLevel = 0
            //Post result to backend
            const item={
                    date:new Date().toUTCString(),
                    note:note,
                    result: level,
                    game:"rememberNumbers"
            }
            axios.post(POST_RESULTS, item)
              .then(
                          this.setState({
                                displayResult:"",currentState:compareResult, displayUserInput:"d-none",
                                level:newLevel, prevLevel:level,
                            }
        )
              );
        }
    }

    get_distinct_notes=()=>{
       let options
       axios.get(GET_DISTINCT_NOTE)
              .then(response=>response.data).then(res =>{
                  options = res.response.map(el=>`<option value="${el}">${el}</option>`)
                  this.setState({inputOptions:res.response})
        })

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

        if(prevState.note!=this.state.note){
            this.get_distinct_notes()
        }
    }
    createCountdown = () =>{
        let {isPlaying, countDownTimer } = this.state

        return(
             <CountdownCircleTimer style={{width:"100%"}}
                                onComplete= {this.onComplete}
                                isPlaying={isPlaying}
                                key = {`CountdownCircleTimer_${countDownTimer}`}
                                duration={countDownTimer}
                                colors={[
                                  ['#004777', 0.33],
                                  ['#F7B801', 0.33],
                                  ['#A30000', 0.33],
                                ]}
                              >
                                {({ remainingTime }) => remainingTime}

                              </CountdownCircleTimer>
        )

    }
    render(){
        const {displayNewGame, isPlaying, displayGame, displayUserInput, randomNumber,currentState,userInput
              ,displayResult,level, prevLevel,inputOptions, countDownTimer } = this.state


        return(
                <Container id="RememberNumberContainer" fluid className="align-middle">
                <Row className="justify-content-md-center">
                  <Col>
                      <h1 className="text-center" >Number Memory</h1>
                  </Col>
                </Row>

                <Row  id="newGame" className="" className={displayNewGame}>
                    <div className="mx-auto d-block"  >
                        <Card  className="text-center" style={{ width: '22rem' }} className="text-center" >
                          <Card.Body>
                          <Card.Title>New Game</Card.Title>
                              <input style={{width:"100%"}} onChange={this.handleChangeTextarea}
                                   list="notes" id="note" name="note"
                            />
                                <datalist id="notes">
                                    {inputOptions.map(
                                        (opt) => <option key = {opt}>{opt}</option>
                                    )}

                                </datalist>
                          </Card.Body>
                          <Card.Body>
                            <Button style={{width:"100%"}} className="start_btn" onClick={this.startBtn}>Start</Button>
                          </Card.Body>
                        </Card>
                    </div>
                  </Row>
                <Row  id="rememberNumberGame" className={`justify-content-md-center  align-self-center ${displayGame}`}>
                    <Col className="d-flex justify-content-center mx-auto" >
                        <Card style={{ width: '22rem' }}  className="text-center">
                          <Card.Body>
                              <Card.Title>{randomNumber}</Card.Title>
                              {this.createCountdown()}
                          </Card.Body>
                        </Card>
                    </Col>
                  </Row>
                <Row  id="rememberNumberUserInput" className="justify-content-md-center" className={displayUserInput}>
                    <Col md="auto"  >
                        <Card style={{ width: '22rem' }}  className="text-center">
                          <Card.Body>
                              <Card.Title>Please enter number</Card.Title>
                              <input value={this.state.userInput} style={{width:"100%"}}
                               onChange={this.handleChange}/>
                          </Card.Body>
                          <Card.Body>
                              <Button  style={{width:"100%"}}
                                 className="start_btn" onClick={this.onSubmit}>
                                 Submit
                             </Button>
                          </Card.Body>
                        </Card>
                    </Col>
                  </Row>
                <Row  id="rememberNumberResult" className="justify-content-md-center" className={displayResult}>
                    <Col md="auto"  >
                        <Card style={{ width: '22rem' }}  className="text-center">
                          <Card.Body>
                              <Card.Title>Result of level {level}</Card.Title>
                                <h6>Random Number: {randomNumber}</h6>
                                <h6>User Number: {userInput}</h6>
                                <h6>Result: {currentState}</h6>
                                <h6>Previous Level: {prevLevel}</h6>
                          </Card.Body>
                          <Card.Body>
                              <Button  style={{width:"100%"}}
                                 className="start_btn" onClick={this.startBtn}>
                                 Next Round
                             </Button>
                          </Card.Body>
                        </Card>
                    </Col>
                  </Row>
                </Container>
        )
    }
}

export default  RememberNumbers