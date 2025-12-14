import React, { useEffect, useState } from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import FormHeader from "@/components/blocks/FormHeader";



const SubmissionsTable = () => {
  const router = useRouter()
  const { formId } = router.query;
  const [activeTab, setActiveTab] = useState('submissions');
  const [activeFilter, setActiveFilter] = useState('completed');
  const [submissions, setSubmissions] = useState([]);
  const [columns, setColumns] = useState([]);
  const [title, setTitle] = useState('');
  const [formTitle, setFormTitle] = useState('Form Builder');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!formId) return;

    // Fetch form data
    async function fetchForm() {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data);
          setFormTitle(data.title || 'Form Builder');
          setTitle(data.title || 'Form Builder');
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      }
    }

    fetchForm();

    // Fetch responses
    fetch(`/api/responses?formId=${formId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const responseData = data.data.filter(entry => entry.responses);
          console.log(data?.data[0]?.formTitle);
          if (data?.data[0]?.formTitle) {
            setTitle(data.data[0].formTitle);
          }
          setSubmissions(responseData);

          const allKeys = new Set();
          responseData.forEach(entry => {
            Object.keys(entry.responses || {}).forEach(key => {
              allKeys.add(key);
            });
          });

          setColumns([...allKeys]);
        }
      });
  }, [formId]);

  const handleSave = async () => {
    // Save functionality if needed
    console.log('Save clicked');
  };

  const completedCount = submissions.length;
  const partialCount = 0;

  return (
    <div>
      <FormHeader 
        isEditingTitle={isEditingTitle} 
        formTitle={formTitle} 
        setFormTitle={setFormTitle} 
        setIsEditingTitle={setIsEditingTitle}
        handleSave={handleSave}
        form={form}
      />
    <div className="min-h-screen bg-gray-50 p-6">
       
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow">

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6">
            <div className="flex space-x-8">
              {['submissions', 'summary', 'analytics'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                Download attachments
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
                <Maximize2 className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveFilter('completed')}
              className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                activeFilter === 'completed'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{completedCount}</span>
            </button>
            <button
              onClick={() => setActiveFilter('partial')}
              className={`pb-2 border-b-2 font-medium text-sm transition-colors ${
                activeFilter === 'partial'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Partial <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{partialCount}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                </th>
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission._id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-6 py-4 text-sm text-gray-900">
                      {submission.responses?.[col] ?? '-'}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          Scroll horizontally to view all columns and click on a row to see the response if truncated.
        </div>
      </div>
    </div>
    </div>
  );
};

export default SubmissionsTable;


export async function getServerSideProps(context) {
  const userSession = await getSession(context);

  if (!userSession) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userSession,
    },
  };
}