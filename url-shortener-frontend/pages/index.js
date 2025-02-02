import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl(""); // Clear previous short URL
    setError("");

    try {
      const response = await axios.post("/api/mapper/shortenurl", { longUrl });
      console.log("Received short url successfully from backend",response.data.data.shortUrl)
      setShortUrl(response.data.data.shortUrl);
    } catch (err) {
      setError("Failed to generate short URL. Please try again.");
      console.error("Error:", err);
    }
  };

  return (
    <Container className="mt-5 text-center">
      <h1>URL Shortener</h1>
      <p>Enter a long URL to shorten it.</p>

      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter long URL"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Shorten URL
        </Button>
      </Form>

      {shortUrl && (
        <Alert variant="success" className="mt-3">
          Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </Alert>
      )}

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
}
