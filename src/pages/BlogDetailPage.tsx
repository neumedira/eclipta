import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Card, Spinner } from 'react-bootstrap';
import { ArrowLeft, Calendar, Info } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, query, where, getDocs } from '../firebase';
import ImageModal from '../components/ImageModal';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  date: string;
  tags: string[];
  slug: string;
}

// Helper function to format dates in Indonesian
const formatDateIndonesian = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        const q = query(collection(db, 'blogPosts'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setPost({ id: doc.id, ...doc.data() } as BlogPost);
        } else {
          setPost(null);
        }
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <>
      <SEO 
        title={`${post.title} - Blog`}
        description={post.excerpt || post.content.substring(0, 160)}
        image={post.image}
        type="article"
      />
      
      <Container className="py-5">
        <Link to="/blog" className="d-inline-flex align-items-center text-decoration-none mb-4 btn btn-light">
          <ArrowLeft size={16} className="me-2" /> Back to Blog
        </Link>
        
        <Card className="border-0 shadow-sm overflow-hidden mb-5">
          <Row className="g-0">
            <Col lg={12} className="position-relative">
              {post.image ? (
                <div 
                  className="bg-image"
                  style={{ 
                    backgroundImage: `url(${post.image})`,
                    height: '500px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={openModal}
                >
                  <div className="position-absolute bottom-0 start-0 w-100 bg-dark bg-opacity-50 p-3 text-white">
                    <h1 className="display-6 fw-bold mb-0">{post.title}</h1>
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
          </Row>
        </Card>
        
        <Row className="gy-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm p-4 bg-body bg-text">
              <div className="d-flex align-items-center mb-4">
                <Calendar size={20} className="text-primary me-2" />
                <span className="text-muted bg-text">{formatDateIndonesian(post.date)}</span>
                
                <div className="ms-auto">
                  {post.tags.map((tag, index) => (
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
              
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="border-0 shadow-sm p-4 bg-light sticky-lg-top bg-text" style={{ top: '100px', zIndex: '1' }}>
              <h4 className="mb-3">Blog Information</h4>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <strong>Title:</strong> {post.title}
                </li>
                <li className="mb-3">
                  <strong>Date:</strong> {formatDateIndonesian(post.date)}
                </li>
                <li>
                  <strong>Tags:</strong>
                  <div className="mt-2">
                    {post.tags.map((tag, index) => (
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
        imageUrl={post.image}
        altText={post.title}
      />
    </>
  );
};

export default BlogDetailPage;