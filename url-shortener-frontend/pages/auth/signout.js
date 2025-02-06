import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Spinner, Card } from "react-bootstrap";

export default function SignOut() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="shadow-lg p-4 text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h3 className="mb-3">Signing Out</h3>
          {loading ? (
            <>
              <p className="text-muted">Please wait while we sign you out...</p>
              <Spinner animation="border" variant="primary" />
            </>
          ) : (
            <p className="text-success">Successfully signed out! Redirecting...</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
