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
  ChevronUp
} from "lucide-react";
import { uploadImage } from "@/utlis/uploadImage";

export default function SettingsPanel({ step, updateSettings }) {
  const [expandedField, setExpandedField] = useState(null);
  const editorRef = useRef(null);

  if (!step) return null;

  const meta = FORM_META[step.type];
  if (!meta || !meta.settingsFields) return null;

  const change = (key, value) => {
    updateSettings(key, value);
  };

  /* =====================================================
      FIELD RENDERER (TYPEFORM STYLE)
  ===================================================== */
  const renderField = (field) => {
    const value = step.settings[field.key];

    switch (field.type) {
      /* ---------------- TEXT ---------------- */
      case "text":
        return (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {field.label}
            </label>
            <input
              value={value || ""}
              placeholder="Type here…"
              onChange={(e) => change(field.key, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                         bg-white text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      /* ---------------- CHECKBOX ---------------- */
      case "checkbox":
        return (
          <div
            key={field.key}
            className="flex items-center justify-between bg-white border rounded-xl px-4 py-3"
          >
            <span className="text-sm font-medium text-gray-700">
              {field.label}
            </span>
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => change(field.key, e.target.checked)}
            />
          </div>
        );

      /* ---------------- SELECT ---------------- */
      case "select":
        return (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {field.label}
            </label>
            <select
              value={value}
              onChange={(e) => change(field.key, e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                         bg-white text-sm focus:ring-2 focus:ring-blue-500"
            >
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      /* ---------------- OPTIONS LIST ---------------- */
      case "list":
        return (
          <div key={field.key} className="space-y-3">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {field.label}
            </label>

            <div className="space-y-2">
              {(value || []).map((opt, index) => {
                const option =
                  typeof opt === "string"
                    ? { label: opt, image: "" }
                    : opt;

                return (
                  <div
                    key={index}
                    className="group flex items-center gap-3 p-3 rounded-xl
                               border bg-white hover:border-blue-400 transition"
                  >
                    {/* IMAGE */}
                    <label className="cursor-pointer">
                      <div className="w-14 h-14 rounded-lg border bg-gray-100 overflow-hidden flex items-center justify-center">
                        {option.image ? (
                          <img
                            src={option.image}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">
                            Image
                          </span>
                        )}
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const imageUrl = await uploadImage(file);
                          const copy = [...value];
                          copy[index] = { ...option, image: imageUrl };
                          change(field.key, copy);
                        }}
                      />
                    </label>

                    {/* TEXT */}
                    <input
                      value={option.label}
                      placeholder={`Option ${index + 1}`}
                      onChange={(e) => {
                        const copy = [...value];
                        copy[index] = {
                          ...option,
                          label: e.target.value
                        };
                        change(field.key, copy);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200
                                 text-sm focus:ring-2 focus:ring-blue-500"
                    />

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        const copy = value.filter((_, i) => i !== index);
                        change(field.key, copy);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition
                                 text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() =>
                change(field.key, [
                  ...(value || []),
                  { label: "", image: "" }
                ])
              }
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Add option
            </button>
          </div>
        );

      /* ---------------- QUIZ CORRECT ANSWER ---------------- */
      case "radio":
        if (step.settings.mode !== "quiz") return null;

        return (
          <div key={field.key} className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Correct answer
            </label>

            <div className="space-y-2">
              {(step.settings.options || []).map((opt, index) => {
                const option =
                  typeof opt === "string"
                    ? { label: opt, image: "" }
                    : opt;

                return (
                  <label
                    key={index}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer
                      ${
                        value === index
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-blue-400"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      checked={value === index}
                      onChange={() => change(field.key, index)}
                    />
                    <span className="text-sm">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );

      /* ---------------- RICH TEXT ---------------- */
      case "richtext":
        return (
          <div key={field.key} className="space-y-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {field.label}
            </label>

            <div className="flex gap-2 p-2 bg-white border rounded-xl">
              <button onClick={() => document.execCommand("bold")}>
                <Bold className="w-4 h-4" />
              </button>
              <button onClick={() => document.execCommand("italic")}>
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url)
                    document.execCommand("createLink", false, url);
                }}
              >
                <Link className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={editorRef}
              contentEditable
              className="min-h-[90px] px-4 py-3 rounded-xl border bg-white text-sm"
              dangerouslySetInnerHTML={{ __html: value }}
              onInput={(e) =>
                change(field.key, e.currentTarget.innerHTML)
              }
            />
          </div>
        );

      /* ---------------- CONTACT FIELDS ---------------- */
      case "contact-fields":
        return (
          <div key={field.key} className="space-y-3">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              Form fields
            </label>

            {step.settings.fields.map((f, index) => {
              const open = expandedField === index;

              return (
                <div
                  key={index}
                  className="rounded-xl border bg-white overflow-hidden"
                >
                  <div className="flex justify-between items-center p-3 bg-gray-100">
                    <span className="text-sm font-medium">
                      {f.label}
                    </span>

                    <div className="flex gap-2">
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

                      <button
                        onClick={() =>
                          setExpandedField(open ? null : index)
                        }
                      >
                        <ChevronUp
                          className={`w-4 h-4 transition ${
                            open ? "" : "rotate-180"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => {
                          const arr = [...step.settings.fields];
                          arr.splice(index, 1);
                          change("fields", arr);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {open && (
                    <div className="p-4 space-y-3">
                      <input
                        value={f.label}
                        onChange={(e) => {
                          const arr = [...step.settings.fields];
                          arr[index].label = e.target.value;
                          change("fields", arr);
                        }}
                        className="w-full px-3 py-2 rounded-lg border"
                      />

                      <input
                        value={f.placeholder || ""}
                        placeholder="Placeholder"
                        onChange={(e) => {
                          const arr = [...step.settings.fields];
                          arr[index].placeholder = e.target.value;
                          change("fields", arr);
                        }}
                        className="w-full px-3 py-2 rounded-lg border"
                      />

                      <div className="flex justify-between text-sm">
                        Required
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

            <button
              className="w-full border-2 border-dashed rounded-xl py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600"
              onClick={() =>
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
                ])
              }
            >
              + Add field
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  /* ===================================================== */

  return (
    <div className="bg-gray-50 rounded-2xl p-5 space-y-6">
      <div className="text-xs font-semibold text-gray-500 tracking-widest uppercase">
        Question settings
      </div>

      <div className="space-y-5">
        {meta.settingsFields.map((f) => renderField(f))}
      </div>
    </div>
  );
}
