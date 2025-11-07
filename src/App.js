// dergi.turkmsic.org — Ana Sayfa (React + Tailwind)
// Not: Bu tek dosya, Vercel/Next.js ya da düz React ortamında kolayca taşınabilir.
// Tailwind varsayılıyor. Renkler TurkMSIC paletine yakın tutuldu.

import React from "react";

// —— Mock veri ——
const latestIssue = {
  title: "Sayı 3 — Ekim 2025",
  cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop", // placeholder
  blurb:
    "Bu sayıda sağlık ve insan hakları kesişiminde güncel tartışmalar, saha notları ve illüstrasyonlar yer alıyor.",
  pdfUrl: "#",
};

const navItems = [
  { label: "Anasayfa", href: "#top" },
  { label: "Sayılar", href: "#arsiv" },
  { label: "Katkıda Bulun", href: "#katki" },
  { label: "Hakkında", href: "#hakkinda" },
  { label: "İletişim", href: "#iletisim" },
];

function Container({ children }) {
  return <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>;
}

function PrimaryButton({ href, onClick, children }) {
  return (
    <a
      href={href || "#"}
      onClick={onClick}
      role="button"
      className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

function OutlineButton({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-2xl border border-sky-600 px-5 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

export default function App() {
  // Smooth scroll for in-page anchors
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (!id || id === '#' || id === '#top') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Active section highlight
  const [active, setActive] = React.useState('#top');
  React.useEffect(() => {
    const sections = ['#top', '#son-sayi', '#katki', '#hakkinda', '#arsiv', '#iletisim']
      .map((id) => document.querySelector(id))
      .filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive('#' + visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.6, 1] }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Mock issues data (static)
  const issues = [
    {
      id: 'ekim-2025',
      title: 'Sayı 3 — Ekim 2025',
      cover:
        'TurkMSIC Dergi 3.Sayı.png',
      blurb:
        'Bu sayıda sağlık ve insan hakları kesişiminde güncel tartışmalar, saha notları ve illüstrasyonlar yer alıyor.',
      pdfUrl: '/pdfs/TurkMSIC Dergi 3.Sayı.pdf',
      toc: [
        { t: 'Editörden', p: 2 },
        { t: 'Dosya: Sağlıkta Eşitsizlik', p: 6 },
        { t: 'Röportaj: Saha Hikâyeleri', p: 18 },
        { t: 'İllüstrasyon Galerisi', p: 30 },
      ],
    },
    { id: 'mart-2025', title: 'Sayı 2 — Mart 2025', cover: 'https://images.unsplash.com/photo-1498758536662-35b82cd15e29?q=80&w=1200&auto=format&fit=crop', blurb: 'Toplum sağlığı, tıp öğrencisinin sosyal sorumluluğu ve etik.', pdfUrl: '/pdfs/sayi-3-ekim-2025.pdf', toc: [] },
    { id: 'kasim-2024', title: 'Sayı 1 — Kasım 2024', cover: 'https://images.unsplash.com/photo-1473862170182-0f732d8f1f36?q=80&w=1200&auto=format&fit=crop', blurb: 'Yeni başlangıçlar, yeni sesler.', pdfUrl: '/pdfs/sayi-3-ekim-2025.pdf', toc: [] },
    { id: 'ozel-2024', title: 'Özel Dosya — 2024', cover: 'https://images.unsplash.com/photo-1505483531331-4072e5756b6e?q=80&w=1200&auto=format&fit=crop', blurb: 'Özel seçkiler.', pdfUrl: '/pdfs/sayi-3-ekim-2025.pdf', toc: [] },
  ];

  const latestIssue = issues[0];

  // Embedded PDF viewer state (no-backend): opens PDFs inside a modal iframe
  const [pdfUrl, setPdfUrl] = React.useState("");
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setPdfUrl(""); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);


  // Modal state for issue preview
  const [openIssue, setOpenIssue] = React.useState(null);

  // Katkı formu (frontend only)
  const [form, setForm] = React.useState({
    ad: '',
    mail: '',
    baslik: '',
    kategori: 'Yazı',
    link: '',
  });
  const [formErr, setFormErr] = React.useState('');

  const submitForm = async (e) => {
  e.preventDefault();
  setFormErr('');
  const emailOk = /.+@.+\..+/.test(form.mail);
  if (!form.ad || !emailOk || !form.baslik) {
    setFormErr('Lütfen ad, geçerli e-posta ve başlık alanlarını doldurun.');
    return;
  }
  try {
    const r = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.ad,
        email: form.mail,
        title: form.baslik,
        category: form.kategori,
        link: form.link || ''
      })
    });
    if (!r.ok) {
      const d = await r.json().catch(()=> ({}));
      throw new Error(d.error || 'Gönderim sırasında bir hata oluştu.');
    }
    alert('Gönderildi! En kısa sürede dönüş yapacağız.');
    setForm({ ad:'', mail:'', baslik:'', kategori:'Yazı', link:'' });
  } catch (err) {
    setFormErr(err.message);
  }
};


  return (
    <main id="top" className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-white text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/85 backdrop-blur">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="#top" className="flex items-center gap-2">
              <img src="/TurkMSIC Yatay Logo.png" alt="TurkMSIC Dergi"
  className="h-10 w-auto object-contain sm:h-11 md:h-12"/>
              <span className="text-lg font-bold tracking-tight">TurkMSIC Dergi</span>
            </a>
            <nav className="hidden gap-6 md:flex">
              {[
                { href: '#son-sayi', label: 'Son Sayı' },
                { href: '#arsiv', label: 'Sayılar' },
                { href: '#katki', label: 'Katkıda Bulun' },
                { href: '#hakkinda', label: 'Hakkında' },
                { href: '#iletisim', label: 'İletişim' },
              ].map((i) => (
                <a
                  key={i.href}
                  href={i.href}
                  className={`text-sm font-medium transition ${
                    active === i.href ? 'text-sky-700' : 'text-slate-700 hover:text-sky-700'
                  }`}
                >
                  {i.label}
                </a>
              ))}
            </nav>
          </div>
        </Container>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                Tıp öğrencilerinden <span className="text-sky-700">dünyaya</span> seslenen bir dergi.
              </h1>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-slate-600">
                TurkMSIC Dergi; insan hakları, sağlık ve barış odaklı yazıların buluşma noktası. Her sayıda yeni bir
                bakış açısı, her satırda bir farkındalık.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <PrimaryButton href="#son-sayi">Son Sayıyı Oku</PrimaryButton>
                <OutlineButton href="#katki">Katkıda Bulun</OutlineButton>
              </div>
              <div className="mt-6 text-xs text-slate-500">Ceviz Ağacı’ndan doğan yeni bir hikâye.</div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-sky-100 blur-2xl" />
              <img
                src={latestIssue.cover}
                alt="Son sayı kapak görseli"
                className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* SON SAYI VİTRİNİ */}
      <section id="son-sayi" className="border-t border-slate-200 bg-white py-14">
        <Container>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold">{latestIssue.title}</h2>
            <a href="#arsiv" className="text-sm font-semibold text-sky-700 hover:underline">
              Tüm sayılar
            </a>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1.3fr]">
            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <p className="text-slate-700">{latestIssue.blurb}</p>
              <div className="mt-5 flex gap-3">
                <PrimaryButton onClick={() => setPdfUrl(latestIssue.pdfUrl)}>PDF’yi Oku</PrimaryButton>
                <OutlineButton href="#icerik">İçindekiler</OutlineButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {issues.slice(0, 6).map((iss, i) => (
                <button
                  key={iss.id}
                  onClick={() => setOpenIssue(iss)}
                  className="group rounded-2xl border border-slate-200 p-4 text-left transition hover:shadow-md"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden rounded-xl">
                    <img src={iss.cover} alt={iss.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-3 text-sm font-semibold group-hover:text-sky-700">{iss.title}</div>
                  <div className="text-xs text-slate-500 line-clamp-2">{iss.blurb}</div>
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* KATKI ÇAĞRISI + FORM */}
      <section id="katki" className="bg-gradient-to-br from-sky-50 to-white py-16">
        <Container>
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">Sen de yaz, sen de anlat.</h3>
              <p className="mt-3 text-slate-600">
                Backend olmadan da hızlıca katkı alabilmek için form bilgilerini e‑posta taslağına dönüştürüyoruz. ITSD
                daha sonra Google Form/Backend ile entegre edebilir.
              </p>
              <ul className="mt-4 list-inside list-disc text-sm text-slate-600">
                <li>Yazı / İllüstrasyon / Fotoğraf kategorilerinden birini seç.</li>
                <li>Varsa çalışmana ait bir paylaşım linki ekleyebilirsin (Drive, Notion, vb.).</li>
              </ul>
            </div>
            <form onSubmit={submitForm} id="katki-form" className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="grid gap-4">
                <label className="text-sm">Ad Soyad
                  <input value={form.ad} onChange={(e)=>setForm({...form, ad:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none" placeholder="Adın" />
                </label>
                <label className="text-sm">E‑posta
                  <input value={form.mail} onChange={(e)=>setForm({...form, mail:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none" placeholder="ornek@posta.com" />
                </label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="text-sm">Kategori
                    <select value={form.kategori} onChange={(e)=>setForm({...form, kategori:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none">
                      <option>Yazı</option>
                      <option>İllüstrasyon</option>
                      <option>Fotoğraf</option>
                    </select>
                  </label>
                  <label className="text-sm">Başlık
                    <input value={form.baslik} onChange={(e)=>setForm({...form, baslik:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none" placeholder="Çalışma başlığı" />
                  </label>
                </div>
                <label className="text-sm">Çalışma Linki (opsiyonel)
                  <input value={form.link} onChange={(e)=>setForm({...form, link:e.target.value})} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none" placeholder="Drive/Notion bağlantısı" />
                </label>
                {formErr && <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{formErr}</div>}
                <div className="flex gap-3">
                  <PrimaryButton href="#" >
                    <button type="submit">E‑posta ile Gönder</button>
                  </PrimaryButton>
                  <OutlineButton href="#">Yazım Kılavuzu (PDF)</OutlineButton>
                </div>
                <div className="text-xs text-slate-500">Dosya yükleme için geçici çözüm: link paylaş. ITSD entegre edince formla yüklenebilecek.</div>
              </div>
            </form>
          </div>
        </Container>
      </section>

      {/* HAKKINDA */}
      <section id="hakkinda" className="border-t border-slate-200 bg-white py-16">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">TurkMSIC Dergi nedir?</h3>
              <p className="mt-3 text-slate-600">
                Tıp fakültesi öğrencilerinin kaleminden; sağlık, toplum ve insan hakları ekseninde çok sesli bir yayın.
                Ulusal ölçekte yayımlanır, her sayıda farklı tema ve dosyalar içerir.
              </p>
              <p className="mt-3 text-slate-600">
                Akademik titizlikle, samimi bir üslupla yazılmış içerikler; saha deneyimleri, röportajlar ve özgün
                illüstrasyonlarla buluşur.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-lg font-semibold">Editör Ekibi</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>Genel Yayın Yönetmeni — <span className="font-medium">(isim)</span></li>
                <li>Yardımcı Editör — <span className="font-medium">(isim)</span></li>
                <li>Sanat Yönetmeni — <span className="font-medium">(isim)</span></li>
                <li>Katkı Editörleri — <span className="font-medium">(isimler)</span></li>
              </ul>
              <div className="mt-4 text-xs text-slate-500">Önceki adıyla “Ceviz Ağacı”.</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ARŞİV */}
      <section id="arsiv" className="bg-gradient-to-b from-white to-sky-50 py-16">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h3 className="text-2xl font-bold">Sayılar</h3>
            <ArchiveControls />
          </div>
          <ArchiveGrid issues={issues} onOpen={setOpenIssue} />
        </Container>
      </section>

      {/* İLETİŞİM / FOOTER */}
      <footer id="iletisim" className="border-t border-slate-200 bg-white py-10">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2">
                
                <span className="text-lg font-bold tracking-tight">TurkMSIC Dergi</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">© 2025 TurkMSIC Publications</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Bağlantılar</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-sky-700" href="#arsiv">Sayılar</a></li>
                <li><a className="hover:text-sky-700" href="#katki">Katkıda Bulun</a></li>
                <li><a className="hover:text-sky-700" href="#hakkinda">Hakkında</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">İletişim</h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:text-sky-700" href="mailto:dergi@turkmsic.org">dergi@turkmsic.org</a></li>
                <li><a className="hover:text-sky-700" href="#">Instagram</a></li>
                <li><a className="hover:text-sky-700" href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </Container>
      </footer>

      {/* ISSUE MODAL */}
      {openIssue && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpenIssue(null)}>
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-xl font-bold">{openIssue.title}</h4>
              <button className="rounded-full p-2 hover:bg-slate-100" onClick={() => setOpenIssue(null)}>✕</button>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-[1fr_1.4fr]">
              <img src={openIssue.cover} alt={openIssue.title} className="aspect-[3/4] w-full rounded-xl object-cover" />
              <div>
                <p className="text-slate-700">{openIssue.blurb}</p>
                <h5 className="mt-4 text-sm font-semibold">İçindekiler</h5>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {openIssue.toc?.length ? openIssue.toc.map((it, idx)=>(
                    <li key={idx}>• {it.t} <span className="text-slate-400">(s.{it.p})</span></li>
                  )) : <li>Yakında…</li>}
                </ul>
                <div className="mt-5 flex gap-3">
                  <PrimaryButton onClick={() => setPdfUrl(openIssue.pdfUrl)}>PDF’yi Oku</PrimaryButton>
                  <OutlineButton href="#">PDF’yi İndir</OutlineButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
{/* PDF VIEWER MODAL */}
{pdfUrl && (
  <div
    className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
    onClick={() => setPdfUrl("")}
  >
    <div
      className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="text-sm text-slate-600 truncate">{pdfUrl}</div>
        <button
          className="rounded-full p-2 hover:bg-slate-100"
          onClick={() => setPdfUrl("")}
        >
          ✕
        </button>
      </div>
      <iframe title="PDF" src={pdfUrl} className="h-[80vh] w-full" />
    </div>
  </div>
)}


    </main>
  );
}

// ----- Ek Bileşenler -----
function ArchiveControls() {
  const [q, setQ] = React.useState('');
  const [year, setYear] = React.useState('');
  // State'i parent okumuyor ama gelecekte filtreyi lift edebiliriz
  return (
    <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <input
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Sayı ara…"
        className="flex-1 rounded-xl px-3 py-2 outline-none"
      />
      <select onChange={(e)=>setYear(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2">
        <option value="">Yıl</option>
        <option>2025</option>
        <option>2024</option>
      </select>
    </div>
  );
}

function ArchiveGrid({ issues, onOpen }) {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {issues.map((iss) => (
        <button
          key={iss.id}
          onClick={() => onOpen(iss)}
          className="group block rounded-2xl border border-slate-200 p-3 text-left transition hover:shadow-md"
        >
          <div className="aspect-[3/4] w-full overflow-hidden rounded-xl">
            <img src={iss.cover} alt={iss.title} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 text-sm font-semibold group-hover:text-sky-700">{iss.title}</div>
          <div className="text-xs text-slate-500">İndir · Oku</div>
        </button>
      ))}
    </div>
  );
}
