import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import 'bulma/css/bulma.min.css';

const PackageUpload = ({ packageId: initialPackageId, packageName: initialPackageName, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [packageId, setPackageId] = useState(initialPackageId || '');
  const [packageName, setPackageName] = useState(initialPackageName || '');
  const [responseMessage, setResponseMessage] = useState('');
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialPackageId) {
      setPackageId(initialPackageId);
    }
    if (initialPackageName) {
      setPackageName(initialPackageName);
    }
  }, [initialPackageId, initialPackageName]);

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
        setErrors(data.errors || []);
        setResponseMessage('');
        setWarnings(data.warnings || []);
      } else {
        setResponseMessage(data.message);
        setWarnings(data.warnings || []);
        setErrorMessage('');
        setErrors([]);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (error) {
      setErrorMessage('Failed to upload package');
      setResponseMessage('');
      setWarnings([]);
      setErrors([]);
      console.error('Error:', error);
    }
  };

  return (
    <div className="container">
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
          <label className="label">{initialPackageId ? "Package ID" : "Package ID (Optional)"}</label>
          <div className="control">
            <input
              className="input"
              type="text"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              disabled={!!initialPackageId}
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
            <button className="button is-primary-25 has-text-white-bis has-background-primary-25" type="submit">
              <span>Upload</span>
              <span className="icon is-small">
                <FontAwesomeIcon icon={faUpload} />
              </span>
            </button>
          </div>
        </div>
      </form>
      {responseMessage && (
        <div className={`notification ${warnings.length ? 'is-warning' : 'is-success'} mt-4`}>
          {responseMessage}
        </div>
      )}
      {errorMessage && (
        <div className="notification is-danger mt-4">
          {errorMessage}
        </div>
      )}
      {warnings.length > 0 && (
        <div className="notification is-warning mt-4">
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>
                <strong>Row {warning.row}:</strong> {warning.warning} (Data: {warning.data})
              </li>
            ))}
          </ul>
        </div>
      )}
      {errors.length > 0 && (
        <div className="notification is-danger mt-4">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>
                <strong>Row {error.row}:</strong> {error.error} (Data: {error.data})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PackageUpload;