import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, Camera, CheckCircle2, AlertTriangle, 
  Calendar, FileText, Send, ShieldCheck, ChevronRight, User as UserIcon
} from 'lucide-react';
import { User, PresensiRecord, PengajuanIzin, KantorLokasi, Shift } from '../../types';
import { CameraCaptureModal } from './CameraCaptureModal';

interface EmployeePortalProps {
  currentUser: User;
  kantor: KantorLokasi;
  shift: Shift;
  presensiList: PresensiRecord[];
  onCheckIn: (foto: string, jarakMeter: number, catatan: string) => void;
  onCheckOut: (foto: string, jarakMeter: number) => void;
  pengajuanList: PengajuanIzin[];
  onSubmitPengajuan: (pengajuan: Omit<PengajuanIzin, 'id' | 'created_at' | 'status_approval'>) => void;
  isMobileView: boolean;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({
  currentUser,
  kantor,
  shift,
  presensiList,
  onCheckIn,
  onCheckOut,
  pengajuanList,
  onSubmitPengajuan,
  isMobileView,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'presensi' | 'riwayat' | 'izin'>('presensi');
  
  // Geofence simulation distance (allow user to test being inside radius e.g. 15m or outside e.g. 150m)
  const [simulatedDistance, setSimulatedDistance] = useState<number>(18);
  const isWithinRadius = simulatedDistance <= kantor.radius_meter;

  // Camera modal state
  const [cameraModalOpen, setCameraModalOpen] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'IN' | 'OUT'>('IN');
  const [catatanPresensi, setCatatanPresensi] = useState<string>('');

  // Form Pengajuan Izin
  const [jenisIzin, setJenisIzin] = useState<'IZIN' | 'CUTI_TAHUNAN' | 'SAKIT' | 'DINAS_LUAR'>('IZIN');
  const [tglMulai, setTglMulai] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tglSelesai, setTglSelesai] = useState<string>(new Date().toISOString().split('T')[0]);
  const [alasanIzin, setAlasanIzin] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<boolean>(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = presensiList.find(
    p => p.user_id === currentUser.id && p.tanggal === todayStr
  );

  const myHistory = presensiList.filter(p => p.user_id === currentUser.id);
  const myLeaves = pengajuanList.filter(p => p.user_id === currentUser.id);

  const handleOpenCheckInCamera = () => {
    if (!isWithinRadius) return;
    setCameraMode('IN');
    setCameraModalOpen(true);
  };

  const handleOpenCheckOutCamera = () => {
    if (!isWithinRadius) return;
    setCameraMode('OUT');
    setCameraModalOpen(true);
  };

  const handlePhotoCaptured = (photoUrl: string) => {
    if (cameraMode === 'IN') {
      onCheckIn(photoUrl, simulatedDistance, catatanPresensi);
    } else {
      onCheckOut(photoUrl, simulatedDistance);
    }
  };

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasanIzin.trim()) return;

    // Calculate total days
    const start = new Date(tglMulai);
    const end = new Date(tglSelesai);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    onSubmitPengajuan({
      user_id: currentUser.id,
      user_nama: currentUser.nama_lengkap,
      user_nip: currentUser.nip,
      user_divisi: currentUser.divisi_nama,
      jenis: jenisIzin,
      tanggal_mulai: tglMulai,
      tanggal_selesai: tglSelesai,
      total_hari: totalHari,
      alasan: alasanIzin,
      lampiran_url: jenisIzin === 'SAKIT' ? 'surat_dokter_terverifikasi.pdf' : undefined,
    });

    setAlasanIzin('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const timeFormatted = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateFormatted = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={`space-y-4 ${isMobileView ? 'text-sm' : ''}`}>
      {/* Top Banner / User Quick Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
              {currentUser.foto_url ? (
                <img 
                  src={currentUser.foto_url} 
                  alt={currentUser.nama_lengkap} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                  {currentUser.nama_lengkap}
                </h2>
                <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {currentUser.nip}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.jabatan_nama} · {currentUser.divisi_nama}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">JADWAL SHIFT HARI INI</span>
            <span className="text-xs font-semibold text-slate-800">
              {shift.nama_shift}
            </span>
            <span className="text-[11px] text-emerald-600 block">
              Toleransi: {shift.toleransi_menit} Menit
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Navigation Bar (Buttons with active states per skill guidelines) */}
      <div className="flex p-1 bg-slate-200/70 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('presensi')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'presensi'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Presensi Mandiri
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'riwayat'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Riwayat ({myHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('izin')}
          className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'izin'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Izin & Cuti ({myLeaves.length})
        </button>
      </div>

      {/* TAB 1: PRESENSI MANDIRI (FAST RESPONSE & GEOLOCATION) */}
      {activeTab === 'presensi' && (
        <div className="space-y-4">
          {/* Real-time Clock Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                Waktu Indonesia Barat (WIB)
              </span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Server Synced
              </span>
            </div>

            <div className="my-2">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                {timeFormatted}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 capitalize">
                {dateFormatted}
              </p>
            </div>

            {/* Geofence Radar Status */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className={`w-4 h-4 ${isWithinRadius ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className="text-slate-200">
                  {kantor.nama_kantor}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Jarak:</span>
                <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${
                  isWithinRadius ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {simulatedDistance} meter {isWithinRadius ? '(Di Dalam Radius)' : '(Di Luar Radius)'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Geofence Testing Simulator */}
          <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-lg text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                Simulasi Lokasi GPS Karyawan (Geofence Testing)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Radius Kantor: {kantor.radius_meter}m</span>
            </div>
            <p className="text-slate-500 text-[11px] mb-2">
              Geser slider untuk menguji respon validasi sistem jika karyawan berada di kantor vs di luar jangkauan:
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="200"
                step="5"
                value={simulatedDistance}
                onChange={(e) => setSimulatedDistance(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-1.5 bg-slate-300 rounded-lg"
              />
              <span className="font-mono font-semibold text-slate-800 w-16 text-right">
                {simulatedDistance} m
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <button 
                type="button" 
                onClick={() => setSimulatedDistance(15)} 
                className="underline hover:text-slate-700"
              >
                Set Di Kantor (15m)
              </button>
              <button 
                type="button" 
                onClick={() => setSimulatedDistance(120)} 
                className="underline hover:text-slate-700"
              >
                Set Di Luar (120m)
              </button>
            </div>
          </div>

          {/* Presensi Action Buttons */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Status Presensi Hari Ini</h3>
              {todayRecord ? (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Absen Masuk:</span>
                    <span className="font-mono font-semibold text-slate-900">{todayRecord.jam_masuk || '-'} WIB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Absen Pulang:</span>
                    <span className="font-mono font-semibold text-slate-900">{todayRecord.jam_pulang || 'Belum Pulang'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status Kehadiran:</span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      todayRecord.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                      todayRecord.status === 'TERLAMBAT' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {todayRecord.status} {todayRecord.keterlambatan_menit > 0 && `(+${todayRecord.keterlambatan_menit}m)`}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Anda belum melakukan absensi masuk hari ini. Silakan ambil foto selfie di lokasi kantor.
                </p>
              )}
            </div>

            {/* Optional note */}
            {!todayRecord?.jam_masuk && (
              <div className="mb-3">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Catatan Kehadiran (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bekerja di Divisi Lantai 8..."
                  value={catatanPresensi}
                  onChange={(e) => setCatatanPresensi(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {/* Warnings if outside geofence */}
            {!isWithinRadius && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Di luar jangkauan:</strong> Jarak Anda ({simulatedDistance}m) melebihi batas radius kantor ({kantor.radius_meter}m). Dekati lokasi kantor untuk mengaktifkan tombol absensi.
                </span>
              </div>
            )}

            {/* Big Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!isWithinRadius || !!todayRecord?.jam_masuk}
                onClick={handleOpenCheckInCamera}
                className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  todayRecord?.jam_masuk
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : isWithinRadius
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Camera className="w-4 h-4" />
                {todayRecord?.jam_masuk ? 'Sudah Absen Masuk' : 'Absen Masuk (Check-In)'}
              </button>

              <button
                type="button"
                disabled={!isWithinRadius || !todayRecord?.jam_masuk || !!todayRecord?.jam_pulang}
                onClick={handleOpenCheckOutCamera}
                className={`py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  todayRecord?.jam_pulang
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    : todayRecord?.jam_masuk && isWithinRadius
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Clock className="w-4 h-4" />
                {todayRecord?.jam_pulang ? 'Sudah Absen Pulang' : 'Absen Pulang (Check-Out)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RIWAYAT KEHADIRAN PRIBADI */}
      {activeTab === 'riwayat' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Riwayat Presensi Saya</h3>
              <p className="text-xs text-slate-500">Catatan kehadiran tercatat di sistem</p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
              Total: {myHistory.length} Hari
            </span>
          </div>

          <div className="space-y-2.5">
            {myHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada riwayat presensi.</p>
            ) : (
              myHistory.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-700 shrink-0">
                      {item.tanggal.split('-')[2]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{item.tanggal}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          item.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                          item.status === 'TERLAMBAT' ? 'bg-amber-100 text-amber-800' :
                          'bg-sky-100 text-sky-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {item.catatan || 'Presensi reguler'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px] pl-11 sm:pl-0">
                    <div>
                      <span className="text-slate-400 block text-[10px]">MASUK</span>
                      <span className="font-semibold text-slate-900">{item.jam_masuk || '-'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PULANG</span>
                      <span className="font-semibold text-slate-900">{item.jam_pulang || '-'}</span>
                    </div>
                    {item.keterlambatan_menit > 0 && (
                      <div>
                        <span className="text-amber-500 block text-[10px]">TELAT</span>
                        <span className="font-semibold text-amber-700">{item.keterlambatan_menit}m</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: PENGAJUAN IZIN & CUTI */}
      {activeTab === 'izin' && (
        <div className="space-y-4">
          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pengajuan berhasil dikirimkan ke HRD/Manajemen untuk diverifikasi.</span>
            </div>
          )}

          {/* Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Form Pengajuan Izin / Cuti</h3>
            <p className="text-xs text-slate-500 mb-4">Ajukan permohonan ketidakhadiran kerja secara resmi</p>

            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Jenis Pengajuan:</label>
                <select
                  value={jenisIzin}
                  onChange={(e) => setJenisIzin(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                >
                  <option value="IZIN">Izin Keperluan Pribadi</option>
                  <option value="CUTI_TAHUNAN">Cuti Tahunan</option>
                  <option value="SAKIT">Sakit (Dengan Surat Dokter)</option>
                  <option value="DINAS_LUAR">Tugas Dinas Luar Kantor</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tanggal Mulai:</label>
                  <input
                    type="date"
                    value={tglMulai}
                    onChange={(e) => setTglMulai(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tanggal Selesai:</label>
                  <input
                    type="date"
                    value={tglSelesai}
                    onChange={(e) => setTglSelesai(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Alasan Pengajuan:</label>
                <textarea
                  rows={3}
                  value={alasanIzin}
                  onChange={(e) => setAlasanIzin(e.target.value)}
                  placeholder="Jelaskan keperluan atau keterangan medis dokter..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim Pengajuan ke HRD
              </button>
            </form>
          </div>

          {/* List of Previous Leaves */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Daftar Pengajuan Anda</h3>
            <div className="space-y-2">
              {myLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Belum ada pengajuan izin.</p>
              ) : (
                myLeaves.map(leave => (
                  <div key={leave.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{leave.jenis}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        leave.status_approval === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' :
                        leave.status_approval === 'DITOLAK' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {leave.status_approval}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {leave.tanggal_mulai} s/d {leave.tanggal_selesai} ({leave.total_hari} hari)
                    </p>
                    <p className="text-slate-700 text-xs italic">"{leave.alasan}"</p>
                    {leave.catatan_approval && (
                      <p className="text-[11px] text-sky-800 font-medium pt-1 border-t border-slate-200 mt-1">
                        Catatan HRD ({leave.approved_by_nama}): {leave.catatan_approval}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handlePhotoCaptured}
        title={cameraMode === 'IN' ? 'Foto Selfie Absen Masuk' : 'Foto Selfie Absen Pulang'}
        subtitle="Verifikasi biometrik wajah & kepastian kehadiran fisik"
      />
    </div>
  );
};
