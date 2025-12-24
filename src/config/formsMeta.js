import Intro from "@/components/blocks/Intro";
import ShortText from "@/components/blocks/ShortText";
import SingleSelect from "@/components/blocks/SingleSelect";
import ThankYou from "@/components/blocks/Thankyou";

import ContactForm from "@/components/blocks/ContactForm";
import MultiSection from "@/components/blocks/MultiSection";
import LongText from "@/components/blocks/LongText";

import PhoneInput from "@/components/blocks/PhoneInput";
import WebsiteUrl from "@/components/blocks/WebsiteUrl";
import NumberField from "@/components/blocks/NumberField";
import DateField from "@/components/blocks/DateField";
import StarRating from "@/components/blocks/StarRating";
import Dropdown from "@/components/blocks/Dropdown";
import AddressField from "@/components/blocks/AddressField";

export const FORM_META = {

  /* ------------------------ INTRO ------------------------ */

  intro: {
    label: "Intro",
    icon: "FileText",
    color: "bg-[#FDA5D5]",
    component: Intro,
    default: {
      title: "Welcome! 👋",
      description: "Let's get started."
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
      { key: "description", type: "richtext", label: "Description" },
      { key: "nextText", type: "text", label: "Next Button Text" }

    ]
  },

  /* ------------------------ INPUT FIELDS ------------------------ */

  shortText: {
    label: "Short Text",
    icon: "Type",
    color: "bg-[#D5C7ED]",
    component: ShortText,
    default: {
      title: "Your answer",
      description: "Type here....",
      required: false
    },
    settingsFields: [
            { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "placeholder", type: "text", label: "Placeholder" },

      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },
select: {
  label: "Single Select",
  icon: "Check",
  color: "bg-[#7BF1A8]",
  component: SingleSelect,
  default: {
    title: "Question?",
    description: "",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    mode: "select", // 👈 NEW ("select" | "quiz")
    correctAnswer: null // 👈 index (number)
  },
  settingsFields: [
    { key: "title", type: "text", label: "Title" },
    { key: "description", type: "richtext", label: "Description" },
    { key: "options", type: "list", label: "Options" },

    {
      key: "mode",
      type: "select",
      label: "Question Mode",
      options: [
        { label: "Normal Select", value: "select" },
        { label: "Quiz (Correct Answer)", value: "quiz" }
      ]
    },

    {
      key: "correctAnswer",
      type: "radio",
      label: "Correct Answer (Quiz Only)"
    },

    { key: "nextText", type: "text", label: "Next Button Text" }
  ]
}
,
  longText: {
    label: "Long Text",
    icon: "AlignLeft",
    color: "bg-[#FFA2A2]",
    component: LongText,
    default: {
      title: "Your message",
      description: "",
      placeholder: "Write details here...",
      required: false
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "placeholder", type: "text", label: "Placeholder" },
      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  number: {
    label: "Number Input",
    icon: "Hash",
    color: "bg-orange-200",
    component: NumberField,
    default: {
      title: "Enter a number",
      description: "",

      placeholder: "1234",
      required: false
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "placeholder", type: "text", label: "Placeholder" },
      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  websiteurl: {
    label: "Website URL",
    icon: "Globe",
    color: "bg-sky-200",
    component: WebsiteUrl,
    default: {
      title: "Website URL",
      description: "",

      placeholder: "https://example.com",
      required: false
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "placeholder", type: "text", label: "Placeholder" },
      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  phoneNumber: {
    label: "Phone Number",
    icon: "Phone",
    color: "bg-purple-200",
    component: PhoneInput,
    default: {
      title: "Phone Number",
      description: "",

      placeholder: "Enter phone number",
      countryCode: "+1",
      required: false
    },
    settingsFields: [
      { key: "label", type: "text", label: "Label" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "placeholder", type: "text", label: "Placeholder" },
      { key: "countryCode", type: "text", label: "Country Code" },
      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  date: {
    label: "Date Picker",
    icon: "Calendar",
    color: "bg-teal-200",
    component: DateField,
    default: {
      title: "Select a date",
      description: "",

      required: false
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  star: {
    label: "Star Rating",
    icon: "Star",
    color: "bg-amber-200",
    component: StarRating,
    default: {
      title: "Rate your experience ⭐",
      description: ""

    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  dropdown: {
    label: "Dropdown",
    icon: "ChevronDown",
    color: "bg-green-200",
    component: Dropdown,
    default: {
      title: "Choose an option",
      description: "",
      options: ["Option 1", "Option 2"],
      required: false
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
            { key: "description", type: "richtext", label: "Description" },

      { key: "options", type: "list", label: "Options" },
      { key: "required", type: "checkbox", label: "Required?" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  /* ------------------------ COMPLEX BLOCKS ------------------------ */

  contact: {
    label: "Contact Form",
    icon: "Contact",
    color: "bg-indigo-200",
    component: ContactForm,
    default: {
      title: "Contact Details",
      description: "Please fill in the information",
      fields: [
        { key: "firstname", label: "First Name", type: "text", required: true },
        { key: "lastname", label: "Last Name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "phone", required: false, countryCode: "+91" },
        { key: "company", label: "Company", type: "text", required: false },
      ]
    },
    settingsFields: [
      { key: "title", type: "text", label: "Form Title" },
      { key: "description", type: "richtext", label: "Form Description" },
      { key: "fields", type: "contact-fields", label: "Fields" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  address: {
    label: "Address",
    icon: "MapPin",
    color: "bg-red-200",
    component: AddressField,
    default: {
      title: "Address Details",
      description: "",
      fields: [
        { key: "line1", label: "Address Line 1", type: "text", required: true },
        { key: "line2", label: "Address Line 2", type: "text" },
        { key: "city", label: "City", type: "text", required: true },
        { key: "state", label: "State", type: "text", required: true },
        { key: "zip", label: "ZIP Code", type: "number", required: true },
        { key: "country", label: "Country", type: "text", required: true }
      ]
    },
    settingsFields: [
      { key: "title", type: "text", label: "Form Title" },
      { key: "description", type: "richtext", label: "Description" },
      { key: "fields", type: "contact-fields", label: "Fields" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  },

  /* ------------------------ THANK YOU ------------------------ */

  thankyou: {
    label: "Thank You",
    icon: "Smile",
    color: "bg-rose-200",
    component: ThankYou,
    default: {
      title: "Thank you!",

      description: "Form submitted successfully 🎉"
    },
    settingsFields: [
      { key: "title", type: "text", label: "Title" },
      { key: "description", type: "richtext", label: "Description" },
      { key: "nextText", type: "text", label: "Next Button Text" }
    ]
  }
};
