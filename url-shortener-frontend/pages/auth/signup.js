import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "/api/users/signup",
        { email, password },
        { withCredentials: true }
      );

      setLoading(false);
      window.location.href = "/";
      // router.reload(); // Optional: Uncomment if needed
    } catch (err) {
      setLoading(false);

      if (err.response?.status === 400) {
        console.group("Encountered errors while signing up");

        if (Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach((error) => console.error(error.msg));
          setError(err.response.data.errors.map((e) => e.msg).join(", "));
        } else {
          setError("An unexpected error occurred.");
        }

        console.groupEnd();
      } else {
        setError(err.response?.data?.error || "Signup failed. Please try again.");
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="shadow-lg p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>Already have an account? <a href="/signin">Sign In</a></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
