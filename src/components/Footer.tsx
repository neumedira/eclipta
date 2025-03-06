import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import useAboutData from '../hooks/useAboutData';

const Footer: React.FC = () => {
  const { about, loading, error } = useAboutData(); // Destructure the hook's return value
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Error: {error}</p>
      </div>
    );
  }

  return (
    <footer className="bg-gradient text-white py-5 mt-5">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0 fw-bold bg-text">© {currentYear} {about?.shortName}. All rights reserved.</p>
            <p className="small mt-2 bg-text">Made with <span className="text-danger">❤</span> using React and Bootstrap</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;