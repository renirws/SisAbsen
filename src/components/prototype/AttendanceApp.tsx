import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Monitor, Shield, Users, UserCheck, 
  FileText, Database, CheckCircle2, AlertCircle, LogOut, Sparkles
} from 'lucide-react';
import { 
  User, Divisi, Jabatan, Shift, KantorLokasi, PresensiRecord, 
  PengajuanIzin, LogAktivitas, UserRole 
} from '../../types';
import { 
  INITIAL_USERS, INITIAL_DIVISI, INITIAL_JABATAN, 
  INITIAL_SHIFTS, INITIAL_KANTOR, INITIAL_PRESENSI, 
  INITIAL_PENGAJUAN, INITIAL_LOGS 
} from '../../data/mockData';
import { EmployeePortal } from './EmployeePortal';
import { AdminPortal } from './AdminPortal';
import { HrdPortal } from './HrdPortal';
import { PRDViewer } from '../prd/PRDViewer';
import { DatabaseExplorer } from '../database/DatabaseExplorer';

export const AttendanceApp: React.FC = () => {
  // Main view state
  const [mainTab, setMainTab] = useState<'app' | 'prd' | 'database'>('app');
  
  // Viewport simulator for mobile vs desktop
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);

  // Persistence State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('siabsensi_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [divisiList] = useState<Divisi[]>(INITIAL_DIVISI);
  const [jabatanList] = useState<Jabatan[]>(INITIAL_JABATAN);
  
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem('siabsensi_shifts');
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [kantor, setKantor] = useState<KantorLokasi>(() => {
    const saved = localStorage.getItem('siabsensi_kantor');
    return saved ? JSON.parse(saved) : INITIAL_KANTOR;
  });

  const [presensiList, setPresensiList] = useState<PresensiRecord[]>(() => {
    const saved = localStorage.getItem('siabsensi_presensi');
    return saved ? JSON.parse(saved) : INITIAL_PRESENSI;
  });

  const [pengajuanList, setPengajuanList] = useState<PengajuanIzin[]>(() => {
    const saved = localStorage.getItem('siabsensi_pengajuan');
    return saved ? JSON.parse(saved) : INITIAL_PENGAJUAN;
  });

  const [logs, setLogs] = useState<LogAktivitas[]>(() => {
    const saved = localStorage.getItem('siabsensi_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  // Current logged in user (default to Karyawan Budi Santoso)
  const [currentUserId, setCurrentUserId] = useState<number>(2);
  const currentUser = users.find(u => u.id === currentUserId) || users[1];

  // Fast response feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('siabsensi_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('siabsensi_shifts', JSON.stringify(shifts));
  }, [shifts]);
  useEffect(() => {
    localStorage.setItem('siabsensi_kantor', JSON.stringify(kantor));
  }, [kantor]);
  useEffect(() => {
    localStorage.setItem('siabsensi_presensi', JSON.stringify(presensiList));
  }, [presensiList]);
  useEffect(() => {
    localStorage.setItem('siabsensi_pengajuan', JSON.stringify(pengajuanList));
  }, [pengajuanList]);
  useEffect(() => {
    localStorage.setItem('siabsensi_logs', JSON.stringify(logs));
  }, [logs]);

  // Handle Check-In
  const handleCheckIn = (fotoUrl: string, jarakMeter: number, catatan: string) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0]; // "HH:mm:ss"

    const userShift = shifts.find(s => s.id === currentUser.shift_id) || shifts[0];
    const [targetHour, targetMin] = userShift.jam_masuk.split(':').map(Number);
    const limitMin = targetHour * 60 + targetMin + userShift.toleransi_menit;
    const currentMinTotal = now.getHours() * 60 + now.getMinutes();

    let statusKehadiran: any = 'HADIR';
    let keterlambatanMenit = 0;

    if (currentMinTotal > limitMin) {
      statusKehadiran = 'TERLAMBAT';
      keterlambatanMenit = currentMinTotal - limitMin;
    }

    const newRecord: PresensiRecord = {
      id: Date.now(),
      user_id: currentUser.id,
      user_nip: currentUser.nip,
      user_nama: currentUser.nama_lengkap,
      user_divisi: currentUser.divisi_nama,
      tanggal: todayStr,
      jam_masuk: timeStr,
      jam_pulang: null,
      status: statusKehadiran,
      foto_masuk: fotoUrl,
      foto_pulang: null,
      lat_masuk: kantor.latitude,
      long_masuk: kantor.longitude,
      lat_pulang: null,
      long_pulang: null,
      jarak_masuk_meter: jarakMeter,
      jarak_pulang_meter: null,
      keterlambatan_menit: keterlambatanMenit,
      pulang_cepat_menit: 0,
      catatan: catatan || (statusKehadiran === 'TERLAMBAT' ? `Terlambat ${keterlambatanMenit} menit` : 'Tepat waktu'),
    };

    setPresensiList([newRecord, ...presensiList.filter(p => !(p.user_id === currentUser.id && p.tanggal === todayStr))]);

    // Add log
    const newLog: LogAktivitas = {
      id: Date.now(),
      user_nama: currentUser.nama_lengkap,
      role: currentUser.role,
      aksi: 'PRESENSI_CHECK_IN',
      detail: `Check-in berhasil (${timeStr} WIB) status: ${statusKehadiran} - Jarak: ${jarakMeter}m`,
      waktu: `${todayStr} ${timeStr}`,
      ip_address: '180.252.164.21',
    };
    setLogs([newLog, ...logs]);

    showToast(`Check-In berhasil! Status: ${statusKehadiran} (${timeStr} WIB)`);
  };

  // Handle Check-Out
  const handleCheckOut = (fotoUrl: string, jarakMeter: number) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(' ')[0];

    const updated = presensiList.map(p => {
      if (p.user_id === currentUser.id && p.tanggal === todayStr) {
        return {
          ...p,
          jam_pulang: timeStr,
          foto_pulang: fotoUrl,
          jarak_pulang_meter: jarakMeter,
          lat_pulang: kantor.latitude,
          long_pulang: kantor.longitude,
        };
      }
      return p;
    });

    setPresensiList(updated);

    const newLog: LogAktivitas = {
      id: Date.now(),
      user_nama: currentUser.nama_lengkap,
      role: currentUser.role,
      aksi: 'PRESENSI_CHECK_OUT',
      detail: `Check-out berhasil (${timeStr} WIB) - Jarak: ${jarakMeter}m`,
      waktu: `${todayStr} ${timeStr}`,
      ip_address: '180.252.164.21',
    };
    setLogs([newLog, ...logs]);

    showToast(`Check-Out berhasil tercatat (${timeStr} WIB). Selamat beristirahat!`);
  };

  // Handle Leave Submission (Employee)
  const handleSubmitPengajuan = (item: Omit<PengajuanIzin, 'id' | 'created_at' | 'status_approval'>) => {
    const newPengajuan: PengajuanIzin = {
      ...item,
      id: Date.now(),
      status_approval: 'PENDING',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setPengajuanList([newPengajuan, ...pengajuanList]);

    showToast(`Pengajuan ${item.jenis} berhasil diajukan ke HRD.`);
  };

  // Handle HRD Approval
  const handleApproveIzin = (pengajuanId: number, isApproved: boolean, catatan: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updated = pengajuanList.map(p => {
      if (p.id === pengajuanId) {
        return {
          ...p,
          status_approval: isApproved ? ('DISETUJUI' as const) : ('DITOLAK' as const),
          approved_by_nama: currentUser.nama_lengkap,
          approved_at: nowStr,
          catatan_approval: catatan,
        };
      }
      return p;
    });
    setPengajuanList(updated);

    const targetLeave = pengajuanList.find(p => p.id === pengajuanId);
    const newLog: LogAktivitas = {
      id: Date.now(),
      user_nama: currentUser.nama_lengkap,
      role: currentUser.role,
      aksi: isApproved ? 'APPROVE_IZIN' : 'REJECT_IZIN',
      detail: `${isApproved ? 'Menyetujui' : 'Menolak'} pengajuan ${targetLeave?.jenis} oleh ${targetLeave?.user_nama}`,
      waktu: nowStr,
      ip_address: '10.0.12.54',
    };
    setLogs([newLog, ...logs]);

    showToast(`Pengajuan izin ${isApproved ? 'DISETUJUI' : 'DITOLAK'}.`);
  };

  // Handle Add User (Admin)
  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...newUserData,
      id: Date.now(),
    };
    setUsers([...users, newUser]);

    const newLog: LogAktivitas = {
      id: Date.now(),
      user_nama: currentUser.nama_lengkap,
      role: 'ADMIN',
      aksi: 'CREATE_USER',
      detail: `Menambahkan karyawan baru: ${newUser.nama_lengkap} (${newUser.nip})`,
      waktu: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip_address: '10.0.12.1',
    };
    setLogs([newLog, ...logs]);

    showToast(`Karyawan baru ${newUser.nama_lengkap} berhasil ditambahkan.`);
  };

  // Handle Update User (Admin)
  const handleUpdateUser = (id: number, data: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
    showToast('Data pengguna berhasil diperbarui.');
  };

  // Handle Toggle User Status (Admin)
  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = !u.status_aktif;
        showToast(`Status pengguna ${u.nama_lengkap} diubah menjadi ${nextStatus ? 'Aktif' : 'Nonaktif'}.`);
        return { ...u, status_aktif: nextStatus };
      }
      return u;
    }));
  };

  // Handle Update Shift (Admin)
  const handleUpdateShift = (shiftId: number, data: Partial<Shift>) => {
    setShifts(shifts.map(s => s.id === shiftId ? { ...s, ...data } : s));
    showToast('Konfigurasi shift berhasil disimpan.');
  };

  // Handle Update Kantor (Admin)
  const handleUpdateKantor = (data: Partial<KantorLokasi>) => {
    setKantor({ ...kantor, ...data });
    showToast('Radius geofencing dan titik koordinat kantor diperbarui.');
  };

  // Handle Koreksi Presensi (Admin)
  const handleKoreksiPresensi = (presensiId: number, jamMasuk: string, status: any, alasan: string) => {
    setPresensiList(presensiList.map(p => {
      if (p.id === presensiId) {
        return {
          ...p,
          jam_masuk: jamMasuk,
          status,
          koreksi_manual_oleh: currentUser.nama_lengkap,
          koreksi_alasan: alasan,
        };
      }
      return p;
    }));

    const newLog: LogAktivitas = {
      id: Date.now(),
      user_nama: currentUser.nama_lengkap,
      role: 'ADMIN',
      aksi: 'KOREKSI_PRESENSI',
      detail: `Koreksi presensi ID ${presensiId}: Jam ${jamMasuk}, Status ${status}. Alasan: ${alasan}`,
      waktu: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ip_address: '10.0.12.1',
    };
    setLogs([newLog, ...logs]);

    showToast('Koreksi presensi berhasil disimpan.');
  };

  // Export to CSV Function
  const handleExportCsv = (recordsToExport: PresensiRecord[]) => {
    const headers = ['No', 'Tanggal', 'NIP', 'Nama Karyawan', 'Divisi', 'Jam Masuk', 'Jam Pulang', 'Keterlambatan (Menit)', 'Status', 'Catatan'];
    const rows = recordsToExport.map((r, i) => [
      i + 1,
      r.tanggal,
      r.user_nip,
      `"${r.user_nama}"`,
      `"${r.user_divisi}"`,
      r.jam_masuk || '-',
      r.jam_pulang || '-',
      r.keterlambatan_menit || 0,
      r.status,
      `"${r.catatan || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Presensi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Data kehadiran berhasil diekspor ke format CSV.');
  };

  const activeRoleBadge = currentUser.role === 'ADMIN' ? 'bg-purple-600' :
                         currentUser.role === 'HRD_MANAJEMEN' ? 'bg-sky-600' : 'bg-emerald-600';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract (One-row, 3-zone contract as per skill instructions) */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2">
            <a href="/" className="text-lg font-bold tracking-tight text-slate-950 flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                SI
              </span>
              <span>SIAbsensi</span>
            </a>
            <span className="text-xs text-slate-400 hidden md:inline">· Sistem Informasi Absensi</span>
          </div>

          {/* Zone 2: Navigation Links (Clean Segmented Tabs) */}
          <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setMainTab('app')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                mainTab === 'app'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Simulasi Aplikasi
            </button>
            <button
              onClick={() => setMainTab('prd')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                mainTab === 'prd'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dokumen PRD
            </button>
            <button
              onClick={() => setMainTab('database')}
              className={`py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                mainTab === 'database'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Struktur Database (3NF)
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Viewport Switcher + Role Selector) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Viewport switcher only active in 'app' mode */}
            {mainTab === 'app' && (
              <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsMobileViewport(false)}
                  title="Tampilan Desktop Browser"
                  className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                    !isMobileViewport ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px]">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileViewport(true)}
                  title="Tampilan Smartphone (Mobile View)"
                  className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors ${
                    isMobileViewport ? 'bg-white text-slate-900 shadow-xs font-medium' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[11px]">Smartphone</span>
                </button>
              </div>
            )}

            {/* Role Switcher Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 font-medium hidden md:inline">Peran:</span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setCurrentUserId(id);
                  const selected = users.find(u => u.id === id);
                  if (selected) {
                    showToast(`Beralih ke akun ${selected.nama_lengkap} (${selected.role})`);
                  }
                }}
                className="py-1 px-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 max-w-[170px] sm:max-w-none"
              >
                <optgroup label="Karyawan (Absensi Mandiri)">
                  <option value={2}>Budi Santoso (Karyawan IT)</option>
                  <option value={4}>Siti Rahmawati (Karyawan Keuangan)</option>
                  <option value={5}>Ahmad Fauzi (Karyawan Ops)</option>
                </optgroup>
                <optgroup label="Manajemen / Divisi HRD">
                  <option value={3}>Reni Wulandari, S.Psi (HRD / Manajemen)</option>
                </optgroup>
                <optgroup label="Administrator Sistem">
                  <option value={1}>Dimas Pratama (Admin Sistem)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* VIEW 1: PRD DOCUMENT */}
        {mainTab === 'prd' && <PRDViewer />}

        {/* VIEW 2: DATABASE & ERD EXPLORER */}
        {mainTab === 'database' && <DatabaseExplorer />}

        {/* VIEW 3: LIVE APP PROTOTYPE (DESKTOP OR SMARTPHONE FRAME) */}
        {mainTab === 'app' && (
          <div className="space-y-4">
            {/* Context Notice / Role Bar */}
            <div className="no-print bg-white border border-slate-200 rounded-xl p-3 px-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${activeRoleBadge}`}></span>
                <span className="text-slate-500">Sedang Login Sebagai:</span>
                <strong className="text-slate-900">{currentUser.nama_lengkap}</strong>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                  {currentUser.role}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">{currentUser.divisi_nama}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-[11px]">
                  Mode: <strong>{isMobileViewport ? 'Smartphone (Touch Emulated)' : 'Desktop Browser'}</strong>
                </span>
                <button
                  onClick={() => setIsMobileViewport(!isMobileViewport)}
                  className="sm:hidden text-indigo-600 font-semibold underline text-[11px]"
                >
                  Ganti View
                </button>
              </div>
            </div>

            {/* Container Rendering: Smartphone Frame vs Full Desktop */}
            {isMobileViewport ? (
              <div className="flex justify-center py-4">
                {/* Smartphone Device Mockup Housing */}
                <div className="w-[390px] max-w-full bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700">
                  {/* Smartphone Top Notch & Dynamic Island */}
                  <div className="relative pt-2 pb-3 px-6 flex items-center justify-between text-white text-[11px] font-mono">
                    <span>09:41</span>
                    <div className="w-20 h-4 bg-slate-900 rounded-full border border-slate-800 mx-auto"></div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span>5G</span>
                      <span className="w-4 h-2 bg-emerald-400 rounded-xs inline-block"></span>
                    </div>
                  </div>

                  {/* Smartphone Screen Viewport */}
                  <div className="bg-slate-50 rounded-[32px] overflow-y-auto max-h-[750px] p-3.5 text-slate-900">
                    {currentUser.role === 'KARYAWAN' && (
                      <EmployeePortal
                        currentUser={currentUser}
                        kantor={kantor}
                        shift={shifts.find(s => s.id === currentUser.shift_id) || shifts[0]}
                        presensiList={presensiList}
                        onCheckIn={handleCheckIn}
                        onCheckOut={handleCheckOut}
                        pengajuanList={pengajuanList}
                        onSubmitPengajuan={handleSubmitPengajuan}
                        isMobileView={true}
                      />
                    )}

                    {currentUser.role === 'ADMIN' && (
                      <AdminPortal
                        users={users}
                        divisiList={divisiList}
                        jabatanList={jabatanList}
                        shifts={shifts}
                        kantor={kantor}
                        presensiList={presensiList}
                        logs={logs}
                        onAddUser={handleAddUser}
                        onUpdateUser={handleUpdateUser}
                        onToggleUserStatus={handleToggleUserStatus}
                        onUpdateShift={handleUpdateShift}
                        onUpdateKantor={handleUpdateKantor}
                        onKoreksiPresensi={handleKoreksiPresensi}
                      />
                    )}

                    {currentUser.role === 'HRD_MANAJEMEN' && (
                      <HrdPortal
                        currentUser={currentUser}
                        divisiList={divisiList}
                        presensiList={presensiList}
                        pengajuanList={pengajuanList}
                        onApproveIzin={handleApproveIzin}
                        onExportCsv={handleExportCsv}
                      />
                    )}
                  </div>

                  {/* Smartphone Bottom Home Bar */}
                  <div className="py-2 flex justify-center">
                    <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Layout */
              <div>
                {currentUser.role === 'KARYAWAN' && (
                  <EmployeePortal
                    currentUser={currentUser}
                    kantor={kantor}
                    shift={shifts.find(s => s.id === currentUser.shift_id) || shifts[0]}
                    presensiList={presensiList}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    pengajuanList={pengajuanList}
                    onSubmitPengajuan={handleSubmitPengajuan}
                    isMobileView={false}
                  />
                )}

                {currentUser.role === 'ADMIN' && (
                  <AdminPortal
                    users={users}
                    divisiList={divisiList}
                    jabatanList={jabatanList}
                    shifts={shifts}
                    kantor={kantor}
                    presensiList={presensiList}
                    logs={logs}
                    onAddUser={handleAddUser}
                    onUpdateUser={handleUpdateUser}
                    onToggleUserStatus={handleToggleUserStatus}
                    onUpdateShift={handleUpdateShift}
                    onUpdateKantor={handleUpdateKantor}
                    onKoreksiPresensi={handleKoreksiPresensi}
                  />
                )}

                {currentUser.role === 'HRD_MANAJEMEN' && (
                  <HrdPortal
                    currentUser={currentUser}
                    divisiList={divisiList}
                    presensiList={presensiList}
                    pengajuanList={pengajuanList}
                    onApproveIzin={handleApproveIzin}
                    onExportCsv={handleExportCsv}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-4 px-6 text-center text-xs text-slate-500">
        <p>
          Sistem Informasi Absensi & PRD System Analyst · Dirancang untuk Web & Smartphone (Fast Response & Normalized 3NF Database)
        </p>
      </footer>
    </div>
  );
};
