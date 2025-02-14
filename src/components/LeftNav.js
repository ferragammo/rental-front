import React, {useContext, useState} from 'react';
import {AiOutlinePlus} from 'react-icons/ai';
import {FiMessageSquare, FiMoreHorizontal} from 'react-icons/fi';
import {ContextApp} from '../utils/Context';
import Cookies from 'js-cookie';
import ModalMore from './ModalMore';

function LeftNav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ bottom: 0, right: 0 });
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const {
    selectedModel,
    showSlide,
    getAllChats,
    chats,
    setSelectedChat,
    selectedChat,
    selectedChatById,
  } = useContext(ContextApp);


  const handleOpenModal = (e, chatId) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setButtonPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX,
    });
    setIsModalOpen(true);
    setSelectedChatId(chatId);
  };

  const handleRename = () => {
    setIsModalOpen(false);
    setIsEditing(true);
    const chat = chats.find((c) => c.id === selectedChatId);
    setNewTitle(chat.title);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isLoggedIn = !!Cookies.get('accessToken');

  return (
    <div
      className={
        !showSlide
          ? 'h-screen bg-main-grey w-[250px] hidden lg:flex items-center justify-between p-2 text-white flex-col translate-x-0'
          : 'hidden'
      }
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xl font-semibold">Chatbot</span>
        <button
          className="rounded px-3 py-[9px] hidden lg:flex items-center justify-center cursor-pointer text-white m-1 hover:bg-gray-600 duration-200"
        >
          <AiOutlinePlus fontSize={16} />
        </button>
      </div>
      <div className="h-full w-full p-2 flex items-start justify-start flex-col overflow-hidden overflow-y-auto text-sm scroll my-2">
        {chats && chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`rounded-lg w-full py-2 px-3 text-xs my-2 flex items-center justify-between cursor-pointer hover:bg-[#212121] transition-all duration-300 overflow-hidden truncate whitespace-nowrap ${
                chat.id === selectedChat ? 'bg-[#212121]' : ''
              }`}
            >
              {selectedChatId === chat.id && isEditing ? (
                <div className="flex w-full items-center gap-2">
                  <input
                    type="text"
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={newTitle}
                    autoFocus
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-3">
                    <FiMessageSquare fontSize={20} />
                    <span className="text-base">{chat.title}</span>
                  </div>
                  <button
                    className="ml-auto flex p-2 items-center justify-end"
                    onClick={(e) => {
                      e.stopPropagation(); // Остановка всплытия события
                      handleOpenModal(e, chat.id);
                    }}
                  >
                    <FiMoreHorizontal fontSize={20} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </div>

      <ModalMore
        isOpen={isModalOpen}
        onRename={handleRename}
        onClose={handleCloseModal}
        position={buttonPosition}
      />
    </div>
  );
}

export default LeftNav;
