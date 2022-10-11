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

const Signup = () => {
  const toast = useToast();
  const [showPassword, updateshowpassword] = useState(false);
  const [show_Cpassword, u_Cpassword] = useState(false);
  const [loding, setloding] = useState(false);
  const [picUrl, setpicUrl] = useState();
  let name = useRef();
  let email = useRef();
  let password = useRef();
  let confirm_password = useRef();
  const history = useNavigate();

  function showhandle(e) {
    if (e.target.id === "showpassword") {
      updateshowpassword(!showPassword);
    } else if (e.target.id === "showConfirmPassword") {
      u_Cpassword(!show_Cpassword);
    }
  }
  function postdetails(profiePic) {
    setloding(true);
    if (profiePic === undefined) {
      toast({
        title: "Please Select your image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (profiePic.type === "image/png" || profiePic.type === "image/jpeg") {
      const picdata = new FormData();
      picdata.append("file", profiePic);
      picdata.append("upload_preset", "fbxwq7yv");
      picdata.append("clod_name", "dbhir6f74");

      fetch("https://api.cloudinary.com/v1_1/dbhir6f74/image/upload", {
        method: "post",
        body: picdata,
      })
        .then((response) => {
          return response.json();
        })
        .then(function (response) {
          setpicUrl(response.url.toString());
          setloding(false);
        })
        .catch((err) => {
          if (err) {
            setloding(false);
            throw new Error("Server error");
          }
        });
    } else {
      toast({
        title: "Unsupported image Format!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  async function SubmitHandler() {
    let username = name.current.value;
    let useremail = email.current.value;
    let userpassword = password.current.value;
    let userConfirmPass = confirm_password.current.value;
    setloding(true);
    if (!username || !useremail || !userpassword || !userConfirmPass) {
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
    if (userpassword !== userConfirmPass) {
      toast({
        title: "Password dosen't Match",
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
        "http://localhost:5000/api/user",
        {
          name: username,
          email: useremail,
          password: userpassword,
          pic: picUrl,
        },
        config
      );
      toast({
        title: "SignUp successfull",
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
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input placeholder="Enter your Name" ref={name} />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter your Email" ref={email} />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>password</FormLabel>
        <InputGroup>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            name="password"
            ref={password}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size="sm"
              onClick={showhandle}
              id="showpassword"
            >
              {showPassword ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
          <Input
            type={show_Cpassword ? "text" : "password"}
            placeholder="Enter your Password"
            name="Confirmpassword"
            ref={confirm_password}
          />
          <InputRightElement width={"4.5rem"}>
            <Button
              h={"1.75rem"}
              size="sm"
              onClick={showhandle}
              id="showConfirmPassword"
            >
              {show_Cpassword ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload profile Picture</FormLabel>
        <Input
          type={"file"}
          placeholder="Enter your Email"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postdetails(e.target.files[0]);
          }}
        />
      </FormControl>
      <Button
        colorScheme={"blue"}
        width="100%"
        style={{ marginTop: 15 }}
        onClick={SubmitHandler}
        isLoading={loding}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
