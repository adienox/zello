import { AuthContext } from "@/context/AuthContext";
import { ChatContext, ChatDetails } from "@/context/ChatContext";
import { db } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import {
  DocumentData,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Dispatch, SetStateAction, useContext } from "react";

const SearchItem = ({
  chat,
  setSearch,
  setChat,
}: {
  chat: DocumentData;
  setSearch: Dispatch<SetStateAction<string>>;
  setChat: Dispatch<SetStateAction<DocumentData | null>>;
}) => {
  const user = useContext(AuthContext) as User;
  const { dispatch } = useContext(ChatContext) as ChatContext;

  const selectUser = async () => {
    const combinedUid =
      user.uid > chat.uid ? user.uid + chat.uid : chat.uid + user.uid;
    const docRef = doc(db, "chats", combinedUid);

    try {
      const document = await getDoc(docRef);
      if (!document.exists()) {
        await setDoc(docRef, { messages: [] });
      }

      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedUid + ".userInfo"]: {
          uid: chat.uid,
          displayName: chat.displayName,
          photoURL: chat.photoURL,
          email: chat.email,
        },
        [combinedUid + ".date"]: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }

    dispatch({ type: "CHANGE_CHAT", payload: chat as ChatDetails });

    setSearch("");
    setChat(null);
  };
  return (
    <div
      className="mt-3 flex cursor-pointer items-center gap-5 rounded-2xl p-5 transition-all ease-in-out hover:bg-primaryDark"
      onClick={selectUser}
    >
      <img
        className="h-[50px] w-[50px] self-start rounded-full object-cover"
        src={chat.photoURL}
        alt={chat.displayName}
      />
      <div className="flex w-full flex-col">
        <h3 className="text-lg font-bold text-white">{chat.displayName}</h3>
        <span className="text-gray-500">
          {chat.email.length > 17
            ? chat.email.slice(0, 17) + "...."
            : chat.email}
        </span>
      </div>
    </div>
  );
};

export default SearchItem;
