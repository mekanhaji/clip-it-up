import { Toaster } from "@/components/ui/toaster";
import { useIncomingClips } from "@/hooks/useIncomingClips";
import { useApplyTheme } from "@/hooks/useTheme";
import { useRoute } from "@/lib/router";
import { useRoomUrlSync } from "@/pages/home/hooks/useRoomUrlSync";
import HomePage from "./pages/home/HomePage.tsx";
import SettingsPage from "./pages/settings/SettingsPage.tsx";

const App = () => {
  const route = useRoute();

  // App-wide concerns that must outlive whichever page is showing.
  useApplyTheme();
  useRoomUrlSync();
  useIncomingClips();

  return (
    <>
      {route === "settings" ? <SettingsPage /> : <HomePage />}
      <Toaster />
    </>
  );
};

export default App;
