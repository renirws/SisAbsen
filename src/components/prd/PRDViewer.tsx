import React, { useState } from 'react';
import { 
  FileText, Download, Printer, Search, ChevronRight, CheckCircle2, 
  Layers, ShieldCheck, Smartphone, Zap, Database, ArrowRight
} from 'lucide-react';
import { PRD_DOCUMENT_META, PRD_SECTIONS } from '../../data/prdContent';

export const PRDViewer: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(PRD_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentSection = PRD_SECTIONS.find(s => s.id === activeSectionId) || PRD_SECTIONS[0];

  const handleDownloadMarkdown = () => {
    let md = `# ${PRD_DOCUMENT_META.title}\n## ${PRD_DOCUMENT_META.subTitle}\n\n`;
    md += `- Document ID: ${PRD_DOCUMENT_META.documentId}\n`;
    md += `- Penulis: ${PRD_DOCUMENT_META.author}\n`;
    md += `- Versi: ${PRD_DOCUMENT_META.version}\n`;
    md += `- Status: ${PRD_DOCUMENT_META.status}\n`;
    md += `- Tanggal: ${PRD_DOCUMENT_META.dateCreated}\n\n---\n\n`;

    PRD_SECTIONS.forEach(sec => {
      md += `## ${sec.number}. ${sec.title}\n\n`;
      sec.subsections?.forEach(sub => {
        md += `### ${sub.title}\n\n${sub.content}\n\n`;
        if (sub.points) {
          sub.points.forEach(p => {
            md += `- ${p}\n`;
          });
          md += `\n`;
        }
        if (sub.tableData) {
          md += `| ${sub.tableData.headers.join(' | ')} |\n`;
          md += `| ${sub.tableData.headers.map(() => '---').join(' | ')} |\n`;
          sub.tableData.rows.forEach(r => {
            md += `| ${r.join(' | ')} |\n`;
          });
          md += `\n`;
        }
      });
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PRD_Sistem_Informasi_Absensi.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPRD = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* PRD Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-900 text-white rounded">
                {PRD_DOCUMENT_META.documentId}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {PRD_DOCUMENT_META.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                v{PRD_DOCUMENT_META.version}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              {PRD_DOCUMENT_META.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {PRD_DOCUMENT_META.subTitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span>Penyusun: <strong>{PRD_DOCUMENT_META.author}</strong></span>
              <span>·</span>
              <span>Kategori: <strong>Web & Smartphone Responsive</strong></span>
              <span>·</span>
              <span>Target Latensi: <strong>&lt; 500ms (Fast Response)</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={handleDownloadMarkdown}
              className="py-2 px-3.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh .MD
            </button>
            <button
              onClick={handlePrintPRD}
              className="py-2 px-3.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak PRD
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: TOC Sidebar + Content Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table of Contents Navigation */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs sticky top-20">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              Daftar Isi Dokumen PRD
            </h3>
            <div className="space-y-1">
              {PRD_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    activeSectionId === sec.id
                      ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">
                    <span className="font-mono text-slate-400 mr-2">{sec.number}.</span>
                    {sec.title}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${activeSectionId === sec.id ? 'text-indigo-600' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            {/* Quick Architecture Reference Badge */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Standar Analisis Sistem Terpenuhi:
              </div>
              <div>✓ Multi-Role (Admin, Karyawan, HRD)</div>
              <div>✓ Geofencing Radius & Foto Selfie</div>
              <div>✓ Web & Smartphone Fast Response</div>
              <div>✓ Cetak Laporan Kehadiran Resmi (A4)</div>
            </div>
          </div>
        </div>

        {/* Section Detail Reading Panel */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <span className="font-mono text-xs font-bold text-indigo-600 block mb-1">
                BAB {currentSection.number}
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {currentSection.title}
              </h2>
            </div>

            <div className="space-y-6">
              {currentSection.subsections?.map((sub) => (
                <div key={sub.id} className="space-y-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    {sub.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sub.content}
                  </p>

                  {/* Bullet points */}
                  {sub.points && sub.points.length > 0 && (
                    <ul className="space-y-2 pl-2">
                      {sub.points.map((pt, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Table Data (e.g. RBAC Matrix) */}
                  {sub.tableData && (
                    <div className="mt-3 overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                            {sub.tableData.headers.map((h, i) => (
                              <th key={i} className="py-2.5 px-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-700">
                          {sub.tableData.rows.map((r, ri) => (
                            <tr key={ri} className="hover:bg-slate-50">
                              {r.map((cell, ci) => (
                                <td key={ci} className={`py-2 px-3 ${ci === 0 ? 'font-medium text-slate-900' : ''}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Flowchart Diagram for System Flow */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Alur Operasional Presensi & Pelaporan (System Workflow)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Fast Response Engine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-2">
                <span className="text-[10px] font-mono text-sky-400 font-bold block">1. SISI KARYAWAN (CLIENT)</span>
                <h4 className="font-semibold text-slate-200">Presensi GPS + Selfie</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Karyawan membuka web di smartphone. Sistem validasi koordinat GPS vs radius kantor (Geofence). Mengambil foto selfie kamera.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block">2. SISI SERVER (API & DB)</span>
                <h4 className="font-semibold text-slate-200">Validasi & Pencatatan</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Server memverifikasi jarak dengan Haversine formula, mencocokkan jam masuk vs toleransi shift, menyimpan ke tabel <code>presensi</code> (&lt; 350ms).
                </p>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-lg border border-slate-700 space-y-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold block">3. SISI HRD & MANAJEMEN</span>
                <h4 className="font-semibold text-slate-200">Approval & Cetak Laporan</h4>
                <p className="text-[11px] text-slate-400 leading-normal">
                  HRD memantau live dashboard, menyetujui pengajuan izin, dan mencetak dokumen Laporan Hadir resmi format A4 instan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
