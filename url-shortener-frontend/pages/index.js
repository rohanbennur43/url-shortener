import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaRegCopy, FaCheck } from "react-icons/fa"; // Import icons
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";

export default function Home() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCode, setqrCode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl("");
    setError("");
    setCopied(false);

    try {
      const response = await axios.post("/api/mapper/shortenurl", { longUrl });
      console.log("Received short URL:", response.data.data.shortUrl);
      setShortUrl(response.data.data.shortUrl);
      setqrCode(true);
    } catch (err) {
      setError("Failed to generate short URL. Please try again.");
      console.error("Error:", err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <div className="shortener-box shadow-lg p-4 rounded">
        <h1 className="mb-3 text-primary fw-bold">URL Shortener</h1>
        <p className="text-muted">Paste a long URL below and get a short version.</p>

        <Form onSubmit={handleSubmit} className="w-100">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="mb-3 p-2"
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Shorten URL
          </Button>
        </Form>

        {shortUrl && (
          <Alert variant="light" className="mt-3 short-url-box">
            <InputGroup className="d-flex align-items-center">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="short-url-text"
              >
                {shortUrl}
              </a>
              <Button variant="outline-secondary" onClick={handleCopy} className="copy-btn ms-2">
                {copied ? <FaCheck className="text-success" /> : <FaRegCopy />}
              </Button>
            </InputGroup>
            {qrCode && (
              <div className="mt-3">
                <QRCode value={shortUrl} />
              </div>
            )}
          </Alert>

        )}

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </div>

      <style jsx>{`
        .shortener-box {
          max-width: 500px;
          width: 100%;
          text-align: center;
          background: #fff;
          border-radius: 12px;
        }

        .short-url-box {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .short-url-text {
          font-size: 1rem;
          font-weight: bold;
          color: #007bff;
          text-decoration: none;
          flex-grow: 1;
          text-align: left;
          overflow-wrap: break-word;
        }

        .short-url-text:hover {
          text-decoration: underline;
        }

        .copy-btn {
          transition: all 0.3s;
        }

        .copy-btn:hover {
          background: #007bff;
          color: white;
        }
      `}</style>
    </Container>
  );
}
