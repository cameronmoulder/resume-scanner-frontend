import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://resume-scanner-backend.azurewebsites.net";  // Deployed FastAPI URL
// Or use an .env variable
// const API_BASE = process.env.REACT_APP_API_BASE;

function App() {
  const [invoiceId, setInvoiceId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");

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
      setOutput(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
      padding: '1rem'
    },
    card: {
      width: '100%',
      maxWidth: '28rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'center',
      margin: '0 0 0.5rem 0'
    },
    description: {
      fontSize: '0.875rem',
      color: '#6b7280',
      textAlign: 'center',
      margin: 0
    },
    cardContent: {
      padding: '1.5rem'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    },
    button: {
      backgroundColor: '#f59e0b',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    input: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid #d1d5db',
      fontSize: '0.875rem'
    },
    fileUploadContainer: {
      position: 'relative'
    },
    fileInput: {
      display: 'none'
    },
    outputContainer: {
      padding: '1rem',
      marginTop: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.375rem',
      overflowX: 'auto'
    },
    pre: {
      margin: 0,
      fontSize: '0.875rem',
      textAlign: 'left',
      color: '#1f2937'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h1 style={styles.title}>Resume Scanner</h1>
          <p style={styles.description}>Upload your resume for AI analysis</p>
        </div>
        <div style={styles.cardContent}>
          <div style={styles.buttonContainer}>
            <button
              onClick={handlePayWithBTC}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
              disabled={loading}
            >
              Pay with Bitcoin
            </button>
          </div>

          <form onSubmit={handleUploadResume} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="invoice-id" style={styles.label}>Invoice ID</label>
              <input
                id="invoice-id"
                type="text"
                placeholder="Enter Invoice ID after payment"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="job-title" style={styles.label}>Job Title</label>
              <input
                id="job-title"
                type="text"
                placeholder="Enter the job title you want"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="resume-file" style={styles.label}>Resume File</label>
              <input
                id="resume-file"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                required
                style={styles.input}
              />
              {fileName && <p>{fileName}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
            >
              {loading ? "Processing..." : "Upload Resume"}
            </button>
          </form>

          {output && (
            <div style={styles.outputContainer}>
              <pre style={styles.pre}>{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
