import React from 'react';
import { Printer, Download, X, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { PresensiRecord } from '../../types';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: PresensiRecord[];
  periodeLabel: string;
  divisiFilter: string;
  onExportCsv: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  records,
  periodeLabel,
  divisiFilter,
  onExportCsv,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalHadir = records.filter(r => r.status === 'HADIR').length;
  const totalTerlambat = records.filter(r => r.status === 'TERLAMBAT').length;
  const totalIzinSakit = records.filter(r => r.status === 'IZIN' || r.status === 'SAKIT').length;
  const totalAlpa = records.filter(r => r.status === 'ALPA').length;
  const totalRecord = records.length;
  const attendanceRate = totalRecord > 0 ? Math.round(((totalHadir + totalTerlambat) / totalRecord) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex justify-center p-2 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-auto flex flex-col border border-slate-200">
        
        {/* Modal Action Header (Excluded from print via .no-print) */}
        <div className="no-print p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-xl">
          <div className="flex items-center gap-2 text-slate-800">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-sm sm:text-base">Pratinjau Dokumen Cetak Laporan Kehadiran</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Ekspor CSV
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Dokumen (A4 / PDF)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Standard A4 Format) */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 overflow-x-auto">
          {/* Official Letterhead / Kop Surat Perusahaan */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase">
                  PT NUSANTARA SINERGI TEKNOLOGI
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Gedung Menara Sudirman Lantai 8-9, Jl. Jend. Sudirman Kav. 28, Jakarta Selatan 12920
                </p>
                <p className="text-xs text-slate-500">
                  Telp: (021) 5290-8800 · Email: hrd@nusantara-tekno.co.id · Website: www.nusantara-tekno.co.id
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono text-slate-500 block">No: LAP-ABS/2026/X/0092</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mt-1">SI-Absensi Versi 1.0</span>
              </div>
            </div>
          </div>

          {/* Report Title */}
          <div className="text-center my-6">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 uppercase tracking-wide">
              LAPORAN REKAPITULASI KEHADIRAN KARYAWAN
            </h2>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-600 mt-1 font-medium">
              <span>Periode: <strong>{periodeLabel}</strong></span>
              <span>·</span>
              <span>Departemen: <strong>{divisiFilter}</strong></span>
              <span>·</span>
              <span>Dicetak: <strong>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg mb-6 text-center text-xs">
            <div className="p-2 border-r border-slate-200">
              <span className="text-slate-500 block">Total Data Record</span>
              <span className="text-base font-bold font-mono text-slate-900">{totalRecord}</span>
            </div>
            <div className="p-2 border-r border-slate-200">
              <span className="text-slate-500 block">Hadir Tepat Waktu</span>
              <span className="text-base font-bold font-mono text-emerald-700">{totalHadir}</span>
            </div>
            <div className="p-2 border-r border-slate-200">
              <span className="text-slate-500 block">Terlambat</span>
              <span className="text-base font-bold font-mono text-amber-700">{totalTerlambat}</span>
            </div>
            <div className="p-2 border-r border-slate-200">
              <span className="text-slate-500 block">Izin / Sakit</span>
              <span className="text-base font-bold font-mono text-sky-700">{totalIzinSakit}</span>
            </div>
            <div className="p-2 col-span-2 sm:col-span-1">
              <span className="text-slate-500 block">Tingkat Kehadiran</span>
              <span className="text-base font-bold font-mono text-indigo-700">{attendanceRate}%</span>
            </div>
          </div>

          {/* Table of Attendance Records */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">NIP</th>
                  <th className="py-2.5 px-3">Nama Karyawan</th>
                  <th className="py-2.5 px-3">Divisi</th>
                  <th className="py-2.5 px-3 text-center">Masuk</th>
                  <th className="py-2.5 px-3 text-center">Pulang</th>
                  <th className="py-2.5 px-3 text-right">Telat</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-400">
                      Tidak ada data kehadiran yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  records.map((rec, idx) => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono">{rec.tanggal}</td>
                      <td className="py-2 px-3 font-mono font-medium">{rec.user_nip}</td>
                      <td className="py-2 px-3 font-medium">{rec.user_nama}</td>
                      <td className="py-2 px-3 text-slate-600">{rec.user_divisi}</td>
                      <td className="py-2 px-3 text-center font-mono">{rec.jam_masuk || '-'}</td>
                      <td className="py-2 px-3 text-center font-mono">{rec.jam_pulang || '-'}</td>
                      <td className="py-2 px-3 text-right font-mono">
                        {rec.keterlambatan_menit > 0 ? `${rec.keterlambatan_menit}m` : '-'}
                      </td>
                      <td className="py-2 px-3 text-center font-semibold">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] ${
                          rec.status === 'HADIR' ? 'bg-emerald-50 text-emerald-700' :
                          rec.status === 'TERLAMBAT' ? 'bg-amber-50 text-amber-700' :
                          rec.status === 'IZIN' ? 'bg-sky-50 text-sky-700' :
                          rec.status === 'SAKIT' ? 'bg-purple-50 text-purple-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Formal Signatures / Kolom Tanda Tangan Resmi */}
          <div className="mt-12 pt-6 grid grid-cols-2 text-center text-xs text-slate-700">
            <div>
              <p className="text-slate-500">Mengetahui & Memverifikasi,</p>
              <p className="font-semibold mt-1">HR & General Affairs Manager</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[11px] text-slate-400 font-mono italic">[ Tanda Tangan & Cap Digital ]</span>
              </div>
              <p className="font-bold underline text-slate-900 mt-2">Reni Wulandari, S.Psi</p>
              <p className="text-slate-500 text-[11px]">NIP: HRD-005</p>
            </div>

            <div>
              <p className="text-slate-500">Disetujui untuk Payroll & Audit,</p>
              <p className="font-semibold mt-1">Direktur Operasional</p>
              <div className="h-16 flex items-end justify-center">
                <span className="text-[11px] text-slate-400 font-mono italic">[ Tanda Tangan & Cap Digital ]</span>
              </div>
              <p className="font-bold underline text-slate-900 mt-2">Ir. Hendra Kusuma, M.M.</p>
              <p className="text-slate-500 text-[11px]">NIP: DIR-001</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
            Dokumen ini dihasilkan secara otomatis oleh Sistem Informasi Absensi (SIAbsensi) terverifikasi koordinat GPS Geofencing & Foto Biometrik.
          </div>
        </div>
      </div>
    </div>
  );
};
