import React from 'react';
import { Helmet } from 'react-helmet-async';
import useAboutData from '../hooks/useAboutData';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  url = window.location.href,
  type = 'website'
}) => {
  const { about } = useAboutData();
  const siteName = about?.fullName
  const defaultImage = about?.profileImage
  const seoImage = image || defaultImage;
  const fullTitle = `${title} - ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Eclipta Web Personal, Software Engineer, Web Developer, React Developer, TypeScript Expert, Firebase Integration, Cloudinary Setup, Programming Blog, Tech Enthusiast, Coding Tutorials, Web Development Tips, Frontend Development, Backend Development, API Integration, Responsive Web Design, Tech Career Advice, Latest Technology Trends" />
      <meta name="author" content={siteName} />
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={seoImage} />
      
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;