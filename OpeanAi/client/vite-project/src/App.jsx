// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import ChatBody from './Chatbody';

import './App.css'
import ChatInput from './ChatInput';

function App() {
  

  return (
    <div className='main'>
      <div className='gradient-01 z-0 absolute'></div>
      <div className='gradient-02 z-0 absolute'></div>
     
     {/* header */}
     <div className="uppercase font-bold text-2xl text-center md-3">
  ChatGpt
     </div>
     
     {/* body */}
     <div>
     <ChatBody />
     </div>
     
     {/* input  */}
     <div className='w-full max-w-4xl min-w-[20rem] self-center'>
      <ChatInput/>
     </div>
    </div>
  );
}

export default App
