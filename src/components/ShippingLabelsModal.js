import React, { useEffect, useState } from 'react';
import { X, Printer, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiBase } from '../utils/api';
import { toast } from 'react-toastify';

const ShippingLabelsModal = ({ isOpen, onClose }) => {
  const API_BASE = getApiBase();
  
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Settings
  const [statusFilter, setStatusFilter] = useState('All'); // 'Confirmed', 'Processing', 'All'
  const [includeCancelled, setIncludeCancelled] = useState(false);
  const [dateRange, setDateRange] = useState('all'); // 'all', 'today', 'week', 'month', 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const readJsonSafe = async (response) => {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      const preview = text?.slice(0, 200) || '';
      throw new Error(`Invalid server response. ${preview}`);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      // For custom range, only fetch if both dates are selected or if switching away from custom
      if (dateRange !== 'custom' || (customStartDate && customEndDate)) {
        fetchLabels();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, statusFilter, includeCancelled, dateRange, customStartDate, customEndDate]);
  
  const fetchLabels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') {
        params.set('status', statusFilter);
      }
      if (!includeCancelled) {
        params.set('excludeCancelled', 'true');
      }
      params.set('dateRange', dateRange);
      if (dateRange === 'custom' && customStartDate && customEndDate) {
        params.set('startDate', customStartDate);
        params.set('endDate', customEndDate);
      }
      
      const url = `${API_BASE}/backend/api/admin/get_shipping_labels_preview.php?${params.toString()}`;
      
      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to load shipping labels preview');
      }

      const data = await readJsonSafe(res);
      
      if (data.status === 'success') {
        setLabels(data.labels || []);
        setCurrentPage(0);
      } else {
        throw new Error(data.message || 'Failed to load labels');
      }
    } catch (e) {
      toast.error(e.message || 'Failed to load shipping labels');
      setLabels([]);
    } finally {
      setLoading(false);
    }
  };
  
  const generatePDF = async () => {
    setGenerating(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') {
        params.set('status', statusFilter);
      }
      if (!includeCancelled) {
        params.set('excludeCancelled', 'true');
      }
      params.set('dateRange', dateRange);
      if (dateRange === 'custom' && customStartDate && customEndDate) {
        params.set('startDate', customStartDate);
        params.set('endDate', customEndDate);
      }
      
      const res = await fetch(`${API_BASE}/backend/api/admin/export_shipping_labels.php?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!res.ok) {
        const text = await res.text();
        let msg = 'Failed to generate PDF';
        try {
          const data = JSON.parse(text);
          msg = data?.message || msg;
        } catch {}
        throw new Error(msg);
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipping_labels_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Shipping labels PDF downloaded successfully');
      onClose();
    } catch (e) {
      toast.error(e?.message || 'Failed to generate PDF');
    } finally {
      setGenerating(false);
    }
  };
  
  const nextPage = () => {
    if (currentPage < labels.length - 1) {
      setCurrentPage(p => p + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-xl" style={{ maxWidth: '90vw', margin: '2vh auto', height: '96vh' }}>
        <div className="modal-content" style={{ height: '100%' }}>
          {/* Header */}
          <div className="modal-header d-flex justify-content-between align-items-center">
            <h5 className="modal-title">
              <Printer size={20} className="me-2" />
              Shipping Labels
              <span className="ms-2 badge bg-secondary">
                {labels.length} total
              </span>
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          
          {/* Body */}
          <div className="modal-body p-0" style={{ overflow: 'hidden' }}>
            <div className="d-flex h-100">
              {/* Left Panel - Preview (70%) */}
              <div className="flex-grow-1" style={{ width: '70%', backgroundColor: '#f5f5f5', overflow: 'auto' }}>
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <div className="spinner-border text-primary mb-3" />
                      <p className="text-muted">Loading labels...</p>
                    </div>
                  </div>
                ) : labels.length === 0 ? (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <FileText size={48} className="text-muted mb-3" />
                      <p className="text-muted">No shipping labels found for selected criteria</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    {/* Label Preview */}
                    <div className="d-flex justify-content-center">
                      <div 
                        className="bg-white shadow-sm position-relative"
                        style={{ 
                          width: '400px', 
                          minHeight: '500px',
                          border: '2px solid #333',
                          padding: '20px'
                        }}
                      >
                        {/* Label Header */}
                        <div 
                          className="text-center text-white py-3 mb-3"
                          style={{ backgroundColor: '#4CAF50', margin: '-20px -20px 15px -20px' }}
                        >
                          <h4 className="mb-0 fw-bold">MakeMyVeggies</h4>
                          <small>SHIPPING LABEL</small>
                        </div>
                        
                        {/* Recipient Info */}
                        <div className="mb-4">
                          <small className="text-muted text-uppercase">Ship To:</small>
                          <h5 className="fw-bold mb-2">{labels[currentPage]?.customerName}</h5>
                          <p className="mb-1" style={{ fontSize: '14px' }}>
                            {labels[currentPage]?.address}
                          </p>
                          <p className="mb-1" style={{ fontSize: '14px' }}>
                            {labels[currentPage]?.cityState}
                          </p>
                          <p className="mb-1" style={{ fontSize: '14px' }}>
                            {labels[currentPage]?.country}
                          </p>
                          <p className="mt-2" style={{ fontSize: '13px' }}>
                            <strong>Phone:</strong> {labels[currentPage]?.phone}
                          </p>
                        </div>
                        
                        {/* Order Info */}
                        <div 
                          className="pt-3 mt-auto"
                          style={{ borderTop: '1px solid #ccc', fontSize: '12px' }}
                        >
                          <div className="d-flex justify-content-between mb-1">
                            <span>Order #{labels[currentPage]?.orderNumber}</span>
                            <span>{labels[currentPage]?.itemCount} items</span>
                          </div>
                          <div className="d-flex justify-content-between text-muted">
                            <span>
                              {labels[currentPage]?.placedAt
                                ? new Date(labels[currentPage]?.placedAt).toLocaleDateString()
                                : '—'}
                            </span>
                            <span>₹{parseFloat(labels[currentPage]?.amount || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Navigation */}
                    {labels.length > 1 && (
                      <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={prevPage}
                          disabled={currentPage === 0}
                        >
                          <ChevronLeft size={16} />
                          Previous
                        </button>
                        <span className="text-muted">
                          Page {currentPage + 1} of {labels.length}
                        </span>
                        <button 
                          className="btn btn-outline-secondary btn-sm"
                          onClick={nextPage}
                          disabled={currentPage === labels.length - 1}
                        >
                          Next
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Panel - Settings (30%) */}
              <div className="border-start" style={{ width: '30%', minWidth: '280px', overflowY: 'auto' }}>
                <div className="p-4">
                  <h6 className="fw-bold mb-4">Export Settings</h6>
                  
                  {/* Status Filter */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">Order Status</label>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statusFilter"
                        id="statusConfirmed"
                        checked={statusFilter === 'Confirmed'}
                        onChange={() => setStatusFilter('Confirmed')}
                      />
                      <label className="form-check-label" htmlFor="statusConfirmed">
                        Confirmed Orders Only
                      </label>
                    </div>
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statusFilter"
                        id="statusProcessing"
                        checked={statusFilter === 'Processing'}
                        onChange={() => setStatusFilter('Processing')}
                      />
                      <label className="form-check-label" htmlFor="statusProcessing">
                        Processing Orders
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statusFilter"
                        id="statusAll"
                        checked={statusFilter === 'All'}
                        onChange={() => setStatusFilter('All')}
                      />
                      <label className="form-check-label" htmlFor="statusAll">
                        All Orders (except Cancelled)
                      </label>
                    </div>
                  </div>
                  
                  {/* Include Cancelled */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="includeCancelled"
                        checked={includeCancelled}
                        onChange={(e) => setIncludeCancelled(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="includeCancelled">
                        Include Cancelled Orders
                      </label>
                    </div>
                  </div>
                  
                  {/* Date Range */}
                  <div className="mb-4">
                    <label className="form-label fw-medium">Date Range</label>
                    <select 
                      className="form-select form-select-sm"
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="custom">Custom Range</option>
                    </select>
                    {dateRange === 'custom' && (
                      <div className="mt-3">
                        <div className="mb-2">
                          <label className="form-label small text-muted">From</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="form-label small text-muted">To</label>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Summary */}
                  <div className="alert alert-info mb-4">
                    <small>
                      <strong>Total Labels:</strong> {labels.length}
                      <br />
                      <strong>Status:</strong> {statusFilter === 'All' ? 'All (except Cancelled)' : statusFilter}
                    </small>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-success"
                      onClick={generatePDF}
                      disabled={generating || labels.length === 0}
                    >
                      {generating ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download size={16} className="me-2" />
                          Download PDF
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={onClose}
                      disabled={generating}
                    >
                      <X size={16} className="me-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabelsModal;
