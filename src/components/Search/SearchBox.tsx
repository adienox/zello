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
  const [searchText, setSearchText] = useState("");
  const [chat, setChat] = useState<DocumentData | null>(null);

  const searchUser = async (event: React.FormEvent) => {
    event.preventDefault();

    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchText)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setChat(doc.data());
    });
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
