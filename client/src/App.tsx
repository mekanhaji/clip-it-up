import HomePage from "./pages/home/HomePage.tsx";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  return (
    <>
      <HomePage />
      <Toaster />
    </>
  );
};

export default App;
