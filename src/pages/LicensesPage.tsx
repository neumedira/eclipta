import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Search, X } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, getDocs } from '../firebase';
import ImageModal from '../components/ImageModal';
import ReactPaginate from 'react-paginate';
import { Licenses } from '../types';

const formatDateIndonesian = (dateString: string) => {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

const LicensesPage: React.FC = () => {
  const [allLicenses, setAllLicenses] = useState<Licenses[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'licenses'));
        const licensesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Licenses[];
        // Sort licenses by issueDate (newest first)
        licensesData.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
        setAllLicenses(licensesData);
      } catch (error) {
        console.error('Error fetching licenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const filteredLicenses = allLicenses.filter(license => {
    return (
      searchTerm === '' ||
      license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.issuingOrganization.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const pageCount = Math.ceil(filteredLicenses.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentLicenses = filteredLicenses.slice(offset, offset + itemsPerPage);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <SEO
        title="Licenses & Certifications"
        description="Explore my professional licenses and certifications."
      />

      <div className="py-5 bg-gradient">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">Licenses & Certifications</h1>
              <p className="lead mb-4">
                A collection of my professional licenses and certifications.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Card className="mb-4 border-0 shadow-sm bg-body">
          <Card.Body className="p-4">
            <Row>
              <Col md={12} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search licenses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0 py-2"
                  />
                  {searchTerm && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSearchTerm('')}
                      className="border-start-0"
                    >
                      <X size={18} />
                    </Button>
                  )}
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading licenses...</p>
          </div>
        ) : (
          <>
            <Row>
              {currentLicenses.map((license) => (
                <Col key={license.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      {license.image ? (
                        <Card.Img
                          variant="top"
                          src={license.image}
                          alt={license.name}
                          style={{ 
                            objectFit: 'cover', 
                            height: '100%', 
                            width: '100%',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onClick={() => openModal(license.image)}
                        />
                      ) : (
                        <div 
                          style={{ 
                            height: '100%', 
                            width: '100%', 
                            background: 'linear-gradient(45deg, #e0e0e0, #f5f5f5)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#666', 
                            fontSize: '1rem' 
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </div>
                    <Card.Body className="p-4">
                      <Card.Title className="fw-bold mb-2">{license.name}</Card.Title>
                      <Card.Text className="text-muted small">
                        Issued by: {license.issuingOrganization}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        Issued on: {formatDateIndonesian(license.issueDate)}
                      </Card.Text>
                      {license.expirationDate && (
                        <Card.Text className="text-muted small">
                          Expires on: {formatDateIndonesian(license.expirationDate)}
                        </Card.Text>
                      )}
                      {license.credentialUrl !== '#' && (
                        <div className="d-flex justify-content-end">
                            <Button 
                            as="a"
                            href={license.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary" 
                            size="sm"
                            className="rounded-pill px-3"
                            >
                            View Credential
                            </Button>
                        </div>
                        )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}

              {filteredLicenses.length === 0 && !loading && (
                <Col className="text-center py-5">
                  <div className="bg-light p-5 rounded-3">
                    <h3 className="mb-3">No licenses found</h3>
                    <p className="mb-4">Try adjusting your search criteria.</p>
                    <Button
                      variant="primary"
                      className="rounded-pill px-4"
                      onClick={() => setSearchTerm('')}
                    >
                      <span className="d-flex align-items-center">
                        Clear Search <X size={18} className="ms-2" />
                      </span>
                    </Button>
                  </div>
                </Col>
              )}
            </Row>

            <ReactPaginate
              previousLabel={'Previous'}
              nextLabel={'Next'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination justify-content-center'}
              activeClassName={'active'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
            />
          </>
        )}
      </Container>

      <ImageModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        imageUrl={selectedImage || ''}
        altText="Selected Image"
      />

      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .hover-card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </>
  );
};

export default LicensesPage;