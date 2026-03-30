import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BarChart2,
  Building2,
  CheckCircle2,
  Code2,
  Cpu,
  Film,
  Globe,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Palette,
  PenTool,
  Phone,
  Search,
  Share2,
  Smartphone,
  Star,
  Video,
  X,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import AdminPanel from "./AdminPanel";
import { useActor } from "./hooks/useActor";

const WHATSAPP_URL = "https://wa.me/917067326325";

const SERVICES = [
  {
    icon: Search,
    title: "SEO Optimization",
    desc: "Rank higher, drive organic traffic with data-driven search strategies.",
    color: "text-green-400",
  },
  {
    icon: Code2,
    title: "Software Development",
    desc: "Custom software solutions built with modern tech stacks.",
    color: "text-blue-400",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Performance campaigns that convert visitors into customers.",
    color: "text-orange-400",
  },
  {
    icon: Palette,
    title: "Graphics Designing",
    desc: "Visually stunning designs that communicate your brand story.",
    color: "text-pink-400",
  },
  {
    icon: Film,
    title: "Motion Graphics",
    desc: "Engaging animations that bring your ideas to life.",
    color: "text-purple-400",
  },
  {
    icon: PenTool,
    title: "Logo Designing",
    desc: "Memorable logos that define your brand identity.",
    color: "text-yellow-400",
  },
  {
    icon: Video,
    title: "Video Editing",
    desc: "Professional edits that captivate and retain audiences.",
    color: "text-red-400",
  },
  {
    icon: Share2,
    title: "Social Media Marketing",
    desc: "Build community and drive engagement across all platforms.",
    color: "text-cyan-400",
  },
  {
    icon: Smartphone,
    title: "App Development",
    desc: "iOS & Android apps crafted for seamless user experiences.",
    color: "text-indigo-400",
  },
  {
    icon: BarChart2,
    title: "Data Analysis",
    desc: "Turn raw data into actionable business intelligence.",
    color: "text-emerald-400",
  },
  {
    icon: Building2,
    title: "Company Registration",
    desc: "Hassle-free business registration and legal compliance.",
    color: "text-amber-400",
  },
  {
    icon: Globe,
    title: "Website Development",
    desc: "Fast, responsive websites that convert visitors into clients.",
    color: "text-teal-400",
  },
  {
    icon: Cpu,
    title: "IT Solutions",
    desc: "End-to-end IT infrastructure and support services.",
    color: "text-sky-400",
  },
  {
    icon: Mail,
    title: "Email Marketing",
    desc: "Targeted campaigns with high open rates and conversions.",
    color: "text-rose-400",
  },
  {
    icon: Youtube,
    title: "YouTube Marketing",
    desc: "Grow your channel and monetize your video content.",
    color: "text-red-500",
  },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const STATS_HERO = [
  { val: "10+", label: "Years Experience" },
  { val: "200+", label: "Projects Delivered" },
  { val: "500+", label: "Happy Clients" },
];

const ABOUT_STATS = [
  { val: "10+", label: "Years Experience", color: "oklch(0.77 0.12 185)" },
  { val: "200+", label: "Projects Completed", color: "oklch(0.70 0.17 37)" },
  { val: "500+", label: "Happy Clients", color: "oklch(0.65 0.15 145)" },
];

const ABOUT_FEATURES = [
  "Data-driven strategies tailored to your goals",
  "Full-stack digital expertise under one roof",
  "Transparent reporting and dedicated support",
];

const STAR_KEYS = ["s1", "s2", "s3", "s4", "s5"];

const FLOATING_DOTS = Array.from({ length: 12 }, (_, i) => ({
  id: `dot-${i}`,
  width: `${4 + (i % 3) * 3}px`,
  height: `${4 + (i % 3) * 3}px`,
  left: `${(i * 8.3) % 100}%`,
  top: `${(i * 13.7) % 100}%`,
  bg: i % 2 === 0 ? "oklch(0.77 0.12 185 / 0.4)" : "oklch(0.70 0.17 37 / 0.3)",
  delay: `${i * 0.3}s`,
  duration: `${2.5 + (i % 3)}s`,
}));

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => {
      for (const o of observers) o?.disconnect();
    };
  }, [ids]);
  return activeId;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function HeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="oklch(0.77 0.12 185)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, oklch(0.77 0.12 185), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full"
        style={{
          opacity: 0.08,
          background:
            "radial-gradient(circle, oklch(0.70 0.17 37), transparent 70%)",
        }}
      />
      {FLOATING_DOTS.map((dot) => (
        <div
          key={dot.id}
          className="absolute rounded-full animate-float"
          style={{
            width: dot.width,
            height: dot.height,
            left: dot.left,
            top: dot.top,
            background: dot.bg,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
}

function Portfolio() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const { actor } = useActor();
  const activeSection = useScrollSpy(["home", "about", "services", "contact"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (actor)
        await actor.storeLead(
          form.name,
          form.phone,
          form.message,
          BigInt(Date.now()),
        );
    } catch (err) {
      console.error("Failed to save lead:", err);
    } finally {
      setSubmitting(false);
    }
    setSubmitted(
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    );
    const url =
      `${WHATSAPP_URL}?text=` +
      `Name: ${encodeURIComponent(form.name)}%0a` +
      `Phone: ${encodeURIComponent(form.phone)}%0a` +
      `Message: ${encodeURIComponent(form.message)}`;
    window.open(url, "_blank");
    setForm({ name: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(null), 5000);
  };

  const scrollTo = (href: string) => {
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const aboutSection = useInView();
  const servicesSection = useInView();
  const contactSection = useInView();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.118 0.022 204), oklch(0.105 0.02 204) 50%, oklch(0.118 0.022 204))",
      }}
    >
      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "oklch(0.118 0.022 204 / 0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.22 0.028 200 / 0.5)",
        }}
      >
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-black"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.77 0.12 185), oklch(0.65 0.10 185))",
              }}
            >
              AR
            </div>
            <div>
              <div className="font-bold text-foreground text-sm leading-tight tracking-wide">
                AKASH RAWAT
              </div>
              <div
                className="text-xs leading-tight"
                style={{ color: "oklch(0.77 0.12 185)" }}
              >
                Digital World
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.label}
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === link.href.replace("#", "")
                    ? "text-teal bg-teal/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              type="button"
              data-ocid="nav.cta.button"
              onClick={() => scrollTo("#contact")}
              size="sm"
              className="ml-3 btn-cta border-0 font-semibold hover:opacity-90"
            >
              Hire Me
            </Button>
          </nav>

          <button
            type="button"
            data-ocid="nav.mobile_menu.button"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t"
              style={{
                borderColor: "oklch(0.22 0.028 200 / 0.5)",
                background: "oklch(0.118 0.022 204)",
              }}
            >
              <div className="container px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    type="button"
                    key={link.label}
                    onClick={() => scrollTo(link.href)}
                    className="text-left px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
                <Button
                  type="button"
                  onClick={() => scrollTo("#contact")}
                  className="mt-2 btn-cta border-0"
                >
                  Get Free Consultation
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        <HeroBg />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{
              background: "oklch(0.77 0.12 185 / 0.12)",
              border: "1px solid oklch(0.77 0.12 185 / 0.3)",
              color: "oklch(0.77 0.12 185)",
            }}
          >
            <Star size={12} fill="currentColor" />
            AKASH RAWAT — Digital World
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-tight mb-4"
          >
            Your Growth
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.77 0.12 185), oklch(0.70 0.17 37))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Partner
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10"
          >
            Accelerating Your Digital Success with powerful, result-driven
            solutions that transform businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              type="button"
              data-ocid="hero.cta.primary_button"
              onClick={() => scrollTo("#contact")}
              size="lg"
              className="btn-cta border-0 font-semibold px-8 text-base hover:opacity-90 transition-opacity"
            >
              Get A Free Consultation <ArrowRight size={18} className="ml-2" />
            </Button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.whatsapp.button"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-semibold text-base text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #25D366, #1ebe57)",
                boxShadow: "0 4px 20px #25D36640",
              }}
            >
              <MessageCircle size={20} />💬 Chat on WhatsApp
            </a>
            <Button
              type="button"
              data-ocid="hero.services.secondary_button"
              onClick={() => scrollTo("#services")}
              size="lg"
              variant="outline"
              className="bg-transparent font-semibold px-8 text-base"
              style={{
                borderColor: "oklch(0.77 0.12 185 / 0.4)",
                color: "oklch(0.77 0.12 185)",
              }}
            >
              View Services
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {STATS_HERO.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="text-3xl font-bold"
                  style={{ color: "oklch(0.77 0.12 185)" }}
                >
                  {s.val}
                </div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div ref={aboutSection.ref} className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={aboutSection.inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.77 0.12 185)" }}
              >
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6 leading-snug">
                Empowering Businesses
                <br />
                through Innovation.
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                I help businesses grow digitally with powerful and result-driven
                solutions. With over a decade of experience, I partner with
                brands to craft digital strategies that deliver measurable
                growth — from search rankings to social engagement, from code to
                creative.
              </p>
              <ul className="space-y-3">
                {ABOUT_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0"
                      style={{ color: "oklch(0.77 0.12 185)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                type="button"
                data-ocid="about.cta.primary_button"
                onClick={() => scrollTo("#contact")}
                className="mt-8 btn-cta border-0 font-semibold hover:opacity-90"
              >
                Work With Me <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={aboutSection.inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="glass-card rounded-2xl p-6 flex items-center gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-foreground shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.77 0.12 185 / 0.3), oklch(0.70 0.17 37 / 0.2))",
                    border: "1px solid oklch(0.77 0.12 185 / 0.3)",
                  }}
                >
                  AR
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">
                    Akash Rawat
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "oklch(0.77 0.12 185)" }}
                  >
                    Digital Growth Expert
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {STAR_KEYS.map((k) => (
                      <Star
                        key={k}
                        size={12}
                        fill="oklch(0.70 0.17 37)"
                        style={{ color: "oklch(0.70 0.17 37)" }}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      5.0 Rating
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {ABOUT_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="glass-card rounded-xl p-4 text-center"
                  >
                    <div
                      className="text-2xl font-bold"
                      style={{ color: s.color }}
                    >
                      {s.val}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-snug">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} style={{ color: "oklch(0.77 0.12 185)" }} />
                  Morena, Madhya Pradesh
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} style={{ color: "oklch(0.70 0.17 37)" }} />
                  +91 7067326325
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="py-24"
        style={{ background: "oklch(0.108 0.021 204)" }}
      >
        <div
          ref={servicesSection.ref}
          className="container mx-auto px-4 md:px-8"
        >
          <div className="text-center mb-14">
            <motion.span
              initial={{ opacity: 0 }}
              animate={servicesSection.inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "oklch(0.77 0.12 185)" }}
            >
              Our Services
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={servicesSection.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-foreground mt-3"
            >
              What We Do: 15 Core Digital Services
            </motion.h2>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="services.list"
          >
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                data-ocid={`services.item.${i + 1}`}
                initial={{ opacity: 0, y: 24 }}
                animate={servicesSection.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 * i }}
                className="glass-card rounded-2xl p-6 transition-all hover:scale-[1.02] cursor-default"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "oklch(0.17 0.025 204)" }}
                >
                  <service.icon size={22} className={service.color} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24">
        <div
          ref={contactSection.ref}
          className="container mx-auto px-4 md:px-8"
        >
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={contactSection.inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
            >
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "oklch(0.77 0.12 185)" }}
              >
                Get In Touch
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-5 leading-snug">
                Ready to Start Your Digital Journey?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                Let's discuss how I can help grow your business. Reach out for a
                free consultation and we'll build a strategy tailored to your
                goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "oklch(0.77 0.12 185 / 0.12)",
                      border: "1px solid oklch(0.77 0.12 185 / 0.2)",
                    }}
                  >
                    <MapPin
                      size={15}
                      style={{ color: "oklch(0.77 0.12 185)" }}
                    />
                  </div>
                  Morena, Madhya Pradesh
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "oklch(0.70 0.17 37 / 0.12)",
                      border: "1px solid oklch(0.70 0.17 37 / 0.2)",
                    }}
                  >
                    <Phone size={15} style={{ color: "oklch(0.70 0.17 37)" }} />
                  </div>
                  +91 7067326325
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: "oklch(0.65 0.15 270 / 0.12)",
                      border: "1px solid oklch(0.65 0.15 270 / 0.2)",
                    }}
                  >
                    <Mail size={15} style={{ color: "oklch(0.65 0.15 270)" }} />
                  </div>
                  akashrawat@digitalworld.in
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.whatsapp.button"
                  className="mt-2 flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #25D366, #1ebe57)",
                    boxShadow: "0 4px 16px #25D36630",
                  }}
                >
                  <MessageCircle size={18} />💬 Chat on WhatsApp
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={contactSection.inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-2"
            >
              <div
                className="glass-card rounded-2xl p-8"
                data-ocid="contact.dialog"
              >
                <h3 className="font-semibold text-foreground text-lg mb-6">
                  Send Me a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm text-muted-foreground"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        data-ocid="contact.input"
                        placeholder="Akash Rawat"
                        value={form.name}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, name: e.target.value }))
                        }
                        className="bg-secondary/50 border-border placeholder:text-muted-foreground/50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm text-muted-foreground"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        data-ocid="contact.phone.input"
                        placeholder="Your Phone Number"
                        value={form.phone}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, phone: e.target.value }))
                        }
                        className="bg-secondary/50 border-border placeholder:text-muted-foreground/50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm text-muted-foreground"
                    >
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      data-ocid="contact.textarea"
                      placeholder="Tell me about your project..."
                      value={form.message}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, message: e.target.value }))
                      }
                      className="bg-secondary/50 border-border placeholder:text-muted-foreground/50 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    disabled={submitting}
                    className="w-full btn-cta border-0 font-semibold text-base py-5 hover:opacity-90 transition-opacity"
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send via WhatsApp{" "}
                        <MessageCircle size={16} className="ml-2" />
                      </>
                    )}
                  </Button>

                  {submitted && (
                    <div
                      data-ocid="contact.success_state"
                      className="text-center text-sm font-medium space-y-1"
                      style={{ color: "oklch(0.65 0.15 145)" }}
                    >
                      <p>Message sent! ✅</p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.08 145)" }}
                      >
                        Submitted on {submitted}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t py-10"
        style={{
          borderColor: "oklch(0.22 0.028 200 / 0.4)",
          background: "oklch(0.105 0.02 204)",
        }}
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-black"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.77 0.12 185), oklch(0.65 0.10 185))",
                }}
              >
                AR
              </div>
              <div>
                <div className="font-bold text-foreground text-sm">
                  AKASH RAWAT
                </div>
                <div
                  className="text-xs"
                  style={{ color: "oklch(0.77 0.12 185)" }}
                >
                  Digital World
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              © {new Date().getFullYear()} Akash Rawat | Digital World. Built
              with <span style={{ color: "oklch(0.70 0.17 37)" }}>♥</span> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "oklch(0.77 0.12 185)" }}
              >
                caffeine.ai
              </a>
            </p>

            <nav className="flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  data-ocid={`footer.${link.label.toLowerCase()}.link`}
                  onClick={() => scrollTo(link.href)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/admin"
                data-ocid="footer.admin.link"
                className="text-xs footer-admin-link"
              >
                Admin
              </a>
            </nav>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-ocid="whatsapp.floating.button"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold text-sm shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #25D366, #1ebe57)",
          boxShadow: "0 8px 32px #25D36650",
        }}
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </motion.a>
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname === "/admin";
  return isAdmin ? <AdminPanel /> : <Portfolio />;
}
