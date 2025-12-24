// components/SettingsPanel.jsx
import React, { useRef, useState } from "react";
import { FORM_META } from "@/config/formsMeta";
import { Bold, Italic, Link } from "lucide-react";
import { nanoid } from "nanoid";
import {
  Settings,
  EyeOff,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function SettingsPanel({ step, updateSettings }) {
  const [expandedField, setExpandedField] = useState(null);
  const editorRef = useRef(null);

  if (!step) return null;

  const meta = FORM_META[step.type];
  if (!meta || !meta.settingsFields) return <p>No settings available</p>;

  const change = (key, value) => {
    updateSettings(key, value);
  };

  /* -----------------------------------------------------
        FIELD RENDERER → reusable for all input types
  ------------------------------------------------------ */
  const renderField = (field) => {
    const value = step.settings[field.key];

    switch (field.type) {
      /* -------------------
           TEXT INPUT
      ------------------- */
      
      case "text":
        return (
          <div className="mt-3" key={field.key}>
            <label className="text-sm font-medium text-gray-600">
              {field.label}
            </label>
            <input
              value={value || ""}
              className="w-full p-2 border border-gray-200 rounded mt-1"
              onChange={(e) => change(field.key, e.target.value)}
            />
          </div>
        );

      /* -------------------
         CHECKBOX
      ------------------- */
      case "checkbox":
        return (
          <div
            className="mt-3 flex justify-between items-center"
            key={field.key}
          >
            <label className="text-sm font-medium">{field.label}</label>
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => change(field.key, e.target.checked)}
            />
          </div>
        );

      /* -------------------
         LIST OPTIONS
      ------------------- */
      case "list":
        return (
          <div className="mt-3" key={field.key}>
            <label className="text-sm font-medium">{field.label}</label>

            {(value || []).map((opt, index) => (
              <input
                key={index}
                className="w-full border p-2 rounded mt-1"
                value={opt}
                onChange={(e) => {
                  const copy = [...value];
                  copy[index] = e.target.value;
                  change(field.key, copy);
                }}
              />
            ))}

            <button
              className="text-blue-500 text-xs mt-2"
              onClick={() => change(field.key, [...(value || []), "New Option"])}
            >
              + Add Option
            </button>
          </div>
        );


        case "select":
  return (
    <div className="mt-3" key={field.key}>
      <label className="text-sm font-medium">{field.label}</label>
      <select
        className="w-full border p-2 rounded mt-1"
        value={value}
        onChange={(e) => change(field.key, e.target.value)}
      >
        {field.options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );

  case "radio":
  if (step.settings.mode !== "quiz") return null;

  return (
    <div className="mt-4" key={field.key}>
      <label className="text-sm font-semibold">
        Correct Answer
      </label>

      <div className="mt-2 space-y-2">
        {(step.settings.options || []).map((opt, index) => (
          <label
            key={index}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              checked={value === index}
              onChange={() => change(field.key, index)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );


      /* -------------------
         RICH TEXT
      ------------------- */
      case "richtext":
        return (
          <div className="mt-3" key={field.key}>
            <label className="text-sm font-medium">{field.label}</label>

            <div className="flex gap-2 bg-gray-100 border border-gray-200 p-2 mt-1">
              <button onClick={() => document.execCommand("bold")}>
                <Bold className="w-4 h-4" />
              </button>
              <button onClick={() => document.execCommand("italic")}>
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) document.execCommand("createLink", false, url);
                }}
              >
                <Link className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={editorRef}
              contentEditable
              className="w-full h-24 bg-white border-gray-200 border p-2 rounded mt-1"
              dangerouslySetInnerHTML={{ __html: value }}
              onInput={(e) =>
                change(field.key, e.currentTarget.innerHTML)
              }
            />
          </div>
        );

      /* ------------------------------------------------------
              CONTACT FIELDS (USED IN MultiSection / ContactForm)
      ------------------------------------------------------- */
      case "contact-fields":
        return (
          <div className="mt-5 space-y-3" key={field.key}>
            <h3 className="text-sm font-semibold text-gray-700">
              Form Fields
            </h3>

            {step.settings.fields.map((f, index) => {
              const isOpen = expandedField === index;

              return (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden group"
                >
                  {/* Row Header */}
                  <div className="flex justify-between p-3 bg-gray-50">
                    <div className="font-medium text-sm">{f.label}</div>

                    <div className="flex gap-2">
                      {/* Hide */}  
                      <button
                        onClick={() => {
                          const arr = [...step.settings.fields];
                          arr[index].hidden = !arr[index].hidden;
                          change("fields", arr);
                        }}
                      >
                        {f.hidden ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      {/* Expand Settings */}
                      <button
                        onClick={() =>
                          setExpandedField(isOpen ? null : index)
                        }
                      >
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <Settings className="w-4 h-4" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          const arr = [...step.settings.fields];
                          arr.splice(index, 1);
                          change("fields", arr);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Settings */}
                  {isOpen && (
                    <div className="p-3 space-y-3 bg-white border-t">
                      {/* Field Label */}
                      <div>
                        <label className="text-xs text-gray-600">
                          Label
                        </label>
                        <input
                          className="w-full p-2 border rounded"
                          value={f.label}
                          onChange={(e) => {
                            const arr = [...step.settings.fields];
                            arr[index].label = e.target.value;
                            change("fields", arr);
                          }}
                        />
                      </div>

                      {/* Placeholder */}
                      <div>
                        <label className="text-xs text-gray-600">
                          Placeholder
                        </label>
                        <input
                          className="w-full p-2 border rounded"
                          value={f.placeholder || ""}
                          onChange={(e) => {
                            const arr = [...step.settings.fields];
                            arr[index].placeholder = e.target.value;
                            change("fields", arr);
                          }}
                        />
                      </div>

                      {/* Required Toggle */}
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">Required</span>
                        <input
                          type="checkbox"
                          checked={f.required}
                          onChange={(e) => {
                            const arr = [...step.settings.fields];
                            arr[index].required = e.target.checked;
                            change("fields", arr);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Field */}
            <button
              className="w-full border-2 border-dashed p-3 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600"
              onClick={() => {
                change("fields", [
                  ...step.settings.fields,
                  {
                    key: `f-${nanoid(5)}`,
                    label: "New Field",
                    type: "text",
                    placeholder: "",
                    required: false,
                    hidden: false
                  }
                ]);
              }}
            >
              + Add New Field
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {meta.settingsFields.map((f) => renderField(f))}
    </div>
  );
}
