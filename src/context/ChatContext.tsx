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

  // Define the reducer function to handle different actions
  const reducer = (
    state: ChatDetails,
    action: { type: string; payload?: ChatDetails }
  ) => {
    switch (action.type) {
      case "CHANGE_CHAT":
        // Check if the action has a payload with the Chat Details
        if (action.payload) {
          // Compute the chatId based on the uid of the current user and the selected user
          const chatId =
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid;

          // Return the updated Chat Details object with the computed chatId
          return {
            chatId,
            displayName: action.payload.displayName as string,
            email: action.payload.email as string,
            photoURL: action.payload.photoURL as string,
            uid: action.payload.uid as string,
            userInfoShown: false,
          };
        } else {
          // Log an error message if no Chat Details were provided
          console.error(
            "You need to provide Chat Details to be able to use CHANGE_CHAT"
          );
          return state;
        }
      case "TOGGLE_USER_INFO":
        // Return the updated state with the toggled userInfoShown field
        return {
          ...state,
          userInfoShown: !state.userInfoShown,
        };
      case "RESET":
        // Return the initial state
        return initialState;
      default:
        // Return the state unchanged
        return state;
    }
  };

  // Use the useReducer hook to manage the state
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ChatContext.Provider value={{ chat: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContextProvider;
