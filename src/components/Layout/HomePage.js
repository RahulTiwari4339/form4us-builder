import { useEffect, useState, useTransition } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import TemplatePreviewModal from "@/components/Preview/TemplatePreviewModal";
import { useRouter } from "next/router";

import {
  Plus,
  FolderClosed,
  X,
  Ellipsis,
  Hammer,
  ExternalLink,
  Link,
  Pencil,
  Copy,
  EyeOff,
  Trash2,
  Search,
  FileText,
  MessageSquare,
} from "lucide-react";

const BG_COLORS = [
  "bg-blue-50",
  "bg-purple-50",
  "bg-pink-50",
  "bg-green-50",
  "bg-yellow-50",
  "bg-orange-50",
  "bg-teal-50",
  "bg-indigo-50",
  "bg-rose-50",
  "bg-cyan-50",
];

export default function HomePage({ role, userSession }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [forms, setForms] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFormId, setRenameFormId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Fetch functions
  const fetchForms = async () => {
    try {

      const userId = userSession?.user?.userId;
      console.log("Fetching forms for user:", userId);

      const response = await axios.post("/api/forms", {
        userId,
      });
      const formsData = response?.data?.data;
      console.log("Fetched forms:", formsData);

      const formsWithCounts = await Promise.all(
        formsData.map(async (form) => {
          try {
            const countRes = await axios.get(
              `/api/responses/count?formId=${form.formId}`
            );
            return {
              ...form,
              responseCount: countRes.data.count || 0,
            };
          } catch (err) {
            console.error(`Failed to get response count for ${form.formId}:`, err);
            return {
              ...form,
              responseCount: 0,
            };
          }
        })
      );

      return formsWithCounts;
    } catch (error) {
      console.error("Error fetching forms:", error);
      return [];
    }
  };

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const response = await axios.get("/api/forms/template");
      setTemplates(response.data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  // Utility functions
  const getRandomColor = (formId) => {
    const index = formId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return BG_COLORS[index % BG_COLORS.length];
  };

  // Event handlers
  const handleMenuToggle = (formId, e) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === formId ? null : formId));
  };

  const handleCreateForm = async (templateId = null) => {
    try {
      if(templateId) {
        startTransition(() => {
          router.push(`/forms/${templateId}/build`);
        });
        return;
      }
      const response = await axios.post("/api/forms/create", {
        title: "My Form",
      });

      if (response.data.success) {
        const formId = response.data.formId;
        setIsModalOpen(false);
        startTransition(() => {
          router.push(`/forms/${formId}/build`);
        });
      }
    } catch (error) {
      console.error("Form creation failed:", error);
    }
  };

  const handlePreviewTemplate = async (templateId) => {
    try {
      const res = await axios.get(`/api/forms/${templateId}`);
      setPreviewTemplate(res.data);
      setPreviewModalOpen(true);
    } catch (error) {
      console.error("Preview load failed:", error);
    }
  };

  const handleDeleteForm = async (formId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this form?")) return;

    try {
      const response = await axios.delete("/api/forms/delete", {
        data: { formId },
      });

      if (response.data.success) {
        setForms((prevForms) => prevForms.filter((form) => form.formId !== formId));
        setOpenMenuId(null);
      }
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  };

  const handleCopyLink = async (formId, e) => {
    e.stopPropagation();
    const formUrl = `${window.location.origin}/forms/${formId}`;
    try {
      await navigator.clipboard.writeText(formUrl);
      setOpenMenuId(null);
    } catch (err) {
    }
  };

  const handleRenameForm = (formId, title, e) => {
    e.stopPropagation();
    setRenameFormId(formId);
    setNewTitle(title);
    setRenameModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveRename = async () => {
    try {
      await axios.post("/api/forms/rename", {
        formId: renameFormId,
        newTitle,
      });
      setForms(await fetchForms());
      setRenameModalOpen(false);
    } catch (err) {
    }
  };

  const handleDuplicateForm = async (formId, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    try {
      await axios.post("/api/forms/duplicate", { formId });
      setForms(await fetchForms());
    } catch (err) {
    }
  };

  const handleCloseForm = async (formId, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    try {
      await axios.post("/api/forms/close", { formId });
      setForms(await fetchForms());
    } catch (err) {
    }
  };



  const handleToggleFormStatus = async (form, e) => {
    e.stopPropagation();
    setOpenMenuId(null);

    try {
      await axios.post("/api/forms/close", {
        formId: form.formId,
        isActive: !form.isActive, // toggle
      });

      setForms(await fetchForms());
    } catch (err) {
      console.error("Failed to update form status", err);
    }
  };


  const handleNavigateToForm = (formId, path, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    router.push(`/forms/${formId}${path}`);
  };

  const handleViewSubmissions = (formId, e) => {
    e.stopPropagation();
    router.push(`/forms/${formId}/submissions`);
  };

  // Effects
  useEffect(() => {
    fetchForms().then((fetchedForms) => {
      setForms(fetchedForms);
    });
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchTemplates();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openMenuId && !e.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  // Computed values
  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Menu items configuration
  const menuItems = (form) => [
    {
      icon: Hammer,
      label: "Build",
      onClick: (e) => handleNavigateToForm(form.formId, "/build", e),
    },
    {
      icon: ExternalLink,
      label: "Open Form",
      onClick: (e) => handleNavigateToForm(form.formId, "", e),
    },
    {
      icon: Link,
      label: "Copy Link",
      onClick: (e) => handleCopyLink(form.formId, e),
    },
    {
      icon: Pencil,
      label: "Rename",
      onClick: (e) => handleRenameForm(form.formId, form.title, e),
    },
    {
      icon: Copy,
      label: "Duplicate",
      onClick: (e) => handleDuplicateForm(form.formId, e),
    },
    {
      icon: form.isActive ? EyeOff : Eye,
      label: form.isActive ? "Close this Form" : "Open this form",
      onClick: (e) => handleToggleFormStatus(form, e),
    }, ,
  ];
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <main className="w-full min-h-screen p-6 md:px-20 lg:px-36">
        {/* Top Controls */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all w-full sm:w-auto justify-center font-medium">
            <FolderClosed size={18} />
            My Workspace
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <button
              className="flex items-center gap-2 px-5 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-md transition-all font-medium whitespace-nowrap"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              New Form
            </button>
          </div>
        </div>

        {/* Workspace */}
        {filteredForms && filteredForms.length > 0 ? (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredForms.map((form) => (
                <div
                  key={form._id}
                  className="group relative bg-white rounded border border-gray-200 hover:shadow-md cursor-pointer overflow-visible"
                  onClick={() => router.push(`/forms/${form.formId}/build`)}
                >
                  {
                    !form.isActive && (
                      <span className="absolute  right-0 bg-red-100 text-red-500 text-xs px-2 py-1 rounded-md shadow">
                        closed
                      </span>
                    )
                  }

                  {/* Form Content */}
                  <div className={`p-6 h-40 flex items-center justify-center border-b border-gray-100 ${getRandomColor(form.formId)}`}>
                    <div className="text-center">
                      <FileText className="mx-auto mb-3 text-gray-700" size={32} />
                      <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                        {form.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                     <div>
                      {
                        form.responseCount > 0 ? (
                          <span className="text-[12px] text-gray-600 hover:bg-[#E5E7EB] hover:px-1 hover:py-1 hover:rounded-md" 
                           onClick={(e) => handleViewSubmissions(form.formId, e)}
                          >
                            {form.responseCount} responses
                          </span>
                        ): (
                          <span className="text-[12px] text-gray-600">
                            No responses
                          </span>
                        )
                      }
                    </div>

                    {/* Menu */}
                    <div className="menu-container relative">
                      <button
                        onClick={(e) => handleMenuToggle(form.formId, e)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Ellipsis size={18} className="text-gray-600" />
                      </button>

                      {openMenuId === form.formId && (
                        <div className="absolute right-0 bottom-full mb-2 z-50 w-52 rounded-lg bg-white shadow-xl ring-1 ring-black/5 border border-gray-100">
                          <ul className="py-1">
                            {menuItems(form).map((item, index) => {
                              const Icon = item.icon;
                              return (
                                <li
                                  key={index}
                                  className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors"
                                  onClick={item.onClick}
                                >
                                  <Icon size={16} />
                                  <span className="text-sm font-medium">{item.label}</span>
                                </li>
                              );
                            })}
                            <div className="my-1 border-t border-gray-100"></div>
                            <li
                              className="px-4 py-2.5 hover:bg-red-50 cursor-pointer flex items-center gap-3 text-red-500 hover:text-red-600 transition-colors"
                              onClick={(e) => handleDeleteForm(form.formId, e)}
                            >
                              <Trash2 size={16} />
                              <span className="text-sm font-medium">Delete</span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 px-8 py-12 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-500" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {searchQuery ? "No forms found" : "No forms yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first form to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-md transition-all font-medium"
                >
                  Create a form
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Create Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative border border-gray-200 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Form</h2>

            {loadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Blank Form Option */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                  <button
                    onClick={() => handleCreateForm()}
                    className="w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 group p-6"
                    disabled={isPending}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Plus size={28} className="text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-semibold group-hover:text-blue-600 transition-colors">
                      {isPending ? "Creating..." : "Blank Form"}
                    </span>
                    <p className="text-sm text-gray-500 text-center">
                      Start with a blank form and customize it
                    </p>
                  </button>
                </div>

                {/* Template Options */}
                {templates && templates.length > 0 && templates.map((template) => (
                  <div
                    key={template._id || template.templateId}
                    className="border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all overflow-hidden bg-white"
                  >
                    <div className="w-full h-40 bg-yellow-50 flex flex-col items-center justify-center gap-3 px-4">
                      <button
                        onClick={() => handleCreateForm(template.formId || template._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm font-medium transition"
                        disabled={isPending}
                      >
                        <FileText size={16} />
                        Use it
                      </button>
                      <button
                        onClick={() => handlePreviewTemplate(template.formId)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 text-sm font-medium transition"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                    </div>
                    <div className="px-4 py-3 text-center">
                      <h3 className="text-gray-800 font-semibold text-sm">
                        {template.title || template.name || "Template"}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingTemplates && (!templates || templates.length === 0) && (
              <p className="text-center text-gray-500 mt-4">
                No templates available at the moment
              </p>
            )}

            {previewModalOpen && previewTemplate && (
              <TemplatePreviewModal
                formId={previewTemplate.formId}
                onClose={() => setPreviewModalOpen(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Rename Form</h2>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              placeholder="Enter form name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveRename();
                } else if (e.key === 'Escape') {
                  setRenameModalOpen(false);
                }
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                onClick={() => setRenameModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                onClick={handleSaveRename}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

