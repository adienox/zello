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
  // Importing the user from the AuthContext and the dispatch method from the ChatContext using the useContext hook
  const user = useContext(AuthContext) as User;
  const { dispatch } = useContext(ChatContext) as ChatContext;

  // The selectUser function that is called when a user is selected
  const selectUser = async () => {
    // Creating the unique identifier for the chat by combining the uids of the current user and the selected user
    const combinedUid =
      user.uid > chat.uid ? user.uid + chat.uid : chat.uid + user.uid;
    const docRef = doc(db, "chats", combinedUid);

    try {
      // Getting the document using the getDoc function and setting an initial value if it doesn't exist
      const document = await getDoc(docRef);
      if (!document.exists()) {
        await setDoc(docRef, { messages: [] });
      }

      // Updating the document using the updateDoc function
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

    // Dispatching the CHANGE_CHAT action to update the current chat
    dispatch({ type: "CHANGE_CHAT", payload: chat as ChatDetails });

    // Clearing the search text and chat data
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
