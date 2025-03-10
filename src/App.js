import React, { useState } from "react";
import axios from "axios";

const API_BASE = "https://resume-scanner-backend.azurewebsites.net"; // Deployed FastAPI URL

function App() {
  const [invoiceId, setInvoiceId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [fileName, setFileName] = useState("");

  // ✅ Ensure this function is correctly defined
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
      setOutput(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Error uploading resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Resume Scanner</h1>
      <button onClick={handlePayWithBTC} disabled={loading}>
        {loading ? "Processing..." : "Pay with Bitcoin"}
      </button>

      <form onSubmit={handleUploadResume}>
        <input
          type="text"
          placeholder="Enter Invoice ID after payment"
          value={invoiceId}
          onChange={(e) => setInvoiceId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter the job title you want"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload} // ✅ Function is now properly referenced
          required
        />
        {fileName && <p>{fileName}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload Resume"}
        </button>
      </form>

      {output && <pre>{output}</pre>}
    </div>
  );
}

export default App;
