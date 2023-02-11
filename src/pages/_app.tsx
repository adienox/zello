import HeadElement from "@/components/HeadElement";
import Layout from "@/components/Layout";
import AuthContextProvider from "@/context/AuthContext";
import ChatContextProvider from "@/context/ChatContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "@next/font/google";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeadElement />
      <AuthContextProvider>
        <ChatContextProvider>
          <Layout>
            <main className={poppins.className}>
              <Component {...pageProps} />
            </main>
          </Layout>
        </ChatContextProvider>
      </AuthContextProvider>
    </>
  );
}
