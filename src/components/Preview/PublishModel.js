import React from 'react'
import { Share2, Facebook, Linkedin, QrCode, Monitor, Sliders, Link } from 'lucide-react';


const PublishModel = ({setShowPublishModal, formUrl, handleCopy, copied}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 sm:mt-0 mt-10">
                        {/* Modal container */}
                        <div className="bg-white rounded-2xl shadow-xl w-[600px] h-[600px] sm:p-6 p-10 overflow-y-auto relative">
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="cursor-pointer absolute sm:top-4 top-6 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                                aria-label="Close modal"
                            >
                                ✖
                            </button>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="sm:text-3xl text-xl font-bold text-gray-800 mb-2">
                                    Your masterpiece is now live 🚀
                                </h1>
                            </div>
    
                            {/* Share Section */}
                            <div className="mb-10">
                                <h2 className="text-lg text-gray-700 text-center mb-4">
                                    Share it with the world:
                                </h2>
    
                                {/* URL Input */}
                                <div className="flex gap-3 mb-6">
                                    <input
                                        type="text"
                                        value={formUrl}
                                        readOnly
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="cursor-pointer px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
    
                                {/* Social Share Icons */}
                                <div className="flex justify-center gap-5">
                                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Share2 className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Facebook className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                        <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                        </svg>
                                    </button>
                                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Linkedin className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors">
                                        <QrCode className="w-6 h-6 text-gray-700" />
                                    </button>
                                </div>
                            </div>
    
                            {/* Next Steps */}
                            <div>
                                <h2 className="text-lg text-gray-700 text-center mb-4">
                                    Or choose your next adventure:
                                </h2>
    
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Embed */}
                                    <button className="p-6 bg-purple-200 hover:bg-purple-300 rounded-2xl transition-all hover:scale-105 active:scale-95">
                                        <div className="flex flex-col items-center gap-2">
                                            <Monitor className="w-8 h-8 text-purple-900" />
                                            <div className="text-center">
                                                <div className="font-semibold text-purple-900">Embed</div>
                                                <div className="text-sm text-purple-900">in website</div>
                                            </div>
                                        </div>
                                    </button>
    
                                    {/* Setup Integrations */}
                                    <button className="p-6 bg-green-200 hover:bg-green-300 rounded-2xl transition-all hover:scale-105 active:scale-95">
                                        <div className="flex flex-col items-center gap-2">
                                            <Sliders className="w-8 h-8 text-green-900" />
                                            <div className="text-center">
                                                <div className="font-semibold text-green-900">Setup</div>
                                                <div className="text-sm text-green-900">integrations</div>
                                            </div>
                                        </div>
                                    </button>
    
                                    {/* Customize Link */}
                                    <button className="p-6 bg-yellow-200 hover:bg-yellow-300 rounded-2xl transition-all hover:scale-105 active:scale-95">
                                        <div className="flex flex-col items-center gap-2">
                                            <Link className="w-8 h-8 text-yellow-900" />
                                            <div className="text-center">
                                                <div className="font-semibold text-yellow-900">Customize</div>
                                                <div className="text-sm text-yellow-900">form link</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
  )
}

export default PublishModel
