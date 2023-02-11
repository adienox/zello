import { ChatContext } from "@/context/ChatContext";
import { UilPhone, UilVideo, UilAngleLeft } from "@iconscout/react-unicons";
import { useContext } from "react";

const TopBar = () => {
  const { chat, dispatch } = useContext(ChatContext) as ChatContext;
  return (
    <div className="flex h-[60px] items-center justify-between bg-black p-5">
      {chat.chatId && (
        <>
          <div className="flex items-center gap-5">
            <button onClick={() => dispatch({ type: "RESET" })}>
              <UilAngleLeft className="text-white md:hidden" />
            </button>
            <img
              className="h-[32px] w-[32px] rounded-full object-cover"
              src={chat.photoURL}
              alt=""
            />
            <span className="hidden text-gray-500 md:block">
              Conversation with
            </span>
            <span
              className="-ml-3 cursor-pointer text-white"
              onClick={() => dispatch({ type: "TOGGLE_USER_INFO" })}
            >
              {chat.displayName}
            </span>
          </div>
          <div className="flex gap-5">
            <UilPhone className="cursor-pointer text-white" />
            <UilVideo className="cursor-pointer text-white" />
          </div>
        </>
      )}
    </div>
  );
};

export default TopBar;
