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

  // Listen for navigation and scroll messages from inside the sandboxed iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Accept messages only from our iframe
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        const data = event.data;
        if (data && data.type === 'NAVIGATE') {
          onNavigate(data.address);
        } else if (data && data.type === 'SCROLL') {
          onScrollChanged(data.scrollY);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onNavigate, onScrollChanged]);

  // When site changes or targetScrollY updates, send restore scroll command
  useEffect(() => {
    if (iframeRef.current && targetScrollY > 0) {
      const timer = setTimeout(() => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'RESTORE_SCROLL', scrollY: targetScrollY },
          '*'
        );
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [site, targetScrollY]);

  if (!site) return null;

  // Build the sandboxed document content with the bridge script
  // LINE OF CONTAINMENT EXPLANATION:
  // sandbox="allow-scripts" ensures this document runs in an opaque origin (origin: 'null').
  // Scripts authored by strangers CANNOT access window.parent, cookies, or outer localStorage.
  // The bridge script intercepts all <a> clicks to route them into the simulated browser state machine.
  const bridgeScript = `
    <script>
      (function() {
        // 1. Intercept all link clicks (including broken links)
        document.addEventListener('click', function(e) {
          var target = e.target;
          while (target && target.tagName !== 'A') {
            target = target.parentElement;
          }
          if (target && target.tagName === 'A') {
            var href = target.getAttribute('href');
            if (href) {
              e.preventDefault();
              e.stopPropagation();
              // Normalize href (strip leading slash, smallweb:// prefix, or hashes)
              var clean = href.replace(/^smallweb:\\/\\//, '').replace(/^\\/+/, '');
              window.parent.postMessage({ type: 'NAVIGATE', address: clean }, '*');
            }
          }
        }, true);

        // 2. Report scroll position back to parent for "Restore on Return"
        var scrollTimeout;
        window.addEventListener('scroll', function() {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(function() {
            window.parent.postMessage({
              type: 'SCROLL',
              scrollY: window.scrollY || window.pageYOffset || 0
            }, '*');
          }, 60);
        });

        // 3. Listen for scroll restoration requests from parent
        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'RESTORE_SCROLL') {
            window.scrollTo(0, event.data.scrollY || 0);
          }
        });
      })();
    </script>
  `;

  // Provide clean default styling if the page author did not include standard body styles
  const baseStyle = `
    <style>
      body {
        margin: 0;
        padding: 1.5rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #1e293b;
        background-color: #ffffff;
      }
      a {
        color: #0284c7;
        text-decoration: underline;
        cursor: pointer;
      }
      a:hover {
        color: #0369a1;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    </style>
  `;

  const safeDocument = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${site.title || site.address}</title>
      ${baseStyle}
    </head>
    <body>
      ${site.content}
      ${bridgeScript}
    </body>
    </html>
  `;

  return (
    <div className="flex-1 w-full h-full bg-white relative overflow-hidden">
      {/* 
        CONTAINMENT ATTRIBUTE:
        sandbox="allow-scripts" ensures this document runs in an opaque origin (origin: 'null').
        Absence of allow-same-origin and allow-top-navigation prevents escaping,
        parent window hijacking, modal blocking, or cross-document intrusion.
      */}
      <iframe
        ref={iframeRef}
        key={site.address}
        srcDoc={safeDocument}
        title={site.title || site.address}
        sandbox="allow-scripts"
        className="w-full h-full border-none block"
      />
    </div>
  );
};

