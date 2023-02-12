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

  // This sets the initial state of the `width` variable to the inner width of the window
  const [width, setWidth] = useState(window.innerWidth);

  // This useEffect hook sets the `navShown` state based on the window width
  // when the component using this hook is first rendered and whenever the `width` state updates
  useEffect(() => {
    // This function sets the width of the window to `setWidth`
    const handleResize = () => setWidth(window.innerWidth);

    // Adds an event listener to the window object for when the "resize" event occurs
    window.addEventListener("resize", handleResize);

    // This sets the value of `setNavShown` based on the current width of the window
    setNavShown(width < 768 ? false : true);

    // This function returns a cleanup function that will remove the event listener
    // when the component using this hook unmounts or when the `useEffect` is re-run
    return () => window.removeEventListener("resize", handleResize);
  }, [width]);

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
