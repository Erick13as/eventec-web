import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Eventos from './components/Eventos';
import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import "./components/Design.css"

const App = () => {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='eventec-web/' element={<SignIn />} /> 
        <Route path='/registro' element={<SignUp />} />
        <Route path='/eventos' element={<Eventos />} />
      </Routes>
    </div>
    </BrowserRouter>
  )
}


export default App;