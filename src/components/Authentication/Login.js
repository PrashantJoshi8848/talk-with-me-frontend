import {
  VStack,
  FormControl,
  Input,
  FormLabel,
  InputRightElement,
  Button,
  InputGroup,
  useToast,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, updateshow] = useState(false);
  const [dummyname, setdummyname] = useState();
  const [dummypassword, setdummypassword] = useState();
  const [loding, setloding] = useState(false);
  let useremail = useRef();
  let userpassword = useRef();
  const toast = useToast();
  const history = useNavigate();

  function showhandle() {
    updateshow(!show);
  }

  async function SubmitHandler() {
    let email = useremail.current.value;
    let password = userpassword.current.value;
    if (!email || !password) {
      toast({
        title: "Please Fill all the Field",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloding(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email: email,
          password: password,
        },
        config
      );
      toast({
        title: "Login successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloding(false);
      history("/chat");
    } catch (err) {
      setloding(false);
      toast({
        title: "Error Occured",
        description: err.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  }
  return (
    <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          ref={useremail}
          value={dummyname}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            ref={userpassword}
            value={dummypassword}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size="sm" onClick={showhandle}>
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        onLoading={loding}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        colorScheme={"red"}
        width="100%"
        onClick={(e) => {
          setdummyname("guest@gmail.com");
          setdummypassword("123456");
        }}
      >
        Login With GuestAccount
      </Button>
    </VStack>
  );
};

export default Login;
