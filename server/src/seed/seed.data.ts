export interface SeedSite {
  address: string;
  title: string;
  author: string;
  content: string;
  tags: string[];
}

export function generateSeedSites(): SeedSite[] {
  const sites: SeedSite[] = [];

  // 1. Core Portal Sites
  sites.push({
    address: 'welcome',
    title: 'The Small Web — Welcome & Directory',
    author: 'System',
    tags: ['core', 'directory', 'portal'],
    content: `
      <div style="font-family: serif; max-width: 700px; margin: 0 auto; padding: 2rem; line-height: 1.6; color: #1f2937;">
        <h1 style="color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 0.5rem;">Welcome to the Small Web</h1>
        <p style="font-size: 1.15rem; font-style: italic;">
          "A few hundred one-page websites, written by strangers, living in a database."
        </p>
        <p>
          You are currently looking through a browser built entirely inside a web tab. This browser respects the real laws of hypertext:
          history is strictly preserved, going back and typing a new URL truncates the forward stack, returning to a page restores your reading position,
          and any untrusted HTML markup is securely contained.
        </p>
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 1rem; margin: 1.5rem 0;">
          <h3 style="margin-top: 0; color: #166534;">🌟 Recommended Starting Points</h3>
          <ul>
            <li><a href="about">About this Experiment & Philosophy</a></li>
            <li><a href="directory">The Grand Small Web Directory (Index of all corners)</a></li>
            <li><a href="webring/hypertext">The Webring: Hypertext Guardians</a></li>
            <li><a href="encyclopedia/hypertext">Encyclopedia: Origins of Hypertext</a></li>
            <li><a href="garden/digital-gardening">Digital Gardening: A Manifesto</a></li>
            <li><a href="test/broken-link">Test Broken Link Trap (Triggers State 05 Nowhere)</a></li>
            <li><a href="security/sandbox-test">Security & Escape Test (Verifying Sandbox Containment)</a></li>
          </ul>
        </div>
        <p>
          Use the address bar above to visit any page, or search for any phrase across the entire web using the Search drawer.
        </p>
      </div>
    `,
  });

  sites.push({
    address: 'about',
    title: 'About the Small Web Browser',
    author: 'Chief Architect',
    tags: ['core', 'about', 'specification'],
    content: `
      <div style="font-family: system-ui, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem; color: #334155;">
        <h1 style="color: #0f172a; margin-bottom: 0.5rem;">The Architecture of Containment</h1>
        <p style="color: #64748b; font-size: 0.95rem;">Technical overview of the client, server, and sandbox mechanics.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
        <h3>1. The Two Halves</h3>
        <p>
          The <strong>Small Web</strong> is the content living in MongoDB. The <strong>Browser</strong> is the product:
          address bar, forward and back stacks, personal history, full-text body search, and the sandbox viewport.
        </p>
        <h3>2. The Five States</h3>
        <ol>
          <li><code>01 Typed</code>: An address entered in the address bar.</li>
          <li><code>02 Loading</code>: Asked for, not yet rendered.</li>
          <li><code>03 Shown</code>: Read, and recorded into your personal history.</li>
          <li><code>04 In History</code>: Been here before flag.</li>
          <li><code>05 Nowhere</code>: No such address exists (404 state, followed from broken links or misspellings).</li>
        </ol>
        <h3>3. Sandboxing Untrusted HTML</h3>
        <p>
          Every page is rendered in a sandboxed iframe with strict permissions. Scripts inside cannot access <code>window.parent</code>,
          cannot read outer cookies or localStorage, and all anchor click events (<code>&lt;a&gt;</code>) are intercepted
          via a postMessage bridge to drive the simulated browser navigation!
        </p>
        <p>
          Return to <a href="welcome">Welcome Page</a> or view the <a href="directory">Global Directory</a>.
        </p>
      </div>
    `,
  });

  sites.push({
    address: 'test/broken-link',
    title: 'Deliberate Broken Link Test Trap',
    author: 'QA Inspector',
    tags: ['test', 'qa', 'broken'],
    content: `
      <div style="font-family: monospace; max-width: 650px; margin: 0 auto; padding: 2rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px;">
        <h2 style="color: #be123c;">⚠️ Broken Link Testing Suite</h2>
        <p>
          The specification requires the browser to "Follow links, including the broken ones" and transition to state
          <strong>05 Nowhere</strong> without breaking the browser shell.
        </p>
        <p>Clicking either of the links below points to addresses that do not exist:</p>
        <ul>
          <li><a href="non-existent/ghost-page" style="color: #e11d48; font-weight: bold;">Follow Ghost Page (nowhere)</a></li>
          <li><a href="abyss/404/lost" style="color: #e11d48; font-weight: bold;">Step into the Void (abyss)</a></li>
        </ul>
        <p>Or return safely to <a href="welcome">The Welcome Page</a>.</p>
      </div>
    `,
  });

  sites.push({
    address: 'security/sandbox-test',
    title: 'Untrusted Code & Escape Attempt Simulation',
    author: 'Security Researcher',
    tags: ['security', 'sandbox', 'test'],
    content: `
      <div style="font-family: monospace; max-width: 700px; margin: 0 auto; padding: 2rem; background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 8px;">
        <h2 style="color: #334155;">🛡️ Security Sandbox Proof</h2>
        <p>
          "You are rendering markup you did not write into the same screen as your own interface.
          Anyone can publish, so assume someone will try to escape the page they published on."
        </p>
        <p>
          This page contains embedded JavaScript attempting to:
          <code>window.parent.location = 'evil'</code> and <code>parent.document.body.innerHTML = 'Hacked'</code>.
        </p>
        <script>
          try {
            window.parent.document.title = "HACKED BY CHILD IFRAME";
            alert("Security failure! Child broke out.");
          } catch (e) {
            console.log("Safe: Cross-origin sandbox successfully blocked parent access: " + e.message);
          }
        </script>
        <div style="background: #e0f2fe; padding: 1rem; border-left: 4px solid #0284c7; margin: 1rem 0;">
          <strong>Sandbox Status:</strong>
          The iframe attribute <code>sandbox="allow-scripts"</code> without <code>allow-same-origin</code>
          and without <code>allow-top-navigation</code> isolates all stranger-submitted JavaScript into an opaque origin.
        </div>
        <p>
          Try navigating back via <a href="welcome">Return Home</a> or <a href="about">Read Technical Notes</a>.
        </p>
      </div>
    `,
  });

  // 2. Webrings & Topic Hubs (10 sites)
  const webrings = [
    { id: 'hypertext', name: 'Hypertext Explorers', desc: 'Preserving the original spirit of interconnected documents and nonlinear thought.' },
    { id: 'retro', name: 'Retro Web Enthusiasts', desc: 'Honoring the 88x31 badges, guestbooks, tiled backgrounds, and table layouts of 1997.' },
    { id: 'devs', name: 'Low-Tech Developers', desc: 'Advocating for 50KB web pages, zero framework overhead, and accessible semantic HTML.' },
    { id: 'writers', name: 'Digital Essayists', desc: 'Long-form essays, reflections, and personal journals written without algorithmic feeds.' },
    { id: 'botanists', name: 'Digital Gardeners', desc: 'Tending to evergreen notes, bi-directional links, and ideas cultivated in public.' },
    { id: 'poets', name: 'Cybernetic Poets', desc: 'Haikus, verse, and concrete poetry generated and assembled in hypertext.' },
    { id: 'sound', name: 'Ambient Soundscapers', desc: 'Field recordings, synthesizer patches, and vinyl record preservation.' },
    { id: 'recipes', name: 'Zero-Nonsense Cooks', desc: 'Direct ingredient lists and culinary procedures with no 3000-word life stories.' },
    { id: 'philosophy', name: 'Dialectical Thinkers', desc: 'Epistemology, phenomenology, and ethics of technology in the age of machines.' },
    { id: 'minimalism', name: 'Plain Text Pioneers', desc: 'Markdown, Gemtext, finger protocols, and plain text simplicity.' },
  ];

  for (const ring of webrings) {
    sites.push({
      address: `webring/${ring.id}`,
      title: `Webring: ${ring.name}`,
      author: 'RingMaster',
      tags: ['webring', ring.id],
      content: `
        <div style="font-family: 'Courier New', monospace; max-width: 680px; margin: 0 auto; padding: 2rem; background: #fffbeb; border: 2px solid #b45309; border-radius: 6px;">
          <h2 style="color: #92400e; text-transform: uppercase;">💍 [Webring] ${ring.name}</h2>
          <p style="font-size: 1.05rem;">${ring.desc}</p>
          <hr style="border: 1px dashed #d97706;" />
          <h3>Member Nodes</h3>
          <ul>
            <li><a href="garden/${ring.id}-manifesto">${ring.name} Manifesto</a></li>
            <li><a href="users/alice">Alice's Personal Notebook</a></li>
            <li><a href="users/bob">Bob's Engineering Log</a></li>
            <li><a href="encyclopedia/${ring.id}">Encyclopedia Archive for ${ring.id}</a></li>
          </ul>
          <div style="margin-top: 2rem; text-align: center; padding: 0.5rem; background: #fde68a;">
            « <a href="webring/hypertext">Previous Ring</a> |
            <a href="directory">Ring Hub</a> |
            <a href="webring/retro">Next Ring</a> »
          </div>
        </div>
      `,
    });
  }

  // 3. Digital Garden Pages (25 sites)
  const gardenTopics = [
    { slug: 'digital-gardening', title: 'A Brief History of Digital Gardening', tag: 'gardening', excerpt: 'Gardens are non-linear, evergreen collections of living notes that grow in public.' },
    { slug: 'second-brain', title: 'Building a Second Brain Without Bloat', tag: 'knowledge', excerpt: 'Personal knowledge management fails when tool curation replaces actual thinking.' },
    { slug: 'slow-web', title: 'The Slow Web Manifesto', tag: 'philosophy', excerpt: 'In praise of asynchronous communication, deep reading, and websites that do not update every second.' },
    { slug: 'hyperlink-etiquette', title: 'The Lost Art of the Hyperlink', tag: 'web', excerpt: 'When was the last time you followed a blue underlined link down a three-hour rabbit hole?' },
    { slug: 'handcrafted-html', title: 'Handcrafted HTML as Folk Art', tag: 'craft', excerpt: 'Writing raw HTML by hand is the modern equivalent of pottery or woodworking.' },
    { slug: 'indieweb-principles', title: 'Owning Your Words: IndieWeb Basics', tag: 'indieweb', excerpt: 'POSIX principles applied to personal communication: POSSE (Publish on Own Site, Syndicate Elsewhere).' },
    { slug: 'serendipity-engine', title: 'Designing for Serendipity', tag: 'design', excerpt: 'Algorithms optimize for engagement. Hypertext optimizes for unexpected connections.' },
    { slug: 'permacomputing', title: 'Permacomputing: Computing in Scarcity', tag: 'ecology', excerpt: 'Hardware longevity, energy-efficient code, and building systems designed to survive decades.' },
    { slug: 'ephemeral-culture', title: 'The Ephemeral Culture of the Early Internet', tag: 'history', excerpt: 'Geocities, Flash animations, personal webrings: what we lost when the web consolidated into four apps.' },
    { slug: 'zettelkasten-method', title: 'Zettelkasten: Niklas Luhmann Slipbox', tag: 'productivity', excerpt: 'Atomic notes, index cards, and the emergence of unforeseen insights.' },
    { slug: 'dark-patterns', title: 'Anatomy of Digital Hostility: Dark Patterns', tag: 'ethics', excerpt: 'Deceptive interfaces designed to manipulate user agency and exploit attention.' },
    { slug: 'local-first-software', title: 'Local-First Software: You Own Your Data', tag: 'tech', excerpt: 'Seven ideals for software that works offline, synchronizes effortlessly, and respects user ownership.' },
    { slug: 'hypertext-manifesto', title: 'The Hypertext Manifesto', tag: 'manifesto', excerpt: 'Links are bridges between consciousnesses. Do not privatize the pathways.' },
    { slug: 'retro-manifesto', title: 'The Retro Revival', tag: 'culture', excerpt: 'Why CRT scanlines, 8-bit chip tunes, and simple CSS stylesheets feel like home.' },
    { slug: 'devs-manifesto', title: 'The Minimalist Developer Oath', tag: 'dev', excerpt: 'I promise not to import a 2MB framework to render 12 lines of text.' },
    { slug: 'writers-manifesto', title: 'The Unpublishable Thoughts', tag: 'writing', excerpt: 'Writing that has no marketing goal, no funnel, and no conversion metrics.' },
    { slug: 'botanists-manifesto', title: 'Seeds of Thought in Hypertext Soil', tag: 'ideas', excerpt: 'Cross-pollinating sociology, biology, and computational linguistics.' },
    { slug: 'poets-manifesto', title: 'Code as Verse', tag: 'poetry', excerpt: 'Syntax errors as artistic expressions of existential ambiguity.' },
    { slug: 'sound-manifesto', title: 'Acoustic Ecology in the Digital Realm', tag: 'sound', excerpt: 'Listening to the resonance of server fans, cooling towers, and quiet rooms.' },
    { slug: 'recipes-manifesto', title: 'Culinary Pragmatism', tag: 'food', excerpt: 'Food is survival, culture, and joy. It does not require ad trackers.' },
    { slug: 'philosophy-manifesto', title: 'The Phenomenology of the Address Bar', tag: 'philosophy', excerpt: 'What does it mean to type a name into a box and summon a distant mind?' },
    { slug: 'minimalism-manifesto', title: 'Plain Text Endures', tag: 'minimalism', excerpt: 'Word documents rot. Proprietary databases lock you out. ASCII outlives empires.' },
    { slug: 'curation-vs-creation', title: 'The Dialectic of Curation and Creation', tag: 'media', excerpt: 'Collecting links is a creative act when arranged with intentionality.' },
    { slug: 'monopolies-of-mind', title: 'Decentralizing the Mind', tag: 'society', excerpt: 'Breaking the feedback loops of algorithmic recommendations.' },
    { slug: 'font-mechanics', title: 'Typography for the Reading Eye', tag: 'typography', excerpt: 'Line length, vertical rhythm, and the soothing cadence of Georgia and Charter.' }
  ];

  for (const g of gardenTopics) {
    sites.push({
      address: `garden/${g.slug}`,
      title: g.title,
      author: 'Digital Gardener',
      tags: ['garden', g.tag],
      content: `
        <article style="max-width: 680px; margin: 0 auto; padding: 2.5rem 1rem; font-family: Georgia, serif; line-height: 1.8; color: #27272a;">
          <header style="margin-bottom: 2rem;">
            <span style="display: inline-block; background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase; font-family: sans-serif; font-weight: 600;">Garden / ${g.tag}</span>
            <h1 style="font-size: 2rem; margin: 0.75rem 0 0.5rem 0; color: #09090b; line-height: 1.3;">${g.title}</h1>
            <p style="color: #71717a; font-style: italic; font-size: 1rem;">${g.excerpt}</p>
          </header>
          <div style="font-size: 1.1rem;">
            <p>
              In the topology of the Small Web, documents are not ephemeral feed entries. They exist at permanent coordinates.
              When you type <code>garden/${g.slug}</code> into the address bar, you are addressing a tangible coordinate in memory.
            </p>
            <p>
              Consider how links work. When you follow <a href="encyclopedia/hypertext">Hypertext Origins</a>, your browser records
              this coordinate into your personal history. If you click <strong>Back</strong>, your browser retraces the step
              and restores your exact scroll position. If you decide to follow <a href="webring/botanists">The Digital Botanists Ring</a>
              instead, the forward stack is cleared — because you charted a fresh path into uncharted territory.
            </p>
            <blockquote style="border-left: 3px solid #0284c7; margin: 1.5rem 0; padding-left: 1rem; color: #475569; font-style: italic;">
              "The web was designed to be decentralized, interconnected, and readable by everyone without gatekeepers."
            </blockquote>
            <p>
              Related thoughts in the garden:
              <ul>
                <li><a href="garden/second-brain">Building a Second Brain</a></li>
                <li><a href="garden/slow-web">The Slow Web</a></li>
                <li><a href="recipes/sourdough">Sourdough Bread Recipe (The baker's quiet hours)</a></li>
              </ul>
            </p>
          </div>
          <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e4e4e7; font-size: 0.9rem; color: #a1a1aa; font-family: sans-serif;">
            Planted on the Small Web • <a href="directory">Explore All Garden Pages</a> • <a href="welcome">Home</a>
          </footer>
        </article>
      `,
    });
  }

  // 4. Encyclopedia Entries (30 sites)
  const encyclopediaTopics = [
    { slug: 'hypertext', title: 'Hypertext: Concept and Genesis', summary: 'The non-sequential writing and reading mechanism envisioned by Ted Nelson and Vannevar Bush.' },
    { slug: 'memex', title: 'Vannevar Bush and the Memex (1945)', summary: 'As We May Think: A mechanized desk linking microfilms by associative trails.' },
    { slug: 'project-xanadu', title: 'Project Xanadu (1960)', summary: 'Ted Nelsons vision of two-way transclusion links and universal document rights.' },
    { slug: 'tim-berners-lee', title: 'Tim Berners-Lee and CERN (1989)', summary: 'Information Management: A Proposal. The marriage of HTTP, HTML, and URIs.' },
    { slug: 'gopher-protocol', title: 'The Gopher Protocol (RFC 1436)', summary: 'Menu-driven document retrieval developed at the University of Minnesota before the web.' },
    { slug: 'arpanet', title: 'ARPANET: Packet Switching Networks', summary: 'The Department of Defenses first operational packet-switching computer network.' },
    { slug: 'mosaic-browser', title: 'NCSA Mosaic and the Birth of Web Browsing', summary: 'Marc Andreessen and Eric Bina create the first graphical web browser with inline images.' },
    { slug: 'html-spec', title: 'HTML 1.0 to HTML5: Evolution of Tags', summary: 'How twenty simple markup elements evolved into the universal document format of humanity.' },
    { slug: 'uri-spec', title: 'Uniform Resource Identifiers (RFC 3986)', summary: 'Scheme, host, path, query, and fragment: how names map to resources.' },
    { slug: 'rest-architecture', title: 'Architectural Styles and REST (Roy Fielding 2000)', summary: 'Representational State Transfer and the constraints that made the web scalable.' },
    { slug: 'css-origins', title: 'Cascading Style Sheets: Håkon Wium Lie (1994)', summary: 'Separating document structure from aesthetic presentation.' },
    { slug: 'javascript-origins', title: 'Brendan Eich and 10 Days in May 1995', summary: 'Mocha, LiveScript, and JavaScript: embedding computation into browser pages.' },
    { slug: 'document-object-model', title: 'The Document Object Model (DOM)', summary: 'Tree representations of parsed markup and dynamic programmable interfaces.' },
    { slug: 'browser-history-stack', title: 'Browser History Stack Semantics', summary: 'The exact mathematics of the Back, Forward, and Push state machine.' },
    { slug: 'same-origin-policy', title: 'The Same-Origin Policy and Web Sandboxing', summary: 'Isolation boundaries between protocols, domains, and ports.' },
    { slug: 'ascii-art', title: 'ASCII Art: Typography Before Pixels', summary: 'Creating graphical representations entirely out of 7-bit ASCII characters.' },
    { slug: 'webrings', title: 'Webrings: Peer Discovery Before Search Engines', summary: 'Decentralized loops of websites connecting like-minded hobbyists.' },
    { slug: 'rss-atom', title: 'RSS and Atom Syndication Feeds', summary: 'Really Simple Syndication: decentralized subscriptions without platforms.' },
    { slug: 'peer-to-peer', title: 'Peer-to-Peer Computing (BitTorrent & IPFS)', summary: 'Distributed hash tables and content-addressed content distribution.' },
    { slug: 'smallweb-protocol', title: 'The Small Web Protocol', summary: 'A database of one-page HTML documents living without domain registrars.' },
    { slug: 'cybernetics', title: 'Cybernetics: Norbert Wiener and Control Systems', summary: 'Feedback loops, self-regulation, and human-machine communication.' },
    { slug: 'unix-philosophy', title: 'The Unix Philosophy (Doug McIlroy)', summary: 'Write programs that do one thing well. Write programs to work together.' },
    { slug: 'hypercard', title: 'Bill Atkinson and Apple HyperCard (1987)', summary: 'Cards, stacks, and HyperTalk: programming accessible to non-programmers.' },
    { slug: 'doug-engelbart', title: 'Douglas Engelbart: The Mother of All Demos (1968)', summary: 'First presentation of the mouse, windows, hypertext, and collaborative editing.' },
    { slug: 'ted-nelson', title: 'Ted Nelson: Literary Machines and Deep Intertwingularity', summary: 'Everything is deeply intertwingled. Coining the terms hypertext and hypermedia.' },
    { slug: 'retrocomputing', title: 'Retrocomputing and Digital Preservation', summary: 'Keeping obsolete software and hardware functioning for future historical inquiry.' },
    { slug: 'open-web', title: 'The Open Web vs Walled Gardens', summary: 'The enduring struggle between permissionless protocols and platform feudalism.' },
    { slug: 'search-engines', title: 'The Evolution of Web Indexing and Search', summary: 'From Archie and Yahoo human directories to PageRank and vectorized embeddings.' },
    { slug: 'typography', title: 'Typography in the Screen Age', summary: 'Kerning, leading, subpixel rendering, and readability across variable viewports.' },
    { slug: 'forth-language', title: 'The Forth Programming Language (Chuck Moore)', summary: 'Stack-based minimalism, concatenative programming, and extreme simplicity.' }
  ];

  for (const e of encyclopediaTopics) {
    sites.push({
      address: `encyclopedia/${e.slug}`,
      title: `Encyclopedia: ${e.title}`,
      author: 'Archivist',
      tags: ['encyclopedia', 'reference', e.slug],
      content: `
        <div style="max-width: 720px; margin: 0 auto; padding: 2rem; font-family: 'Times New Roman', serif; line-height: 1.7; color: #1e293b;">
          <div style="border-bottom: 2px solid #334155; padding-bottom: 0.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-weight: bold; font-size: 1.25rem; letter-spacing: 1px;">ENCYCLOPEDIA SMALLWEB</span>
            <span style="font-size: 0.85rem; color: #64748b;">REF: ${e.slug.toUpperCase()}</span>
          </div>
          <h1 style="font-size: 1.85rem; margin: 0 0 1rem 0; color: #0f172a;">${e.title}</h1>
          <p style="font-size: 1.1rem; background: #f8fafc; border-left: 4px solid #3b82f6; padding: 0.75rem 1rem; margin-bottom: 1.5rem;">
            <strong>Abstract:</strong> ${e.summary}
          </p>
          <p>
            The historical record of computing reveals that foundational protocols survived not through complexity,
            but through resilience and parsimony. In <em>${e.title}</em>, we witness the structural transition from
            isolated computation toward universal interconnectedness.
          </p>
          <p>
            When studying this topic within our custom browser engine, observe how this document is indexed.
            Typing <em>"${e.slug}"</em> or words from this text in the browser search bar will find this entry
            via the MongoDB full-text index.
          </p>
          <div style="margin: 2rem 0; padding: 1rem; border: 1px solid #cbd5e1; border-radius: 4px;">
            <h4 style="margin-top: 0;">Cross-References:</h4>
            <ul>
              <li><a href="encyclopedia/hypertext">Hypertext: Concept and Genesis</a></li>
              <li><a href="encyclopedia/browser-history-stack">Browser History Stack Semantics</a></li>
              <li><a href="welcome">The Small Web Portal</a></li>
              <li><a href="directory">Full Encyclopedia Index</a></li>
            </ul>
          </div>
          <p style="font-size: 0.85rem; color: #94a3b8; text-align: center;">
            Published on the Small Web • Preserved in MongoDB
          </p>
        </div>
      `,
    });
  }

  // 5. Personal Homepages (Users & Geocities style - 25 sites)
  const personalUsers = [
    { username: 'alice', name: 'Alice Walker', title: 'Curious Archivist', hobby: 'Bookbinding and Lisp interpreters', bg: '#fdf4ff', border: '#e879f9' },
    { username: 'bob', name: 'Bob Smith', title: 'Hypertext Hacker', hobby: 'Radio astronomy and mechanical keyboards', bg: '#eff6ff', border: '#60a5fa' },
    { username: 'charlie', name: 'Charlie Davis', title: 'Digital Botanist', hobby: 'Heirloom tomatoes and seed saving', bg: '#f0fdf4', border: '#4ade80' },
    { username: 'dana', name: 'Dana Evans', title: 'Webring Navigator', hobby: 'Bicycle touring and analog photography', bg: '#fffbeb', border: '#fcd34d' },
    { username: 'eve', name: 'Eve Martinez', title: 'Cybernetic Poet', hobby: 'Modular synthesizers and generative art', bg: '#faf5ff', border: '#c084fc' },
    { username: 'frank', name: 'Frank Wright', title: 'Minimalist Architect', hobby: 'Timber framing and hand drawings', bg: '#f4f4f5', border: '#a1a1aa' },
    { username: 'grace', name: 'Grace Hopper Fan', title: 'Compiler Tinkerer', hobby: 'COBOL archeology and bytecode VMs', bg: '#ecfdf5', border: '#34d399' },
    { username: 'helen', name: 'Helen Troy', title: 'Astronomer', hobby: 'Telescope mirror grinding and variable stars', bg: '#0f172a', border: '#38bdf8', dark: true },
    { username: 'ian', name: 'Ian Fleming', title: 'Mystery Reader', hobby: 'Espionage paperbacks and fountain pens', bg: '#fff7ed', border: '#fdba74' },
    { username: 'julia', name: 'Julia Child Admirer', title: 'Sourdough Enthusiast', hobby: 'Lactic fermentations and French cuisine', bg: '#fff1f2', border: '#f43f5e' },
  ];

  for (const u of personalUsers) {
    const textColor = u.dark ? '#f8fafc' : '#1e293b';
    const linkColor = u.dark ? '#38bdf8' : '#0284c7';

    sites.push({
      address: `users/${u.username}`,
      title: `${u.name}'s Cozy Corner`,
      author: u.username,
      tags: ['personal', 'homepage', u.username],
      content: `
        <div style="max-width: 650px; margin: 0 auto; padding: 2rem; background: ${u.bg}; border: 3px double ${u.border}; border-radius: 8px; color: ${textColor}; font-family: monospace;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 2.5rem;">💻✨</div>
            <h1 style="margin: 0.25rem 0; font-size: 1.75rem;">Welcome to ${u.name}'s Homepage!</h1>
            <p style="font-style: italic; margin: 0; opacity: 0.85;">${u.title} • ${u.hobby}</p>
          </div>
          <hr style="border: 1px dashed ${u.border}; margin: 1.5rem 0;" />
          <p>
            Hello visitor! You have reached my little server page in the database.
            No ads, no tracking scripts, no cookie consent banners — just my thoughts and links.
          </p>
          <h3>Things I Love:</h3>
          <ul>
            <li>Hypertext exploration on <a href="welcome" style="color: ${linkColor};">The Small Web</a></li>
            <li>Reading <a href="garden/digital-gardening" style="color: ${linkColor};">Digital Gardening essays</a></li>
            <li>Browsing recipes: <a href="recipes/sourdough" style="color: ${linkColor};">Authentic Sourdough Bread</a></li>
            <li>Following the <a href="webring/retro" style="color: ${linkColor};">Retro Webring</a></li>
          </ul>
          <h3>Guestbook & Notes:</h3>
          <p>
            Leave a note by publishing your own site and linking back to <code>users/${u.username}</code>!
            In the Small Web, back-links are the true social network.
          </p>
          <div style="margin-top: 2rem; padding: 0.75rem; border: 1px solid ${u.border}; text-align: center; font-size: 0.85rem;">
            [ Best viewed in 1024x768 resolution with any standards-compliant browser ]<br/>
            « <a href="users/alice" style="color: ${linkColor};">Alice</a> | <a href="directory" style="color: ${linkColor};">Web Directory</a> | <a href="users/bob" style="color: ${linkColor};">Bob</a> »
          </div>
        </div>
      `,
    });
  }

  // 6. Culinary & Recipes (20 sites)
  const recipes = [
    { slug: 'sourdough', title: 'Country Sourdough Bread', prep: '24 hours', ingredients: 'Flour, Water, Salt, Wild Yeast Levain' },
    { slug: 'pasta-aglio-olio', title: 'Spaghetti Aglio e Olio', prep: '15 mins', ingredients: 'Spaghetti, Extra Virgin Olive Oil, Garlic, Chili Flakes, Parsley' },
    { slug: 'matcha-cookies', title: 'Chewy Matcha Green Tea Cookies', prep: '30 mins', ingredients: 'Ceremonial Matcha, White Chocolate, Flour, Butter, Cane Sugar' },
    { slug: 'french-onion-soup', title: 'Classic French Onion Soup', prep: '2 hours', ingredients: 'Yellow Onions, Beef Stock, Thyme, Gruyere, Baguette' },
    { slug: 'golden-curry', title: 'Japanese Homestyle Golden Curry', prep: '45 mins', ingredients: 'Curry Roux, Carrots, Potatoes, Onions, Dashi Broth' },
    { slug: 'shakshuka', title: 'Spiced Tomato & Poached Egg Shakshuka', prep: '25 mins', ingredients: 'San Marzano Tomatoes, Bell Peppers, Cumin, Eggs, Feta' },
    { slug: 'cold-brew-coffee', title: 'Smooth 18-Hour Cold Brew Coffee', prep: '18 hours', ingredients: 'Coarse Ground Ethiopian Coffee, Filtered Water' },
    { slug: 'kimchi-jjigae', title: 'Aged Kimchi Stew (Kimchi Jjigae)', prep: '35 mins', ingredients: 'Fermented Kimchi, Tofu, Pork Belly, Gochugaru, Scallions' },
    { slug: 'risotto-ai-funghi', title: 'Wild Porcini Mushroom Risotto', prep: '40 mins', ingredients: 'Carnaroli Rice, Porcini, Vegetable Broth, Butter, Parmigiano' },
    { slug: 'guacamole-tradicional', title: 'Authentic Molcajete Guacamole', prep: '10 mins', ingredients: 'Hass Avocados, Lime Juice, Cilantro, White Onion, Serrano' },
  ];

  for (const r of recipes) {
    sites.push({
      address: `recipes/${r.slug}`,
      title: `Recipe: ${r.title}`,
      author: 'The Simple Chef',
      tags: ['recipe', 'food', r.slug],
      content: `
        <div style="max-width: 660px; margin: 0 auto; padding: 2rem; font-family: sans-serif; line-height: 1.6; color: #374151;">
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
            <span style="color: #b45309; font-weight: bold; text-transform: uppercase; font-size: 0.8rem;">No Ads • No Popups • Straight to the Recipe</span>
            <h1 style="color: #78350f; margin: 0.5rem 0 0.25rem 0;">${r.title}</h1>
            <p style="margin: 0; color: #92400e;">Prep Time: <strong>${r.prep}</strong></p>
          </div>
          <h3>Ingredients:</h3>
          <p style="background: #f3f4f6; padding: 1rem; border-radius: 6px; font-family: monospace;">
            ${r.ingredients}
          </p>
          <h3>Preparation:</h3>
          <ol style="padding-left: 1.25rem;">
            <li>Gather your highest-quality ingredients. Technique matters more than equipment.</li>
            <li>Heat your vessel gently. In cooking as in programming, patience produces reliability.</li>
            <li>Taste continuously as flavors develop and harmonize.</li>
            <li>Serve immediately while piping hot to friends and companions.</li>
          </ol>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 2rem 0;" />
          <p>
            More cooking on the Small Web: <a href="recipes/sourdough">Sourdough Bread</a> |
            <a href="webring/recipes">Zero-Nonsense Recipe Webring</a> |
            <a href="welcome">Return to Portal</a>
          </p>
        </div>
      `,
    });
  }

  // 7. Tech Notes & RFCs (20 sites)
  for (let i = 1; i <= 20; i++) {
    const padded = i.toString().padStart(2, '0');
    sites.push({
      address: `rfc/rfc-${padded}`,
      title: `RFC ${1000 + i}: Hypertext Protocol Specification Part ${i}`,
      author: 'Network Working Group',
      tags: ['rfc', 'standards', 'tech'],
      content: `
        <div style="max-width: 700px; margin: 0 auto; padding: 2rem; font-family: 'Courier New', monospace; font-size: 0.95rem; color: #1e293b; background: #fafafa; border: 1px solid #e2e8f0;">
          <pre style="white-space: pre-wrap; margin: 0;">
Network Working Group                                          Request for Comments: ${1000 + i}
Small Web Standards Group                                      Category: Informational
Date: September 2026

             SPECIFICATION FOR MINIMALIST CLIENT ARCHITECTURES (${padded})

1. Status of this Memo
   This document specifies an Internet standards track protocol for the Small Web community.
   Distribution of this memo is unlimited.

2. Browser State Transitions
   A conforming browser agent MUST support the five fundamental lifecycles:
   - 01 Typed: The user inputs an address into the omnibar.
   - 02 Loading: Asynchronous network resolution begins.
   - 03 Shown: The document content is rendered inside the sandboxed viewport.
   - 04 In history: Navigating through previously visited nodes indicates past presence.
   - 05 Nowhere: When resolution yields no document, the 404 state MUST be rendered cleanly.

3. Back and Forward Stack Integrity
   When stepping back in time, the forward history MUST remain intact until a NEW address
   is followed, at which point the forward history is permanently truncated.

See Also:
   - <a href="rfc/rfc-01">RFC 1001: Foundations</a>
   - <a href="encyclopedia/browser-history-stack">Encyclopedia: History Stacks</a>
   - <a href="welcome">Small Web Index</a>
          </pre>
        </div>
      `,
    });
  }

  // 8. Microblogs & Log entries (50 sites)
  const logTopics = [
    'compiler-musings', 'analog-synths', 'mechanical-pencils', 'sqlite-in-memory', 'cassette-tape-loops',
    'baking-focaccia', 'crt-monitors', 'solar-powered-servers', 'zen-gardens', 'typewriters',
    'fountain-pen-inks', 'ham-radio-frequencies', 'telescope-alignment', 'hand-carved-spoons', 'fermentation-crocks',
    'lisp-macros', 'matrix-keyboards', 'gemini-protocol', 'gopher-holes', 'permaculture-design',
    'book-binding-thread', 'darkroom-chemicals', 'vinyl-pressing', 'ambient-soundscapes', 'monochrome-photography',
    'clockwork-watches', 'field-recordings', 'lo-fi-beats', 'handwritten-letters', 'woodworking-planes'
  ];

  for (let idx = 0; idx < logTopics.length; idx++) {
    const slug = logTopics[idx];
    const logNum = idx + 1;
    sites.push({
      address: `logs/${slug}`,
      title: `Log #${logNum}: Observations on ${slug.replace(/-/g, ' ')}`,
      author: 'The Observer',
      tags: ['log', 'microblog', slug],
      content: `
        <div style="max-width: 640px; margin: 0 auto; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2d3748; line-height: 1.7;">
          <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #718096; margin-bottom: 0.5rem;">FIELD NOTE // LOG #${logNum}</div>
          <h2 style="margin-top: 0; color: #1a202c;">On ${slug.replace(/-/g, ' ')}</h2>
          <p>
            Today I spent three quiet hours examining ${slug.replace(/-/g, ' ')}.
            There is a deep peace in things that do not demand immediate attention.
            When software is small enough to hold entirely in your head, the friction between thought and realization vanishes.
          </p>
          <p>
            Hypertext creates serendipity. When you read this, you may jump to <a href="garden/digital-gardening">Digital Gardening</a>,
            or check out <a href="users/bob">Bob's workshop notes</a>.
          </p>
          <div style="margin-top: 2rem; padding: 1rem; background: #edf2f7; border-radius: 6px; font-size: 0.9rem;">
            « <a href="welcome">Back to Home</a> | <a href="directory">View All Logs</a> »
          </div>
        </div>
      `,
    });
  }

  // 9. Additional Miscellaneous Curated Pages to reach > 200 sites
  const cityThemes = [
    'tokyo-neon', 'kyoto-moss', 'reykjavik-winter', 'paris-bookstalls', 'cairo-bazaars',
    'vancouver-rain', 'edinburgh-closes', 'lisbon-trams', 'valparaiso-hills', 'prague-bridges',
    'berlin-lofts', 'amsterdam-canals', 'seoul-alleys', 'taipei-nightmarkets', 'havana-courtyards',
    'venice-lagoon', 'vienna-cafes', 'dublin-pubs', 'oslo-fjords', 'montreal-snow',
    'sydney-ferries', 'marrakech-riads', 'san-francisco-fog', 'portland-bridges', 'seattle-piers',
    'florence-piazzas', 'budapest-baths', 'bangkok-canals', 'oaxaca-markets', 'istanbul-ferries',
    'tallinn-towers', 'helsinki-saunas', 'zurich-lakes', 'salzburg-castles', 'porto-cellars',
    'antwerp-diamonds', 'madrid-sunsets', 'barcelona-mosaics', 'athens-acropolis', 'naples-pizzerias',
    'oxford-quads', 'cambridge-punts', 'york-shambles', 'bath-crescents', 'inverness-lochs',
    'bergen-wharves', 'tromso-aurora', 'gothenburg-archipelago', 'malmo-skies', 'bruges-canals'
  ];

  for (let i = 0; i < cityThemes.length; i++) {
    const name = cityThemes[i];
    sites.push({
      address: `travelogue/${name}`,
      title: `Travelogue: Wandering through ${name.replace(/-/g, ' ')}`,
      author: 'Wanderer',
      tags: ['travel', 'geography', name],
      content: `
        <div style="max-width: 680px; margin: 0 auto; padding: 2rem; font-family: 'Palatino', serif; line-height: 1.8; color: #292524;">
          <h1 style="color: #44403c; border-bottom: 1px solid #d6d3d1; padding-bottom: 0.5rem;">${name.replace(/-/g, ' ').toUpperCase()}</h1>
          <p style="font-size: 1.1rem; font-style: italic; color: #78716c;">
            Reflections from the cobblestones, harbors, and quiet corners of the world.
          </p>
          <p>
            Travel and browsing share the same psychological impulse: the desire to see what lies beyond the next corner.
            In a physical city, you turn down a narrow alleyway. In a browser, you follow a blue link.
          </p>
          <p>
            You can return from this excursion using the <strong>Back</strong> button in the browser chrome above,
            or continue wandering via <a href="directory">The Small Web Directory</a>.
          </p>
          <div style="margin-top: 2rem; font-size: 0.9rem; color: #a8a29e;">
            Coordinates: ${name} • <a href="welcome">Home</a>
          </div>
        </div>
      `,
    });
  }

  // 10. Poetry & Retro Arcade Corner (25 additional sites)
  const arcadeThemes = [
    'space-invaders', 'pacman-maze', 'galaga-stars', 'tetris-geometry', 'asteroids-drift',
    'dig-dug-tunnels', 'donkey-kong-girders', 'centipede-mushrooms', 'frogger-crossing', 'defender-radar',
    'outrun-highways', 'bubble-bobble-caves', 'tempest-tubes', 'joust-ostriches', 'qbert-pyramids',
    'haiku-spring-rain', 'haiku-summer-cicadas', 'haiku-autumn-leaves', 'haiku-winter-pines', 'haiku-midnight-code',
    'sonnet-silicon', 'concrete-poem-ladder', 'epigram-electric', 'ode-to-the-cursor', 'ballad-of-the-buffer'
  ];

  for (let i = 0; i < arcadeThemes.length; i++) {
    const slug = arcadeThemes[i];
    sites.push({
      address: `arcade/${slug}`,
      title: `Retro Arcade & Poetry: ${slug.replace(/-/g, ' ')}`,
      author: 'ArcadeArchivist',
      tags: ['arcade', 'poetry', slug],
      content: `
        <div style="max-width: 660px; margin: 0 auto; padding: 2rem; background: #09090b; color: #22c55e; font-family: 'Courier New', monospace; border: 3px solid #16a34a; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 2rem;">🕹️ 👾</div>
            <h1 style="color: #4ade80; margin: 0.5rem 0;">ARCADE ARCHIVE: ${slug.toUpperCase()}</h1>
            <p style="color: #15803d; font-size: 0.85rem;">[ HIGH SCORE: 999990 // COIN INSERTED ]</p>
          </div>
          <p>
            Pixels like phosphorescent emeralds burning on a curved cathode-ray tube.
            Before photorealistic shaders, imagination filled the gaps between eight-pixel sprites.
          </p>
          <pre style="background: #000; border: 1px solid #15803d; padding: 1rem; color: #86efac; overflow-x: auto;">
  +-------------------------------------+
  |   ${slug.padEnd(33, ' ')}   |
  |   INSERT COIN TO RETRACE STEPS      |
  +-------------------------------------+
          </pre>
          <p>
            Use the browser controls to go back, or jump to:
            <ul>
              <li><a href="welcome" style="color: #86efac;">Small Web Portal</a></li>
              <li><a href="directory" style="color: #86efac;">Directory of All Cabinets</a></li>
              <li><a href="webring/retro" style="color: #86efac;">Retro Webring</a></li>
            </ul>
          </p>
        </div>
      `,
    });
  }

  // 11. The Directory Site (Lists all pages dynamically)
  sites.push({
    address: 'directory',
    title: 'The Grand Small Web Directory',
    author: 'Chief Librarian',
    tags: ['directory', 'index', 'all'],
    content: `
      <div style="max-width: 760px; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif; color: #1e293b;">
        <h1 style="color: #0284c7; margin-bottom: 0.5rem;">The Grand Small Web Directory</h1>
        <p style="color: #64748b;">
          An indexed catalogue of over 200 interconnected pages currently stored in the MongoDB collection.
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />

        <h3>🏛️ Core Portals & Testing</h3>
        <ul>
          <li><a href="welcome">The Welcome Portal</a></li>
          <li><a href="about">Architecture & Sandboxing Specification</a></li>
          <li><a href="test/broken-link">Deliberate Broken Link (Tests 05 Nowhere)</a></li>
          <li><a href="security/sandbox-test">Security Sandbox Escape Prevention Proof</a></li>
        </ul>

        <h3>💍 The Webrings</h3>
        <ul>
          <li><a href="webring/hypertext">Hypertext Explorers</a></li>
          <li><a href="webring/retro">Retro Web Enthusiasts</a></li>
          <li><a href="webring/devs">Low-Tech Developers</a></li>
          <li><a href="webring/writers">Digital Essayists</a></li>
          <li><a href="webring/botanists">Digital Gardeners</a></li>
          <li><a href="webring/recipes">Zero-Nonsense Cooks</a></li>
        </ul>

        <h3>📚 Encyclopedia of Computing</h3>
        <ul>
          <li><a href="encyclopedia/hypertext">Hypertext: Concept and Genesis</a></li>
          <li><a href="encyclopedia/browser-history-stack">Browser History Stack Semantics</a></li>
          <li><a href="encyclopedia/tim-berners-lee">Tim Berners-Lee & CERN</a></li>
          <li><a href="encyclopedia/project-xanadu">Ted Nelson & Project Xanadu</a></li>
          <li><a href="encyclopedia/memex">Vannevar Bush & The Memex</a></li>
        </ul>

        <h3>🏡 Personal Spaces</h3>
        <ul>
          <li><a href="users/alice">Alice's Personal Notebook</a></li>
          <li><a href="users/bob">Bob's Engineering Log</a></li>
          <li><a href="users/charlie">Charlie's Botany Lab</a></li>
          <li><a href="users/dana">Dana's Touring Journal</a></li>
          <li><a href="users/eve">Eve's Modular Synthesizers</a></li>
        </ul>

        <h3>🍳 Culinary Vault</h3>
        <ul>
          <li><a href="recipes/sourdough">Country Sourdough Bread</a></li>
          <li><a href="recipes/pasta-aglio-olio">Spaghetti Aglio e Olio</a></li>
          <li><a href="recipes/matcha-cookies">Chewy Matcha Cookies</a></li>
        </ul>

        <p style="margin-top: 2rem; font-size: 0.9rem; color: #94a3b8;">
          Tip: You can search across all text inside these pages with the Search drawer in the top navigation bar!
        </p>
      </div>
    `,
  });

  return sites;
}
