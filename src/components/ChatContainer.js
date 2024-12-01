import React, { useContext, useEffect, useState } from 'react';
import { ContextApp } from '../utils/Context';
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { BsPaperclip } from 'react-icons/bs';
import { IoArrowUp } from 'react-icons/io5';
import Chat from './Chat';
import ChatModelDropdown from './ChatModelDropdown';
import { ChatModelType } from '../static/enums/ChatModelType';

function ChatContainer() {
    const {
        setShowSlide,
        showSlide,
        setMobile,
        Mobile,
        chatValue,
        setChatValue,
        handleSend,
        handleKeyPress,
        account
    } = useContext(ContextApp);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [selectedModel, setSelectedModel]=useState(ChatModelType.gpt_4o_mini);

 
    return (
        <div
            className={`h-screen bg-black flex items-start justify-between flex-col p-2
        ${showSlide ? ' w-screen ' : 'w-full lg:w-[calc(100%-250px)]'}
     `}
        >
            <div className='flex gap-4  mb-3'>
                <span
                    className='rounded px-3 py-[9px] hidden lg:flex items-center justify-center cursor-pointer text-white m-1 hover:bg-gray-600 duration-200'
                    title='Open sidebar'
                    onClick={() => setShowSlide(!showSlide)}
                >
                    {showSlide ? <LuPanelLeftOpen /> : <LuPanelLeftClose />}
                </span>
                <span
                    className='rounded px-3 py-[9px] lg:hidden flex items-center justify-center cursor-pointer text-white mt-0 border border-gray-600'
                    title='Open sidebar'
                    onClick={() => setMobile(!Mobile)}
                >
                    <HiOutlineMenuAlt2 fontSize={20} />
                </span>
                <div className='relative'>
                    <button
                        className='text-white h-full text-start px-2 w-28'
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {selectedModel}
                    </button>
                    {isDropdownOpen && (
                        <ChatModelDropdown
                        onSelect={(model)=>setSelectedModel(model)}
                            onClose={() => setIsDropdownOpen(false)}
                        />
                    )}
                </div>
            </div>
            {/* chat section */}
            <div className='w-full h-full flex items-start justify-center overflow-hidden overflow-y-auto scroll'>
                <Chat />
            </div>
            {/* chat input section */}
            <div className=' w-full h-[10%] flex items-center justify-center flex-col gap-2 my-2'>
                <span className='flex h-full gap-2 items-end bg-main-light-grey rounded-lg shadow-md w-[90%] lg:w-2/5 xl:w-1/2'>
                    <textarea
                        type='text'
                        placeholder='Send a message'
                        className='resize-none   h-full text-white bg-transparent px-3 py-4 w-full border-none outline-none text-base '
                        value={chatValue}
                        onChange={(e) => setChatValue(e.target.value)}
                        onKeyUp={handleKeyPress}
                    />
                    <div className='m-3 gap-3 flex'>
                        <BsPaperclip
                            title='upload image'
                            className={` p-1 rounded-full m text-3xl  bg-black/80 text-white cursor-pointer
                        `}
                        />
                        <IoArrowUp
                            title='send message'
                            className={` p-1 rounded-full text-3xl ${
                                chatValue.length <= 0
                                    ? 'text-gray-400 bg-blue-800/50'
                                    : 'text-white cursor-pointer bg-blue-800 shadow-md '
                            }`}
                            onClick={handleSend}
                        />
                    </div>
                </span>
            </div>
        </div>
    );
}

export default ChatContainer;
