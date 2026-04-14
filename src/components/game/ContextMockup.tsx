import type { ContextType } from '@/types';

interface ContextMockupProps {
  context: string;
  contextType: ContextType;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Split the raw context string into header fields + body. */
function parseEmail(raw: string) {
  const lines = raw.split('\n');
  const headers: { label: string; value: string }[] = [];
  let bodyStart = 0;
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inHeader && line === '---') { bodyStart = i + 1; inHeader = false; continue; }
    if (inHeader) {
      const match = line.match(/^(FROM|TO|SUBJECT):\s*(.+)/);
      if (match) { headers.push({ label: match[1], value: match[2] }); }
    }
  }

  const bodyLines = lines.slice(bodyStart);
  // Separate the ⚠ NOTE lines at the bottom
  const noteIdx = bodyLines.findIndex((l) => l.startsWith('⚠'));
  const body = (noteIdx === -1 ? bodyLines : bodyLines.slice(0, noteIdx)).join('\n').trim();
  const notes = noteIdx === -1 ? [] : bodyLines.slice(noteIdx);

  return { headers, body, notes };
}

function parseSms(raw: string) {
  const lines = raw.split('\n');
  const senderLine = lines.find((l) => l.startsWith('SENDER:')) ?? '';
  const sender = senderLine.replace('SENDER:', '').trim();
  const rest = lines.filter((l) => !l.startsWith('SENDER:'));
  const noteIdx = rest.findIndex((l) => l.startsWith('⚠'));
  const msgLines = (noteIdx === -1 ? rest : rest.slice(0, noteIdx)).filter((l) => l !== '---');
  const notes = noteIdx === -1 ? [] : rest.slice(noteIdx);
  return { sender, message: msgLines.join('\n').trim(), notes };
}

function parseBrowser(raw: string) {
  const lines = raw.split('\n');
  const urlLine = lines.find((l) => l.startsWith('https://') || l.startsWith('http://')) ?? '';
  const noteIdx = lines.findIndex((l) => l.startsWith('⚠'));
  const contentLines = lines.filter(
    (l) => !l.startsWith('ADDRESS BAR') && !l.startsWith('https://') && !l.startsWith('⚠') && l !== '---',
  );
  const notes = noteIdx === -1 ? [] : lines.slice(noteIdx);
  return { url: urlLine, content: contentLines.join('\n').trim(), notes };
}

function parseNotes(raw: string) {
  const lines = raw.split('\n');
  const noteIdx = lines.findIndex((l) => l.startsWith('⚠'));
  const main = (noteIdx === -1 ? lines : lines.slice(0, noteIdx)).join('\n').trim();
  const notes = noteIdx === -1 ? [] : lines.slice(noteIdx);
  return { main, notes };
}

// ─── Note strip (shared across all mockup types) ──────────────────────────────

function NoteStrip({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null;
  return (
    <div className="px-4 py-3 bg-amber-50 border-t border-amber-200 rounded-b-xl">
      {notes.map((n, i) => (
        <p key={i} className="text-xs text-amber-800 leading-relaxed font-medium">{n}</p>
      ))}
    </div>
  );
}

// ─── Email mockup ─────────────────────────────────────────────────────────────

function EmailMockup({ context }: { context: string }) {
  const { headers, body, notes } = parseEmail(context);
  const subjectHeader = headers.find((h) => h.label === 'SUBJECT');
  const metaHeaders = headers.filter((h) => h.label !== 'SUBJECT');

  const highlightDomain = (value: string) => {
    // Bold and colour the domain part of email addresses
    return value.replace(/<([^>]+)>/, (_, email) => {
      const atIdx = email.lastIndexOf('@');
      if (atIdx === -1) return `<${email}>`;
      const local = email.slice(0, atIdx);
      const domain = email.slice(atIdx);
      return `<span class="font-mono">&lt;${local}<strong class="text-red-600">${domain}</strong>&gt;</span>`;
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      {/* Window chrome */}
      <div className="bg-slate-100 px-4 py-2.5 flex items-center gap-2 border-b border-slate-200">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="flex-1 text-center text-xs text-slate-500 font-medium">📧 Inbox — Mail</span>
      </div>

      {/* Subject */}
      {subjectHeader && (
        <div className="bg-white px-4 py-3 border-b border-slate-100">
          <p className="font-semibold text-slate-800 text-sm leading-snug">{subjectHeader.value}</p>
        </div>
      )}

      {/* From / To */}
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 space-y-1.5">
        {metaHeaders.map(({ label, value }) => (
          <div key={label} className="flex items-baseline gap-2">
            <span className="text-xs font-semibold text-slate-400 w-8 flex-shrink-0">{label}</span>
            <span
              className="text-xs text-slate-700 break-all"
              dangerouslySetInnerHTML={{ __html: highlightDomain(value) }}
            />
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="bg-white px-4 py-4">
        <pre className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">{body}</pre>
      </div>

      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── SMS mockup ───────────────────────────────────────────────────────────────

function SmsMockup({ context }: { context: string }) {
  const { sender, message, notes } = parseSms(context);
  const lines = message.split('\n');
  const linkLine = lines.find((l) => /[a-z0-9-]+\.[a-z]{2,}\//.test(l));
  const textLines = lines.filter((l) => l !== linkLine);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      {/* Phone status bar */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
        <span className="text-white text-xs font-medium">📱 Messages</span>
        <div className="flex gap-1 text-white/60 text-xs">
          <span>●●●</span>
          <span>WiFi</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Conversation header */}
      <div className="bg-slate-700 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-sm">
          📦
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{sender || 'Unknown'}</p>
          <p className="text-slate-300 text-xs">Text Message</p>
        </div>
      </div>

      {/* Message bubble */}
      <div className="bg-slate-100 px-4 pt-4 pb-3 flex flex-col items-start gap-1">
        <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200">
          <p className="text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
            {textLines.join('\n')}
          </p>
          {linkLine && (
            <p className="mt-2 text-blue-600 text-xs underline font-medium break-all">{linkLine}</p>
          )}
        </div>
        <p className="text-slate-400 text-[10px] ml-1">Today, 10:47 AM</p>
      </div>

      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── Browser mockup ───────────────────────────────────────────────────────────

function BrowserMockup({ context }: { context: string }) {
  const { url, content, notes } = parseBrowser(context);
  const isSuspicious = url && !url.includes('microsoftonline.com') && !url.includes('google.com');

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      {/* Browser chrome */}
      <div className="bg-slate-100 px-3 py-2.5 flex items-center gap-2 border-b border-slate-200">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-400" />
          <span className="w-3 h-3 rounded-full bg-amber-400" />
          <span className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        {/* Address bar */}
        <div className={`flex-1 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono border ${
          isSuspicious ? 'bg-red-50 border-red-300' : 'bg-white border-slate-200'
        }`}>
          <span className={isSuspicious ? 'text-red-500' : 'text-green-600'}>
            {isSuspicious ? '⚠' : '🔒'}
          </span>
          <span className={`truncate ${isSuspicious ? 'text-red-700' : 'text-slate-600'}`}>
            {url || 'https://...'}
          </span>
        </div>
      </div>

      {/* Page content */}
      <div className="bg-white px-6 py-5">
        <div className="flex flex-col items-center gap-4 max-w-xs mx-auto text-center">
          {/* Microsoft logo placeholder */}
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5 w-7 h-7">
              <div className="bg-red-500 rounded-sm" />
              <div className="bg-green-500 rounded-sm" />
              <div className="bg-blue-500 rounded-sm" />
              <div className="bg-amber-400 rounded-sm" />
            </div>
            <span className="font-semibold text-slate-700 text-sm">Microsoft</span>
          </div>

          <p className="text-slate-800 font-semibold text-sm">{content || 'Sign in'}</p>

          {/* Fake form fields */}
          <div className="w-full space-y-2 text-left">
            <input
              readOnly
              value="you@acme-corp.com"
              className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-600 bg-slate-50"
            />
            <input
              readOnly
              type="password"
              value="••••••••"
              className="w-full border border-slate-300 rounded px-3 py-2 text-xs text-slate-600 bg-slate-50"
            />
            <button
              type="button"
              disabled
              className="w-full bg-blue-600 text-white text-xs font-medium py-2 rounded cursor-default"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>

      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── Physical poster mockup ───────────────────────────────────────────────────

function PosterMockup({ context }: { context: string }) {
  const { main, notes } = parseNotes(context);
  // Strip the ASCII QR art from display — we'll render our own CSS version
  const textLines = main.split('\n').filter(
    (l) => !l.includes('┌') && !l.includes('│') && !l.includes('└') && !l.includes('▓') && !l.includes('░'),
  );

  // Simple CSS QR pattern (decorative only)
  const qrPattern = [
    [1,1,1,0,1,0,1,1,1],
    [1,0,1,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,0,1],
    [0,0,0,1,0,1,0,0,0],
    [1,1,0,0,1,0,0,1,1],
    [0,0,0,1,0,1,0,0,0],
    [1,0,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,1,0,1],
    [1,1,1,0,1,0,1,1,1],
  ];

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      {/* Poster */}
      <div className="bg-white px-5 py-5 border-b border-slate-100">
        <div className="border-2 border-slate-800 rounded-lg p-4 flex flex-col items-center gap-4">
          {/* Company header */}
          <div className="text-center">
            <p className="font-bold text-slate-800 text-sm tracking-wide">🏢 ACME CORP</p>
          </div>
          <div className="w-full border-t border-slate-200" />

          {/* Poster text */}
          {textLines.map((line, i) => (
            <p key={i} className="text-center text-slate-700 text-xs leading-relaxed">
              {line}
            </p>
          ))}

          {/* CSS QR code */}
          <div className="p-2 border border-slate-300 rounded bg-white">
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(9, 10px)` }}>
              {qrPattern.flat().map((cell, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-[1px] ${cell ? 'bg-slate-900' : 'bg-white'}`}
                />
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-[10px] italic">
            — HR Team
          </p>
        </div>
      </div>

      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── Phone call mockup ────────────────────────────────────────────────────────

function PhoneMockup({ context }: { context: string }) {
  const { main, notes } = parseNotes(context);
  const lines = main.split('\n');
  const headerLines = lines.slice(0, 3);
  const dialogLines = lines.slice(3);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      <div className="bg-slate-800 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-xl">
          📞
        </div>
        <div>
          {headerLines.map((l, i) => (
            <p key={i} className={i === 0 ? 'text-white text-xs font-semibold' : 'text-slate-300 text-xs'}>{l}</p>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm">✕</div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</div>
        </div>
      </div>

      <div className="bg-slate-700 px-4 py-4">
        <div className="bg-slate-600/50 rounded-lg px-4 py-3">
          <pre className="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
            {dialogLines.join('\n').trim()}
          </pre>
        </div>
      </div>

      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── Social / LinkedIn mockup ─────────────────────────────────────────────────

function SocialMockup({ context }: { context: string }) {
  const lines = context.split('\n');
  const titleLine = lines.find((l) => l.startsWith('LINKEDIN MESSAGE')) ?? '';
  const profileLine = lines.find((l) => l.startsWith('👤')) ?? '';
  const noteIdx = lines.findIndex((l) => l.startsWith('⚠'));
  const dialogLines = lines.filter(
    (l) => l !== titleLine && l !== profileLine && !l.startsWith('⚠') && l !== '─────────────────────────────────────────',
  );
  const notes = noteIdx === -1 ? [] : lines.slice(noteIdx);
  const message = dialogLines.join('\n').trim();

  const [profileName, profileMeta] = profileLine.startsWith('👤')
    ? profileLine.replace('👤 ', '').split(' · ')
    : ['Unknown', ''];

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      {/* LinkedIn header */}
      <div className="bg-[#0077b5] px-4 py-2.5 flex items-center gap-2">
        <span className="text-white font-bold text-sm tracking-tight">in</span>
        <span className="text-white/80 text-xs font-medium ml-1">Messages</span>
      </div>

      {/* Profile */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center text-lg flex-shrink-0">
          👤
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-xs">{profileName}</p>
          <p className="text-slate-500 text-[10px]">{profileMeta}</p>
        </div>
        <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
          New profile
        </span>
      </div>

      {/* Message bubble */}
      <div className="bg-slate-50 px-4 py-4 flex flex-col items-start">
        <div className="max-w-[90%] bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-slate-200">
          <pre className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap font-sans">{message}</pre>
        </div>
      </div>

      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── Plain fallback ───────────────────────────────────────────────────────────

function PlainMockup({ context }: { context: string }) {
  const { main, notes } = parseNotes(context);
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm text-sm">
      <div className="bg-slate-50 px-4 py-4">
        <pre className="text-slate-600 text-xs leading-relaxed whitespace-pre-wrap font-sans">{main}</pre>
      </div>
      <NoteStrip notes={notes} />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ContextMockup({ context, contextType }: ContextMockupProps) {
  switch (contextType) {
    case 'email':   return <EmailMockup context={context} />;
    case 'sms':     return <SmsMockup context={context} />;
    case 'browser': return <BrowserMockup context={context} />;
    case 'poster':  return <PosterMockup context={context} />;
    case 'phone':   return <PhoneMockup context={context} />;
    case 'social':  return <SocialMockup context={context} />;
    default:        return <PlainMockup context={context} />;
  }
}
