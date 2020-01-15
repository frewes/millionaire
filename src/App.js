import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import fifty from './fifty.png';
import ata from './ata.png';
import paf from './paf.png';
import './App.css';
import GameState from './GameState';

import Navbar from 'react-bootstrap/Navbar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: null,
      guess: "",
      fifty: false,
      currentQ: 0
    };
    this.onFileChange = this.onFileChange.bind(this);
    this.setUpGame = this.setUpGame.bind(this);
    this.loadNextQ = this.loadNextQ.bind(this);
    this.setGuess = this.setGuess.bind(this);
    this.useFifty = this.useFifty.bind(this);
    this.usePhone = this.usePhone.bind(this);
    this.useAudience = this.useAudience.bind(this);
  }

  setUpGame(csv) {
    console.log(csv);
    let gamestate = new GameState()
    if (gamestate.load(csv)) {
      this.setState({game: gamestate, currentQ: 0});
    }
  }

  
  onFileChange(e, f) {
    console.log("Loading file");
    let file = f || e.target.files[0];
    let reader = new FileReader();
    console.log(file);

    reader.onload = () => {
        this.setUpGame(reader.result);
    };
    reader.readAsText(file);
  }


  loadNextQ() {
    this.setState({currentQ: this.state.currentQ+1, guess: "", fifty: false});
  }

  setGuess(e) {
    this.setState({guess: e.target.innerHTML});
  }

  useFifty() {
    if (!this.state.game.FiftyFifty) return;
    let g = this.state.game;
    g.FiftyFifty = false;
    this.setState({game: g, fifty: true});
  }

  usePhone() {
    let g = this.state.game;
    g.PhoneAMentor = false;
    this.setState({game: g});
  }

  useAudience() {
    let g = this.state.game;
    g.Audience = false;
    this.setState({game: g});
  }
  
  shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
      j = Math.floor(Math.random() * i);
      x = a[i - 1];
      a[i - 1] = a[j];
      a[j] = x;
    }
  
    return a;
  }


  render() {
    let mainWindow = <label>An error occurred</label>;
    if (this.state.game === null) {
      mainWindow = (
        <Fragment>
          <img src={logo} className="App-logo" alt="logo" width="300" />
          <p>
            Who wants to be a FIRST-ionaire?
          </p>
          <label className="btn btn-primary">
            Load Questions...
            <input type="file" accept=".tsv" onChange={this.onFileChange} hidden/>
          </label>  
        </Fragment>
      )
    } else if (this.state.currentQ >= 15) {
      mainWindow = (
        <Fragment>
          <img src={logo} className="App-logo" alt="logo" width="300" />
          <p>
            YOU ARE A FIRST-IONAIRE!!!
          </p>
      </Fragment>
      );
    } else {
      // Playing the game
      console.log(this.state.game);
      console.log(this.state.currentQ);
      let Q = this.state.game.Questions[this.state.currentQ];
      let Answers = Q.answers;
      let guessed = this.state.guess !== "";
      let correct = this.state.guess === Q.correct;
      let crossedOut = [];
      if (this.state.fifty && !guessed) {
        let A = this.shuffle([0, 1, 2, 3]);
        if (Answers[A[0]] === Q.correct) {
          crossedOut = [A[1], A[2]];
        } else if (Answers[A[1]] === Q.correct) {
          crossedOut = [A[0], A[2]];
        } else {
          crossedOut = [A[0], A[1]];
        }
      }

      mainWindow = (
        <Fragment>
          {/* <Navbar fixed="top">
            Who wants to be a FIRST-ionaire?
          </Navbar> */}
          <Container>
            <Row>
            <h1 className="question">{Q.question}</h1>
            </Row>
            <br/>
            <Row>
              <Col sm="10">
                <br/>
                <Row className="flex-fill">
                  <Col><div className={(guessed && Q.correct === Answers[0]) ? 
                      "correct" : (this.state.guess === Answers[0] ? "incorrect" : "")}>
                    <Button variant={crossedOut.includes(0) ? "" : "primary"} className="btn-lg answer" onClick={this.setGuess}>{Answers[0]}</Button>
                    </div></Col>
                    <Col><div className={(guessed && Q.correct === Answers[1]) ? 
                        "correct" : (this.state.guess === Answers[1] ? "incorrect" : "")}>
                    <Button variant={crossedOut.includes(1) ? "" : "primary"} className="btn-lg answer" onClick={this.setGuess}>{Answers[1]}</Button>
                    </div></Col>
                </Row>
                <br/>
                <br/>
                <Row className="flex-fill">
                <Col><div className={(guessed && Q.correct === Answers[2]) ? 
                    "correct" : (this.state.guess === Answers[2] ? "incorrect" : "")}>
                    <Button variant={crossedOut.includes(2) ? "" : "primary"} className="btn-lg answer" onClick={this.setGuess}>{Answers[2]}</Button>
                    </div></Col>
                    <Col><div className={(guessed && Q.correct === Answers[3]) ? 
                        "correct" : (this.state.guess === Answers[3] ? "incorrect" : "")}>
                    <Button variant={crossedOut.includes(3) ? "" : "primary"} className="btn-lg answer" onClick={this.setGuess}>{Answers[3]}</Button>
                    </div></Col>
                </Row>
                <br/>
                {this.state.guess!=="" ? (<Row>
                  <Col sm="10">
                    { correct ? (
                        <Fragment>
                          <Button onClick={this.loadNextQ}>Next question!</Button>
                        </Fragment>
                      ) : (
                        <Fragment>NO! You lose...   <Button onClick={this.loadNextQ}>Keep going anyway</Button></Fragment>
                      )
                    }
                  </Col>
                  </Row>) : 
                  <Row><Col><br/></Col></Row>}
                  <br/>
                <Row>
                  <Col sm="1">
                  </Col>
                  <Col sm="3">
                    <Alert variant={this.state.game.FiftyFifty || "danger"} onClick={this.useFifty}>
                      <img src={fifty} alt="Fifty-fifty" width="100" />
                      </Alert>
                  </Col>
                  <Col sm="3">
                    <Alert variant={this.state.game.PhoneAMentor || "danger"} onClick={this.usePhone}>
                      <img src={paf} alt="Phone a mentor" width="100" />
                      </Alert>
                  </Col>
                  <Col sm="3">
                    <Alert variant={this.state.game.Audience || "danger"} onClick={this.useAudience}>
                      <img src={ata} alt="Ask the audience" width="100" />
                      </Alert>
                  </Col>
                </Row>
              </Col>
              <Col sm="2">
                <Row><div className={Q.value===1000000?"current":"value"}>$1,000,000</div></Row>
                <Row><div className={Q.value===500000?"current":"value"}>$500,000</div></Row>
                <Row><div className={Q.value===250000?"current":"value"}>$250,000</div></Row>
                <Row><div className={Q.value===125000?"current":"value"}>$125,000</div></Row>
                <Row><div className={Q.value===64000?"current":"value"}>$64,000</div></Row>
                <Row><div className={Q.value===32000?"current":"value"}>$32,000</div></Row>
                <Row><div className={Q.value===16000?"current":"value"}>$16,000</div></Row>
                <Row><div className={Q.value===8000?"current":"value"}>$8,000</div></Row>
                <Row><div className={Q.value===4000?"current":"value"}>$4,000</div></Row>
                <Row><div className={Q.value===2000?"current":"value"}>$2,000</div></Row>
                <Row><div className={Q.value===1000?"current":"value"}>$1,000</div></Row>
                <Row><div className={Q.value===500?"current":"value"}>$500</div></Row>
                <Row><div className={Q.value===300?"current":"value"}>$300</div></Row>
                <Row><div className={Q.value===200?"current":"value"}>$200</div></Row>
                <Row><div className={Q.value===100?"current":"value"}>$100</div></Row>
              </Col>
            </Row>
          </Container>
        </Fragment>
      )

    } 

    return (
      <div className="App">
        <header className="App-header">
          {mainWindow}
        </header>
      </div>
    );
  }
}

export default App;
