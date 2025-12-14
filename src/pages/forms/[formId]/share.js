import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Facebook, Linkedin, Twitter, QrCode, X, Mail, MessageCircle, Send } from 'lucide-react';
import FormHeader from "@/components/blocks/FormHeader";
import { useRouter } from "next/router";
import Image from 'next/image';



const ShareComponent = () => {
   const router = useRouter();
       const [formTitle, setFormTitle] = useState('Form Builder');
       const [isEditingTitle, setIsEditingTitle] = useState(false);

      const { formId } = router.query;
  const [copied, setCopied] = useState(false);
  const [embedType, setEmbedType] = useState('inline');
  const [codeType, setCodeType] = useState('js');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
 const [form, setForm] = useState({});
     const [loading, setLoading] = useState(true);
 const [shareUrl, setShareUrl] = useState('');

  

  useEffect(() => {
    if (showQRModal) {
      // Generate QR code using QR Server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [showQRModal, shareUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const embedCode = {
    inline: {
      js: `<div data-form4us-embed data-form='${formId}' data-width='100%' data-height='700'></div>`,
      html: `<iframe src="${shareUrl}" width="100%" height="700" frameborder="0"></iframe>`
    },
    popup: {
      js: `<button data-form4us-popup data-form='${formId}'>Open Form</button>`,
      html: `<a href="${shareUrl}" target="_blank">Open Form</a>`
    }
  };

  const scriptTag = `<script src="https://app.form4us.com/embed.js"></script>`;



    useEffect(() => {
        if (!formId) return;

        async function fetchForm() {
            try {
                const res = await fetch(`/api/forms/${formId}`);
                if (!res.ok) {
                    setForm(null);
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setForm(data);
                setFormTitle(data.title || 'Form Builder');
                // Generate share URL
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
                setShareUrl(`${baseUrl}/forms/${formId}`);
               
            } catch (error) {
                console.error('Error fetching form:', error);
                setForm(null);
            } finally {
                setLoading(false);
            }
        }

        fetchForm();
    }, [formId]);

  const handleCopyEmbed = () => {
    const code = embedCode[embedType][codeType] + '\n\n' + (codeType === 'js' ? scriptTag : '');
    navigator.clipboard.writeText(code);
  };

  const shareOnPlatform = (platform) => {
    const title = 'Check out this form';
    const text = 'I wanted to share this with you';
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`
    };
    
    if (urls[platform]) {
      if (platform === 'email') {
        window.location.href = urls[platform];
      } else {
        window.open(urls[platform], '_blank', 'width=600,height=400');
      }
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async () => {
    // Save functionality if needed
    console.log('Save clicked');
  };

  return (
   <>
      <FormHeader 
        isEditingTitle={isEditingTitle} 
        formTitle={formTitle} 
        setFormTitle={setFormTitle} 
        setIsEditingTitle={setIsEditingTitle}
        handleSave={handleSave}
        form={form}
      />
   
   <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      {/* Share Link Section */}
      <div className="mb-8">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
          />
          <button
            onClick={handleCopyLink}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
          >
            <Copy size={18} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Make sure your form is published before you share it to the world.
        </p>
      </div>

      {/* Social Share Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
        <button
          onClick={() => window.open(shareUrl, '_blank')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Open in new tab"
        >
          <ExternalLink size={20} />
        </button>
        <button
          onClick={() => shareOnPlatform('facebook')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
          title="Share on Facebook"
        >
          <Facebook size={20} className="text-blue-600" />
        </button>
        <button
          onClick={() => shareOnPlatform('twitter')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-sky-50 transition-colors"
          title="Share on Twitter/X"
        >
          <Twitter size={20} className="text-sky-500" />
        </button>
        <button
          onClick={() => shareOnPlatform('linkedin')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin size={20} className="text-blue-700" />
        </button>
        <button
          onClick={() => shareOnPlatform('whatsapp')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-green-50 transition-colors"
          title="Share on WhatsApp"
        >
          <MessageCircle size={20} className="text-green-600" />
        </button>
        <button
          onClick={() => shareOnPlatform('telegram')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 transition-colors"
          title="Share on Telegram"
        >
          <Send size={20} className="text-blue-500" />
        </button>
        <button
          onClick={() => shareOnPlatform('email')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Share via Email"
        >
          <Mail size={20} className="text-gray-600" />
        </button>
        <button
          onClick={() => setShowQRModal(true)}
          className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="Generate QR Code"
        >
          <QrCode size={20} />
        </button>
      </div>

      {/* Embed Section */}
      <div>
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="text-gray-700 font-medium">Embed in your website as</span>
          <select
            value={embedType}
            onChange={(e) => setEmbedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer"
          >
            <option value="inline">Inline embed</option>
            <option value="popup">Popup embed</option>
          </select>
          <span className="text-gray-700 font-medium">of type</span>
          <select
            value={codeType}
            onChange={(e) => setCodeType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer"
          >
            <option value="js">JS embed</option>
            <option value="html">HTML embed</option>
          </select>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Works with WordPress, Squarespace, Wix, Shopify, Webflow, Carrd, and all other website builders.
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Paste the below code snippet in your page where you want to show it:
        </p>

        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-3 font-mono text-sm overflow-x-auto">
          <code>{embedCode[embedType][codeType]}</code>
        </div>

        {codeType === 'js' && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              You can configure the width and height according to your need. Learn more about the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                embed code
              </a>{' '}
              here.
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Then include the following script tag below the above tag:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 font-mono text-sm overflow-x-auto">
              <code>{scriptTag}</code>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleCopyEmbed}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
          >
            <Copy size={16} />
            Configure
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-4 text-gray-800">QR Code</h2>
            <p className="text-gray-600 mb-6">
              Scan this QR code to access the form directly
            </p>
            
            <div className="flex justify-center mb-6 bg-gray-50 p-6 rounded-lg">
              {qrCodeUrl ? (
                <Image src={qrCodeUrl} width={256} height={256} alt="QR Code" />

              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadQRCode}
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Download QR Code
              </button>
              <button
                onClick={() => setShowQRModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div> 
   </>
  );
};

export default ShareComponent;