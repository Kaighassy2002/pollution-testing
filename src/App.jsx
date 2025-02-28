
import { Route, Routes } from 'react-router-dom'
import './App.css'

import Dashboard from './pages/Dashboard'
import FilteredResults from './pages/FilteredResults'

function App() {
  

  return (
    <>
    <div>
       <Routes>
        <Route path='/filter' element={<FilteredResults/>}/>
        <Route path='/' element={<Dashboard/>}/>
       </Routes>
    </div>
    </>
  )
}

export default App
