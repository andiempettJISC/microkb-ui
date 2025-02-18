import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bulma/css/bulma.min.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name'); // Default sort by Name
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('packages'); //fetch('/jisc-exp-tpd-public-api-v1-dev/api/v1/publicExport/idx?format=json&max=0');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const packagesData = data.packages || [];
        setPackages(packagesData);
        setFilteredPackages(packagesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = packages.filter(
      (pkg) =>
        (pkg.name && pkg.name.toLowerCase().includes(term)) ||
        (pkg.identifier && pkg.identifier.toLowerCase().includes(term))
    );
    setFilteredPackages(filtered);
  };

  const handleSort = (event) => {
    const option = event.target.value;
    setSortOption(option);

    const sorted = [...filteredPackages].sort((a, b) => {
      if (option === 'id') {
        // Convert identifier to number for proper numeric sorting
        return parseInt(a.identifier, 10) - parseInt(b.identifier, 10);
      } else if (option === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (option === 'lastUpdated') {
        return new Date(b.lastUpdated) - new Date(a.lastUpdated);
      }
      return 0;
    });

    setFilteredPackages(sorted);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return 'Unknown';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div>
      <progress className="progress is-primary is-small" max="100">
        Loading packages...
      </progress>
    </div>
  );
  if (error) return <div className="notification is-danger has-background-danger-85">Error loading packages: {error}</div>;
  if (packages.length === 0) return <div className="notification is-warning has-background-warning-85">No packages available.</div>;

  return (
    <div className="container mt-6">
      <h1 className="title is-3">Packages</h1>

      {/* Combined Search and Sort Bar */}
      <div className="field is-grouped mt-4">
        <div className="control is-expanded has-icons-right">
          <input
            className="input is-primary"
            type="text"
            placeholder="Search packages by name or identifier..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="control">
          <div className="select is-primary">
            <select value={sortOption} onChange={handleSort}>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Packages List */}
      <ul className="list is-hoverable mt-4">
        {filteredPackages.map((pkg, index) => (
          <li key={index} className="list-item mt-4">
            <div className="content">
              <strong>{pkg.name || 'Untitled'}</strong>
              <br />
              <small>
                <strong>Identifier:</strong> {pkg.identifier || 'N/A'}
                <br />
                <strong>Last Updated:</strong> {formatDate(pkg.lastUpdated)}
              </small>
              <br />
              <button
                className="button is-link is-small mt-2 is-primary has-text-white-bis has-background-primary-25"
                onClick={() => navigate(`/detail/${pkg.identifier}`, { state: { pkg } })}
              >
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Packages;