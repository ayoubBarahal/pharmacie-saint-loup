import { gsap, prefersReduced, SplitText, useGSAP } from "../../lib/gsap";

/**
 * Révèle les titres de section (.h-sec) ligne par ligne au défilement.
 * gsap-skills : ScrollTrigger sur le tween de premier niveau, toggleActions sans scrub,
 * SplitText avec autoSplit (recalcul au redimensionnement) et revert au démontage.
 */
export default function SectionReveal() {
  useGSAP(() => {
    if (prefersReduced()) return;
    const splits = gsap.utils.toArray<HTMLElement>("main .h-sec").map((el) =>
      SplitText.create(el, {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110, duration: 1.1, stagger: 0.09, ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 86%", toggleActions: "play none none none" },
        }),
      }));
    return () => splits.forEach((s) => s.revert());
  });
  return null;
}
