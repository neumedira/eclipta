import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';
import { Licenses } from '../../types';
import { db, collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from '../../firebase';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../../utils/sweetAlert';
import ImageModal from '../../components/ImageModal';

const formatDate = (dateString: string): string => {
const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
};
return new Date(dateString).toLocaleDateString('id-ID', options);
};

const LicenseAdmin: React.FC = () => {
  const [licenses, setLicenses] = useState<Licenses[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentLicense, setCurrentLicense] = useState<Licenses | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'licenses'));
        const licenses: Licenses[] = [];
        querySnapshot.forEach((doc) => {
          licenses.push({ id: doc.id, ...doc.data() } as Licenses);
        });
        setLicenses(licenses);
      } catch (error) {
        showErrorAlert('Failed to fetch licenses.');
      }
    };
    fetchLicenses();
  }, []);

  const resetForm = () => {
    setName('');
    setIssuingOrganization('');
    setIssueDate('');
    setExpirationDate('');
    setCredentialUrl('');
    setImage('');
    setCurrentLicense(null);
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

  const handleEdit = (license: Licenses) => {
    setCurrentLicense(license);
    setName(license.name);
    setIssuingOrganization(license.issuingOrganization);
    setIssueDate(license.issueDate.substring(0, 10));
    setExpirationDate(license.expirationDate.substring(0, 10));
    setCredentialUrl(license.credentialUrl);
    setImage(license.image);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    showConfirmAlert('Are you sure you want to delete this license?', async () => {
      try {
        await deleteDoc(doc(db, 'licenses', id));
        setLicenses(licenses.filter(license => license.id !== id));
        showSuccessAlert('License deleted successfully!');
      } catch (error) {
        showErrorAlert('Failed to delete license.');
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const licenseData = {
      name,
      issuingOrganization,
      issueDate,
      expirationDate,
      credentialUrl: credentialUrl.trim() === '' ? '#' : credentialUrl,
      image,
    };

    try {
      if (isEditing && currentLicense) {
        await updateDoc(doc(db, 'licenses', currentLicense.id), licenseData);
        showSuccessAlert('License updated successfully!');
      } else {
        await addDoc(collection(db, 'licenses'), licenseData);
        showSuccessAlert('License added successfully!');
      }

      const querySnapshot = await getDocs(collection(db, 'licenses'));
      const licenses: Licenses[] = [];
      querySnapshot.forEach((doc) => {
        licenses.push({ id: doc.id, ...doc.data() } as Licenses);
      });
      setLicenses(licenses);

      handleCloseModal();
    } catch (error) {
      showErrorAlert('Failed to save license.');
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
            <h1 className="mb-0 bg-text">Manage Licenses</h1>
          </div>
          <Button variant="primary" onClick={handleShowModal}>
            Add License
          </Button>
        </div>

        {licenses.length === 0 ? (
            <div className="text-center py-5 border rounded bg-light">
              <p className="mb-3 text-muted bg-text">No licenses available.</p>
              <Button variant="primary" onClick={handleShowModal}>
                Add First License
              </Button>
            </div>
          ) : (
            <Table responsive className="align-middle">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th style={{ width: '80px' }}>Image</th>
                  <th>Name</th>
                  <th>Issuing Organization</th>
                  <th>Issue Date</th>
                  <th>Expiration Date</th>
                  <th>Credential URL</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license, index) => (
                  <tr key={license.id}>
                    <td>{index + 1}</td>
                    <td>
                      {license.image ? (
                        <img 
                          src={license.image} 
                          alt={license.name} 
                          className="rounded shadow-sm"
                          style={{ width: '60px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                          onClick={() => openModal(license.image)}
                        />
                      ) : (
                        <div 
                          className="rounded shadow-sm bg-secondary"
                          style={{ width: '60px', height: '60px' }}
                        ></div>
                      )}
                    </td>
                    <td className="fw-bold">{license.name}</td>
                    <td>{license.issuingOrganization}</td>
                    <td>{formatDate(license.issueDate)}</td>
                    <td>
                        {license.expirationDate && !isNaN(new Date(license.expirationDate).getTime()) ? formatDate(license.expirationDate) : 'No Expiration'}
                    </td>
                    <td>
                    {license.credentialUrl === '#' ? (
                        <span>-</span>
                    ) : (
                    <a href={license.credentialUrl} className='text-primary' target="_blank" rel="noopener noreferrer">
                        View Credential
                    </a>
                    )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => handleEdit(license)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDelete(license.id)}
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
            <Modal.Title className='text-black'>{isEditing ? 'Edit License' : 'Add New License'}</Modal.Title>
          </Modal.Header>
          <Modal.Body className='text-black'>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="issuingOrganization">
                <Form.Label>Issuing Organization</Form.Label>
                <Form.Control
                  type="text"
                  value={issuingOrganization}
                  onChange={(e) => setIssuingOrganization(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="issueDate">
                <Form.Label>Issue Date</Form.Label>
                <Form.Control
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="expirationDate">
                <Form.Label>Expiration Date</Form.Label>
                <Form.Control
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="credentialUrl">
                <Form.Label>Credential URL</Form.Label>
                <Form.Control
                  type="text"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image</Form.Label>
                <ImageUploader 
                  onImageUploaded={handleImageUploaded}
                  currentImage={image}
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {isEditing ? 'Update License' : 'Add License'}
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

export default LicenseAdmin;