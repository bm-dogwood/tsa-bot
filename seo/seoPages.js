/**
 * TSA.BOT — SEO Hidden Content Pages
 *
 * 7 pages targeting high-volume search keywords.
 * Each page: 800-1500 words, unique meta tags, Schema.org JSON-LD
 * NOT in main nav, but included in sitemap.xml
 *
 * Pages:
 *  1. /airport-security-wait-times       → "tsa wait times"
 *  2. /tsa-precheck-vs-clear             → "tsa precheck vs clear"
 *  3. /what-can-you-bring-on-a-plane     → "what can you bring on a plane"
 *  4. /airport-delays-today              → "airport delays today"
 *  5. /real-id-requirements-2026         → "real id requirements"
 *  6. /tsa-precheck-application          → "tsa precheck enrollment"
 *  7. /liquid-rules-carry-on             → "carry on liquid rules"
 *
 * Usage: These are React components or can be exported as static HTML.
 * Each exports: default component + metadata (title, description, schema)
 */

// ─── Shared schema helpers ────────────────────────────────────────────────────
"use client";
const SITE = {
  name: "TSA.BOT",
  url: "https://tsa.bot",
  description:
    "Real-time airport delay tracker, TSA wait times & flight status",
  logo: "https://tsa.bot/logo.png",
  sameAs: [],
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export const seoPages = {
  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 1: /airport-security-wait-times
  // Target: "tsa wait times", "airport security wait times", "how long is tsa line"
  // ══════════════════════════════════════════════════════════════════════════════

  "/airport-security-wait-times": {
    meta: {
      title: "TSA Wait Times by Airport — Live Security Line Updates | TSA.BOT",
      description:
        "Check live TSA wait times at all major US airports. See current security line waits at LAX, JFK, ORD, ATL, DFW and 400+ airports. Updated every 10 minutes from TSA MyTSA.",
      keywords:
        "tsa wait times, airport security wait times, how long is tsa line, tsa line wait, security checkpoint wait time",
      canonical: "https://tsa.bot/airport-security-wait-times",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I check TSA wait times before I go to the airport?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can check live TSA wait times on TSA.BOT, the TSA MyTSA app (iOS/Android), or at apps.tsa.dhs.gov. Wait times are updated every 10-15 minutes and show estimated wait by security checkpoint and terminal.",
            },
          },
          {
            "@type": "Question",
            name: "What time are TSA lines shortest?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TSA lines are typically shortest between 9 AM–11 AM and 2 PM–4 PM on weekdays. Early mornings (4–6 AM) can be busy with business travelers. Avoid Monday mornings and Friday afternoons, which tend to have the longest wait times.",
            },
          },
          {
            "@type": "Question",
            name: "How early should I arrive at the airport for TSA security?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TSA recommends arriving 2 hours before domestic flights and 3 hours before international flights. During peak travel periods (holidays, summer), add an extra 30–60 minutes. TSA PreCheck members can typically arrive 90 minutes before domestic flights.",
            },
          },
          {
            "@type": "Question",
            name: "Does TSA PreCheck have shorter wait times?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. TSA PreCheck lanes average 5 minutes or less, compared to 15–30 minutes for standard lanes. PreCheck members keep shoes on, laptops in bags, and use dedicated shorter lines at over 200 US airports.",
            },
          },
          {
            "@type": "Question",
            name: "Which airports have the longest TSA wait times?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Historically, the airports with the longest TSA wait times are LAX (Los Angeles), O'Hare (ORD), JFK (New York), Hartsfield-Jackson Atlanta (ATL), and Denver International (DEN) during peak travel periods.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "TSA Wait Times by Airport",
        url: "https://tsa.bot/airport-security-wait-times",
        description:
          "Live TSA security line wait times for all major US airports",
        dateModified: new Date().toISOString(),
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "TSA.BOT",
              item: "https://tsa.bot",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "TSA Wait Times",
              item: "https://tsa.bot/airport-security-wait-times",
            },
          ],
        },
      },
    ],
    content: `
  # TSA Wait Times by Airport — Live Security Line Updates
  
  Whether you're racing to catch a morning flight or planning ahead for a holiday trip, knowing your TSA wait time can mean the difference between a relaxed journey and a panicked sprint through the terminal. TSA.BOT tracks live security checkpoint wait times at over 400 US airports, updated every 10 minutes directly from the TSA MyTSA data feed.
  
  ## How to Check Live TSA Wait Times
  
  Use the widget above to look up real-time TSA wait times at any US airport. Enter your three-letter airport code (LAX, JFK, ORD, ATL, etc.) and instantly see:
  
  - **Current wait time** by checkpoint and terminal
  - **TSA PreCheck lane** availability and estimated wait
  - **Peak hours** indicator showing how busy the checkpoint is right now
  - **Historical average** for the same day and time of week
  
  Our data comes directly from the TSA's official MyTSA app feed (apps.tsa.dhs.gov), the same source the TSA app itself uses. We refresh every 10 minutes throughout the day.
  
  ## When Are TSA Lines Shortest?
  
  Timing your arrival strategically can cut your wait time significantly. Based on historical TSA data across major airports:
  
  **Quietest security times:**
  - Weekday mid-mornings (9:00–11:00 AM)
  - Early afternoons (1:00–3:00 PM)
  - Late evenings after 8:00 PM
  
  **Busiest security times:**
  - Monday mornings (business travel rush)
  - Friday afternoons (weekend departures)
  - Sunday evenings (return travel)
  - Holiday travel windows (Thanksgiving, Christmas, Memorial Day, Labor Day)
  
  If you have scheduling flexibility, flying Tuesday through Thursday generally means shorter lines at security.
  
  ## TSA PreCheck: The Single Best Way to Cut Wait Times
  
  If you frequently travel through US airports, TSA PreCheck is the single most impactful way to reduce your security experience. PreCheck members:
  
  - Use dedicated, shorter security lanes at **200+ US airports**
  - Keep laptops and liquids in their bag
  - Leave shoes, belts, and light jackets on
  - Average **just 5 minutes** or less in line
  
  **Cost:** $85 for 5 years ($17/year). Application takes about 15 minutes online, followed by a brief in-person appointment for fingerprinting and identity verification. Many credit cards (Chase Sapphire, Amex Platinum, Capital One Venture) reimburse the application fee.
  
  ## Busiest US Airports by TSA Wait Times
  
  The following airports consistently report the highest average security wait times. If you're flying through any of these, add extra buffer to your arrival time:
  
  **Consistently busy airports:**
  - **LAX** (Los Angeles): Multiple terminals, complex layout — arrive 2.5–3 hours early on busy days
  - **O'Hare (ORD)**: High volume, often 30+ minute waits during peak periods
  - **JFK** (New York): Heavily international traffic, variable waits by terminal
  - **ATL** (Atlanta): World's busiest airport — has multiple dedicated PreCheck lanes to manage volume
  - **DFW** (Dallas/Fort Worth): Multiple terminals, waits vary significantly by terminal
  
  ## Tips to Get Through Security Faster
  
  Even without TSA PreCheck, you can speed up your time through security:
  
  1. **Wear slip-on shoes** and avoid belts or heavy jewelry
  2. **Pre-organize your bag** — laptop and liquids accessible for removal
  3. **Use the TSA.BOT widget** to pick the shortest checkpoint at multi-checkpoint airports
  4. **Avoid checking in at the counter** — mobile boarding passes are faster
  5. **Travel with only carry-on** — no checked bag means straight to security
  6. **Consider CLEAR** — biometric identity verification lets you skip the ID check line (available at 50+ airports)
  
  ## Airport Security Wait Times FAQ
  
  ### How accurate are TSA wait time estimates?
  
  TSA wait times are self-reported by TSA officers at each checkpoint every 15 minutes. They represent the estimated wait for a new traveler joining the line at that moment. Actual experience may vary by ±5 minutes.
  
  ### Can I see TSA wait times for a specific terminal?
  
  Yes. At major airports, wait times are broken out by terminal and checkpoint. Use our airport lookup tool above and select your airport to see terminal-by-terminal breakdown.
  
  ### Is there a TSA wait time app?
  
  Yes — the **TSA MyTSA app** (free, iOS and Android) is the official TSA application for wait time lookups. TSA.BOT provides the same data in a web-based format with additional features like flight status integration and delay alerts.
  
  ### What happens if TSA wait times are unavailable for my airport?
  
  Not all airports report wait times to the MyTSA system. Smaller regional airports and some international terminals may not have data available. In these cases, we recommend calling your airline's travel desk or checking the airport's official website.
  
  ## Real-Time Security Alerts
  
  Beyond wait times, TSA.BOT also tracks active security alerts from the TSA's official RSS feed. These include checkpoint closures, staffing changes, and enhanced screening notifications that could affect your travel. Enable alerts in your profile to receive notifications for your home airport.
  
  *Data sourced from TSA MyTSA (apps.tsa.dhs.gov/mytsa) · Updated every 10 minutes*
    `.trim(),
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 2: /tsa-precheck-vs-clear
  // Target: "tsa precheck vs clear", "is clear worth it", "precheck or clear"
  // ══════════════════════════════════════════════════════════════════════════════

  "/tsa-precheck-vs-clear": {
    meta: {
      title: "TSA PreCheck vs CLEAR: Which Is Worth It in 2026? | TSA.BOT",
      description:
        "Comparing TSA PreCheck vs CLEAR — costs, benefits, wait times, and which is worth it for your travel style. Full 2026 comparison with enrollment details.",
      keywords:
        "tsa precheck vs clear, clear vs precheck, is clear worth it, precheck or clear, tsa precheck enrollment, clear biometric",
      canonical: "https://tsa.bot/tsa-precheck-vs-clear",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Should I get TSA PreCheck or CLEAR?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For most travelers, TSA PreCheck provides better overall value. It's cheaper ($85 for 5 years vs $189/year for CLEAR), available at more airports (200+ vs 50+), and eliminates the security screening bottleneck entirely. CLEAR adds the most value if you frequently travel through CLEAR airports and want to skip the ID/document check line entirely. Many frequent travelers get both.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use CLEAR without TSA PreCheck?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. CLEAR handles the identity verification portion of security (confirming you are who your boarding pass says you are) and moves you to the front of the document check line. However, you still go through standard TSA screening afterward unless you also have PreCheck. CLEAR + PreCheck is the fastest combination.",
            },
          },
          {
            "@type": "Question",
            name: "How much does CLEAR cost in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "CLEAR costs $189 per year for an individual membership. Family plans add members at reduced rates. Delta SkyMiles members get discounted rates ($119–$149/year). Some credit cards (Delta Amex, United Club) include free CLEAR membership as a benefit.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: "TSA PreCheck vs CLEAR: Complete 2026 Comparison",
        url: "https://tsa.bot/tsa-precheck-vs-clear",
        datePublished: "2026-01-01",
        dateModified: new Date().toISOString(),
        author: { "@type": "Organization", name: "TSA.BOT" },
        publisher: {
          "@type": "Organization",
          name: "TSA.BOT",
          url: "https://tsa.bot",
        },
      },
    ],
    content: `
  # TSA PreCheck vs CLEAR: Which Is Worth It in 2026?
  
  If you travel more than a few times per year, investing in a trusted traveler program can save hours of standing in security lines. But which one? TSA PreCheck and CLEAR are the two most popular options — they sound similar but actually solve different problems at the security checkpoint.
  
  ## What Each Program Actually Does
  
  Understanding the difference starts with understanding how airport security works. When you reach the checkpoint, two things happen in sequence:
  
  1. **Identity verification**: A TSA officer checks your ID and boarding pass to confirm you are who you say you are
  2. **Security screening**: You go through the scanner, remove shoes/laptops/liquids, and pass through the X-ray belt
  
  **CLEAR** solves problem #1. It uses biometrics (fingerprints or iris scan) to verify your identity instantly, letting you skip to the front of the document check line. A CLEAR "ambassador" walks you directly past the queue to the ID podium.
  
  **TSA PreCheck** solves problem #2. It pre-vets you through a background check and grants you access to a dedicated, expedited screening lane where you don't remove shoes, belts, or laptops, and liquids stay in your bag.
  
  The key insight: **they do different things, and both together is faster than either alone.**
  
  ## Side-by-Side Comparison
  
  | Feature | TSA PreCheck | CLEAR |
  |---------|-------------|-------|
  | **Annual cost** | $85 / 5 years ($17/year) | $189/year |
  | **Airports** | 200+ US airports | 50+ US airports |
  | **What it skips** | Security screening queue | ID verification queue |
  | **Biometrics required** | No | Yes (finger/iris) |
  | **Shoes off** | No | Standard screening still required |
  | **Background check** | Yes (FBI fingerprinting) | No |
  | **International travel** | TSA only (domestic) | Airport-dependent |
  | **Kids included** | Under 12 free | 18 & under free |
  | **Application time** | ~15 min online + in-person | ~5 min at kiosk |
  | **Credit card reimbursement** | Many cards | Delta Amex, United Club |
  
  ## When TSA PreCheck Is the Better Choice
  
  **Choose PreCheck if:**
  - You want the best bang for your buck ($17/year is hard to beat)
  - You fly through a wide variety of airports — PreCheck's 200+ airports dwarfs CLEAR's 50+
  - You're primarily doing domestic travel
  - Your biggest frustration is the slow security screening lane, not the ID check line
  - Your credit card doesn't cover CLEAR fees
  
  TSA PreCheck is the foundation. For most travelers who take 5–15 trips per year, it's the one program that meaningfully changes the security experience.
  
  ## When CLEAR Is Worth the Extra Cost
  
  **CLEAR adds real value if:**
  - You're a frequent flyer (15+ trips/year) through CLEAR-enabled airports
  - Your primary hubs are major airports that support CLEAR (JFK, LAX, ORD, SFO, ATL, etc.)
  - You have a credit card or airline loyalty benefit that covers the $189/year
  - You use CLEAR's stadium and entertainment venue access (it's expanding beyond airports)
  - You're already a TSA PreCheck member and want maximum speed
  
  ## The Fastest Combination: CLEAR + PreCheck
  
  If you have both, here's what happens at a CLEAR + PreCheck airport:
  1. A CLEAR ambassador scans your biometrics and walks you past the ID line (30 seconds)
  2. You proceed directly to the PreCheck lane (no shoes, no laptop removal)
  3. Average total time through security: **under 5 minutes**
  
  For frequent travelers at major airports, this combination is transformative.
  
  ## How to Get TSA PreCheck in 2026
  
  1. **Apply online** at tsa.gov — takes about 15 minutes
  2. **Schedule an in-person appointment** at one of 500+ enrollment centers (many at airports, UPS Stores, and AAA offices)
  3. **Bring two forms of ID** (passport + driver's license, or passport alone)
  4. **Get fingerprinted** and pay the $85 fee
  5. **Receive your Known Traveler Number (KTN)** — add it to all airline profiles
  6. **Approval in 2–3 days** to several weeks depending on background check
  
  **Pro tip:** Many credit cards (Chase Sapphire Preferred, Amex Platinum, Capital One Venture, Citi AAdvantage, etc.) provide up to $100 in statement credits for Global Entry or TSA PreCheck fees. **Global Entry ($100) includes TSA PreCheck** and adds expedited customs re-entry for international travelers — it's the best deal if you travel internationally even once every 5 years.
  
  ## How to Sign Up for CLEAR in 2026
  
  1. **Sign up at clearme.com** or at a CLEAR kiosk at any enrolled airport or stadium
  2. **Verify your identity** with your ID and biometrics (takes about 5 minutes)
  3. **Pay $189/year** (or use a partner discount via Delta, United, or credit card benefit)
  4. **Use CLEAR at any enrolled location** — just approach the CLEAR pod and scan your finger or eyes
  
  ## Bottom Line
  
  For most US travelers: **Get TSA PreCheck first.** It's the highest-value investment you can make in your travel experience. The $85 / 5-year cost works out to less than $4 per trip if you fly monthly.
  
  Add **CLEAR** if you're a frequent flyer who regularly passes through CLEAR airports and either has a credit card that covers it or doesn't mind the $189/year for the biometric fast lane.
  
  And if you're a road warrior doing 25+ trips per year through major hubs? **Get both.**
  
  *Check real-time TSA wait times at your airport using our live tracker above.*
    `.trim(),
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 3: /what-can-you-bring-on-a-plane
  // Target: "what can you bring on a plane", "what is allowed on a plane"
  // ══════════════════════════════════════════════════════════════════════════════

  "/what-can-you-bring-on-a-plane": {
    meta: {
      title: "What Can You Bring on a Plane? TSA Rules 2026 | TSA.BOT",
      description:
        "Complete guide to TSA rules: what's allowed in carry-on and checked bags in 2026. Liquids, electronics, food, medications, weapons, and prohibited items.",
      keywords:
        "what can you bring on a plane, tsa carry on rules, what is allowed on a plane, tsa prohibited items, carry on rules",
      canonical: "https://tsa.bot/what-can-you-bring-on-a-plane",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What are the TSA liquid rules for carry-on bags?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The TSA 3-1-1 liquid rule allows liquids, gels, aerosols, creams, and pastes in containers of 3.4 ounces (100ml) or less, all fitting in 1 clear quart-sized bag, with 1 bag per passenger. Liquids over 3.4oz must go in checked baggage. Exceptions include medications, baby formula, and breast milk.",
            },
          },
          {
            "@type": "Question",
            name: "Can I bring food through TSA security?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, most solid foods are allowed through TSA security in carry-on bags. Solid food must be placed in a bin for X-ray screening. Liquid or gel foods (yogurt, peanut butter, jam) over 3.4oz are subject to the liquids rule and should go in checked baggage or be under the limit.",
            },
          },
          {
            "@type": "Question",
            name: "Can I bring medications on a plane?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Medications in pill form or solid form are allowed in unlimited quantities in carry-on bags. Liquid medications are exempt from the 3.4oz limit — you must declare them at the checkpoint. Keep medications in original prescription bottles when possible. Needles and syringes are allowed with proof of medical need.",
            },
          },
          {
            "@type": "Question",
            name: "Are laptops allowed in carry-on bags?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, laptops and large electronics are allowed in carry-on bags. At standard TSA checkpoints, laptops must be removed from bags and placed in a separate bin. TSA PreCheck members can leave laptops in their bags.",
            },
          },
        ],
      },
    ],
    content: `
  # What Can You Bring on a Plane? TSA Rules 2026
  
  One of the most searched travel questions every year: "what can I bring on a plane?" TSA rules can feel confusing, but the core framework is straightforward. This guide covers everything you need to know about what's allowed in carry-on and checked baggage in 2026.
  
  ## The Golden Rule: Carry-On vs. Checked
  
  Most items are allowed on planes — the key question is *where* they go. TSA has two categories:
  
  - **Carry-on bag**: The bag that goes in the overhead bin or under your seat. Strict rules apply for liquids. Security screening required.
  - **Checked bag**: The bag checked at the counter and placed in cargo. More lenient on liquids, stricter on some items (like lithium batteries).
  
  Some items are **prohibited entirely** from both. These are uncommon — the vast majority of what you pack is fine.
  
  ## The TSA 3-1-1 Liquid Rule (Carry-On)
  
  The most important carry-on rule:
  
  **3.4 oz (100ml)** or less per container  
  **1** quart-sized clear plastic bag  
  **1** bag per passenger
  
  This applies to: liquids, gels, aerosols, creams, pastes, and lotions. Toothpaste, shampoo, lotion, makeup, sunscreen — all 3-1-1.
  
  **Exceptions to the liquid rule (no size limit):**
  - Prescription and over-the-counter medications
  - Baby formula and breast milk (declare at checkpoint)
  - Juice for infants and toddlers
  - Contact lens solution (medically necessary amounts)
  
  Liquids over 3.4oz belong in your **checked bag** — or buy them after security.
  
  ## Electronics: What to Do at Security
  
  **Carry-on allowed:**
  - Laptops and tablets (must be removed from bags at standard screening)
  - Smartphones, cameras, e-readers
  - Portable phone chargers / power banks (**only** carry-on — not checked bags, due to lithium battery fire risk)
  - Wireless headphones, smart watches
  
  **TSA PreCheck:** You can leave laptops and tablets in your bag — no removal required.
  
  **Important:** Lithium battery-powered devices (laptops, power banks) must go in your **carry-on**, not checked bags. Airlines and FAA prohibit loose lithium batteries in cargo.
  
  ## Food and Drinks
  
  **Solid food:** Allowed in carry-on. Must be placed in a bin for X-ray screening. Sandwiches, snacks, fruit, chips — all fine.
  
  **Liquid/gel food over 3.4oz:** Subject to 3-1-1 rule. Yogurt, peanut butter, jam, soup, pudding over 3.4oz should go in checked baggage.
  
  **Alcohol:** Commercially bottled alcohol 3.4oz or less can go in carry-on 3-1-1 bag. Bottles over 3.4oz go in checked baggage (up to 5L of spirits between 24%–70% ABV).
  
  **Baby food and formula:** Exempt from 3-1-1 rule. Bring what you need — declare it at the checkpoint.
  
  ## Medications and Medical Equipment
  
  TSA makes accommodations for medical needs:
  
  - **Prescription medications** (pills, tablets): Unlimited quantity, carry-on or checked
  - **Liquid medications**: Exempt from 3.4oz limit — must declare at checkpoint
  - **Insulin and syringes**: Allowed with medication. Inform officer you're carrying these.
  - **CPAP machines**: Allowed in carry-on. Remove from bag for X-ray.
  - **Wheelchairs and mobility aids**: Screened separately, never separated from you without consent
  - **Prosthetics**: Allowed. Inform TSA officers before screening begins.
  
  ## Prohibited Items: What You Can't Bring
  
  **Prohibited in both carry-on AND checked bags:**
  - Explosive or incendiary devices
  - Firearms with loaded ammunition (unloaded firearms in locked hard cases are allowed in checked bags with airline notification)
  - Flammable liquids (gas, lighter fluid, paint thinner)
  - Aerosol cans over 18oz in carry-on (some limitations in checked)
  - Self-defense sprays over 4oz (checked bag only, under 4oz)
  
  **Prohibited in carry-on only (allowed in checked):**
  - Firearms (unloaded, locked, declared — checked only)
  - Baseball bats and sporting equipment with blunt force potential
  - Most tools (hammers, drills) over 7 inches
  - Crowbars, axes, hatchets
  - Sharp objects: box cutters, straight razors, sabers
  
  **Always prohibited (no exceptions):**
  - Explosives, blasting caps, dynamite
  - Chlorine and tear gas
  - Strike-anywhere matches (safety matches are OK)
  
  ## Sporting Equipment
  
  Most sporting equipment goes in **checked baggage**. Items like golf clubs, ski equipment, fishing rods, hockey sticks, and bats are checked bag items.
  
  **Carry-on allowed:** Fishing hooks, small knitting needles, single blade disposable razors (not box cutters).
  
  ## The Full TSA "What's Allowed" Database
  
  For any specific item, the TSA's official "What Can I Bring?" search tool at tsa.gov/travel/security-screening/whatcanibring/all lets you type any item and get instant clarification. When in doubt — check there or pack it in your checked bag.
  
  ## Quick Summary: Most Common Items
  
  | Item | Carry-On | Checked |
  |------|----------|---------|
  | Laptop | ✓ (remove for screening) | ✓ |
  | Phone charger | ✓ | ✓ |
  | Power bank | ✓ only | ✗ |
  | Toiletries ≤3.4oz | ✓ (in 3-1-1 bag) | ✓ |
  | Toiletries >3.4oz | ✗ | ✓ |
  | Food (solid) | ✓ | ✓ |
  | Prescription meds | ✓ | ✓ |
  | Razor (disposable) | ✓ | ✓ |
  | Pocket knife | ✗ | ✓ |
  | Firearm (unloaded) | ✗ | ✓ (declared) |
  | Aerosol spray | ✓ (≤3.4oz in 3-1-1) | ✓ (≤18oz) |
  
  *When TSA rules aren't clear, use the TSA.gov "What Can I Bring?" tool or ask a TSA officer at the checkpoint.*
    `.trim(),
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 4: /airport-delays-today
  // Target: "airport delays today", "flight delays today"
  // ══════════════════════════════════════════════════════════════════════════════

  "/airport-delays-today": {
    meta: {
      title: "Airport Delays Today — Live FAA Status & Ground Stops | TSA.BOT",
      description:
        "Real-time airport delay status for all US airports. Live FAA ATCSCC data — ground stops, ground delays, closures, and delay reasons updated every 5 minutes.",
      keywords:
        "airport delays today, flight delays today, faa delays, ground stop today, airport delay status, faa ground stop",
      canonical: "https://tsa.bot/airport-delays-today",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I check if my airport has delays today?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Use TSA.BOT's live delay tracker (powered by FAA ATCSCC data), or check the FAA's official website at nasstatus.faa.gov. You can also check flightaware.com or your airline's app for real-time delay information. The FAA updates delay status every 5 minutes.",
            },
          },
          {
            "@type": "Question",
            name: "What is a FAA ground stop?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A FAA ground stop (GS) is a temporary measure that stops aircraft from departing toward a specific airport. Ground stops are issued when an airport can't accept more arrivals due to weather, equipment issues, or capacity constraints. Departing flights are held at their origin airports until the ground stop is lifted.",
            },
          },
          {
            "@type": "Question",
            name: "What causes airport delays?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The most common causes of airport delays are weather (thunderstorms, snow, fog, wind), staffing shortages (air traffic control, airline crew), runway or equipment issues, high traffic volume, and security incidents. Weather accounts for approximately 70% of all FAA delays.",
            },
          },
        ],
      },
    ],
    content: `
  # Airport Delays Today — Live FAA Status for Every US Airport
  
  The live FAA airport delay tracker above shows current ground stops, ground delays, and closures at US airports. Data comes directly from the FAA's Air Traffic Control System Command Center (ATCSCC) and updates every 5 minutes.
  
  ## Understanding FAA Delay Types
  
  The FAA issues different types of advisories when airports experience capacity issues. Here's what each one means for your flight:
  
  ### Ground Stop (GS)
  A ground stop prevents aircraft from departing toward a specific airport. If your origin airport issues a ground stop for your destination, your flight may be held on the ground at departure until the stop is lifted. Ground stops are typically issued when an airport temporarily cannot accept more arrivals — due to weather, low visibility, runway closures, or equipment outages. Duration: 15 minutes to several hours.
  
  ### Ground Delay Program (GDP)
  Similar to a ground stop but managed more gradually. The FAA assigns specific departure times to flights headed to a congested airport, spacing arrivals evenly. Your departure time may be pushed back to match your assigned slot. Ground delay programs are issued in advance and managed to minimize cascading delays.
  
  ### Airspace Flow Program (AFP)
  Used when a section of en-route airspace (not a specific airport) is constrained — typically due to weather like a large thunderstorm system. Flights routing through the affected sector are assigned metered times.
  
  ### Departure Delays (DEP)
  Your departure airport is experiencing high traffic volume and departures are being held on the ground. Usually shorter in duration than arrival delays.
  
  ### Arrival Delays (ARR)
  The average arrival delay at the destination airport. Expressed in minutes — this is how long the typical arriving flight is being held due to the current constraint.
  
  ### Closure (CLOSURE)
  The airport or runway is physically closed. Usually due to snow removal, maintenance, or damage. Most closures are temporary (1–4 hours) but can be longer for significant events.
  
  ## Why Delays Cascade Through the System
  
  Airport delays rarely stay at one airport. The FAA's national airspace system is highly interconnected, and a delay at one hub ripples outward:
  
  1. An inbound flight to Chicago O'Hare is delayed 45 minutes due to weather
  2. That plane was scheduled to turn around and fly to Boston
  3. The Boston departure is now delayed 45 minutes
  4. Passengers with connections in Boston miss their connections
  5. Those connecting flights leave without them, affecting seat availability system-wide
  
  This cascading effect is why a storm in Dallas can delay your New York-to-Chicago flight. When checking delays, always look at both your departure airport **and** your inbound aircraft's origin.
  
  ## Most Delay-Prone US Airports
  
  Certain airports consistently generate delays due to geography, weather patterns, and traffic volume:
  
  **Newark (EWR):** One of the most delay-prone airports in the US. Sits in a constrained airspace corridor, heavily affected by NYC-area weather.
  
  **San Francisco (SFO):** Coastal fog causes frequent low-visibility delays, particularly morning Instrument Flight Rules (IFR) conditions from June through August.
  
  **New York (JFK/LGA):** Dense airspace, aging infrastructure, and severe weather exposure make New York-area airports chronically delay-prone.
  
  **Chicago O'Hare (ORD):** High traffic volume plus severe Midwest weather (thunderstorms in summer, snow in winter) creates frequent delays.
  
  **Denver (DEN):** Mountain weather, afternoon thunderstorm season (June–August), and occasional winter snowstorms.
  
  ## Weather-Related Delay Resources
  
  For weather-driven delays (which account for ~70% of all FAA delays), these resources provide advance warning:
  
  - **FAA ATCSCC Advisories**: nasstatus.faa.gov — the official source, same data we use
  - **Aviation Weather Center**: aviationweather.gov — convective SIGMETs, icing, turbulence
  - **Your Airline App**: Most airlines now show "estimated delay" in real-time on the flight status page
  - **FlightAware**: flightaware.com/live — shows en-route flights, delay history, and "misery map"
  
  ## What to Do When Delays Happen
  
  **If your flight is delayed less than 2 hours:** Wait it out. Delays of this length rarely result in missed connections if the airline has built buffer time. Check your connection time — anything over 90 minutes domestically is generally safe.
  
  **If delay exceeds 2 hours, or is a cancellation:** Contact your airline immediately. You have rights to rebooking on the next available flight at no charge. At the airport, call the airline simultaneously — hold times at the counter can be long.
  
  **Document the delay reason:** If the delay is airline-controlled (mechanical, crew), some travel credit cards provide delay insurance compensation. Keep your boarding pass and document the stated reason.
  
  *Live delay data sourced from FAA ATCSCC NASSTATUS (nasstatus.faa.gov) · Updated every 5 minutes*
    `.trim(),
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 5: /real-id-requirements-2026
  // Target: "real id requirements", "real id 2026", "do i need real id to fly"
  // ══════════════════════════════════════════════════════════════════════════════

  "/real-id-requirements-2026": {
    meta: {
      title: "REAL ID Requirements 2026 — Do You Need It to Fly? | TSA.BOT",
      description:
        "REAL ID enforcement is now in effect. Learn what REAL ID is, how to get one, which states comply, and what IDs are accepted at TSA checkpoints in 2026.",
      keywords:
        "real id requirements, real id 2026, do i need real id to fly, real id compliant, real id deadline",
      canonical: "https://tsa.bot/real-id-requirements-2026",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Do I need a REAL ID to fly in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. REAL ID enforcement began May 7, 2025. Starting that date, TSA requires a REAL ID-compliant driver's license, US passport, or other accepted federal ID to board domestic flights. A non-REAL ID driver's license is no longer accepted at TSA checkpoints for domestic air travel.",
            },
          },
          {
            "@type": "Question",
            name: "What IDs are accepted at TSA checkpoints if I don't have REAL ID?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TSA accepts: US passport or passport card, DHS Trusted Traveler cards (Global Entry, NEXUS, SENTRI), US Department of Defense ID, US military ID, permanent resident card, US passport card, border crossing card, federally recognized tribal-issued photo ID, REAL ID-compliant driver's license or ID card.",
            },
          },
          {
            "@type": "Question",
            name: "How do I know if my driver's license is REAL ID compliant?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A REAL ID-compliant driver's license displays a star marking in the upper portion of the card. The star may be gold or black, and may appear alone or within a circle or bear symbol depending on your state. Check your current license — if it has a star symbol, you're compliant.",
            },
          },
          {
            "@type": "Question",
            name: "How do I get a REAL ID driver's license?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Visit your state's DMV or motor vehicle office with proof of identity (birth certificate or US passport), proof of Social Security number, and two proofs of state residency (utility bill, bank statement). You'll receive a new REAL ID-compliant license with a star marking. Processing typically takes 2-4 weeks for mailing.",
            },
          },
        ],
      },
    ],
    content: `
  # REAL ID Requirements 2026: Everything You Need to Know Before Your Flight
  
  REAL ID enforcement went into effect on May 7, 2025. If you're flying domestically in 2026, you need a REAL ID-compliant identification — or an alternative federal ID like a US passport. Here's everything you need to know.
  
  ## What Is REAL ID?
  
  REAL ID is a federal standard for state-issued driver's licenses and ID cards, established by the REAL ID Act of 2005 following the 9/11 Commission recommendations. The law requires states to verify the authenticity of documents used to obtain IDs and meet federal security standards.
  
  A REAL ID-compliant license includes enhanced security features and has been issued using verified identity documentation. You can identify it by the **star marking** in the upper portion of the card.
  
  ## How to Tell If Your License Is REAL ID Compliant
  
  Look at the upper right or upper left corner of your driver's license for a **star symbol**. The appearance varies by state:
  - A gold or black star
  - A star inside a circle
  - A bear/star combination (California)
  - A yellow/gold star (most common)
  
  If your license has a star, you're REAL ID compliant and can use it to fly domestically.
  
  If your license says "NOT FOR FEDERAL IDENTIFICATION" or "NOT FOR REAL ID PURPOSES," you cannot use it at a TSA checkpoint — you'll need a passport or other accepted ID.
  
  ## What IDs Are Accepted at TSA Without REAL ID
  
  Even without a REAL ID license, you can fly with these documents:
  
  **Federal IDs (always accepted):**
  - US Passport (book or card)
  - US Military ID
  - US Department of Defense civilian ID
  - Permanent Resident Card (Green Card)
  - Employment Authorization Card (EAD)
  - US Passport Card
  - DHS Trusted Traveler card (Global Entry, NEXUS, SENTRI)
  - Border Crossing Card
  
  **Other accepted IDs:**
  - Federally recognized tribal-issued photo ID
  - HSPD-12 PIV card
  - Merchant Mariner Credential
  - Aviation ID (for airport employees, not general public)
  
  **Children under 18**: TSA does not require children under 18 to provide ID when traveling domestically with a companion who has acceptable ID.
  
  ## How to Get a REAL ID Driver's License
  
  **You'll need to visit your state DMV in person** — REAL ID cannot be obtained online. Bring:
  
  1. **Proof of identity**: Full legal name must match on all documents
     - US Birth Certificate (with raised seal)
     - US Passport
     - Permanent Resident Card
     - Certificate of Naturalization
  
  2. **Proof of Social Security Number**:
     - Social Security card
     - W-2 or pay stub with full SSN
     - SSA benefit letter
  
  3. **Two proofs of state residency** (must show current address):
     - Utility bill, bank statement, mortgage statement, lease
     - Must be dated within 30–90 days (varies by state)
  
  4. **If your name has changed**: Bring documentation — marriage certificate, court order, or divorce decree
  
  **Cost:** $10–$40 depending on state (often no additional charge if renewing at normal renewal time)
  
  **Processing time:** Most states mail the REAL ID within 10–20 business days. You receive a temporary paper license valid for 30–60 days while you wait.
  
  ## REAL ID for Accessing Federal Buildings
  
  REAL ID isn't just for flying. Starting the same date, a REAL ID-compliant card is required to:
  
  - Enter federal buildings requiring ID (federal courthouses, Social Security Administration, etc.)
  - Access military bases (for non-military civilians)
  - Enter nuclear power plants
  
  If you have a US passport, you're already covered for all of these without a REAL ID license.
  
  ## State-Specific REAL ID Notes
  
  All 50 states and US territories now issue REAL ID-compliant licenses. However, some states offer both REAL ID and non-REAL ID options — you may need to specifically request the REAL ID version when renewing.
  
  **States that automatically issue REAL IDs:** Most states now default to issuing REAL ID licenses. Check your state DMV website to confirm the process.
  
  **States with enhanced driver's licenses:** Michigan, Minnesota, New York, Vermont, and Washington offer "Enhanced Driver's Licenses" (EDL) that are accepted instead of a passport for land and sea crossings to Canada, Mexico, and Caribbean. EDLs are REAL ID compliant for domestic air travel.
  
  ## Frequently Asked Questions
  
  **My license expires next year — should I get REAL ID now?**
  Yes. When you renew, specifically ask for a REAL ID-compliant license and bring the required documents. Don't wait until the last minute before a trip.
  
  **I have a US passport — do I still need REAL ID?**
  No. A valid US passport (book or card) is always accepted at TSA checkpoints for domestic and international travel. If you travel internationally at all, keep your passport current and you won't need to worry about REAL ID.
  
  **Can I fly internationally without REAL ID?**
  International travel requires a passport regardless of REAL ID status. REAL ID only affects domestic (US to US) air travel and federal facility access.
  
  **What if TSA rejects my ID at the checkpoint?**
  If you don't have acceptable ID, TSA may still be able to verify your identity through alternative means. TSA officers may ask you to complete an identity verification process, which may include providing information and answering questions. This adds time — plan accordingly and arrive early.
  
  *For the most current REAL ID information, visit the official DHS REAL ID page at dhs.gov/real-id*
    `.trim(),
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 6: /tsa-precheck-application
  // Target: "tsa precheck application", "tsa precheck enrollment", "how to apply for tsa precheck"
  // ══════════════════════════════════════════════════════════════════════════════

  "/tsa-precheck-application": {
    meta: {
      title: "TSA PreCheck Application Guide 2026 — How to Enroll | TSA.BOT",
      description:
        "Step-by-step TSA PreCheck application guide for 2026. Enrollment process, required documents, interview tips, and how to add your KTN to airline profiles.",
      keywords:
        "tsa precheck application, tsa precheck enrollment, how to apply for tsa precheck, known traveler number, tsa precheck renewal",
      canonical: "https://tsa.bot/tsa-precheck-application",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How long does TSA PreCheck take to get approved?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TSA PreCheck typically takes 3-5 days after your in-person appointment, though it can take up to several weeks. You'll receive your Known Traveler Number (KTN) by email or mail. Add your KTN to your airline profiles to activate PreCheck on your boarding pass.",
            },
          },
          {
            "@type": "Question",
            name: "How much does TSA PreCheck cost in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "TSA PreCheck costs $85 for a 5-year membership when applying through IDEMIA or Telos. Renewal is $70 for 5 years if done within 6 months of expiration. Global Entry (which includes PreCheck) costs $100 for 5 years and also allows expedited customs re-entry for international travel.",
            },
          },
          {
            "@type": "Question",
            name: "What documents do I need for TSA PreCheck enrollment?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "For TSA PreCheck enrollment, bring one form of identity documentation: US passport, permanent resident card, or US birth certificate plus government-issued photo ID. You'll also need to provide your Social Security number (you don't need the card). No additional documents are required.",
            },
          },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Apply for TSA PreCheck",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Apply online",
            text: "Complete the online pre-enrollment form at tsa.gov. Provide personal information, travel history, and choose an enrollment center.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Schedule appointment",
            text: "Choose an in-person appointment at an enrollment center near you. Appointments take about 10 minutes.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Attend appointment",
            text: "Bring required documents: passport or birth certificate + government ID. Get fingerprinted and pay the $85 fee.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Receive KTN",
            text: "Receive your Known Traveler Number (KTN) in 3-5 days via email.",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Add KTN to airline profiles",
            text: "Log into each airline account and add your KTN to your traveler profile. This activates PreCheck on your boarding pass.",
          },
        ],
      },
    ],
    content: `
  # TSA PreCheck Application 2026: Complete Enrollment Guide
  
  TSA PreCheck is the fastest and most affordable way to speed through airport security. This guide walks through the complete application process, what to expect at your enrollment appointment, and how to make sure PreCheck appears on your boarding pass.
  
  ## Is TSA PreCheck Worth It?
  
  Before diving into the application: yes, it's worth it. With TSA PreCheck:
  
  - **No shoes off** — keep footwear on
  - **No laptop removal** — stays in your bag
  - **No liquids out** — 3-1-1 bag stays packed
  - **No belt removal** — dress normally
  - **Dedicated shorter lines** — average 5 minutes or less
  - **Works at 200+ US airports** and with 85+ airlines
  
  At **$17/year** ($85 / 5 years), it's one of the best value travel investments you can make.
  
  ## Step 1: Pre-Enrollment Online
  
  Visit **tsa.gov/precheck** and click "Apply Now." The online pre-enrollment takes about 5 minutes:
  
  - Full legal name, date of birth
  - Mailing address
  - Country of citizenship
  - Social Security number
  - Disclosure of any criminal history (see eligibility section below)
  - Choose an enrollment provider (IDEMIA, Telos, or Alclear — all TSA-authorized)
  - Select an enrollment center location and appointment time
  
  You'll receive a confirmation email with your application reference number.
  
  ## Step 2: In-Person Enrollment Appointment
  
  Show up to your scheduled appointment — takes about 10 minutes. You'll:
  
  1. Present your identity documents
  2. Get fingerprinted (electronic scan — painless)
  3. Have a brief photo taken
  4. Pay the enrollment fee ($85)
  5. Sign your application
  
  **Where to find enrollment centers:** They're located at most major airports, many UPS Store locations, AAA offices, and standalone enrollment centers. Search at tsa.gov/precheck for locations near you.
  
  ## Step 3: What Documents to Bring
  
  Bring **one** of the following:
  
  - **US Passport** (book or card) — easiest option, alone is sufficient
  - **Permanent Resident Card** — alone is sufficient
  - **US Birth Certificate** + **government-issued photo ID** (driver's license)
  - **Certificate of Naturalization** + government-issued photo ID
  
  You'll also need to provide your **Social Security number** verbally — you don't need to bring your Social Security card.
  
  **Name matching:** The name on your application must exactly match the name on your airline tickets. If your ID says "Robert Smith" but you book flights as "Bob Smith," update your airline profiles before applying.
  
  ## Step 4: Background Check & Approval
  
  After your appointment, TSA conducts a background check using your fingerprints and personal information. This reviews criminal history, watch list data, and immigration status.
  
  **Timeline:**
  - Most approvals: **3–5 business days** (some same-day)
  - Average: **About 2 weeks**
  - Maximum: Up to **60 days** in rare cases
  
  You'll receive your **Known Traveler Number (KTN)** by email when approved. It's a 9-digit number — keep it somewhere accessible.
  
  ## Step 5: Adding Your KTN to Airline Profiles
  
  This is the step most people miss. Having a KTN doesn't automatically make PreCheck appear on your boarding pass — you must add it to each airline's frequent flyer/traveler profile.
  
  **How to add your KTN:**
  
  For each airline you fly:
  1. Log into your frequent flyer account
  2. Navigate to "Profile" → "Travel Documents" or "TSA PreCheck"
  3. Enter your KTN in the "Known Traveler Number" field
  4. Save
  
  **Airlines that support TSA PreCheck:** Alaska, Allegiant, American, Delta, Frontier, Hawaiian, JetBlue, Southwest, Spirit, Sun Country, United, and 75+ others.
  
  Once your KTN is added, your boarding pass will show "TSA PRE✓" when PreCheck is available for your flight. If it doesn't show up on a specific flight, that route or aircraft may not be PreCheck-eligible, or the airline didn't receive your KTN in time.
  
  ## TSA PreCheck Eligibility
  
  Most US citizens and permanent residents are eligible. TSA will deny applications for:
  
  - Certain criminal convictions (violent crimes, drug trafficking, terrorism-related offenses)
  - Immigration violations
  - Being on certain federal watchlists
  
  If you've been convicted of a felony, it's worth reviewing TSA's disqualifying offenses list before paying the fee. Minor infractions and misdemeanors are generally not disqualifying.
  
  ## TSA PreCheck vs. Global Entry
  
  **Global Entry** ($100 for 5 years) includes TSA PreCheck **plus** expedited customs re-entry at US airports when returning from international travel. Global Entry members skip the customs declaration line and use automated kiosks instead.
  
  **Recommendation:** If you travel internationally even once every few years, get Global Entry instead of PreCheck — it's only $15 more and includes everything PreCheck does.
  
  Global Entry requires an interview at a US Customs and Border Protection office, which has a longer wait time for scheduling (often 3–6 months, though many airports offer conditional approval so you can use it before the formal interview).
  
  ## Renewal
  
  TSA PreCheck memberships last **5 years**. You'll receive renewal notices by email starting about 6 months before expiration.
  
  **Renewal options:**
  - **Online renewal** (if no changes to personal info): $70 for 5 years
  - **New application** (if major life changes): $85 for 5 years
  
  Renewal doesn't require a new in-person appointment in most cases. Your KTN stays the same upon renewal.
  
  ## Credit Cards That Pay for TSA PreCheck
  
  Many travel credit cards reimburse TSA PreCheck or Global Entry:
  
  - Chase Sapphire Reserve ($100 Global Entry credit every 4 years)
  - American Express Platinum ($100 Global Entry or TSA PreCheck credit every 4.5 years)
  - Capital One Venture X ($100 Global Entry/PreCheck credit every 4 years)
  - Citi AAdvantage Executive ($100 Global Entry credit)
  - United Club Infinite ($100 Global Entry/PreCheck credit)
  - Many Delta Amex cards ($100 Global Entry/TSA PreCheck credit)
  
  If you carry any of these cards, your PreCheck or Global Entry application is essentially free.
  
  *Apply at tsa.gov/precheck · $85 for 5 years · Active at 200+ airports*
    `.trim(),
  },

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE 7: /liquid-rules-carry-on
  // Target: "carry on liquid rules", "tsa liquid rules", "3-1-1 rule"
  // ══════════════════════════════════════════════════════════════════════════════

  "/liquid-rules-carry-on": {
    meta: {
      title:
        "TSA Liquid Rules for Carry-On Bags 2026 — The 3-1-1 Rule | TSA.BOT",
      description:
        "Complete guide to TSA liquid rules for carry-on bags. The 3-1-1 rule explained, exceptions for medications and baby formula, and tips for packing liquids.",
      keywords:
        "carry on liquid rules, tsa liquid rules, 3-1-1 rule, tsa liquids, how many ounces can you bring on a plane",
      canonical: "https://tsa.bot/liquid-rules-carry-on",
    },
    schema: [
      localBusiness,
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the TSA 3-1-1 rule for liquids?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The TSA 3-1-1 liquid rule means: liquids must be in containers of 3.4 ounces (100ml) or less, placed in 1 clear quart-sized zip-top bag, and you may bring 1 bag per passenger. This applies to all liquids, gels, aerosols, creams, and pastes in your carry-on bag.",
            },
          },
          {
            "@type": "Question",
            name: "How many ounces can you bring on a plane in carry-on?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each individual liquid container must be 3.4 ounces (100ml) or less. You can bring multiple containers, but they must all fit in one quart-sized clear plastic zip-top bag. There's no limit on how many items you can pack in checked luggage.",
            },
          },
          {
            "@type": "Question",
            name: "Does toothpaste count as a liquid under TSA rules?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. TSA considers toothpaste a gel/paste and it is subject to the 3-1-1 rule. Your toothpaste container must be 3.4 oz (100ml) or less to bring in your carry-on bag. Travel-size toothpaste tubes are typically 0.85–3.0 oz, which are all within the limit.",
            },
          },
          {
            "@type": "Question",
            name: "Are there exceptions to the TSA liquid rule?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Medically necessary liquids (prescription medications, insulin, liquid nutrition supplements), baby formula and breast milk, and ice/ice packs for medications are exempt from the 3.4oz limit. You must declare these items to TSA officers and they may be subject to additional screening.",
            },
          },
        ],
      },
    ],
    content: `
  # TSA Liquid Rules for Carry-On Bags: The Complete 2026 Guide
  
  Every day, millions of travelers get items confiscated at airport security because of liquid rule violations. Understanding the TSA 3-1-1 rule before you pack saves time, money (replacement toiletries are expensive), and the frustration of watching your favorite shampoo go in the trash.
  
  ## The 3-1-1 Rule: What It Means
  
  The TSA's liquid rule for carry-on bags is summarized as 3-1-1:
  
  **3.4 oz (100ml)** — maximum size per individual container  
  **1** quart-sized clear plastic bag  
  **1** bag per passenger
  
  This applies to **all** of the following when in your carry-on:
  - Liquids (water, juice, perfume, nail polish)
  - Gels (hair gel, toothpaste, contact lens solution)
  - Aerosols (hairspray, deodorant spray, sunscreen spray)
  - Creams and lotions (moisturizer, sunscreen)
  - Pastes (toothpaste, peanut butter)
  
  **The quart bag rule:** All your liquids must fit comfortably in a single clear, zip-top, quart-sized bag. If it doesn't zip closed with everything inside, you have too much.
  
  **At the checkpoint:** Remove your quart bag from your carry-on and place it in a separate bin for X-ray screening.
  
  ## What Counts as 3.4 Ounces?
  
  3.4 fluid ounces = 100 milliliters. On product labels, look for the mL marking. Common examples:
  
  - Travel-size shampoo: typically 2–3 oz ✓
  - Full-size shampoo: typically 10–16 oz ✗ (must go in checked bag)
  - Toothpaste travel tube: 0.85–3.0 oz ✓
  - Regular toothpaste: 4–6 oz ✗
  - Travel perfume/cologne: 1–1.7 oz ✓ 
  - Standard cologne bottle: 3.4–6.8 oz (check carefully — some 3.4oz bottles are just within limit)
  
  **Important:** The limit is based on the **container size printed on the label**, not how much liquid is actually inside. A 10oz bottle that's only half full is still a 10oz bottle — not allowed.
  
  ## Exceptions to the 3.4 Oz Limit
  
  Certain liquids are **exempt from the 3.4oz rule**. These must be declared to TSA officers and may be screened separately:
  
  ### Medications
  - Prescription liquid medications in any quantity
  - Over-the-counter liquid medications (cough syrup, liquid acetaminophen, etc.)
  - Insulin and other injectable medications
  - Liquid nutritional supplements
  - Eye drops and contact lens solution in medically necessary quantities
  
  Keep medications in original labeled containers when possible. You don't need a prescription slip at security, but labeled bottles reduce delays.
  
  ### Baby and Infant Items
  - Baby formula (powdered and liquid)
  - Breast milk (any quantity — TSA explicitly supports breastfeeding parents)
  - Juice for infants and toddlers
  - Baby food in liquid or gel form (purées)
  - Gel teething rings (as long as they're frozen solid when you get to security)
  
  You can travel with reasonable quantities — TSA won't limit you to 3.4oz of breast milk.
  
  ### Medical Ice Packs and Cooling Items
  - Ice packs for medications that require cooling
  - Gel ice packs (must be frozen solid at checkpoint — if slushy, subject to liquid rule)
  
  ### Duty-Free Liquids
  Alcohol and other liquids purchased at duty-free shops after the security checkpoint can be brought on board in the sealed, tamper-evident bags the shops use, along with your receipt. This includes bottles larger than 3.4oz. However, these may be confiscated at connecting airports — check the rules at your layover location.
  
  ## What Happens to Oversized Liquids at Security
  
  If you accidentally bring a liquid over 3.4oz in your carry-on, TSA officers will:
  
  1. Ask you to place it in your checked bag (if you have one checked)
  2. Or require you to leave it behind (it goes in the TSA bin or trash)
  3. Or in rare cases, allow you to consume it at the checkpoint (water and beverages)
  
  TSA cannot store items for you. You cannot retrieve confiscated items. You cannot ship them to yourself from the checkpoint.
  
  **The lesson:** When in doubt, put it in your checked bag.
  
  ## Packing Tips for the 3-1-1 Rule
  
  ### Buy travel sizes strategically
  Drug stores sell travel-size versions of almost every toiletry at 1–3oz. Alternatively, buy empty travel containers and fill them from full-size products at home.
  
  ### Use solid alternatives
  Many products now come in solid form: shampoo bars, conditioner bars, solid sunscreen, solid perfume, solid deodorant. Solids have no liquid restrictions whatsoever.
  
  ### Pack liquids in checked bags when possible
  If you're checking a bag anyway, keep all your liquids in there. The 3-1-1 rule only applies to carry-on.
  
  ### Buy after security
  Airport shops, pharmacies, and convenience stores sell toiletries post-security. If you frequently forget liquids, buying travel toiletries airside is a viable strategy (at a markup).
  
  ### Pre-pack your quart bag
  Keep a pre-packed quart bag always ready with your travel toiletries. This way you never forget to organize liquids, and at security you just pull it out.
  
  ## Liquids in Checked Bags
  
  Checked bags have much more liberal liquid rules:
  
  - Liquids in any quantity are generally allowed
  - Alcohol between 24%–70% ABV (48–140 proof): up to 5 liters total
  - Aerosols: standard consumer sizes (no restrictions for personal care items)
  - Flammable liquids (gasoline, lighter fluid): **not allowed in checked bags** either
  
  One note: Pack liquids in a waterproof zip-lock bag inside your checked luggage — altitude and pressure changes can cause bottles to leak, and you don't want shampoo soaking your clothes.
  
  ## Frequently Asked Questions
  
  **Can I bring a full-size bottle of water on the plane?**
  You can bring an empty reusable water bottle through security and fill it at a fountain or refill station after the checkpoint. Full water bottles over 3.4oz are not allowed through security — TSA does not make exceptions for water.
  
  **Is hand sanitizer subject to the liquid rule?**
  Yes — hand sanitizer is a gel and subject to 3-1-1. However, TSA allows one bottle of hand sanitizer up to 12 ounces per passenger (temporarily increased during COVID and maintained as a policy update). This is the only major exception where a single non-medical liquid can exceed 3.4oz.
  
  **Do I have to put all my liquids in the bag?**
  Technically yes — but TSA officers are primarily concerned with undeclared or oversized liquids. Lip balm, lip gloss, and tiny creams are rarely flagged even outside the bag, but for smooth screening, use the bag.
  
  **Can I bring a snow globe in my carry-on?**
  Snow globes are considered liquids if they're larger than a tennis ball. Small snow globes (tennis ball size or smaller) are allowed in carry-on if they fit in your quart bag. Larger ones must go in checked bags.
  
  *TSA liquid rules can be confirmed at tsa.gov/travel/security-screening/whatcanibring/all*
    `.trim(),
  },
}; // end seoPages export

// ══════════════════════════════════════════════════════════════════════════════
// SEO Page React Component Wrapper
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect as useEffectReact } from "react";

/**
 * SEOPageShell
 * Wraps any SEO page content with proper head tags and schema markup.
 * Use this with your router (Next.js, React Router, etc.)
 */
export function SEOPageShell({ pagePath, children }) {
  const page = seoPages[pagePath];
  if (!page) return <>{children}</>;

  // Inject schema JSON-LD into head
  useEffectReact(() => {
    const scripts = [];
    page.schema.forEach((schema, i) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = `schema-${pagePath.replace(/\//g, "-")}-${i}`;
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
      scripts.push(script);
    });

    // Set meta tags
    document.title = page.meta.title;
    setMeta("description", page.meta.description);
    setMeta("keywords", page.meta.keywords);
    setMeta("robots", "index, follow");
    setCanonical(page.meta.canonical);

    // OpenGraph
    setOGMeta("og:title", page.meta.title);
    setOGMeta("og:description", page.meta.description);
    setOGMeta("og:url", page.meta.canonical);
    setOGMeta("og:type", "article");
    setOGMeta("og:site_name", "TSA.BOT");

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [pagePath]);

  return <>{children}</>;
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setOGMeta(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

export default seoPages;
