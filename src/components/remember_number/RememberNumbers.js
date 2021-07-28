import React from "react"
import {Container, Row, Col, Button} from "react-bootstrap"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import axios from "axios";
import {POST_RESULTS} from "../BACKEND_URLS";
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


class RememberNumbers extends React.Component{
    constructor(props) {
        super();
        this.state={
            counter:0,
            data:"",
            displayStart:"block",
            displayGame:"none",
            displayUserInput:"none",
            displayResult:"none",
            isPlaying:false,
            level:0,
            prevLevel:0,
            randomNumber:"",
            userInput:"",
            currentState:",",
            note:""
        }
        this.startBtn = this.startBtn.bind(this)
        this.onComplete = this.onComplete.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeTextarea = this.handleChangeTextarea.bind(this)
    }

    startBtn=()=>{
        const {level} = this.state
        //1.Step: Create random number based on level
        let number=""
        for (let i=0;i<=level; i++){
            let randomNumber = Math.floor(Math.random() * 10)
            console.log(randomNumber)
            number +=randomNumber
        }

        this.setState({displayStart:"none", isPlaying:true, displayGame:"block",randomNumber:number,displayResult:"none",
                            userInput:""})

    }

    onComplete = ()=>{
        console.log("Count down finished")
        this.setState({displayUserInput:"block",displayGame:"none",isPlaying:false})
        return["shouldRepeat"]
    }

    handleChange(event) {
        this.setState({userInput: event.target.value});

    }
    handleChangeTextarea(event) {
        debugger
        this.setState({note: event.target.value});

    }
    onSubmit = () => {
        const {userInput,randomNumber,level, note} = this.state
        debugger
        //1.Step: Compare userInput
        let compareResult
        let newLevel
        if(userInput==randomNumber){
            compareResult="Right"
            newLevel = level + 1

            this.setState({
                                displayResult:"block",currentState:compareResult, displayUserInput:"none",
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
                                displayResult:"block",currentState:compareResult, displayUserInput:"none",
                                level:newLevel, prevLevel:level,
                            }
        )
              );
        }
    }

    render(){
        const {displayStart, isPlaying, displayGame, displayUserInput, randomNumber,currentState,userInput
              ,displayResult,level, prevLevel} = this.state


        return(
            <Container >
                <Row className="justify-content-md-center">
                    <Col>
                        <h1>Number Memory</h1>
                    </Col>
                </Row>
                <Row className="justify-content-md-center" id="gameStart" style={{display:displayStart}}>
                    <Col xs="2">
                        <Button onClick={this.startBtn}>Start</Button>
                    </Col>
                    <Col xs="2">
                        <textarea  onChange={this.handleChangeTextarea}>
                        </textarea>
                        <input list="colors" id="color" name="color"/>
                            <datalist id="colors">
                              <option value="#2A81CB">blue</option>
                              <option value="#FFD326">gold</option>
                              <option value="#CB2B3E">red</option>
                              <option value="#2AAD27">green</option>
                              <option value="#CB8427">orange</option>
                              <option value="#CAC428">yellow</option>
                              <option value="#9C2BCB">violet</option>
                              <option value="#7B7B7B">grey</option>
                              <option value="#3D3D3D">black</option>
                            </datalist>
                    </Col>
                </Row>

                <Row id="game" style={{display:displayGame}}>
                    <Col>
                        <h1>{randomNumber}</h1>
                          <CountdownCircleTimer
                            onComplete= {this.onComplete}
                            isPlaying={isPlaying}
                            duration={2}
                            colors={[
                              ['#004777', 0.33],
                              ['#F7B801', 0.33],
                              ['#A30000', 0.33],
                            ]}
                          >
                            {({ remainingTime }) => remainingTime}

                          </CountdownCircleTimer>
                    </Col>
                </Row>
                <Row id="userInput" style={{display:displayUserInput}} >
                    <Col xs="12">
                        <input value={this.state.userInput} onChange={this.handleChange}/>
                    </Col>
                    <Col xs="12">
                        <Button onClick={this.onSubmit}>Submit</Button>
                    </Col>
                </Row>
                <Row id="result" style={{display:displayResult}}>
                    <Col xs="12">
                        <h5>Level: {level}</h5>
                        <h6>Random Number: {randomNumber}</h6>
                        <h6>User Number: {userInput}</h6>
                        <h6>Result: {currentState}</h6>
                        <h6>Previous Level: {prevLevel}</h6>

                    </Col>
                    <Col xs="12">
                        <Button onClick={this.startBtn}>Next Round</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default  RememberNumbers