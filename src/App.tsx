import React, { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  HeartPulse,
  Construction,
  Home,
  ShieldCheck,
  HeartHandshake,
  LayoutDashboard,
  ClipboardList,
  Users,
  ListTodo,
  FileBarChart,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  TrendingUp,
  MapPin,
  Menu,
  X,
  Camera,
  Info,
  ArrowRight,
  ChevronDown,
  Sparkles,
  LogOut,
  UserCog,
  Settings2,
  HelpCircle,
  Code2,
  FileJson,
  Upload,
  Shield,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  FileText,
  Copy,
  Trash2,
  Edit3,
  Save,
  LayoutGrid,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Types
type Role = "Admin Desa" | "Koordinator Bidang" | "Kader";
type View = "dashboard" | "input" | "sasaran" | "monitoring" | "laporan" | "users" | "settings" | "panduan" | "info" | `bidang-${string}`;

interface Bidang {
  id: string;
  name: string;
  short: string;
  desc: string;
  icon: any;
  count: number;
  progress: number;
  color: string;
  light: string;
  border: string;
  kegiatan: string[];
  subKegiatan: string[];
}

const BIDANGS: Bidang[] = [
  {
    id: "pendidikan",
    name: "Pendidikan",
    short: "PAUD & Kesetaraan",
    desc: "Data sasaran dan kegiatan",
    icon: BookOpen,
    count: 8,
    progress: 88,
    color: "#1A5D1A",
    light: "#E8F5E9",
    border: "#A8D5A8",
    kegiatan: ["Posyandu PAUD", "Bimtek Orang Tua", "Cek Tumbuh Kembang"],
    subKegiatan: ["Penyuluhan PAUD", "Pendataan ATS (Anak Tidak Sekolah)", "Kelas Literasi Keluarga", "Posyandu PAUD", "Bimtek Orang Tua", "Cek Tumbuh Kembang"],
  },
  {
    id: "kesehatan",
    name: "Kesehatan",
    short: "Layanan Dasar",
    desc: "Pelayanan dan pemantauan",
    icon: HeartPulse,
    count: 14,
    progress: 92,
    color: "#0E7490",
    light: "#ECFEFF",
    border: "#99E6E6",
    kegiatan: ["Posyandu Balita", "PMT", "Skrining Ibu Hamil", "Imunisasi"],
    subKegiatan: ["Penimbangan Balita", "Pemeriksaan Ibu Hamil", "Cek Stunting & Gizi", "PMT (Pemberian Makanan Tambahan)", "Imunisasi Dasar", "Skrining PTM & Remaja", "Kunjungan Rumah Lansia"],
  },
  {
    id: "pu",
    name: "Pekerjaan Umum",
    short: "Infrastruktur",
    desc: "Infrastruktur dan air bersih",
    icon: Construction,
    count: 5,
    progress: 64,
    color: "#92400E",
    light: "#FEF3C7",
    border: "#F5D78E",
    kegiatan: ["Cek Saluran Air", "Perbaikan Jalan Lingkungan", "Sumur Warga"],
    subKegiatan: ["Cek Air Bersih & Kualitas", "Jalan Lingkungan & Gang", "Drainase & Saluran", "Perbaikan Sumur Warga", "Pemeliharaan Fasilitas Umum"],
  },
  {
    id: "perumahan",
    name: "Perumahan Rakyat",
    short: "Layak Huni",
    desc: "Rumah dan sanitasi",
    icon: Home,
    count: 6,
    progress: 71,
    color: "#7C3AED",
    light: "#F3E8FF",
    border: "#D8B4FE",
    kegiatan: ["Verifikasi RTLH", "Jamban Sehat", "Drainase Rumah"],
    subKegiatan: ["Verifikasi RTLH", "Jamban Sehat Keluarga", "SPAL (Pembuangan Air Limbah)", "Verifikasi Rumah Tidak Layak Huni", "Sanitasi Lingkungan"],
  },
  {
    id: "trantib",
    name: "Trantibumlinmas",
    short: "Ketertiban",
    desc: "Ketertiban dan kebencanaan",
    icon: ShieldCheck,
    count: 4,
    progress: 78,
    color: "#B91C1C",
    light: "#FEF2F2",
    border: "#FCA5A5",
    kegiatan: ["Siskamling", "Simulasi Bencana", "Pendataan Titik Rawan"],
    subKegiatan: ["Ronda & Siskamling", "Simulasi Bencana & Evakuasi", "Pendataan Titik Rawan Banjir/Longsor", "Pendataan Linmas Aktif", "Edukasi Mitigasi"],
  },
  {
    id: "sosial",
    name: "Sosial",
    short: "Perlindungan",
    desc: "Warga rentan dan fasilitasi bantuan",
    icon: HeartHandshake,
    count: 9,
    progress: 85,
    color: "#BE185D",
    light: "#FFF1F2",
    border: "#FDA4AF",
    kegiatan: ["Pendataan Lansia", "Disabilitas", "Penyaluran Bansos"],
    subKegiatan: ["Pendataan DTKS", "Penyaluran Bansos (PKH/BPNT)", "Pendataan Lansia Sebatang Kara", "Disabilitas & ODGJ", "Verifikasi Penerima Bantuan", "Kunjungan Kesejahteraan"],
  },
];

const REKAP_AWAL = [
  { id: 1, tanggal: "2024-05-28", rw: "RW03", bidang: "Kesehatan", subBidang: "Penimbangan Balita", kegiatan: "Posyandu Balita & Ibu Hamil", sasaran: 42, status: "Lengkap", koordinator: "Siti Aminah", hasil: "32 balita ditimbang, 2 dirujuk", kendala: "-", tindak: "Kunjungan ulang 2 balita gizi kurang" },
  { id: 2, tanggal: "2024-05-27", rw: "RW07", bidang: "Pendidikan", subBidang: "Penyuluhan PAUD", kegiatan: "PAUD Ceria - Stimulasi Motorik", sasaran: 18, status: "Lengkap", koordinator: "Dewi Lestari", hasil: "18 anak ikut", kendala: "", tindak: "" },
  { id: 3, tanggal: "2024-05-26", rw: "RW02", bidang: "Sosial", subBidang: "Pendataan DTKS", kegiatan: "Verifikasi Penerima PKH", sasaran: 12, status: "Belum Lengkap", koordinator: "Ujang Supardi", hasil: "12 KK diverifikasi", kendala: "Data ganda", tindak: "Cek ulang Dukcapil" },
  { id: 4, tanggal: "2024-05-25", rw: "RW11", bidang: "Perumahan Rakyat", subBidang: "Jamban Sehat Keluarga", kegiatan: "Cek Jamban Sehat", sasaran: 8, status: "Lengkap", koordinator: "Asep Maulana", hasil: "8 rumah dicek", kendala: "", tindak: "" },
  { id: 5, tanggal: "2024-05-24", rw: "RW05", bidang: "Pekerjaan Umum", subBidang: "Drainase & Saluran", kegiatan: "Pembersihan Saluran Air", sasaran: 22, status: "Pending Tindak Lanjut", koordinator: "Jajang Nurjaman", hasil: "150m saluran dibersihkan", kendala: "Alat kurang", tindak: "Pengadaan cangkul" },
  { id: 6, tanggal: "2024-05-23", rw: "RW09", bidang: "Trantibumlinmas", subBidang: "Ronda & Siskamling", kegiatan: "Ronda Malam & Siskamling", sasaran: 15, status: "Lengkap", koordinator: "Dadang S.", hasil: "Ronda 3 shift", kendala: "", tindak: "" },
];

const SASARAN_DUMMY: Record<string, any[]> = {
  pendidikan: [
    { nama: "Anak PAUD 3-4 th", rw: "RW01", jumlah: 12, status: "Aktif" },
    { nama: "Anak PAUD 4-5 th", rw: "RW03", jumlah: 18, status: "Aktif" },
    { nama: "Orang Tua Asuh", rw: "RW05", jumlah: 24, status: "Pembinaan" },
  ],
  kesehatan: [
    { nama: "Balita 0-59 bln", rw: "RW02", jumlah: 34, status: "Terpantau" },
    { nama: "Ibu Hamil", rw: "RW03", jumlah: 7, status: "Risti 1" },
    { nama: "Lansia >60th", rw: "RW07", jumlah: 19, status: "Rutin Kontrol" },
    { nama: "Remaja Putri", rw: "RW04", jumlah: 28, status: "Anemia Screening" },
  ],
  pu: [
    { nama: "Akses Air Bersih", rw: "RW11", jumlah: 42, status: "Layak" },
    { nama: "Jalan Lingkungan Rusak", rw: "RW08", jumlah: 3, status: "Perlu Perbaikan" },
  ],
  perumahan: [
    { nama: "RTLH Terdata", rw: "RW09", jumlah: 5, status: "Verifikasi" },
    { nama: "Jamban Tidak Layak", rw: "RW10", jumlah: 8, status: "Prioritas" },
  ],
  trantib: [
    { nama: "Pos Siskamling Aktif", rw: "RW01", jumlah: 2, status: "Aktif" },
    { nama: "Titik Rawan Banjir", rw: "RW06", jumlah: 1, status: "Siaga" },
  ],
  sosial: [
    { nama: "Penerima PKH", rw: "RW02", jumlah: 18, status: "Tersalurkan" },
    { nama: "Lansia Sebatang Kara", rw: "RW07", jumlah: 4, status: "Perlu Kunjungan" },
    { nama: "Penyandang Disabilitas", rw: "RW05", jumlah: 6, status: "Terdata" },
  ],
};

const INITIAL_USERS = [
  { id: 1, username: "kader01", nama: "Siti Aminah", role: "Kader" as Role, rw: "RW03", bidang: "Kesehatan", aktif: true },
  { id: 2, username: "kader02", nama: "Dewi Lestari", role: "Kader" as Role, rw: "RW07", bidang: "Pendidikan", aktif: true },
  { id: 3, username: "koord", nama: "Ujang Supardi", role: "Koordinator Bidang" as Role, rw: "Semua RW", bidang: "Semua", aktif: true },
  { id: 4, username: "kader03", nama: "Asep Maulana", role: "Kader" as Role, rw: "RW11", bidang: "Perumahan Rakyat", aktif: true },
];

// Login creds in memory (no real auth)
const CREDENTIALS: Record<string, { pass: string; role: Role; nama: string }> = {
  admin: { pass: "desa123", role: "Admin Desa", nama: "Admin Desa Nanjung" },
  koord: { pass: "koord123", role: "Koordinator Bidang", nama: "Koordinator SPM" },
  kader01: { pass: "kader123", role: "Kader", nama: "Kader RW03" },
};

export default function App() {
  // Session in memory only - no localStorage per boundary
  const [session, setSession] = useState<{ username: string; role: Role; nama: string; loginAt: string } | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "", showPass: false, error: "" });
  const role = (session?.role || "Kader") as Role;

  const [view, setView] = useState<View>("dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activities, setActivities] = useState(REKAP_AWAL);
  const [sasaranTab, setSasaranTab] = useState("kesehatan");
  const [sasaranSearch, setSasaranSearch] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // Users & desa config - in memory only
  const [users, setUsers] = useState(INITIAL_USERS);
  const [desaConfig, setDesaConfig] = useState({
    namaDesa: "Desa Nanjung",
    kecamatan: "Margaasih",
    kabupaten: "Kab. Bandung",
    provinsi: "Jawa Barat",
    tahunAnggaran: "2024",
    kepalaDesa: "H. Dadan Supardan",
    kodeDesa: "32.04.08.2005",
    logo: null as string | null,
  });

  // Input form
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    rw: "RW01",
    posyandu: "Posyandu Dahlia 1",
    bidangId: "kesehatan",
    subJenis: "",
    jenis: "",
    sasaran: "",
    hasil: "",
    kendala: "",
    tindak: "",
    foto: null as string | null,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Laporan filters
  const [lapFilter, setLapFilter] = useState({
    bulan: "Semua",
    tahun: "2024",
    bidang: "Semua Bidang",
    rw: "Semua RW",
  });

  // User form
  const [userForm, setUserForm] = useState({ username: "", nama: "", rw: "RW01", bidang: "Kesehatan", role: "Kader" as Role });

  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const filteredRekap = useMemo(() => {
    return activities.filter((a) => {
      if (lapFilter.bidang !== "Semua Bidang" && a.bidang !== lapFilter.bidang) return false;
      if (lapFilter.rw !== "Semua RW" && a.rw !== lapFilter.rw) return false;
      if (lapFilter.bulan !== "Semua") {
        const monthNum = new Date(a.tanggal).getMonth() + 1;
        const map: any = { Januari: 1, Februari: 2, Maret: 3, April: 4, Mei: 5, Juni: 6, Juli: 7, Agustus: 8, September: 9, Oktober: 10, November: 11, Desember: 12 };
        if (map[lapFilter.bulan] && map[lapFilter.bulan] !== monthNum) return false;
      }
      return true;
    });
  }, [activities, lapFilter]);

  const filteredSasaran = useMemo(() => {
    const list = SASARAN_DUMMY[sasaranTab] || [];
    if (!sasaranSearch) return list;
    return list.filter((x: any) => x.nama.toLowerCase().includes(sasaranSearch.toLowerCase()) || x.rw.toLowerCase().includes(sasaranSearch.toLowerCase()));
  }, [sasaranTab, sasaranSearch]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handleLogin = () => {
    const cred = CREDENTIALS[loginForm.username.toLowerCase()];
    if (!cred || cred.pass !== loginForm.password) {
      setLoginForm({ ...loginForm, error: "Username atau password salah. Coba: admin/desa123, koord/koord123, kader01/kader123" });
      return;
    }
    setSession({ username: loginForm.username.toLowerCase(), role: cred.role, nama: cred.nama, loginAt: new Date().toISOString() });
    setLoginForm({ username: "", password: "", showPass: false, error: "" });
    showToast(`Selamat datang, ${cred.nama} (${cred.role})`);
    setView("dashboard");
  };

  const handleLogout = () => {
    setSession(null);
    setView("dashboard");
    showToast("Sesi berakhir - mode pratinjau lokal");
  };

  const currentBidangForForm = BIDANGS.find((b) => b.id === form.bidangId);

  const handleSave = () => {
    const errs: any = {};
    if (!form.subJenis) errs.subJenis = "Pilih sub-jenis kegiatan";
    if (!form.jenis) errs.jenis = "Wajib isi nama kegiatan";
    if (!form.sasaran) errs.sasaran = "Wajib isi jumlah sasaran";
    if (!form.hasil) errs.hasil = "Wajib isi hasil";
    setFormErrors(errs);
    if (Object.keys(errs).length) return;
    const bidangName = currentBidangForForm?.name || form.bidangId;
    const newItem = {
      id: Date.now(),
      tanggal: form.tanggal,
      rw: form.rw,
      bidang: bidangName,
      subBidang: form.subJenis,
      kegiatan: form.jenis,
      sasaran: Number(form.sasaran) || 0,
      status: "Lengkap",
      koordinator: session?.nama || "Kader",
      hasil: form.hasil,
      kendala: form.kendala,
      tindak: form.tindak,
    };
    setActivities([newItem, ...activities]);
    showToast("Kegiatan disimpan di pratinjau lokal - siap ekspor JSON/CSV");
    setForm({ ...form, subJenis: "", jenis: "", sasaran: "", hasil: "", kendala: "", tindak: "", foto: null });
  };

  const handleExportCSV = () => {
    const header = ["No", "Tanggal", "RW", "Bidang", "Sub-Jenis", "Kegiatan", "Sasaran", "Status", "Koordinator", "Hasil"];
    const rows = filteredRekap.map((r, i) => [i + 1, r.tanggal, r.rw, r.bidang, (r as any).subBidang || "", `"${r.kegiatan.replace(/"/g, '""')}"`, r.sasaran, r.status, r.koordinator, `"${((r as any).hasil || "").replace(/"/g, '""')}"`].join(","));
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap-6spm-${desaConfig.namaDesa.replace(/\s/g, "-")}-${lapFilter.bulan}-${lapFilter.tahun}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("CSV berhasil diunduh - pratinjau lokal");
  };

  const handleExportJSON = () => {
    const data = { desa: desaConfig, kegiatan: activities, users, exportedAt: new Date().toISOString(), mode: "preview-local" };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup-posyandu-${desaConfig.namaDesa.replace(/\s/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("JSON diekspor - simpan sebagai backup");
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.kegiatan && Array.isArray(parsed.kegiatan)) {
          setActivities(parsed.kegiatan);
          if (parsed.users) setUsers(parsed.users);
          if (parsed.desa) setDesaConfig((prev) => ({ ...prev, ...parsed.desa }));
          showToast(`Impor berhasil: ${parsed.kegiatan.length} kegiatan dimuat (pratinjau)`);
        } else {
          showToast("Format JSON tidak sesuai - butuh field kegiatan[]");
        }
      } catch {
        showToast("Gagal parsing JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const monitoringItems = activities.filter((a) => a.status !== "Lengkap");

  const canAccess = (v: View): boolean => {
    if (!session) return false;
    const r = session.role;
    if (r === "Admin Desa") return true;
    if (r === "Koordinator Bidang") {
      return !["users", "settings"].includes(v);
    }
    // Kader
    const kaderAllowed: View[] = ["dashboard", "input", "sasaran", "panduan", "info", "laporan"];
    if (kaderAllowed.includes(v)) return true;
    if (v.startsWith("bidang-")) return true;
    return false;
  };

  const RW_DATA = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach((a) => { map[a.rw] = (map[a.rw] || 0) + 1; });
    return Array.from({ length: 13 }, (_, i) => {
      const rw = `RW${String(i + 1).padStart(2, "0")}`;
      return { rw, kegiatan: map[rw] || Math.floor(Math.random() * 3), sasaran: 60 + Math.floor(Math.random() * 30) };
    });
  }, [activities]);

  if (!session) {
    return (
      <div className="min-h-screen w-full bg-[var(--bg)] flex items-center justify-center p-4" style={{ paddingTop: "var(--safe-area-inset-top)" }}>
        <div className="w-full max-w-[960px] grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] rounded-[28px] border overflow-hidden bg-[var(--surface)] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.25)]" style={{ borderColor: "var(--border)" }}>
          <div className="bg-[var(--primary)] text-white p-8 md:p-10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-[0.08]">
              <div className="absolute -right-20 -top-20 w-[380px] h-[380px] rounded-full bg-white" />
              <div className="absolute -left-20 -bottom-20 w-[240px] h-[240px] rounded-full bg-[var(--accent)]" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white text-[var(--primary)] grid place-items-center font-bold text-[16px] shadow">DN</div>
                <div>
                  <div className="font-bold text-[16px] leading-tight">Desa Nanjung</div>
                  <div className="text-[12px] opacity-80 flex items-center gap-1"><MapPin className="w-3 h-3" /> Margaasih · Kab. Bandung</div>
                </div>
              </div>
              <h1 className="display text-[28px] md:text-[34px] leading-[0.95] font-bold">Dashboard<br />Posyandu 6 SPM</h1>
              <p className="text-[13px] opacity-80 mt-3 leading-snug max-w-[320px]">Versi Lengkap Siap Implementasi — Pratinjau lokal tanpa backend. Semua data disimpan di memori sesi, siap ekspor JSON/CSV.</p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/10 p-3">
                  <div className="text-[11px] opacity-70">Mode</div>
                  <div className="text-[13px] font-bold">Pratinjau Lokal</div>
                  <div className="text-[11px] opacity-70 mt-1">Tidak pakai localStorage — data hilang saat reload, gunakan Ekspor JSON</div>
                </div>
                <div className="rounded-xl bg-[var(--accent)] text-black p-3">
                  <div className="text-[11px] font-bold">6 Bidang SPM</div>
                  <div className="text-[12px] leading-tight mt-1">Pendidikan, Kesehatan, PU, Perumahan, Trantib, Sosial</div>
                </div>
              </div>
            </div>
            <div className="relative mt-8 text-[11px] opacity-60">© {desaConfig.tahunAnggaran} Pemerintah Desa Nanjung · Prototipe PWA React</div>
          </div>
          <div className="p-6 md:p-8 bg-[var(--surface)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-bold">Masuk ke Dashboard</h2>
              <span className={`text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-1 ${isOnline ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />} {isOnline ? "Online" : "Offline"} · Pratinjau
              </span>
            </div>
            <div className="space-y-3">
              <Field label="Username">
                <input value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} placeholder="admin / koord / kader01" className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" style={{ borderColor: "var(--border)" }} />
              </Field>
              <Field label="Password">
                <div className="relative">
                  <input type={loginForm.showPass ? "text" : "password"} value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="desa123 / koord123 / kader123" className="w-full rounded-xl border px-3 py-2.5 pr-10 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} />
                  <button onClick={() => setLoginForm({ ...loginForm, showPass: !loginForm.showPass })} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[var(--surface-2)]">
                    {loginForm.showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              {loginForm.error && <div className="text-[12px] text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{loginForm.error}</div>}
              <button onClick={handleLogin} className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold text-[14px] hover:bg-[var(--primary-2)] transition flex items-center justify-center gap-2">
                Masuk <ArrowRight className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <CredCard user="admin" pass="desa123" role="Admin Desa" active={loginForm.username === "admin"} onClick={() => setLoginForm({ ...loginForm, username: "admin", password: "desa123" })} />
                <CredCard user="koord" pass="koord123" role="Koordinator" active={loginForm.username === "koord"} onClick={() => setLoginForm({ ...loginForm, username: "koord", password: "koord123" })} />
                <CredCard user="kader01" pass="kader123" role="Kader" active={loginForm.username === "kader01"} onClick={() => setLoginForm({ ...loginForm, username: "kader01", password: "kader123" })} />
              </div>
              <div className="text-[11px] text-[var(--text-muted)] bg-[var(--surface-2)] border rounded-xl p-3 mt-3" style={{ borderColor: "var(--border)" }}>
                <strong>Catatan boundary:</strong> Sesi disimpan hanya di memori (React state). Tidak ada localStorage / backend. Data kegiatan & user bersifat pratinjau lokal dan hilang saat reload — gunakan Ekspor JSON untuk backup.
              </div>
            </div>
          </div>
        </div>
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-clip pb-[88px] md:pb-0" style={{ background: "var(--bg)", paddingTop: "var(--safe-area-inset-top)" }}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left:0; top:0; width:100%; }
        }
        @keyframes slideUp{ from{ transform:translate(-50%,20px); opacity:0 } to{ transform:translate(-50%,0); opacity:1 } }
      `}</style>

      {/* Top banner */}
      <div className="w-full bg-[var(--primary)] text-white">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 py-2.5 flex flex-wrap items-center gap-2 md:gap-3 text-[11px] md:text-[12px] leading-tight">
          <span className="inline-flex items-center gap-1.5 bg-[var(--accent)] text-black px-2.5 py-1 rounded-full font-bold shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> VERSI LENGKAP
          </span>
          <span className="opacity-90">Pratinjau lokal — Siap Ekspor JSON/CSV · {activities.length} kegiatan di memori · {desaConfig.namaDesa} · TA {desaConfig.tahunAnggaran}</span>
          <span className={`ml-auto hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${isOnline ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />} {isOnline ? "Online" : "Offline"} · Pratinjau
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-[var(--safe-area-inset-top)] z-30 border-b bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 h-[72px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--surface-2)]">
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white grid place-items-center font-bold text-[14px] shadow-sm shrink-0 overflow-hidden">
              {desaConfig.logo ? <img src={desaConfig.logo} alt="logo" className="w-full h-full object-cover" /> : "DN"}
            </div>
            <div className="leading-tight min-w-0">
              <div className="display font-bold text-[14px] md:text-[17px] truncate">Dashboard Posyandu 6 SPM</div>
              <div className="text-[11px] md:text-[12px] text-[var(--text-muted)] flex items-center gap-1.5 truncate">
                <MapPin className="w-3 h-3 shrink-0" /> {desaConfig.namaDesa} · Kec. {desaConfig.kecamatan} · {desaConfig.kabupaten}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-2 text-[12px] bg-[var(--surface-2)] border rounded-full px-3 py-1.5" style={{ borderColor: "var(--border)" }}>
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Pratinjau lokal · {activities.length} kegiatan · Siap ekspor
            </div>
            <div className="hidden md:flex items-center gap-2 text-[12px] border rounded-full pl-2 pr-3 py-1 bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>
              <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white grid place-items-center text-[11px] font-bold">{session.username.slice(0,2).toUpperCase()}</div>
              <div className="leading-tight">
                <div className="font-bold text-[12px]">{session.nama}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{session.role}</div>
              </div>
            </div>
            <button onClick={handleExportJSON} className="hidden md:inline-flex items-center gap-1.5 text-[12px] border px-3 py-2 rounded-full bg-[var(--surface)] font-semibold hover:bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>
              <FileJson className="w-4 h-4" /> Ekspor JSON
            </button>
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-[12px] bg-[#1A2E1A] text-white px-3 md:px-4 py-2 rounded-full font-bold">
              <LogOut className="w-4 h-4" /> <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-0 md:px-6 py-0 md:py-6 grid grid-cols-1 md:grid-cols-[270px_1fr] gap-0 md:gap-6">
        {/* Sidebar */}
        <aside className={`${mobileMenu ? "block" : "hidden"} md:block md:sticky md:top-[88px] md:h-[calc(100vh-100px)] overflow-y-auto bg-[var(--surface)] md:bg-transparent border-b md:border-0 z-20`} style={{ borderColor: "var(--border)" }}>
          <div className="p-4 md:p-0 space-y-6">
            <nav className="space-y-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={view === "dashboard"} onClick={() => { setView("dashboard"); setMobileMenu(false); }} />
              <SidebarItem icon={ClipboardList} label="Input Kegiatan" active={view === "input"} onClick={() => { if (!canAccess("input")) return showToast("Akses terbatas untuk role Anda"); setView("input"); setMobileMenu(false); }} badge="Wajib" />
              <SidebarItem icon={Users} label="Data Sasaran" active={view === "sasaran"} onClick={() => { setView("sasaran"); setMobileMenu(false); }} />
              <div className="pt-4 pb-1 px-3 text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase">6 Bidang SPM</div>
              {BIDANGS.map((b) => (
                <SidebarItem key={b.id} icon={b.icon} label={b.name} sub={b.short} active={view === `bidang-${b.id}`} onClick={() => { setView(`bidang-${b.id}` as View); setMobileMenu(false); }} />
              ))}
              <div className="pt-4 pb-1 px-3 text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Operasional</div>
              <SidebarItem icon={ListTodo} label="Monitoring" active={view === "monitoring"} count={monitoringItems.length} onClick={() => { if (!canAccess("monitoring")) return showToast("Hanya Admin & Koordinator"); setView("monitoring"); setMobileMenu(false); }} />
              <SidebarItem icon={FileBarChart} label="Laporan V2" active={view === "laporan"} onClick={() => { setView("laporan"); setMobileMenu(false); }} />
              <div className="pt-4 pb-1 px-3 text-[11px] font-bold tracking-widest text-[var(--text-muted)] uppercase">Manajemen</div>
              <SidebarItem icon={UserCog} label="Manajemen User" active={view === "users"} onClick={() => { if (!canAccess("users")) return showToast("Hanya Admin Desa"); setView("users"); setMobileMenu(false); }} />
              <SidebarItem icon={Settings2} label="Pengaturan Desa" active={view === "settings"} onClick={() => { if (!canAccess("settings")) return showToast("Hanya Admin Desa"); setView("settings"); setMobileMenu(false); }} />
              <SidebarItem icon={HelpCircle} label="Panduan & SOP" active={view === "panduan"} onClick={() => { setView("panduan"); setMobileMenu(false); }} />
              <SidebarItem icon={Code2} label="Info Teknis" active={view === "info"} onClick={() => { setView("info"); setMobileMenu(false); }} />
            </nav>

            <div className="rounded-2xl border p-4 bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-2 text-[12px] font-bold mb-2"><Shield className="w-4 h-4 text-[var(--primary)]" /> Hak Akses — {role}</div>
              <div className="space-y-2.5 text-[12px] leading-snug">
                <RoleRow role="Admin Desa" desc="Rekap 6 SPM, kelola user, pengaturan desa" active={role === "Admin Desa"} />
                <RoleRow role="Koordinator" desc="Verifikasi bidang, monitoring" active={role === "Koordinator Bidang"} />
                <RoleRow role="Kader" desc="Input harian per RW" active={role === "Kader"} />
              </div>
              <div className="mt-3 flex gap-2">
                <label className="flex-1 text-[11px] border rounded-full px-3 py-1.5 bg-[var(--surface-2)] flex items-center justify-center gap-1 cursor-pointer hover:bg-white" style={{ borderColor: "var(--border)" }}>
                  <Upload className="w-3 h-3" /> Impor JSON
                  <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
                </label>
                <button onClick={handleExportJSON} className="flex-1 text-[11px] border rounded-full px-3 py-1.5 bg-[var(--surface)] hover:bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>Ekspor</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 px-4 md:px-0 py-4 md:py-0">
          {view === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <StatCard title="Kegiatan (pratinjau)" value={String(activities.length)} sub={`${filteredRekap.length} terfilter · ${RW_DATA.reduce((s, r) => s + r.kegiatan, 0)} total RW`} icon={ClipboardList} trend="up" accent="bg-emerald-50 text-emerald-700" />
                <StatCard title="Sasaran Terlayani" value={`${activities.reduce((s, a) => s + a.sasaran, 0)}`} sub="Akumulasi sasaran pratinjau" icon={Users} trend="up" accent="bg-blue-50 text-blue-700" />
                <StatCard title="Belum Lengkap" value={String(monitoringItems.length)} sub="Perlu tindak lanjut" icon={AlertTriangle} trend="warn" accent="bg-amber-50 text-amber-700" />
                <StatCard title="Mode Data" value="Lokal" sub="Siap ekspor JSON/CSV, tanpa DB" icon={FileJson} trend="down" accent="bg-zinc-50 text-zinc-700" />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-[18px] md:text-[22px] font-bold">6 Standar Pelayanan Minimal</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-1 rounded-full border bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}>Periode: {lapFilter.bulan} {desaConfig.tahunAnggaran} · {desaConfig.namaDesa}</span>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800">Pratinjau Lokal</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {BIDANGS.map((b) => (
                    <BidangCard key={b.id} bidang={b} onClick={() => setView(`bidang-${b.id}` as View)} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="rounded-[20px] border bg-[var(--surface)] p-4 md:p-5 overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <h3 className="font-bold text-[15px]">Kegiatan per RW (Pratinjau Memori)</h3>
                    <span className="text-[10px] md:text-[11px] text-[var(--text-muted)] shrink-0">RW01 – RW13</span>
                  </div>
                  <div className="h-[220px] w-full max-w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={RW_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="rw" fontSize={10} tick={{ fill: "var(--text-muted)" }} axisLine={false} tickLine={false} interval={0} />
                        <YAxis fontSize={10} tick={{ fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={28} />
                        <Tooltip contentStyle={{ borderRadius: 12, borderColor: "var(--border)", fontSize: 12 }} cursor={{ fill: "var(--surface-2)" }} />
                        <Bar dataKey="kegiatan" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-[20px] border bg-[var(--surface)] p-4 md:p-5 overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="font-bold text-[15px]">Rekapitulasi Terbaru</h3>
                    <button onClick={() => setView("laporan")} className="text-[12px] font-semibold text-[var(--primary)] hover:underline shrink-0">Lihat Laporan V2 →</button>
                  </div>
                  <div className="overflow-x-auto max-w-full">
                    <div className="min-w-[320px]">
                      <table className="w-full text-[12px]">
                        <thead className="text-[11px] text-[var(--text-muted)] text-left border-b" style={{ borderColor: "var(--border)" }}>
                          <tr>
                            <th className="py-2 font-medium">Tanggal</th>
                            <th className="py-2 font-medium">RW / Bidang</th>
                            <th className="py-2 font-medium">Kegiatan</th>
                            <th className="py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activities.slice(0, 5).map((r) => (
                            <tr key={r.id} className="border-b last:border-0" style={{ borderColor: "var(--border)" }}>
                              <td className="py-2.5 whitespace-nowrap">{r.tanggal.slice(5)}</td>
                              <td className="py-2.5">
                                <div className="font-semibold">{r.rw}</div>
                                <div className="text-[11px] text-[var(--text-muted)]">{r.bidang} · {(r as any).subBidang || ""}</div>
                              </td>
                              <td className="py-2.5 max-w-[110px] truncate">{r.kegiatan}</td>
                              <td className="py-2.5"><StatusBadge status={r.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={handleExportCSV} className="text-[11px] border px-3 py-1.5 rounded-full bg-[var(--surface-2)] flex items-center gap-1" style={{ borderColor: "var(--border)" }}><Download className="w-3 h-3" /> CSV</button>
                    <span className="text-[11px] text-[var(--text-muted)] ml-auto">Pratinjau lokal · {activities.length} data</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border bg-[var(--primary)] text-white p-5 md:p-7 relative overflow-hidden" style={{ borderColor: "var(--primary-2)" }}>
                <div className="absolute inset-0 opacity-10"><div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full bg-white" /><div className="absolute -left-20 -bottom-20 w-[200px] h-[200px] rounded-full bg-[var(--accent)]" /></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-5"><h3 className="display text-[18px] md:text-[20px] font-bold">Alur Penggunaan 6 SPM — Pratinjau</h3><span className="hidden md:inline-flex text-[11px] bg-white/15 px-3 py-1 rounded-full">SOP Resmi Desa Nanjung</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {[
                      { n: "01", t: "Kader isi kegiatan", d: "Pilih bidang → sub-jenis spesifik 6 SPM, isi hasil & foto via HP (memori)" },
                      { n: "02", t: "Koordinator periksa", d: "Verifikasi kelengkapan di Monitoring, tandai selesai" },
                      { n: "03", t: "Admin rekap", d: "Laporan V2 otomatis dari memori, filter berfungsi" },
                      { n: "04", t: "Ekspor & backup", d: "CSV/JSON/PDF pratinjau lokal, siap migrasi ke Supabase" },
                    ].map((s, idx) => (
                      <div key={s.n} className="relative flex md:block gap-3">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--accent)] text-black grid place-items-center font-bold text-[13px]">{s.n}</div>
                        {idx < 3 && <div className="hidden md:block absolute top-5 left-[48px] right-0 h-[2px] bg-white/20" />}
                        <div className="pb-2"><div className="font-bold text-[13px] mt-0 md:mt-3">{s.t}</div><div className="text-[11px] opacity-80 leading-snug mt-1">{s.d}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "input" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[20px] md:text-[24px] font-bold">Input Kegiatan 6 SPM — Detail</h2>
                <span className="text-[11px] bg-amber-100 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full">Mode: Pratinjau Lokal · Role {role}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
                <div className="rounded-[20px] border bg-[var(--surface)] p-5 md:p-6" style={{ borderColor: "var(--border)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Tanggal Kegiatan">
                      <input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" style={{ borderColor: "var(--border)" }} />
                    </Field>
                                        <Field label="RW / Dusun (13 RW)">
                      <select value={form.rw} onChange={(e) => setForm({ ...form, rw: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>
                        {RW_LIST.map(rw => <option key={rw} value={rw}>{rw}</option>)}
                      </select>
                    </Field>
                    <Field label="Posyandu (14 Posyandu)">
                      <select value={(form as any).posyandu || POSYANDU_LIST[0].nama} onChange={(e) => setForm({ ...form, posyandu: e.target.value } as any)} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>
                        {POSYANDU_LIST.map(p => <option key={p.id} value={p.nama}>{p.nama} - {p.rw}</option>)}
                      </select>
                    </Field>
                    <Field label="Bidang SPM (6)">
                      <select value={form.bidangId} onChange={(e) => setForm({ ...form, bidangId: e.target.value, subJenis: "" })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]">
                        {BIDANGS.map((b) => (<option key={b.id} value={b.id}>{b.name} — {b.short}</option>))}
                      </select>
                    </Field>
                    <Field label="Sub-Jenis Kegiatan Spesifik" error={formErrors.subJenis}>
                      <select value={form.subJenis} onChange={(e) => setForm({ ...form, subJenis: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: formErrors.subJenis ? "#D92D20" : "var(--border)" }}>
                        <option value="">— Pilih sub-jenis —</option>
                        {currentBidangForForm?.subKegiatan.map((sk) => (<option key={sk} value={sk}>{sk}</option>))}
                      </select>
                      {currentBidangForForm && <div className="text-[11px] text-[var(--text-muted)] mt-1">Contoh untuk {currentBidangForForm.name}: {currentBidangForForm.subKegiatan.slice(0,3).join(", ")}</div>}
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Nama Kegiatan Detail" error={formErrors.jenis}>
                        <input value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value })} placeholder="Contoh: Penimbangan Balita RW03 - 32 balita, 2 stunting terdeteksi" className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: formErrors.jenis ? "#D92D20" : "var(--border)" }} />
                      </Field>
                    </div>
                    <Field label="Jumlah Sasaran" error={formErrors.sasaran}>
                      <input type="number" value={form.sasaran} onChange={(e) => setForm({ ...form, sasaran: e.target.value })} placeholder="42" className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: formErrors.sasaran ? "#D92D20" : "var(--border)" }} />
                    </Field>
                    <Field label="Foto Kegiatan (pratinjau memori)">
                      <label className="w-full rounded-xl border border-dashed px-3 py-2.5 text-[13px] bg-[var(--surface-2)] flex items-center justify-between cursor-pointer hover:bg-white transition">
                        <span className="flex items-center gap-2"><Camera className="w-4 h-4" /> {form.foto ? "Foto terpilih (memori)" : "Upload foto"}</span>
                        <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setForm({ ...form, foto: r.result as string }); r.readAsDataURL(f); } }} />
                        <span className="text-[11px] text-[var(--text-muted)]">JPG/PNG</span>
                      </label>
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Hasil Kegiatan" error={formErrors.hasil}>
                        <textarea value={form.hasil} onChange={(e) => setForm({ ...form, hasil: e.target.value })} rows={3} placeholder="32 balita ditimbang, 2 dirujuk ke Puskesmas..." className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: formErrors.hasil ? "#D92D20" : "var(--border)" }} />
                      </Field>
                    </div>
                    <Field label="Kendala Lapangan">
                      <textarea value={form.kendala} onChange={(e) => setForm({ ...form, kendala: e.target.value })} rows={2} placeholder="Opsional" className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} />
                    </Field>
                    <Field label="Tindak Lanjut">
                      <textarea value={form.tindak} onChange={(e) => setForm({ ...form, tindak: e.target.value })} rows={2} placeholder="Rencana kunjungan ulang..." className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} />
                    </Field>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button onClick={handleSave} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-[var(--primary-2)] transition"><Plus className="w-4 h-4" /> Simpan ke Pratinjau</button>
                    <button onClick={() => setForm({ tanggal: new Date().toISOString().slice(0, 10), rw: "RW01", posyandu: "Posyandu Dahlia 1", bidangId: "kesehatan", subJenis: "", jenis: "", sasaran: "", hasil: "", kendala: "", tindak: "", foto: null })} className="text-[13px] px-4 py-2.5 rounded-full border bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>Reset</button>
                    <span className="text-[11px] text-[var(--text-muted)]">Data disimpan di memori sesi · Gunakan Ekspor JSON untuk backup · Tidak pakai localStorage</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[12px] font-bold mb-2 flex items-center justify-between">Preview Foto <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200">Memori</span></div>
                    {form.foto ? <img src={form.foto} alt="preview" className="w-full h-48 object-cover rounded-xl" /> : <div className="w-full h-48 rounded-xl bg-[var(--surface-2)] grid place-items-center text-[12px] text-[var(--text-muted)] border border-dashed" style={{ borderColor: "var(--border)" }}>Belum ada foto</div>}
                  </div>
                  <div className="rounded-[20px] bg-[var(--primary-light)] border p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[12px] font-bold mb-1 flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[var(--primary)]" /> Aturan Input per Bidang</div>
                    <div className="space-y-2 text-[11px] text-[var(--text)]">
                      {BIDANGS.map((b) => (
                        <details key={b.id} className="bg-white rounded-xl border p-2" style={{ borderColor: b.border }}>
                          <summary className="font-bold cursor-pointer" style={{ color: b.color }}>{b.name}: {b.subKegiatan.length} sub-jenis</summary>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px] text-[var(--text-muted)]">{b.subKegiatan.map((sk) => <li key={sk}>{sk}</li>)}</ul>
                        </details>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === "sasaran" && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <h2 className="text-[20px] md:text-[24px] font-bold">Data Sasaran per Bidang</h2>
                <div className="flex items-center gap-2">
                  <div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" /><input value={sasaranSearch} onChange={(e) => setSasaranSearch(e.target.value)} placeholder="Cari nama, RW..." className="pl-9 pr-3 py-2 rounded-full border text-[13px] bg-[var(--surface)] w-[200px] md:w-[260px]" style={{ borderColor: "var(--border)" }} /></div>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
                {BIDANGS.map((b) => (
                  <button key={b.id} onClick={() => setSasaranTab(b.id)} className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold border transition ${sasaranTab === b.id ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)]"}`}>{b.name}</button>
                ))}
              </div>
              <div className="rounded-[20px] border bg-[var(--surface)] overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full grid place-items-center" style={{ background: BIDANGS.find((b) => b.id === sasaranTab)?.light }}>
                      {React.createElement(BIDANGS.find((b) => b.id === sasaranTab)?.icon || Users, { className: "w-4 h-4", style: { color: BIDANGS.find((b) => b.id === sasaranTab)?.color } })}
                    </div>
                    <div><div className="font-bold text-[14px]">{BIDANGS.find((b) => b.id === sasaranTab)?.name}</div><div className="text-[11px] text-[var(--text-muted)]">{BIDANGS.find((b) => b.id === sasaranTab)?.desc} · Pratinjau lokal</div></div>
                  </div>
                  <button onClick={handleExportCSV} className="hidden md:inline-flex items-center gap-1.5 text-[12px] border px-3 py-1.5 rounded-full bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}><Download className="w-3.5 h-3.5" /> Ekspor CSV</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead className="bg-[var(--surface-2)] text-[11px] text-[var(--text-muted)] uppercase tracking-wider"><tr><th className="text-left px-4 py-2.5 font-medium">Nama Sasaran</th><th className="text-left px-4 py-2.5 font-medium">RW</th><th className="text-left px-4 py-2.5 font-medium">Jumlah</th><th className="text-left px-4 py-2.5 font-medium">Status</th><th className="text-left px-4 py-2.5 font-medium">Aksi</th></tr></thead>
                    <tbody>
                      {filteredSasaran.map((row: any, i: number) => (
                        <tr key={i} className="border-t last:border-b-0 hover:bg-[var(--surface-2)]/50" style={{ borderColor: "var(--border)" }}>
                          <td className="px-4 py-3 font-medium">{row.nama}</td><td className="px-4 py-3">{row.rw}</td><td className="px-4 py-3">{row.jumlah}</td><td className="px-4 py-3"><span className="text-[11px] px-2 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] border" style={{ borderColor: "var(--border)" }}>{row.status}</span></td><td className="px-4 py-3"><button onClick={() => showToast(`Detail ${row.nama} - pratinjau`)} className="text-[12px] text-[var(--primary)] font-semibold hover:underline">Detail</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {view.startsWith("bidang-") && (
            <BidangDetail id={view.replace("bidang-", "")} activities={activities} onBack={() => setView("dashboard")} showToast={showToast} />
          )}

          {view === "monitoring" && (
            <div className="space-y-4">
              <h2 className="text-[20px] md:text-[24px] font-bold">Monitoring Tindak Lanjut — Pratinjau</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl border p-4 bg-amber-50 border-amber-200"><div className="text-[12px] font-bold text-amber-800 flex items-center gap-1"><Clock3 className="w-4 h-4" /> Pending (memori)</div><div className="text-[24px] font-bold mt-1">{monitoringItems.length}</div><div className="text-[11px] text-amber-700">Perlu tindak lanjut koordinator</div></div>
                <div className="rounded-2xl border p-4 bg-emerald-50 border-emerald-200"><div className="text-[12px] font-bold text-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Selesai Bulan Ini</div><div className="text-[24px] font-bold mt-1">{activities.filter((a) => a.status === "Lengkap").length}</div><div className="text-[11px] text-emerald-700">Dari {activities.length} total</div></div>
                <div className="rounded-2xl border p-4 bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}><div className="text-[12px] font-bold flex items-center gap-1"><FileJson className="w-4 h-4" /> Backup</div><div className="text-[11px] text-[var(--text-muted)] mt-2">Data hanya di memori sesi. Gunakan Ekspor JSON/CSV untuk simpan.</div><button onClick={handleExportJSON} className="mt-2 text-[11px] bg-[var(--primary)] text-white px-3 py-1.5 rounded-full">Ekspor JSON</button></div>
              </div>
              <div className="rounded-[20px] border bg-[var(--surface)] overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}><h3 className="font-bold text-[14px]">Daftar Tindak Lanjut</h3><span className="text-[11px] px-2 py-1 rounded-full bg-[var(--surface-2)] border" style={{ borderColor: "var(--border)" }}><Filter className="w-3 h-3 inline mr-1" /> {monitoringItems.length} item</span></div>
                <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                  {monitoringItems.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[var(--surface-2)]/50">
                      <div><div className="flex items-center gap-2"><span className="text-[12px] font-bold">{item.rw}</span><span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">{item.status}</span><span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 border">{(item as any).subBidang}</span></div><div className="font-medium text-[13px] mt-1">{item.kegiatan}</div><div className="text-[11px] text-[var(--text-muted)]">Koordinator: {item.koordinator} · {item.tanggal} · {(item as any).hasil || ""}</div></div>
                      <div className="flex items-center gap-2"><button onClick={() => { setActivities(activities.map((a) => a.id === item.id ? { ...a, status: "Lengkap" } : a)); showToast("Ditandai selesai (pratinjau)"); }} className="text-[12px] bg-[var(--primary)] text-white px-3 py-1.5 rounded-full font-semibold">Selesaikan</button><button onClick={() => showToast("Pengingat disalin ke clipboard (simulasi)")} className="text-[12px] border px-3 py-1.5 rounded-full bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}>Ingatkan</button></div>
                    </div>
                  ))}
                  {monitoringItems.length === 0 && <div className="p-8 text-center text-[13px] text-[var(--text-muted)]">Semua tindak lanjut selesai 🎉</div>}
                </div>
              </div>
            </div>
          )}

          {view === "laporan" && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div><h2 className="text-[20px] md:text-[24px] font-bold">Laporan Otomatis V2 — Pratinjau Lokal</h2><p className="text-[12px] text-[var(--text-muted)]">Rekap dihitung dari memori sesi ({activities.length} kegiatan). Gunakan filter & ekspor.</p></div>
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={handleExportCSV} className="inline-flex items-center gap-1.5 text-[12px] border bg-[var(--surface)] px-4 py-2 rounded-full font-bold" style={{ borderColor: "var(--border)" }}><Download className="w-4 h-4" /> Ekspor CSV</button>
                  <button onClick={handleExportJSON} className="inline-flex items-center gap-1.5 text-[12px] border bg-amber-50 border-amber-200 text-amber-800 px-4 py-2 rounded-full font-bold"><FileJson className="w-4 h-4" /> Ekspor JSON</button>
                </div>
              </div>

              <div className="rounded-[20px] border bg-[var(--surface)] p-4 grid grid-cols-2 md:grid-cols-4 gap-3" style={{ borderColor: "var(--border)" }}>
                <LaporanSelect label="Bulan" value={lapFilter.bulan} options={["Semua", "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli"]} onChange={(v: string) => setLapFilter({ ...lapFilter, bulan: v })} />
                <LaporanSelect label="Tahun" value={lapFilter.tahun} options={["2023", "2024", "2025"]} onChange={(v: string) => setLapFilter({ ...lapFilter, tahun: v })} />
                <LaporanSelect label="Bidang" value={lapFilter.bidang} options={["Semua Bidang", ...BIDANGS.map((b) => b.name)]} onChange={(v: string) => setLapFilter({ ...lapFilter, bidang: v })} />
                <LaporanSelect label="RW" value={lapFilter.rw} options={["Semua RW", ...Array.from({ length: 13 }, (_, i) => `RW${String(i + 1).padStart(2, "0")}`)]} onChange={(v: string) => setLapFilter({ ...lapFilter, rw: v })} />
              </div>

              <div id="print-area" className="rounded-[20px] border bg-[var(--surface)] overflow-hidden" style={{ borderColor: "var(--border)" }}>
                <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[var(--surface-2)] border-b" style={{ borderColor: "var(--border)" }}>
                  <div><div className="font-bold text-[14px] flex items-center gap-2"><FileText className="w-4 h-4" /> Rekap Resmi Desa — {desaConfig.namaDesa} <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border" style={{ borderColor: "var(--border)" }}>Pratinjau Lokal</span></div><div className="text-[11px] text-[var(--text-muted)] mt-1">Bulan: {lapFilter.bulan} {lapFilter.tahun} · Bidang: {lapFilter.bidang} · RW: {lapFilter.rw} · {filteredRekap.length} kegiatan · Total sasaran: {filteredRekap.reduce((s, a) => s + a.sasaran, 0)}</div><div className="text-[10px] text-[var(--text-muted)] mt-1">{desaConfig.namaDesa} · Kec. {desaConfig.kecamatan} · {desaConfig.kabupaten} · Kode: {desaConfig.kodeDesa} · Kades: {desaConfig.kepalaDesa}</div></div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-white border" style={{ borderColor: "var(--border)" }}>Format Pemdes · Pratinjau</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead className="text-[11px] text-left bg-[var(--surface)]"><tr className="border-b" style={{ borderColor: "var(--border)" }}><th className="px-3 py-3 font-semibold">No</th><th className="px-3 py-3 font-semibold">Tanggal</th><th className="px-3 py-3 font-semibold">RW</th><th className="px-3 py-3 font-semibold">Bidang</th><th className="px-3 py-3 font-semibold">Sub-Jenis</th><th className="px-3 py-3 font-semibold">Kegiatan</th><th className="px-3 py-3 font-semibold">Sasaran</th><th className="px-3 py-3 font-semibold">Status</th></tr></thead>
                    <tbody>
                      {filteredRekap.map((r, i) => (
                        <tr key={r.id} className="border-b hover:bg-[var(--surface-2)]/50" style={{ borderColor: "var(--border)" }}>
                          <td className="px-3 py-2.5">{i + 1}</td><td className="px-3 py-2.5">{r.tanggal}</td><td className="px-3 py-2.5 font-semibold">{r.rw}</td><td className="px-3 py-2.5">{r.bidang}</td><td className="px-3 py-2.5 text-[11px]">{(r as any).subBidang || "-"}</td><td className="px-3 py-2.5 max-w-[180px] truncate" title={r.kegiatan}>{r.kegiatan}</td><td className="px-3 py-2.5">{r.sasaran}</td><td className="px-3 py-2.5"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                      {filteredRekap.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-[13px] text-[var(--text-muted)]">Tidak ada data untuk filter ini. Coba ganti filter atau input kegiatan baru.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="p-3 text-[11px] text-[var(--text-muted)] flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-2)]">
                  <span>Total sasaran terlayani: {filteredRekap.reduce((s, a) => s + a.sasaran, 0)} orang/KK · Mode pratinjau lokal — tidak disimpan permanen</span><span>{desaConfig.namaDesa} · Dicetak oleh {session?.nama} ({role}) · {new Date().toLocaleDateString("id-ID")} {new Date().toLocaleTimeString("id-ID")}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-2xl border p-4 bg-[var(--accent-light)] border-amber-200"><div className="text-[12px] font-bold flex items-center gap-1"><Download className="w-4 h-4" /> Ekspor CSV (Blob)</div><div className="text-[11px] text-[var(--text-muted)] mt-1">File CSV dibuat di browser via Blob, langsung download tanpa backend. Kompatibel Excel.</div><button onClick={handleExportCSV} className="mt-2 text-[11px] bg-black text-white px-3 py-1.5 rounded-full">Download CSV</button></div>
                <div className="rounded-2xl border p-4 bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}><div className="text-[12px] font-bold flex items-center gap-1"><FileText className="w-4 h-4" /> Format Laporan Pemdes</div><div className="text-[11px] text-[var(--text-muted)] mt-1">Tabel rekap diformat sesuai template Pemerintah Desa, siap untuk diarsipkan atau dikirim ke kecamatan. Gunakan fitur cetak browser jika diperlukan.</div><div className="mt-2 text-[11px] px-3 py-1.5 rounded-full bg-[var(--surface-2)] border inline-flex" style={{ borderColor: "var(--border)" }}>Format resmi Desa Nanjung</div></div>
                <div className="rounded-2xl border p-4 bg-[var(--surface)]" style={{ borderColor: "var(--border)" }}><div className="text-[12px] font-bold flex items-center gap-1"><FileJson className="w-4 h-4" /> Ekspor/Impor JSON</div><div className="text-[11px] text-[var(--text-muted)] mt-1">Backup semua kegiatan, users, pengaturan desa sebagai JSON. Impor kembali untuk lanjutkan sesi (pratinjau).</div><div className="flex gap-2 mt-2"><button onClick={handleExportJSON} className="text-[11px] bg-[var(--primary)] text-white px-3 py-1.5 rounded-full">Ekspor</button><label className="text-[11px] border px-3 py-1.5 rounded-full bg-[var(--surface-2)] cursor-pointer" style={{ borderColor: "var(--border)" }}>Impor <input type="file" accept=".json" className="hidden" onChange={handleImportJSON} /></label></div></div>
              </div>
            </div>
          )}

          {view === "users" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-[20px] md:text-[24px] font-bold">Manajemen User — Pratinjau Lokal</h2><span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Hanya Admin Desa · {users.length} kader</span></div>
              <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
                <div className="rounded-[20px] border bg-[var(--surface)] p-5" style={{ borderColor: "var(--border)" }}>
                  <h3 className="font-bold text-[14px] mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Tambah Kader per RW</h3>
                  <div className="space-y-3">
                    <Field label="Username"><input value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} placeholder="kader04" className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Nama Lengkap"><input value={userForm.nama} onChange={(e) => setUserForm({ ...userForm, nama: e.target.value })} placeholder="Nama kader" className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <div className="grid grid-cols-2 gap-2"><Field label="RW"><select value={userForm.rw} onChange={(e) => setUserForm({ ...userForm, rw: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]">{Array.from({ length: 13 }, (_, i) => `RW${String(i + 1).padStart(2, "0")}`).map((rw) => <option key={rw}>{rw}</option>)}</select></Field><Field label="Bidang"><select value={userForm.bidang} onChange={(e) => setUserForm({ ...userForm, bidang: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]">{BIDANGS.map((b) => <option key={b.id}>{b.name}</option>)}</select></Field></div>
                    <Field label="Role"><select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as Role })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]"><option>Kader</option><option>Koordinator Bidang</option><option>Admin Desa</option></select></Field>
                    <button onClick={() => { if (!userForm.username || !userForm.nama) return showToast("Isi username & nama"); const newU = { id: Date.now(), username: userForm.username, nama: userForm.nama, rw: userForm.rw, bidang: userForm.bidang, role: userForm.role, aktif: true }; setUsers([...users, newU]); setUserForm({ username: "", nama: "", rw: "RW01", bidang: "Kesehatan", role: "Kader" }); showToast(`Kader ${newU.nama} ditambahkan (pratinjau)`); }} className="w-full bg-[var(--primary)] text-white py-2.5 rounded-xl font-bold text-[13px]">Tambah ke Pratinjau</button>
                    <div className="text-[11px] text-[var(--text-muted)] bg-amber-50 border border-amber-200 rounded-xl p-2.5">Data user hanya di memori sesi. Untuk permanen, ekspor JSON dan nanti migrasi ke Supabase table users.</div>
                  </div>
                </div>
                <div className="rounded-[20px] border bg-[var(--surface)] overflow-hidden" style={{ borderColor: "var(--border)" }}>
                  <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--border)" }}><h3 className="font-bold text-[14px]">Daftar Kader & Koordinator</h3><button onClick={handleExportJSON} className="text-[11px] border px-3 py-1 rounded-full bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>Ekspor JSON</button></div>
                  <div className="overflow-x-auto"><table className="w-full text-[12px]"><thead className="bg-[var(--surface-2)] text-[11px] text-[var(--text-muted)]"><tr><th className="text-left px-4 py-2">Username</th><th className="text-left px-4 py-2">Nama</th><th className="text-left px-4 py-2">RW</th><th className="text-left px-4 py-2">Bidang</th><th className="text-left px-4 py-2">Role</th><th className="text-left px-4 py-2">Aksi</th></tr></thead><tbody>{users.map((u) => (<tr key={u.id} className="border-t hover:bg-[var(--surface-2)]/50" style={{ borderColor: "var(--border)" }}><td className="px-4 py-2.5 font-mono text-[11px]">{u.username}</td><td className="px-4 py-2.5 font-medium">{u.nama}</td><td className="px-4 py-2.5">{u.rw}</td><td className="px-4 py-2.5">{u.bidang}</td><td className="px-4 py-2.5"><span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--surface-2)] border" style={{ borderColor: "var(--border)" }}>{u.role}</span></td><td className="px-4 py-2.5 flex gap-1"><button onClick={() => showToast(`Edit ${u.nama} - pratinjau`)} className="p-1.5 rounded-lg border hover:bg-white" style={{ borderColor: "var(--border)" }}><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => { setUsers(users.filter((x) => x.id !== u.id)); showToast(`Hapus ${u.nama} (pratinjau)`); }} className="p-1.5 rounded-lg border hover:bg-rose-50 text-rose-600" style={{ borderColor: "var(--border)" }}><Trash2 className="w-3.5 h-3.5" /></button></td></tr>))}</tbody></table></div>
                </div>
              </div>
            </div>
          )}

          {view === "settings" && (
            <div className="space-y-4">
              <h2 className="text-[20px] md:text-[24px] font-bold">Pengaturan Desa — Pratinjau</h2>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
                <div className="rounded-[20px] border bg-[var(--surface)] p-5 md:p-6" style={{ borderColor: "var(--border)" }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Nama Desa"><input value={desaConfig.namaDesa} onChange={(e) => setDesaConfig({ ...desaConfig, namaDesa: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Kecamatan"><input value={desaConfig.kecamatan} onChange={(e) => setDesaConfig({ ...desaConfig, kecamatan: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Kabupaten"><input value={desaConfig.kabupaten} onChange={(e) => setDesaConfig({ ...desaConfig, kabupaten: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Provinsi"><input value={desaConfig.provinsi} onChange={(e) => setDesaConfig({ ...desaConfig, provinsi: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Tahun Anggaran"><select value={desaConfig.tahunAnggaran} onChange={(e) => setDesaConfig({ ...desaConfig, tahunAnggaran: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]"><option>2023</option><option>2024</option><option>2025</option></select></Field>
                    <Field label="Kode Desa"><input value={desaConfig.kodeDesa} onChange={(e) => setDesaConfig({ ...desaConfig, kodeDesa: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)] font-mono" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Kepala Desa"><input value={desaConfig.kepalaDesa} onChange={(e) => setDesaConfig({ ...desaConfig, kepalaDesa: e.target.value })} className="w-full rounded-xl border px-3 py-2.5 text-[13px] bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }} /></Field>
                    <Field label="Logo Desa (upload, pratinjau memori)"><label className="w-full rounded-xl border border-dashed px-3 py-2.5 text-[13px] bg-[var(--surface-2)] flex items-center justify-between cursor-pointer"><span className="flex items-center gap-2"><Camera className="w-4 h-4" /> {desaConfig.logo ? "Logo terpasang" : "Upload logo"}</span><input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setDesaConfig({ ...desaConfig, logo: r.result as string }); r.readAsDataURL(f); } }} /><span className="text-[11px] text-[var(--text-muted)]">PNG/JPG</span></label></Field>
                  </div>
                  <div className="mt-6 flex gap-2"><button onClick={() => showToast("Pengaturan disimpan di pratinjau memori - ekspor JSON untuk backup")} className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-full text-[13px] font-bold"><Save className="w-4 h-4" /> Simpan Pratinjau</button><button onClick={handleExportJSON} className="text-[13px] border px-4 py-2.5 rounded-full bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>Ekspor JSON</button></div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}>
                    <div className="text-[12px] font-bold mb-3">Preview Kop Surat</div>
                    <div className="border rounded-xl p-4 bg-white text-center" style={{ borderColor: "var(--border)" }}>
                      <div className="flex items-center justify-center gap-3 mb-2"><div className="w-12 h-12 rounded-xl bg-[var(--primary)] text-white grid place-items-center font-bold overflow-hidden">{desaConfig.logo ? <img src={desaConfig.logo} alt="logo" className="w-full h-full object-cover" /> : "DN"}</div><div className="text-left leading-tight"><div className="font-bold text-[13px]">Pemerintah {desaConfig.kabupaten}</div><div className="font-bold text-[13px]">Kecamatan {desaConfig.kecamatan}</div><div className="font-bold text-[14px]">{desaConfig.namaDesa}</div></div></div>
                      <div className="text-[10px] text-[var(--text-muted)] border-t pt-2 mt-2" style={{ borderColor: "var(--border)" }}>Jl. Desa No.1 · Kode: {desaConfig.kodeDesa} · {desaConfig.kabupaten} · TA {desaConfig.tahunAnggaran}</div>
                      <div className="mt-3 text-[11px]">LAPORAN 6 SPM — Pratinjau Lokal</div>
                    </div>
                  </div>
                  <div className="rounded-[20px] bg-amber-50 border border-amber-200 p-4 text-[11px] leading-snug"><strong>Catatan boundary:</strong> Pengaturan disimpan hanya di memori React state, tidak pakai localStorage. Untuk produksi, simpan di Supabase table desa_config.</div>
                </div>
              </div>
            </div>
          )}

          {view === "panduan" && (
            <div className="space-y-4">
              <h2 className="text-[20px] md:text-[24px] font-bold">Panduan & SOP Kader — Desa Nanjung</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                  <div className="rounded-[20px] border bg-[var(--surface)] p-5" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-bold text-[15px] mb-3">Alur Harian Kader (6 SPM)</h3>
                    <ol className="space-y-3 text-[13px] list-decimal pl-5">
                      <li><strong>Login:</strong> Gunakan username kader per RW (contoh kader01/kader123). Sesi hanya di memori.</li>
                      <li><strong>Pilih Bidang SPM:</strong> Pendidikan / Kesehatan / PU / Perumahan / Trantib / Sosial.</li>
                      <li><strong>Pilih Sub-Jenis Spesifik:</strong> Contoh Kesehatan → Penimbangan Balita, Cek Stunting, PMT.</li>
                      <li><strong>Isi Hasil & Sasaran:</strong> Jumlah orang/KK terlayani, hasil pengukuran, foto (opsional).</li>
                      <li><strong>Simpan ke Pratinjau:</strong> Data masuk ke dashboard & laporan V2 di memori.</li>
                      <li><strong>Ekspor:</strong> Admin lakukan Ekspor JSON/CSV sebagai backup sebelum reload.</li>
                    </ol>
                  </div>
                  <div className="rounded-[20px] border bg-[var(--surface)] p-5" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-bold text-[15px] mb-3">Detail 6 Bidang SPM</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {BIDANGS.map((b) => (
                        <div key={b.id} className="rounded-xl border p-3" style={{ borderColor: b.border, background: b.light }}>
                          <div className="flex items-center gap-2 mb-1"><b.icon className="w-4 h-4" style={{ color: b.color }} /><span className="font-bold text-[13px]" style={{ color: b.color }}>{b.name}</span></div>
                          <div className="text-[11px] text-[var(--text-muted)] mb-2">{b.desc}</div>
                          <div className="flex flex-wrap gap-1">{b.subKegiatan.map((sk) => <span key={sk} className="text-[10px] bg-white border px-2 py-0.5 rounded-full" style={{ borderColor: b.border }}>{sk}</span>)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-[20px] border bg-[var(--primary)] text-white p-5" style={{ borderColor: "var(--primary-2)" }}><div className="font-bold text-[14px] mb-2">Kredensial Pratinjau</div><div className="space-y-2 text-[12px]"><div className="bg-white/10 rounded-xl p-2.5"><div className="font-bold">Admin Desa</div><div className="font-mono text-[11px]">admin / desa123</div></div><div className="bg-white/10 rounded-xl p-2.5"><div className="font-bold">Koordinator</div><div className="font-mono text-[11px]">koord / koord123</div></div><div className="bg-white/10 rounded-xl p-2.5"><div className="font-bold">Kader</div><div className="font-mono text-[11px]">kader01 / kader123</div></div></div></div>
                  <div className="rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}><h4 className="font-bold text-[13px] mb-2">Tips Mobile</h4><ul className="text-[12px] space-y-1 list-disc pl-4 text-[var(--text-muted)]"><li>Gunakan HP Android/iOS, akses via browser</li><li>Bottom nav di bawah untuk akses cepat</li><li>Foto kegiatan langsung dari kamera HP</li><li>Ekspor JSON sebelum tutup tab</li></ul></div>
                  <div className="rounded-[20px] border bg-amber-50 border-amber-200 p-4 text-[11px]"><strong>Privasi:</strong> Data pribadi warga hanya untuk Admin & Koordinator bidang terkait, sesuai Permendes. Di pratinjau ini data dummy.</div>
                </div>
              </div>
            </div>
          )}

          {view === "info" && (
            <div className="space-y-4">
              <h2 className="text-[20px] md:text-[24px] font-bold">Info Teknis & Arsitektur Implementasi</h2>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="space-y-4">
                  <div className="rounded-[20px] border bg-[var(--surface)] p-5" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-bold text-[14px] mb-3 flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> Stack yang Direkomendasikan (Gratis)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
                      <div className="rounded-xl border p-3 bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}><div className="font-bold">Frontend (sudah ada)</div><div className="mt-1 text-[var(--text-muted)]">PWA React + Vite + Tailwind + Lucide + Recharts. Build sebagai static site.</div><div className="mt-2 text-[11px] font-mono bg-white border rounded px-2 py-1">npm run build → dist/</div></div>
                      <div className="rounded-xl border p-3 bg-emerald-50 border-emerald-200"><div className="font-bold text-emerald-800">Backend Gratis</div><div className="mt-1 text-emerald-700">Opsi 1: Supabase (PostgreSQL + Auth + Storage gratis). Opsi 2: Firebase. Opsi 3: Google Sheet API untuk MVP.</div></div>
                      <div className="rounded-xl border p-3 bg-blue-50 border-blue-200"><div className="font-bold text-blue-800">Hosting Gratis</div><div className="mt-1 text-blue-700">Vercel / Netlify / Cloudflare Pages. Deploy dist/ gratis, custom domain desa.</div></div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border bg-[var(--surface)] p-5" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-bold text-[14px] mb-3">Struktur Tabel Database (Supabase SQL)</h3>
                    <div className="rounded-xl bg-[#0F1A0F] text-[#E8F0E8] p-4 text-[11px] font-mono overflow-x-auto">
                      <pre>{`-- users
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  nama text not null,
  role text check (role in ('Admin Desa','Koordinator Bidang','Kader')),
  rw text,
  bidang text,
  aktif boolean default true,
  created_at timestamp default now()
);

-- kegiatan (6 SPM)
create table kegiatan (
  id uuid primary key default gen_random_uuid(),
  tanggal date not null,
  rw text not null,
  bidang text not null, -- Pendidikan, Kesehatan, PU, Perumahan, Trantib, Sosial
  sub_bidang text not null, -- Penyuluhan PAUD, Penimbangan Balita, dll
  nama_kegiatan text not null,
  sasaran int,
  hasil text,
  kendala text,
  tindak_lanjut text,
  foto_url text, -- storage bucket
  status text default 'Lengkap',
  created_by uuid references users(id),
  created_at timestamp default now()
);

-- sasaran (per bidang)
create table sasaran_pendidikan (id uuid primary key, nama text, rw text, jumlah int, status text);
create table sasaran_kesehatan (id uuid primary key, nama text, rw text, jumlah int, status text);
create table sasaran_pu (id uuid primary key, nama text, rw text, jumlah int, status text);
create table sasaran_perumahan (id uuid primary key, nama text, rw text, jumlah int, status text);
create table sasaran_trantib (id uuid primary key, nama text, rw text, jumlah int, status text);
create table sasaran_sosial (id uuid primary key, nama text, rw text, jumlah int, status text);

-- laporan view
create view v_rekap_bulanan as
select date_trunc('month', tanggal) as bulan, rw, bidang, count(*) as jml_kegiatan, sum(sasaran) as total_sasaran
from kegiatan group by 1,2,3;

-- desa_config
create table desa_config (
  id int primary key, -- 1 row only
  nama_desa text, kecamatan text, kabupaten text, provinsi text,
  tahun_anggaran text, kepala_desa text, kode_desa text, logo_url text
);`}</pre>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(document.querySelector("pre")?.innerText || ""); showToast("SQL schema disalin ke clipboard"); }} className="mt-3 text-[11px] border px-3 py-1.5 rounded-full bg-[var(--surface-2)] flex items-center gap-1" style={{ borderColor: "var(--border)" }}><Copy className="w-3 h-3" /> Salin SQL</button>
                  </div>

                  <div className="rounded-[20px] border bg-[var(--surface)] p-5" style={{ borderColor: "var(--border)" }}>
                    <h3 className="font-bold text-[14px] mb-3">Langkah Deploy Gratis (End-to-End)</h3>
                    <ol className="list-decimal pl-5 space-y-2 text-[12px] leading-snug">
                      <li><strong>Daftar Supabase gratis:</strong> supabase.com → New Project → region Singapore → copy Project URL & anon key.</li>
                      <li><strong>Import skema SQL:</strong> Buka SQL Editor di Supabase → paste skema di atas → Run. Buat bucket storage `foto-kegiatan` (public).</li>
                      <li><strong>Setup Frontend:</strong> Buat file .env: VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY. Ganti in-memory state di App.tsx dengan supabase.from('kegiatan').select() (nanti).</li>
                      <li><strong>Deploy ke Vercel:</strong> Push ke GitHub → import di vercel.com → set env vars → Deploy. Gratis + HTTPS otomatis.</li>
                      <li><strong>PWA:</strong> Tambahkan vite-plugin-pwa untuk offline cache (sudah pratinjau). Test di HP → Add to Home Screen.</li>
                      <li><strong>Domain Desa:</strong> Beli desa-nanjung.go.id atau pakai subdomain vercel.app gratis.</li>
                    </ol>
                    <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px]"><strong>Catatan boundary saat ini:</strong> Prototipe ini <em>tidak</em> memakai Supabase / localStorage. Semua data di React state (pratinjau). Untuk produksi, ganti state dengan fetch Supabase.</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[20px] border bg-[var(--primary)] text-white p-5" style={{ borderColor: "var(--primary-2)" }}>
                    <h3 className="font-bold text-[14px] mb-2">Kenapa Supabase untuk Desa?</h3>
                    <ul className="text-[12px] space-y-1.5 opacity-90 list-disc pl-4"><li>Gratis 500MB DB, 1GB storage, 50k auth — cukup untuk 12 RW</li><li>PostgreSQL asli, bisa SQL view rekap bulanan</li><li>Row Level Security untuk batasi akses per role RW</li><li>Storage untuk foto kegiatan kader</li><li>Realtime untuk sync dashboard</li></ul>
                  </div>
                  <div className="rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}>
                    <h4 className="font-bold text-[13px] mb-2">Alternatif Google Sheet API (MVP tercepat)</h4>
                    <p className="text-[11px] text-[var(--text-muted)]">Jika desa belum siap Supabase, pakai Google Sheet sebagai DB: buat sheet `kegiatan`, aktifkan Google Apps Script → Web App → POST data dari frontend. Gratis & familiar untuk perangkat desa.</p>
                    <div className="mt-2 text-[11px] font-mono bg-[var(--surface-2)] border rounded p-2" style={{ borderColor: "var(--border)" }}>sheet.appendRow([tanggal, rw, bidang, sub, kegiatan, sasaran])</div>
                  </div>
                  <div className="rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}>
                    <h4 className="font-bold text-[13px] mb-2">Checklist Keamanan</h4>
                    <ul className="text-[11px] space-y-1"><li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> RLS: kader hanya bisa lihat RW sendiri</li><li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Validasi foto max 5MB, hanya JPG/PNG</li><li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Audit log: siapa input kapan</li><li className="flex gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Backup mingguan JSON (tombol ekspor sudah ada)</li></ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer resmi */}
          <div className="mt-8 rounded-[20px] border bg-[var(--surface)] p-4 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white grid place-items-center font-bold overflow-hidden">{desaConfig.logo ? <img src={desaConfig.logo} alt="logo" className="w-full h-full object-cover" /> : "DN"}</div>
              <div className="leading-tight"><div className="font-bold text-[13px]">Pemerintah {desaConfig.namaDesa} · Kec. {desaConfig.kecamatan}</div><div className="text-[11px] text-[var(--text-muted)]">{desaConfig.kabupaten} · {desaConfig.provinsi} · Kode {desaConfig.kodeDesa} · Kades: {desaConfig.kepalaDesa} · TA {desaConfig.tahunAnggaran}</div></div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] text-center md:text-right">Dashboard Posyandu 6 SPM v2.0 · Mode Pratinjau Lokal (in-memory) · Ekspor JSON/CSV untuk backup · Dibuat untuk Desa Nanjung</div>
          </div>
        </main>
      </div>

      {/* Bottom nav mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)] border-t px-2 py-2 flex items-center justify-around gap-1" style={{ borderColor: "var(--border)", paddingBottom: "calc(8px + var(--safe-area-inset-top))" }}>
        <BottomItem icon={LayoutDashboard} label="Dash" active={view === "dashboard"} onClick={() => setView("dashboard")} />
        <BottomItem icon={ClipboardList} label="Input" active={view === "input"} onClick={() => setView("input")} />
        <BottomItem icon={Users} label="Sasaran" active={view === "sasaran"} onClick={() => setView("sasaran")} />
        <BottomItem icon={FileBarChart} label="Laporan" active={view === "laporan"} onClick={() => setView("laporan")} />
        <BottomItem icon={Menu} label="Menu" active={["users", "settings", "panduan", "info", "monitoring"].includes(view) || view.startsWith("bidang-")} onClick={() => setMobileMenu(!mobileMenu)} />
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
}

function CredCard({ user, pass, role, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`text-left rounded-xl border p-2.5 transition ${active ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-[var(--surface-2)] border-[var(--border)] hover:bg-white"}`}>
      <div className="text-[11px] font-bold">{role}</div><div className="text-[10px] font-mono mt-0.5 opacity-80">{user} / {pass}</div>
    </button>
  );
}

function Toast({ msg }: { msg: string }) {
  return <div className="fixed bottom-[88px] md:bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-[#1A2E1A] text-white px-5 py-3 rounded-full text-[13px] font-medium shadow-xl flex items-center gap-2 animate-[slideUp_0.3s_ease] max-w-[90vw]"><CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" /> <span className="truncate">{msg}</span></div>;
}

function SidebarItem({ icon: Icon, label, sub, active, onClick, badge, count }: any) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition group ${active ? "bg-[var(--primary)] text-white shadow-sm" : "hover:bg-[var(--surface-2)] text-[var(--text)]"}`}>
      <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-white" : "text-[var(--text-muted)] group-hover:text-[var(--text)]"}`} />
      <div className="min-w-0 flex-1"><div className="text-[13px] font-semibold leading-tight truncate">{label}</div>{sub && <div className={`text-[11px] leading-tight truncate ${active ? "text-white/70" : "text-[var(--text-muted)]"}`}>{sub}</div>}</div>
      {badge && <span className="text-[10px] bg-[var(--accent)] text-black px-1.5 py-0.5 rounded-full font-bold">{badge}</span>}
      {count !== undefined && count > 0 && <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${active ? "bg-white text-[var(--primary)]" : "bg-amber-100 text-amber-800"}`}>{count}</span>}
    </button>
  );
}

function BottomItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${active ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)]"}`}>
      <Icon className="w-5 h-5" /><span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function StatCard({ title, value, sub, icon: Icon, trend, accent }: any) {
  return (
    <div className="rounded-[18px] border bg-[var(--surface)] p-4 flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between"><div className={`w-9 h-9 rounded-xl grid place-items-center ${accent}`}><Icon className="w-5 h-5" /></div><span className={`text-[11px] px-2 py-1 rounded-full font-bold flex items-center gap-1 ${trend === "up" ? "bg-emerald-50 text-emerald-700" : trend === "down" ? "bg-zinc-50 text-zinc-700" : "bg-amber-50 text-amber-700"}`}>{trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "warn" ? <AlertTriangle className="w-3 h-3" /> : <FileJson className="w-3 h-3" />}{trend === "up" ? "Naik" : trend === "warn" ? "Perhatian" : "Lokal"}</span></div>
      <div><div className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wide">{title}</div><div className="display text-[26px] font-bold leading-none mt-1">{value}</div><div className="text-[11px] text-[var(--text-muted)] mt-1.5 line-clamp-2">{sub}</div></div>
    </div>
  );
}

function BidangCard({ bidang, onClick }: { bidang: Bidang; onClick: () => void }) {
  const Icon = bidang.icon;
  return (
    <button onClick={onClick} className="text-left rounded-[20px] border bg-[var(--surface)] p-4 hover:shadow-md hover:-translate-y-[1px] transition-all group" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-start justify-between mb-3"><div className="w-11 h-11 rounded-xl grid place-items-center border" style={{ background: bidang.light, borderColor: bidang.border, color: bidang.color }}><Icon className="w-5 h-5" /></div><span className="text-[11px] px-2.5 py-1 rounded-full border bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}>{bidang.subKegiatan.length} sub-jenis</span></div>
      <div className="font-bold text-[15px]">{bidang.name}</div><div className="text-[12px] text-[var(--text-muted)]">{bidang.desc}</div>
      <div className="mt-3"><div className="flex items-center justify-between text-[11px] mb-1.5"><span className="text-[var(--text-muted)]">Progress pratinjau</span><span className="font-bold" style={{ color: bidang.color }}>{bidang.progress}%</span></div><div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${bidang.progress}%`, background: bidang.color }} /></div></div>
      <div className="mt-3 flex flex-wrap gap-1.5">{bidang.subKegiatan.slice(0, 3).map((k) => (<span key={k} className="text-[10px] px-2 py-1 rounded-full bg-[var(--surface-2)] border text-[var(--text-muted)]" style={{ borderColor: "var(--border)" }}>{k}</span>))}</div>
    </button>
  );
}

function Field({ label, children, error }: any) {
  return <div><div className="text-[12px] font-semibold mb-1.5">{label}</div>{children}{error && <div className="text-[11px] text-[#D92D20] mt-1">{error}</div>}</div>;
}

function StatusBadge({ status }: { status: string }) {
  const map: any = { Lengkap: "bg-emerald-50 text-emerald-700 border-emerald-200", "Belum Lengkap": "bg-amber-50 text-amber-800 border-amber-200", "Pending Tindak Lanjut": "bg-rose-50 text-rose-700 border-rose-200" };
  return <span className={`text-[11px] px-2 py-1 rounded-full border font-medium ${map[status] || "bg-gray-50"}`}>{status}</span>;
}

function RoleRow({ role, desc, active }: any) {
  return (
    <div className={`flex gap-2 p-2 rounded-xl border ${active ? "bg-[var(--primary-light)] border-emerald-200" : "bg-[var(--surface-2)] border-transparent"}`} style={{ borderColor: active ? undefined : "var(--border)" }}>
      <div className={`w-6 h-6 rounded-full grid place-items-center text-[10px] font-bold shrink-0 ${active ? "bg-[var(--primary)] text-white" : "bg-white border"}`} style={{ borderColor: "var(--border)" }}>{role[0]}</div>
      <div><div className="font-bold text-[12px]">{role}</div><div className="text-[11px] text-[var(--text-muted)] leading-tight">{desc}</div></div>
    </div>
  );
}

function LaporanSelect({ label, value, options, onChange }: any) {
  return <div><div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">{label}</div><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-[13px] bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" style={{ borderColor: "var(--border)" }}>{options.map((o: string) => (<option key={o}>{o}</option>))}</select></div>;
}

function BidangDetail({ id, activities, onBack, showToast }: { id: string; activities: any[]; onBack: () => void; showToast: (m: string) => void }) {
  const bidang = BIDANGS.find((b) => b.id === id);
  if (!bidang) return null;
  const filtered = activities.filter((a) => a.bidang.toLowerCase().includes(bidang.name.toLowerCase()) || a.bidang === bidang.name);
  const Icon = bidang.icon;
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-[12px] inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text)]">← Kembali ke Dashboard</button>
      <div className="rounded-[20px] border p-5 md:p-6 flex flex-col md:flex-row gap-4 items-start" style={{ background: bidang.light, borderColor: bidang.border }}>
        <div className="w-14 h-14 rounded-2xl bg-white border grid place-items-center shadow-sm" style={{ borderColor: bidang.border, color: bidang.color }}><Icon className="w-7 h-7" /></div>
        <div className="flex-1"><h2 className="display text-[22px] font-bold" style={{ color: bidang.color }}>{bidang.name} — {bidang.short}</h2><p className="text-[13px] mt-1 max-w-[700px]" style={{ color: "#334" }}>{bidang.desc} · {bidang.subKegiatan.length} sub-jenis spesifik sesuai SOP Desa Nanjung. Pratinjau lokal.</p><div className="flex flex-wrap gap-2 mt-3">{bidang.subKegiatan.map((k) => (<span key={k} className="text-[11px] bg-white border px-2.5 py-1 rounded-full" style={{ borderColor: bidang.border }}>{k}</span>))}</div></div>
        <button onClick={() => showToast(`Form ${bidang.name} — pilih sub-jenis dulu`)} className="text-[12px] bg-[var(--primary)] text-white px-4 py-2 rounded-full font-bold">Input Baru</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-[14px] mb-3">Kegiatan {bidang.name} Terbaru (memori)</h3>
          <div className="space-y-2">{filtered.length ? filtered.map((a) => (<div key={a.id} className="flex items-center justify-between p-3 rounded-xl border bg-[var(--surface-2)]" style={{ borderColor: "var(--border)" }}><div><div className="font-semibold text-[13px]">{a.kegiatan} <span className="text-[11px] font-normal text-[var(--text-muted)]">· {(a as any).subBidang}</span></div><div className="text-[11px] text-[var(--text-muted)]">{a.rw} · {a.tanggal} · {a.sasaran} sasaran</div></div><StatusBadge status={a.status} /></div>)) : <div className="text-[13px] text-[var(--text-muted)] p-6 text-center">Belum ada kegiatan untuk bidang ini di sesi ini. Input baru akan muncul di sini (pratinjau).</div>}</div>
        </div>
        <div className="rounded-[20px] border bg-[var(--surface)] p-4" style={{ borderColor: "var(--border)" }}>
          <h3 className="font-bold text-[14px] mb-3">Checklist Tupoksi {bidang.short}</h3>
          <ul className="space-y-2.5 text-[12px]">{["Pilih sub-jenis spesifik sesuai SOP", "Pendataan sasaran sesuai KTP/KK", "Dokumentasi foto (memori)", "Verifikasi koordinator", "Ekspor JSON sebelum reload"].map((t, i) => (<li key={i} className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><span>{t}</span></li>))}</ul>
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px]"><strong>Mode pratinjau:</strong> Data tidak disimpan permanen. Untuk produksi, hubungkan ke Supabase table kegiatan dengan filter bidang = {bidang.name}.</div>
        </div>
      </div>
    </div>
  );
}
