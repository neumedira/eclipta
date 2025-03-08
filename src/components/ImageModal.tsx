import React from 'react';
import Modal from 'react-modal';

interface ImageModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageUrl: string;
  altText: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  showNavigation?: boolean; // Prop baru untuk menentukan apakah tombol navigasi ditampilkan
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onRequestClose, 
  imageUrl, 
  altText, 
  onNext, 
  onPrevious, 
  hasNext, 
  hasPrevious,
  showNavigation = false // Default false, hanya ditampilkan jika true
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Image Modal"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '0',
          border: 'none',
          background: 'none',
          zIndex: 9999
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9998
        }
      }}
    >
      <div style={{ position: 'relative' }}>
        <img src={imageUrl} alt={altText} style={{ maxWidth: '100%', maxHeight: '90vh' }} />
        {showNavigation && hasPrevious && (
          <button 
            onClick={onPrevious}
            style={{
              fontSize: '20px',
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              cursor: 'pointer',
              borderRadius: '50%'
            }}
          >
            &lt;
          </button>
        )}
        {showNavigation && hasNext && (
          <button 
            onClick={onNext}
            style={{
              fontSize: '20px',
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.3)',
              border: 'none',
              color: 'white',
              padding: '4px 12px',
              cursor: 'pointer',
              borderRadius: '50%'
            }}
          >
            &gt;
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;