import { ChatContext } from "@/context/ChatContext";
import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";
import { useContext, useEffect, useMemo, useRef } from "react";

export interface MessageObject {
  date: Timestamp;
  id: string;
  message: string;
  senderId: string;
  image: string;
}

const Message = ({ data, owner }: { data: MessageObject; owner?: boolean }) => {
  const { chat } = useContext(ChatContext) as ChatContext;

  // Define a dummy reference to an HTML element.
  const dummy = useRef<HTMLDivElement>(null);

  // Run the useEffect hook to smoothly scroll the dummy element into view if it exists.
  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // Use useMemo hook to memoize the calculation of the formatted date string.
  const date = useMemo(
    () =>
      DateTime.fromJSDate(data.date.toDate()).toLocaleString(
        DateTime.TIME_24_SIMPLE
      ),
    [data]
  );

  return (
    <>
      {!owner ? (
        <div ref={dummy} className="mt-5">
          <div className="flex items-center gap-3">
            <img
              className="h-[30px] w-[30px] rounded-full object-cover"
              src={chat.photoURL}
              alt={chat.displayName}
            />
            <span className="text-white">{chat.displayName}</span>
            <span className="ml-5 text-gray-500">{date}</span>
          </div>
          {data.message && (
            <div className="mt-3 w-fit rounded-2xl rounded-tl-none bg-secondary p-5">
              <span className="text-white">{data.message}</span>
            </div>
          )}
          {data.image && (
            <img
              className="mt-2 w-[50%] rounded-2xl rounded-tl-none"
              src={data.image}
            />
          )}
        </div>
      ) : (
        <div ref={dummy} className="mt-5 flex flex-col items-end">
          <span className="text-gray-500">{date}</span>
          {data.message && (
            <div className="mt-3 w-fit rounded-2xl rounded-br-none bg-message p-5">
              <span className="text-white">{data.message}</span>
            </div>
          )}
          {data.image && (
            <img
              className="mt-2 w-[50%] rounded-2xl rounded-br-none"
              src={data.image}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Message;
