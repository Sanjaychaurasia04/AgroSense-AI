// src/pages/Disease/UploadBox.jsx
import React, { useRef } from 'react';
import Icon from '../../components/common/Icon';
import { theme } from '../../styles/theme';

const UploadBox = ({ drag, setDrag, preview, handleFile, fileRef }) => {
  const localFileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => (fileRef || localFileRef).current.click()}
      style={{
        border: `2px dashed ${drag ? theme.sprout : theme.earth}`,
        borderRadius: 16,
        minHeight: 260,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        cursor: "pointer",
        background: drag ? `${theme.leaf}11` : "transparent",
        transition: "all 0.3s",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {preview ? (
        <img src={preview} alt="Leaf" style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 14 }} />
      ) : (
        <>
          <div style={{ padding: 20, borderRadius: "50%", background: `${theme.leaf}22` }}>
            <Icon name="upload" size={32} color={theme.sage} />
          </div>
          <p style={{ color: theme.sage, fontWeight: 600 }}>Drag & drop or click to upload</p>
          <p style={{ color: theme.mist, opacity: 0.6, fontSize: 12 }}>JPG, PNG, WEBP supported</p>
        </>
      )}
      <input
        ref={fileRef || localFileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default UploadBox;