import { useContext } from "react";
import { DateTime } from "luxon";
import { User } from "firebase/auth";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";

const ChatItems = ({
  details,
  active,
}: {
  details?: any;
  active?: boolean;
}) => {
  const { dispatch } = useContext(ChatContext) as ChatContext;
  const currentUser = useContext(AuthContext) as User;

  const chatDetails = details[1].userInfo;
  const date = details[1].date
    ? DateTime.fromJSDate(details[1].date.toDate()).toLocaleString(
        DateTime.TIME_24_SIMPLE
      )
    : "";
  const lastMessage = details[1].lastMessage;
  const backgroundColor = active ? "bg-secondary" : "";

  return (
    details && (
      <div
        className={`mt-1 flex cursor-pointer items-center gap-5 rounded-2xl p-5 py-3 transition-all ease-in-out hover:bg-secondary ${backgroundColor}`}
        onClick={() => dispatch({ type: "CHANGE_CHAT", payload: chatDetails })}
      >
        <img
          className="h-[50px] w-[50px] self-start rounded-full object-cover"
          src={chatDetails.photoURL}
        />
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <h3 className="text-lg font-bold text-white">
              {chatDetails.displayName}
            </h3>
            <span className="text-gray-500">{date}</span>
          </div>
          <span className="text-gray-500">
            {chatDetails.email.length > 20
              ? chatDetails.email.slice(0, 20) + "...."
              : chatDetails.email}
          </span>
          {lastMessage && (
            <span className="mt-1 text-lg text-gray-400">
              {lastMessage.senderId === currentUser.uid
                ? "You: " + lastMessage.text
                : lastMessage.text}
            </span>
          )}
        </div>
      </div>
    )
  );
};

export default ChatItems;
