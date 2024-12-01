import { useEffect, useRef } from 'react';
import { ChatModelType } from '../static/enums/ChatModelType';

const ChatModelDropdown = ({ onSelect, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      ref={modalRef}
      className="absolute w-full   bg-main-black py-3 z-50 rounded-lg shadow-lg"
    >
      {Object.entries(ChatModelType).map(([key, value]) => (
        <div
          className="text-white px-2 py-1"
          onClick={() => {
            onSelect(value);
            onClose();
          }}
          key={key}
          value={value}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export default ChatModelDropdown;
