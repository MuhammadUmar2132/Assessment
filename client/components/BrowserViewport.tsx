import React, { useEffect, useRef } from 'react';
import { Site } from '../types/browser';

interface Props {
  site: Site | null;
  targetScrollY?: number;
  onNavigate: (address: string) => void;
  onScrollChanged: (scrollY: number) => void;
}

export const BrowserViewport: React.FC<Props> = ({
  site,
  targetScrollY = 0,
  onNavigate,
  onScrollChanged,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for messages from the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        const data = event.data;
        if (data?.type === 'NAVIGATE') {
          onNavigate(data.address);
        } else if (data?.type === 'SCROLL') {
          onScrollChanged(data.scrollY);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate, onScrollChanged]);

  // Restore scroll position after navigation
  useEffect(() => {
    if (iframeRef.current && targetScrollY > 0) {
      const timer = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'RESTORE_SCROLL', scrollY: targetScrollY }, '*'
        );
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [site, targetScrollY]);

  if (!site) return (
    <div className="flex-1 flex items-center justify-center bg-base">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-surface0 flex items-center justify-center mx-auto mb-3">
          <div className="w-2 h-2 rounded-full bg-blue animate-pulse" />
        </div>
        <p className="text-xs text-overlay0">Loading Small Web...</p>
      </div>
    </div>
  );

  // The security bridge script injected into every page
  const bridgeScript = `<script>
(function() {
  // 1. Intercept ALL anchor clicks -> navigate via parent postMessage
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (el && el.tagName === 'A') {
      var href = el.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        e.preventDefault();
        e.stopPropagation();
        var clean = href
          .replace(/^smallweb:\\/\\//, '')
          .replace(/^https?:\\/\\/[^/]+\\//, '')
          .replace(/^\\/+/, '')
          .split('#')[0]
          .split('?')[0];
        window.parent.postMessage({ type: 'NAVIGATE', address: clean }, '*');
      }
    }
  }, true);

  // 2. Debounced scroll reporting for "Restore on Return"
  var scrollTimer;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function() {
      window.parent.postMessage({
        type: 'SCROLL',
        scrollY: window.scrollY || window.pageYOffset || 0
      }, '*');
    }, 50);
  }, { passive: true });

  // 3. Respond to scroll restoration commands
  window.addEventListener('message', function(evt) {
    if (evt.data && evt.data.type === 'RESTORE_SCROLL') {
      window.scrollTo({ top: evt.data.scrollY, behavior: 'instant' });
    }
  });
})();
</script>`;

  // Base styles injected as a fallback if the author didn't style their page
  const baseStyles = `<style id="__smallweb_base">
:root { color-scheme: light; }
body {
  margin: 0;
  padding: 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  background: #ffffff;
  line-height: 1.6;
}
a { color: #0284c7; text-decoration: underline; cursor: pointer; }
a:hover { color: #0369a1; }
img { max-width: 100%; height: auto; }
pre, code { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.2em 0.4em; font-size: 0.875em; }
pre { padding: 1rem; overflow-x: auto; }
pre code { border: none; padding: 0; background: none; }
blockquote { border-left: 3px solid #0284c7; margin: 1rem 0; padding-left: 1rem; color: #475569; }
h1,h2,h3,h4,h5,h6 { color: #0f172a; line-height: 1.3; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #e2e8f0; padding: 0.5rem 0.75rem; }
th { background: #f8fafc; font-weight: 600; }
</style>`;

  const safeDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${site.title || site.address}</title>
  ${baseStyles}
</head>
<body>
${site.content}
${bridgeScript}
</body>
</html>`;

  return (
    <div className="flex-1 w-full h-full overflow-hidden bg-white relative">
      {/*
        SECURITY: sandbox="allow-scripts" without allow-same-origin creates an opaque origin.
        Stranger scripts CANNOT access window.parent, cookies, localStorage, or outer DOM.
        Top-level navigation is blocked. All anchor clicks are captured by the bridge above.
      */}
      <iframe
        ref={iframeRef}
        key={site.address}
        srcDoc={safeDocument}
        title={site.title || site.address}
        sandbox="allow-scripts"
        loading="eager"
        className="w-full h-full border-none block"
        style={{ display: 'block' }}
      />
    </div>
  );
};
