import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ChatContext } from "@/context/ChatContext";
import Navbar from "../components/Navbar";

const Layout = ({ children }: { children: JSX.Element }) => {
  // Destructure `pathname` from the Next.js `useRouter` hook
  const { pathname } = useRouter();

  // State to keep track of whether the navbar should be shown or not
  const [navShown, setNavShown] = useState(true);

  // Destructure the `chat` value from the `ChatContext`
  const { chat } = useContext(ChatContext) as ChatContext;

  // Use effect hook to set the `navShown` state based on the window width
  useEffect(() => {
    setNavShown(window.innerWidth < 760 ? false : true);
  }, []); // Adding an empty dependency array to ensure that the effect only runs once on mount

  // If the `pathname` matches "register" or "login", return the children directly
  if (pathname.match("register|login")) {
    return children;
  } else {
    return (
      <div className="container mx-auto overflow-hidden drop-shadow-2xl md:mt-10 md:h-[90vh] md:rounded-3xl">
        {/* Only render the `Navbar` component if `navShown` is `true` or if `chat.chatId` is an empty string */}
        {navShown || chat.chatId === "" ? <Navbar /> : null}
        {children}
      </div>
    );
  }
};

export default Layout;
