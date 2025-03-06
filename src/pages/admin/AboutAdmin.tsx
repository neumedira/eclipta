import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Table, Modal } from 'react-bootstrap';
import { ArrowLeft, Trash, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { About, Experience, Education } from '../../types';
import ImageUploader from '../../components/ImageUploader';
import { db, collection, addDoc, updateDoc, getDocs, doc } from '../../firebase';
import { showSuccessAlert, showErrorAlert, showConfirmAlert } from '../../utils/sweetAlert';
import EditorComponent from '../../components/EditorComponent';

const CACHE_KEY = 'aboutData';

const AboutAdmin: React.FC = () => {
  const [about, setAbout] = useState<About>({
    shortName: '',
    fullName: '',
    job: '',
    workplace: '',
    profileImage: '',
    socialMedia: {
      email: '',
      instagram: '',
      linkedin: '',
      github: '',
    },
    description: '',
    experiences: [],
    educations: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAbout = async () => {
      const querySnapshot = await getDocs(collection(db, 'about'));
      if (!querySnapshot.empty) {
        const aboutData = querySnapshot.docs[0].data() as About;
        setAbout(aboutData);
      }
    };
    fetchAbout();
  }, []);

  const clearAboutCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}_timestamp`);
  };

  const resetModal = () => {
    setCurrentExperience(null);
    setCurrentEducation(null);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('socialMedia.')) {
      const socialKey = name.split('.')[1];
      setAbout({
        ...about,
        socialMedia: {
          ...about.socialMedia,
          [socialKey]: value,
        },
      });
    } else {
      setAbout({
        ...about,
        [name]: value,
      });
    }
  };

  const handleProfileImageUploaded = (imageUrl: string) => {
    setAbout({
      ...about,
      profileImage: imageUrl,
    });
  };

  const handleExperienceChange = (field: keyof Experience, value: string) => {
    if (currentExperience) {
      setCurrentExperience({
        ...currentExperience,
        [field]: value,
      });
    }
  };

  const handleEducationChange = (field: keyof Education, value: string) => {
    if (currentEducation) {
      setCurrentEducation({
        ...currentEducation,
        [field]: value,
      });
    }
  };

  const addExperience = () => {
    setCurrentExperience({
      id: `exp${Date.now()}`,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setCurrentEducation(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const editExperience = (experience: Experience) => {
    setCurrentExperience(experience);
    setCurrentEducation(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const saveExperience = () => {
    if (currentExperience) {
      const updatedExperiences = isEditing
        ? about.experiences.map(exp => exp.id === currentExperience.id ? currentExperience : exp)
        : [...about.experiences, currentExperience];

      setAbout({
        ...about,
        experiences: updatedExperiences,
      });
      setShowModal(false);
      resetModal();
    }
  };

  const removeExperience = async (id: string) => {
    showConfirmAlert('Are you sure you want to delete this data?', async () => {
      try {
        const updatedExperiences = about.experiences.filter(exp => exp.id !== id);
        setAbout({
          ...about,
          experiences: updatedExperiences,
        });

        const aboutCollection = collection(db, 'about');
        const querySnapshot = await getDocs(aboutCollection);
        if (!querySnapshot.empty) {
          const aboutDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, 'about', aboutDoc.id), { experiences: updatedExperiences });
        }
        showSuccessAlert('Data deleted successfully!');
      } catch (error) {
        showErrorAlert('Failed to delete data:' + error);
      }
    });
  };

  const addEducation = () => {
    setCurrentEducation({
      id: `edu${Date.now()}`,
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
    });
    setCurrentExperience(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const editEducation = (education: Education) => {
    setCurrentEducation(education);
    setCurrentExperience(null);
    setIsEditing(true);
    setShowModal(true);
  };

  const saveEducation = () => {
    if (currentEducation) {
      const updatedEducations = isEditing
        ? about.educations.map(edu => edu.id === currentEducation.id ? currentEducation : edu)
        : [...about.educations, currentEducation];

      setAbout({
        ...about,
        educations: updatedEducations,
      });
      setShowModal(false);
      resetModal();
    }
  };

  const removeEducation = async (id: string) => {
    showConfirmAlert('Are you sure you want to delete this data?', async () => {
      try {
        const updatedEducations = about.educations.filter(edu => edu.id !== id);
        setAbout({
          ...about,
          educations: updatedEducations,
        });
        
        const aboutCollection = collection(db, 'about');
        const querySnapshot = await getDocs(aboutCollection);
        if (!querySnapshot.empty) {
          const aboutDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, 'about', aboutDoc.id), { educations: updatedEducations });
        }
        showSuccessAlert('Data deleted successfully!');
      } catch (error) {
        showErrorAlert('Failed to delete data:' + error);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const aboutCollection = collection(db, 'about');
      const querySnapshot = await getDocs(aboutCollection);

      if (!querySnapshot.empty) {
        const aboutDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'about', aboutDoc.id), about);
      } else {
        await addDoc(aboutCollection, about);
      }

      clearAboutCache();
      showSuccessAlert('About data updated successfully!');
    } catch (error) {
      showErrorAlert('Error updating about data: ' + error);
    }
  };

  return (
    <>
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <Link to="/admin" className="btn btn-outline-primary me-2">
              <ArrowLeft size={16} />
            </Link>
            <h1 className="h4 mb-0 bg-text">Edit About</h1>
          </div>
          <Button type="submit" form="aboutForm" variant="primary">
            Save Changes
          </Button>
        </div>
        
        <Form id="aboutForm" onSubmit={handleSubmit}>
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 mb-3 text-dark">Personal Information</h3>

              <Form.Group className="mb-3" controlId="profileImage">
                <Form.Label>Profile Photo</Form.Label>
                <ImageUploader 
                  onImageUploaded={handleProfileImageUploaded}
                  currentImage={about.profileImage}
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="shortName">
                    <Form.Label>Short Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="shortName"
                      value={about.shortName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={about.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="job">
                    <Form.Label>Job Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="job"
                      value={about.job}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="workplace">
                    <Form.Label>Workplace</Form.Label>
                    <Form.Control
                      type="text"
                      name="workplace"
                      value={about.workplace}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={about.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Card.Body>
          </Card>
          
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <h3 className="h5 mb-3 text-dark">Social Media</h3>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="instagram">
                    <Form.Label>Instagram URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="socialMedia.instagram"
                      value={about.socialMedia.instagram || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="linkedin">
                    <Form.Label>LinkedIn URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="socialMedia.linkedin"
                      value={about.socialMedia.linkedin || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="github">
                    <Form.Label>GitHub URL</Form.Label>
                    <Form.Control
                      type="url"
                      name="socialMedia.github"
                      value={about.socialMedia.github || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="socialMedia.email"
                      value={about.socialMedia.email || ''}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0 text-dark">Work Experience</h3>
                <Button variant="primary" onClick={addExperience}>
                  Add Experience
                </Button>
              </div>
              
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {about.experiences.length > 0 ? (
                      about.experiences.map((experience) => (
                        <tr key={experience.id}>
                          <td>{experience.company}</td>
                          <td>{experience.position}</td>
                          <td>{experience.startDate}</td>
                          <td>{experience.endDate}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => editExperience(experience)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => removeExperience(experience.id)} className="ms-2">
                              <Trash size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No work experience added yet. Click the "Add Experience" button to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mb-4 border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h5 mb-0 text-dark">Education</h3>
                <Button variant="primary" onClick={addEducation}>
                  Add Education
                </Button>
              </div>
              
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Institution</th>
                      <th>Degree</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {about.educations.length > 0 ? (
                      about.educations.map((education) => (
                        <tr key={education.id}>
                          <td>{education.institution}</td>
                          <td>{education.degree}</td>
                          <td>{education.startDate}</td>
                          <td>{education.endDate}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => editEducation(education)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => removeEducation(education.id)} className="ms-2">
                              <Trash size={16} />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center text-muted">
                          No education added yet. Click the "Add Education" button to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" as={Link} to="/admin" className="me-2">
              Cancel
              </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </Form>
      </Container>

      <Modal size='lg' show={showModal} onHide={() => { setShowModal(false); resetModal(); }}>
        <Modal.Header closeButton>
          <Modal.Title className='text-black'>{isEditing ? 'Edit' : 'Add'} {currentExperience ? 'Experience' : 'Education'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-black'>
          {currentExperience && (
            <Form>
              <Form.Group className="mb-3" controlId="company">
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  value={currentExperience.company}
                  onChange={(e) => handleExperienceChange('company', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="position">
                <Form.Label>Position</Form.Label>
                <Form.Control
                  type="text"
                  value={currentExperience.position}
                  onChange={(e) => handleExperienceChange('position', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentExperience.startDate}
                  onChange={(e) => handleExperienceChange('startDate', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentExperience.endDate}
                  onChange={(e) => handleExperienceChange('endDate', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="description">
                <Form.Label>Description</Form.Label>
                <EditorComponent 
                  content={currentExperience.description}
                  onContentChange={(value) => handleExperienceChange('description', value)}
                />
              </Form.Group>
            </Form>
          )}
          {currentEducation && (
            <Form>
              <Form.Group className="mb-3" controlId="institution">
                <Form.Label>Institution</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEducation.institution}
                  onChange={(e) => handleEducationChange('institution', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="degree">
                <Form.Label>Degree</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEducation.degree}
                  onChange={(e) => handleEducationChange('degree', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentEducation.startDate}
                  onChange={(e) => handleEducationChange('startDate', e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={currentEducation.endDate}
                  onChange={(e) => handleEducationChange('endDate', e.target.value)}
                  required
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowModal(false); resetModal(); }}>
            Close
          </Button>
          <Button variant="primary" onClick={currentExperience ? saveExperience : saveEducation}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AboutAdmin;