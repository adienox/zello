import { User } from "firebase/auth";
import { Dispatch, createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext<ChatContext | null>(null);

export interface ChatDetails {
  chatId: string;
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  userInfoShown: boolean;
}

export interface ChatContext {
  chat: ChatDetails;
  dispatch: Dispatch<{ type: string; payload?: ChatDetails }>;
}

export const initialState = {
  chatId: "",
  displayName: "",
  email: "",
  photoURL: "",
  uid: "",
  userInfoShown: false,
};

const ChatContextProvider = ({ children }: { children: JSX.Element }) => {
  const currentUser = useContext(AuthContext) as User;

  const reducer = (
    state: ChatDetails,
    action: { type: string; payload?: ChatDetails }
  ) => {
    switch (action.type) {
      case "CHANGE_CHAT":
        if (action.payload) {
          return {
            chatId:
              currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid,
            displayName: action.payload.displayName as string,
            email: action.payload.email as string,
            photoURL: action.payload.photoURL as string,
            uid: action.payload.uid as string,
            userInfoShown: false,
          };
        } else {
          console.error(
            "You need to provide Chat Details to be able to use CHANGE_CHAT"
          );
          return state;
        }
      case "TOGGLE_USER_INFO":
        return {
          ...state,
          userInfoShown: !state.userInfoShown,
        };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChatContext.Provider value={{ chat: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
