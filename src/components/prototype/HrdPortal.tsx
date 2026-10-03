import React, { useState } from 'react';
import { 
  BarChart3, CheckSquare, Printer, Download, Search, 
  Calendar, CheckCircle, XCircle, AlertCircle, Eye, FileText
} from 'lucide-react';
import { PresensiRecord, PengajuanIzin, Divisi, User } from '../../types';
import { PrintReportModal } from './PrintReportModal';

interface HrdPortalProps {
  currentUser: User;
  divisiList: Divisi[];
  presensiList: PresensiRecord[];
  pengajuanList: PengajuanIzin[];
  onApproveIzin: (pengajuanId: number, isApproved: boolean, catatan: string) => void;
  onExportCsv: (records: PresensiRecord[]) => void;
}

export const HrdPortal: React.FC<HrdPortalProps> = ({
  currentUser,
  divisiList,
  presensiList,
  pengajuanList,
  onApproveIzin,
  onExportCsv,
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'approval' | 'laporan'>('monitoring');
  
  // Filter states for Monitoring
  const [monitorDivisi, setMonitorDivisi] = useState<string>('ALL');
  const [monitorStatus, setMonitorStatus] = useState<string>('ALL');
  const [monitorSearch, setMonitorSearch] = useState<string>('');

  // Filter states for Laporan
  const [reportDivisi, setReportDivisi] = useState<string>('ALL');
  const [reportStatus, setReportStatus] = useState<string>('ALL');
  const [reportMonth, setReportMonth] = useState<string>('2026-10');

  // Approval modal/action state
  const [selectedPengajuan, setSelectedPengajuan] = useState<PengajuanIzin | null>(null);
  const [approvalNote, setApprovalNote] = useState<string>('');
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState<boolean>(false);
  const [decisionType, setDecisionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');

  // Print Report Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Detail Foto Modal
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Stats calculation
  const totalRecords = presensiList.length;
  const hadirCount = presensiList.filter(p => p.status === 'HADIR').length;
  const terlambatCount = presensiList.filter(p => p.status === 'TERLAMBAT').length;
  const izinCount = presensiList.filter(p => p.status === 'IZIN' || p.status === 'SAKIT').length;
  const alpaCount = presensiList.filter(p => p.status === 'ALPA').length;
  const pendingLeaves = pengajuanList.filter(p => p.status_approval === 'PENDING');

  // Filtered monitoring
  const filteredMonitor = presensiList.filter(p => {
    const matchDiv = monitorDivisi === 'ALL' || p.user_divisi === monitorDivisi;
    const matchStat = monitorStatus === 'ALL' || p.status === monitorStatus;
    const matchSearch = p.user_nama.toLowerCase().includes(monitorSearch.toLowerCase()) ||
                        p.user_nip.toLowerCase().includes(monitorSearch.toLowerCase());
    return matchDiv && matchStat && matchSearch;
  });

  // Filtered report records
  const filteredReport = presensiList.filter(p => {
    const matchDiv = reportDivisi === 'ALL' || p.user_divisi === reportDivisi;
    const matchStat = reportStatus === 'ALL' || p.status === reportStatus;
    const matchDate = p.tanggal.startsWith(reportMonth);
    return matchDiv && matchStat && matchDate;
  });

  const handleOpenDecision = (item: PengajuanIzin, type: 'APPROVE' | 'REJECT') => {
    setSelectedPengajuan(item);
    setDecisionType(type);
    setApprovalNote(type === 'APPROVE' ? 'Disetujui. Harap selesaikan pekerjaan tertunda sebelum cuti.' : 'Ditolak karena kuota cuti divisi sedang padat.');
    setIsApprovalModalOpen(true);
  };

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPengajuan) return;
    onApproveIzin(selectedPengajuan.id, decisionType === 'APPROVE', approvalNote);
    setIsApprovalModalOpen(false);
  };

  const getPeriodeLabel = () => {
    const [year, month] = reportMonth.split('-');
    const date = new Date(Number(year), Number(month) - 1, 1);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Executive Stat Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Presensi</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{totalRecords}</span>
          <span className="text-[11px] text-slate-400">Bulan Berjalan</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Hadir Tepat Waktu</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">{hadirCount}</span>
          <span className="text-[11px] text-emerald-600">Disiplin Tinggi</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Terlambat</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">{terlambatCount}</span>
          <span className="text-[11px] text-amber-600">Perlu Evaluasi</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Izin & Sakit</span>
          <span className="text-2xl font-bold font-mono text-sky-600 mt-1 block">{izinCount}</span>
          <span className="text-[11px] text-slate-400">Terverifikasi</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-500 font-medium block">Menunggu Approval</span>
          <span className="text-2xl font-bold font-mono text-purple-600 mt-1 block">{pendingLeaves.length}</span>
          <span className="text-[11px] text-purple-600 font-medium">Antrean Cuti</span>
        </div>
      </div>

      {/* HRD Segmented Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'monitoring' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Monitoring Absensi Real-Time
        </button>
        <button
          onClick={() => setActiveTab('approval')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'approval' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Approval Izin & Cuti</span>
          {pendingLeaves.length > 0 && (
            <span className="bg-purple-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {pendingLeaves.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('laporan')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'laporan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Printer className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mencetak Laporan Hadir</span>
        </button>
      </div>

      {/* TAB 1: MONITORING ABSENSI REAL-TIME */}
      {activeTab === 'monitoring' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monitoring Absensi Karyawan</h3>
              <p className="text-xs text-slate-500">
                Pantau kehadiran real-time, waktu check-in, titik GPS, dan bukti foto selfie
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">
              {filteredMonitor.length} Data Ditampilkan
            </span>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari karyawan atau NIP..."
                value={monitorSearch}
                onChange={(e) => setMonitorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={monitorDivisi}
              onChange={(e) => setMonitorDivisi(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Semua Divisi</option>
              {divisiList.map(d => (
                <option key={d.id} value={d.nama_divisi}>{d.nama_divisi}</option>
              ))}
            </select>
            <select
              value={monitorStatus}
              onChange={(e) => setMonitorStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="ALL">Semua Status</option>
              <option value="HADIR">Hadir Tepat Waktu</option>
              <option value="TERLAMBAT">Terlambat</option>
              <option value="IZIN">Izin</option>
              <option value="SAKIT">Sakit</option>
              <option value="ALPA">Alpa</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Karyawan</th>
                  <th className="py-2.5 px-3">Divisi</th>
                  <th className="py-2.5 px-3 text-center">Masuk</th>
                  <th className="py-2.5 px-3 text-center">Pulang</th>
                  <th className="py-2.5 px-3">Jarak GPS</th>
                  <th className="py-2.5 px-3 text-center">Foto Selfie</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredMonitor.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono">{item.tanggal}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900">{item.user_nama}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.user_nip}</div>
                    </td>
                    <td className="py-2 px-3 text-slate-600">{item.user_divisi}</td>
                    <td className="py-2 px-3 text-center font-mono font-medium">{item.jam_masuk || '-'}</td>
                    <td className="py-2 px-3 text-center font-mono">{item.jam_pulang || '-'}</td>
                    <td className="py-2 px-3 font-mono text-[11px]">
                      {item.jarak_masuk_meter !== null ? (
                        <span className={item.jarak_masuk_meter <= 60 ? 'text-emerald-600' : 'text-red-600'}>
                          {item.jarak_masuk_meter}m dari kantor
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {item.foto_masuk ? (
                        <button
                          onClick={() => setSelectedPhoto(item.foto_masuk)}
                          className="p-1 hover:bg-slate-200 rounded text-indigo-600 transition-colors inline-flex items-center gap-1 text-[11px]"
                          title="Lihat Foto Verifikasi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'TERLAMBAT' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'IZIN' ? 'bg-sky-100 text-sky-800' :
                        item.status === 'SAKIT' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status} {item.keterlambatan_menit > 0 && `(+${item.keterlambatan_menit}m)`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: APPROVAL PERMOHONAN IZIN & CUTI */}
      {activeTab === 'approval' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Kelola Permohonan Izin & Cuti Karyawan</h3>
            <p className="text-xs text-slate-500">
              Verifikasi dan putuskan persetujuan izin, sakit, maupun cuti tahunan
            </p>
          </div>

          <div className="space-y-3">
            {pengajuanList.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada pengajuan izin.</p>
            ) : (
              pengajuanList.map(item => (
                <div 
                  key={item.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.user_nama}</span>
                      <span className="text-[11px] font-mono text-slate-500">{item.user_nip}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-medium">{item.user_divisi}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                        {item.jenis}
                      </span>
                      <span>
                        Periode: <strong>{item.tanggal_mulai}</strong> s/d <strong>{item.tanggal_selesai}</strong> ({item.total_hari} Hari Kerja)
                      </span>
                    </div>

                    <p className="text-slate-700 italic pt-1">"{item.alasan}"</p>

                    {item.catatan_approval && (
                      <p className="text-[11px] text-emerald-800 font-medium">
                        Keputusan HRD ({item.approved_by_nama}): {item.catatan_approval}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                      item.status_approval === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                      item.status_approval === 'DITOLAK' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status_approval}
                    </span>

                    {item.status_approval === 'PENDING' && (
                      <div className="flex gap-1.5 mt-2">
                        <button
                          onClick={() => handleOpenDecision(item, 'APPROVE')}
                          className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleOpenDecision(item, 'REJECT')}
                          className="py-1 px-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MENCETAK LAPORAN HADIR (OFFICIAL PRINT & EXPORT) */}
      {activeTab === 'laporan' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Modul Cetak Laporan Kehadiran Karyawan</h3>
              <p className="text-xs text-slate-500">
                Pilih filter periode & departemen untuk mencetak dokumen format A4 resmi atau mengekspor ke spreadsheet
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExportCsv(filteredReport)}
                className="py-2 px-3.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Ekspor CSV
              </button>
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="py-2 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Pratinjau & Cetak Laporan (A4)
              </button>
            </div>
          </div>

          {/* Report Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Periode Bulan:</label>
              <input
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Departemen / Divisi:</label>
              <select
                value={reportDivisi}
                onChange={(e) => setReportDivisi(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">Semua Departemen</option>
                {divisiList.map(d => (
                  <option key={d.id} value={d.nama_divisi}>{d.nama_divisi}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Status Kehadiran:</label>
              <select
                value={reportStatus}
                onChange={(e) => setReportStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">Semua Status</option>
                <option value="HADIR">Hadir Tepat Waktu</option>
                <option value="TERLAMBAT">Terlambat</option>
                <option value="IZIN">Izin</option>
                <option value="SAKIT">Sakit</option>
                <option value="ALPA">Alpa</option>
              </select>
            </div>
          </div>

          {/* Quick Preview Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">Pratinjau Lembar Data ({filteredReport.length} entri):</span>
              <span>Periode: {getPeriodeLabel()}</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Tanggal</th>
                    <th className="py-2.5 px-3">NIP</th>
                    <th className="py-2.5 px-3">Nama</th>
                    <th className="py-2.5 px-3">Divisi</th>
                    <th className="py-2.5 px-3 text-center">Masuk</th>
                    <th className="py-2.5 px-3 text-center">Pulang</th>
                    <th className="py-2.5 px-3 text-right">Telat (Mnt)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredReport.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        Tidak ada catatan presensi pada filter bulan ini.
                      </td>
                    </tr>
                  ) : (
                    filteredReport.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono">{item.tanggal}</td>
                        <td className="py-2 px-3 font-mono font-medium">{item.user_nip}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{item.user_nama}</td>
                        <td className="py-2 px-3 text-slate-600">{item.user_divisi}</td>
                        <td className="py-2 px-3 text-center font-mono">{item.jam_masuk || '-'}</td>
                        <td className="py-2 px-3 text-center font-mono">{item.jam_pulang || '-'}</td>
                        <td className="py-2 px-3 text-right font-mono">
                          {item.keterlambatan_menit > 0 ? item.keterlambatan_menit : '-'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                            item.status === 'TERLAMBAT' ? 'bg-amber-100 text-amber-800' :
                            'bg-sky-100 text-sky-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DECISION APPROVAL */}
      {isApprovalModalOpen && selectedPengajuan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {decisionType === 'APPROVE' ? 'Setujui Permohonan' : 'Tolak Permohonan'}
              </h3>
            </div>

            <form onSubmit={handleConfirmDecision} className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-bold text-slate-800">{selectedPengajuan.user_nama}</p>
                <p className="text-[11px] text-slate-500">
                  {selectedPengajuan.jenis} ({selectedPengajuan.total_hari} Hari) · {selectedPengajuan.tanggal_mulai} s/d {selectedPengajuan.tanggal_selesai}
                </p>
                <p className="text-slate-600 italic mt-1">"{selectedPengajuan.alasan}"</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Catatan Resmi HRD / Manajemen:
                </label>
                <textarea
                  rows={2}
                  required
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsApprovalModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-2 px-4 font-semibold text-white rounded-lg shadow-xs ${
                    decisionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Konfirmasi {decisionType === 'APPROVE' ? 'Setujui' : 'Tolak'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL FOTO MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-200 p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-2">Foto Verifikasi Biometrik Wajah</h4>
            <div className="aspect-square bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={selectedPhoto} alt="Foto Selfie" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="w-full mt-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* PRINT REPORT MODAL (A4 READY) */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        records={filteredReport}
        periodeLabel={getPeriodeLabel()}
        divisiFilter={reportDivisi === 'ALL' ? 'Semua Divisi' : reportDivisi}
        onExportCsv={() => onExportCsv(filteredReport)}
      />
    </div>
  );
};
