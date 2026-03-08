import { RouterProvider } from "react-router";
import { router } from "./routes";
import { I18nProvider } from "./components/I18nProvider";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <I18nProvider>
          <RouterProvider router={router} />
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
