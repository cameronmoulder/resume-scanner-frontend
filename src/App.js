import React, { useState } from "react";
import axios from "axios";

// Change this to your deployed FastAPI URL
const API_BASE = "https://resume-scanner-backend.azurewebsites.net";
console.log("Deploying version 2.0123");

// Define a single styles object for all inline styles
const styles = {
  container: {
    minHeight: "100vh",
    background: "#f8fafc", // light gray
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    textAlign: "center",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#333",
  },
  button: {
    backgroundColor: "#f59e0b", // vibrant gold
    color: "#fff",
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  formContainer: {
    marginTop: "2rem",
    maxWidth: "24rem",
    width: "100%",
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    width: "100%",
    outline: "none",
  },
  fileName: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    color: "#6b7280", // gray-600
  },
  // Output area styling for a wider container
  outputContainer: {
    marginTop: "2rem",
    width: "80%",            // spans 80% of the viewport width
    maxWidth: "40rem",       // but no more than 40rem
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "0.5rem",
    overflowX: "auto",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
  },
  outputPre: {
    fontSize: "0.875rem",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};

function App() {
  const [invoiceId, setInvoiceId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Store the output as an object so we can access its properties
  const [output, setOutput] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0] || null;
    setResumeFile(file);
    setFileName(file?.name || "");
  };

  const handlePayWithBTC = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/create-btc-invoice/`);
      window.location.href = response.data.payment_url;
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate Bitcoin payment invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (event) => {
    event.preventDefault();
    if (!invoiceId || !jobTitle || !resumeFile) {
      alert("Please enter an invoice ID, job title, and select a resume file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("invoice_id", invoiceId);
    formData.append("job_title", jobTitle);

    try {
      const response = await axios.post(`${API_BASE}/upload-resume/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Store response as an object, not a string
      setOutput(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Resume Rizz</h1>
      <h4 style={styles.heading}>1. Pay Me 2. Use Invoice ID 3. Upload Resume 4. Get the tips you need to land the job of your dreams!</h4>
      <button
        onClick={handlePayWithBTC}
        style={{
          ...styles.button,
          ...(loading ? styles.buttonDisabled : {}),
        }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay with Bitcoin"}
      </button>

      <form onSubmit={handleUploadResume} style={styles.formContainer}>
        <input
          type="text"
          placeholder="Enter Invoice ID after payment"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Enter the job title you want"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
          style={styles.input}
        />
        <div>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileUpload}
            required
            style={styles.input}
          />
          {fileName && <p style={styles.fileName}>{fileName}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? "Processing..." : "Upload Resume"}
        </button>
      </form>

      {output && output.analysis && (
        <div style={styles.outputContainer}>
          <pre style={styles.outputPre}>{output.analysis}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
