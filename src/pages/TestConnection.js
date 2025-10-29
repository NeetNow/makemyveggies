import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TestConnection = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const testConnection = async () => {
    setIsTesting(true);
    setMessage('');

    try {
      const response = await fetch(
        'http://localhost/gard_1/makemyveggies-feature-bhavesh_react/mmv/makemyveggies/test_api.php',
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.message || 'Connection failed'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Connection Test</h3>
            </div>
            <div className="card-body">
              <button
                className="btn btn-primary mb-3"
                onClick={testConnection}
                disabled={isTesting}
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </button>
              {message && (
                <div
                  className={`alert ${message.includes('Success') ? 'alert-success' : 'alert-danger'}`}
                >
                  {message}
                </div>
              )}
              <button className="btn btn-secondary" onClick={() => navigate('/login')}>
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
