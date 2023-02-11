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

  useEffect(() => {
    const getChats = () => {
      const cleanup = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        cleanup();
      };
    };
    user.uid && getChats();
  }, [user]);

  const chatItems = chats
    ? Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map((doc) => {
          if (chat.chatId === doc[0]) {
            return <ChatItems key={doc[0]} details={doc} active={true} />;
          }
          return <ChatItems key={doc[0]} details={doc} />;
        })
    : [];

  const activeItems = chatItems.filter((chat) => {
    if (chat.props.active) {
      return chat;
    }
  });

  useEffect(() => {
    if (activeItems.length === 0) {
      dispatch({ type: "RESET" });
    }
  }, [activeItems.length]);

  return (
    <div className="h-[calc(100vh-2.5rem-60px)] overflow-scroll pt-3 pb-[90px] scrollbar-hide md:h-[calc(100%-54px)] md:pb-3">
      {chatItems.length !== 0 ? (
        chatItems
      ) : (
        <div className="mx-auto mt-10 flex w-[40%] flex-col items-center rounded bg-blueHighlight p-10 text-white drop-shadow-2xl">
          <h3 className="text-3xl">Get started!</h3>
          <p className="text-sm">
            Search users from the search bar and get to know each other!
          </p>
          <Image src={Reading} className="w-[80%]" alt="" />
        </div>
      )}
    </div>
  );
};

export default Chats;
