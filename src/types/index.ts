export type UserRole = 'ADMIN' | 'KARYAWAN' | 'HRD_MANAJEMEN';

export interface Role {
  id: number;
  nama_role: string;
  kode_role: UserRole;
  deskripsi: string;
}

export interface Divisi {
  id: number;
  nama_divisi: string;
  kode_divisi: string;
  kepala_divisi: string;
}

export interface Jabatan {
  id: number;
  nama_jabatan: string;
  level: string;
}

export interface Shift {
  id: number;
  nama_shift: string;
  jam_masuk: string; // "08:00"
  jam_pulang: string; // "17:00"
  toleransi_menit: number; // 15 menit
  hari_kerja: string[];
}

export interface KantorLokasi {
  id: number;
  nama_kantor: string;
  latitude: number;
  longitude: number;
  radius_meter: number; // e.g. 50m
  alamat: string;
}

export interface User {
  id: number;
  nip: string;
  nama_lengkap: string;
  email: string;
  role: UserRole;
  divisi_id: number;
  divisi_nama: string;
  jabatan_id: number;
  jabatan_nama: string;
  shift_id: number;
  shift_nama: string;
  no_hp: string;
  foto_url: string;
  status_aktif: boolean;
  tanggal_bergabung: string;
}

export type StatusKehadiran = 'HADIR' | 'TERLAMBAT' | 'IZIN' | 'SAKIT' | 'ALPA' | 'PULANG_CEPAT';

export interface PresensiRecord {
  id: number;
  user_id: number;
  user_nip: string;
  user_nama: string;
  user_divisi: string;
  tanggal: string; // "2026-10-02"
  jam_masuk: string | null; // "07:54:12"
  jam_pulang: string | null; // "17:05:30"
  status: StatusKehadiran;
  foto_masuk: string | null;
  foto_pulang: string | null;
  lat_masuk: number | null;
  long_masuk: number | null;
  lat_pulang: number | null;
  long_pulang: number | null;
  jarak_masuk_meter: number | null;
  jarak_pulang_meter: number | null;
  keterlambatan_menit: number;
  pulang_cepat_menit: number;
  catatan: string | null;
  koreksi_manual_oleh?: string;
  koreksi_alasan?: string;
}

export type StatusApproval = 'PENDING' | 'DISETUJUI' | 'DITOLAK';
export type JenisPengajuan = 'IZIN' | 'CUTI_TAHUNAN' | 'SAKIT' | 'DINAS_LUAR' | 'KOREKSI_ABSEN';

export interface PengajuanIzin {
  id: number;
  user_id: number;
  user_nama: string;
  user_nip: string;
  user_divisi: string;
  jenis: JenisPengajuan;
  tanggal_mulai: string;
  tanggal_selesai: string;
  total_hari: number;
  alasan: string;
  lampiran_url?: string;
  status_approval: StatusApproval;
  approved_by_nama?: string;
  approved_at?: string;
  catatan_approval?: string;
  created_at: string;
}

export interface LogAktivitas {
  id: number;
  user_nama: string;
  role: string;
  aksi: string;
  detail: string;
  waktu: string;
  ip_address: string;
}

export interface DatabaseColumnDef {
  name: string;
  type: string;
  pk?: boolean;
  fk?: boolean;
  refTable?: string;
  nullable: boolean;
  defaultVal?: string;
  description: string;
}

export interface DatabaseTableDef {
  name: string;
  label: string;
  description: string;
  columns: DatabaseColumnDef[];
}
