import React, { useContext } from 'react';
import { ContextApp } from '../utils/Context';
import ReactMarkdown from 'react-markdown';
import Cookies from 'js-cookie';

function Chat() {
    const { message, msgEnd } = useContext(ContextApp);

    return (
        <div className=' w-full flex items-center justify-center overflow-hidden overflow-y-auto px-2 py-1 scroll'>
            <div className='w-full lg:w-4/5 flex flex-col h-full items-start justify-start'>
                {message?.map((msg, i) => (
                    <div key={i}>
                        <span
                            className={
                                msg.isBot
                                    ? 'flex items-start justify-center gap-2 lg:gap-5 my-2 bg-main-light-grey p-3 rounded-md '
                                    : 'flex items-start justify-center gap-2 lg:gap-5 my-2 p-3'
                            }
                        >
                            <img
                                src={msg.isBot ? '/icon.png' : '/user.jpeg'}
                                alt='user'
                                className='w-10 h-10 rounded object-cover'
                            />
                            <div>
                                {msg.file && msg.file.base64String && (
                                    <div>
                                        {msg.file.name.match(
                                            /\.(jpg|png)$/
                                        ) && (
                                            <img
                                                className='h-24'
                                                src={`data:image/png;base64,${msg.file.base64String}`}
                                                alt={msg.file.name}
                                            />
                                        )}
                                    </div>
                                )}
                                <p className='text-white text-[15px] group'>
                                    {' '}
                                    <ReactMarkdown>{msg?.text}</ReactMarkdown>
                                </p>
                            </div>
                        </span>
                    </div>
                ))}

                <div ref={msgEnd} />
            </div>
        </div>
    );
}

export default Chat;
