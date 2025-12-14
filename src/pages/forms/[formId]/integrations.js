import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import FormHeader from "@/components/blocks/FormHeader";

const Integrations = () => {
  const router = useRouter();
  const { formId } = router.query;

  const [formTitle, setFormTitle] = useState('Form Builder');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error fetching form:', error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [formId]);

  const handleSave = async () => {
    console.log('Save clicked');
  };

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

      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Integrations</h2>
        <p className="text-gray-600">Integrations coming soon...</p>
      </div>
    </div>
  );
};

export default Integrations;
