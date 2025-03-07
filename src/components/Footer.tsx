import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient text-white py-5 mt-5">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-0 fw-bold bg-text">Powered by AI and a passion for innovation</p>
            <p className="small mt-2 bg-text"><span className='me-2'>This project is open source!</span> 
              <a href="https://github.com/neumedira/eclipta" className="bg-text fw-bold">
                  <i className="fab fa-github"></i> Contribute on GitHub
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;