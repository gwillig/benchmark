import React from "react"
import {propsAsString} from "./util"
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
            time:null,
            surrounding:null,
            meal:null,
            sleep:null,
            music:null,
            special:null,
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
        this.handleInputField = this.handleInputField.bind(this)
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

    handleInputField(event,inputFieldname){
        let {time,surrounding,meal,sleep,music,special}=this.state
        const note={
            time:time,
            surrounding:surrounding,
            meal:meal,
            sleep:sleep,
            music:music,
            special:special
        }
        //.Step: Replace changed value
        note[inputFieldname] = event.target.value
        this.setState((prevState, props) => ({
              note: propsAsString(note),
              [inputFieldname]:event.target.value
            }));

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
                              <div id="timeInputGroup">
                                  <label className="inputLabels">Time &nbsp;</label>
                                    <input className="inputField" list="timeList"
                                           onChange={(event)=>this.handleInputField(event,"time")}
                                    />
                                    <datalist id="timeList">
                                      <option value="earlyMorning" >5:00 - 08:00</option>
                                      <option value="morning" >8:00 - 12:00</option>
                                      <option value="earlyAfternoon" >12:00 - 15:00</option>
                                      <option value="afternoon" >15:00 - 17:00</option>
                                      <option value="earlyEvening" >17:00 - 19:00</option>
                                      <option value="evening" >19:00 - 21:00</option>
                                      <option value="lateEvening" >21:00 - 23:00</option>
                                      <option value="Night" >23:00 - 5:00</option>
                                    </datalist>
                              </div>
                              <div id="surroundingInputGroup">
                                  <label className="inputLabels">Sur. &nbsp;</label>
                                    <input className="inputField" list="surroundingList"
                                        onChange={(event)=>this.handleInputField(event,"surrounding")}
                                    />
                                    <datalist id="surroundingList">
                                      <option value="silent">silent</option>
                                      <option value="quiet">quiet</option>
                                      <option value="noisy">noisy</option>
                                      <option value="loud">loud</option>
                                      <option value="deafening">deafening</option>
                                    </datalist>
                              </div>
                              <div id="mealInputGroup">
                                  <label className="inputLabels">Meal &nbsp;</label>
                                    <input className="inputField" list="mealList"
                                          onChange={(event)=>this.handleInputField(event,"meal")}
                                    />
                                    <datalist id="mealList">
                                      <option value="sweets">sweets</option>
                                      <option value="fruit">fruit</option>
                                      <option value="coffee">coffee</option>
                                      <option value="energyDrink">energyDrink</option>
                                      <option value="HeavyMeal">Roasted Chicken, Pork, Pizza</option>
                                      <option value="LightMeal">Bread, Oat, Carrot</option>
                                    </datalist>
                              </div>
                              <div id="sleepInputGroup">
                                  <label className="inputLabels" >Sleep &nbsp;</label>
                                    <input className="inputField" list="sleepAmount"
                                          onChange={(event)=>this.handleInputField(event,"sleep")}
                                    />
                              </div>
                              <div id="musicInputGroup">
                                  <label className="inputLabels">Music &nbsp;</label>
                                    <input className="inputField" list="musicList"
                                          onChange={(event)=>this.handleInputField(event,"music")}
                                    />
                                    <datalist id="musicList">
                                      <option value="none">none</option>
                                      <option value="focus">focus</option>
                                      <option value="podcast">podcast</option>
                                      <option value="lofi">lofi</option>
                                      <option value="hiphop">energyDrink</option>
                                      <option value="classic">classic</option>
                                      <option value="jazz">jazz</option>
                                    </datalist>
                              </div>
                              <div id="specialInputGroup">
                                  <label className="inputLabels">Special &nbsp;</label>
                                    <input className="inputField" list="specialList"
                                          onChange={(event)=>this.handleInputField(event,"special")}
                                    />
                                    <datalist id="specialList">
                                      <option value="sport">sport</option>
                                      <option value="nap">nap</option>
                                      <option value="walking">walking</option>
                                      <option value="mb">mb</option>
                                      <option value="game">game</option>
                                      <option value="talking">talking</option>
                                    </datalist>
                              </div>
                              <input className="inputField" style={{width:"100%"}} onChange={this.handleChangeTextarea}
                                   list="notes" id="note" name="note" value={this.state.note}
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