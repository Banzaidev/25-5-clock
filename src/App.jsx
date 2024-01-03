
import { useEffect, useState } from "react"

export default function App(){
    const [session,setSession] = useState({
        mm: 25,
        ss: 0,
        value: 25 //used for reset session
    })
    const [pause, setPause] = useState({
        mm: 5,
        ss: 0,
        value: 5 //used for reset pause
    })

    const [statusTimer, setStatusTimer] = useState('play')
    const [sessionOrPause, setSessionOrPause] = useState('Session') // set Session or Break in timer-label
    const audioTag = document.querySelector('#beep')

    function controlSessionPauseInterval(state, setStateFunc){
        let interval;
        if(state.ss != 0){
            interval = setInterval(()=>{
                setStateFunc((prevState) => {
                    return({...prevState, ss: prevState.ss - 1})
                })
            }, 1000)
            
        }else{
            if(state.mm > 0){
                setTimeout(() => {
                    setStateFunc((prevState) => {return({...prevState, mm: prevState.mm - 1, ss: 59})})
                }, 1000) 
            }

        }
        
        return interval

    }
    const awaitAudioPlayed = async (audio) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve('Resolved')
            }, audio.duration * 1000);
        })
    }
    useEffect(()=> {

        let intervalSession;
        let intervalPause;
        if(statusTimer == 'pause'){
            
            (async () => {
                
                if((session.mm == 0 && session.ss == 0) && (pause.mm == 0 && pause.ss == 0)){
                    handleReset(false, session.value, pause.value, true)
                }

                if(session.mm == 0 && session.ss == 0){
                    if(sessionOrPause != 'Break'){
                        audioTag.play()
                        setSessionOrPause('Break')
                        await awaitAudioPlayed(audioTag)
                        
                    }else{
                        intervalPause = controlSessionPauseInterval(pause,setPause)
                    }
                    
                    if(pause.mm == 0 && pause.ss == 0){
                        audioTag.play()
                        await awaitAudioPlayed(audioTag)
                        setSessionOrPause('Session')
                    }

                }else{
                    if(sessionOrPause == 'Session'){
                        intervalSession = controlSessionPauseInterval(session, setSession)   
                    }
                }

            })()


        }
        return () => {
            clearInterval(intervalSession)
            clearInterval(intervalPause)
        }


    })

    function incrementState(setStateFunction) {
        setStateFunction((prevState) => {
            if(prevState.mm < 60){
                return({...prevState, mm: prevState.mm + 1, ss: 0})
            }else{
                return prevState
            }
        })

    }

    function decrementState(setStateFunction){
        setStateFunction((prevState) => {
            if(prevState.mm > 1){
                return({...prevState, mm: prevState.mm - 1, ss:0})
            }else{
                return prevState
            }
        })
    }

    const setValue = (setStateFunc) => setStateFunc((prevState) => {return({...prevState, value: prevState.mm})})

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
                setValue(setSession)
                break
            case 'break':
                if(incrementOrDecrement == 'increment'){
                    incrementState(setPause)
                }else{
                    decrementState(setPause)
                }
                setValue(setPause)
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

    const handleReset = (pauseTimer = true, mmSession = 25, mmPause = 5, buttonClicked = true) => {
        if(statusTimer == 'pause' && pauseTimer){
            setStatusTimer('play')
        }
        setSession({
            mm: mmSession,
            ss: 0,
            value: mmSession
        })
        setPause({
            mm: mmPause,
            ss: 0,
            value: mmPause
        })
        audioTag.pause()
        audioTag.currentTime = 0;
        if(buttonClicked){
            setSessionOrPause('Session')
        }
        
        
    }

    const timerToBeShowed = (state) => {
        let minutes;
        let seconds;

        if(state.mm == 0) {
            minutes = '00'
        }else if(state.mm.toString().length == 1) {
            minutes = `0${state.mm}`
        }else{
            minutes = state.mm
        }

        if(state.ss == 0){
            seconds = '00'
        }else if(state.ss.toString().length == 1){
            seconds = `0${state.ss}`
        }else{
            seconds = state.ss
        }

        return(`${minutes}:${seconds}`)
    
    }

    return(
        <>
            <h1>25 + 5 Clock</h1>
            <div id='break'>
                <p id='break-label'>Break Length</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="break-decrement">-</button> 
                <p id='break-length'>{pause.value}</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="break-increment">+</button> 
            </div>
            <div id='session'>
                <p id='session-label'>Session Length</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="session-decrement">-</button>
                <p id='session-length'>{session.value}</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="session-increment">+</button>
            </div>
            <div id='timer'>
                <p id='timer-label'>{sessionOrPause}</p>
                <p id='time-left'>
                    {sessionOrPause == 'Session' ? timerToBeShowed(session) : timerToBeShowed(pause)}
                </p>
            </div>
            <div id='timer-controls'>
                <button onClick={(e) => handlePlayStop(e)} id='start_stop'>{statusTimer}</button>
                <button onClick={() => handleReset()}id='reset'>reset</button>
            </div>
            <audio loop={false} preload="auto" src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav' id='beep'></audio> 
        </>
    )
}