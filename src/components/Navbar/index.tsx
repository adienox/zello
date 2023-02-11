import MenuElements from "./MenuElements";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { auth } from "@/firebase/clientApp";
import { User, signOut } from "firebase/auth";

const index = () => {
  const currentUser = useContext(AuthContext) as User;

  return (
    currentUser && (
      <>
        {/* Desktop Navbar */}
        <div className="hidden h-[90px] items-center justify-between bg-primary p-10 md:flex">
          <div className="flex items-center gap-12">
            <h1 className="bg-gradient-to-r from-gray-100 to-gray-500 bg-clip-text text-2xl font-bold text-transparent">
              Zello
            </h1>
            <MenuElements />
          </div>
          <div className="flex items-center gap-5">
            <div className="mr-5 flex items-center gap-5 text-white">
              <button
                className="rounded-2xl bg-black p-3"
                onClick={() => signOut(auth)}
              >
                Logout
              </button>
            </div>
            <div className="hidden flex-col lg:flex">
              <h2 className="font-bold text-gray-200">
                Good Evening, {currentUser.displayName}
              </h2>
              <span className="self-end text-gray-500">
                {currentUser.email}
              </span>
            </div>
            <img
              className="h-[50px] w-[50px] rounded-full object-cover"
              src={currentUser.photoURL as string}
              alt="user image"
            />
          </div>
        </div>
        {/* Mobile Navbar */}
        <div className="fixed bottom-0 left-0 right-0 flex h-[90px] items-center rounded-3xl rounded-b-none bg-primaryDark/75 text-gray-300 backdrop-blur-sm md:hidden">
          <MenuElements />
        </div>
      </>
    )
  );
};

export default index;
