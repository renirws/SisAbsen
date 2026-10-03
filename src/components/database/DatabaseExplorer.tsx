import React, { useState } from 'react';
import { 
  Database, Table, Key, Link2, Copy, Download, Check, 
  Search, Shield, Code, ChevronRight, Layers, FileCode
} from 'lucide-react';
import { DATABASE_TABLES, SQL_DDL_FULL } from '../../data/databaseSchema';
import { DatabaseTableDef } from '../../types';

export const DatabaseExplorer: React.FC = () => {
  const [selectedTableName, setSelectedTableName] = useState<string>(DATABASE_TABLES[5].name); // users table
  const [activeTab, setActiveTab] = useState<'erd' | 'dictionary' | 'sql'>('erd');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [searchColQuery, setSearchColQuery] = useState<string>('');

  const selectedTable = DATABASE_TABLES.find(t => t.name === selectedTableName) || DATABASE_TABLES[0];

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_DDL_FULL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SQL_DDL_FULL], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'schema_database_absensi_3nf.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Relations map for ERD connections
  const ERD_RELATIONS = [
    { from: 'users', to: 'roles', fk: 'role_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'users', to: 'divisi', fk: 'divisi_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'users', to: 'jabatan', fk: 'jabatan_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'users', to: 'shifts', fk: 'shift_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'presensi', to: 'users', fk: 'user_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'presensi', to: 'shifts', fk: 'shift_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'pengajuan_izin', to: 'users', fk: 'user_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'pengajuan_izin', to: 'users', fk: 'approved_by_user_id', pk: 'id', label: 'N:1 (Many to One)' },
    { from: 'log_audit_aktivitas', to: 'users', fk: 'user_id', pk: 'id', label: 'N:1 (Many to One)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-indigo-900 text-white rounded">
                NORMALIZED 3NF RELATIONAL
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {DATABASE_TABLES.length} Tabel Terhubung
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
              Desain Arsitektur Basis Data Berelasi (Well-Structured Database)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Struktur data relasional yang dinormalisasi ke Third Normal Form (3NF) guna menjamin konsistensi ACID, mencegah redundansi, serta memfasilitasi pencarian data presensi cepat (sub-500ms index lookup).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            <button
              onClick={handleCopySql}
              className="py-2 px-3.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSql ? 'Tersalin!' : 'Salin DDL SQL'}
            </button>
            <button
              onClick={handleDownloadSql}
              className="py-2 px-3.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh .SQL
            </button>
          </div>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex p-1 bg-slate-200/70 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('erd')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'erd' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Visual ERD Diagram
        </button>
        <button
          onClick={() => setActiveTab('dictionary')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'dictionary' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kamus Data (Data Dictionary)
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'sql' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Skrip DDL SQL
        </button>
      </div>

      {/* TAB 1: VISUAL ERD DIAGRAM */}
      {activeTab === 'erd' && (
        <div className="space-y-4">
          {/* Relational Diagram Grid */}
          <div className="bg-slate-950 text-slate-200 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  Visualisasi Relasi Antar Tabel (Entity Relationship Map)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik kartu tabel untuk melihat relasi foreign key dan spesifikasi kolom
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Key className="w-3 h-3" /> PK (Primary Key)
                </span>
                <span className="flex items-center gap-1.5 text-sky-400">
                  <Link2 className="w-3 h-3" /> FK (Foreign Key)
                </span>
              </div>
            </div>

            {/* Grid of Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DATABASE_TABLES.map((table) => {
                const isSelected = selectedTableName === table.name;
                const relationsOut = ERD_RELATIONS.filter(r => r.from === table.name);
                const relationsIn = ERD_RELATIONS.filter(r => r.to === table.name);

                return (
                  <div
                    key={table.name}
                    onClick={() => setSelectedTableName(table.name)}
                    className={`rounded-xl border transition-all cursor-pointer p-4 ${
                      isSelected
                        ? 'bg-slate-900 border-sky-400 shadow-lg ring-1 ring-sky-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="font-mono font-bold text-sm text-sky-300 block">
                          {table.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{table.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {table.columns.length} cols
                      </span>
                    </div>

                    {/* Column snippets */}
                    <div className="mt-3 space-y-1 text-[11px] font-mono">
                      {table.columns.slice(0, 5).map(col => (
                        <div key={col.name} className="flex items-center justify-between py-0.5">
                          <div className="flex items-center gap-1.5 truncate">
                            {col.pk && <Key className="w-3 h-3 text-amber-400 shrink-0" />}
                            {col.fk && <Link2 className="w-3 h-3 text-sky-400 shrink-0" />}
                            {!col.pk && !col.fk && <span className="w-3 h-3 text-slate-600 block shrink-0">·</span>}
                            <span className={col.pk ? 'font-bold text-amber-300' : col.fk ? 'text-sky-300' : 'text-slate-300'}>
                              {col.name}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[10px]">{col.type}</span>
                        </div>
                      ))}
                      {table.columns.length > 5 && (
                        <span className="text-[10px] text-slate-500 italic block pt-1">
                          + {table.columns.length - 5} kolom lainnya...
                        </span>
                      )}
                    </div>

                    {/* Relation Badges */}
                    {(relationsOut.length > 0 || relationsIn.length > 0) && (
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1 text-[10px] font-mono">
                        {relationsOut.map((r, i) => (
                          <span key={i} className="text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-900/40">
                            → {r.to} ({r.fk})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Table Inspection Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-indigo-700">{selectedTable.name}</span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedTable.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{selectedTable.description}</p>
              </div>
              <button
                onClick={() => setActiveTab('dictionary')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-center"
              >
                Lihat di Kamus Data
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick table schema */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2 px-3">Kolom</th>
                    <th className="py-2 px-3">Tipe Data</th>
                    <th className="py-2 px-3">Kunci</th>
                    <th className="py-2 px-3">Nullable</th>
                    <th className="py-2 px-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedTable.columns.map(col => (
                    <tr key={col.name} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900">{col.name}</td>
                      <td className="py-2 px-3 font-mono text-indigo-700">{col.type}</td>
                      <td className="py-2 px-3">
                        {col.pk && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">PK</span>}
                        {col.fk && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono">FK → {col.refTable}</span>}
                        {!col.pk && !col.fk && <span className="text-slate-400">-</span>}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-600">
                        {col.nullable ? 'YES' : 'NO (NOT NULL)'}
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-xs">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KAMUS DATA LENGKAP */}
      {activeTab === 'dictionary' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Kamus Data Sistem (Data Dictionary 3NF)</h3>
              <p className="text-xs text-slate-500">
                Dokumentasi lengkap setiap entitas, kolom, batasan constraint, dan relasi integritas
              </p>
            </div>
            {/* Table selector */}
            <select
              value={selectedTableName}
              onChange={(e) => setSelectedTableName(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono font-semibold text-slate-800"
            >
              {DATABASE_TABLES.map(t => (
                <option key={t.name} value={t.name}>{t.name} ({t.label})</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-indigo-700 text-sm">{selectedTable.name}</span>
              <span className="text-slate-500">({selectedTable.label})</span>
            </div>
            <p className="text-slate-600">{selectedTable.description}</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Nama Kolom</th>
                  <th className="py-2.5 px-3">Tipe Data</th>
                  <th className="py-2.5 px-3">Constraint</th>
                  <th className="py-2.5 px-3">Default Value</th>
                  <th className="py-2.5 px-3">Deskripsi Analisis Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedTable.columns.map(col => (
                  <tr key={col.name} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{col.name}</td>
                    <td className="py-2 px-3 font-mono text-indigo-700">{col.type}</td>
                    <td className="py-2 px-3">
                      {col.pk && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono mr-1">PRIMARY KEY</span>}
                      {col.fk && <span className="bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono mr-1">FK ({col.refTable})</span>}
                      {!col.nullable && <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">NOT NULL</span>}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{col.defaultVal || '-'}</td>
                    <td className="py-2 px-3 text-slate-700">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DDL SQL SCRIPT */}
      {activeTab === 'sql' && (
        <div className="bg-slate-950 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Skrip SQL DDL Lengkap (PostgreSQL / MySQL 8.0+)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Siap dieksekusi di database server: Termasuk Primary Key, Foreign Key, Unique Constraints, dan Performance Indexes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="py-1.5 px-3 text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Tersalin' : 'Copy SQL'}
              </button>
              <button
                onClick={handleDownloadSql}
                className="py-1.5 px-3 text-xs font-mono font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download .sql
              </button>
            </div>
          </div>

          <pre className="font-mono text-xs text-emerald-300/90 bg-slate-900/90 p-4 rounded-lg overflow-x-auto leading-relaxed max-h-[500px]">
            {SQL_DDL_FULL}
          </pre>
        </div>
      )}
    </div>
  );
};
