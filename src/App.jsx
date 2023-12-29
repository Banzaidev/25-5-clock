
import { useEffect, useState } from "react"

export default function App(){
    const [session,setSession] = useState({
        mm: 25,
        ss: 0,
        value: 25 //the value that appears in the UI
    })
    const [pause, setPause] = useState({
        mm: 5,
        ss: 0,
        value: 5 //the value that appears in the UI
    })

    const [statusTimer, setStatusTimer] = useState('play')

    useEffect(()=> {
        let interval;
        if(statusTimer == 'pause'){
            console.log(session)
            if(session.ss != 0){
                interval = setInterval(()=>{
                    setSession((prevSession) => {
                        return({...prevSession, ss: prevSession.ss - 1})
                    })
                }, 1000)
                
            }else{
                if(session.mm > 0){
                    console.log('0s')
                    setSession((prevSession) => {return({...prevSession, mm: prevSession.mm - 1, ss: 59})})
                }

            }
            console.log(session)
        }
        return () => clearInterval(interval)


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
                setSession((prevSession) => {return({...prevSession, value: prevSession.mm})})
                console.log(session)
                break
            case 'break':
                if(incrementOrDecrement == 'increment'){
                    incrementState(setPause)
                    console.log(pause)
                }else{
                    decrementState(setPause)
                }
                setPause((prevPause) => {return({...prevPause, value: prevPause.mm})})
                console.log(pause)
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

    const handleReset = () => {
        setSession({
            mm: 25,
            ss: 0,
            value: 25
        })
        setPause({
            mm: 5,
            ss: 0,
            value: 5
        })
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
                <p id='timer-label'>Session</p>
                <p id='timer-left'>{(session.mm == 0 && session.ss == 0) ? pause : `${session.mm}:${session.ss}`}</p>
            </div>
            <div id='timer-controls'>
                <button onClick={(e) => handlePlayStop(e)} id='start_stop'>{statusTimer}</button>
                <button onClick={() => handleReset()}id='reset'>reset</button>
            </div>
            <audio id='beep'></audio> 
        </>
    )
}