import React, { useState } from 'react';
import { 
  Users, UserPlus, Shield, Settings, Edit3, Trash2, CheckCircle2, 
  AlertCircle, Search, Clock, MapPin, Sliders, History, KeyRound, X
} from 'lucide-react';
import { User, Divisi, Jabatan, Shift, KantorLokasi, PresensiRecord, LogAktivitas, UserRole } from '../../types';

interface AdminPortalProps {
  users: User[];
  divisiList: Divisi[];
  jabatanList: Jabatan[];
  shifts: Shift[];
  kantor: KantorLokasi;
  presensiList: PresensiRecord[];
  logs: LogAktivitas[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (id: number, data: Partial<User>) => void;
  onToggleUserStatus: (id: number) => void;
  onUpdateShift: (shiftId: number, data: Partial<Shift>) => void;
  onUpdateKantor: (data: Partial<KantorLokasi>) => void;
  onKoreksiPresensi: (presensiId: number, jamMasuk: string, status: any, alasan: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  users,
  divisiList,
  jabatanList,
  shifts,
  kantor,
  presensiList,
  logs,
  onAddUser,
  onUpdateUser,
  onToggleUserStatus,
  onUpdateShift,
  onUpdateKantor,
  onKoreksiPresensi,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'absensi' | 'shift' | 'lokasi' | 'logs'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivisi, setSelectedDivisi] = useState('ALL');

  // Modal Tambah User State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserNip, setNewUserNip] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('KARYAWAN');
  const [newUserDivisi, setNewUserDivisi] = useState<number>(divisiList[0]?.id || 1);
  const [newUserJabatan, setNewUserJabatan] = useState<number>(jabatanList[0]?.id || 1);
  const [newUserShift, setNewUserShift] = useState<number>(shifts[0]?.id || 1);

  // Modal Koreksi Presensi State
  const [isKoreksiModalOpen, setIsKoreksiModalOpen] = useState(false);
  const [selectedPresensi, setSelectedPresensi] = useState<PresensiRecord | null>(null);
  const [koreksiJamMasuk, setKoreksiJamMasuk] = useState('08:00:00');
  const [koreksiStatus, setKoreksiStatus] = useState<any>('HADIR');
  const [koreksiAlasan, setKoreksiAlasan] = useState('');

  // Shift Edit State
  const [selectedShift, setSelectedShift] = useState<Shift>(shifts[0]);
  const [shiftSuccessMsg, setShiftSuccessMsg] = useState(false);

  // Kantor Edit State
  const [kantorRadius, setKantorRadius] = useState<number>(kantor.radius_meter);
  const [kantorLat, setKantorLat] = useState<number>(kantor.latitude);
  const [kantorLng, setKantorLng] = useState<number>(kantor.longitude);
  const [kantorSuccessMsg, setKantorSuccessMsg] = useState(false);

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchSearch = u.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDivisi = selectedDivisi === 'ALL' || u.divisi_id.toString() === selectedDivisi;
    return matchSearch && matchDivisi;
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserNip || !newUserName || !newUserEmail) return;

    const divObj = divisiList.find(d => d.id === newUserDivisi);
    const jabObj = jabatanList.find(j => j.id === newUserJabatan);
    const shiftObj = shifts.find(s => s.id === newUserShift);

    onAddUser({
      nip: newUserNip,
      nama_lengkap: newUserName,
      email: newUserEmail,
      no_hp: newUserPhone || '08123456789',
      role: newUserRole,
      divisi_id: newUserDivisi,
      divisi_nama: divObj?.nama_divisi || 'Umum',
      jabatan_id: newUserJabatan,
      jabatan_nama: jabObj?.nama_jabatan || 'Staff',
      shift_id: newUserShift,
      shift_nama: shiftObj?.nama_shift || 'Reguler Pagi',
      foto_url: '',
      status_aktif: true,
      tanggal_bergabung: new Date().toISOString().split('T')[0],
    });

    setIsAddUserModalOpen(false);
    setNewUserNip('');
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
  };

  const handleOpenKoreksi = (record: PresensiRecord) => {
    setSelectedPresensi(record);
    setKoreksiJamMasuk(record.jam_masuk || '08:00:00');
    setKoreksiStatus(record.status || 'HADIR');
    setKoreksiAlasan('');
    setIsKoreksiModalOpen(true);
  };

  const handleSaveKoreksi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPresensi || !koreksiAlasan.trim()) return;

    onKoreksiPresensi(selectedPresensi.id, koreksiJamMasuk, koreksiStatus, koreksiAlasan);
    setIsKoreksiModalOpen(false);
  };

  const handleSaveShiftConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateShift(selectedShift.id, {
      jam_masuk: selectedShift.jam_masuk,
      jam_pulang: selectedShift.jam_pulang,
      toleransi_menit: selectedShift.toleransi_menit,
    });
    setShiftSuccessMsg(true);
    setTimeout(() => setShiftSuccessMsg(false), 3000);
  };

  const handleSaveKantorConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateKantor({
      radius_meter: kantorRadius,
      latitude: kantorLat,
      longitude: kantorLng,
    });
    setKantorSuccessMsg(true);
    setTimeout(() => setKantorSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Stat Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total User Terdaftar</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{users.length}</span>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">
            {users.filter(u => u.status_aktif).length} Aktif
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Unit Kerja / Divisi</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{divisiList.length}</span>
            <Shield className="w-5 h-5 text-sky-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Terstruktur RBAC</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Pola Shift Kerja</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{shifts.length}</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Toleransi 15 Mnt</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Geofence Radius</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{kantor.radius_meter}m</span>
            <MapPin className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">GPS Validated</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-slate-200/70 rounded-lg">
        <button
          onClick={() => setActiveTab('users')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kelola User ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('absensi')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'absensi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kelola & Koreksi Absensi
        </button>
        <button
          onClick={() => setActiveTab('shift')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'shift' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Konfigurasi Shift
        </button>
        <button
          onClick={() => setActiveTab('lokasi')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'lokasi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Geofencing Kantor
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`py-1.5 px-3.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Audit Log Aktivitas ({logs.length})
        </button>
      </div>

      {/* TAB 1: KELOLA USER (CRUD) */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Manajemen Pengguna (User Management)</h3>
              <p className="text-xs text-slate-500">Kelola NIP, nama, peran (RBAC), unit kerja, dan hak akses</p>
            </div>
            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="py-2 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Tambah Karyawan Baru
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, NIP, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedDivisi}
              onChange={(e) => setSelectedDivisi(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">Semua Divisi</option>
              {divisiList.map(d => (
                <option key={d.id} value={d.id.toString()}>{d.nama_divisi}</option>
              ))}
            </select>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">NIP</th>
                  <th className="py-2.5 px-3">Nama Karyawan</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Divisi & Jabatan</th>
                  <th className="py-2.5 px-3">Shift</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900">{user.nip}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{user.nama_lengkap}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'HRD_MANAJEMEN' ? 'bg-sky-100 text-sky-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-medium">{user.divisi_nama}</div>
                      <div className="text-[11px] text-slate-500">{user.jabatan_nama}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">{user.shift_nama}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        user.status_aktif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status_aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        title={user.status_aktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        className={`p-1.5 rounded hover:bg-slate-200 transition-colors ${
                          user.status_aktif ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {user.status_aktif ? <Trash2 className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: KELOLA ABSENSI (KOREKSI MANUAL) */}
      {activeTab === 'absensi' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Kelola Log Presensi & Koreksi Kehadiran</h3>
            <p className="text-xs text-slate-500">
              Admin dapat melakukan koreksi manual jika karyawan mengalami kendala perangkat atau tugas mendadak
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Karyawan</th>
                  <th className="py-2.5 px-3">Divisi</th>
                  <th className="py-2.5 px-3">Masuk</th>
                  <th className="py-2.5 px-3">Pulang</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Catatan / Koreksi</th>
                  <th className="py-2.5 px-3 text-center">Koreksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {presensiList.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono">{record.tanggal}</td>
                    <td className="py-2 px-3">
                      <div className="font-semibold text-slate-900">{record.user_nama}</div>
                      <div className="text-[11px] font-mono text-slate-500">{record.user_nip}</div>
                    </td>
                    <td className="py-2 px-3 text-slate-600">{record.user_divisi}</td>
                    <td className="py-2 px-3 font-mono">{record.jam_masuk || '-'}</td>
                    <td className="py-2 px-3 font-mono">{record.jam_pulang || '-'}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        record.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                        record.status === 'TERLAMBAT' ? 'bg-amber-100 text-amber-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600">
                      {record.koreksi_manual_oleh ? (
                        <span className="text-purple-700 font-medium">
                          [Dikoreksi {record.koreksi_manual_oleh}: {record.koreksi_alasan}]
                        </span>
                      ) : (
                        record.catatan || '-'
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => handleOpenKoreksi(record)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
                        title="Koreksi Data Presensi"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: KONFIGURASI SHIFT */}
      {activeTab === 'shift' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs max-w-xl">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Konfigurasi Jadwal Shift Kerja</h3>
          <p className="text-xs text-slate-500 mb-4">Atur batas jam masuk, jam kepulangan, dan grace period keterlambatan</p>

          {shiftSuccessMsg && (
            <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pengaturan jam shift kerja berhasil diperbarui.</span>
            </div>
          )}

          <form onSubmit={handleSaveShiftConfig} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Pilih Shift:</label>
              <select
                value={selectedShift.id}
                onChange={(e) => {
                  const s = shifts.find(item => item.id === Number(e.target.value));
                  if (s) setSelectedShift(s);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>{s.nama_shift}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Jam Masuk Kerja:</label>
                <input
                  type="time"
                  value={selectedShift.jam_masuk}
                  onChange={(e) => setSelectedShift({ ...selectedShift, jam_masuk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Jam Pulang Kerja:</label>
                <input
                  type="time"
                  value={selectedShift.jam_pulang}
                  onChange={(e) => setSelectedShift({ ...selectedShift, jam_pulang: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Toleransi Keterlambatan (Menit):
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={selectedShift.toleransi_menit}
                onChange={(e) => setSelectedShift({ ...selectedShift, toleransi_menit: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Karyawan yang absen masuk setelah jam masuk + toleransi akan ditandai berstatus TERLAMBAT.
              </span>
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              Simpan Konfigurasi Shift
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: GEOFENCING KANTOR */}
      {activeTab === 'lokasi' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs max-w-xl">
          <h3 className="font-bold text-slate-900 text-sm mb-1">Konfigurasi Geofencing Titik Kantor</h3>
          <p className="text-xs text-slate-500 mb-4">
            Tentukan koordinat GPS dan batas toleransi jarak absensi (Radius Geofence)
          </p>

          {kantorSuccessMsg && (
            <div className="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Titik lokasi kantor & radius geofencing berhasil disimpan.</span>
            </div>
          )}

          <form onSubmit={handleSaveKantorConfig} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Nama Kantor:</label>
              <input
                type="text"
                disabled
                value={kantor.nama_kantor}
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Latitude:</label>
                <input
                  type="number"
                  step="0.0000001"
                  value={kantorLat}
                  onChange={(e) => setKantorLat(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Longitude:</label>
                <input
                  type="number"
                  step="0.0000001"
                  value={kantorLng}
                  onChange={(e) => setKantorLng(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">
                Batas Radius Geofencing (Meter):
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={kantorRadius}
                onChange={(e) => setKantorRadius(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Karyawan hanya dapat check-in jika berada di dalam radius lingkaran {kantorRadius} meter dari titik koordinat.
              </span>
            </div>

            <button
              type="submit"
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              Simpan Radius Geofence
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Audit Trail & Log Keamanan Sistem</h3>
            <p className="text-xs text-slate-500">Mencatat riwayat aktivitas pengguna, perubahan data, dan IP address</p>
          </div>

          <div className="space-y-2">
            {logs.map(log => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.user_nama}</span>
                    <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                      {log.aksi}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{log.detail}</p>
                </div>
                <div className="text-right text-[11px] font-mono text-slate-400 shrink-0">
                  <div>{log.waktu}</div>
                  <div>IP: {log.ip_address}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL TAMBAH USER BARU */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Tambah Karyawan Baru</h3>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">NIP (Nomor Induk):</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: KRY-1030"
                    value={newUserNip}
                    onChange={(e) => setNewUserNip(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nama Lengkap:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Karyawan..."
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Email Perusahaan:</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@perusahaan.co.id"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Nomor WhatsApp:</label>
                  <input
                    type="tel"
                    placeholder="08123456789"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Hak Akses (Role):</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="KARYAWAN">KARYAWAN</option>
                    <option value="HRD_MANAJEMEN">HRD / MANAJEMEN</option>
                    <option value="ADMIN">ADMINISTRATOR</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Divisi Kerja:</label>
                  <select
                    value={newUserDivisi}
                    onChange={(e) => setNewUserDivisi(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {divisiList.map(d => (
                      <option key={d.id} value={d.id}>{d.nama_divisi}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Jabatan:</label>
                  <select
                    value={newUserJabatan}
                    onChange={(e) => setNewUserJabatan(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {jabatanList.map(j => (
                      <option key={j.id} value={j.id}>{j.nama_jabatan}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Pola Shift:</label>
                  <select
                    value={newUserShift}
                    onChange={(e) => setNewUserShift(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {shifts.map(s => (
                      <option key={s.id} value={s.id}>{s.nama_shift}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-xs"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KOREKSI PRESENSI */}
      {isKoreksiModalOpen && selectedPresensi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Koreksi Manual Presensi</h3>
              <button 
                onClick={() => setIsKoreksiModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKoreksi} className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-bold text-slate-800">{selectedPresensi.user_nama}</p>
                <p className="text-[11px] text-slate-500">NIP: {selectedPresensi.user_nip} · Tgl: {selectedPresensi.tanggal}</p>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Jam Masuk (Revisi):</label>
                <input
                  type="time"
                  value={koreksiJamMasuk}
                  onChange={(e) => setKoreksiJamMasuk(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Status Kehadiran:</label>
                <select
                  value={koreksiStatus}
                  onChange={(e) => setKoreksiStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="HADIR">HADIR</option>
                  <option value="TERLAMBAT">TERLAMBAT</option>
                  <option value="IZIN">IZIN</option>
                  <option value="SAKIT">SAKIT</option>
                  <option value="ALPA">ALPA</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Alasan Koreksi Manual (Wajib Audit):</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: Karyawan tugas luar mendadak tanpa akses HP..."
                  value={koreksiAlasan}
                  onChange={(e) => setKoreksiAlasan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsKoreksiModalOpen(false)}
                  className="flex-1 py-2 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Simpan Koreksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
