import React from 'react'
import Add from '../components/Add'
import Detail from '../components/Detail'

function Dashboard() {
  return (
   <div>
        <div className='container mt-5'>
          <h3 className='mb-4'> <span className='text-warning'>Greenleaf</span> Pollution Testing Center,</h3>
          <div className="d-flex justify-content-between algin-items-center mt-5">
            <div >
               <Add/> 
            </div>
            <div>
             
            </div>
          </div>
          <div>
            <Detail/>
          </div>
        </div>
   </div>
  )
}

export default Dashboard
