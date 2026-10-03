export interface PRDSection {
  id: string;
  number: string;
  title: string;
  contentHtml?: string;
  subsections?: {
    id: string;
    title: string;
    content: string;
    points?: string[];
    tableData?: {
      headers: string[];
      rows: string[][];
    };
  }[];
}

export const PRD_DOCUMENT_META = {
  documentId: 'PRD-SIA-2026-V1.0',
  title: 'Product Requirement Document (PRD)',
  subTitle: 'Sistem Informasi Absensi Karyawan & Laporan Manajemen Berbasis Web & Mobile Terintegrasi',
  author: 'Lead System Analyst',
  client: 'Perusahaan / Organisasi Bisnis',
  version: '1.0.0-PROD',
  status: 'APPROVED FOR IMPLEMENTATION',
  dateCreated: '2026-10-02',
};

export const PRD_SECTIONS: PRDSection[] = [
  {
    id: 'executive-summary',
    number: '01',
    title: 'Ringkasan Eksekutif & Latar Belakang Masalah',
    subsections: [
      {
        id: 'latar-belakang',
        title: '1.1 Latar Belakang Masalah',
        content: 'Banyak organisasi dan korporasi masih menghadapi kendala operasional dalam pencatatan kehadiran karyawan yang lambat, rentan manipulasi (titip absen), antrean mesin fingerprint fisik yang tidak higienis, serta proses rekapitulasi laporan manual oleh HRD yang memakan waktu berhari-hari. Dibutuhkan solusi perangkat lunak presensi modern berbasis web yang kompatibel penuh pada smartphone (mobile-responsive/PWA), berkecepatan tinggi (fast response), terintegrasi dengan validasi koordinat GPS Geofencing dan verifikasi foto selfie kamera secara real-time.',
        points: [
          'Keterbatasan mesin biometric fisik: Biaya perawatan tinggi, risiko antrean di jam masuk, serta tidak mendukung mobilitas kerja lapangan/hybrid.',
          'Kebutuhan rekapitulasi instan: Manajemen & HRD memerlukan laporan rekap kehadiran siap cetak tanpa harus mengolah formula spreadsheet secara manual.',
          'Pencegahan kecurangan (Anti-Fraud): Verifikasi GPS ganda (koordinat latitude/longitude radius kantor) dan kamera selfie langsung saat presensi.'
        ]
      },
      {
        id: 'tujuan-proyek',
        title: '1.2 Tujuan & Sasaran Metrik Kinerja (KPI)',
        content: 'Mengembangkan sistem informasi absensi end-to-end yang menjembatani kebutuhan 3 entitas utama: Administrator Sistem, Karyawan/Pegawai, dan Manajemen / Divisi HRD.',
        points: [
          'Respon Cepat (Fast Response): Latensi respon pencatatan presensi di bawah 500 ms di jaringan seluler 4G/5G.',
          'Efisiensi HRD: Memangkas waktu penyusunan laporan kehadiran bulanan dari 3 hari kerja menjadi 1 kali klik cetak instan.',
          'Akurasi Data 100%: Menghilangkan human error pada perhitungan akumulasi menit keterlambatan, jam kerja lembur, dan sisa cuti tahunan.',
          'Aksesibilitas Universal: Berjalan mulus di browser desktop (Chrome, Edge, Firefox, Safari) dan browser smartphone (iOS Safari & Android Chrome).'
        ]
      }
    ]
  },
  {
    id: 'stakeholders-rbac',
    number: '02',
    title: 'Analisis Stakeholder & Matriks Hak Akses (RBAC)',
    subsections: [
      {
        id: 'user-personas',
        title: '2.1 Profil Pengguna (User Personas)',
        content: 'Sistem dirancang dengan pemisahan peran yang ketat (Separation of Concerns) untuk 3 kelompok pengguna:',
        points: [
          'Administrator Sistem: Bertanggung jawab atas integritas data, registrasi akun user/karyawan, penugasan hak akses/divisi/shift, konfigurasi radius kantor (Geofencing), dan audit trail sistem.',
          'Karyawan / Pegawai: Pengguna operasional harian yang melakukan absensi masuk & pulang via smartphone, melihat ringkasan hadir pribadi, serta mengajukan permohonan izin/cuti/sakit secara mandiri.',
          'Manajemen / Divisi HRD: Pengambil keputusan yang memantau tingkat disiplin kehadiran seluruh unit kerja, menyetujui/menolak pengajuan izin karyawan, dan mencetak laporan absensi resmi untuk audit & payroll.'
        ]
      },
      {
        id: 'rbac-matrix',
        title: '2.2 Matriks Hak Akses (Role-Based Access Control)',
        content: 'Tabel hak akses menentukan batasan operasi (CRUD) untuk masing-masing peran:',
        tableData: {
          headers: ['Modul / Fitur Sistem', 'Admin', 'Karyawan', 'Manajemen / HRD'],
          rows: [
            ['Autentikasi Login & Profil Diri', 'Ya (Penuh)', 'Ya (Penuh)', 'Ya (Penuh)'],
            ['Kelola User (Tambah, Edit, Nonaktifkan)', 'Ya (Penuh)', 'Tidak Ada Akses', 'Hanya Lihat Data'],
            ['Konfigurasi Shift & Geofencing Radius', 'Ya (Penuh)', 'Tidak Ada Akses', 'Hanya Lihat Data'],
            ['Koreksi Data Absensi Manual', 'Ya (Override)', 'Tidak Ada Akses', 'Ya (Dengan Catatan)'],
            ['Melakukan Absen Masuk & Pulang (GPS+Foto)', 'Opsional', 'Wajib / Utama', 'Opsional'],
            ['Melihat Riwayat Absensi Pribadi', 'Ya', 'Ya (Hanya Milik Sendiri)', 'Ya'],
            ['Pengajuan Izin / Cuti / Sakit', 'Ya', 'Ya (Form Mandiri)', 'Ya'],
            ['Approval Permohonan Izin / Cuti', 'Dapat Akses', 'Tidak Ada Akses', 'Ya (Wewenang Utama)'],
            ['Dashboard Monitoring Kehadiran Divisi', 'Ya', 'Tidak Ada Akses', 'Ya (Live Tracker)'],
            ['Mencetak Dokumen Laporan Hadir Resmi', 'Ya (Ekspor Data)', 'Tidak Ada Akses', 'Ya (Cetak A4 & Ekspor)']
          ]
        }
      }
    ]
  },
  {
    id: 'functional-requirements',
    number: '03',
    title: 'Kebutuhan Fungsional (Functional Requirements)',
    subsections: [
      {
        id: 'fr-admin',
        title: '3.1 Kebutuhan Fungsional Peran Administrator',
        content: 'Admin memegang kendali atas master data dan konfigurasi sistem absensi:',
        points: [
          'FR-ADM-01: Admin dapat melakukan login dengan kredensial terenkripsi (email/NIP + password).',
          'FR-ADM-02 (Kelola User): Admin dapat menambah karyawan baru dengan data NIP unik, nama lengkap, email, nomor HP, peran (Role), divisi kerja, jabatan, dan pola shift kerja.',
          'FR-ADM-03: Admin dapat mengubah data pengguna, mereset password, serta menonaktifkan akun karyawan yang sudah resign tanpa menghapus relasi riwayat presensinya (Soft Delete).',
          'FR-ADM-04 (Kelola Absensi): Admin dapat melakukan koreksi manual pada presensi karyawan (misal: kendala teknis perangkat saat absen) dengan kewajiban mengisi alasan koreksi.',
          'FR-ADM-05 (Konfigurasi Master Data): Admin dapat mengonfigurasi jadwal shift (jam masuk, jam pulang, toleransi keterlambatan menit) dan titik koordinat GPS kantor serta radius geofencing dalam satuan meter.',
          'FR-ADM-06: Admin dapat memantau log audit aktivitas sistem untuk melacak setiap perubahan data sensitif.'
        ]
      },
      {
        id: 'fr-karyawan',
        title: '3.2 Kebutuhan Fungsional Peran Karyawan',
        content: 'Karyawan memiliki antarmuka yang dioptimalkan untuk perangkat mobile / smartphone:',
        points: [
          'FR-KRY-01: Karyawan dapat login dengan cepat menggunakan email/NIP dan password pada smartphone maupun desktop.',
          'FR-KRY-02 (Presensi Cepat): Karyawan dapat melihat jam digital real-time, status shift hari ini, serta countdown batas toleransi jam masuk.',
          'FR-KRY-03 (Validasi Geofencing): Sistem mendeteksi posisi GPS pengguna secara otomatis. Tombol presensi hanya aktif jika jarak karyawan berada di dalam radius kantor yang ditentukan (contoh: <= 50 meter).',
          'FR-KRY-04 (Verifikasi Foto Selfie): Karyawan wajib mengambil foto selfie langsung melalui kamera perangkat sebelum tombol check-in/check-out diproses.',
          'FR-KRY-05 (Kalkulasi Keterlambatan Otomatis): Jika karyawan absen masuk melewati jam masuk + toleransi menit, sistem otomatis menandai status "TERLAMBAT" dan menghitung menit keterlambatan.',
          'FR-KRY-06 (Riwayat Kehadiran): Karyawan dapat melihat log absensi bulanan, rekapitulasi jumlah hadir, terlambat, izin, dan sakit.',
          'FR-KRY-07 (Pengajuan Izin/Cuti): Karyawan dapat mengisi form permohonan izin/cuti/sakit lengkap dengan tanggal, alasan, dan bukti upload dokumen (surat dokter/tugas dinas).'
        ]
      },
      {
        id: 'fr-hrd',
        title: '3.3 Kebutuhan Fungsional Peran Manajemen / Divisi HRD',
        content: 'Manajemen & HRD berfokus pada pengawasan, approval, dan pelaporan eksekutif:',
        points: [
          'FR-HRD-01: Manajemen/HRD dapat login dan diarahkan ke Dashboard Pemantauan Kehadiran real-time.',
          'FR-HRD-02 (Kelola Absensi & Approval): HRD dapat melihat daftar pengajuan cuti, izin, dan sakit dari karyawan dengan status PENDING, lalu memberikan persetujuan (DISETUJUI) atau penolakan (DITOLAK) disertai catatan resmi.',
          'FR-HRD-03 (Live Attendance Tracker): HRD dapat memfilter kehadiran hari ini berdasarkan divisi, status (Hadir, Terlambat, Izin, Sakit, Alpa), dan melihat bukti foto selfie serta titik GPS karyawan.',
          'FR-HRD-04 (Mencetak Laporan Hadir): HRD dapat menghasilkan lembar Laporan Kehadiran Karyawan resmi dalam format Standar Cetak Dokumen (A4 Print Preview) yang dilengkapi kop surat, rekapitulasi statistik, rincian log harian, dan kolom tanda tangan Mengetahui HR Manager & Direktur.',
          'FR-HRD-05 (Ekspor Data): HRD dapat mengekspor rekap absensi ke format file CSV / Spreadsheet untuk kebutuhan integrasi perhitungan gaji (Payroll).'
        ]
      }
    ]
  },
  {
    id: 'non-functional-requirements',
    number: '04',
    title: 'Kebutuhan Non-Fungsional & Spesifikasi Teknis',
    subsections: [
      {
        id: 'nfr-performance',
        title: '4.1 Fast Response & Kinerja Sistem',
        content: 'Sistem dirancang untuk merespon dengan latensi sangat rendah agar tidak terjadi antrean virtual saat jam masuk kantor:',
        points: [
          'API Response Time: Waktu respon API pencatatan presensi <= 350 ms pada kondisi beban normal (P95 < 600 ms).',
          'Client-Side Optimizations: Asset bundling ringan (< 300KB initial chunk), lazy loading gambar foto selfie, dan pemanfaatan browser caching.',
          'Optimasi Database: Penggunaan index pada kolom `tanggal`, `user_id`, `nip`, `status_kehadiran`, dan `divisi_id` untuk memastikan query laporan ribuan baris selesai dalam < 100 ms.'
        ]
      },
      {
        id: 'nfr-mobile',
        title: '4.2 Kompatibilitas Smartphone & Responsive Design',
        content: 'Desain berorientasi mobile-first untuk pengalaman sentuh prima pada smartphone:',
        points: [
          'Touch Targets: Elemen tombol utama memiliki tinggi minimum 44px dengan padding nyaman untuk jempol tangan.',
          'Perangkat Keras Smartphone: Memanfaatkan browser HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`) dan MediaDevices API (`navigator.mediaDevices.getUserMedia`) untuk kamera depan.',
          'Pencegahan Zoom Tak Sengaja: Viewport diatur `width=device-width, initial-scale=1.0` agar tidak memicu horizontal scrolling.',
          'PWA Ready: Arsitektur SPA dapat ditambahkan Web Manifest agar dapat di-install ke layar beranda (Add to Home Screen) di Android dan iOS.'
        ]
      },
      {
        id: 'nfr-security',
        title: '4.3 Keamanan Data & Anti-Kecurangan (Anti-Fraud)',
        content: 'Protokol keamanan untuk memastikan integritas data absensi:',
        points: [
          'Validasi Sisi Server (Server-Side Validation): Koordinat GPS dan jarak geofencing dihitung ulang di server menggunakan rumus Haversine; tidak hanya mempercayai klaim client.',
          'Timestamp Server-Authoritative: Waktu presensi diambil dari clock server (NTP synced), bukan dari jam internal smartphone karyawan yang bisa dimanipulasi.',
          'Audit Logging: Setiap tindakan penambahan user, persetujuan izin, dan pengubahan data absensi terekam lengkap dengan IP address dan user agent.',
          'Kriptografi: Password disimpan menggunakan algoritma hashing standar tinggi (Argon2id atau BCrypt dengan work factor 12).'
        ]
      }
    ]
  },
  {
    id: 'database-design',
    number: '05',
    title: 'Desain Basis Data Relasional (Well-Relational Structure)',
    subsections: [
      {
        id: 'prinsip-normalisasi',
        title: '5.1 Normalisasi 3NF (Third Normal Form)',
        content: 'Basis data dirancang dengan mematuhi kaidah Normalisasi Ketiga (3NF) guna mengeliminasi redundansi data, menjaga integritas referensial antar tabel, dan memfasilitasi pelaporan multi-dimensi (per divisi, per shift, per tanggal).',
        points: [
          'Pemisahan Entitas Master & Transaksional: Master `roles`, `divisi`, `jabatan`, `shifts`, dan `kantor_lokasi` berdiri terpisah dari tabel `users`.',
          'Tabel Transaksi Utama `presensi`: Menyimpan Foreign Key ke `users.id` dan `shifts.id` dengan unique constraint ganda `(user_id, tanggal)` sehingga karyawan tidak dapat melakukan duplikasi check-in di hari yang sama.',
          'Tabel Alur Kerja `pengajuan_izin`: Menghubungkan pemohon (`user_id`) dan approver HRD (`approved_by_user_id`) dengan integritas referensial ON DELETE SET NULL atau RESTRICT.',
          'Tabel `log_audit_aktivitas`: Memantau setiap event penting untuk kepatuhan regulasi kepatuhan korporasi.'
        ]
      }
    ]
  }
];
