import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "./Navbar";
import { ChatContext } from "@/context/ChatContext";

const Layout = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useRouter();
  const [navShown, setNavShown] = useState(true);
  const { chat } = useContext(ChatContext) as ChatContext;

  useEffect(() => {
    setNavShown(window.innerWidth < 760 ? false : true);
  });

  if (pathname.match("register|login")) {
    return children;
  } else {
    return (
      <div className="container mx-auto overflow-hidden drop-shadow-2xl md:mt-10 md:h-[90vh] md:rounded-3xl">
        {navShown ? <Navbar /> : chat.chatId === "" && <Navbar />}
        {children}
      </div>
    );
  }
};

export default Layout;
