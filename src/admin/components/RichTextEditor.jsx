import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Code,
  Link2,
  Image as ImageIcon,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  RemoveFormatting,
  X,
  ExternalLink,
  ChevronDown,
  Palette,
  Highlighter,
  BookOpen,
  UploadCloud
} from 'lucide-react';
import { blogApi } from '../../api';
import '../styles/RichTextEditor.css';

export default function RichTextEditor({
  value = '',
  onChange,
  internalRoutes = [],
}) {
  const [editorMode, setEditorMode] = useState('visual'); // 'visual' | 'html'
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Link Modal State
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkAnchor, setLinkAnchor] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Image Modal State
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [inlineUploading, setInlineUploading] = useState(false);
  const inlineFileRef = useRef(null);

  // Color picker refs
  const textColorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);

  // Synchronize incoming value into editorRef innerHTML
  useEffect(() => {
    if (editorRef.current && editorMode === 'visual') {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, editorMode]);

  // Capture selection whenever selection changes in the document
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && editorRef.current) {
        const range = sel.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          savedRangeRef.current = range.cloneRange();
        }
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Save current selection text
  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = range.cloneRange();
        return sel.toString().trim();
      }
    }
    if (savedRangeRef.current) {
      return savedRangeRef.current.toString().trim();
    }
    return '';
  };

  // Open Link Modal with pre-filled selected word
  const handleOpenLinkModal = () => {
    const selectedText = saveCurrentSelection();
    setLinkAnchor(selectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  // Insert Custom Link into Editor
  const handleInsertLink = (e) => {
    if (e) e.preventDefault();
    if (!linkUrl.trim()) {
      alert('Please enter or select a destination URL.');
      return;
    }

    const anchor = linkAnchor.trim() || linkUrl.trim();

    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.focus();

      const sel = window.getSelection();
      if (savedRangeRef.current && sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);

        // Replace currently selected range with the new link tag
        savedRangeRef.current.deleteContents();
        const a = document.createElement('a');
        a.href = linkUrl.trim();
        a.className = 'blog-inline-link';
        a.textContent = anchor;
        savedRangeRef.current.insertNode(a);

        // Move cursor cleanly after the newly inserted link
        savedRangeRef.current.setStartAfter(a);
        savedRangeRef.current.setEndAfter(a);
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      } else {
        // Fallback: insert via execCommand or append
        document.execCommand(
          'insertHTML',
          false,
          `<a href="${linkUrl.trim()}" class="blog-inline-link">${anchor}</a>`
        );
      }

      handleVisualInput();
    } else {
      // In HTML mode
      const linkTag = `<a href="${linkUrl.trim()}" class="blog-inline-link">${anchor}</a>`;
      const updated = (value || '') + linkTag;
      if (onChange) onChange(updated);
    }

    setShowLinkModal(false);
    setLinkAnchor('');
    setLinkUrl('');
    savedRangeRef.current = null;
  };

  // Open Image Modal
  const handleOpenImageModal = () => {
    saveCurrentSelection();
    setImageUrl('');
    setImageAlt('');
    setShowImageModal(true);
  };

  // Insert Image into Editor
  const handleInsertImage = (e) => {
    if (e) e.preventDefault();
    if (!imageUrl.trim()) {
      alert('Please enter an image URL.');
      return;
    }

    const imgTag = `<img src="${imageUrl.trim()}" alt="${imageAlt.trim()}" class="blog-article-inline-img" />`;

    if (editorMode === 'visual' && editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, imgTag);
      handleVisualInput();
    } else {
      const updated = (value || '') + `\n${imgTag}\n`;
      if (onChange) onChange(updated);
    }

    setShowImageModal(false);
    setImageUrl('');
    setImageAlt('');
  };

  // Execute standard formatting commands
  const executeCmd = (command, val = null) => {
    if (editorMode !== 'visual' || !editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, val);
    handleVisualInput();
  };

  // Heading Block Format dropdown
  const handleHeadingSelect = (tag) => {
    if (editorMode !== 'visual') return;
    if (tag === 'p') {
      executeCmd('formatBlock', '<p>');
    } else {
      executeCmd('formatBlock', `<${tag}>`);
    }
  };

  // Visual content change handler
  const handleVisualInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // HTML content change handler
  const handleHtmlChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Reset editor content
  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all editor content?')) {
      if (editorRef.current) editorRef.current.innerHTML = '';
      if (onChange) onChange('');
    }
  };

  // Load Full Article Sample Boilerplate
  const handleLoadFullArticle = () => {
    const sampleArticle = `<h2>Understanding Scalable Modern Web Architecture</h2>
<p>Modern enterprise applications demand a resilient foundation that balances high-speed delivery, seamless accessibility, and structured search visibility. Achieving this requires looking closely at how each piece of your system connects.</p>

<p>It's not simply about picking a popular stack; it's about your end-to-end engineering pipeline basically the whole connected system of APIs, rendering boundaries, caching layers, and database queries working together every time a user visits. When one part of that system gets thrown off, even slightly, the rest has to compensate.</p>

<h2>Key Strategic Engineering Pillars</h2>
<p>To sustain low latency and top-tier Core Web Vitals across millions of requests, engineering leaders focus on three core disciplines:</p>

<ul>
  <li><strong>Edge-Optimized Rendering:</strong> Delivering server-rendered markup directly from edge nodes closest to global users.</li>
  <li><strong>Intelligent Content Interlinking:</strong> Structuring links contextually so readers and search spiders navigate topics organically.</li>
  <li><strong>Automated Schema &amp; Structured Data:</strong> Embedding rich JSON-LD graph objects to present accurate entities directly in Google search snippets.</li>
</ul>

<blockquote>"Technical excellence is not an afterthought; it is the fundamental moat separating market leaders from legacy architectures."</blockquote>

<p>Explore our engineering capabilities and learn how we help businesses transform their digital footprints across <a href="/services-we-provide" class="blog-inline-link">all core services</a>.</p>`;

    if (editorRef.current) {
      editorRef.current.innerHTML = sampleArticle;
    }
    if (onChange) {
      onChange(sampleArticle);
    }
  };

  return (
    <div className="rte-wrapper">
      {/* Top Bar: Mode Toggle & Main Action Buttons */}
      <div className="rte-top-bar">
        <div className="rte-mode-group">
          <span className="rte-mode-label">EDITOR MODE:</span>
          <button
            type="button"
            className={`rte-mode-btn ${editorMode === 'visual' ? 'is-active' : ''}`}
            onClick={() => setEditorMode('visual')}
          >
            <FileText size={15} />
            <span>Rich Text Editor</span>
          </button>
          <button
            type="button"
            className={`rte-mode-btn ${editorMode === 'html' ? 'is-active' : ''}`}
            onClick={() => setEditorMode('html')}
          >
            <Code size={15} />
            <span>HTML Code</span>
          </button>
        </div>

        <div className="rte-actions-group">
          <button
            type="button"
            className="rte-btn-load"
            onClick={handleLoadFullArticle}
            title="Load structured article boilerplate"
          >
            <BookOpen size={14} />
            <span>Load Full Article</span>
          </button>

          <button
            type="button"
            className="rte-btn-reset"
            onClick={handleReset}
            title="Clear editor contents"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="rte-btn-link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenLinkModal}
            title="Select text and insert custom link"
          >
            <Link2 size={15} />
            <span>+ Insert Link</span>
          </button>

          <button
            type="button"
            className="rte-btn-image"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenImageModal}
            title="Insert article image"
          >
            <ImageIcon size={15} />
            <span>+ Insert Image</span>
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Active in Visual Mode) */}
      {editorMode === 'visual' && (
        <div className="rte-toolbar">
          {/* Heading Style Select */}
          <div className="rte-select-wrap">
            <select
              className="rte-heading-select"
              onChange={(e) => handleHeadingSelect(e.target.value)}
              defaultValue="p"
              title="Heading Style"
            >
              <option value="p">Normal</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
            </select>
          </div>

          <div className="rte-toolbar-sep"></div>

          {/* Text Styling */}
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('bold')}
            title="Bold"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('italic')}
            title="Italic"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('underline')}
            title="Underline"
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('strikeThrough')}
            title="Strikethrough"
          >
            <Strikethrough size={15} />
          </button>

          <div className="rte-toolbar-sep"></div>

          {/* Lists */}
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('insertUnorderedList')}
            title="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('insertOrderedList')}
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </button>

          <div className="rte-toolbar-sep"></div>

          {/* Quotes & Code */}
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('formatBlock', '<blockquote>')}
            title="Quote"
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('formatBlock', '<pre>')}
            title="Code Block"
          >
            <Code size={15} />
          </button>

          <div className="rte-toolbar-sep"></div>

          {/* Text Color & Highlight Color */}
          <div className="rte-color-picker-wrap">
            <button
              type="button"
              className="rte-tool-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => textColorInputRef.current && textColorInputRef.current.click()}
              title="Text Color"
            >
              <Palette size={15} />
            </button>
            <input
              type="color"
              ref={textColorInputRef}
              className="rte-hidden-color"
              defaultValue="#20285b"
              onChange={(e) => executeCmd('foreColor', e.target.value)}
            />
          </div>

          <div className="rte-color-picker-wrap">
            <button
              type="button"
              className="rte-tool-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => bgColorInputRef.current && bgColorInputRef.current.click()}
              title="Highlight Background"
            >
              <Highlighter size={15} />
            </button>
            <input
              type="color"
              ref={bgColorInputRef}
              className="rte-hidden-color"
              defaultValue="#e0f2fe"
              onChange={(e) => executeCmd('hiliteColor', e.target.value)}
            />
          </div>

          <div className="rte-toolbar-sep"></div>

          {/* Alignment */}
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyLeft')}
            title="Align Left"
          >
            <AlignLeft size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyCenter')}
            title="Align Center"
          >
            <AlignCenter size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyRight')}
            title="Align Right"
          >
            <AlignRight size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('justifyFull')}
            title="Justify"
          >
            <AlignJustify size={15} />
          </button>

          <div className="rte-toolbar-sep"></div>

          {/* Quick Toolbar Insert Link & Image */}
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenLinkModal}
            title="Insert Link on Selection"
          >
            <Link2 size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenImageModal}
            title="Insert Image"
          >
            <ImageIcon size={15} />
          </button>
          <button
            type="button"
            className="rte-tool-btn"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executeCmd('removeFormat')}
            title="Clear Formatting"
          >
            <RemoveFormatting size={15} />
          </button>
        </div>
      )}

      {/* Editor Content Surface */}
      <div className="rte-editor-surface">
        {editorMode === 'visual' ? (
          <div
            ref={editorRef}
            className="rte-visual-canvas"
            contentEditable={true}
            onInput={handleVisualInput}
            onMouseUp={saveCurrentSelection}
            onKeyUp={saveCurrentSelection}
            onSelect={saveCurrentSelection}
            data-placeholder="Write your article here... Highlight any word to attach internal links or format headings."
          />
        ) : (
          <textarea
            className="rte-html-textarea"
            value={value}
            onChange={handleHtmlChange}
            placeholder="Edit raw semantic HTML code..."
          />
        )}
      </div>

      {/* =========================================================
          INSERT CUSTOM LINK MODAL (Matches user screenshot)
          ========================================================= */}
      {showLinkModal && (
        <div className="rte-modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="rte-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rte-modal-header">
              <h3 className="rte-modal-title">Insert Custom Link</h3>
              <button
                type="button"
                className="rte-modal-close"
                onClick={() => setShowLinkModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInsertLink} className="rte-modal-form">
              {/* Anchor Text: Pre-filled with selected word */}
              <div className="rte-field">
                <label className="rte-label">Anchor Text (Displayed text)</label>
                <input
                  type="text"
                  className="rte-input"
                  placeholder="Selected word or phrase"
                  value={linkAnchor}
                  onChange={(e) => setLinkAnchor(e.target.value)}
                  autoFocus
                />
              </div>

              {/* Destination URL */}
              <div className="rte-field">
                <label className="rte-label">Link URL (Destination) *</label>
                <input
                  type="text"
                  className="rte-input"
                  placeholder="e.g. /doctors or https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  required
                />
                <span className="rte-field-hint">
                  Enter destination URL (e.g. /doctors or full link).
                </span>
              </div>

              {/* Quick Internal Route Dropdown */}
              {internalRoutes.length > 0 && (
                <div className="rte-field">
                  <label className="rte-label">Or Pick From Website Routes</label>
                  <select
                    className="rte-select"
                    onChange={(e) => {
                      if (e.target.value) {
                        setLinkUrl(e.target.value);
                        if (!linkAnchor) {
                          const selected = internalRoutes.find((r) => r.url === e.target.value);
                          if (selected) setLinkAnchor(selected.title);
                        }
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="">Choose Internal Route...</option>
                    {internalRoutes.map((r, i) => (
                      <option key={i} value={r.url}>
                        [{r.category}] {r.title} ({r.url})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="rte-modal-footer">
                <button
                  type="button"
                  className="rte-btn-cancel"
                  onClick={() => setShowLinkModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rte-btn-submit">
                  Insert Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          INSERT IMAGE MODAL
          ========================================================= */}
      {showImageModal && (
        <div className="rte-modal-overlay" onClick={() => setShowImageModal(false)}>
          <div className="rte-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="rte-modal-header">
              <h3 className="rte-modal-title">Insert Article Image</h3>
              <button
                type="button"
                className="rte-modal-close"
                onClick={() => setShowImageModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInsertImage} className="rte-modal-form">
              {/* File Upload from Device */}
              <div className="rte-field">
                <label className="rte-label">Upload Image from Computer</label>
                <input
                  type="file"
                  ref={inlineFileRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setInlineUploading(true);
                      try {
                        const fd = new FormData();
                        fd.append('image', file);
                        const res = await blogApi.uploadImage(fd);
                        if (res.success && res.data?.url) {
                          setImageUrl(res.data.url);
                          if (!imageAlt) {
                            setImageAlt(file.name.replace(/\.[^/.]+$/, ''));
                          }
                        } else {
                          alert(res.message || 'Image upload failed.');
                        }
                      } catch (err) {
                        alert(err.message || 'Failed to upload image.');
                      } finally {
                        setInlineUploading(false);
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="rte-btn-file-picker"
                  onClick={() => inlineFileRef.current && inlineFileRef.current.click()}
                  disabled={inlineUploading}
                >
                  <UploadCloud size={16} />
                  <span>
                    {inlineUploading
                      ? 'Uploading Image to Server...'
                      : 'Choose File from Computer (JPG, PNG, WebP)'}
                  </span>
                </button>
              </div>

              {imageUrl && (
                <div className="rte-inline-preview-wrap">
                  <img src={imageUrl} alt="Preview" className="rte-inline-preview-thumb" />
                  <span className="rte-preview-url-text">{imageUrl}</span>
                </div>
              )}

              <div className="rte-field">
                <label className="rte-label">Or Direct Image URL *</label>
                <input
                  type="text"
                  className="rte-input"
                  placeholder="https://... or /uploads/blogs/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
              </div>

              <div className="rte-field">
                <label className="rte-label">Image Alt Text (SEO & Accessibility)</label>
                <input
                  type="text"
                  className="rte-input"
                  placeholder="Descriptive caption of the image"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>

              <div className="rte-modal-footer">
                <button
                  type="button"
                  className="rte-btn-cancel"
                  onClick={() => setShowImageModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="rte-btn-submit">
                  Insert Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
