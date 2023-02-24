import {useState, useEffect, useRef, Component} from "react";
import dec from './img/dec.png'
import inc from './img/inc.png'
import pause from './img/Pause.png'
import play from './img/Play.png'
import reset from './img/sync.png'
import './App.css';

const audio = document.getElementById('beep');
class App extends Component {
    state = {
        breakCount: 5,
        sessionCount: 25,
        clockCount: 25 * 60,
        currentTimer: 'Session',
        isPlaying: false
    }
    constructor(props) {
        super(props);
        this.loop = undefined;
    }
    componentWillUnmount() {
        clearInterval(this.loop);
    }
    handlePlayPause = () => {
        const {isPlaying} = this.state;

        if (isPlaying) {
            clearInterval(this.loop);
            this.setState({isPlaying: false});
        } else {
            this.setState({isPlaying: true});

            this.loop = setInterval(() => {
                const {clockCount, currentTimer, breakCount, sessionCount} = this.state;

                if (clockCount === 0) {
                    this.setState({
                        currentTimer: (currentTimer === 'Session')
                            ? 'Break'
                            : 'Session',
                        clockCount: (currentTimer === 'Session')
                            ? (breakCount * 60)
                            : (sessionCount * 60)
                    });

                    audio.play();
                } else {
                    this.setState({
                        clockCount: clockCount - 1
                    });
                }
            }, 1000);
        }
    }

    handleReset = () => {
        this.setState({
            breakCount: 5,
            sessionCount: 25,
            clockCount: 25 * 60,
            currentTimer: 'Session',
            isPlaying: false
        });

        clearInterval(this.loop);

        audio.pause();
        audio.currentTime = 0;
    }

    convertToTime = (count) => {
        let minutes = Math.floor(count / 60);
        let seconds = count % 60;

        minutes = minutes < 10
            ? ('0' + minutes)
            : minutes;
        seconds = seconds < 10
            ? ('0' + seconds)
            : seconds;

        return `${minutes}:${seconds}`;
    }

    handleLengthChange = (count, timerType) => {
        const {sessionCount, breakCount, isPlaying, currentTimer} = this.state;

        let newCount;

        if (timerType === 'session') {
            newCount = sessionCount + count;
        } else {
            newCount = breakCount + count;
        }

        // case Session: sessionCount:... case Break: breakCount:...

        if (newCount > 0 && newCount < 61 && !isPlaying) {
            this.setState({
                [`${timerType}Count`]: newCount
            });

            if (currentTimer.toLowerCase() === timerType) {
                this.setState({
                    clockCount: newCount * 60
                })
            }
        }
    }

    render() {
        const {breakCount, sessionCount, clockCount, currentTimer, isPlaying} = this.state;

        const breakProps = {
            title: 'Break',
            count: breakCount,
            handleDecrease: () => this.handleLengthChange(-1, 'break'),
            handleIncrease: () => this.handleLengthChange(1, 'break')
        }

        const sessionProps = {
            title: 'Session',
            count: sessionCount,
            handleDecrease: () => this.handleLengthChange(-1, 'session'),
            handleIncrease: () => this.handleLengthChange(1, 'session')
        }

        return (
            <div>
                <div className="container">
                    <SetTimer {...breakProps}/>
                    <SetTimer {...sessionProps}/>
                </div>

                <div className="clock-container">
                <h1 id="timer-label">{currentTimer}</h1>
                <div className="clock">
                  <div className="clock-rim">
                    <span id="time-left">{this.convertToTime(clockCount)}</span>
                    </div>
                    </div>
                    <div className="buttons">
                        <button id="start_stop" onClick={this.handlePlayPause}>
                            {/*<i
                                className={`fas fa-${isPlaying
                                    ? 'pause'
                                    : 'play'}`}/>*/}
                                    {isPlaying ? <img src={pause} alt="" />:
                                    <img width={"70px"} src={play} alt="" />}
                            
                            
                        </button>
                        
                        <button id="reset" onClick={this.handleReset}>
                        <img src={reset} alt="" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const SetTimer = (props) => {
    const id = props
        .title
        .toLowerCase();

    return (
      <>
        <div className="content">
        <h2 id={`${id}-label`}>
                {props.title}{" "}Length
        </h2>
        <div className="timer-container">
            <div className="timer-content">
                <button id={`${id}-decrement`} onClick={props.handleDecrease}>
                    <img className="dec" src={dec} alt="" />
                </button>

                <span id={`${id}-length`}>{props.count}</span>

                <button id={`${id}-increment`} onClick={props.handleIncrease}>
                <img className="inc" src={inc} alt="" />
                </button>
            </div>
        </div>
        </div>
        </>
    );
}

export default App;
