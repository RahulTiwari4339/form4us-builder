import React, { useState, useEffect } from 'react';
import {
  Menu, CheckCircle2, ArrowRight, Zap, Palette,
  Shield, BarChart3, Plus, Settings, Globe,
  Type, MessageSquare, ChevronRight, X, Play,
  Layout, MousePointer2, Slack, Github, Database,
  Layers, Cloud, Mail, CreditCard, Send,
  Star, Info, Minus, PlusCircle, FileText, Check,
  AlignLeft, Hash, Phone, Calendar, User, MapPin, Smile,
  ChevronDown, Contact
} from 'lucide-react';

// Actual Form JSON provided by the user
const FORM_JSON = [
  {
    "key": "intro-TyQ0",
    "type": "intro",
    "label": "Intro",
    "icon": "FileText",
    "color": "bg-pink-300",
    "settings": {
      "title": "Welcome! 👋",
      "description": "Let's get started."
    }
  },
  {
    "key": "select-ms3_",
    "type": "select",
    "label": "Single Select",
    "icon": "Check",
    "color": "bg-[#7BF1A8]",
    "settings": {
      "title": "Which do you prefer? 👇",
      "options": ["Option 1", "Option 2"]
    }
  },
  {
    "key": "longText-MS6G",
    "type": "longText",
    "label": "Long Text",
    "icon": "AlignLeft",
    "color": "bg-[#FFA2A2]",
    "settings": {
      "label": "Your message",
      "placeholder": "Write details here...",
      "required": false
    }
  },
  {
    "key": "number-Ct8k",
    "type": "number",
    "label": "Number Input",
    "icon": "Hash",
    "color": "bg-orange-200",
    "settings": {
      "label": "Enter a number",
      "placeholder": "1234",
      "required": false
    }
  },
  {
    "key": "websiteurl-96Qo",
    "type": "websiteurl",
    "label": "Website URL",
    "icon": "Globe",
    "color": "bg-sky-200",
    "settings": {
      "label": "Website URL",
      "placeholder": "https://example.com",
      "required": false
    }
  },
  {
    "key": "phoneNumber-Jxgq",
    "type": "phoneNumber",
    "label": "Phone Number",
    "icon": "Phone",
    "color": "bg-purple-200",
    "settings": {
      "label": "Phone Number",
      "placeholder": "Enter phone number",
      "countryCode": "+1",
      "required": false
    }
  },
  {
    "key": "date-ID3b",
    "type": "date",
    "label": "Date Picker",
    "icon": "Calendar",
    "color": "bg-teal-200",
    "settings": {
      "label": "Select a date",
      "required": false
    }
  },
  {
    "key": "star-xeha",
    "type": "star",
    "label": "Star Rating",
    "icon": "Star",
    "color": "bg-amber-200",
    "settings": {
      "label": "Rate your experience ⭐"
    }
  },
  {
    "key": "dropdown-eaTQ",
    "type": "dropdown",
    "label": "Dropdown",
    "icon": "ChevronDown",
    "color": "bg-green-200",
    "settings": {
      "label": "Choose an option",
      "options": ["Option 1", "Option 2"],
      "required": false
    }
  },
  {
    "key": "contact-k-2Y",
    "type": "contact",
    "label": "Contact Form",
    "icon": "Contact",
    "color": "bg-indigo-200",
    "settings": {
      "title": "Contact Details",
      "description": "Please fill in the information",
      "fields": [
        { "key": "firstname", "label": "First Name", "type": "text", "required": true },
        { "key": "lastname", "label": "Last Name", "type": "text", "required": true },
        { "key": "email", "label": "Email", "type": "email", "required": true }
      ]
    }
  },
  {
    "key": "thankyou-h2Vm",
    "type": "thankyou",
    "label": "Thank You",
    "icon": "Smile",
    "color": "bg-pink-300",
    "settings": {
      "title": "Thank you!",
      "description": "Form submitted successfully 🎉"
    }
  }
];

const ICON_MAP = {
  FileText: <FileText size={14} />,
  Check: <Check size={14} />,
  AlignLeft: <AlignLeft size={14} />,
  Hash: <Hash size={14} />,
  Globe: <Globe size={14} />,
  Phone: <Phone size={14} />,
  Calendar: <Calendar size={14} />,
  Star: <Star size={14} />,
  ChevronDown: <ChevronDown size={14} />,
  Contact: <Contact size={14} />,
  Smile: <Smile size={14} />,
  MapPin: <MapPin size={14} />
};

/**
 * Step Content Renderer Logic (provided by user)
 */
function MockStepRenderer({ step, theme, onNext, onSelect }) {
  const s = step.settings || {};
  const title = s.title || s.label || step.label;

  switch (step.type) {
    case "intro":
      return (
        <div className="space-y-4 max-w-sm">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">{title}</h1>
          <p className="text-slate-500 font-medium">{s.description}</p>
          <button onClick={onNext} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 group">
            Start <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      );
    case "select":
    case "dropdown":
      return (
        <div className="space-y-6 max-w-sm">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <div className="space-y-2">
            {s.options?.map((opt, i) => (
              <div key={i} onClick={() => onSelect(opt)} className="p-4 rounded-xl border-2 border-slate-100 font-bold text-slate-400 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer transition-all flex justify-between items-center group">
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center text-[10px] group-hover:border-emerald-300">{String.fromCharCode(65+i)}</span>
                  {opt}
                </span>
                <div className="opacity-0 group-hover:opacity-100 text-emerald-500"><CheckCircle2 size={16} /></div>
              </div>
            ))}
          </div>
        </div>
      );
    case "star":
      return (
        <div className="space-y-6 max-w-sm text-center">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5].map(n => <Star key={n} size={32} className="text-amber-400 fill-amber-400" />)}
          </div>
        </div>
      );
    case "thankyou":
      return (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-4">
            <Smile size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900">{title}</h1>
          <p className="text-slate-500 font-medium">{s.description}</p>
        </div>
      );
    default:
      return (
        <div className="space-y-6 max-w-sm">
          <h2 className="text-2xl font-black text-slate-900">{title}</h2>
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400 font-bold text-center">
            {step.label} Placeholder
          </div>
          <button onClick={onNext} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Continue</button>
        </div>
      );
  }
}

/**
 * Header Component
 */
const Header = ({ isMenuOpen, setIsMenuOpen, goToApp }) => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-emerald-600 p-2 rounded-lg transition-all">
              <div className="w-5 h-3 border-2 border-white rounded-sm flex items-center justify-center">
                <div className="w-2 h-0.5 bg-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Form4us</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {['Product', 'Templates', 'Pricing', 'Resources'].map((item) => (
              <a key={item} href="#" className="text-slate-600 font-medium hover:text-emerald-600 transition-all">{item}</a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={goToApp} className="hidden md:block text-slate-600 font-semibold px-4 py-2 hover:text-slate-900 transition-all">Sign In</button>
            <button onClick={goToApp} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">Get Started Free</button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600">{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col gap-6 animate-in fade-in slide-in-from-top-10 duration-200">
           {['Product', 'Templates', 'Pricing', 'Resources'].map((item) => (
            <a key={item} href="#" className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">{item}</a>
          ))}
          <button onClick={goToApp} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold mt-4">Create Account</button>
        </div>
      )}
    </>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(1); // Default to Single Select for visual impact
  const [mockAnswer, setMockAnswer] = useState(null);

  const APP_URL = "https://app.form4us.com";
  const goToApp = () => window.location.href = APP_URL;

  useEffect(() => {
    document.title = "Form4us - Modern Online Form Builder";
  }, []);

  const features = [
    { icon: <Zap />, title: "Logic Jumps", desc: "Show or hide questions based on previous answers for a personalized experience." },
    { icon: <Palette />, title: "Full Branding", desc: "Customize colors, fonts, and domains to match your brand identity perfectly." },
    { icon: <Shield />, title: "Enterprise Security", desc: "Data encryption, GDPR compliance, and secure servers for your peace of mind." },
    { icon: <BarChart3 />, title: "Real-time Insights", desc: "Visual analytics to understand user behavior and conversion rates." },
    { icon: <Layout />, title: "Native Integrations", desc: "Connect with Slack, Notion, Google Sheets, and 5000+ apps via Zapier." },
    { icon: <Globe />, title: "Custom Domains", desc: "Publish forms on your own subdomain like forms.yourbrand.com." }
  ];

  return (
    <div className="min-h-screen w-full font-sans text-slate-900 bg-white overflow-x-hidden pt-20">
      
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} goToApp={goToApp} />

      {/* --- Hero Section --- */}
      <section className="relative pt-24 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold mb-8 hover:bg-slate-100 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              New: Direct JSON Schema Importer v2.0
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
              The Typeform alternative <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">that's actually free.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
              Stop paying for limits. Get unlimited forms, unlimited responses, and advanced logic for $0/mo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
              <button onClick={goToApp} className="bg-slate-900 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group">
                Get Started Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={goToApp} className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Play size={20} fill="currentColor" /> See It In Action
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-slate-400 font-bold text-sm">
              <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> No Credit Card</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-500" /> Unlimited Responses</div>
            </div>
          </div>

          {/* --- Realistic Product UI Mockup (Derived from User JSON) --- */}
          <div className="relative max-w-6xl mx-auto">
            <div className="rounded-3xl border-8 border-slate-900/5 bg-slate-900/5 p-2 md:p-4 backdrop-blur-sm shadow-inner">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9] lg:aspect-[21/9]">
                <div className="w-full h-full flex flex-col">
                  {/* Browser Bar */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-md px-4 py-1.5 text-[10px] text-slate-400 font-mono shadow-sm">
                      app.form4us.com/editor/form-U4Yts5lw
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold tracking-tight">LIVE</div>
                      <Settings size={14} className="text-slate-300" />
                    </div>
                  </div>
                  
                  {/* Builder Interface */}
                  <div className="flex-1 flex bg-white relative overflow-hidden">
                    {/* Left Sidebar: Form Steps (JSON-driven) */}
                    <div className="hidden md:flex w-52 border-r border-slate-100 flex-col py-4 bg-slate-50/50">
                       <div className="px-4 mb-4 flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Form Content</span>
                         <PlusCircle size={14} className="text-emerald-500 cursor-pointer" />
                       </div>
                       <div className="flex-1 overflow-y-auto px-2 space-y-1">
                         {FORM_JSON.map((step, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => setActiveStepIndex(idx)}
                             className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer group
                             ${activeStepIndex === idx ? 'bg-white shadow-md border border-slate-200 text-slate-900' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                           >
                             <div className={`${step.color} w-6 h-6 rounded-lg flex items-center justify-center text-slate-700 shadow-sm transition-transform group-hover:scale-110`}>
                               {ICON_MAP[step.icon]}
                             </div>
                             <span className="truncate">{step.label}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                    
                    {/* Main Canvas Area: Visual Renderer */}
                    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 relative">
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-200 uppercase tracking-widest">Preview Mode</div>
                      
                      <div className="w-full max-w-sm transition-all duration-500">
                        <MockStepRenderer 
                          step={FORM_JSON[activeStepIndex]} 
                          onNext={() => setActiveStepIndex((activeStepIndex + 1) % FORM_JSON.length)}
                          onSelect={(val) => setMockAnswer(val)}
                        />
                      </div>

                      {/* Floating Indicator */}
                      <div className="absolute bottom-10 right-10 bg-white border border-slate-200 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float hidden xl:flex">
                        <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-200"><Zap size={18} fill="currentColor" /></div>
                        <div>
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Logic Applied</div>
                          <div className="text-[12px] font-bold text-slate-800 italic">Jump to Step 5 if Option 1</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Fields Palette */}
                    <div className="hidden lg:flex w-56 border-l border-slate-100 flex-col py-4 bg-white">
                      <div className="px-4 mb-4">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Field Palette</span>
                       </div>
                       <div className="px-3 space-y-2">
                         {[
                           { label: "Phone Number", icon: <Phone size={12}/>, color: "bg-purple-100" },
                           { label: "Date Picker", icon: <Calendar size={12}/>, color: "bg-teal-100" },
                           { label: "Address Box", icon: <MapPin size={12}/>, color: "bg-red-100" },
                           { label: "Dropdown Menu", icon: <ChevronDown size={12}/>, color: "bg-green-100" },
                         ].map((item, i) => (
                           <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-500 bg-slate-50/50 hover:bg-slate-50 cursor-grab active:cursor-grabbing transition-colors">
                             <div className={`${item.color} w-6 h-6 rounded-lg flex items-center justify-center text-slate-600`}>{item.icon}</div>
                             {item.label}
                           </div>
                         ))}
                       </div>
                       
                       <div className="mt-auto px-4 pt-4 border-t border-slate-50">
                         <div className="bg-slate-900 rounded-2xl p-4 text-white">
                           <div className="text-[8px] font-black text-slate-500 uppercase mb-2">Editor Theme</div>
                           <div className="flex items-center justify-between">
                             <span className="text-[11px] font-bold">Modern Emerald</span>
                             <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white/20" />
                           </div>
                         </div>
                       </div>
                    </div>
                    
                    {/* Fake Cursor */}
                    <div className="absolute bottom-[20%] right-[30%] hidden lg:block animate-pulse-slow">
                      <MousePointer2 className="fill-slate-900 text-white w-10 h-10 drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-emerald-600/10 blur-[100px] opacity-40 rounded-full" />
          </div>
        </div>
      </section>

      {/* --- Rest of landing page remains consistent --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <span className="text-emerald-600 font-bold uppercase tracking-widest text-sm block mb-4">Intelligent Flows</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">Forms that adapt to <br /> your users.</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">Use advanced logic to create conversational experiences. Skip irrelevant questions, calculate scores, and redirect users to specific pages based on their answers.</p>
              <ul className="space-y-4">
                {["Branching & Skip Logic", "Multiple ending pages", "Recall information from previous answers"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-semibold text-slate-700">
                    <div className="bg-emerald-100 p-1 rounded-full"><CheckCircle2 size={16} className="text-emerald-600" /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full lg:w-1/2 bg-slate-50 rounded-[40px] p-8 md:p-12 shadow-inner border border-slate-100">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-200" /><div className="w-3 h-3 rounded-full bg-emerald-500" /><div className="w-3 h-3 rounded-full bg-slate-200" /></div>
                  <Zap size={20} className="text-emerald-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">What's your primary goal?</h3>
                <div className="space-y-3">
                  {['Product Feedback', 'Customer Research', 'Lead Gen'].map(opt => (
                    <button key={opt} className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all font-semibold">{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Comparison Table --- */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Why switch to Form4us?</h2>
          <p className="text-slate-400 text-lg">See how we compare to the expensive alternatives.</p>
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/5 rounded-3xl overflow-hidden border border-white/10">
            <div className="grid grid-cols-3 p-6 border-b border-white/10 bg-white/5">
              <div className="font-bold text-slate-400 uppercase text-xs tracking-widest">Features</div>
              <div className="text-center font-bold text-emerald-400">Form4us</div>
              <div className="text-center font-bold text-slate-400">Typeform</div>
            </div>
            {[
              { f: "Unlimited Forms", a: true, b: false },
              { f: "Unlimited Submissions", a: true, b: false },
              { f: "Logic Jumps", a: true, b: "Paid" },
              { f: "Custom Domains", a: true, b: "Premium" },
              { f: "File Uploads", a: true, b: "Paid" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
                <div className="font-medium">{row.f}</div>
                <div className="flex justify-center">{row.a === true ? <CheckCircle2 className="text-emerald-500" /> : row.a}</div>
                <div className="flex justify-center text-slate-500 font-medium">{row.b === false ? <X className="text-red-400" /> : row.b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ Section --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is Form4us really free?", a: "Yes! Our core features are free, including unlimited forms and responses." },
              { q: "Can I migrate from Typeform?", a: "Absolutely. We have a 1-click importer that brings your logic jumps over automatically." },
              { q: "Is my data secure?", a: "Data security is our priority. All responses are encrypted following international standards." }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6">
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <div className="bg-emerald-600 p-1.5 rounded-md"><div className="w-4 h-3 border-2 border-white rounded-sm" /></div>
              <span className="text-xl font-bold text-slate-900">Form4us</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">The world's most flexible form builder. No limits, just results.</p>
          </div>
          {['Product', 'Compare', 'Company'].map(col => (
            <div key={col}>
              <h4 className="font-bold mb-6">{col}</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                <li>Integrations</li><li>Pricing</li><li>Templates</li>
              </ul>
            </div>
          ))}
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        html { scroll-behavior: smooth; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.95); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        ::selection { background: #10b981; color: white; }
      `}} />
    </div>
  );
}