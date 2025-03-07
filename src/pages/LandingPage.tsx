import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, GraduationCap, Github, Linkedin, Instagram, AtSign, ExternalLink, Calendar, Code, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';
import { db, doc, getDoc, collection, getDocs } from '../firebase';
import { About, Portfolio, Blog } from '../types';
import 'devicon/devicon.min.css';

// Data Dummy
const dummyAbout: About = {
  shortName: "John Doe",
  fullName: "John Doe",
  job: "Software Engineer",
  workplace: "Tech Company",
  profileImage: "https://i.pravatar.cc/500",
  socialMedia: {
    email: "john.doe@example.com",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    instagram: "https://instagram.com/johndoe",
  },
  description: "I am a passionate software engineer with experience in building web applications.",
  experiences: [],
  educations: [],
  techStack: [],
  interests: [],
};

const formatDateIndonesian = (dateString: string, format: 'long' | 'short' | 'full' = 'long') => {
  if (dateString === 'Present') return 'Sekarang';
  
  const date = new Date(dateString);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  if (format === 'short') {
    return `${month} ${year}`;
  } else if (format === 'full') {
    return `${day} ${month} ${year}`;
  } else {
    return `${month} ${year}`;
  }
};

const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>?/gm, '');
};

// Fungsi untuk mengambil data dari localStorage
const getCachedAboutData = () => {
  const cachedData = localStorage.getItem('aboutData');
  const cachedTime = localStorage.getItem('aboutData_timestamp');
  const now = new Date().getTime();

  // Jika data ada dan belum kadaluarsa (1 hari), kembalikan data
  if (cachedData && cachedTime && now - parseInt(cachedTime) < 24 * 60 * 60 * 1000) {
    return JSON.parse(cachedData);
  }
  return null;
};

// Fungsi untuk menyimpan data ke localStorage
const setCachedAboutData = (data: About) => {
  localStorage.setItem('aboutData', JSON.stringify(data));
  localStorage.setItem('aboutData_timestamp', new Date().getTime().toString());
};

const LandingPage: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Cek apakah data about ada di localStorage
      const cachedAboutData = getCachedAboutData();
      if (cachedAboutData) {
        setAbout(cachedAboutData);
      } else {
        // Jika tidak ada di cache, fetch dari Firebase
        const aboutDocRef = doc(db, 'about', 'about');
        const aboutDoc = await getDoc(aboutDocRef);
        if (aboutDoc.exists()) {
          const aboutData = aboutDoc.data() as About;
          setAbout(aboutData);
          setCachedAboutData(aboutData); // Simpan ke localStorage
        } else {
          // Jika data tidak ditemukan di Firebase, gunakan data dummy
          setAbout(dummyAbout);
          setCachedAboutData(dummyAbout); // Simpan data dummy ke localStorage
        }
      }

      // Ambil data Portfolio
      const portfolioCollectionRef = collection(db, 'portfolio');
      const portfolioSnapshot = await getDocs(portfolioCollectionRef);
      const portfolioData = portfolioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Portfolio[];
      setPortfolio(portfolioData);

      // Ambil data Blog
      const blogCollectionRef = collection(db, 'blogPosts');
      const blogSnapshot = await getDocs(blogCollectionRef);
      const blogData = blogSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];
      setBlogPosts(blogData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger" role="alert">
          Error: Data tidak ditemukan.
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Home"
        description={`Personal website of ${about.fullName}, ${about.job} at ${about.workplace}`}
      />
      
      <section className="py-5 bg-gradient">
        <Container>
          <Row className="align-items-center justify-content-between">
            <Col md={4} className="mb-4 mb-md-0">
              <div className="mb-4 text-center">
                {about.profileImage ? (
                  <img 
                    src={about.profileImage} 
                    alt={about.fullName} 
                    className="img-fluid rounded-circle shadow-lg border border-4 border-white mx-auto"
                    style={{ 
                      objectFit: 'cover', 
                      height: '200px', 
                      width: '200px',
                      transition: 'transform 0.3s ease',
                      filter: 'brightness(1.05)'
                    }} 
                  />
                ) : (
                  <div 
                    className="img-fluid rounded-circle shadow-lg border border-4 border-white bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
                    style={{ height: '200px', width: '200px' }}
                  >
                    No Image
                  </div>
                )}
              </div>

              <div className="social-media">
                <div className="d-flex justify-content-center gap-3">
                  {about.socialMedia.email && (
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${about.socialMedia.email}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-primary rounded-circle p-1 hover-social"
                    >
                      <AtSign size={24} />
                    </a>
                  )}
                  {about.socialMedia.github && (
                    <a 
                      href={about.socialMedia.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-primary rounded-circle p-1 hover-social"
                    >
                      <Github size={24} />
                    </a>
                  )}
                  {about.socialMedia.linkedin && (
                    <a 
                      href={about.socialMedia.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-primary rounded-circle p-1 hover-social"
                    >
                      <Linkedin size={24} />
                    </a>
                  )}
                  {about.socialMedia.instagram && (
                    <a 
                      href={about.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-outline-primary rounded-circle p-1 hover-social"
                    >
                      <Instagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            </Col>
            <Col md={8}>
              <div className="bg-body p-4 rounded-3 shadow-sm">
                <h1 className="display-5 fw-bold bg-text mb-2">{about.fullName}</h1>
                <h2 className="h4 text-primary mb-3">{about.job} at {about.workplace}</h2>
                <p className="lead mb-4">{about.description}</p>
                <div className="d-flex gap-3 justify-content-end">
                  <Button as={Link} to="/portfolio" variant="primary" className="rounded-pill px-4">
                    <span className="d-flex align-items-center" style={{lineHeight:'1.3rem'}}>
                      View Portfolio <ArrowRight size={18} className="ms-2" />
                    </span>
                  </Button>
                  <Button as={Link} to="/blog" variant="outline-primary" className="rounded-pill px-4">
                    <span className="d-flex align-items-center" style={{lineHeight:'1.3rem'}}>
                      Read Blog <ArrowRight size={18} className="ms-2" />
                    </span>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-5">
        <Container>
          <Row>
            <Col lg={12}>
              <Card className="bg-body bg-text border-0 shadow-md hover-card">
                <Card.Body className="p-4">
                  <div className='sec-tectstack mb-3'>
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary p-2 rounded-circle text-white me-3">
                        <Code size={24} />
                      </div>
                      <h3 className="h3 m-0 bg-text">Tech Stack</h3>
                    </div>
                    <Row className="text-center g-2">
                      {about.techStack.map((tech, index) => (
                        <Col key={index} xs={6} sm={2} md={2} className="mb-1">
                          <div className="tech-card p-3 rounded-3" style={{ backgroundColor: `${tech.color}15` }}>
                            {tech.icon.includes('fa') ? (
                              <i className={tech.icon} style={{ fontSize: '2.5rem', color: tech.color }}></i>
                            ) : (
                              <i className={`${tech.icon} colored`} style={{ fontSize: '2.5rem' }}></i>
                            )}
                            <p className="mt-2 mb-0 fw-semibold" style={{ color: tech.color }}>{tech.name}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <div className='sec-interests'>
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary p-2 rounded-circle text-white me-3">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="h3 m-0 bg-text">Interests</h3>
                    </div>
                    <Row className="g-3">
                      {about.interests.map((interest, index) => (
                        <Col key={index} xs={12} sm={6} md={3} className="mb-1">
                          <div 
                            className="interest-card p-3 rounded-3 h-100 d-flex align-items-center flex-wrap" 
                            style={{ 
                              backgroundColor: `${interest.color}15`, 
                              borderLeft: `4px solid ${interest.color}`,
                              gap: '10px',
                            }}
                          >
                            <i className={interest.icon} style={{ fontSize: '1.5rem', color: interest.color }}></i>
                            <span className="fw-medium" style={{ flex: 1, wordWrap: 'break-word' }}>
                              {interest.name}
                            </span>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary p-2 rounded-circle text-white me-3">
                    <Briefcase size={24} />
                </div>
                <h3 className="h3 m-0 bg-text">Work Experience</h3>
                </div>
                {about.experiences
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((exp) => (
                  <Card key={exp.id} className="mb-4 border-0 shadow-md hover-card">
                      <Card.Body className="p-4">
                      <div className="d-flex justify-content-between">
                          <h4 className="h5 text-dark fw-bold">{exp.position}</h4>
                      </div>
                      <h5 className="h6 text-primary">{exp.company}</h5>
                      <p className="small text-muted mb-3 d-flex align-items-center">
                          <Calendar size={16} className="me-2" />
                          {formatDateIndonesian(exp.startDate)} - { exp.endDate && !isNaN(new Date(exp.endDate).getTime()) ? formatDateIndonesian(exp.endDate) : 'Sekarang' }
                      </p>
                      <div className="mb-0" dangerouslySetInnerHTML={{ __html: exp.description }} />
                      </Card.Body>
                  </Card>
                ))}
            </Col>
            <Col lg={6}>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-success p-2 rounded-circle text-white me-3">
                    <GraduationCap size={24} />
                </div>
                <h3 className="h3 m-0 bg-text">Education</h3>
              </div>
              {about.educations
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((edu) => (
                <Card key={edu.id} className="mb-4 border-0 shadow-md hover-card">
                    <Card.Body className="p-4">
                    <h4 className="h5 fw-bold text-dark">{edu.degree}</h4>
                    <h5 className="h6 text-success">{edu.institution}</h5>
                    <p className="small text-muted mb-0 d-flex align-items-center">
                        <Calendar size={16} className="me-2" />
                        {formatDateIndonesian(edu.startDate)} - { edu.endDate && !isNaN(new Date(edu.endDate).getTime()) ? formatDateIndonesian(edu.endDate) : 'Sekarang'}
                    </p>
                    </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        </Container>
      </section>
      
      <section className="py-5 bg-body">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
                <div className="bg-info p-2 rounded-circle text-white me-3">
                <Github size={24} />
                </div>
                <h2 className="h3 m-0 bg-text">Recent Projects</h2>
            </div>
            <Link to="/portfolio" className="btn btn-outline-info d-flex align-items-center">
                View All <ArrowRight size={16} className="ms-2" />
            </Link>
          </div>
          <Row>
            {portfolio.length > 0 ? portfolio.slice(0, 3).map((project) => (
              <Col key={project.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 border-0 shadow-md hover-card">
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
                            transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
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
                    <Card.Title className="fw-bold">{project.title}</Card.Title>
                    <Card.Text className="text-muted small d-flex align-items-center">
                        <Calendar size={14} className="me-1" />
                        {formatDateIndonesian(project.startDate, 'short')} - {project.endDate && !isNaN(new Date(project.endDate).getTime()) ? formatDateIndonesian(project.endDate, 'short') : 'Sekarang'}
                    </Card.Text>
                    <Card.Text className="mb-3" style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>{stripHtml(project.description)}</Card.Text>
                    <div className="d-flex justify-content-end">
                        <Button as={Link} to={`/portfolio/${project.slug}`} variant="outline-info" size="sm" className="rounded-pill px-3">
                        <span className="d-flex align-items-center">
                            View Project <ExternalLink size={14} className="ms-1" />
                        </span>
                        </Button>
                    </div>
                    </Card.Body>
                </Card>
              </Col>
            )) : <p className="text-center text-muted text-body">No projects available.</p>}
          </Row>
        </Container>
      </section>
      
      <section className="py-5 bg-body">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <div className="bg-warning p-2 rounded-circle text-white me-3">
                <ArrowRight size={24} />
              </div>
              <h2 className="h3 m-0 bg-text">Latest Articles</h2>
            </div>
            <Link to="/blog" className="btn btn-outline-warning d-flex align-items-center">
              View All <ArrowRight size={16} className="ms-2" />
            </Link>
          </div>
          <Row>
            {blogPosts.length > 0 ? blogPosts.slice(0, 3).map((post) => (
              <Col key={post.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 border-0 shadow-md hover-card">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    {post.image ? (
                      <Card.Img 
                        variant="top" 
                        src={post.image} 
                        alt={post.title}
                        style={{ 
                          objectFit: 'cover', 
                          height: '100%', 
                          width: '100%',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div 
                        style={{ 
                          height: '100%', 
                          width: '100%', 
                          background: 'linear-gradient(45deg, #f0f0f0, #fafafa)', 
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
                    <Card.Title className="fw-bold">{post.title}</Card.Title>
                    <Card.Text className="text-muted small d-flex align-items-center mb-2">
                      <Calendar size={14} className="me-1" />
                      {formatDateIndonesian(post.date, 'full')}
                    </Card.Text>
                    <div className="mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} bg="warning" text="dark" className="me-1 mb-1 py-2 px-3 rounded-pill">{tag}</Badge>
                      ))}
                    </div>
                    <Card.Text className="mb-3" style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                      {stripHtml(post.content)}
                    </Card.Text>
                    <div className="d-flex justify-content-end">
                      <Button as={Link} to={`/blog/${post.slug}`} variant="outline-warning" size="sm" className="rounded-pill px-3">
                        <span className="d-flex align-items-center">
                          Read More <ExternalLink size={14} className="ms-1" />
                        </span>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )) : <p className="text-center text-muted text-body">No articles available.</p>}
          </Row>
        </Container>
      </section>

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
        
        .tech-card {
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 90%;
          margin: 0 auto;
        }
        
        .tech-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .interest-card {
          transition: all 0.3s ease;
        }
        
        .interest-card:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
};

export default LandingPage;