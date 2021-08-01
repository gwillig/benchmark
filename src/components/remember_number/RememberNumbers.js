import React from "react"
import {Container, Row, Col, Button} from "react-bootstrap"
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import axios from "axios";
import {POST_RESULTS, GET_DISTINCT_NOTE} from "../BACKEND_URLS";
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


class RememberNumbers extends React.Component{
    constructor(props) {
        super();
        this.state={
            counter:0,
            data:"",
            displayStart:"flex",
            displayGame:"none",
            displayUserInput:"none",
            displayResult:"none",
            isPlaying:false,
            level:0,
            prevLevel:0,
            randomNumber:"",
            userInput:"",
            currentState:",",
            note:"",
            inputOptions:[]
        }
        this.startBtn = this.startBtn.bind(this)
        this.onComplete = this.onComplete.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChangeTextarea = this.handleChangeTextarea.bind(this)
        this.get_distinct_notes = this.get_distinct_notes.bind(this)
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

    render(){
        const {displayStart, isPlaying, displayGame, displayUserInput, randomNumber,currentState,userInput
              ,displayResult,level, prevLevel,inputOptions} = this.state


        return(
            <Container className="h-100">
                  <Row className="justify-content-center ">
                    <Col  xs="10" >
                        <h1>Number Memory</h1>
                    </Col>
                  </Row>
                  <Row className="justify-content-center m-4">
                    <Col xs="12">
                        <input style={{width:"100%"}} onChange={this.handleChangeTextarea}
                               list="notes" id="note" name="note"
                        />
                        <datalist id="notes">
                                {inputOptions.map(
                                    (opt) => <option key = {opt}>{opt}</option>
                                )}
                            </datalist>
                    </Col>
                  </Row>
                  <Row className="justify-content-center h-100">
                    <Col  xs="10" >
                        <Button className="start_btn" onClick={this.startBtn}>Start</Button>
                    </Col>

                  </Row>


                <Row id="game"  className="justify-content-center h-100" >
                    <Col>
                        <h1 className="randomNumber">{randomNumber}</h1>
                          <CountdownCircleTimer
                            onComplete= {this.onComplete}
                            isPlaying={isPlaying}
                            duration={}
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
                <Row className="mb-3" id="userInput" style={{display:displayUserInput}} >
                    <Col xs="12">
                        <input value={this.state.userInput} style={{}}
                               onChange={this.handleChange}/>
                    </Col>
                    <Col xs="12">
                        <Button  style={{}}
                                 className="start_btn" onClick={this.onSubmit}>Submit</Button>
                    </Col>
                </Row>
                <Row className="centerElement" id="result" style={{display:displayResult}}>
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