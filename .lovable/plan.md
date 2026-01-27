

# Plan: Simpan Dokumentasi Alur Aplikasi ke File Markdown

## Tujuan
Membuat file dokumentasi markdown yang menjelaskan alur lengkap aplikasi Manning Services, termasuk arsitektur sistem, alur pengguna, dan role-based access control.

## File yang Akan Dibuat

**`docs/APPLICATION_FLOW.md`**

## Struktur Konten Dokumentasi

### 1. Overview Sistem
- Deskripsi singkat aplikasi
- Tech stack (React, Vite, Supabase/Lovable Cloud)

### 2. Arsitektur Aplikasi
- Public Pages
- Candidate Portal
- Admin Portal
- HRD Dashboard
- PIC Dashboard

### 3. Alur Kandidat
- Registrasi (OTP-based)
- Profile completion (3 steps)
- Job application flow
- Interview & departure tracking

### 4. Alur Admin/Staff
- Review aplikasi
- Unlock profile steps
- Schedule interviews
- Manage departures

### 5. Role-Based Access Control
- Daftar roles dan permissions
- Login redirect logic
- Protected routes

### 6. Diagram Alur
- ASCII diagram untuk visualisasi flow

## Detail Teknis

File akan disimpan di direktori `docs/` yang sudah ada, bersama dengan dokumentasi lainnya seperti:
- `APPLICATION_FLOWCHART.md`
- `DATABASE_SCHEMA.md`
- `DATA_FLOW_DIAGRAM.md`
- `TECHNICAL_SPECS.md`
- `USER_STORIES.md`

