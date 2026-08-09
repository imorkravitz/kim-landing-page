import React, { useRef } from 'react';
import img_03fd56ba1_app_1 from '../../assets/remote/03fd56ba1_app_1.webp';
import img_4a45529a3_app_icon from '../../assets/remote/4a45529a3_app-icon.webp';
import img_4f0d4bec3_app_3 from '../../assets/remote/4f0d4bec3_app_3.webp';
import img_6a00d70d8_app_6 from '../../assets/remote/6a00d70d8_app_6.webp';
import img_77c6ca764_app_4 from '../../assets/remote/77c6ca764_app_4.webp';
import img_7b8e2dc17_app_2 from '../../assets/remote/7b8e2dc17_app_2.webp';
import img_cbbd3e3fd_app_5 from '../../assets/remote/cbbd3e3fd_app_5.webp';
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { trackCTA } from '@/lib/analytics';
import { Check, User, BarChart3, Clock, Zap } from 'lucide-react';
import CardSwap, { Card } from '@/components/ui/card-swap';
// Store badges are served from our own origin. They were hotlinked from
// upload.wikimedia.org, which is against Wikimedia's hotlinking policy, adds
// a third-party connection to the critical path, and leaves two visible gaps
// in the section if that host is slow or blocked.
import badgeAppStore from '../../assets/badges/app-store.svg';
import badgeGooglePlay from '../../assets/badges/google-play.svg';

const appImages = [
  {
    src: img_03fd56ba1_app_1,
    alt: "מעקב צעדים ויעדים יומיים"
  },
  {
    src: img_7b8e2dc17_app_2,
    alt: "יומן אוכל מצולם"
  },
  {
    src: img_4f0d4bec3_app_3,
    alt: "מעקב צעדים וגרפים"
  },
  {
    src: img_77c6ca764_app_4,
    alt: "מחשבון BMR"
  },
  {
    src: img_cbbd3e3fd_app_5,
    alt: "מעקב משקל"
  },
  {
    src: img_6a00d70d8_app_6,
    alt: "יומן אוכל יומי"
  }
];

const features = [
  {
    icon: Check,
    title: "מעקב חכם ופשוט",
    description: "צילום מנות, מעקב מים ופעילות יומית"
  },
  {
    icon: User,
    title: "ליווי אישי מתמיד",
    description: "קשר ישיר עם התזונאית דרך האפליקציה"
  },
  {
    icon: BarChart3,
    title: "מעקב משקל חכם",
    description: "גרפים ומדדים למעקב אחר ההתקדמות בתהליך"
  },
];

/**
 * CardSwap takes pixel dimensions, so the mockup has to be told how big it may
 * be rather than working it out from CSS. A 300px card plus its offset stack
 * needs ~390px of room; below that the stack has to shrink or it leaves the
 * viewport.
 */
function useMockupSize() {
  const read = () => {
    const w = typeof window === 'undefined' ? 1280 : window.innerWidth;
    if (w < 400) return { width: 208, height: 380, cardDistance: 20, verticalDistance: 16 };
    if (w < 640) return { width: 236, height: 430, cardDistance: 24, verticalDistance: 18 };
    return { width: 300, height: 540, cardDistance: 40, verticalDistance: 34 };
  };
  const [size, setSize] = React.useState(read);
  React.useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener('resize', onResize, { passive: true });
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

export default function AppSection() {
  const appRef = useRef(null);
  const isInView = useInView(appRef, { once: true, margin: "-100px" });
  const mockup = useMockupSize();

  return (
    <section
      id="app"
      className="section-lg bg-[var(--bg-secondary)] relative overflow-hidden"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          ref={appRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12 relative z-20"
        >
          {/* One header, not two. This block previously ran as an <h2> saying
              "הכירי את אפליקציית Liveat" followed immediately by a second
              centred block with the icon and an <h3> saying "אפליקציית Liveat"
              again — the app introduced itself twice, 16 units of margin apart,
              which is where a good chunk of the section's empty space came
              from. Both taglines are kept; only the repeated title is gone. */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg border border-gray-100">
            <img
              src={img_4a45529a3_app_icon}
              alt="אפליקציית Liveat"
              width="96"
              height="96"
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-heading text-gray-900 mb-4">הכירי את אפליקציית Liveat</h2>
          <div className="w-16 h-1 bg-[var(--brand-surface)] mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            האפליקציה הייחודית שפותחה במיוחד עבור המטופלות שלי — הכלי המושלם למסע התזונתי שלך
          </p>
        </motion.div>

        {/* gap-36 was 144px of nothing between the mockup and the benefits at
            every width. items-center pairs the two columns off their middles
            rather than hanging the shorter one from the top. */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Side - Phone Mockups */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            /* order-2 put the benefits above the mockup on mobile, so the
               section explained the app before showing it. */
            className="relative order-1 lg:pr-8"
          >
            {/* Height follows the card plus the room the offset stack needs
                above it, so the deepest card no longer reaches into the
                heading that sits above this column. */}
            <div
              className="relative flex items-end justify-center lg:justify-end lg:pr-8"
              style={{ height: mockup.height + mockup.verticalDistance * 3 + 24 }}
            >
              <CardSwap
                width={mockup.width}
                height={mockup.height}
                cardDistance={mockup.cardDistance}
                verticalDistance={mockup.verticalDistance}
                delay={4000}
                pauseOnHover={true}
                skewAmount={4}
              >
                {appImages.map((image, index) => (
                  <Card key={index}>
                    <div className="w-full h-full bg-black rounded-[3rem] p-2.5 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-10"></div>
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>

          </motion.div>

          {/* Right Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 order-2"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-right">איך האפליקציה עוזרת לך בתהליך?</h3>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start gap-4 text-right">
                    <div className="w-12 h-12 bg-[var(--brand-surface)]/10 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-[var(--brand-ink)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Download CTA lifted out of the mockup column. Inside it, mobile
            order ran title, mockup, download, benefits — the ask to install
            arrived before the reasons to. Below the grid it closes the
            section for both layouts. */}
      <div className="text-center mt-12 space-y-4">
        <a href="https://onelink.to/zter3n" target="_blank" rel="noopener noreferrer" onClick={() => trackCTA('app_download', 'app')}>
          <Button
            size="lg"
            className="bg-[var(--brand-surface)] text-white font-medium px-8 py-6 text-lg rounded-2xl shadow-[0_4px_6px_-1px_rgba(139,127,75,0.4)] hover:bg-[var(--brand-dark)] hover:shadow-[0_10px_15px_-3px_rgba(139,127,75,0.3)] hover:-translate-y-[2px] active:translate-y-[1px] active:shadow-none transition-all duration-200"
          >
            הורידי את האפליקציה בחינם
          </Button>
        </a>

        <div className="flex justify-center items-center gap-4 pt-4">
          <a
            href="https://apps.apple.com/il/app/liveat-%D7%9C%D7%97%D7%99%D7%99%D7%9D-%D7%91%D7%A8%D7%99%D7%90%D7%99%D7%9D-%D7%99%D7%95%D7%AA%D7%A8/id1559762957?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={badgeAppStore} 
              alt="הורידי מ-App Store" width="180" height="60" 
              className="h-12 w-auto" 
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.levelapp.liveat"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-105 transition-transform duration-300"
          >
            <img 
              src={badgeGooglePlay} 
              alt="הורידי מ-Google Play" width="180" height="60" 
              className="h-12 w-auto" 
            />
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}