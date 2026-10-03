import { User, Divisi, Jabatan, Shift, KantorLokasi, PresensiRecord, PengajuanIzin, LogAktivitas } from '../types';

export const INITIAL_DIVISI: Divisi[] = [
  { id: 1, kode_divisi: 'DIV-HRD', nama_divisi: 'Human Resources & GA', kepala_divisi: 'Reni Wulandari, S.Psi' },
  { id: 2, kode_divisi: 'DIV-TECH', nama_divisi: 'IT & Software Engineering', kepala_divisi: 'Fajar Nugraha, M.Kom' },
  { id: 3, kode_divisi: 'DIV-FIN', nama_divisi: 'Keuangan & Akuntansi', kepala_divisi: 'Hendro Wijaya, S.E.' },
  { id: 4, kode_divisi: 'DIV-OPS', nama_divisi: 'Operasional & Logistik', kepala_divisi: 'Bambang Triyono' },
];

export const INITIAL_JABATAN: Jabatan[] = [
  { id: 1, nama_jabatan: 'HR Manager', level: 'Managerial' },
  { id: 2, nama_jabatan: 'System Administrator', level: 'Specialist' },
  { id: 3, nama_jabatan: 'Software Engineer', level: 'Staff' },
  { id: 4, nama_jabatan: 'Accounting Specialist', level: 'Staff' },
  { id: 5, nama_jabatan: 'Operations Officer', level: 'Staff' },
];

export const INITIAL_SHIFTS: Shift[] = [
  { id: 1, nama_shift: 'Reguler Pagi (08:00 - 17:00)', jam_masuk: '08:00', jam_pulang: '17:00', toleransi_menit: 15, hari_kerja: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] },
  { id: 2, nama_shift: 'Shift Siang (13:00 - 21:00)', jam_masuk: '13:00', jam_pulang: '21:00', toleransi_menit: 15, hari_kerja: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'] },
];

export const INITIAL_KANTOR: KantorLokasi = {
  id: 1,
  nama_kantor: 'Kantor Pusat Menara Sudirman',
  latitude: -6.2087634,
  longitude: 106.8455990,
  radius_meter: 60,
  alamat: 'Jl. Jend. Sudirman Kav. 28, Karet Semanggi, Setiabudi, Jakarta Selatan',
};

export const INITIAL_USERS: User[] = [
  {
    id: 1,
    nip: 'ADM-001',
    nama_lengkap: 'Dimas Pratama (Admin)',
    email: 'admin@perusahaan.co.id',
    role: 'ADMIN',
    divisi_id: 2,
    divisi_nama: 'IT & Software Engineering',
    jabatan_id: 2,
    jabatan_nama: 'System Administrator',
    shift_id: 1,
    shift_nama: 'Reguler Pagi (08:00 - 17:00)',
    no_hp: '081288990011',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    status_aktif: true,
    tanggal_bergabung: '2023-01-15'
  },
  {
    id: 2,
    nip: 'KRY-1021',
    nama_lengkap: 'Budi Santoso',
    email: 'budi.santoso@perusahaan.co.id',
    role: 'KARYAWAN',
    divisi_id: 2,
    divisi_nama: 'IT & Software Engineering',
    jabatan_id: 3,
    jabatan_nama: 'Software Engineer',
    shift_id: 1,
    shift_nama: 'Reguler Pagi (08:00 - 17:00)',
    no_hp: '081399881122',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    status_aktif: true,
    tanggal_bergabung: '2023-06-01'
  },
  {
    id: 3,
    nip: 'HRD-005',
    nama_lengkap: 'Reni Wulandari, S.Psi',
    email: 'reni.hrd@perusahaan.co.id',
    role: 'HRD_MANAJEMEN',
    divisi_id: 1,
    divisi_nama: 'Human Resources & GA',
    jabatan_id: 1,
    jabatan_nama: 'HR Manager',
    shift_id: 1,
    shift_nama: 'Reguler Pagi (08:00 - 17:00)',
    no_hp: '081122334455',
    foto_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    status_aktif: true,
    tanggal_bergabung: '2022-03-10'
  },
  {
    id: 4,
    nip: 'KRY-1022',
    nama_lengkap: 'Siti Rahmawati',
    email: 'siti.rahma@perusahaan.co.id',
    role: 'KARYAWAN',
    divisi_id: 3,
    divisi_nama: 'Keuangan & Akuntansi',
    jabatan_id: 4,
    jabatan_nama: 'Accounting Specialist',
    shift_id: 1,
    shift_nama: 'Reguler Pagi (08:00 - 17:00)',
    no_hp: '081233445566',
    foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    status_aktif: true,
    tanggal_bergabung: '2023-09-12'
  },
  {
    id: 5,
    nip: 'KRY-1023',
    nama_lengkap: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@perusahaan.co.id',
    role: 'KARYAWAN',
    divisi_id: 4,
    divisi_nama: 'Operasional & Logistik',
    jabatan_id: 5,
    jabatan_nama: 'Operations Officer',
    shift_id: 2,
    shift_nama: 'Shift Siang (13:00 - 21:00)',
    no_hp: '085299112233',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    status_aktif: true,
    tanggal_bergabung: '2024-01-08'
  }
];

export const INITIAL_PRESENSI: PresensiRecord[] = [
  {
    id: 1,
    user_id: 2, // Budi Santoso
    user_nip: 'KRY-1021',
    user_nama: 'Budi Santoso',
    user_divisi: 'IT & Software Engineering',
    tanggal: '2026-10-02',
    jam_masuk: '07:52:14',
    jam_pulang: null,
    status: 'HADIR',
    foto_masuk: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23e2e8f0"/><circle cx="60" cy="50" r="25" fill="%2394a3b8"/><circle cx="60" cy="115" r="45" fill="%2394a3b8"/></svg>',
    foto_pulang: null,
    lat_masuk: -6.20875,
    long_masuk: 106.84558,
    lat_pulang: null,
    long_pulang: null,
    jarak_masuk_meter: 12,
    jarak_pulang_meter: null,
    keterlambatan_menit: 0,
    pulang_cepat_menit: 0,
    catatan: 'Hadir on-time di kantor lt. 8'
  },
  {
    id: 2,
    user_id: 4, // Siti Rahmawati
    user_nip: 'KRY-1022',
    user_nama: 'Siti Rahmawati',
    user_divisi: 'Keuangan & Akuntansi',
    tanggal: '2026-10-02',
    jam_masuk: '08:24:10',
    jam_pulang: null,
    status: 'TERLAMBAT',
    foto_masuk: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23fed7aa"/><circle cx="60" cy="50" r="25" fill="%23f97316"/><circle cx="60" cy="115" r="45" fill="%23f97316"/></svg>',
    foto_pulang: null,
    lat_masuk: -6.20880,
    long_masuk: 106.84562,
    lat_pulang: null,
    long_pulang: null,
    jarak_masuk_meter: 24,
    jarak_pulang_meter: null,
    keterlambatan_menit: 9, // melewati toleransi 15 mnt (08:15)
    pulang_cepat_menit: 0,
    catatan: 'Terjebak macet hujan deras di Tebet'
  },
  {
    id: 3,
    user_id: 5, // Ahmad Fauzi
    user_nip: 'KRY-1023',
    user_nama: 'Ahmad Fauzi',
    user_divisi: 'Operasional & Logistik',
    tanggal: '2026-10-02',
    jam_masuk: null,
    jam_pulang: null,
    status: 'IZIN',
    foto_masuk: null,
    foto_pulang: null,
    lat_masuk: null,
    long_masuk: null,
    lat_pulang: null,
    long_pulang: null,
    jarak_masuk_meter: null,
    jarak_pulang_meter: null,
    keterlambatan_menit: 0,
    pulang_cepat_menit: 0,
    catatan: 'Izin mengurus perpanjangan SIM & KTP (Disetujui HRD)'
  },
  {
    id: 4,
    user_id: 2, // Budi Santoso (Kemarin)
    user_nip: 'KRY-1021',
    user_nama: 'Budi Santoso',
    user_divisi: 'IT & Software Engineering',
    tanggal: '2026-10-01',
    jam_masuk: '07:55:00',
    jam_pulang: '17:15:30',
    status: 'HADIR',
    foto_masuk: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23e2e8f0"/><circle cx="60" cy="50" r="25" fill="%2394a3b8"/><circle cx="60" cy="115" r="45" fill="%2394a3b8"/></svg>',
    foto_pulang: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23e2e8f0"/><circle cx="60" cy="50" r="25" fill="%2394a3b8"/><circle cx="60" cy="115" r="45" fill="%2394a3b8"/></svg>',
    lat_masuk: -6.20875,
    long_masuk: 106.84558,
    lat_pulang: -6.20876,
    long_pulang: 106.84559,
    jarak_masuk_meter: 15,
    jarak_pulang_meter: 18,
    keterlambatan_menit: 0,
    pulang_cepat_menit: 0,
    catatan: 'Hari kerja reguler'
  },
  {
    id: 5,
    user_id: 4, // Siti Rahmawati (Kemarin)
    user_nip: 'KRY-1022',
    user_nama: 'Siti Rahmawati',
    user_divisi: 'Keuangan & Akuntansi',
    tanggal: '2026-10-01',
    jam_masuk: '07:58:12',
    jam_pulang: '17:02:40',
    status: 'HADIR',
    foto_masuk: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23fed7aa"/><circle cx="60" cy="50" r="25" fill="%23f97316"/><circle cx="60" cy="115" r="45" fill="%23f97316"/></svg>',
    foto_pulang: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" fill="%23fed7aa"/><circle cx="60" cy="50" r="25" fill="%23f97316"/><circle cx="60" cy="115" r="45" fill="%23f97316"/></svg>',
    lat_masuk: -6.20876,
    long_masuk: 106.84559,
    lat_pulang: -6.20877,
    long_pulang: 106.84560,
    jarak_masuk_meter: 10,
    jarak_pulang_meter: 14,
    keterlambatan_menit: 0,
    pulang_cepat_menit: 0,
    catatan: 'Penutupan buku kas akhir bulan'
  }
];

export const INITIAL_PENGAJUAN: PengajuanIzin[] = [
  {
    id: 1,
    user_id: 5,
    user_nama: 'Ahmad Fauzi',
    user_nip: 'KRY-1023',
    user_divisi: 'Operasional & Logistik',
    jenis: 'IZIN',
    tanggal_mulai: '2026-10-02',
    tanggal_selesai: '2026-10-02',
    total_hari: 1,
    alasan: 'Perpanjangan dokumen administrasi kependudukan di Samsat/Disdukcapil.',
    status_approval: 'DISETUJUI',
    approved_by_nama: 'Reni Wulandari, S.Psi',
    approved_at: '2026-10-01 16:30:00',
    catatan_approval: 'Disetujui. Pastikan serah terima tugas piket ke rekan kerja.',
    created_at: '2026-10-01 09:15:00'
  },
  {
    id: 2,
    user_id: 2,
    user_nama: 'Budi Santoso',
    user_nip: 'KRY-1021',
    user_divisi: 'IT & Software Engineering',
    jenis: 'CUTI_TAHUNAN',
    tanggal_mulai: '2026-10-12',
    tanggal_selesai: '2026-10-14',
    total_hari: 3,
    alasan: 'Cuti tahunan keperluan keluarga di kampung halaman.',
    status_approval: 'PENDING',
    created_at: '2026-10-02 08:30:00'
  },
  {
    id: 3,
    user_id: 4,
    user_nama: 'Siti Rahmawati',
    user_nip: 'KRY-1022',
    user_divisi: 'Keuangan & Akuntansi',
    jenis: 'SAKIT',
    tanggal_mulai: '2026-09-22',
    tanggal_selesai: '2026-09-23',
    total_hari: 2,
    alasan: 'Sakit flu berat dan demam tinggi berdasarkan rujukan dokter RS.',
    lampiran_url: 'surat_keterangan_dokter_rs_silp.pdf',
    status_approval: 'DISETUJUI',
    approved_by_nama: 'Reni Wulandari, S.Psi',
    approved_at: '2026-09-22 10:00:00',
    catatan_approval: 'Surat dokter terverifikasi valid.',
    created_at: '2026-09-22 07:45:00'
  }
];

export const INITIAL_LOGS: LogAktivitas[] = [
  { id: 1, user_nama: 'Budi Santoso', role: 'KARYAWAN', aksi: 'PRESENSI_CHECK_IN', detail: 'Check-in berhasil via GPS (12m dari kantor) & foto selfie terverifikasi', waktu: '2026-10-02 07:52:14', ip_address: '180.252.164.21' },
  { id: 2, user_nama: 'Siti Rahmawati', role: 'KARYAWAN', aksi: 'PRESENSI_CHECK_IN', detail: 'Check-in berstatus Terlambat 9 menit (GPS 24m) catatan jalanan macet', waktu: '2026-10-02 08:24:10', ip_address: '114.125.88.92' },
  { id: 3, user_nama: 'Reni Wulandari, S.Psi', role: 'HRD_MANAJEMEN', aksi: 'APPROVAL_IZIN', detail: 'Menyetujui izin 1 hari Ahmad Fauzi (NIP: KRY-1023)', waktu: '2026-10-01 16:30:00', ip_address: '10.0.12.54' },
  { id: 4, user_nama: 'Dimas Pratama', role: 'ADMIN', aksi: 'UPDATE_CONFIG', detail: 'Memperbarui toleransi keterlambatan shift 15 menit', waktu: '2026-09-30 11:20:00', ip_address: '10.0.12.1' },
];
