import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Authentication/Login";
import Signup from "../Authentication/Signup";

const Home = () => {
  const history = useNavigate();
  useEffect(() => {
    let userInfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userInfo) {
      history("/chat");
    }
  }, [history]);
  return (
    <>
      <Container maxW="xl" centerContent>
        <Box
          textAlign={"center"}
          p={3}
          bg={"white"}
          w="100%"
          m="40px 0 15px 0"
          borderRadius="1g"
          borderWidth="1px"
        >
          <Text fontSize={"4xl"} fontFamily="Work sans">
            Chat_With_ME
          </Text>
        </Box>
        <Box bg={"white"} w="100%" p={4} borderRadius="lg" borderWidth={"1px"}>
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList mb={"1em"}>
              <Tab width={"50%"}>Login</Tab>
              <Tab width={"50%"}>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div>{<Login />}</div>
              </TabPanel>
              <TabPanel>
                <p>{<Signup />}</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
};

export default Home;
