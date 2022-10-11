import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { UseGlobalHook } from "../../context/chatProvider";
import ProfileModel from "./profileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../config/chatLogic";
import NotificationBadge, { Effect } from "react-notification-badge";
import { effect } from "react-notification-badge";

const SideDrawer = () => {
  // =============globalHooks======== //
  const {
    user,
    chats,
    setSelectedChat,
    setChats,
    notification,
    setnotification,
  } = UseGlobalHook();
  const { pic, name } = user;
  //   ========= useNavigator ======= //
  const { isOpen, onOpen, onClose } = useDisclosure();
  //=========Hooks========//
  const [Search, setSearch] = useState("");
  const [loading, setloding] = useState(false);
  const [searchResult, setsearchResult] = useState();
  const [Loadingchat, setlodingchat] = useState(false);

  const toast = useToast();

  const accessChat = async (userId) => {
    try {
      setlodingchat(true);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId },
        config
      );
      if (!chats.find((e) => e._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setlodingchat(false);
      onClose();
    } catch (err) {
      toast({
        title: "fetching data Error",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  };
  const HandleSearch = async () => {
    if (!Search) {
      toast({
        title: "Please Fill  Search Field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setloding(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${Search}`,
        config
      );
      setloding(false);
      setsearchResult(data);
    } catch (err) {
      toast({
        title: "Error in Search Result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  const history = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history("/");
  };
  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center   "}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
      >
        {/* <Tooltip label="Search user To Chat" placement="bottom-end" /> */}
        <Tooltip label="Search user To Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Chat_With_ME
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "no new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setnotification(notification.filter((e) => e !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {pic ? (
                  <Avatar size={"sm"} cursor="pointer" src={pic} />
                ) : (
                  <Avatar size={"sm"} cursor="pointer" name={name} />
                )}
              </MenuButton>
              <MenuList>
                <ProfileModel user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModel>
                <MenuDivider />
                <MenuItem onClick={logoutHandler}>LogOut</MenuItem>
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={"2"}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={Search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={HandleSearch}>Go</Button>
            </Box>
            {Loadingchat ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    accessChat(user._id);
                  }}
                />
              ))
            )}
            {loading && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
