import React from 'react';
import Modal from 'react-modal';

interface ImageModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  imageUrl: string;
  altText: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onRequestClose, imageUrl, altText }) => {
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
          zIndex: 9999 // Tambahkan z-index di sini
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9998 // Optional: Atur z-index untuk overlay jika diperlukan
        }
      }}
    >
      <img src={imageUrl} alt={altText} style={{ maxWidth: '100%', maxHeight: '90vh' }} />
    </Modal>
  );
};

export default ImageModal;