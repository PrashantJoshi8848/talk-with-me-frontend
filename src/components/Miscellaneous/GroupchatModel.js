import React, { useState } from "react";
import UserListItem from "../userAvatar/UserListItem";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { UseGlobalHook } from "../../context/chatProvider";
import axios from "axios";
import BatchItem from "../userAvatar/BatchItem";

const GroupchatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupchatName, setGroupchat] = useState();
  const [selectedUser, setselecteduser] = useState([]);
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloding] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = UseGlobalHook();
  async function handleSearch(query) {
    setsearch(query);
    if (!query) {
      return;
    }
    try {
      setloding(true);
      let config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user/?search=${search}`,
        config
      );
      setloding(false);
      setsearchresult(data);
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
  function handleGroup(userdetail) {
    if (selectedUser.includes(userdetail)) {
      toast({
        title: "User already exist",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    setselecteduser([...selectedUser, userdetail]);
  }

  function deleteuser(userToBeDeleted) {
    setselecteduser(
      selectedUser.filter((sel) => sel._id !== userToBeDeleted._id)
    );
  }

  async function handlesubmit() {
    if (!selectedUser || !groupchatName) {
      toast({
        title: "Fill all The Field",
        status: "Warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwsToken}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupchatName,
          users: JSON.stringify(selectedUser.map((user) => user._id)),
        },
        config
      );
      if (data) {
        setChats([data, ...chats]);
        onClose();
        toast({
          title: "New Group Created Succesfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
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

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Group name"
                mb={3}
                onChange={(e) => {
                  setGroupchat(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="user name"
                mb={3}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            <Box display={"flex"} gap={1} flexWrap={"wrap"}>
              {selectedUser.map((user) => (
                <BatchItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    deleteuser(user);
                  }}
                />
              ))}
            </Box>

            {loading ? (
              <div>Loading...</div>
            ) : (
              searchresult?.slice(0, 4).map((result) => (
                <UserListItem
                  key={result._id}
                  user={result}
                  handleFunction={() => {
                    handleGroup(result);
                  }}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlesubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupchatModel;
