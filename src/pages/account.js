import React, { useEffect, useState } from 'react';
import { Camera, Trash2, Save, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session, status } = useSession();

  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [tokens, setTokens] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Populate formData when session data is ready
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const nameParts = session.user.name?.trim().split(' ') || [''];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' '); // Handle names with multiple parts

      setFormData({
        firstName,
        lastName,
        email: session.user.email || ''
      });
    }
  }, [session, status]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    // In a real app, send updated info to your API
    alert('Account details saved successfully!');
  };

  const handleCreateToken = () => {
    const newToken = {
      id: Date.now(),
      name: `Token ${tokens.length + 1}`,
      key: `tk_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toLocaleDateString()
    };
    setTokens([...tokens, newToken]);
  };

  const handleDeleteToken = (id) => {
    setTokens(tokens.filter(token => token.id !== id));
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      alert('Account deletion initiated. This would redirect to confirmation.');
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  if (status === 'loading') {
    return <div className="text-center mt-20 text-slate-600">Loading account...</div>;
  }

  if (!session) {
    return <div className="text-center mt-20 text-red-600">You must be logged in to view this page.</div>;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Account</h1>
          <p className="text-slate-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg sm:p-8 p-4 transition-all hover:shadow-xl">
        
          <div className="space-y-6 sm:px-20 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
             <p className="text-sm text-slate-500 mt-2">
  If you want to change your password then please logout and then &quot;reset password&quot; from login page.
</p>

            </div>

            <button
              onClick={handleSave}
              className="w-[200px] bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

        {/* API Tokens Section */}
        <div className="bg-white rounded-2xl shadow-lg sm:p-8 p-2 transition-all hover:shadow-xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">API Tokens</h2>
              <p className="text-slate-600 mt-1">All your API tokens below.</p>
            </div>
            <button
              onClick={handleCreateToken}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Token
            </button>
          </div>

          {tokens.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No tokens created yet.
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{token.name}</p>
                    <p className="text-sm text-slate-500 font-mono">{token.key}</p>
                    <p className="text-xs text-slate-400 mt-1">Created: {token.created}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteToken(token.id)}
                    className="text-red-500 hover:text-red-700 transition-all p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl border-2 border-red-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Delete Account</h2>
          <p className="text-slate-600 mb-4">
            Permanently delete your account and all associated data. This includes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
            <li>Forms</li>
            <li>Submissions</li>
            <li>Workspaces</li>
            <li>Association with other organizations (if any)</li>
          </ul>
          <p className="text-orange-600 font-semibold mb-6">
            Please cancel your subscription before deleting your account.
          </p>
          
          {showDeleteConfirm && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold mb-2">Are you absolutely sure?</p>
              <p className="text-red-700 text-sm">This action cannot be undone. Click the button again to confirm.</p>
            </div>
          )}

          <button
            onClick={handleDeleteAccount}
            className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-[1.02] ${
              showDeleteConfirm
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {showDeleteConfirm ? 'Click Again to Confirm Delete' : 'Delete Account'}
          </button>
          
          {showDeleteConfirm && (
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="w-full mt-3 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}