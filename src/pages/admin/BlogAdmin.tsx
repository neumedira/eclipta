import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, ExternalLink } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import { Blog } from '../../types';
import { db, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from '../../firebase';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../../utils/sweetAlert';
import EditorComponent from '../../components/EditorComponent';
import ImageModal from '../../components/ImageModal';

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const BlogAdmin: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogPosts'));
        const posts: Blog[] = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() } as Blog);
        });
        setBlogPosts(posts);
      } catch (error) {
        showErrorAlert('Failed to fetch blog posts.');
      }
    };
    fetchBlogPosts();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTags('');
    setImage('');
    setContent('');
    setCurrentPost(null);
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleShowModal = () => {
    setShowModal(true);
    resetForm();
  };

  const handleEdit = (post: Blog) => {
    setCurrentPost(post);
    setTitle(post.title);
    setDate(post.date.substring(0, 10));
    setTags(post.tags.join(', '));
    setImage(post.image);
    setContent(post.content);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    showConfirmAlert('Are you sure you want to delete this blog post?', async () => {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
        setBlogPosts(blogPosts.filter(post => post.id !== id));
        showSuccessAlert('Blog post deleted successfully!');
      } catch (error) {
        showErrorAlert('Failed to delete blog post.');
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    const postData = {
      title,
      date,
      tags: tagsArray,
      image,
      content
    };

    try {
      if (isEditing && currentPost) {
        await updateDoc(doc(db, 'blogPosts', currentPost.id), postData);
        showSuccessAlert('Blog post updated successfully!');
      } else {
        await addDoc(collection(db, 'blogPosts'), postData);
        showSuccessAlert('Blog post added successfully!');
      }

      const querySnapshot = await getDocs(collection(db, 'blogPosts'));
      const posts: Blog[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as Blog);
      });
      setBlogPosts(posts);

      handleCloseModal();
    } catch (error) {
      showErrorAlert('Failed to save blog post.');
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    setImage(imageUrl);
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
      <Container className="py-5">
        <div className="bg-body d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 bg-white rounded">
          <div className="d-flex align-items-center">
            <Link to="/admin" className="btn btn-outline-primary me-2">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="mb-0 bg-text">Manage Blog</h1>
          </div>
          <Button variant="primary" onClick={handleShowModal}>
            Create a Blog
          </Button>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <p className="mb-3 text-muted bg-text">No blog posts available.</p>
            <Button variant="primary" onClick={handleShowModal}>
              Create First Blog
            </Button>
          </div>
        ) : (
          <Table responsive className="align-middle">
            <thead className="bg-light">
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th style={{ width: '80px' }}>Thumbnail</th>
                <th>Title</th>
                <th>Date</th>
                <th>Tags</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map((post, index) => (
                <tr key={post.id}>
                  <td>{index + 1}</td>
                  <td>
                    {post.image ? (
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="rounded shadow-sm"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => openModal(post.image)}
                      />
                    ) : (
                      <div 
                        className="rounded shadow-sm bg-secondary"
                        style={{ width: '60px', height: '60px' }}
                      ></div>
                    )}
                  </td>
                  <td className="fw-bold">{post.title}</td>
                  <td className="text-muted">
                    {formatDate(post.date)}
                  </td>
                  <td>
                    {post.tags.map((tag, i) => (
                      <span key={i} className="badge bg-info text-dark me-1">
                        {tag}
                      </span>
                    ))}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-info" 
                        size="sm"
                        as={Link}
                        to={`/blog/${post.id}`}
                        target="_blank"
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => handleEdit(post)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        
        {/* Add/Edit Modal */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title className='text-black'>{isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-black'>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Blog Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="date">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="tags">
                <Form.Label>Tags (comma-separated)</Form.Label>
                <Form.Control
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., tech, web, react"
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Thumbnail</Form.Label>
                <ImageUploader 
                  onImageUploaded={handleImageUploaded}
                  currentImage={image}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="content">
                <Form.Label>Content</Form.Label>
                <EditorComponent 
                  content={content}
                  onContentChange={setContent}
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {isEditing ? 'Update Blog' : 'Add Blog'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>

      <ImageModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        imageUrl={selectedImage || ''}
        altText="Selected Image"
      />
    </>
  );
};

export default BlogAdmin;