import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import usePosts from '../hooks/usePosts';
import Sidebar from '../components/Sidebar';

const MAX_CAPTION = 2200;

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'];

/**
 * UI Layer — Create Post page
 * Design: Minimal, breathable, Aether/Minima design system
 */
const CreatePost = () => {
  const navigate = useNavigate();
  const {
    uploadImage,
    uploadLoading,
    uploadError,
    uploadedImageUrl,
    resetUpload,
    createPost,
    createLoading,
    createError,
    clearPostError,
  } = usePosts();

  const [caption, setCaption] = useState('');
  const [localError, setLocalError] = useState('');
  const [preview, setPreview] = useState(null); // local blob URL for preview
  const [dragOver, setDragOver] = useState(false);
  const [fileType, setFileType] = useState('');
  const fileRef = useRef(null);

  /* ── File handling ── */
  const processFile = useCallback(
    async (file) => {
      setLocalError('');
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError('Unsupported file type. Use JPEG, PNG, WebP, HEIC or HEIF.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setLocalError('Image must be smaller than 20 MB.');
        return;
      }
      setFileType(file.type);
      setPreview(URL.createObjectURL(file));
      await uploadImage(file);
    },
    [uploadImage]
  );

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileType('');
    resetUpload();
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearPostError();

    if (!uploadedImageUrl) {
      setLocalError('Please upload an image first.');
      return;
    }

    const success = await createPost({
      imageUrl: uploadedImageUrl,
      imageType: fileType,
      imageAlt: caption || 'post image',
      caption,
    });

    if (success) {
      navigate('/');
    }
  };

  const displayError = localError || uploadError || createError;

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Sidebar />

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-10 flex items-center justify-between px-5 py-4 bg-white border-b border-[#f0f0f0]">
        <button
          onClick={() => navigate(-1)}
          className="text-[#737373] hover:text-[#111] transition-colors"
          aria-label="Back"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="text-[#111] text-base font-semibold tracking-tight">New Post</span>
        <div className="w-5" /> {/* spacer */}
      </header>

      {/* Main */}
      <main className="lg:ml-60 flex justify-center px-5 pt-20 lg:pt-0 pb-20">
        <div className="w-full max-w-[640px] py-12">

          {/* Heading */}
          <div className="hidden lg:flex items-center gap-4 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="text-[#737373] hover:text-[#111] transition-colors mr-1"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-[#111] tracking-tight">New Post</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            {/* ── Image upload zone ── */}
            <div className="mb-6">
              {!preview ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`w-full flex flex-col items-center justify-center gap-4 border ${
                    dragOver ? 'border-[#111] bg-[#fafafa]' : 'border-dashed border-[#d0d0d0]'
                  } transition-colors cursor-pointer`}
                  style={{ minHeight: '380px' }}
                  aria-label="Upload image"
                >
                  {uploadLoading ? (
                    <span className="w-6 h-6 border border-[#d0d0d0] border-t-[#111] rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <div className="text-center">
                        <p className="text-sm text-[#737373] mb-1">Drop an image or click to upload</p>
                        <p className="text-xs text-[#b0b0b0]">JPEG, PNG, WebP, HEIC · max 20 MB</p>
                      </div>
                    </>
                  )}
                </button>
              ) : (
                <div className="relative w-full bg-[#f5f5f5] overflow-hidden group" style={{ aspectRatio: '4/5' }}>
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Upload indicator overlay */}
                  {uploadLoading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <span className="w-6 h-6 border border-[#d0d0d0] border-t-[#111] rounded-full animate-spin" />
                    </div>
                  )}
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white text-[#111] p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_TYPES.join(',')}
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            {/* ── Caption ── */}
            <div className="mb-2 relative">
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CAPTION) setCaption(e.target.value);
                }}
                placeholder="Write a caption…"
                rows={4}
                className="w-full bg-[#f5f5f5] text-[#111] placeholder-[#c0c0c0] text-sm px-4 py-3.5 resize-none outline-none border-b-2 border-transparent focus:border-[#111] transition-colors duration-200"
              />
              <span className="absolute bottom-3 right-4 text-xs text-[#b0b0b0]">
                {caption.length} / {MAX_CAPTION}
              </span>
            </div>

            {/* ── Error ── */}
            {displayError && (
              <p className="text-[#ba1a1a] text-xs mb-4">{displayError}</p>
            )}

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={createLoading || uploadLoading || !uploadedImageUrl}
              className="w-full bg-[#111] text-white text-sm font-medium py-3.5 mt-4 tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2a2a2a] transition-colors duration-200"
            >
              {createLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" />
                  Sharing…
                </span>
              ) : (
                'Share post'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;