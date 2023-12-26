
import { useState } from "react"

export default function App(){
    const [session,setSession] = useState(25)
    const [pause, setPause] = useState(5)

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
                <p id='timer-left'>{session == 0 ? pause : session}</p>
            </div>
            <div id='timer-controls'>
                <button id='start_stop'></button>
                <button id='reset'></button>
            </div>
            <audio id='beep'></audio> 
        </>
    )
}