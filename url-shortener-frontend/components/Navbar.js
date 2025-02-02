import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import axios from "axios";

const NavigationBar = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false); // Placeholder for authentication state

  useEffect(() => {
    const fetchUser = async () => {
      console.log("Trying to get authentication details");

      try {
        const response = await axios.get("/api/users/currentuser", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Response received:", response);
        
        if (response.status === 200) {
          setLoggedIn(true);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error fetching user:", error.response.status, error.response.data);

          if (error.response.status === 401) {
            console.warn("Unauthorized (401) - User is not logged in.");
            setLoggedIn(false);
          }
        } else {
          console.error("Request failed:", error);
          setLoggedIn(false);
        }
      }
    };

    fetchUser(); // Run function on mount
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/">URL Shortener</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">

            {loggedIn ? (
              <NavDropdown title="Profile" id="user-dropdown" align="end" menuVariant="dark">
                <NavDropdown.Item onClick={() => router.push("/profile")}>My Profile</NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push("/settings")}>Dashboard</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => router.push("/auth/signout")}>Sign Out</NavDropdown.Item>
              </NavDropdown>
            ) : (
              
              <NavDropdown title="Profile" id="user-dropdown" align="end" menuVariant="dark">
                <NavDropdown.Item onClick={() => router.push("/auth/signin")}>Sign In</NavDropdown.Item>
                <NavDropdown.Item onClick={() => router.push("/auth/signup")}>Sign Up</NavDropdown.Item>
              </NavDropdown>
              
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
