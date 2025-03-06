import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { User, Briefcase, FileText, ChevronRight } from 'lucide-react';
import { db, collection, getDocs } from '../../firebase';

const AdminDashboard: React.FC = () => {
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [blogPostsCount, setBlogPostsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const portfolioSnapshot = await getDocs(collection(db, 'portfolio'));
      const blogSnapshot = await getDocs(collection(db, 'blogPosts'));

      setPortfolioCount(portfolioSnapshot.size);
      setBlogPostsCount(blogSnapshot.size);
    };

    fetchData();
  }, []);

  const DashboardCard = ({ 
    icon: Icon, 
    title, 
    description, 
    linkTo, 
    count 
  }: { 
    icon: React.ElementType, 
    title: string, 
    description: string, 
    linkTo: string, 
    count?: number 
  }) => (
    <Col md={4} className="mb-4">
      <Card className="bg-body h-100 border-0 shadow-lg transform-hover transition-all rounded-4">
        <Card.Body className="d-flex flex-column p-4">
          <div className="text-center mb-3">
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-flex mb-3">
              <Icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="bg-text mb-2">{title}</h3>
          </div>
          <p className="bg-text text-muted text-center mb-3">
            {description} {count !== undefined && (
              <>Currently you have <span className="badge bg-primary text-white">{count}</span> {title.toLowerCase()}s.</>
            )}
          </p>
          <div className="bg-text mt-auto">
            <Button 
              as={Link} 
              to={linkTo} 
              variant="outline-primary" 
              className="w-100 d-flex align-items-center justify-content-center"
            >
              Manage {title} <ChevronRight size={20} className="ms-2" />
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );

  return (
    <div className="bg-gradient min-vh-100">
      <Container className="py-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-3 bg-text">Admin Dashboard</h1>
          <p className="lead bg-text">
            Manage your website content with ease and efficiency
          </p>
        </div>
        
        <Row>
          <DashboardCard 
            icon={User}
            title="About"
            description="Manage your personal information, experience, and education."
            linkTo="/admin/about"
          />
          
          <DashboardCard 
            icon={Briefcase}
            title="Portfolio"
            description="Manage your portfolio projects."
            linkTo="/admin/portfolio"
            count={portfolioCount}
          />
          
          <DashboardCard 
            icon={FileText}
            title="Blog"
            description="Manage your blog posts."
            linkTo="/admin/blog"
            count={blogPostsCount}
          />
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;