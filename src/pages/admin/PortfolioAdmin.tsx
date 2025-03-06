import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash, ExternalLink, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Portfolio } from '../../types';
import { db, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from '../../firebase';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../../utils/sweetAlert';
import EditorComponent from '../../components/EditorComponent';
import ImageModal from '../../components/ImageModal';
import ImageUploader from '../../components/ImageUploader';
import { uploadMultipleImages } from '../../utils/cloudinaryService';
import { generateSlug } from '../../utils/slugify';

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const PortfolioAdmin: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<Portfolio | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [video, setVideo] = useState('');
  const [tags, setTags] = useState('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = async () => {
    try {
      const urls = await uploadMultipleImages(selectedFiles);
      setUploadedImages(prev => [...prev, ...urls]);
      setSelectedFiles([]); // Clear selected files after upload
      showSuccessAlert('Images uploaded successfully!');
    } catch (error) {
      showErrorAlert('Failed to upload images.');
    }
  };

  const convertToEmbedUrl = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      const projects: Portfolio[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({ 
          id: doc.id, 
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : []
        } as Portfolio);
      });
      setPortfolio(projects);
    };
    fetchPortfolio();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  const resetForm = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setImage('');
    setDescription('');
    setVideo('');
    setTags('');
    setUploadedImages([]);
    setSelectedFiles([]);
    setCurrentItem(null);
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

  const handleEdit = (item: Portfolio) => {
    setCurrentItem(item);
    setTitle(item.title);
    setStartDate(item.startDate.substring(0, 10));
    setEndDate(item.endDate.substring(0, 10));
    setImage(item.image);
    setDescription(item.description);
    setVideo(item.video || '');
    setTags(item.tags?.join(', ') || '');
    setUploadedImages(item.images || []);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    showConfirmAlert('Are you sure you want to delete this Data?', async () => {
      try {
        await deleteDoc(doc(db, 'portfolio', id));
        setPortfolio(portfolio.filter(item => item.id !== id));
        showSuccessAlert('Data deleted successfully!');
      } catch (error) {
        showErrorAlert('Failed to delete Data.');
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    const embedVideoUrl = video ? convertToEmbedUrl(video) : '';
    const slug = generateSlug(title);

    const projectData = {
      title,
      startDate,
      endDate,
      image,
      description,
      video: embedVideoUrl,
      tags: tagsArray,
      images: uploadedImages,
      slug
    };

    try {
      if (isEditing && currentItem) {
        await updateDoc(doc(db, 'portfolio', currentItem.id), projectData);
        showSuccessAlert('Project updated successfully!');
      } else {
        await addDoc(collection(db, 'portfolio'), projectData);
        showSuccessAlert('Project added successfully!');
      }

      const querySnapshot = await getDocs(collection(db, 'portfolio'));
      const projects: Portfolio[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({ 
          id: doc.id, 
          ...data,
          tags: Array.isArray(data.tags) ? data.tags : []
        } as Portfolio);
      });
      setPortfolio(projects);

      handleCloseModal();
    } catch (error) {
      showErrorAlert('Failed to save project.');
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
        <div className="d-flex justify-content-between align-items-center mb-4 shadow-sm p-3 bg-body rounded">
          <div className="d-flex align-items-center">
            <Link to="/admin" className="btn btn-outline-primary me-2">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="mb-0 bg-text">Manage Portfolio</h1>
          </div>
          <Button variant="primary" onClick={handleShowModal}>
            Add Portfolio
          </Button>
        </div>
        
        {portfolio.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <p className="mb-3 bg-text text-muted">There are no portfolio yet.</p>
            <Button variant="primary" onClick={handleShowModal}>
              Add First Portfolio
            </Button>
          </div>
        ) : (
          <Table responsive className="align-middle">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>#</th>
                <th style={{ width: '80px' }}>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Tags</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="rounded shadow-sm"
                        style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => openModal(item.image)}
                      />
                    ) : (
                      <div 
                        className="rounded shadow-sm bg-secondary" 
                        style={{ width: '60px', height: '60px' }}
                      ></div>
                    )}
                  </td>
                  <td>{item.title}</td>
                  <td>
                    {formatDate(item.startDate)} - {item.endDate && !isNaN(new Date(item.endDate).getTime()) ? formatDate(item.endDate) : 'Sekarang'}
                  </td>
                  <td>
                    {item.tags?.map((tag, i) => (
                      <span key={i} className="badge bg-primary me-1">
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
                        to={`/portfolio/${item.slug}`}
                        target="_blank"
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(item.id)}
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
        
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title className='text-black'>{isEditing ? 'Edit Project' : 'Add New Project'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-black'>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Project Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Project Thumbnail</Form.Label>
                <ImageUploader 
                  onImageUploaded={handleImageUploaded}
                  currentImage={image}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <EditorComponent 
                  content={description}
                  onContentChange={setDescription}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="video">
                <Form.Label>URL Video (opsional)</Form.Label>
                <Form.Control
                  type="url"
                  value={video}
                  onChange={(e) => setVideo(e.target.value)}
                  placeholder="contoh: https://youtube.com/watch?v=xyz"
                />
                <Form.Text className="text-muted">
                  Masukkan URL YouTube biasa, akan otomatis diubah ke format embed.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="tags">
                <Form.Label>Tags (separate with commas)</Form.Label>
                <Form.Control
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="ex: React, Node.js, MongoDB"
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="images">
                <Form.Label>Upload Multiple Images</Form.Label>
                <div {...getRootProps()} className="border p-3 text-center" style={{cursor:'pointer'}}>
                  <input {...getInputProps()} />
                  <p>Drag & drop some files here, or click to select files</p>
                </div>
                <div className="mt-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="d-inline-block position-relative me-2 mb-2">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Selected ${index}`} 
                        className="img-thumbnail" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="position-absolute top-0 end-0"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="d-inline-block position-relative me-2 mb-2">
                      <img 
                        src={img} 
                        alt={`Uploaded ${index}`} 
                        className="img-thumbnail" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="position-absolute top-0 end-0"
                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="primary" 
                  onClick={handleUploadImages}
                  disabled={selectedFiles.length === 0}
                >
                  Upload Images
                </Button>
              </Form.Group>
              
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {isEditing ? 'Update Project' : 'Add Project'}
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

export default PortfolioAdmin;