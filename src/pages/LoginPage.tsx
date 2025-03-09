import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { login, isAuthenticated, isLockedOut, getLockoutTimeRemaining } from '../utils/authService';
import { showErrorAlert } from '../utils/sweetAlert';

const LoginPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [showAccessCode, setShowAccessCode] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin');
    }
    
    if (isLockedOut()) {
      setLockoutTime(getLockoutTimeRemaining());
      const interval = setInterval(() => {
        const remaining = getLockoutTimeRemaining();
        setLockoutTime(remaining);
        
        if (remaining <= 0) {
          clearInterval(interval);
        }
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLockedOut()) {
      showErrorAlert(`Too many failed attempts. Please try again in ${lockoutTime} minutes.`);
      return;
    }
    
    const success = login(accessCode);
    
    if (success) {
      navigate('/admin');
    } else {
      if (isLockedOut()) {
        setLockoutTime(getLockoutTimeRemaining());
        showErrorAlert(`Too many failed attempts. Please try again in ${lockoutTime} minutes.`);
      } else {
        showErrorAlert('Invalid access code. Please try again.');
      }
    }
  };
  
  return (
    <div className="login-page d-flex align-items-center pt-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="card-header bg-primary text-white text-center py-3">
                <h3 className="mb-0">Admin Access</h3>
              </div>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="bg-light p-3 rounded-circle d-inline-flex mb-3">
                    <Lock size={24} className="text-primary" />
                  </div>
                  <p className="text-muted">Enter your confidential access code</p>
                </div>
                
                {isLockedOut() ? (
                  <Alert variant="warning">
                    Account is temporarily locked due to too many failed attempts. 
                    Please try again in {lockoutTime} minutes.
                  </Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="accessCode">
                      <Form.Label>Access Code</Form.Label>
                      <div className="input-group">
                        <Form.Control
                          type={showAccessCode ? "text" : "password"}
                          value={accessCode}
                          onChange={(e) => setAccessCode(e.target.value)}
                          placeholder="Enter access code"
                          required
                          className="form-control"
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => setShowAccessCode(!showAccessCode)}
                          className="btn-show-hide"
                        >
                          {showAccessCode ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                    </Form.Group>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100 py-2 mt-3 shadow-sm"
                    >
                      Login
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;