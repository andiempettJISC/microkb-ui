import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import 'bulma/css/bulma.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCopy, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import PackageUpload from './PackageUpload';

const PackageDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const packageData = location.state?.pkg || {};
  const [fullPackageDetails, setFullPackageDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTitlesExpanded, setIsTitlesExpanded] = useState(false);
  const [isUploadExpanded, setIsUploadExpanded] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [copyNotification, setCopyNotification] = useState({ show: false, text: '' });
  const [titleSearchTerm, setTitleSearchTerm] = useState('');

  // Fetch full package details
  const fetchPackageDetails = useCallback(async () => {
    if (!packageData.packageContentAsJson) return;

    try {
      setLoading(true);
      const response = await fetch(`/package/${packageData.identifier}`); //fetch(`/jisc-exp-tpd-public-api-v1-dev/api/v1/publicExport/pkg/${packageData.identifier}?format=json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch package details: ${response.status}`);
      }
      const data = await response.json();
      setFullPackageDetails(data.Packages[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [packageData.packageContentAsJson, packageData.identifier]);

  useEffect(() => {
    fetchPackageDetails();
  }, [fetchPackageDetails]);

  const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  const copyToClipboard = async (text, event) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(text);
      setCopyNotification({ show: true, text: 'Copied to clipboard!' });
      setTimeout(() => setCopyNotification({ show: false, text: '' }), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setCopyNotification({ show: true, text: 'Failed to copy!' });
      setTimeout(() => setCopyNotification({ show: false, text: '' }), 2000);
    }
  };

  const handleTitleSearch = (event) => {
    setTitleSearchTerm(event.target.value.toLowerCase());
  };

  const handleDeletePackage = async () => {
    try {
      const response = await fetch(`/package/${packageData.identifier}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete package: ${response.status}`);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTitles = fullPackageDetails?.TitleList.filter(title =>
    title.publication_title.toLowerCase().includes(titleSearchTerm)
  );

  if (loading) return (
    <div>
      <progress className="progress is-primary is-small" max="100">
        Loading package details...
      </progress>
    </div>
  );

  if (error) {
    return <div className="notification is-danger">Error: {error}</div>;
  }

  if (!fullPackageDetails) {
    return <div className="notification is-warning">No package details available.</div>;
  }

  return (
    <div className="container">
      {/* Back Button */}
      <button
        className="button is-primary-25 has-text-white-bis has-background-primary-25"
        onClick={() => navigate(-1)}
      >
        <span className="icon">
          <FontAwesomeIcon icon={faArrowLeft} />
        </span>
        <span>Back to Packages</span>
      </button>

      {/* Package Details Panel */}
      <div className="box mt-4">
        <h2 className="title is-3">{fullPackageDetails.name || "Untitled"}</h2>
        <p><strong>Package ID:</strong> {fullPackageDetails.identifier}</p>
        {/* <p><strong>Term Start Date:</strong> {formatDate(fullPackageDetails.PackageTermStartDate)}</p> */}
        {/* <p><strong>Term End Date:</strong> {formatDate(fullPackageDetails.PackageTermEndDate)}</p> */}
        {/* <ul>
          {fullPackageDetails.RelatedOrgs.map((org, index) => (
            <li key={index}>
              <strong>{org.OrgRole}</strong>: {org.OrgName}
            </li>
          ))}
        </ul> */}
        {/* Download Buttons */}
        <div className="buttons mt-4">
          <a
            className="button is-primary-25 has-text-white-bis has-background-primary-25"
            href={packageData.packageContentAsJson}
            download
          >
            Download JSON
          </a>
          <a
            className="button is-primary-25 has-text-white-bis has-background-primary-25"
            href={packageData.packageContentAsKbart}
            download
          >
            Download KBART
          </a>
        </div>
      </div>

      {/* Modify Package Panel */}
      <div className="box">
        <div className="is-flex is-justify-content-space-between" onClick={() => setIsUploadExpanded(!isUploadExpanded)}>
          <h2 className="title is-5">Modify package</h2>
          <icon className="icon is-large">
            <FontAwesomeIcon icon={isUploadExpanded ? faChevronUp : faChevronDown} />
          </icon>
        </div>
        {isUploadExpanded && (
          <>
            <PackageUpload packageId={fullPackageDetails.identifier} packageName={fullPackageDetails.name} onUploadSuccess={fetchPackageDetails} />
            <button
              className="button is-danger mt-4"
              onClick={() => setIsModalActive(true)}
            >
              Delete Package
            </button>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <div className={`modal ${isModalActive ? 'is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Confirm Deletion</p>
            <button className="delete" aria-label="close" onClick={() => setIsModalActive(false)}></button>
          </header>
          <section className="modal-card-body">
            <p>Are you sure you want to delete this package?</p>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger" onClick={handleDeletePackage}>Delete</button>
            <button className="button" onClick={() => setIsModalActive(false)}>Cancel</button>
          </footer>
        </div>
      </div>

      {/* Collapsible Package Titles Panel */}
      <div className="box">
        <div className="is-flex is-justify-content-space-between" onClick={() => setIsTitlesExpanded(!isTitlesExpanded)}>
          <h2 className="title is-5">Package Titles</h2>
          <icon className="icon is-large">
            <FontAwesomeIcon icon={isTitlesExpanded ? faChevronUp : faChevronDown} />
          </icon>
        </div>
        {isTitlesExpanded && (
          <>
            <div className="field mt-4">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Search titles..."
                  value={titleSearchTerm}
                  onChange={handleTitleSearch}
                />
              </div>
            </div>
            <ul>
              {filteredTitles.map((title, index) => (
                <li key={index} className="py-4">
                  <strong>{title.publication_title}</strong>
                  <ul className="mt-2">
                    <p><strong>Type:</strong> {title.publication_type || "Unknown"}</p>
                    <p><strong>eISSN:</strong> {title.online_identifier || "N/A"}</p>
                    <li>
                      <strong>ISSN:</strong> {title.print_identifier || "N/A"}
                      {title.print_identifier && title.print_identifier !== "N/A" && (
                        <div className="buttons are-small mt-2">
                          <button
                            className="button is-info is-light"
                            onClick={(e) => copyToClipboard(`https://api.openalex.org/sources/issn:${title.print_identifier}`, e)}
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faCopy} />
                            </span>
                            <span>OpenAlex API</span>
                          </button>
                          <button
                            className="button is-info is-light"
                            onClick={(e) => copyToClipboard(`https://explore.openalex.org/sources/issn:${title.print_identifier}`, e)}
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faCopy} />
                            </span>
                            <span>OpenAlex Web</span>
                          </button>
                          <button
                            className="button is-warning is-light"
                            onClick={(e) => copyToClipboard(`https://api.crossref.org/journals/${title.print_identifier}`, e)}
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faCopy} />
                            </span>
                            <span>Crossref API: Journal</span>
                          </button>
                          <button
                            className="button is-warning is-light"
                            onClick={(e) => copyToClipboard(`https://api.crossref.org/journals/${title.print_identifier}/works`, e)}
                          >
                            <span className="icon">
                              <FontAwesomeIcon icon={faCopy} />
                            </span>
                            <span>Crossref API: Works</span>
                          </button>
                        </div>
                      )}
                    </li>
                  </ul>
                  {index < fullPackageDetails.TitleList.length - 1 && (
                    <hr className="has-background-grey-lighter" />
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Copy Notification */}
      {copyNotification.show && (
        <div 
          className="notification is-success is-light"
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            margin: '0',
            padding: '1rem',
            zIndex: 1000,
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            maxWidth: '300px'
          }}
        >
          {copyNotification.text}
        </div>
      )}
    </div>
  );
};

export default PackageDetails;