import { UseGlobalHook } from "../../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Miscellaneous/SideDrawer";
import Mychat from "../Mychat";
import ChatBox from "../ChatBox";
import { useState } from "react";
const Chatpage = () => {
  const { user } = UseGlobalHook();
  const [fetchAgain, setFetchAgain] = useState();
  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SideDrawer />}
        <Box
          display={"flex"}
          justifyContent="space-between"
          h={"91.5vh"}
          w={"100%"}
          p={"10px"}
        >
          {user && <Mychat fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default Chatpage;
