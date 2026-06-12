import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthModal } from "./components/AuthModal";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { 
  ACADEMIC_SERVICES, 
  SUBJECT_EXPERTISE, 
  INITIAL_PROJECTS, 
  INITIAL_TESTIMONIALS, 
  FAQS 
} from "./data";
import { 
  AcademicOrder, 
  Lead, 
  FeaturedProject, 
  Testimonial, 
  OrderStatus, 
  LeadStatus 
} from "./types";
import { db } from "./lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  where 
} from "firebase/firestore";
import { 
  Sparkles, 
  Send, 
  PhoneCall, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  BarChart3, 
  Plus, 
  Trash2, 
  Filter, 
  CornerDownRight, 
  UploadCloud, 
  X, 
  ShieldCheck, 
  HelpCircle, 
  FileCheck, 
  ArrowRight, 
  Users, 
  Award, 
  FolderGit2, 
  UserPlus, 
  Layers, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  Check, 
  ChevronDown, 
  Database,
  ExternalLink
} from "lucide-react";
import * as LucideIcons from "lucide-react";

// Helper components for loading and displaying matching icons dynamically
const SafeIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) return <Layers className={className} />;
  return <IconComponent className={className} />;
};

function MainAppContent() {
  const { user, userProfile, isAdmin, statusMessage, setStatus } = useAuth();
  
  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");

  // Admin Dashboard State Toggle
  const [adminOpen, setAdminOpen] = useState(false);

  // Firestore & Local Lists Data state
  const [orders, setOrders] = useState<AcademicOrder[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Active Admin Tab State
  const [adminTab, setAdminTab] = useState<"orders" | "leads" | "projects" | "testimonials" | "analytics">("analytics");

  // Instant Quote / Place Order Form State
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: ACADEMIC_SERVICES[0].title,
    academicLevel: "University Undergraduate (B.Tech)",
    projectType: "Programming Project & Lab Manual",
    deadline: "",
    budgetRange: "₹2,000 - ₹5,000",
    message: "",
    fileUrl: "",
    fileName: ""
  });
  const [fileLoading, setFileLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Contact Section Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  // Admin new project form state
  const [newProject, setNewProject] = useState({
    title: "",
    category: "Web Development",
    technologies: "",
    academicLevel: "B.Tech Undergraduate",
    gradeReceived: "A+ Distinction",
    featured: true
  });

  // Admin select specific filters
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [leadFilter, setLeadFilter] = useState<string>("all");

  // Load Firestore data or populate fallback defaults
  const fetchAllData = async () => {
    setLoadingData(true);
    try {
      // 1. Fetch Orders
      const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));
      const ordersList: AcademicOrder[] = [];
      ordersSnap.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as AcademicOrder);
      });
      setOrders(ordersList);

      // 2. Fetch Leads
      const leadsSnap = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc")));
      const leadsList: Lead[] = [];
      leadsSnap.forEach((doc) => {
        leadsList.push({ id: doc.id, ...doc.data() } as Lead);
      });
      setLeads(leadsList);

      // 3. Fetch Portfolio Projects
      const projectsSnap = await getDocs(collection(db, "projects"));
      const projectsList: FeaturedProject[] = [];
      projectsSnap.forEach((doc) => {
        projectsList.push({ id: doc.id, ...doc.data() } as FeaturedProject);
      });
      if (projectsList.length === 0) {
        // Seed default projects state locally if Firestore has none yet
        setProjects(INITIAL_PROJECTS);
      } else {
        setProjects(projectsList);
      }

      // 4. Fetch Testimonials
      const testimonialsSnap = await getDocs(collection(db, "testimonials"));
      const testimonialsList: Testimonial[] = [];
      testimonialsSnap.forEach((doc) => {
        testimonialsList.push({ id: doc.id, ...doc.data() } as Testimonial);
      });
      if (testimonialsList.length === 0) {
        setTestimonials(INITIAL_TESTIMONIALS);
      } else {
        setTestimonials(testimonialsList);
      }
    } catch (e) {
      console.error("Firestore loading offline or blocked. Initializing premium fallback states directly:", e);
      // Fallbacks to allow smooth preview work offline or during initial startup
      setProjects(INITIAL_PROJECTS);
      setTestimonials(INITIAL_TESTIMONIALS);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync user values if authenticated
  useEffect(() => {
    if (user) {
      setQuoteForm(prev => ({
        ...prev,
        email: user.email || "",
        name: userProfile?.displayName || user.displayName || ""
      }));
      setContactForm(prev => ({
        ...prev,
        email: user.email || "",
        name: userProfile?.displayName || user.displayName || ""
      }));
    }
  }, [user, userProfile]);

  // Handle Drag & Drop for attachments
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateFileUpload(file);
    }
  };

  const handleManualFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0]);
    }
  };

  // Drag and drop simulator conversion to storage metadata representation
  const simulateFileUpload = (file: File) => {
    setFileLoading(true);
    // Convert to base64 representation to simulate live secure transmission
    const reader = new FileReader();
    reader.onloadend = () => {
      setQuoteForm(prev => ({
        ...prev,
        fileName: file.name,
        fileUrl: reader.result as string // Simulates encoded URL payload
      }));
      setFileLoading(false);
      setStatus(`Requirement document "${file.name}" attached successfully!`, "success");
    };
    reader.onerror = () => {
      setFileLoading(false);
      setStatus("Error reading attachment file. Try again.", "error");
    };
    reader.readAsDataURL(file);
  };

  // Submit Order / Request Quote
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.email) {
      setStatus("Please provide your name and email to proceed.", "error");
      return;
    }

    try {
      const newOrder: Omit<AcademicOrder, 'id'> = {
        userId: user?.uid || "guest",
        name: quoteForm.name,
        email: quoteForm.email,
        phone: quoteForm.phone,
        subject: quoteForm.subject,
        academicLevel: quoteForm.academicLevel,
        projectType: quoteForm.projectType,
        deadline: quoteForm.deadline || "Within 7 Days",
        budgetRange: quoteForm.budgetRange,
        message: quoteForm.message,
        fileName: quoteForm.fileName || undefined,
        fileUrl: quoteForm.fileUrl || undefined,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "orders"), newOrder);
      
      // Update local state instantly and scroll/notify
      const createdOrder: AcademicOrder = { id: docRef.id, ...newOrder };
      setOrders(prev => [createdOrder, ...prev]);

      setStatus("Your academic requirement briefing was dispatched! Our team will contact you via email & WhatsApp within 10 minutes.", "success");
      
      // Reset form variables
      setQuoteForm({
        name: userProfile?.displayName || "",
        email: user?.email || "",
        phone: "",
        subject: ACADEMIC_SERVICES[0].title,
        academicLevel: "University Undergraduate (B.Tech)",
        projectType: "Programming Project & Lab Manual",
        deadline: "",
        budgetRange: "₹2,000 - ₹5,000",
        message: "",
        fileUrl: "",
        fileName: ""
      });

      // Scroll to confirmation view space
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });

    } catch (err) {
      console.error(err);
      setStatus("Error booking project. Please check connectivity or email our consultant directly.", "error");
    }
  };

  // Contact Form Submission (Leads Collection)
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setStatus("Please fill out all required contact fields.", "error");
      return;
    }

    try {
      const newLead: Omit<Lead, 'id'> = {
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        subject: contactForm.subject || "Academic Solutions General Enquiry",
        message: contactForm.message,
        status: "new",
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "leads"), newLead);
      const createdLead: Lead = { id: docRef.id, ...newLead };
      setLeads(prev => [createdLead, ...prev]);

      setStatus("Message recorded successfully. Executive team will reply to you shortly.", "success");
      setContactForm({
        name: userProfile?.displayName || "",
        email: user?.email || "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error(err);
      setStatus("Error transmitting enquiry. Please try again or direct-mail us.", "error");
    }
  };

  // Admin: Update Academic Order Status
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { 
        status: nextStatus,
        updatedAt: new Date().toISOString()
      });
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus, updatedAt: new Date().toISOString() } : o));
      setStatus(`Order ${orderId.slice(0,6)} successfully shifted to ${nextStatus}`, "success");
    } catch (err) {
      console.error(err);
      setStatus("Failed updating status catalog on database", "error");
    }
  };

  // Admin: Save customized Quoted Price and Notes
  const handleSaveOrderQuote = async (orderId: string, quotePrice: number, adminNotes: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { 
        quotedPrice: quotePrice, 
        adminNotes: adminNotes,
        updatedAt: new Date().toISOString()
      });
      
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, quotedPrice: quotePrice, adminNotes: adminNotes, updatedAt: new Date().toISOString() } : o));
      setStatus(`Quoted parameters locked in for order reference ${orderId.slice(0,6)}!`, "success");
    } catch (err) {
      console.error(err);
      setStatus("Failed updating parameters on cloud database", "error");
    }
  };

  // Admin: Update Contact Lead Status
  const handleUpdateLeadStatus = async (leadId: string, nextStatus: LeadStatus) => {
    try {
      const leadRef = doc(db, "leads", leadId);
      await updateDoc(leadRef, { status: nextStatus });
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: nextStatus } : l));
      setStatus(`Lead resolved status marked as ${nextStatus}`, "success");
    } catch (err) {
      console.error(err);
      setStatus("Could not update lead status on Firebase", "error");
    }
  };

  // Admin: Delete Order Record
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Verify: Are you absolutely certain you want to purge this academic order?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setStatus("Order requirement data removed securely", "success");
    } catch (err) {
      console.error(err);
      setStatus("Failed to execute data deletion process", "error");
    }
  };

  // Admin: Delete Lead Record
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Purge lead request?")) return;
    try {
      await deleteDoc(doc(db, "leads", leadId));
      setLeads(prev => prev.filter(l => l.id !== leadId));
      setStatus("Lead message discarded", "success");
    } catch (err) {
      console.error(err);
      setStatus("Lead write operations failed", "error");
    }
  };

  // Admin: Add custom Project Showcase
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.technologies) {
      setStatus("All main project catalog values are required", "error");
      return;
    }

    try {
      const technologiesArray = newProject.technologies.split(",").map(t => t.trim());
      const payload: Omit<FeaturedProject, 'id'> = {
        title: newProject.title,
        category: newProject.category,
        technologies: technologiesArray,
        academicLevel: newProject.academicLevel,
        gradeReceived: newProject.gradeReceived,
        featured: newProject.featured,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, "projects"), payload);
      const created: FeaturedProject = { id: docRef.id, ...payload };
      setProjects(prev => [created, ...prev]);

      setStatus("Successfully added new showcased project to client portfolio section!", "success");
      setNewProject({
        title: "",
        category: "Web Development",
        technologies: "",
        academicLevel: "B.Tech Undergraduate",
        gradeReceived: "A+ Distinction",
        featured: true
      });
    } catch (err) {
      console.error(err);
      // Fallback local append if offline
      const mockProj: FeaturedProject = {
        id: "mock_" + Date.now(),
        title: newProject.title,
        category: newProject.category,
        technologies: newProject.technologies.split(",").map(t => t.trim()),
        academicLevel: newProject.academicLevel,
        gradeReceived: newProject.gradeReceived,
        featured: newProject.featured,
        createdAt: new Date().toISOString()
      };
      setProjects(prev => [mockProj, ...prev]);
      setStatus("Added project to temporary local view status (offline)", "success");
    }
  };

  // Admin: Delete showcased Project
  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
    } catch (e) {
      console.log("Deleted project only from view array (Offline mode logic):", e);
    }
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setStatus("Portfolio project catalog items updated", "success");
  };

  // Contact quick trigger pricing inquiry helper
  const triggerPricingInquiry = (serviceTitle: string) => {
    setQuoteForm(prev => ({
      ...prev,
      subject: serviceTitle
    }));
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate dynamic metrics for Analytics Dashboard
  const activeOrdersCount = orders.filter(o => o.status === "in-progress").length;
  const completedOrdersCount = orders.filter(o => o.status === "completed").length;
  const pendingOrdersCount = orders.filter(o => o.status === "pending").length;
  
  const estimatedRevenueTotal = orders
    .filter(o => o.status !== "cancelled" && o.quotedPrice)
    .reduce((sum, current) => sum + (current.quotedPrice || 0), 0);

  const incomingLeadsCount = leads.filter(l => l.status === "new").length;

  return (
    <div className="flex flex-col min-h-screen bg-light-bg text-slate-800 antialiased selection:bg-brand-purple-100">
      
      {/* Floating Status Notification Toast */}
      {statusMessage.text && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${
            statusMessage.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <CheckCircle className={`w-5 h-5 shrink-0 ${statusMessage.type === "success" ? "text-emerald-600" : "text-red-500"}`} />
            <span>{statusMessage.text}</span>
          </div>
        </div>
      )}

      {/* Floating Consult on WhatsApp button */}
      <a
        href="https://wa.me/919530473222?text=Hello%20Shruti%20Jain%20Academic%20Solutions%2C%20I%20need%20expert%20assistance%20for%20my%20academic%20assignment%20and%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20ba59] transition-transform duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 group"
        title="Consult our Expert directly on WhatsApp"
        id="whatsapp-trigger"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap text-sm font-bold">
          Consult Expert Live
        </span>
        <PhoneCall className="w-5 h-5 animate-pulse" />
      </a>

      {/* Premium Header */}
      <Header 
        onOpenAuth={(tab) => { setAuthModalTab(tab); setAuthModalOpen(true); }}
        adminOpen={adminOpen}
        setAdminOpen={setAdminOpen}
      />

      {/* Main Container Workspace */}
      <main className="flex-grow pt-24">
        
        {/* --- SECTION: ADMIN ZONE DASHBOARD --- */}
        {adminOpen && isAdmin ? (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
              <div>
                <span className="px-3.5 py-1.5 bg-brand-purple-50 text-brand-purple-700 text-xs font-bold uppercase rounded-full tracking-wider">
                  Academic Registrar Hub
                </span>
                <h2 className="font-display font-bold text-3xl text-slate-900 mt-2">
                  Administrative Core Console
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage incoming student project drafts, review leads, update catalog details, and review metrics.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={fetchAllData}
                  className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Refresh Database
                </button>
                <button
                  onClick={() => setAdminOpen(false)}
                  className="px-4.5 py-2.5 bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-xs font-bold rounded-xl shadow-sm tracking-wide transition-all"
                >
                  Return to Website
                </button>
              </div>
            </div>

            {/* Admin Navigator Tabs */}
            <div className="flex bg-slate-100 border border-slate-200 rounded-2xl p-1.5 mb-8 flex-wrap">
              <button
                onClick={() => setAdminTab("analytics")}
                className={`flex-1 min-w-[120px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  adminTab === "analytics"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <BarChart3 className="w-4 h-4 text-brand-purple-600" />
                Live Analytics Dashboard
              </button>
              <button
                onClick={() => setAdminTab("orders")}
                className={`flex-1 min-w-[120px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  adminTab === "orders"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-emerald-600" />
                Student Orders ({orders.length})
              </button>
              <button
                onClick={() => setAdminTab("leads")}
                className={`flex-1 min-w-[120px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  adminTab === "leads"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Users className="w-4 h-4 text-orange-600" />
                Contact Leads ({leads.length})
              </button>
              <button
                onClick={() => setAdminTab("projects")}
                className={`flex-1 min-w-[120px] py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  adminTab === "projects"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                <Briefcase className="w-4 h-4 text-brand-purple-600" />
                Portfolio Manager
              </button>
            </div>

            {/* TAB CONTENT: ANALYTICS */}
            {adminTab === "analytics" && (
              <div className="space-y-8 animate-fade-in">
                {/* Metric Bento Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-brand-purple-50 flex items-center justify-center shrink-0">
                      <FolderGit2 className="w-7 h-7 text-brand-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Orders</p>
                      <h4 className="text-3xl font-display font-extrabold text-slate-900 mt-1">{activeOrdersCount}</h4>
                      <p className="text-[11px] text-brand-purple-600 font-semibold mt-1">In-development status</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completed Jobs</p>
                      <h4 className="text-3xl font-display font-extrabold text-slate-900 mt-1">{completedOrdersCount}</h4>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% On-time delivery</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                      <Clock className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pending Review</p>
                      <h4 className="text-3xl font-display font-extrabold text-slate-900 mt-1">{pendingOrdersCount}</h4>
                      <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting price assignment</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <DollarSign className="w-7 h-7 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estimated Value</p>
                      <h4 className="text-3xl font-display font-extrabold text-slate-900 mt-1">₹{estimatedRevenueTotal.toLocaleString('en-IN')}</h4>
                      <p className="text-[11px] text-emerald-700 font-semibold mt-1">Pipeline projection value</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Distribution insights & quick metrics info */}
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5.5 h-5.5 text-brand-purple-600" />
                      Academic Pipeline Projections
                    </h3>
                    <p className="text-sm text-slate-500">
                      These estimations utilize assigned quotation prices stored inside Firestore across student custom coding projects, doctoral theses, and lab files.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                          <span>Pending Assignment Quotes</span>
                          <span className="text-slate-800">{pendingOrdersCount} orders</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (pendingOrdersCount/(orders.length || 1))*100)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                          <span>In-Progress Technical Projects</span>
                          <span className="text-slate-800">{activeOrdersCount} orders</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-purple-600" style={{ width: `${Math.min(100, (activeOrdersCount/(orders.length || 1))*100)}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">
                          <span>Leads Resolved Ratio</span>
                          <span className="text-slate-800">{leads.filter(l => l.status === "closed").length} / {leads.length} solved</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600" style={{ width: `${(leads.filter(l => l.status === "closed").length / (leads.length || 1)) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Administrative Quick Actions list */}
                  <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                    <h4 className="font-display font-bold text-lg text-slate-900 mb-4 uppercase tracking-wider">
                      Academic System Status
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span><strong>Firebase Authentication:</strong> Active. Custom users & Google Auth mapping online.</span>
                      </li>
                      <li className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span><strong>Firestore Security Schema:</strong> Implemented. Only admins have access rights to write orders and lead states.</span>
                      </li>
                      <li className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span><strong>Contact & Dial Line:</strong> Authorized routing via <strong>+91 9530473222</strong></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ORDERS */}
            {adminTab === "orders" && (
              <div className="space-y-6 animate-fade-in">
                {/* Orders table */}
                <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-100 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Status:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {["all", "pending", "in-progress", "completed", "cancelled"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setOrderFilter(st)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize border ${
                            orderFilter === st
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900"
                          }`}
                        >
                          {st === "all" ? "All Orders" : st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="p-16 bg-white rounded-3xl border border-slate-100 text-center">
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-semibold">No academic orders submitted in this catalog yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders
                      .filter(o => orderFilter === "all" || o.status === orderFilter)
                      .map((order) => {
                        // Keep track of inline edits per order
                        return (
                          <OrderAdminRow 
                            key={order.id} 
                            order={order} 
                            onUpdateStatus={handleUpdateOrderStatus}
                            onSaveQuote={handleSaveOrderQuote}
                            onDelete={handleDeleteOrder}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: LEADS */}
            {adminTab === "leads" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-white p-4.5 rounded-2xl border border-slate-100 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Filter className="w-4.5 h-4.5 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Filter Resolution:</span>
                    <div className="flex gap-1.5">
                      {["all", "new", "contacted", "closed"].map((st) => (
                        <button
                          key={st}
                          onClick={() => setLeadFilter(st)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize border ${
                            leadFilter === st
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {st === "all" ? "All Leads" : st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {leads.length === 0 ? (
                  <div className="p-16 bg-white rounded-3xl border border-slate-100 text-center">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-semibold">No contact general leads registered.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {leads
                      .filter(l => leadFilter === "all" || l.status === leadFilter)
                      .map((lead) => (
                        <div key={lead.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs relative flex flex-col justify-between">
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>

                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${
                                lead.status === 'new' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : lead.status === 'contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {lead.status}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <h4 className="font-display font-bold text-slate-900 text-lg">{lead.name}</h4>
                            <p className="text-xs text-brand-purple-600 font-semibold mb-3">{lead.email} | {lead.phone || "No phone listed"}</p>
                            
                            <div className="bg-slate-50 p-3 rounded-xl mb-4">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Subject Topic:</p>
                              <p className="text-sm font-semibold text-slate-800">{lead.subject}</p>
                              <p className="text-xs text-slate-600 mt-2 italic">"{lead.message}"</p>
                            </div>
                          </div>

                          <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2 justify-end">
                            {lead.status !== "contacted" && (
                              <button
                                onClick={() => handleUpdateLeadStatus(lead.id, "contacted")}
                                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition-all"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {lead.status !== "closed" && (
                              <button
                                onClick={() => handleUpdateLeadStatus(lead.id, "closed")}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition-all"
                              >
                                Mark Closed / Solved
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PROJECTS */}
            {adminTab === "projects" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                {/* Add new project form */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm self-start">
                  <h3 className="font-display font-bold text-slate-900 text-lg mb-4">Post Featured Portfolio Record</h3>
                  <form onSubmit={handleCreateProject} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Project Title</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Dynamic Logistic Delivery Engine"
                        value={newProject.title}
                        onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Category</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-purple-500"
                      >
                        <option value="Web Development">Web Development</option>
                        <option value="AI & ML">AI & ML</option>
                        <option value="Database Systems">Database Systems</option>
                        <option value="Data Science & Visualization">Data Science & Visualization</option>
                        <option value="Research & Dissertation">Research & Dissertation</option>
                        <option value="Mobile Application">Mobile Application</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Technologies (Comma Separated)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Python, TensorFlow, SQL"
                        value={newProject.technologies}
                        onChange={(e) => setNewProject(p => ({ ...p, technologies: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Academic Level</label>
                      <input 
                        type="text" 
                        placeholder="e.g. B.Tech Semester VIII"
                        value={newProject.academicLevel}
                        onChange={(e) => setNewProject(p => ({ ...p, academicLevel: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Grade Awarded</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 10/10 perfect score"
                        value={newProject.gradeReceived}
                        onChange={(e) => setNewProject(p => ({ ...p, gradeReceived: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-purple-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-purple-600 hover:bg-brand-purple-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all"
                    >
                      Publish Project to Portfolio
                    </button>
                  </form>
                </div>

                {/* Display projects management */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="font-display font-bold text-slate-900 text-lg">Current Portfolio Items ({projects.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div key={proj.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative flex flex-col justify-between">
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="absolute top-4.5 right-4.5 p-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                          title="Purge portfolio item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div>
                          <span className="text-[10px] font-bold text-brand-purple-700 bg-brand-purple-50 border border-brand-purple-100 px-2.5 py-1 rounded-full uppercase">
                            {proj.category}
                          </span>
                          <h4 className="font-display font-semibold text-slate-900 mt-2.5 line-clamp-1">{proj.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">Level: {proj.academicLevel}</p>
                          <p className="text-xs font-bold text-emerald-600 mt-1">Grade: {proj.gradeReceived}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-4.5 border-t border-slate-200/60 pt-3">
                          {proj.technologies.map(tech => (
                            <span key={tech} className="text-[9px] bg-white border border-slate-200 font-bold px-1.5 py-0.5 rounded text-slate-600">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* --- DESIGN WORKSPACE FOR MAIN CLIENT WEBSITE --- */
          <div className="space-y-24">
            
            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-20">
              {/* Luxury gradient ambient mesh background lights */}
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-purple-100/40 blur-3xl pointer-events-none -translate-y-1/2" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-purple-200/20 blur-3xl pointer-events-none translate-y-1/3" />
              
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                <div className="lg:col-span-7 space-y-6">
                  {/* Premium Tagline */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-purple-100/60 border border-brand-purple-200 text-brand-purple-700 rounded-full">
                    <Sparkles className="w-4 h-4 text-brand-purple-600 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider font-display">
                      Academic Guidance & Research Solutions
                    </span>
                  </div>

                  <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-none">
                    Expert Assignment & <br />
                    <span className="gradient-text bg-gradient-to-r from-brand-purple-600 to-indigo-600">
                      Project Assistance
                    </span> <br />
                    for Academic Success
                  </h1>

                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                    Get high-quality, plagiarism-free assignment solutions, programming project development, research support, and peer-to-peer consultancy from verified university professionals.
                  </p>

                  {/* Immediate Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4.5 pt-3">
                    <a
                      href="#pricing"
                      className="px-8 py-4 bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-brand-purple-600/20 text-center transition-all hover:translate-y-[-2px] active:translate-y-0"
                    >
                      Get Instant Quote
                    </a>
                    <a
                      href="#how-it-works"
                      className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-center transition-all border border-slate-200"
                    >
                      How It Works
                    </a>
                  </div>

                  {/* Trust Factors metrics banner */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80">
                    <div>
                      <h4 className="text-2xl font-display font-black text-slate-900">5,000+</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Assignments Done</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-black text-slate-900">100%</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Plagiarism Free</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-black text-slate-900">4.9★</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Direct Rating</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-black text-slate-900">50+</h4>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Core Subjects</p>
                    </div>
                  </div>
                </div>

                {/* Hero side banner form quick submit */}
                <div className="lg:col-span-5">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl relative">
                    <div className="absolute top-0 right-12 translate-y-[-50%] bg-[#25D366] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      24/7 Helpline Active
                    </div>

                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 mb-2">
                      Submit Your Requirement
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                      Brief your topic, deadline, and expected outcome to fetch immediate quotes.
                    </p>

                    <form onSubmit={handleQuoteSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Your Name *</label>
                          <input
                            type="text"
                            required
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. Abhinandan"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="student@university.com"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">WhatsApp No *</label>
                          <input
                            type="tel"
                            required
                            value={quoteForm.phone}
                            onChange={(e) => setQuoteForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="+91 xxxxx xxxxx"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Subject *</label>
                          <select
                            value={quoteForm.subject}
                            onChange={(e) => setQuoteForm(prev => ({ ...prev, subject: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          >
                            {ACADEMIC_SERVICES.map(srv => (
                              <option key={srv.id} value={srv.title}>{srv.title}</option>
                            ))}
                            <option value="Other Premium Subject Area">Other Subject Field</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Academic Grade *</label>
                          <select
                            value={quoteForm.academicLevel}
                            onChange={(e) => setQuoteForm(prev => ({ ...prev, academicLevel: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          >
                            <option value="School Student">School Level</option>
                            <option value="University Undergraduate (B.Tech)">B.Tech Undergraduate</option>
                            <option value="Postgraduate (MBA)">MBA Postgraduate</option>
                            <option value="Postgraduate (MCA)">MCA Postgraduate</option>
                            <option value="University Graduate">University Student</option>
                            <option value="Working Professional">Working Professional</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Service Format *</label>
                          <select
                            value={quoteForm.projectType}
                            onChange={(e) => setQuoteForm(prev => ({ ...prev, projectType: e.target.value }))}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          >
                            <option value="Assignment Writing">Assignment Essay / Solution</option>
                            <option value="Coding Project Complete">Programming Code & Viva Doc</option>
                            <option value="Thesis Support">Thesis or Research Support</option>
                            <option value="Case Study Draft">Case Study Solutions</option>
                            <option value="Lab Manual Report">Lab Report Formulation</option>
                            <option value="PowerPoint Presentation">Slide Deck Design</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Topic details & Specific requirements *</label>
                        <textarea
                          required
                          rows={2.5}
                          value={quoteForm.message}
                          onChange={(e) => setQuoteForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Brief academic guidelines, code specifications, or textbook questions here..."
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all resize-none"
                        ></textarea>
                      </div>

                      {/* File Drag Zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative group bg-slate-50 border-2 border-dashed rounded-2xl p-4.5 text-center transition-all ${
                          dragActive 
                            ? "border-brand-purple-600 bg-brand-purple-50/40" 
                            : "border-slate-200 hover:border-brand-purple-400"
                        }`}
                      >
                        <input
                          type="file"
                          id="hero-file-upload"
                          multiple={false}
                          onChange={handleManualFile}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.png,.jpg,.zip,.txt"
                        />
                        <label htmlFor="hero-file-upload" className="cursor-pointer flex flex-col items-center">
                          <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-brand-purple-500 transition-colors mb-2" />
                          <span className="text-xs text-slate-700 font-bold block mb-1">
                            {quoteForm.fileName ? `Uploaded: ${quoteForm.fileName}` : "Drag & Drop guideline file here"}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            or click to browse local folders (PDF, Doc, ZIP, Image max 10MB)
                          </span>
                        </label>
                        {quoteForm.fileName && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuoteForm(prev => ({ ...prev, fileName: "", fileUrl: "" }));
                            }}
                            className="absolute top-3 right-3 p-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            title="Remove attachment"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={fileLoading}
                        className="w-full bg-brand-purple-600 hover:bg-brand-purple-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider shrink-0 shadow-lg shadow-brand-purple-600/10 active:scale-98 transition-all disabled:opacity-50"
                      >
                        {fileLoading ? "Reading requirement attachments..." : "Submit Requirement to Experts"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* SERVICES GRID */}
            <section id="services" className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="px-3.5 py-1.5 bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                  Premium Portfolio Catalog
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight">
                  Premium Academic Assistance & Technical Projects
                </h2>
                <div className="w-12 h-1 bg-brand-purple-600 mx-auto mt-4.5 rounded-full" />
                <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                  We specialize in high-end, grade-producing solutions across computer science, business studies, analysis modeling, research frameworks, and code implementation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {ACADEMIC_SERVICES.map((srv) => (
                  <div key={srv.id} className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-brand-purple-50 group-hover:bg-brand-purple-600 transition-all duration-300 flex items-center justify-center mb-6 shadow-xs">
                        <SafeIcon name={srv.iconName} className="w-6 h-6 text-brand-purple-600 group-hover:text-white transition-all duration-300" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-purple-700 transition-colors">
                        {srv.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-2.5 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-brand-purple-600 bg-brand-purple-50/70 border border-brand-purple-100/55 px-2.5 py-1 rounded-full">
                        {srv.basePriceInquiry}
                      </span>
                      <button
                        onClick={() => triggerPricingInquiry(srv.title)}
                        className="text-xs font-bold text-slate-700 hover:text-brand-purple-600 inline-flex items-center gap-1.5 transition-colors cursor-pointer capitalize"
                      >
                        Inquire Quotation <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SUBJECT EXPERTISE */}
            <section id="expertise" className="bg-slate-50 py-20 border-y border-slate-200/80">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="px-3 py-1 bg-brand-purple-100 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-widest font-display">
                    Our Global Faculty
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight">
                    Premium Subject Expertise Core
                  </h2>
                  <p className="text-sm text-slate-500 mt-3 max-w-lg mx-auto">
                    Highly experienced mentors, developers, and MBA writers holding distinction degrees stand ready across modern engineering and mathematics domains.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {SUBJECT_EXPERTISE.map((sub, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:border-brand-purple-200 transition-all flex flex-col justify-between">
                      <div>
                        <div className="w-7 h-7 rounded-lg bg-brand-purple-50 flex items-center justify-center font-display font-bold text-xs text-brand-purple-600 mb-4.5">
                          {idx + 1}
                        </div>
                        <h4 className="font-display font-bold text-slate-900 text-base">{sub.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{sub.tag}</p>
                      </div>
                      <div className="mt-5 pt-3.5 border-t border-slate-100/80 flex justify-end">
                        <button
                          onClick={() => triggerPricingInquiry(`${sub.name} solutions support`)}
                          className="text-[11px] font-bold text-brand-purple-600 hover:text-brand-purple-800 flex items-center gap-1 uppercase"
                        >
                          Book Mentor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-12">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="px-3.5 py-1.5 bg-brand-purple-50 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                  Transparent Delivery
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight">
                  Exquisite Workflow in 4 Steps
                </h2>
                <p className="text-sm text-slate-500 mt-4">
                  We maintain step-by-step accountability from the initial briefing to the academic supervisor revision window.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Horizontal connection line for desktop */}
                <div className="hidden lg:block absolute top-14 left-16 right-16 h-0.5 bg-slate-200/80 z-0" />

                {[
                  {
                    step: "Step 1",
                    title: "Submit Requirement",
                    desc: "Upload task briefs, coding requirements, and specify desired milestones.",
                    glow: "border-brand-purple-300"
                  },
                  {
                    step: "Step 2",
                    title: "Expert Consultation",
                    desc: "Assigning dedicated master subject engineer or researcher to structure solutions.",
                    glow: "border-brand-purple-400"
                  },
                  {
                    step: "Step 3",
                    title: "Project Development",
                    desc: "Rigorous execution with clean commented codebase, abstracts, and test logs.",
                    glow: "border-brand-purple-500"
                  },
                  {
                    step: "Step 4",
                    title: "Delivery & Revisions",
                    desc: "Polished documents submitted directly. 15-day secure post-viva feedback revision support.",
                    glow: "border-brand-purple-600"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all relative z-10 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-black text-brand-purple-600 uppercase tracking-widest bg-brand-purple-50 px-3 py-1 rounded-full border border-brand-purple-100">
                        {item.step}
                      </span>
                      <h4 className="font-display font-bold text-slate-900 text-lg mt-5 mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FEATURED PROJECTS PORTFOLIO */}
            <section id="portfolio" className="bg-slate-50 py-20 border-y border-slate-200/80 mb-6">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-16">
                  <div>
                    <span className="px-3.5 py-1.5 bg-brand-purple-100 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                      Verified Case Studies
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight">
                      Highly Accomplished Portfolio Examples
                    </h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-lg">
                      Explore a range of actual academic solutions developed by our executive development squad. Name data sanitized to maintain complete profile confidentiality.
                    </p>
                  </div>
                  <a
                    href="#pricing"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl tracking-wide inline-flex items-center gap-2 transition-all shadow-sm"
                  >
                    Discuss My Project Brief <Award className="w-4 h-4 text-brand-purple-300" />
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between relative group hover:border-brand-purple-300 transition-all duration-300">
                      <div>
                        <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                          <span className="text-[10px] font-extrabold text-brand-purple-700 bg-brand-purple-50 border border-brand-purple-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            {proj.category}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                            Grade Received: {proj.gradeReceived}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-slate-900 text-xl tracking-tight mt-1">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mt-1">Level: {proj.academicLevel}</p>
                      </div>

                      <div className="mt-8 pt-4.5 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.map(tech => (
                            <span key={tech} className="text-[10px] font-mono font-semibold bg-slate-100/70 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => triggerPricingInquiry(`Inquiry about portfolio item: ${proj.title}`)}
                          className="text-[11px] font-extrabold text-brand-purple-600 inline-flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          Request Similiar <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* WHY CHOOSE US */}
            <section id="why-sk" className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <span className="px-3.5 py-1.5 bg-brand-purple-50 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                    Our Virtues of Scholarship
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-none">
                    Why University Scholars Place Absolute Trust in Our Desk
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We maintain deep academic accountability. We treat student coursework as the foundation of industrial research readiness.
                  </p>

                  <div className="pt-4 space-y-3">
                    <div className="flex gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-200 mt-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">Industrial Code Integrity</h4>
                        <p className="text-xs text-slate-400 mt-0.5">All codebase deliverables strictly comply with clean coding principles paired with robust debug guides.</p>
                      </div>
                    </div>

                    <div className="flex gap-3.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-200 mt-1">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">Triple-Checked Turnitin Report</h4>
                        <p className="text-xs text-slate-400 mt-0.5">We provide free AI-check & Turnitin reports ensuring authentic structural sentences.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Expert Professionals",
                      desc: "Consultants carrying post-graduate M.Tech/Ph.D degrees with deep expertise in software systems and MBA analytical strategies.",
                      icon: "Award"
                    },
                    {
                      title: "On-Time Delivery",
                      desc: "Zero deadline breaches. We synchronize production flows to deliver at least 48 hours before review times.",
                      icon: "Clock"
                    },
                    {
                      title: "Affordable Student Pricing",
                      desc: "Academic budgets designed to match working freelancers and college scholars without hitting financial caps.",
                      icon: "Database"
                    },
                    {
                      title: "Original Work",
                      desc: "We construct calculations, charts, and essays from raw material reference indexes tailored for each student.",
                      icon: "Sparkles"
                    },
                    {
                      title: "Confidential Service",
                      desc: "Strict nondisclosure agreements. We never reveal user profiles, phone numbers, or university identities.",
                      icon: "HelpCircle"
                    },
                    {
                      title: "24/7 Priority Support",
                      desc: "Connect directly with our project leads in Rajasthan via voice-call, email, or WhatsApp channels.",
                      icon: "PhoneCall"
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-purple-50 flex items-center justify-center text-brand-purple-700 shrink-0 border border-brand-purple-100">
                        <SafeIcon name={item.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="bg-slate-50 py-20 border-y border-slate-200/80">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                  <span className="px-3.5 py-1.5 bg-brand-purple-100 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                    Scholastic Affiliation Stories
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight font-display">
                    Success Stories from Elite Alumni
                  </h2>
                  <p className="text-sm text-slate-500 mt-3">
                    Hear from actual postgraduates, engineering students, and business scholars who trusted Shruti Jain Academic Solutions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs relative flex flex-col justify-between">
                      <div className="absolute top-6 right-6 font-display font-bold text-slate-200 text-6xl select-none pointer-events-none">
                        ”
                      </div>
                      <div>
                        {/* 5-star compilation display */}
                        <div className="flex gap-0.5 mb-5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <span key={i} className="text-amber-400 text-base">★</span>
                          ))}
                        </div>
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                          "{t.review}"
                        </p>
                      </div>

                      <div className="mt-8 pt-4.5 border-t border-slate-100/80 flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-brand-purple-50 font-display font-bold text-sm text-brand-purple-700 flex items-center justify-center border border-brand-purple-100 uppercase">
                          {t.studentName.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-slate-900 text-sm">{t.studentName}</h4>
                          <p className="text-xs text-slate-400">{t.course} | {t.academicLevel}</p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold mt-0.5 uppercase tracking-wide">
                            <Check className="w-3 h-3" /> Verified Client
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* PRICING INQUIRY SECTION */}
            <section id="pricing" className="max-w-5xl mx-auto px-6 py-12">
              <div className="bg-gradient-to-r from-brand-purple-50 to-indigo-50 border border-brand-purple-150 p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-xs">
                {/* Background lighting spheres */}
                <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-brand-purple-300/30 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-brand-purple-400/20 blur-3xl pointer-events-none" />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                  <div className="lg:col-span-7 space-y-4">
                    <span className="px-3.5 py-1.5 bg-brand-purple-600 text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
                      Pricing Blueprint
                    </span>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                      Looking for custom project budget estimations?
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-md">
                      Submit your detailed task assignment parameters and check real pricing within 10 minutes. Our consult fees are fully matched for student packages.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-purple-200/50">
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">Flexible Milestones</h5>
                        <p className="text-xs text-slate-400 mt-1">Pay installments as chunks of your project codebase gets compiled.</p>
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">Refund Alignment</h5>
                        <p className="text-xs text-slate-400 mt-1">Full protection guarantee if original guideline briefs are unmet.</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-brand-purple-100 shadow-sm text-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Standard Custom Quote</p>
                    <h4 className="text-3xl font-display font-black text-brand-purple-700 mt-2">Custom pricing</h4>
                    <p className="text-xs text-slate-400 mt-1">No payment requested at submission</p>
                    
                    <div className="mt-6 space-y-3.5">
                      <a 
                        href="#contact"
                        className="w-full bg-brand-purple-600 hover:bg-brand-brand-purple-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all block text-center"
                      >
                        Submit Project Details
                      </a>
                      <a
                        href="https://wa.me/919530473222"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl border border-emerald-200 transition-all flex items-center justify-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-600" /> Share File on WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQS */}
            <section id="faq" className="max-w-4xl mx-auto px-6 py-12">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="px-3.5 py-1.5 bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                  Clear Answers
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-4 tracking-tight font-display">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-slate-500 mt-3">
                  All you details regarding secure payments, supervisor revisions, code ownership, and timelines.
                </p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <FAQAccordion key={idx} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </section>

            {/* CONTACT FORM */}
            <section id="contact" className="max-w-7xl mx-auto px-6 py-12">
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs relative">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5 space-y-6">
                    <span className="px-3.5 py-1.5 bg-brand-purple-50 text-brand-purple-700 text-xs font-extrabold uppercase rounded-full tracking-wider font-display">
                      Let's Connect
                    </span>
                    <h2 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight leading-none">
                      Consult with our Academic Desk directly
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Have general inquiries or custom syllabus modules you want decoded? Send us a quick note. We reply swiftly via registered email and messaging lines.
                    </p>

                    <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-150">
                      <div>
                        <h4 className="font-display font-bold text-slate-800 text-sm">Direct Office Helpline:</h4>
                        <p className="text-sm text-brand-purple-700 font-bold mt-1">+91 9530473222</p>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-slate-800 text-sm">Official Corporate Channel:</h4>
                        <a href="mailto:shrutiassignmenthelpers@gmail.com" className="text-sm text-slate-600 hover:text-slate-950 transition-colors hover:underline block mt-1 truncate">
                          shrutiassignmenthelpers@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 border-l border-slate-200 hidden lg:block h-64 mx-auto" />

                  <div className="lg:col-span-6">
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Megha Singhal"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="student@school.edu"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Phone (WhatsApp)</label>
                          <input
                            type="tel"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="e.g. +91 xx..."
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Enquiry Subject Topic</label>
                        <input
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="e.g. Spring Boot Microservice Guidance syllabus Help"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Your Detailed Message *</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Brief descriptions or specific syllabus notes..."
                          className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-purple-500 focus:bg-white transition-all resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
                      >
                        Send Enquiry Mail
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

      </main>

      {/* Auth Portal Modal Integration */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialTab={authModalTab}
      />

      {/* Footer Block */}
      <Footer />
    </div>
  );
}

// Subcomponent: Admin Row for Academic Orders to abstract inline updates cleanly
const OrderAdminRow: React.FC<{
  order: AcademicOrder;
  onUpdateStatus: (id: string, st: OrderStatus) => void;
  onSaveQuote: (id: string, price: number, notes: string) => void;
  onDelete: (id: string) => void;
}> = ({ order, onUpdateStatus, onSaveQuote, onDelete }) => {
  const [expand, setExpand] = useState(false);
  const [isEditingParams, setIsEditingParams] = useState(false);
  
  // Local edit copies
  const [localPrice, setLocalPrice] = useState(order.quotedPrice || 0);
  const [localNotes, setLocalNotes] = useState(order.adminNotes || "");

  const handleSaveBtn = () => {
    onSaveQuote(order.id, Number(localPrice), localNotes);
    setIsEditingParams(false);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs relative">
      <button 
        onClick={() => onDelete(order.id)}
        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1"
        title="Delete order"
      >
        <Trash2 className="w-4.5 h-4.5" />
      </button>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${
              order.status === 'completed' 
                ? 'bg-emerald-100 text-emerald-800' 
                : order.status === 'in-progress'
                ? 'bg-brand-purple-100 text-brand-purple-800'
                : order.status === 'cancelled'
                ? 'bg-red-50 text-red-600'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {order.status}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ID: {order.id.slice(0, 8)}...</span>
            <span className="text-[10px] text-slate-400 font-mono">Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <h4 className="font-display font-bold text-slate-900 text-lg flex items-center gap-2 flex-wrap">
            <span>{order.subject}</span>
            <span className="text-slate-400 font-normal text-xs">/ {order.projectType}</span>
          </h4>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Student: <strong className="text-slate-800">{order.name}</strong> ({order.email}) | WhatsApp: <strong className="text-slate-800">{order.phone}</strong>
          </p>
        </div>

        <div className="flex gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setExpand(!expand)}
            className="px-4 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
          >
            {expand ? "Hide Brief Details" : "View Full Brief Details"}
          </button>
          
          <select 
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            className="px-3 py-2 text-xs font-bold bg-slate-100 border border-slate-200 rounded-xl focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {expand && (
        <div className="mt-5 pt-5 border-t border-slate-100 space-y-4 animate-fade-in text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Level</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{order.academicLevel}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Deadline</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{order.deadline}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-150">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Budget Range</span>
              <span className="text-xs font-bold text-slate-800 mt-1 block">{order.budgetRange}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Guidelines & messages:</span>
            <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium whitespace-pre-wrap">"{order.message}"</p>
          </div>

          {/* Attachment download links if saved */}
          {order.fileUrl && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
              <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Guidelines document attachment is available: </span>
              <a 
                href={order.fileUrl} 
                download={order.fileName || "academic_brief.txt"} 
                className="underline hover:text-emerald-950 font-black inline-flex items-center gap-1 ml-1"
              >
                Download Guideline attachment ({order.fileName || "File"}) <CornerDownRight className="w-4- h-4" />
              </a>
            </div>
          )}

          {/* Locked parameters for quotations */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h5 className="font-display font-medium text-slate-800 tracking-wider text-xs uppercase">Quotation Parameters</h5>
              {!isEditingParams && (
                <button
                  type="button"
                  onClick={() => setIsEditingParams(true)}
                  className="text-xs font-bold text-brand-purple-600 hover:text-brand-purple-800 uppercase"
                >
                  Edit parameters
                </button>
              )}
            </div>

            {isEditingParams ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Quoted Price Amount (₹)</label>
                    <input 
                      type="number" 
                      value={localPrice}
                      onChange={(e) => setLocalPrice(Number(e.target.value))}
                      placeholder="e.g. 3500"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Consultant private notes</label>
                    <input 
                      type="text" 
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      placeholder="e.g. Checked python guidelines - needs pandas."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingParams(false)}
                    className="px-3.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBtn}
                    className="px-4 py-1.5 bg-brand-purple-600 hover:bg-brand-purple-700 text-white text-xs font-bold rounded-lg"
                  >
                    Save Quotation Parameters
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-widest block text-[10px]">Quoted Pricing:</span>
                  <strong className="text-base text-brand-purple-700 mt-1 block">
                    {order.quotedPrice ? `₹${order.quotedPrice.toLocaleString('en-IN')}` : "Pricing Quotation not assigned yet"}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-widest block text-[10px]">Private Desk Notes:</span>
                  <span className="text-slate-700 italic block mt-1">{order.adminNotes || "No notes resolved yet."}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent: Accessible Accordion for FAQs
const FAQAccordion: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-300">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5.5 text-left flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
      >
        <span className="font-display font-bold text-slate-900 text-base leading-tight">
          {question}
        </span>
        <div className={`w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 transition-transform duration-300 ${open ? "rotate-180 bg-brand-purple-50 border-brand-purple-200" : ""}`}>
          <ChevronDown className={`w-4 h-4 transition-colors ${open ? "text-brand-purple-600" : "text-slate-500"}`} />
        </div>
      </button>
      
      {open && (
        <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed font-sans border-t border-slate-100/80 pt-4.5 animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
