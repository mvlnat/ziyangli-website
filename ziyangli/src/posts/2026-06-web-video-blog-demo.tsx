import React, {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import narrations from './web-video-blog-demo/narrations';

const CHAPTER = {
  id: 'web-video-blog-demo',
  title: 'Why It Works',
  narrations,
};

const TAKEAWAYS = [
  {
    num: '01',
    title: 'Layout',
    body: 'CSS gives exact control over the frame.',
  },
  {
    num: '02',
    title: 'Motion',
    body: 'State changes can act like edited cuts.',
  },
  {
    num: '03',
    title: 'Capture',
    body: 'The page can hide UI and record cleanly.',
  },
];

const PLATFORMS = ['YouTube', 'Bilibili', 'Shorts', 'Reels', 'Demos'];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

function useStageScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return scale;
}

function useStepper(totalSteps: number) {
  const [step, setStep] = useState(0);

  const next = useCallback(() => {
    setStep(current => clamp(current + 1, 0, totalSteps - 1));
  }, [totalSteps]);

  const prev = useCallback(() => {
    setStep(current => clamp(current - 1, 0, totalSteps - 1));
  }, [totalSteps]);

  const jumpToStep = useCallback((target: number) => {
    setStep(clamp(target, 0, totalSteps - 1));
  }, [totalSteps]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) {
        return;
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        next();
      } else if (event.key === 'ArrowLeft' || event.key === 'Backspace') {
        event.preventDefault();
        prev();
      } else if (event.key === 'Home') {
        jumpToStep(0);
      } else if (event.key === 'End') {
        jumpToStep(totalSteps - 1);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [jumpToStep, next, prev, totalSteps]);

  return { step, next, jumpToStep };
}

function Stage({ onAdvance, children }: { onAdvance(): void; children: ReactNode }) {
  const scale = useStageScale();
  const fitterStyle: CSSProperties = {
    width: 1920 * scale,
    height: 1080 * scale,
  };
  const frameStyle: CSSProperties = {
    transform: `scale(${scale})`,
  };

  return (
    <div className="wvbd-app-shell">
      <div className="wvbd-stage-fitter" style={fitterStyle}>
        <div
          className="wvbd-stage-frame"
          style={frameStyle}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('button, a, input, [data-no-advance]')) {
              return;
            }
            onAdvance();
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ProgressBar({
  step,
  onJumpStep,
}: {
  step: number;
  onJumpStep(step: number): void;
}) {
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [step]);

  return (
    <div className="wvbd-pb-hover" data-no-advance>
      <div className="wvbd-pb">
        <button
          ref={activeRef}
          className="wvbd-pb-chapter wvbd-pb-active"
          onClick={(event) => {
            event.stopPropagation();
            onJumpStep(0);
          }}
        >
          <span className="wvbd-pb-num">01</span>
          <span className="wvbd-pb-title">{CHAPTER.title}</span>
          <span className="wvbd-pb-pips" aria-label="Jump to step">
            {CHAPTER.narrations.map((_, index) => (
              <span
                key={index}
                className={`wvbd-pb-pip ${index <= step ? 'wvbd-pb-pip-on' : ''}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onJumpStep(index);
                }}
              />
            ))}
          </span>
        </button>
      </div>
    </div>
  );
}

function MaskReveal({
  show,
  delay = 0,
  duration = 900,
  children,
}: {
  show: boolean;
  delay?: number;
  duration?: number;
  children: ReactNode;
}) {
  return (
    <span
      className={`wvbd-mask ${show ? 'wvbd-mask-show' : ''}`}
      style={{ '--wvbd-delay': `${delay}ms`, '--wvbd-duration': `${duration}ms` } as CSSProperties}
    >
      <span>{children}</span>
    </span>
  );
}

function WebVideoChapter({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="wvbd-scene wvbd-scene-pad wvbd-cover" key={step}>
        <header className="wvbd-masthead">
          <span className="wvbd-brand">Web Video Presentation</span>
          <span className="wvbd-issue">Demo · Why It Works</span>
        </header>
        <hr className="wvbd-rule" />

        <div className="wvbd-cover-body">
          <div className="wvbd-kicker">from blog to video</div>
          <h1 className="wvbd-cover-h">
            <MaskReveal show duration={1000}>
              A blog is the source.
            </MaskReveal>
            <MaskReveal show delay={320} duration={1000}>
              <span className="wvbd-em"> The stage is the product.</span>
            </MaskReveal>
          </h1>

          <div className="wvbd-comparison">
            <div className="wvbd-reader card">
              <span>01 blog</span>
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="wvbd-arrow" aria-hidden>→</div>
            <div className="wvbd-viewer card">
              <span>02 web stage</span>
              <strong>clickable frames</strong>
            </div>
            <div className="wvbd-arrow" aria-hidden>→</div>
            <div className="wvbd-video-card card">
              <span>03 video</span>
              <strong>post anywhere</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="wvbd-scene wvbd-scene-pad wvbd-split" key={step}>
        <div className="wvbd-split-num hero-num">01</div>
        <div className="wvbd-split-body">
          <div className="wvbd-kicker">why not just ppt?</div>
          <h2 className="wvbd-split-h">
            <MaskReveal show duration={900}>
              PPT gives rhythm.
            </MaskReveal>
            <MaskReveal show delay={280} duration={900}>
              <span className="wvbd-em"> Web gives control.</span>
            </MaskReveal>
          </h2>
          <p className="wvbd-split-p">
            Slides are good because they click forward and record well. A web stage
            keeps that flow, then adds programmable layout, animation, state, and media.
          </p>
        </div>
        <div className="wvbd-control-compare" aria-hidden>
          <div className="wvbd-control-card wvbd-control-ppt">
            <span>PPT</span>
            <strong>slides</strong>
            <i>easy to record</i>
          </div>
          <div className="wvbd-control-card wvbd-control-web">
            <span>Web</span>
            <strong>slides + code</strong>
            <i>layout · motion · state · media</i>
          </div>
        </div>
      </div>
    );
  }

  if (step >= 2 && step <= 4) {
    const activeIdx = step - 2;
    return (
      <div className="wvbd-scene wvbd-scene-pad wvbd-list" key={step}>
        <header className="wvbd-list-head">
          <span className="wvbd-rule-line" />
          <span className="wvbd-kicker">what the website controls</span>
          <span className="wvbd-rule-line" />
        </header>
        <h2 className="wvbd-list-h">More than slide transitions.</h2>
        <div className="wvbd-slot-grid">
          {TAKEAWAYS.map((item, index) => (
            <TakeawaySlot
              key={item.num}
              item={item}
              state={index < activeIdx ? 'past' : index === activeIdx ? 'active' : 'ghost'}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="wvbd-scene wvbd-scene-pad wvbd-memory" key={step}>
        <div className="wvbd-kicker">recording advantage</div>
        <h2 className="wvbd-memory-h">
          A website can become a clean video stage.
        </h2>
        <p className="wvbd-memory-p">
          No blog chrome, no visible controls, no accidental browser UI inside the
          recording. Just a 16:9 frame designed for capture.
        </p>
        <div className="wvbd-memory-map" aria-hidden>
          <div className="wvbd-map-node">web stage</div>
          <svg viewBox="0 0 760 260">
            <path d="M110 130 C250 22 366 238 502 130 S690 96 704 128" />
          </svg>
          <div className="wvbd-map-node">screen record</div>
          <div className="wvbd-map-node">video file</div>
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="wvbd-scene wvbd-scene-pad wvbd-close" key={step}>
        <div className="wvbd-capture-frame" aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="wvbd-close-inner">
          <div className="wvbd-kicker">why this matters</div>
          <h2 className="wvbd-close-h">
            <MaskReveal show duration={1000}>
              Build once as a website.
            </MaskReveal>
            <MaskReveal show delay={300} duration={1000}>
              <span className="wvbd-em"> Post everywhere as video.</span>
            </MaskReveal>
          </h2>
          <p className="wvbd-close-p">
            The blog becomes a controllable presentation, the presentation becomes a
            recording, and the recording works on platforms where video travels better
            than a link.
          </p>
          <div className="wvbd-platform-row" aria-hidden>
            {PLATFORMS.map(platform => (
              <span key={platform}>{platform}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wvbd-scene wvbd-scene-pad wvbd-close" key={step}>
      <div className="wvbd-cta-inner">
        <div className="wvbd-kicker">want the ai skill?</div>
        <h2 className="wvbd-cta-h">
          <MaskReveal show duration={1000}>
            Email me for details.
          </MaskReveal>
        </h2>
        <a className="wvbd-email-card" href="mailto:hello@ziyang.li" data-no-advance>
          hello@ziyang.li
        </a>
      </div>
    </div>
  );
}

function TakeawaySlot({
  state,
  item,
}: {
  state: 'ghost' | 'active' | 'past';
  item: { num: string; title: string; body: string };
}) {
  return (
    <div className={`wvbd-slot wvbd-slot-${state}`}>
      <div className="wvbd-slot-num">{item.num}</div>
      <div className="wvbd-slot-content">
        {state !== 'ghost' && (
          <>
            <MaskReveal show duration={900} key={`${item.num}-title`}>
              <div className="wvbd-slot-title">{item.title}</div>
            </MaskReveal>
            {state === 'active' && (
              <MaskReveal show delay={300} duration={900}>
                <div className="wvbd-slot-body">{item.body}</div>
              </MaskReveal>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const WebVideoBlogDemo: React.FC = () => {
  const stepper = useStepper(CHAPTER.narrations.length);

  useEffect(() => {
    if (CHAPTER.narrations.length !== 8) {
      throw new Error('web-video-blog-demo: narrations length must match chapter step branches.');
    }
  }, []);

  return (
    <section className="wvbd-shell" aria-label="Interactive web video blog demo">
      <Stage onAdvance={stepper.next}>
        <div className={`scene wvbd-step-${stepper.step + 1}`}>
          <WebVideoChapter step={stepper.step} />
        </div>
      </Stage>
      <ProgressBar step={stepper.step} onJumpStep={stepper.jumpToStep} />
    </section>
  );
};

export default WebVideoBlogDemo;
