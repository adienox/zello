import { useContext, useMemo } from "react";
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
  // Importing the dispatch method from the ChatContext and the currentUser from the AuthContext using the useContext hook
  const { dispatch } = useContext(ChatContext) as ChatContext;
  const currentUser = useContext(AuthContext) as User;

  // Destructuring the properties from the details[1] object
  const { userInfo: chatDetails, date, lastMessage } = details[1];

  // Setting the activeBackgroundColor based on the active boolean value
  const activeBackgroundColor = active ? "bg-secondary" : "";

  // Using the useMemo hook to format the date string
  const dateString = useMemo(
    () =>
      date
        ? DateTime.fromJSDate(date.toDate()).toLocaleString(
            DateTime.TIME_24_SIMPLE
          )
        : "",
    [date]
  );

  return (
    details && (
      <div
        className={`mt-1 flex cursor-pointer items-center gap-5 rounded-2xl p-5 py-3 transition-all ease-in-out hover:bg-secondary ${activeBackgroundColor}`}
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
            <span className="text-gray-500">{dateString}</span>
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
