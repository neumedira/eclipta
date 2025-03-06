# My Personal Web

Proyek web personal ini dibangun menggunakan React, TypeScript, Vite, Firebase, Cloudinary, dan Bootstrap 5. Web peronal ini dinamis data-data nya dapat di ubah melalui dashboard admin, mencakup fitur-fitur seperti autentikasi pengguna, upload gambar, dan manajemen konten.

## Fitur Utama
- **Upload Gambar**: Menggunakan Cloudinary untuk menyimpan dan mengelola gambar.
- **Manajemen Konten**: Menggunakan editor teks Jodit untuk membuat dan mengedit konten.
- **Responsive Design**: Dibangun dengan Bootstrap 5 untuk tampilan yang responsif.

## Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Akun Firebase
- Akun Cloudinary

## Instalasi di Lokal

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/my-personal-web.git
   cd my-personal-web
   ```

2. **Instal Dependencies**
   ```bash
   npm install
   ```

3. **Buat File `.env`**
   - Buat file `.env` di root folder proyek.
   - Isi file tersebut dengan environment variables berikut:
     ```env
     VITE_ADMIN_ACCESS_CODE=kode_rahasia_anda

     VITE_CLOUDINARY_CLOUD_NAME=nama_cloud_anda
     VITE_CLOUDINARY_API_KEY=api_key_anda
     VITE_CLOUDINARY_API_SECRET=api_secret_anda
     VITE_CLOUDINARY_UPLOAD_PRESET=upload_preset_anda

     VITE_FIREBASE_API_KEY=api_key_firebase
     VITE_FIREBASE_AUTH_DOMAIN=auth_domain_firebase
     VITE_FIREBASE_PROJECT_ID=project_id_firebase
     VITE_FIREBASE_STORAGE_BUCKET=storage_bucket_firebase
     VITE_FIREBASE_MESSAGING_SENDER_ID=messaging_sender_id_firebase
     VITE_FIREBASE_APP_ID=app_id_firebase
     VITE_FIREBASE_MEASUREMENT_ID=measurement_id_firebase
     ```

4. **Jalankan Proyek**
   ```bash
   npm run dev
   ```
   - Buka browser dan akses `http://localhost:8877`.

## Cara Membuat Firebase

1. **Buat Proyek Firebase**
   - Buka [Firebase Console](https://console.firebase.google.com/).
   - Klik **Add project** dan ikuti langkah-langkahnya.

2. **Tambahkan Aplikasi Web**
   - Setelah proyek dibuat, klik **Add app** dan pilih **Web**.
   - Daftarkan aplikasi Anda dan dapatkan konfigurasi Firebase.

3. **Dapatkan Environment Variables**
   - Setelah mendaftarkan aplikasi, Firebase akan memberikan konfigurasi seperti `apiKey`, `authDomain`, `projectId`, dll.
   - Salin nilai-nilai tersebut ke file `.env` Anda.

4. **Aktifkan Firebase Authentication**
   - Di Firebase Console, buka **Authentication** dan aktifkan metode login yang Anda inginkan (misalnya, Email/Password).

5. **Setup Firebase Storage**
   - Buka **Storage** di Firebase Console dan aktifkan layanan penyimpanan.

## Cara Membuat Cloudinary

1. **Buat Akun Cloudinary**
   - Buka [Cloudinary](https://cloudinary.com/) dan buat akun gratis.

2. **Dapatkan Cloudinary Credentials**
   - Setelah login, Anda bisa menemukan `Cloud Name`, `API Key`, dan `API Secret` di dashboard Cloudinary.

3. **Buat Upload Preset**
   - Buka **Settings** > **Upload**.
   - Buat upload preset baru dan atur sesuai kebutuhan Anda.
   - Salin nama upload preset ke file `.env` Anda.

4. **Isi Environment Variables**
   - Masukkan `Cloud Name`, `API Key`, `API Secret`, dan `Upload Preset` ke file `.env`.

## Admin Access Code

`admin_access_code` adalah kode rahasia yang digunakan untuk mengakses fitur admin di web ini. Kode ini harus diisi di file `.env` dengan nilai yang Anda tentukan sendiri.

- **Contoh:**
  ```env
  VITE_ADMIN_ACCESS_CODE=rahasia123
  ```

- **Cara Menggunakan:**
  - URL Login Admin = `http://localhost:8877/admin/login`
  - Saat login sebagai admin, Anda akan diminta untuk memasukkan kode ini.
  - Pastikan kode ini hanya diketahui oleh orang yang berwenang.
