// Professional PDF Viewer - HTML-based document viewer
// Works on ALL devices including Android mobile
// Supports zoom, print, download, fullscreen

import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Download, Printer, Maximize2, Minimize2 } from 'lucide-react';

export function PDFViewer({ document, onClose }) {
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const contentRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${document.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>${document.html}</body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownload = () => {
    // Create blob and download
    const blob = new Blob([document.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.95)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white flex flex-col ${
          fullscreen ? 'w-full h-full' : 'w-[95vw] h-[95vh] rounded-2xl'
        }`}
        style={{ maxWidth: fullscreen ? '100%' : '1400px' }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ background: 'linear-gradient(135deg, #0A1628 0%, #1A2B44 100%)' }}
        >
          {/* Left: Close & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
            <div>
              <h3 className="text-lg font-black text-white tracking-tight">
                {document.title}
              </h3>
              {document.subtitle && (
                <p className="text-xs text-white/60 mt-1">
                  {document.subtitle} · {document.docRef}
                </p>
              )}
            </div>
          </div>

          {/* Center: Zoom Controls */}
          <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-2">
            <button
              onClick={() => setZoom(z => Math.max(50, z - 10))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={18} className="text-white" />
            </button>
            <span className="text-sm font-bold text-white min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 10))}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={18} className="text-white" />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFullscreen(f => !f)}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? (
                <Minimize2 size={20} className="text-white" />
              ) : (
                <Maximize2 size={20} className="text-white" />
              )}
            </button>
            <button
              onClick={handlePrint}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Print"
            >
              <Printer size={20} className="text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              title="Download"
            >
              <Download size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto bg-slate-100 p-8">
          <div
            ref={contentRef}
            className="bg-white shadow-2xl mx-auto"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
              maxWidth: '210mm', // A4 width
              minHeight: '297mm', // A4 height
              padding: '20mm',
            }}
            dangerouslySetInnerHTML={{ __html: document.html }}
          />
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
