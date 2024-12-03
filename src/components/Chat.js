import React, { useContext } from 'react';
import { ContextApp } from '../utils/Context';
import ReactMarkdown from 'react-markdown';
import { AiOutlineUser } from 'react-icons/ai';


function Chat() {
  const { message, msgEnd } = useContext(ContextApp);

  return (
    <div className=" w-full flex items-center justify-center overflow-hidden overflow-y-auto px-2 py-1 scroll">
      <div className="w-full lg:w-4/5 flex flex-col h-full items-start justify-start">
        {message?.map((msg, i) => (
          
          <span
            key={i}
            className={
              msg.isBot
                ? 'flex items-start justify-center gap-2 lg:gap-5 my-2 bg-main-light-grey p-3 rounded-md '
                : 'flex items-start justify-center gap-2 lg:gap-5 my-2 p-3'
            }
          >
             {msg.isBot ? (
              <img
                src="/icon.png"
                alt="bot"
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500 text-white font-bold"
              >
                <AiOutlineUser size={24}/>
              </div>
            )}
            <p className="text-white text-[15px] group"> <ReactMarkdown>{msg?.text}</ReactMarkdown></p>
          </span>
        ))}
        <div ref={msgEnd} />
      </div>
    </div>
  );
}

export default Chat;
