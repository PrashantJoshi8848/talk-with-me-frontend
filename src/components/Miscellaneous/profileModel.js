import { useDisclosure } from "@chakra-ui/hooks";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import React from "react";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div>
        {children ? (
          <span onClick={onOpen}>{children}</span>
        ) : (
          <IconButton display={"flex"} icon={<ViewIcon />} onClick={onOpen} />
        )}
        <Modal size={"lg"} isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent h={"410px"}>
            <ModalHeader
              fontFamily={"Work sans"}
              display={"flex"}
              justifyContent={"center"}
              fontSize="40px"
            >
              {user.name}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              display={"flex"}
              alignItems="center"
              flexDir={"column"}
              justifyContent={"center"}
            >
              <Image
                borderRadius={"full"}
                boxSize={"150px"}
                src={user.pic}
                alt={user.name}
              />
              <Text fontSize={{ base: "28px", md: "30px" }}>
                Email:{user.email}
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default ProfileModel;
