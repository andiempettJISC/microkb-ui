import React, { useState } from 'react';
import 'bulma/css/bulma.min.css';

const PackageUpload = () => {
  const [file, setFile] = useState(null);
  const [packageId, setPackageId] = useState('');
  const [packageName, setPackageName] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('package_id', packageId);
    formData.append('package_name', packageName);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to upload package');
        setResponseMessage('');
        setWarnings([]);
      } else {
        setResponseMessage(data.message);
        setWarnings(data.warnings || []);
        setErrorMessage('');
      }
    } catch (error) {
      setErrorMessage('Failed to upload package');
      setResponseMessage('');
      setWarnings([]);
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-6">
      <h1 className="title is-4">Upload Package</h1>
      <form onSubmit={handleUpload}>
        <div className="field">
        <label className="label">Package File</label>
          <div className="control">
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input className="file-input" type="file" accept=".tsv,.csv" onChange={handleFileChange} required />
                <span className="file-cta">
                  <span className="file-label">
                    Choose a file…
                  </span>
                </span>
                {file && <span className="file-name">{file.name}</span>}
              </label>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Package ID</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Package Name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button className="button is-primary" type="submit">
              Upload
            </button>
          </div>
        </div>
      </form>
      {responseMessage && (
        <div className={`notification ${warnings.length ? 'is-warning' : 'is-success'} mt-4`}>
          {responseMessage}
          {warnings.length > 0 && (
            <ul>
              {warnings.map((warning, index) => (
                <li key={index}>
                  <strong>Row {warning.row}:</strong> {warning.warning} (Data: {warning.data})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {errorMessage && (
        <div className="notification is-danger mt-4">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PackageUpload;