import React, { useRef, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const ModalMore = ({ isOpen, onClose, onRename, onDelete, position }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute z-50"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div
        ref={modalRef}
        className="bg-[#272729] rounded-xl border border-[#49494d] p-3 w-40"
      >
        <ul className="space-y-2">
          <li>
            <button
              onClick={onRename}
              className="w-full py-3 gap-5 px-5 text-sm flex text-center hover:bg-[#424242] rounded-lg"
            >
              <FiEdit2 fontSize={18} />
              Rename
            </button>
          </li>
          <li>
            <button
              onClick={onDelete}
              className="w-full py-3 px-5 gap-5 text-center flex text-sm text-red-600 hover:bg-[#424242] rounded-lg"
            >
              <FiTrash2 fontSize={18} />
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModalMore;
