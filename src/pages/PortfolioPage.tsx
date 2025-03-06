import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Calendar, Tags, Filter, X } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, getDocs } from '../firebase';
import ImageModal from '../components/ImageModal';

// Helper function untuk format tanggal ke Bahasa Indonesia
const formatDateIndonesian = (dateString: string) => {
  if (dateString === 'Present') return 'Sekarang';
  
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${month} ${year}`;
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, ''); // Menghapus semua tag HTML
};

const PortfolioPage: React.FC = () => {
  const [allPortfolio, setAllPortfolio] = useState<any[]>([]);
  const [filteredPortfolio, setFilteredPortfolio] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'portfolio'));
        const portfolioData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPortfolio(portfolioData);
        setFilteredPortfolio(portfolioData);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Get all unique tags
  const allTags = Array.from(
    new Set(allPortfolio.flatMap(project => project.tags))
  ).sort();

  // Filter portfolio based on search term and selected tag
  useEffect(() => {
    const filtered = allPortfolio.filter(project => {
      const matchesSearch =
        searchTerm === '' ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTag = selectedTag === null || project.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });

    setFilteredPortfolio(filtered);
  }, [searchTerm, selectedTag, allPortfolio]);

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
        title="Portfolio"
        description="Explore my portfolio of projects and work as a Software Engineer."
      />
      
      {/* Header Section with Gradient Background */}
      <div className="py-5 bg-gradient">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold bg-text mb-3">Portfolio</h1>
              <p className="lead mb-4">
                Here are some of the projects I've worked on. Each project showcases different skills and technologies.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      
      <Container className="py-5">
        {/* Search and Filter Section */}
        <Card className="mb-4 border-0 shadow-sm bg-body">
          <Card.Body className="p-4">
            <Row>
              <Col md={8} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search projects..."
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
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <Filter size={18} />
                  </InputGroup.Text>
                  <Form.Select
                    value={selectedTag || ''}
                    onChange={(e) => setSelectedTag(e.target.value || null)}
                    className="border-start-0 py-2"
                  >
                    <option value="">All Tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Filter Summary */}
        {(searchTerm || selectedTag) && (
          <div className="d-flex align-items-center mb-4">
            <span className="text-muted me-2 bg-text">Filters:</span>
            {searchTerm && (
              <Badge bg="primary" className="me-2 py-2 px-3 rounded-pill">
                <span className="d-flex align-items-center">
                  Search: {searchTerm}
                  <Button 
                    variant="link" 
                    className="p-0 ms-2 text-white" 
                    onClick={() => setSearchTerm('')}
                    style={{ textDecoration: 'none' }}
                  >
                    <X size={14} />
                  </Button>
                </span>
              </Badge>
            )}
            {selectedTag && (
              <Badge bg="info" className="me-2 py-2 px-3 rounded-pill">
                <span className="d-flex align-items-center">
                  Tag: {selectedTag}
                  <Button 
                    variant="link" 
                    className="p-0 ms-2 text-white" 
                    onClick={() => setSelectedTag(null)}
                    style={{ textDecoration: 'none' }}
                  >
                    <X size={14} />
                  </Button>
                </span>
              </Badge>
            )}
            <Button 
              variant="link" 
              className="ms-auto p-0 text-decoration-none" 
              onClick={() => {
                setSearchTerm('');
                setSelectedTag(null);
              }}
            >
              Clear All
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading projects...</p>
          </div>
        ) : (
          <Row>
            {filteredPortfolio.map((project) => (
              <Col key={project.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm hover-card">
                  <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    {project.image ? (
                      <Card.Img
                        variant="top"
                        src={project.image}
                        alt={project.title}
                        style={{ 
                          objectFit: 'cover', 
                          height: '100%', 
                          width: '100%',
                          transition: 'transform 0.3s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => openModal(project.image)}
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
                    <Card.Title className="fw-bold mb-2">{project.title}</Card.Title>
                    <Card.Text className="text-muted small d-flex align-items-center mb-2">
                      <Calendar size={14} className="me-1" />
                      {formatDateIndonesian(project.startDate)} - {project.endDate && !isNaN(new Date(project.endDate).getTime()) ? formatDateIndonesian(project.endDate) : 'Sekarang'}
                    </Card.Text>
                    
                    {project.tags && project.tags.length > 0 && (
                      <div className="mb-3 d-flex align-items-center flex-wrap">
                        <Tags size={18} className="me-1 text-muted" />
                        {project.tags.map((tag: string, index: number) => (
                          <Badge 
                            key={index} 
                            bg="info" 
                            text="dark" 
                            className="me-2 mb-1 p-2 rounded-pill"
                            style={{ fontSize: '0.80rem' }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <Card.Text style={{
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      display: '-webkit-box', 
                      WebkitLineClamp: 3, 
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '1rem'
                    }}>
                      {project.excerpt || stripHtml(project.description).substring(0, 100) + '...'}
                    </Card.Text>
                    <div className="d-flex justify-content-end">
                      <Button 
                        as={Link} 
                        to={`/portfolio/${project.id}`} 
                        variant="primary" 
                        size="sm"
                        className="rounded-pill px-3"
                      >
                        <span className="d-flex align-items-center">
                          View Details <ExternalLink size={14} className="ms-1" />
                        </span>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}

            {filteredPortfolio.length === 0 && !loading && (
              <Col className="text-center py-5">
                <div className="bg-light p-5 rounded-3">
                  <h3 className="mb-3 bg-text">No projects found</h3>
                  <p className="mb-4">Try adjusting your search or filter criteria.</p>
                  <Button
                    variant="primary"
                    className="rounded-pill px-4"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedTag(null);
                    }}
                  >
                    <span className="d-flex align-items-center">
                      Clear Filters <X size={18} className="ms-2" />
                    </span>
                  </Button>
                </div>
              </Col>
            )}
          </Row>
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

export default PortfolioPage;