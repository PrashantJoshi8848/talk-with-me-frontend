import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { UseGlobalHook } from "../context/chatProvider";
import { getSender, getSenderFullDetails } from "./config/chatLogic";
import ProfileModel from "./Miscellaneous/profileModel";
import UpdateGroupChat from "./Miscellaneous/updateGroupChat";
import axios from "axios";
import ScrollableChats from "./ScrollableChats";
import io from "socket.io-client";
import animationData from "./animation/animation.json";

const defaultoption = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  renderSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const ENDPOINT = "http://localhost:5000";
var socket, SelectedChatCompaire;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, SelectedChat, setSelectedChat, notification, setnotification } =
    UseGlobalHook();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setistyping] = useState(false);
  const toast = useToast();

  async function fetchMessage() {
    if (!SelectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${SelectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
      socket.emit("joinChat", SelectedChat._id);
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Faild to load message",
        status: "Error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setistyping(true));
    socket.on("stop typing", () => setistyping(false));
  }, []);

  useEffect(() => {
    fetchMessage();
    SelectedChatCompaire = SelectedChat;
  }, [SelectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecived) => {
      if (
        !SelectedChatCompaire ||
        SelectedChatCompaire._id !== newMessageRecived.chat._id
      ) {
        if (!notification.includes(newMessageRecived)) {
          setnotification([newMessageRecived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
        // give notifiacation
      } else {
        setMessage([...message, newMessageRecived]);
      }
    });
  });
  console.log(notification);
  async function sendMessage(e) {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", () => {
        setistyping(false);
      });
      try {
        let config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.jwsToken}`,
          },
        };
        setNewMessage("");

        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: SelectedChat._id,
          },
          config
        );
        socket.emit("newMessage", data);
        setMessage([...message, data]);
      } catch (err) {
        toast({
          title: "Error occure",
          description: "faild to send the message",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  function typingHandle(e) {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", SelectedChat._id);
    }
    let lasttypingtime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timerDiff = timeNow - lasttypingtime;
      if (timerDiff >= timerLength && typing) {
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }
  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"Center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!SelectedChat.isGroupChat ? (
              <>
                {getSender(user, SelectedChat.users)}
                <ProfileModel
                  user={getSenderFullDetails(user, SelectedChat.users)}
                />
              </>
            ) : (
              <>
                {SelectedChat.chatName.toUpperCase()}
                <UpdateGroupChat
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent="flex-end"
            p={3}
            bg={"#E8E8E8"}
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf="center"
                margin={"auto"}
              />
            ) : (
              <div
                className="messages"
                display="flex"
                flexDir={"column"}
                overflowY="scroll"
                scrollbarWidth="none"
              >
                <ScrollableChats message={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {istyping ? (
                <div>
                  <Lottie
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                    options={defaultoption}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant={"filled"}
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandle}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize={"3xl"} pb="3" fontFamily={"Work sans"}>
            Click on user To Chat....
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
