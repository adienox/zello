import { useContext, useEffect, useState } from "react";
import Message, { MessageObject } from "./Message";
import { ChatContext } from "@/context/ChatContext";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { AuthContext } from "@/context/AuthContext";
import { User } from "firebase/auth";
import Input from "./Input";

const Messages = () => {
  const { chat } = useContext(ChatContext) as ChatContext;
  const currentUser = useContext(AuthContext) as User;
  const [messages, setMessages] = useState<DocumentData>([]);

  useEffect(() => {
    const getMessages = () => {
      const cleanup = onSnapshot(doc(db, "chats", chat.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      return () => {
        cleanup();
      };
    };

    chat.chatId && getMessages();
  }, [chat.chatId]);

  const messageItems = chat.chatId
    ? messages.map((message: MessageObject) => {
        if (message.senderId === currentUser.uid) {
          return <Message data={message} key={message.id} owner />;
        }
        return <Message data={message} key={message.id} />;
      })
    : [];

  return (
    <>
      <div className="h-[calc(100vh-120px-2.5rem)] overflow-scroll p-5 scrollbar-hide md:h-[calc(90vh-272px)]">
        {messageItems}
      </div>
      {chat.chatId && <Input messageCount={messages.length} />}
    </>
  );
};

export default Messages;
