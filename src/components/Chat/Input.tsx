import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase/clientApp";
import { User } from "firebase/auth";
import { nanoid } from "nanoid";
import {
  UilScenery,
  UilMessage,
  UilMicrophone,
} from "@iconscout/react-unicons";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = ({ messageCount }: { messageCount: number }) => {
  const { chat } = useContext(ChatContext) as ChatContext;
  const currentUser = useContext(AuthContext) as User;
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!messageCount) {
      const combinedUid =
        currentUser.uid > chat.uid
          ? currentUser.uid + chat.uid
          : chat.uid + currentUser.uid;

      await updateDoc(doc(db, "userChats", chat.uid), {
        [combinedUid + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
        },
        [combinedUid + ".date"]: serverTimestamp(),
      });
    }

    if (image) {
      const storageRef = ref(storage, "images/" + nanoid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        null,
        (error) => console.log(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "chats", chat.chatId), {
            messages: arrayUnion({
              id: nanoid(),
              senderId: currentUser.uid,
              date: Timestamp.now(),
              image: downloadURL,
            }),
          });
        }
      );

      const lastMessage = {
        [chat.chatId + ".lastMessage"]: {
          senderId: currentUser.uid,
          text: "Photo",
        },
        [chat.chatId + ".date"]: serverTimestamp(),
      };

      await Promise.all([
        updateDoc(doc(db, "userChats", currentUser.uid), lastMessage),
        updateDoc(doc(db, "userChats", chat.uid), lastMessage),
      ]);

      setImage(null);
    }

    if (text) {
      const message = {
        messages: arrayUnion({
          message: text,
          id: nanoid(),
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      };

      const lastMessage = {
        [chat.chatId + ".lastMessage"]: {
          senderId: currentUser.uid,
          text,
        },
        [chat.chatId + ".date"]: serverTimestamp(),
      };

      setText("");

      await Promise.all([
        updateDoc(doc(db, "chats", chat.chatId), message),
        updateDoc(doc(db, "userChats", currentUser.uid), lastMessage),
        updateDoc(doc(db, "userChats", chat.uid), lastMessage),
      ]);
    }
  };

  return (
    <form
      className="m-5 flex h-[60px] items-center justify-between rounded-2xl bg-secondary p-5"
      onSubmit={handleSubmit}
    >
      <input
        value={text}
        className="w-full bg-secondary text-white caret-blueHighlight outline-none placeholder:text-gray-500"
        type="text"
        placeholder="Type Something..."
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex items-center gap-2 text-gray-400">
        <UilMicrophone />
        <label
          htmlFor="file"
          className={`cursor-pointer ${image ? "text-blueHighlight" : ""}`}
        >
          <UilScenery />
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
          className="hidden"
        />
        <button className="h-8 w-8 rounded-lg bg-greenHighlight text-black">
          <UilMessage className="mx-auto" />
        </button>
      </div>
    </form>
  );
};

export default Input;
