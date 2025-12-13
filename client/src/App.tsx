import { useState } from "react";
import { HomePage, ClipboardRoom } from "./components";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      {!currentRoom ? (
        <HomePage onRoomJoin={setCurrentRoom} />
      ) : (
        <ClipboardRoom
          roomCode={currentRoom}
          isConnected={isConnected}
          setIsConnected={setIsConnected}
          onLeaveRoom={() => setCurrentRoom(null)}
        />
      )}
      <Toaster />
    </>
  );
};

export default App;
