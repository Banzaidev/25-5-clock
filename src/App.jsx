
import { useEffect, useState } from "react"

export default function App(){
    const [session,setSession] = useState({
        mm: 25,
        d: new Date(0, 0, 0, 0, 25, 0),
    })
    const [pause, setPause] = useState({
        mm: 5,
        d: new Date(0, 0, 0, 0, 5, 0),
    })

    const [statusTimer, setStatusTimer] = useState('play')
    const [sessionOrPause, setSessionOrPause] = useState('Session') // set Session or Break in timer-label
    const audioTag = document.querySelector('#beep')

    const timeLeft = (date) => ((date.getHours() * 60)+ (date.getMinutes() * 60) + date.getSeconds())

    function setSessionPauseInterval(state, setStateFunc){
       let interval =  setInterval(() => {
            if(timeLeft(state.d) != 0){
                setStateFunc((prevState) => {return({...prevState, d: new Date(0, 0, 0, 0, prevState.d.getMinutes(), prevState.d.getSeconds() - 1) })})
            }
            if(state.d.getHours() == 1){
                setStateFunc((prevState) => {return({...prevState, d: new Date(0, 0, 0, prevState.d.getHours() - 1, prevState.d.getMinutes(), prevState.d.getSeconds()) })})
            }
        }, 1000);
        return interval
    }

    const awaitAudioPlayed = (audio) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Resolved')
            }, audio.duration * 1000);
        })
    }

    const resetAndPlayAudio = async (sessionToBeCleared, audioToBePlayed, sessionOrBreak) => {
        clearInterval(sessionToBeCleared)
        audioToBePlayed.play()
        await awaitAudioPlayed(audioToBePlayed)
        setSessionOrPause(sessionOrBreak)
    }
    
    useEffect(() => {
        let sessionInterval;
        let pauseInterval;
        if(statusTimer == 'pause'){
            (async () => {
                if(timeLeft(session.d) != 0){
                    if(sessionOrPause == 'Session'){
                        sessionInterval = setSessionPauseInterval(session, setSession)
                    }
                     
                }else{
                    if(sessionOrPause == 'Session'){
                        resetAndPlayAudio(sessionInterval, audioTag, 'Break')
                    }else{
                        pauseInterval = setSessionPauseInterval(pause,setPause)
                    }

                    if(timeLeft(pause.d) == 0){
                        if(sessionOrPause == 'Break'){
                            resetAndPlayAudio(pauseInterval, audioTag, 'Session')
                        }
                    }
                }
    
                if(timeLeft(session.d) == 0 && timeLeft(pause.d) == 0){
                    handleReset(false,session.mm, pause.mm)
                }

            })()

        }
        return () => {
            clearInterval(sessionInterval)
            clearInterval(pauseInterval)
        }


    })

    function incrementState(setStateFunction) {
        setStateFunction((prevState) => {
            if(prevState.mm < 60){
                return({...prevState, mm: prevState.mm + 1, d: new Date(0, 0, 0, 0, prevState.d.getMinutes() + 1, 0)})
            }else{
                return prevState
            }
        })

    }

    function decrementState(setStateFunction){
        setStateFunction((prevState) => {
            if(prevState.mm > 1){
                return({...prevState, mm: prevState.mm - 1, d: new Date(0, 0, 0, 0, prevState.d.getMinutes() - 1, 0)})
            }else{
                return prevState
            }
        })
    }

    const handleSessionBreakControls = (e) => {
        const sessionOrBreak = (e.target.id.split('-'))[0] //session or break
        const incrementOrDecrement = (e.target.id.split('-'))[1] // increment or decrement
        switch(sessionOrBreak){
            case 'session':
                if(incrementOrDecrement == 'increment'){
                    incrementState(setSession)
                }else{
                    decrementState(setSession)
                }
                break
            case 'break':
                if(incrementOrDecrement == 'increment'){
                    incrementState(setPause)
                }else{
                    decrementState(setPause)
                }
                break

        }
    }

    const handlePlayStop = () => {
        if(statusTimer == 'pause'){
            setStatusTimer('play')

        }else{
            setStatusTimer('pause')
        }
    }

    const handleReset = (pauseTimer = true, mmSession = 25, mmPause = 5) => {
        if(statusTimer == 'pause' && pauseTimer){
            setStatusTimer('play')
        }
        setSession({
            mm: mmSession,
            d: new Date(0, 0, 0, 0, mmSession, 0)
        })
        setPause({
            mm: mmPause,
            d: new Date(0, 0, 0, 0, mmPause, 0)
        })
        audioTag.pause()
        audioTag.currentTime = 0;
        setSessionOrPause('Session')
        
    }

    const timerToBeShowed = (date) => {
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        
        if(minutes == 0) {
            if(date.getHours() == 1){
                minutes = '60'
            }else{
                minutes = '00'
            }
            
        }else if(minutes.toString().length == 1) {
            minutes = `0${minutes}`
        }

        if(seconds == 0){
            seconds = '00'
        }else if(seconds.toString().length == 1){
            seconds = `0${seconds}`
        }

        return(`${minutes}:${seconds}`)
    
    }
 
    return(
        <>
            <h1>25 + 5 Clock</h1>
            <div id='break'>
                <p id='break-label'>Break Length</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="break-decrement">-</button> 
                <p id='break-length'>{pause.mm}</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="break-increment">+</button> 
            </div>
            <div id='session'>
                <p id='session-label'>Session Length</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="session-decrement">-</button>
                <p id='session-length'>{session.mm}</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="session-increment">+</button>
            </div>
            <div id='timer'>
                <p id='timer-label'>{sessionOrPause}</p>
                <p id='time-left'>
                 {sessionOrPause == 'Session' ? timerToBeShowed(session.d): timerToBeShowed(pause.d)} 
                </p>
            </div>
            <div id='timer-controls'>
                <button onClick={(e) => handlePlayStop(e)} id='start_stop'>{statusTimer}</button>
                <button onClick={() => handleReset()}id='reset'>reset</button>
            </div>
            <audio preload="auto" src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav' id='beep'></audio> 
        </>
    )
}