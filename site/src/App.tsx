import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Lenis from "lenis";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import About, { WordBand } from "./components/About";
import Access from "./components/Access";
import Contact from "./components/Contact";
import Delivery from "./components/Delivery";
import Facts from "./components/Facts";
import Faq from "./components/Faq";
import Footer, { LegalModal, type LegalKey } from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Parapharmacie from "./components/Parapharmacie";
import Services from "./components/Services";
import Team from "./components/Team";
import Teleconsultation from "./components/Teleconsultation";
import Vaccination from "./components/Vaccination";
import SectionReveal from "./components/ui/SectionReveal";
import { site } from "./data/site";
import { gsap, prefersReduced, ScrollTrigger } from "./lib/gsap";

function CallFab() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const nearEnd = window.innerHeight + v > document.documentElement.scrollHeight - 220;
    setShow(v > 500 && !nearEnd);
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.a href={site.telephone.lien} aria-label={`Appeler la pharmacie au ${site.telephone.affichage}`}
          initial={{ y: 90 }} animate={{ y: 0 }} exit={{ y: 90 }} transition={{ type: "spring", bounce: 0.25 }}
          className="btn-green fixed right-4 z-40 shadow-[0_16px_40px_-14px_rgba(11,92,80,.7)] md:hidden"
          style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}>
          <Phone size={17} /> Appeler
        </motion.a>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [legal, setLegal] = useState<LegalKey>(null);

  useEffect(() => {
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!prefersReduced()) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }
    // ancres internes : défilement doux + objet du formulaire
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id === "top" ? document.body : document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const subj = a.dataset.subject;
      if (subj) window.dispatchEvent(new CustomEvent("set-subject", { detail: subj }));
      if (a.textContent?.includes("Organiser ma livraison")) window.dispatchEvent(new CustomEvent("set-subject", { detail: "Livraison à domicile" }));
      if (lenis) lenis.scrollTo(id === "top" ? 0 : el, { offset: -90, duration: 1.4 });
      else window.scrollTo({ top: id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 90 });
    };
    document.addEventListener("click", onClick);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <a href="#pharmacie" className="fixed left-4 top-4 z-[80] -translate-y-24 rounded-full bg-ink px-4 py-2 text-white focus:translate-y-0">Aller au contenu</a>
      <Header />
      <main>
        <Hero />
        <WordBand />
        <Facts />
        <About />
        <Team />
        <Services />
        <Parapharmacie />
        <Delivery />
        <Vaccination />
        <Teleconsultation />
        <Access />
        <Faq />
        <Contact onPrivacy={() => setLegal("privacy")} />
      </main>
      <Footer onLegal={setLegal} />
      <LegalModal open={legal} onClose={() => setLegal(null)} />
      <CallFab />
      <SectionReveal />
    </>
  );
}
