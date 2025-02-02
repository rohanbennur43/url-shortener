import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post("/api/users/signout", {}, { withCredentials: true });
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        router.push("/");
        router.reload() // ✅ Redirect to Sign In after logout
      }
    };

    logout();
  }, []);

  return <p>Signing out...</p>;
}
