import Router from "next/router";
import { useContext, useEffect } from "react";
import Chat from "@/components/Chat";
import Search from "@/components/Search";
import UserInfo from "@/components/UserInfo";
import { AuthContext } from "@/context/AuthContext";
import { ChatContext } from "@/context/ChatContext";

const Index = () => {
  const user = useContext(AuthContext);
  const { chat } = useContext(ChatContext) as ChatContext;

  useEffect(() => {
    if (!user) {
      Router.push("/register");
    }
  });
  const gridColumns = chat.chatId ? "grid-cols-[1fr_2fr_1fr]" : "grid-cols-1";
  return (
    user && (
      <>
        {/* Content for desktop */}
        <div
          className={`hidden border-black md:border-t-2 lg:grid ${gridColumns}`}
        >
          <Search />
          {chat.chatId && (
            <>
              <Chat />
              <UserInfo />
            </>
          )}
        </div>
        {/* Content for small screen desktop */}
        <div className="bg-primary hidden md:block">
          {chat.chatId === "" && <Search />}
          {chat.chatId && !chat.userInfoShown && <Chat />}
          {chat.userInfoShown && <UserInfo />}
        </div>

        {/* Content for Mobile */}
        <div className="h-[100vh] w-[100vw] bg-primary md:hidden">
          {chat.chatId === "" && <Search />}
          {chat.chatId && !chat.userInfoShown && <Chat />}
          {chat.userInfoShown && <UserInfo />}
        </div>
      </>
    )
  );
};

export default Index;
