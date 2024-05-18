import { Redirect } from "expo-router";
import { useRecipeStore } from "@/lib/store";
const index = () => {
  const isAuthenticated = useRecipeStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return Redirect({ href: "/protected/" });
  } else {
    return Redirect({ href: "/auth/" });
  }
};

export default index;
