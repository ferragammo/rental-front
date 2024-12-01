import React, { useContext } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { LuPanelLeftClose } from "react-icons/lu";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import { SlOptions } from "react-icons/sl";
import { ContextApp } from "../utils/Context";
function LeftNav() {
  const { setShowSlide, showSlide, handleQuery } = useContext(ContextApp);
  return (
    // top section
    <div
      className={
        !showSlide
          ? "h-screen bg-main-grey w-[250px] hidden lg:flex items-center justify-between p-2 text-white flex-col translate-x-0"
          : "hidden"
      }
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xl font-semibold">Chatbot</span>
        <span
          className="rounded px-3 py-[9px] hidden lg:flex items-center justify-center cursor-pointer text-white m-1 hover:bg-gray-600 duration-200"
          onClick={() => window.location.reload()}
        >
          <AiOutlinePlus fontSize={16} />
         
        </span>
        {/* <span
          className="border border-gray-600  rounded px-3 py-[9px] flex items-center justify-center cursor-pointer"
          title="Close sidebar"
          onClick={() => setShowSlide(!showSlide)}
        >
          <LuPanelLeftClose />
        </span> */}
      </div>
      {/* middle section  */}
      <div className="h-full w-full p-2 flex items-start justify-start flex-col overflow-hidden overflow-y-auto text-sm scroll my-2">
        {/* msg  */}
        <span
          className="rounded w-full py-3 px-2 text-xs my-2 flex gap-1 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap"
          value={"What is Programming?"}
          onClick={handleQuery}
        >
          <span className="flex gap-2 items-center justify-center text-base">
            <FiMessageSquare />
            <span className="text-sm">What is Programming?</span>
          </span>
        </span>
        <span
          className="rounded w-full py-3 px-2 text-xs my-2 flex gap-2 items-center justify-between cursor-pointer hover:bg-gray-800 transition-all duration-300 overflow-hidden truncate whitespace-nowrap "
          value={"How to use an API?"}
          onClick={handleQuery}
        >
          <span className="flex gap-2 items-center justify-center text-base">
            <FiMessageSquare />
            <span className="text-sm">How to use an API?</span>
          </span>
        </span>
      </div>
      
    </div>
  );
}

export default LeftNav;
