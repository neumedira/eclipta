import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import SEO from '../components/SEO';
import { db, collection, getDocs } from '../firebase';
import ImageModal from '../components/ImageModal';
import ReactPaginate from 'react-paginate';

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

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

const BlogPage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogPosts'));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllPosts(postsData);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = Array.from(
    new Set(allPosts.flatMap(post => post.tags))
  ).sort();

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch =
      searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag === null || post.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pageCount = Math.ceil(sortedPosts.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentPosts = sortedPosts.slice(offset, offset + itemsPerPage);

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
        title="Blog"
        description="Read my latest articles and thoughts on software development, technology, and more."
      />

      <div className="py-5 bg-gradient">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">Blog</h1>
              <p className="lead mb-4">
                Thoughts, ideas, and insights on software development, technology, and more.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Card className="mb-4 border-0 shadow-sm bg-body">
          <Card.Body className="p-4">
            <Row>
              <Col md={8} className="mb-3 mb-md-0">
                <InputGroup>
                  <InputGroup.Text className="bg-white">
                    <Search size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search articles..."
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

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading posts...</p>
          </div>
        ) : (
          <>
            <Row>
              {currentPosts.map((post) => (
                <Col key={post.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      {post.image ? (
                        <Card.Img
                          variant="top"
                          src={post.image}
                          alt={post.title}
                          style={{ 
                            objectFit: 'cover', 
                            height: '100%', 
                            width: '100%',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer'
                          }}
                          onClick={() => openModal(post.image)}
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
                      <Card.Title className="fw-bold mb-2">{post.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        {formatDateIndonesian(post.date)}
                      </Card.Text>
                      <div className="mb-3">
                        {post.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="badge bg-info text-dark me-1 mb-1"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedTag(tag)}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Card.Text style={{
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 3, 
                        WebkitBoxOrient: 'vertical',
                        marginBottom: '1rem'
                      }}>
                        {post.excerpt || stripHtml(post.content).substring(0, 100) + '...'}
                      </Card.Text>
                      <div className="d-flex justify-content-end">
                        <Button 
                          as={Link} 
                          to={`/blog/${post.slug}`} 
                          variant="primary" 
                          size="sm"
                          className="rounded-pill px-3"
                        >
                          Read More
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}

              {filteredPosts.length === 0 && !loading && (
                <Col className="text-center py-5">
                  <div className="bg-light p-5 rounded-3">
                    <h3 className="mb-3">No posts found</h3>
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

export default BlogPage;