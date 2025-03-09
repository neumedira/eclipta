import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Card, Spinner, Button } from 'react-bootstrap';
import { ArrowLeft, Calendar, Tag, Info, Image as ImageIcon } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, query, where, getDocs } from '../firebase';
import ImageModal from '../components/ImageModal';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  tags: string[];
  video?: string;
  images?: string[];
}

const formatDateIndonesian = (dateString: string): string => {
  if (dateString === 'Present') return 'Sekarang';
  
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const PortfolioDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (slug) {
        const q = query(collection(db, 'portfolio'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setProject({ id: doc.id, ...doc.data() } as PortfolioItem);
        } else {
          setProject(null);
        }
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  const openModal = (index: number | null, imageUrl?: string) => {
    if (imageUrl) {
      setCurrentImageUrl(imageUrl); // Set URL gambar utama
      setCurrentImageIndex(-1); // Tidak ada indeks untuk gambar utama
    } else if (project?.images && index !== null) {
      setCurrentImageUrl(project.images[index]); // Set URL gambar dari galeri
      setCurrentImageIndex(index); // Set indeks untuk navigasi galeri
    }
    setModalIsOpen(true);
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleNext = () => {
    if (project?.images && currentImageIndex < project.images.length - 1) {
      const nextIndex = currentImageIndex + 1;
      setCurrentImageIndex(nextIndex);
      setCurrentImageUrl(project.images[nextIndex]);
    }
  };
  
  const handlePrevious = () => {
    if (project?.images && currentImageIndex > 0) {
      const prevIndex = currentImageIndex - 1;
      setCurrentImageIndex(prevIndex);
      setCurrentImageUrl(project.images[prevIndex]);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const shareUrl = window.location.href;
  const shareTitle = project?.title || 'Check out this project!';

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/portfolio" replace />;
  }

  return (
    <>
      <SEO 
        title={`${project.title} - Portfolio`}
        description={project.description}
        image={project.image}
        type="article"
      />
      
      <Container className="py-5">
        <Link to="/portfolio" className="d-inline-flex align-items-center text-decoration-none mb-4 btn btn-light">
          <ArrowLeft size={16} className="me-2" /> Back to Portfolio
        </Link>
        
        <Card className="border-0 shadow-sm overflow-hidden mb-5">
          <Row className="g-0">
            <Col lg={8} className="position-relative">
              {project.image ? (
                <div 
                  className="bg-image"
                  style={{ 
                    backgroundImage: `url(${project.image})`,
                    height: '500px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => openModal(null, project.image)}
                >
                  <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-3 text-white">
                    <h1 className="display-6 fw-bold mb-0">{project.title}</h1>
                  </div>
                </div>
              ) : (
                <div 
                  className="d-flex justify-content-center align-items-center bg-light" 
                  style={{ height: '500px' }}
                >
                  <Info size={64} className="text-muted" />
                </div>
              )}
            </Col>
            <Col lg={4} className='bg-body bg-text'>
              <Card.Body className="p-4">
                <h2 className="d-lg-none mb-4">{project.title}</h2>
                
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-2">
                    <Calendar size={20} className="text-primary me-2" />
                    <h5 className="mb-0">Timeline</h5>
                  </div>
                  <p className="ms-4 mb-0 fw-medium">
                    {formatDateIndonesian(project.startDate)} - {' '}
                    {project.endDate === 'Present' ? 'Sekarang' : formatDateIndonesian(project.endDate)}
                  </p>
                </div>
                
                {project.tags && (
                  <div className="mb-3 bg-text">
                    <div className="d-flex align-items-center mb-2">
                      <Tag size={20} className="text-primary me-2" />
                      <h5 className="mb-0">Technology Stack</h5>
                    </div>
                    <div className="ms-4">
                      {project.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          bg="primary" 
                          className="me-1 mb-1 py-2 px-3"
                          style={{ fontWeight: 500, borderRadius: '20px' }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Col>
          </Row>
        </Card>
        
        <Row className="gy-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm p-4 bg-body bg-text">
              <h3 className="border-bottom pb-3 mb-3 d-flex align-items-center">
                <Info size={24} className="text-primary me-2" /> 
                <span>Project Description</span>
              </h3>

              <div className="lead" dangerouslySetInnerHTML={{ __html: project.description }} />

              <div className="mt-4 d-flex align-items-center gap-2">
                Share : 
                <Button 
                  variant="success" 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`, '_blank')}
                >
                  <i className="fab fa-whatsapp"></i>
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')}
                >
                  <i className="fab fa-twitter"></i>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&t=${encodeURIComponent(shareTitle)}`;
                    window.open(
                      facebookShareUrl,
                      '',
                      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
                    );
                  }}
                  title="Share on Facebook"
                >
                  <i className="fab fa-facebook"></i>
                </Button>
                <Button 
                  variant={copySuccess ? "success" : "secondary"} 
                  onClick={handleCopyLink}
                >
                  <i className={`fas ${copySuccess ? "fa-check" : "fa-link"} me-2`}></i>
                  {copySuccess ? "Copied!" : "Copy"}
                </Button>
              </div>
            </Card>
            
            {project.video && (
              <Card className="border-0 shadow-sm p-4 mt-4 bg-body">
                <h3 className="border-bottom pb-3 mb-3 bg-text">Project Video</h3>
                <div className="ratio ratio-16x9 mt-3">
                  <iframe 
                    src={project.video} 
                    title={`${project.title} video`}
                    allowFullScreen
                    className="rounded"
                  ></iframe>
                </div>
              </Card>
            )}
            
            {project.images && project.images.length > 0 && (
              <Card className="border-0 shadow-sm p-4 mt-4 bg-body">
                <h3 className="border-bottom pb-3 mb-3 d-flex align-items-center">
                  <ImageIcon size={24} className="text-primary me-2" />
                  <span className='bg-text'>Project Gallery</span>
                </h3>
                
                <Row className="g-3">
                  {project.images.map((img, index) => (
                    <Col key={index} xs={6} md={4} className="gallery-item">
                      <div 
                        className="card h-100 overflow-hidden gallery-card border-0 position-relative"
                        onClick={() => openModal(index)}
                      >
                        <div 
                          className="gallery-img"
                          style={{
                            backgroundImage: `url(${img})`,
                            height: '180px',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
          </Col>
          
          <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 bg-light sticky-lg-top bg-text" style={{ top: '100px', zIndex: '1' }}>
              <h4 className="mb-3">Project Information</h4>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong>Project Name:</strong> {project.title}
                </li>
                <li className="mb-3">
                  <strong>Timeline:</strong> {formatDateIndonesian(project.startDate)} - {' '}
                  {project.endDate === 'Present' ? 'Sekarang' : formatDateIndonesian(project.endDate)}
                </li>
                <li>
                  <strong>Technology Stack:</strong>
                  <div className="mt-2">
                    {project.tags && project.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        bg="primary" 
                        className="me-1 mb-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>

      <ImageModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        imageUrl={currentImageUrl}
        altText={project.title}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={project.images ? currentImageIndex < project.images.length - 1 : false}
        hasPrevious={currentImageIndex > 0}
        showNavigation={true}
      />

      <style>{`
      .lead a {
        color: blue!important;
        font-weight: 400;
      }
      `}</style>
    </>
  );
};

export default PortfolioDetailPage;