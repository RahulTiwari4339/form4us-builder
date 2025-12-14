// components/RenderStep.jsx
import React from "react";
import { FORM_META } from "@/config/formsMeta";

export default function RenderStep({ step, updateSettings = () => {}, onNext = () => {}, designSettings = {} }) {
  if (!step) return null;
  const meta = FORM_META[step.type];
  if (!meta) return <div>Unknown step type: {step.type}</div>;

  const Component = meta.component;
  if (typeof Component !== "function") return <div>Component missing for {step.type}</div>;

  return <Component settings={step.settings} onSettingsChange={updateSettings} onNext={onNext} designSettings={designSettings} />;
}
