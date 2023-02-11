import { db } from "@/firebase/clientApp";
import { UilSearch } from "@iconscout/react-unicons";
import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import SearchItem from "./SearchItem";

const SearchBox = () => {
  // Setting the initial state for the searchText and chat variables using the useState hook
  const [searchText, setSearchText] = useState("");
  const [chat, setChat] = useState<DocumentData | null>(null);

  // The searchUser function that is called on form submission
  const searchUser = async (event: React.FormEvent) => {
    event.preventDefault();

    // Building the query using the collection and where methods
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchText)
    );

    // Getting the querySnapshot by calling the getDocs function
    const querySnapshot = await getDocs(q);

    // Updating the chat state by setting it to the data of the first document in the querySnapshot
    setChat(querySnapshot.docs[0]?.data());
  };

  return (
    <>
      <form
        onSubmit={searchUser}
        className="mx-auto h-[minmax(60px,_max-content)] rounded-2xl bg-secondary p-3 text-gray-500"
      >
        <div className="flex items-center gap-5">
          <label htmlFor="search">
            <UilSearch />
          </label>
          <input
            value={searchText}
            className="h-[50px] w-full bg-secondary text-white outline-none placeholder:text-gray-500 autofill:text-white"
            autoComplete="off"
            type="text"
            id="search"
            placeholder="Search"
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        {chat && (
          <SearchItem chat={chat} setSearch={setSearchText} setChat={setChat} />
        )}
      </form>
    </>
  );
};

export default SearchBox;
