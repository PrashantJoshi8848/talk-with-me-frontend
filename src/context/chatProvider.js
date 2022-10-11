import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Chatcontext = createContext();

const ChatProvider = ({ children }) => {
  const history = useNavigate();
  const [user, setuser] = useState();
  const [SelectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setnotification] = useState([]);
  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setuser(userInfo);
    if (!userInfo) {
      history("/");
    }
  }, [history]);
  return (
    <Chatcontext.Provider
      value={{
        notification,
        setnotification,
        user,
        setuser,
        SelectedChat,
        setSelectedChat,
        chats,
        setChats,
      }}
    >
      {children}
    </Chatcontext.Provider>
  );
};

const UseGlobalHook = () => {
  return useContext(Chatcontext);
};

export { ChatProvider, UseGlobalHook };
