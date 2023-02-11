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

  // The following useEffect hook retrieves the messages from the specified chat
  // whenever the `chat.chatId` value changes
  useEffect(() => {
    // Defines a function to get the messages and set the cleanup function
    const getMessages = () => {
      // Listens to changes in the document in the 'chats' collection with the ID of the current chat
      // and updates the `messages` state with the new data when it exists
      const cleanup = onSnapshot(doc(db, "chats", chat.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });
      // Returns a cleanup function that will be called when the component unmounts
      return () => {
        cleanup();
      };
    };

    // Calls the `getMessages` function if the `chat.chatId` value is truthy
    chat.chatId && getMessages();
  }, [chat.chatId]);

  // The following code maps through the messages array and returns an array of `Message` components
  // If the `message.senderId` matches the current user's `uid`, it will pass `owner` as a prop to the component
  // Otherwise, it will only pass the `data` prop to the component
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
