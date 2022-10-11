import { Box, useToast, Button, Stack, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UseGlobalHook } from "../context/chatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "./config/chatLogic";
import GroupchatModel from "./Miscellaneous/GroupchatModel";

const Mychat = ({ fetchAgain }) => {
  const { user, chats, setChats, SelectedChat, setSelectedChat } =
    UseGlobalHook();
  const toast = useToast();

  const fetchchats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (err) {
      toast({
        title: "fetching data Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    fetchchats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
      // d={{ base: user ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
      overflowY="scroll"
    >
      <Box
        width={"100%"}
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
      >
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>My Chats</span>
        <GroupchatModel>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            create Group
          </Button>
        </GroupchatModel>
      </Box>

      {/* problem Phase */}
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#f8f8f8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((result) => (
              <Box
                onClick={(e) => {
                  setSelectedChat(result);
                }}
                cursor="pointer"
                bg={SelectedChat === result ? "#38B2AC" : "#E8E8E8"}
                color={SelectedChat === result ? "white" : "black"}
                px={"1rem"}
                py={2}
                borderRadius={"lg"}
                key={result._id}
              >
                <Text>
                  {result.isGroupChat
                    ? result.chatName
                    : getSender(user, result.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Mychat;
