
import { useEffect, useState } from "react"

export default function App(){
    const [session,setSession] = useState(25)
    const [pause, setPause] = useState(5)
    const [statusTimer, setStatusTimer] = useState('play')
    const [timer, setTimer] = useState({
        mm: session,
        ss: 0
    })
    const [timerPause, setTimerPause] = useState({
        mm: pause,
        ss: 0
    })

    useEffect(()=> {
        let interval;
        if(statusTimer == 'pause'){
            if(timer.ss != 0){
                interval = setInterval(()=>{
                    console.log(timer)
                    setTimer((prevTimer) => {
                        return({...prevTimer, ss: prevTimer.ss - 1})
                    })
                }, 1000)
                
            }else{
                if(timer.mm > 0){
                    console.log('0s')
                    setTimer((prevTimer) => {return({mm: prevTimer.mm - 1, ss: 60})})
                }

            }
        }
        return () => clearInterval(interval)


    }, [statusTimer, timer])

    const handleSessionBreakControls = (e) => {
        const sessionOrBreak = (e.target.id.split('-'))[0] //session or break
        const incrementOrDecrement = (e.target.id.split('-'))[1] // increment or decrement
        switch(sessionOrBreak){
            case 'session':
                if(incrementOrDecrement == 'increment'){
                    setSession((prevSession) => prevSession < 60 ? prevSession + 1 : prevSession) 
                }else{
                    setSession((prevSession) => prevSession > 1 ? prevSession - 1 : prevSession)
                }
                setTimer((prevTimer) => {return({mm: session, ss: 0})})
                console.log(session, timer)
                break
            case 'break':
                if(incrementOrDecrement == 'increment'){
                    setPause((prevPause) => prevPause < 60 ? prevPause + 1 : prevPause)
                }else{
                    setPause((prevPause) => prevPause > 1 ? prevPause - 1 : prevPause)
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


    return(
        <>
            <h1>25 + 5 Clock</h1>
            <div id='break'>
                <p id='break-label'>Break Length</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="break-decrement">-</button> 
                <p id='break-length'>{pause}</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="break-increment">+</button> 
            </div>
            <div id='session'>
                <p id='session-label'>Session Length</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="session-decrement">-</button>
                <p id='session-length'>{session}</p>
                <button onClick={(e) => handleSessionBreakControls(e)} id="session-increment">+</button>
            </div>
            <div id='timer'>
                <p id='timer-label'>Session</p>
                <p id='timer-left'>{(timer.mm == 0 && timer.ss == 0) ? pause : `${timer.mm}:${timer.ss}`}</p>
            </div>
            <div id='timer-controls'>
                <button onClick={(e) => handlePlayStop(e)} id='start_stop'>{statusTimer}</button>
                <button id='reset'></button>
            </div>
            <audio id='beep'></audio> 
        </>
    )
}