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

  // Handles the form submission, sending a message or an image
  const handleSubmit = async (event: React.FormEvent) => {
    // Prevents the default form submission behavior
    event.preventDefault();

    // If the message count is 0, update the "userChats" document
    // with the combined UID of the current user and the recipient
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

    // If an image was selected, upload the image to the storage
    if (image) {
      const storageRef = ref(storage, "images/" + nanoid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        // Handle progress updates
        null,
        // Handle errors
        (error) => console.log(error),
        // Handle completion
        async () => {
          // Get the download URL for the uploaded image
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update the "chats" document with the message
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

      // Update the "userChats" document with the last message information
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

      // Reset the selected image
      setImage(null);
    }

    // If a text message was entered, send the message
    if (text) {
      const message = {
        messages: arrayUnion({
          message: text,
          id: nanoid(),
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      };

      // Set the lastMessage object to contain the information of the last message sent in the chat
      const lastMessage = {
        [chat.chatId + ".lastMessage"]: {
          senderId: currentUser.uid,
          text,
        },
        [chat.chatId + ".date"]: serverTimestamp(),
      };

      // Reset the text in the state after sending the message
      setText("");

      // Update the information in the chats document, userChats document for the current user, and userChats document for the recipient of the message
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
        autoComplete="off"
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
