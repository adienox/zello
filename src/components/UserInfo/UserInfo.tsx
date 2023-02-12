import { AuthContext } from "@/context/AuthContext";
import { ChatContext, ChatDetails } from "@/context/ChatContext";
import { db } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { deleteDoc, deleteField, doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import {
  UilBan,
  UilVolumeMute,
  UilArchive,
  UilTrashAlt,
  UilAngleLeft,
} from "@iconscout/react-unicons";

const UserInfo = () => {
  const user = useContext(AuthContext) as User;
  const { chat, dispatch } = useContext(ChatContext) as ChatContext;

  // Function to delete a chat
  const deleteChat = async () => {
    // Object with the chatId field set to a call to the deleteField function
    const chatDeletion = {
      [chat.chatId]: deleteField(),
    };

    // the function updates two userChats documents and deletes a chats document in parallel using Promise.all. This is done to minimize latency and improve performance.
    await Promise.all([
      // Update the userChats document for both the current user and the selected user
      updateDoc(doc(db, "userChats", chat.uid), chatDeletion),
      updateDoc(doc(db, "userChats", user.uid), chatDeletion),

      // Delete the chats document
      deleteDoc(doc(db, "chats", chat.chatId)),
    ]);
  };

  return (
    <div className="md:mt-0 rounded-b-3xl bg-[#5852D6] p-5 md:m-5 md:rounded-2xl">
      <UilAngleLeft
        className="cursor-pointer text-white lg:hidden"
        onClick={() => dispatch({ type: "TOGGLE_USER_INFO" })}
      />
      <div className="mt-5 flex flex-col items-center gap-5 lg:mt-0 lg:flex-row">
        <img
          className="h-[100px] w-[100px] rounded-full bg-white object-cover lg:h-[50px] lg:w-[50px]"
          src={chat.photoURL}
        />
        <div className="flex flex-col">
          <span className="text-center font-bold text-white md:text-left">
            {chat.displayName}
          </span>
          <span className="text-center text-gray-300 md:text-left">
            {chat.email.length > 23
              ? chat.email.slice(0, 23) + "...."
              : chat.email}
          </span>
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-3 text-white">
        <button className="h-12 w-12 rounded-lg bg-[#6962DC]">
          <UilVolumeMute className="mx-auto" />
        </button>
        <button className="h-12 w-12 rounded-lg bg-[#6962DC]">
          <UilArchive className="mx-auto" />
        </button>
        <button
          className="h-12 w-12 rounded-lg bg-[#6962DC] transition-all ease-in-out hover:bg-[#db7272]"
          onClick={deleteChat}
        >
          <UilTrashAlt className="mx-auto" />
        </button>
        <button className="h-12 w-12 rounded-lg bg-[#6962DC] transition-all ease-in-out hover:bg-[#db7272]">
          <UilBan className="mx-auto" />
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
