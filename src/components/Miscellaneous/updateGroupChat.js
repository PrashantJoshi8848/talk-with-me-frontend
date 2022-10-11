import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { UseGlobalHook } from "../../context/chatProvider";
import BatchItem from "../userAvatar/BatchItem";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setloading] = useState(false);
  const [renameLoding, setrenameLoading] = useState(false);
  const { user, SelectedChat, setSelectedChat } = UseGlobalHook();

  let toast = useToast();

  async function RemoveuserGroup(userId) {
    if (SelectedChat.groupAdmin._id !== user._id && userId._id !== user._id) {
      toast({
        title: "only admin Can remove user",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setloading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/groupremove`,
        {
          chatId: SelectedChat._id,
          userId: userId._id,
        },
        config
      );
      userId._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessage();
      setloading(false);
    } catch (error) {
      toast({
        title: "Faild to create group",
        description: `Error:${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }
  async function handleRename() {
    if (!groupChatName) {
      return;
    }
    try {
      setrenameLoading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.put(
        `http://localhost:5000/api/chat/rename`,
        {
          chatId: SelectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setrenameLoading(false);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      onClose();
    } catch (err) {
      toast({
        title: "Faild to create group",
        description: `Error:${err}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }
  async function handlesearch(query) {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setloading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user/?search=${search}`,
        config
      );
      setloading(false);
      setFetchAgain(!fetchAgain);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error in Search Result",
        description: `error is ${err}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }
  const handleAddUser = async (userId) => {
    if (SelectedChat.users.find((e) => e._id === userId._id)) {
      toast({
        title: "user already Exist",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }

    if (SelectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admin Can Add user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setloading(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        {
          chatId: SelectedChat._id,
          userId: userId._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setloading(false);
    } catch (error) {
      toast({
        title: "Faild to Add user",
        description: `error is ${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };
  return (
    <>
      <IconButton onClick={onOpen} display={"flex"} icon=<ViewIcon />>
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {SelectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display={"flex"} flexWrap={"wrap"} pb={3}>
              {SelectedChat.users.map((user) => (
                <>
                  <BatchItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      RemoveuserGroup(user);
                    }}
                  />
                </>
              ))}
            </Box>

            <FormControl display={"flex"}>
              <Input
                placeholder="Rename Group"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                colorScheme={"teal"}
                variant={"solid"}
                ml={1}
                isLoading={renameLoding}
                onClick={handleRename}
              >
                update
              </Button>
            </FormControl>

            <FormControl display={"flex"}>
              <Input
                placeholder="Add User To group"
                mb={3}
                onChange={(e) => {
                  handlesearch(e.target.value);
                }}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResult?.map((result) => (
                <>
                  <UserListItem
                    key={result._id}
                    user={result}
                    handleFunction={() => {
                      handleAddUser(result);
                    }}
                  />
                </>
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                RemoveuserGroup(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChat;
