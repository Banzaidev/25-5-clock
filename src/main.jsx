import { render } from 'react-dom'
import App from './App'
import './App.css'
//import AppPrev from './AppPrev'
import { StrictMode } from 'react'



render(
  <StrictMode>
    <App/>
    {/* <AppPrev/> */}
  </StrictMode>
    , document.getElementById('root')
)