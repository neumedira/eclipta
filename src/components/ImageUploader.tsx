import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { uploadImage } from '../utils/cloudinaryService';
import { showSuccessAlert, showErrorAlert } from '../utils/sweetAlert';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded, currentImage }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    setPreview(currentImage || null);
  }, [currentImage]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(currentImage || null);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      const imageUrl = await uploadImage(selectedFile);
      onImageUploaded(imageUrl);
      setIsUploading(false);
      setIsUploaded(true);
      showSuccessAlert('Image uploaded successfully!');
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
      showErrorAlert('Failed to upload image. Please try again.');
    }
  };
  
  return (
    <div className="mb-3">
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select Image</Form.Label>
        <Form.Control 
          type="file" 
          onChange={handleFileChange} 
          accept="image/*"
          disabled={isUploading || isUploaded}
        />
      </Form.Group>
      
      {preview && (
        <div className="mb-3">
          <p>Preview:</p>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ maxWidth: '100%', maxHeight: '200px' }} 
            className="border rounded"
          />
        </div>
      )}
      
      {error && <div className="text-danger mb-3">{error}</div>}
      
      <Button 
        variant="primary" 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading || isUploaded}
      >
        {isUploading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            <span className="ms-2">Uploading...</span>
          </>
        ) : 'Upload Image'}
      </Button>
    </div>
  );
};

export default ImageUploader;