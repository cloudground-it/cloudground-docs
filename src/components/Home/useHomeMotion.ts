import {useEffect, useLayoutEffect, type RefObject} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import splitText, {type Split} from './splitText';
import home from './Home.module.css';
import scope from './Scope.module.css';
import term from './Terminal.module.css';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const ease = 'power3.out';

/**
 * The home's motion (GSAP + ScrollTrigger). Every element is in the server
 * HTML at its final place and fully visible; motion only animates *from*
 * hidden after mount, and nothing runs under prefers-reduced-motion.
 *
 * The hero is the exception that avoids a flash: a head script adds
 * data-cg-motion="on" to <html> when motion is allowed, and custom.css keeps
 * the [data-intro] elements transparent until this hook sets it to "ready"
 * (or for three seconds at most, if the bundle never runs).
 *
 * Text is split into words or characters only (splitText.ts): no lines, no
 * masks, no overflow hidden, so nothing is ever cut and the text rewraps on
 * resize. Everything is reverted on unmount, so SPA navigation leaks nothing.
 */
export default function useHomeMotion(root: RefObject<HTMLElement | null>): void {
  useIsoLayoutEffect(() => {
    const el = root.current;
    const html = document.documentElement;
    const ready = () => html.setAttribute('data-cg-motion', 'ready');
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ready();
      return undefined;
    }
    gsap.registerPlugin(ScrollTrigger);

    // On the first load, if the failsafe already showed the hero, do not hide
    // it again to play the intro.
    const firstLoad = html.getAttribute('data-cg-motion') === 'on';
    const heroH1 = el.querySelector<HTMLElement>(`.${home.h1}`);
    const playIntro = !firstLoad || (heroH1 !== null && getComputedStyle(heroH1).opacity === '0');

    const splits: Split[] = [];
    const undo: (() => void)[] = [];
    const q = <T extends Element = HTMLElement>(s: string, r: ParentNode = el) => r.querySelector<T>(s);
    const qa = <T extends Element = HTMLElement>(s: string, r: ParentNode = el) => Array.from(r.querySelectorAll<T>(s));
    const split = (node: HTMLElement | null, chars = false) => {
      if (!node) {
        return {words: [], chars: [], revert() {}};
      }
      const s = splitText(node, {chars});
      splits.push(s);
      return s;
    };

    const ctx = gsap.context(() => {
      ready();

      /* 1. Hero: words rise and fade in, then the accent word's underline draws. */
      const wave = q<SVGPathElement>(`.${scope.wave}`);
      const drawWave = (duration: number, ease_: string, delay = 0) => {
        if (!wave) {
          return;
        }
        // The stroke is non-scaling: measure in screen units, and never short.
        const m = wave.getScreenCTM();
        const len = wave.getTotalLength() * Math.max(1, m ? Math.max(Math.abs(m.a), Math.abs(m.d)) : 1);
        gsap.fromTo(
          wave,
          {strokeDasharray: len, strokeDashoffset: len},
          {
            strokeDashoffset: 0,
            duration,
            delay,
            ease: ease_,
            onComplete: () => {
              gsap.set(wave, {clearProps: 'strokeDasharray,strokeDashoffset'});
            },
          },
        );
      };
      if (playIntro && heroH1) {
        const acc = q(`.${home.acc}`, heroH1);
        const words = split(heroH1).words;
        const tl = gsap.timeline({defaults: {ease}});
        tl.from(`.${home.heroText} > .${home.label}`, {y: 12, autoAlpha: 0, duration: 0.5})
          .from(words, {yPercent: 50, autoAlpha: 0, duration: 0.9, stagger: 0.06}, '-=0.2');
        if (acc) {
          tl.fromTo(
            acc,
            {backgroundSize: '0% 0.06em'},
            {backgroundSize: '100% 0.06em', duration: 0.6, ease: 'power2.inOut', clearProps: 'backgroundSize'},
            '-=0.3',
          );
        }
        tl.from(`.${home.lede}`, {y: 18, autoAlpha: 0, duration: 0.7}, '-=0.6')
          .from(`.${home.heroText} .${home.actions} > *`, {y: 14, autoAlpha: 0, duration: 0.5, stagger: 0.08}, '-=0.45')
          .from(`.${home.facts} li`, {x: -8, autoAlpha: 0, duration: 0.4, stagger: 0.07}, '-=0.3');

        /* 2. Scope: the trace draws itself, the reading bars fill. */
        drawWave(1.6, 'power1.inOut', 0.3);
        tl.from(`.${scope.bar} i`, {scaleX: 0, transformOrigin: '0 50%', duration: 0.8, stagger: 0.1}, 1).from(
          `.${scope.readings} dd`,
          {y: 8, autoAlpha: 0, duration: 0.4, stagger: 0.1},
          1,
        );
      }
      // The trace redraws when the switch changes it (after React renders).
      const scopeEl = q(`.${scope.scope}`);
      if (scopeEl) {
        const onClick = (e: Event) => {
          const b = (e.target as Element).closest('button');
          if (!b || !scopeEl.contains(b) || b.getAttribute('aria-pressed') === 'true') {
            return;
          }
          requestAnimationFrame(() =>
            ctx.add(() => {
              drawWave(0.9, 'power2.out');
              gsap.fromTo(
                qa(`.${scope.readings} dd`),
                {y: 6, autoAlpha: 0},
                {y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.06, clearProps: 'transform,opacity,visibility'},
              );
            }),
          );
        };
        scopeEl.addEventListener('click', onClick);
        undo.push(() => scopeEl.removeEventListener('click', onClick));
      }

      /* 3. Ribbon: scroll speed skews the rows (not the CSS-animated track). */
      const rows = qa(`.${home.ribbon} ul`);
      if (rows.length) {
        const skew = gsap.quickTo(rows, 'skewX', {duration: 0.5, ease: 'power3'});
        ScrollTrigger.create({
          onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
        });
      }

      /* 4. Section titles: words rise as each section enters. */
      qa(`.${home.secHead} h2, .${home.installText} h2`).forEach((h) => {
        const st = {trigger: h, start: 'top 85%'};
        gsap.from(split(h).words, {yPercent: 50, autoAlpha: 0, duration: 0.8, stagger: 0.05, ease, scrollTrigger: st});
        const box = h.closest(`.${home.secHead}, .${home.installText}`);
        if (box) {
          gsap.from(qa(`:scope > .${home.intro}, :scope > div > .${home.label}, :scope > .${home.label}`, box), {
            y: 14,
            autoAlpha: 0,
            duration: 0.6,
            ease,
            scrollTrigger: st,
          });
        }
      });

      /* 5. Features: the cards' contents come in on a stagger. The cards
       *    themselves stay put, so the ruled grid never shows a gap. */
      const cards = qa(`.${home.card}`);
      if (cards.length) {
        const tl = gsap.timeline({scrollTrigger: {trigger: `.${home.cards}`, start: 'top 80%'}});
        cards.forEach((c, i) => tl.from(Array.from(c.children), {y: 24, autoAlpha: 0, duration: 0.7, ease, stagger: 0.05}, i * 0.07));
      }

      /* 6. Ink band: the headline lights up word by word with the scroll. */
      const band = q(`.${home.bandHead} h2`);
      if (band) {
        gsap.fromTo(
          split(band).words,
          {opacity: 0.18},
          {opacity: 1, stagger: 0.15, ease: 'none', scrollTrigger: {trigger: band, start: 'top 80%', end: 'bottom 45%', scrub: true}},
        );
        gsap.from(`.${home.bandHead} > .${home.label}`, {y: 14, autoAlpha: 0, duration: 0.6, ease, scrollTrigger: {trigger: band, start: 'top 85%'}});
      }
      const cells = qa(`.${home.bandCell}`);
      if (cells.length) {
        const tl = gsap.timeline({scrollTrigger: {trigger: `.${home.bandGrid}`, start: 'top 85%'}});
        cells.forEach((c, i) => tl.from(Array.from(c.children), {y: 32, autoAlpha: 0, duration: 0.8, ease, stagger: 0.06}, i * 0.12));
      }

      /* 7. Measures: figures count up in the page's own number format (the
       *    unit is a sibling and never touched), then the stamps land. */
      const lang = html.lang || 'en';
      const mt = gsap.timeline({scrollTrigger: {trigger: `.${home.tbl}`, start: 'top 75%'}});
      qa(`.${home.tbl} tbody tr`).forEach((tr, i) => {
        const fig = q<HTMLElement>('[data-count]', tr);
        const stamp = q(`.${home.stamp}`, tr);
        mt.from(tr, {autoAlpha: 0, duration: 0.4, ease}, i * 0.12);
        if (fig) {
          const final = fig.textContent ?? '';
          const target = Number(fig.dataset.count);
          const dec = target < 100 ? 2 : 0;
          const fmt = new Intl.NumberFormat(lang, {
            minimumFractionDigits: dec,
            maximumFractionDigits: dec,
            useGrouping: 'always',
          } as unknown as Intl.NumberFormatOptions);
          const o = {v: 0};
          const restore = () => {
            fig.textContent = final;
            fig.style.minWidth = '';
          };
          mt.fromTo(
            o,
            {v: 0},
            {
              v: target,
              duration: 1.2,
              ease: 'power2.out',
              immediateRender: false,
              onStart: () => {
                // A monospace figure: the final width in ch, so the column never jumps.
                fig.style.minWidth = `${Array.from(final).length}ch`;
              },
              onUpdate: () => {
                fig.textContent = fmt.format(o.v);
              },
              onComplete: restore,
            },
            i * 0.12,
          );
          undo.push(restore);
        }
        if (stamp) {
          mt.from(stamp, {scale: 1.3, rotation: -8, transformOrigin: '100% 50%', autoAlpha: 0, duration: 0.35, ease: 'back.out(2.5)'}, i * 0.12 + 1);
        }
      });

      /* 8. Install: the steps tick in, the terminal prints line by line. */
      gsap.from(`.${home.steps} li`, {x: -14, autoAlpha: 0, duration: 0.5, stagger: 0.12, ease, scrollTrigger: {trigger: `.${home.steps}`, start: 'top 85%'}});
      const termEl = q(`.${term.term}`);
      if (termEl) {
        gsap.from(termEl, {y: 30, autoAlpha: 0, duration: 0.8, ease, scrollTrigger: {trigger: termEl, start: 'top 90%'}});
        gsap.from(qa(`.${term.ok}, .${term.last}`, termEl), {
          autoAlpha: 0,
          y: 4,
          duration: 0.3,
          stagger: 0.55,
          delay: 0.4,
          scrollTrigger: {trigger: termEl, start: 'top 75%'},
        });
      }

      /* 9. Closing: the headline assembles character by character with the scroll. */
      const closing = q(`.${home.closing} h2`);
      if (closing) {
        gsap.from(split(closing, true).chars, {
          yPercent: 60,
          autoAlpha: 0,
          rotation: 6,
          stagger: 0.025,
          ease: 'none',
          scrollTrigger: {trigger: closing, start: 'top 95%', end: 'top 45%', scrub: 0.6},
        });
        gsap.from(`.${home.closing} .${home.actions} > *`, {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.1,
          ease,
          scrollTrigger: {trigger: `.${home.closing} .${home.actions}`, start: 'top 92%'},
        });
      }

      /* Primary buttons: a small magnetic pull on devices that hover. */
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        qa(`.${home.btnPrimary}`).forEach((b) => {
          const x = gsap.quickTo(b, 'x', {duration: 0.4, ease: 'power3'});
          const y = gsap.quickTo(b, 'y', {duration: 0.4, ease: 'power3'});
          const move = (e: PointerEvent) => {
            const r = b.getBoundingClientRect();
            x((e.clientX - r.left - r.width / 2) * 0.25);
            y((e.clientY - r.top - r.height / 2) * 0.35);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          b.addEventListener('pointermove', move);
          b.addEventListener('pointerleave', leave);
          undo.push(() => {
            b.removeEventListener('pointermove', move);
            b.removeEventListener('pointerleave', leave);
          });
        });
      }
    }, el);

    // Web fonts change the heights the triggers were measured with.
    let alive = true;
    document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

    return () => {
      alive = false;
      undo.forEach((f) => f());
      ctx.revert();
      splits.reverse().forEach((s) => s.revert());
    };
  }, [root]);
}
