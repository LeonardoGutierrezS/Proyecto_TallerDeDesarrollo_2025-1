import { useState, useMemo } from 'react';
import '@styles/custom-table.css';

const CustomTable = ({ 
  data = [], 
  columns = [], 
  title = "", 
  subtitle = "",
  showSearch = true,
  showPagination = true,
  pageSize = 10,
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filtrar datos por término de búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      return columns.some(column => {
        const value = column.render 
          ? column.render(item)
          : item[column.key];
        
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginación
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="custom-table-container">
        <div className="custom-table-loading">
          <div className="custom-loading-spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-table-container">
      {/* Header */}
      {(title || subtitle) && (
        <div className="custom-table-header">
          {title && <h2 className="custom-table-title">{title}</h2>}
          {subtitle && <p className="custom-table-subtitle">{subtitle}</p>}
        </div>
      )}

      {/* Controls */}
      <div className="custom-table-controls">
        {showSearch && (
          <div className="custom-search-container">
            <input
              type="text"
              placeholder="Buscar en la tabla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="custom-search-input"
            />
            <span className="custom-search-icon">🔍</span>
          </div>
        )}

        <div className="custom-table-info">
          {filteredData.length} de {data.length} registros
        </div>
      </div>

      {/* Table */}
      <div className="custom-table-wrapper">
        <table className="custom-table">
          <thead className="custom-table-head">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`custom-table-th ${column.sortable ? 'sortable' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="custom-th-content">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="custom-sort-icon">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="custom-table-body">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="custom-table-empty">
                  <div className="custom-empty-state">
                    <span className="custom-empty-icon">📋</span>
                    <p>No se encontraron datos</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index} className="custom-table-row">
                  {columns.map((column) => (
                    <td key={column.key} className="custom-table-td">
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="custom-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="custom-pagination-btn"
          >
            ← Anterior
          </button>
          
          <div className="custom-pagination-pages">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`custom-pagination-number ${
                    currentPage === pageNumber ? 'active' : ''
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="custom-pagination-btn"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
