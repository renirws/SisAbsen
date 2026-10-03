import { DatabaseTableDef } from '../types';

export const DATABASE_TABLES: DatabaseTableDef[] = [
  {
    name: 'roles',
    label: 'Tabel Master Role',
    description: 'Menyimpan klasifikasi hak akses pengguna (RBAC): ADMIN, KARYAWAN, HRD_MANAJEMEN',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key identitas unik role' },
      { name: 'kode_role', type: 'VARCHAR(30)', nullable: false, description: 'Kode unik hak akses (ADMIN, KARYAWAN, HRD_MANAJEMEN)' },
      { name: 'nama_role', type: 'VARCHAR(50)', nullable: false, description: 'Nama label role untuk tampilan UI' },
      { name: 'deskripsi', type: 'TEXT', nullable: true, description: 'Deskripsi wewenang dan cakupan hak akses role' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan data' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pembaruan data terakhir' },
    ]
  },
  {
    name: 'divisi',
    label: 'Tabel Master Divisi',
    description: 'Menyimpan unit kerja/departemen tempat karyawan bertugas (HRD, IT, Keuangan, Operasional, dsb)',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key identitas divisi' },
      { name: 'kode_divisi', type: 'VARCHAR(20)', nullable: false, description: 'Kode unik divisi (contoh: DIV-HRD, DIV-ENG)' },
      { name: 'nama_divisi', type: 'VARCHAR(100)', nullable: false, description: 'Nama lengkap unit kerja/departemen' },
      { name: 'kepala_divisi_user_id', type: 'BIGINT', fk: true, refTable: 'users', nullable: true, description: 'Foreign Key mengarah ke pimpinan divisi' },
      { name: 'deskripsi', type: 'TEXT', nullable: true, description: 'Rincian fungsi departemen' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan data' },
    ]
  },
  {
    name: 'jabatan',
    label: 'Tabel Master Jabatan',
    description: 'Menyimpan jenjang posisi jabatan pekerjaan (Staff, Lead, Supervisor, Manager, General Manager, Direktur)',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key jabatan' },
      { name: 'nama_jabatan', type: 'VARCHAR(100)', nullable: false, description: 'Nama posisi jabatan fungsional/struktural' },
      { name: 'level', type: 'VARCHAR(30)', nullable: false, description: 'Tingkatan level organisasi (Staff, Middle, Executive)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' },
    ]
  },
  {
    name: 'shifts',
    label: 'Tabel Pola Kerja / Shift',
    description: 'Menyimpan pengaturan jadwal jam masuk, jam kepulangan, dan batas toleransi menit keterlambatan',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key shift' },
      { name: 'nama_shift', type: 'VARCHAR(50)', nullable: false, description: 'Label shift (contoh: Regular Pagi, Shift Siang, Shift Malam)' },
      { name: 'jam_masuk', type: 'TIME', nullable: false, description: 'Jam target dimulainya jam kerja (contoh: 08:00:00)' },
      { name: 'jam_pulang', type: 'TIME', nullable: false, description: 'Jam target berakhirnya jam kerja (contoh: 17:00:00)' },
      { name: 'toleransi_menit', type: 'INTEGER', nullable: false, defaultVal: '15', description: 'Grace period (menit keterlambatan yang dimaklumi)' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultVal: 'TRUE', description: 'Status aktif shift kerja' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' },
    ]
  },
  {
    name: 'kantor_lokasi',
    label: 'Tabel Titik Geofencing Kantor',
    description: 'Menyimpan koordinat koordinat GPS (Latitude/Longitude) dan radius toleransi jarak (Geofence Radius)',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key lokasi kantor' },
      { name: 'nama_kantor', type: 'VARCHAR(100)', nullable: false, description: 'Nama kantor pusat/cabang (contoh: Kantor Pusat Jakarta)' },
      { name: 'latitude', type: 'DECIMAL(10, 8)', nullable: false, description: 'Titik lintang GPS kantor' },
      { name: 'longitude', type: 'DECIMAL(11, 8)', nullable: false, description: 'Titik bujur GPS kantor' },
      { name: 'radius_meter', type: 'INTEGER', nullable: false, defaultVal: '50', description: 'Radius batas absensi dalam meter (misal: 50 meter)' },
      { name: 'alamat', type: 'TEXT', nullable: false, description: 'Alamat fisik lengkap kantor' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, defaultVal: 'TRUE', description: 'Status aktif lokasi' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pembuatan' },
    ]
  },
  {
    name: 'users',
    label: 'Tabel Pengguna (Karyawan & Staff)',
    description: 'Entitas utama data akun pengguna, biodata, relasi ke divisi, jabatan, shift kerja, dan status aktif',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key identitas unik user' },
      { name: 'nip', type: 'VARCHAR(30)', nullable: false, description: 'Nomor Induk Pegawai unik karyawan' },
      { name: 'nama_lengkap', type: 'VARCHAR(150)', nullable: false, description: 'Nama lengkap resmi karyawan' },
      { name: 'email', type: 'VARCHAR(150)', nullable: false, description: 'Alamat email aktif untuk autentikasi login' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Hash kata sandi (Argon2 / BCrypt Salted)' },
      { name: 'role_id', type: 'BIGINT', fk: true, refTable: 'roles', nullable: false, description: 'Foreign Key mengarah ke roles.id' },
      { name: 'divisi_id', type: 'BIGINT', fk: true, refTable: 'divisi', nullable: false, description: 'Foreign Key mengarah ke divisi.id' },
      { name: 'jabatan_id', type: 'BIGINT', fk: true, refTable: 'jabatan', nullable: false, description: 'Foreign Key mengarah ke jabatan.id' },
      { name: 'shift_id', type: 'BIGINT', fk: true, refTable: 'shifts', nullable: false, description: 'Foreign Key mengarah ke shifts.id' },
      { name: 'no_hp', type: 'VARCHAR(20)', nullable: false, description: 'Nomor WhatsApp / telepon seluler aktif' },
      { name: 'foto_profil_url', type: 'VARCHAR(255)', nullable: true, description: 'Path URL file foto profil karyawan' },
      { name: 'status_aktif', type: 'BOOLEAN', nullable: false, defaultVal: 'TRUE', description: 'Indikator status karyawan aktif atau resign' },
      { name: 'tanggal_bergabung', type: 'DATE', nullable: false, description: 'Tanggal resmi mulai bekerja' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu pendaftaran akun' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu perubahan data' },
    ]
  },
  {
    name: 'presensi',
    label: 'Tabel Transaksi Presensi Harian',
    description: 'Mencatat rekam jejak presensi masuk dan pulang, bukti foto selfie, koordinat GPS, validasi geofence, dan status',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key unik log presensi' },
      { name: 'user_id', type: 'BIGINT', fk: true, refTable: 'users', nullable: false, description: 'Foreign Key identitas user yang melakukan absensi' },
      { name: 'shift_id', type: 'BIGINT', fk: true, refTable: 'shifts', nullable: false, description: 'Foreign Key shift yang berlaku saat absensi' },
      { name: 'tanggal', type: 'DATE', nullable: false, description: 'Tanggal kalender presensi (YYYY-MM-DD)' },
      { name: 'jam_masuk', type: 'TIME', nullable: true, description: 'Jam presensi masuk (WIB)' },
      { name: 'jam_pulang', type: 'TIME', nullable: true, description: 'Jam presensi keluar / pulang (WIB)' },
      { name: 'status_kehadiran', type: 'VARCHAR(20)', nullable: false, description: 'Status: HADIR, TERLAMBAT, IZIN, SAKIT, ALPA, PULANG_CEPAT' },
      { name: 'foto_masuk_url', type: 'TEXT', nullable: true, description: 'Path/URL foto selfie verifikasi absensi masuk' },
      { name: 'foto_pulang_url', type: 'TEXT', nullable: true, description: 'Path/URL foto selfie verifikasi absensi pulang' },
      { name: 'lat_masuk', type: 'DECIMAL(10, 8)', nullable: true, description: 'Latitude koordinat GPS saat absen masuk' },
      { name: 'long_masuk', type: 'DECIMAL(11, 8)', nullable: true, description: 'Longitude koordinat GPS saat absen masuk' },
      { name: 'jarak_masuk_meter', type: 'INTEGER', nullable: true, description: 'Kalkulasi jarak dari kantor saat check-in (meter)' },
      { name: 'lat_pulang', type: 'DECIMAL(10, 8)', nullable: true, description: 'Latitude koordinat GPS saat absen pulang' },
      { name: 'long_pulang', type: 'DECIMAL(11, 8)', nullable: true, description: 'Longitude koordinat GPS saat absen pulang' },
      { name: 'jarak_pulang_meter', type: 'INTEGER', nullable: true, description: 'Kalkulasi jarak dari kantor saat check-out (meter)' },
      { name: 'keterlambatan_menit', type: 'INTEGER', nullable: false, defaultVal: '0', description: 'Jumlah menit keterlambatan melebihi toleransi' },
      { name: 'pulang_cepat_menit', type: 'INTEGER', nullable: false, defaultVal: '0', description: 'Jumlah menit pulang sebelum jadwal' },
      { name: 'catatan', type: 'TEXT', nullable: true, description: 'Catatan kegiatan kerja atau alasan keterlambatan' },
      { name: 'koreksi_oleh_user_id', type: 'BIGINT', fk: true, refTable: 'users', nullable: true, description: 'User ID Admin/HRD bila ada koreksi manual' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu record masuk sistem' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu revisi record' },
    ]
  },
  {
    name: 'pengajuan_izin',
    label: 'Tabel Pengajuan Izin & Cuti',
    description: 'Menyimpan riwayat pengajuan izin, sakit, cuti tahunan, serta alur persetujuan (approval) oleh HRD / Manajemen',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key pengajuan' },
      { name: 'user_id', type: 'BIGINT', fk: true, refTable: 'users', nullable: false, description: 'Foreign Key karyawan pemohon' },
      { name: 'jenis_pengajuan', type: 'VARCHAR(30)', nullable: false, description: 'IZIN, CUTI_TAHUNAN, SAKIT, DINAS_LUAR, KOREKSI_ABSEN' },
      { name: 'tanggal_mulai', type: 'DATE', nullable: false, description: 'Tanggal dimulainya periode izin/cuti' },
      { name: 'tanggal_selesai', type: 'DATE', nullable: false, description: 'Tanggal berakhirnya periode izin/cuti' },
      { name: 'total_hari', type: 'INTEGER', nullable: false, description: 'Jumlah hari kerja izin/cuti' },
      { name: 'alasan', type: 'TEXT', nullable: false, description: 'Deskripsi alasan izin/sakit/cuti' },
      { name: 'lampiran_dokumen_url', type: 'TEXT', nullable: true, description: 'URL berkas lampiran (surat dokter/undangan dinas)' },
      { name: 'status_approval', type: 'VARCHAR(20)', nullable: false, defaultVal: "'PENDING'", description: 'Status: PENDING, DISETUJUI, DITOLAK' },
      { name: 'approved_by_user_id', type: 'BIGINT', fk: true, refTable: 'users', nullable: true, description: 'Foreign Key HRD/Manajemen yang memproses' },
      { name: 'approved_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Waktu saat persetujuan/penolakan diputuskan' },
      { name: 'catatan_approver', type: 'TEXT', nullable: true, description: 'Komentar atau alasan persetujuan/penolakan HRD' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Waktu permohonan disubmit' },
    ]
  },
  {
    name: 'log_audit_aktivitas',
    label: 'Tabel Log Audit & Jejak Keamanan',
    description: 'Menyimpan audit trail aktivitas login, manipulasi data user, perubahan status presensi, dan pencetakan laporan',
    columns: [
      { name: 'id', type: 'BIGSERIAL', pk: true, nullable: false, description: 'Primary Key log' },
      { name: 'user_id', type: 'BIGINT', fk: true, refTable: 'users', nullable: true, description: 'Foreign Key user pelaku aksi' },
      { name: 'aksi', type: 'VARCHAR(100)', nullable: false, description: 'Kata kunci tindakan (LOGIN, CHECK_IN, APPROVE_IZIN, CETAK_LAPORAN)' },
      { name: 'detail_payload', type: 'JSONB', nullable: true, description: 'Data detail perubahan dalam format JSON' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false, description: 'Alamat IP pengguna saat melakukan request' },
      { name: 'user_agent', type: 'TEXT', nullable: true, description: 'Informasi browser atau tipe smartphone pemohon' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, defaultVal: 'CURRENT_TIMESTAMP', description: 'Timestamp waktu aktivitas tercatat' },
    ]
  }
];

export const SQL_DDL_FULL = `-- =========================================================================
-- SISTEM INFORMASI ABSENSI KARYAWAN & LAPORAN KEHADIRAN (SIAbsensi)
-- Struktur Database Relasional Normalisasi 3NF (PostgreSQL / MySQL Compatible)
-- Dibuat oleh: System Analyst
-- Fitur: Multi-role (Admin, Karyawan, HRD), GPS Geofencing, Photo Verification,
--        Approval Workflow, Log Audit, Reporting Indexing.
-- =========================================================================

-- 1. TABEL ROLES (Hak Akses Pengguna)
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    kode_role VARCHAR(30) UNIQUE NOT NULL, -- 'ADMIN', 'KARYAWAN', 'HRD_MANAJEMEN'
    nama_role VARCHAR(50) NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABEL DIVISI (Departemen / Unit Kerja)
CREATE TABLE IF NOT EXISTS divisi (
    id BIGSERIAL PRIMARY KEY,
    kode_divisi VARCHAR(20) UNIQUE NOT NULL,
    nama_divisi VARCHAR(100) NOT NULL,
    kepala_divisi_user_id BIGINT,
    deskripsi TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABEL JABATAN (Posisi Karyawan)
CREATE TABLE IF NOT EXISTS jabatan (
    id BIGSERIAL PRIMARY KEY,
    nama_jabatan VARCHAR(100) NOT NULL,
    level VARCHAR(30) NOT NULL, -- 'Staff', 'Officer', 'Supervisor', 'Manager', 'Direktur'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABEL SHIFTS (Jadwal Kerja & Toleransi)
CREATE TABLE IF NOT EXISTS shifts (
    id BIGSERIAL PRIMARY KEY,
    nama_shift VARCHAR(50) NOT NULL,
    jam_masuk TIME NOT NULL,
    jam_pulang TIME NOT NULL,
    toleransi_menit INTEGER NOT NULL DEFAULT 15,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABEL KANTOR_LOKASI (Geofencing GPS)
CREATE TABLE IF NOT EXISTS kantor_lokasi (
    id BIGSERIAL PRIMARY KEY,
    nama_kantor VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meter INTEGER NOT NULL DEFAULT 50,
    alamat TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABEL USERS (Master Karyawan & Akun Pengguna)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    nip VARCHAR(30) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    divisi_id BIGINT NOT NULL,
    jabatan_id BIGINT NOT NULL,
    shift_id BIGINT NOT NULL,
    no_hp VARCHAR(20) NOT NULL,
    foto_profil_url VARCHAR(255),
    status_aktif BOOLEAN NOT NULL DEFAULT TRUE,
    tanggal_bergabung DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_divisi FOREIGN KEY (divisi_id) REFERENCES divisi(id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_jabatan FOREIGN KEY (jabatan_id) REFERENCES jabatan(id) ON DELETE RESTRICT,
    CONSTRAINT fk_users_shift FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT
);

-- Tambahkan foreign key kepala divisi setelah tabel users dibuat
ALTER TABLE divisi 
    ADD CONSTRAINT fk_divisi_kepala FOREIGN KEY (kepala_divisi_user_id) 
    REFERENCES users(id) ON DELETE SET NULL;

-- 7. TABEL PRESENSI (Pencatatan Kehadiran Harian)
CREATE TABLE IF NOT EXISTS presensi (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    shift_id BIGINT NOT NULL,
    tanggal DATE NOT NULL,
    jam_masuk TIME,
    jam_pulang TIME,
    status_kehadiran VARCHAR(20) NOT NULL DEFAULT 'HADIR', -- 'HADIR', 'TERLAMBAT', 'IZIN', 'SAKIT', 'ALPA', 'PULANG_CEPAT'
    foto_masuk_url TEXT,
    foto_pulang_url TEXT,
    lat_masuk DECIMAL(10, 8),
    long_masuk DECIMAL(11, 8),
    jarak_masuk_meter INTEGER,
    lat_pulang DECIMAL(10, 8),
    long_pulang DECIMAL(11, 8),
    jarak_pulang_meter INTEGER,
    keterlambatan_menit INTEGER NOT NULL DEFAULT 0,
    pulang_cepat_menit INTEGER NOT NULL DEFAULT 0,
    catatan TEXT,
    koreksi_oleh_user_id BIGINT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_presensi_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_presensi_shift FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_presensi_koreksi FOREIGN KEY (koreksi_oleh_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uq_user_tanggal UNIQUE (user_id, tanggal) -- 1 user hanya punya 1 record absensi per tanggal
);

-- 8. TABEL PENGAJUAN_IZIN (Manajemen Cuti & Izin)
CREATE TABLE IF NOT EXISTS pengajuan_izin (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    jenis_pengajuan VARCHAR(30) NOT NULL, -- 'IZIN', 'CUTI_TAHUNAN', 'SAKIT', 'DINAS_LUAR', 'KOREKSI_ABSEN'
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    total_hari INTEGER NOT NULL DEFAULT 1,
    alasan TEXT NOT NULL,
    lampiran_dokumen_url TEXT,
    status_approval VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'DISETUJUI', 'DITOLAK'
    approved_by_user_id BIGINT,
    approved_at TIMESTAMPTZ,
    catatan_approver TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_izin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_izin_approver FOREIGN KEY (approved_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. TABEL LOG_AUDIT_AKTIVITAS (Audit Trail Keamanan & Fast Response Monitoring)
CREATE TABLE IF NOT EXISTS log_audit_aktivitas (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    aksi VARCHAR(100) NOT NULL,
    detail_payload JSONB,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================================================
-- INDEXING UNTUK OPTIMASI PERFORMA TINGGI (FAST RESPONSE REQUIREMENT)
-- =========================================================================
CREATE INDEX idx_users_nip ON users(nip);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_divisi ON users(divisi_id);
CREATE INDEX idx_presensi_tanggal ON presensi(tanggal);
CREATE INDEX idx_presensi_user_tanggal ON presensi(user_id, tanggal);
CREATE INDEX idx_presensi_status ON presensi(status_kehadiran);
CREATE INDEX idx_pengajuan_user ON pengajuan_izin(user_id);
CREATE INDEX idx_pengajuan_status ON pengajuan_izin(status_approval);
CREATE INDEX idx_log_created_at ON log_audit_aktivitas(created_at);

-- =========================================================================
-- SEED DATA AWAL (DEFAULT ROLES & SHIFT)
-- =========================================================================
INSERT INTO roles (kode_role, nama_role, deskripsi) VALUES
('ADMIN', 'Administrator Sistem', 'Mengelola master data pengguna, konfigurasi shift, lokasi geofence, dan kontrol keamanan sistem'),
('KARYAWAN', 'Karyawan / Pegawai', 'Melakukan absensi masuk/pulang dengan GPS & selfie, mengajukan izin/cuti, melihat riwayat kehadiran pribadi'),
('HRD_MANAJEMEN', 'Divisi HRD & Manajemen', 'Memantau kehadiran seluruh divisi, menyetujui pengajuan izin, dan mencetak laporan absensi resmi');

INSERT INTO shifts (nama_shift, jam_masuk, jam_pulang, toleransi_menit) VALUES
('Shift Reguler Pagi', '08:00:00', '17:00:00', 15),
('Shift Siang', '13:00:00', '21:00:00', 15);

INSERT INTO kantor_lokasi (nama_kantor, latitude, longitude, radius_meter, alamat) VALUES
('Kantor Pusat Jakarta', -6.2087634, 106.8455990, 50, 'Jl. Sudirman Kav. 28, Jakarta Selatan, DKI Jakarta');
`;
