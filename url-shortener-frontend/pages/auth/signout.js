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
        setTimeout(() => {
          setLoading(false);
        //   router.reload()
        //   router.push("/auth/signin");
          window.location.href = "/"; //
        }, 1500); // Small delay for better UX
      }
    };

    logout();
  }, []);

  return <p>Signing out...</p>;
}
