
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Dashboard from './pages/Dashboard'
import FilteredResults from './pages/FilteredResults'
import Message from './pages/Message'

function App() {
  

  return (
    <>
    <div>
       <Routes>
        <Route path='/filter' element={<FilteredResults/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/message' element={<Message/>}/>
       </Routes>
    </div>
    </>
  )
}

export default App
