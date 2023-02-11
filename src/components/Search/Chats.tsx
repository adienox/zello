import { useContext, useEffect, useState } from "react";
import ChatItems from "./ChatItems";
import { AuthContext } from "@/context/AuthContext";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { ChatContext } from "@/context/ChatContext";
import Image from "next/image";
import Reading from "@/images/reading.svg";

const Chats = () => {
  const user = useContext(AuthContext) as User;
  const { chat, dispatch } = useContext(ChatContext) as ChatContext;
  const [chats, setChats] = useState<DocumentData>();

  // Set up a real-time subscription to the user's chats data
  useEffect(() => {
    if (!user.uid) return; // Exit if the user isn't authenticated

    const unsubscribe = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
      setChats(doc.data()); // Update the chat data in state
    });
    return () => {
      unsubscribe(); // Clean up the subscription when unmounting
    };
  }, [user]);

  // Transform the chat data into an array of ChatItem components
  const chatItems = chats
    ? Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date) // Sort the entries by date
        .map((doc) => {
          if (chat.chatId === doc[0]) {
            return <ChatItems key={doc[0]} details={doc} active />;
          }
          return <ChatItems key={doc[0]} details={doc} />;
        })
    : [];

  // Filter the chat items to find the active one
  const activeItems = chatItems.filter((chat) => chat.props.active);

  // Reset the chat context if there is no active chat item
  useEffect(() => {
    if (activeItems.length === 0) {
      dispatch({ type: "RESET" });
    }
  }, [activeItems.length]);

  return (
    <div className="h-[calc(100vh-2.5rem-60px)] overflow-scroll pt-3 pb-[90px] scrollbar-hide md:h-[calc(100%-54px)] md:pb-3">
      {chatItems.length ? (
        chatItems
      ) : (
        <div className="mx-auto mt-10 flex flex-col items-center rounded bg-blueHighlight p-10 text-white drop-shadow-2xl md:w-[40%]">
          <h3 className="text-3xl">Get started!</h3>
          <p className="text-center text-sm">
            Search users from the search bar and get to know each other!
          </p>
          <Image src={Reading} className="w-[80%]" alt="" />
        </div>
      )}
    </div>
  );
};

export default Chats;
