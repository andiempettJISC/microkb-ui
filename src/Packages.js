import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import 'bulma/css/bulma.min.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name'); // Default sort by Name
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/packages?all=true`);
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
    setCurrentPage(1); // Reset to first page
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

  const handlePerPageChange = (event) => {
    setPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const totalPages = Math.ceil(filteredPackages.length / perPage);
  const displayedPackages = filteredPackages.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="container mt-6">
      <h1 className="title is-3 has-text-primary-25">Search Packages</h1>

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
        {displayedPackages.map((pkg, index) => (
          <li key={index} className="list-item mt-4">
            <div className="content">
            <div className="box mt-4">
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
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="field is-grouped mt-6 is-grouped-right">
        <div className="control">
          <div className="select">
            <select value={perPage} onChange={handlePerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <div className="control">
          <p className="is-size-6 mt-2">
            Page {currentPage} of {totalPages}
          </p>
        </div>
        <div className="control">
          <button
            className="button is-white is-medium"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
        </div>
        <div className="control">
          <button
            className="button is-white is-medium"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Packages;