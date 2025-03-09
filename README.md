# Eclipta

Proyek web personal ini dibangun menggunakan React, TypeScript, Vite, Firebase, Cloudinary, dan Bootstrap 5 dengan bantuan Bolt New, DeepSeek, Claude AI. Web personal ini dinamis jadi data-data nya dapat di ubah melalui dashboard admin, mencakup fitur-fitur seperti autentikasi pengguna, upload gambar, dan manajemen konten. Proyek ini bersifat **open-source** dan dapat digunakan sebagai referensi atau dikembangkan lebih lanjut.

## Fitur Utama
- Manajemen personal info, sosial media, pengalaman kerja, pendidikan, tech stack, dan interests
- Manajemen portofolio
- Manajemen blog
- Manajemen lisensi dan sertifikat
- Dashboard admin
- Upload Gambar: Menggunakan Cloudinary untuk menyimpan dan mengelola gambar.
- Manajemen Konten: Menggunakan editor teks Jodit untuk membuat dan mengedit konten.
- Responsive Design: Dibangun dengan Bootstrap 5 untuk tampilan yang responsif.

## Preview Project

Berikut adalah beberapa gambar preview dari proyek ini:

![Preview 1](https://res.cloudinary.com/ddozgkxvt/image/upload/v1741365366/u1xgbbcqzwihswspkoo2.png)
![Preview 2](https://res.cloudinary.com/ddozgkxvt/image/upload/v1741365366/qz0eovlougfqebygvdiu.png)
![Preview 3](https://res.cloudinary.com/ddozgkxvt/image/upload/v1741365366/cn0mbbguxzddbtq0dikx.png)
![Preview 4](https://res.cloudinary.com/ddozgkxvt/image/upload/v1741365366/nadhfhqqaxjo0ihcg9il.png)

## Prasyarat
- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- Akun Firebase
- Akun Cloudinary

## Instalasi di Lokal

1. **Clone Repository**
   ```bash
   git clone https://github.com/neumedira/eclipta.git
   cd eclipta
   ```

2. **Instal Dependencies**
   ```bash
   npm install
   ```

3. **Buat File `.env`**
   - Buat file `.env` di root folder proyek. Copy saja dari file .env.example.
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
   - Beri nama proyek Anda dan klik **Continue**.
   - Pilih apakah Anda ingin mengaktifkan Google Analytics untuk proyek ini (opsional), lalu klik **Continue**.
   - Setelah proyek dibuat, klik **Continue** untuk masuk ke dashboard Firebase.

2. **Tambahkan Aplikasi Web**
   - Di dashboard Firebase, klik ikon **</>** untuk menambahkan aplikasi web.
   - Daftarkan aplikasi Anda dengan memberikan nama aplikasi.
   - Firebase akan memberikan konfigurasi untuk aplikasi Anda. Salin konfigurasi tersebut.

3. **Dapatkan Environment Variables**
   - Setelah mendaftarkan aplikasi, Firebase akan memberikan konfigurasi seperti berikut:
     ```javascript
     const firebaseConfig = {
       apiKey: "API_KEY",
       authDomain: "AUTH_DOMAIN",
       projectId: "PROJECT_ID",
       storageBucket: "STORAGE_BUCKET",
       messagingSenderId: "MESSAGING_SENDER_ID",
       appId: "APP_ID",
       measurementId: "MEASUREMENT_ID"
     };
     ```
   - Salin nilai-nilai tersebut ke file `.env`

4. **Setup Firebase Storage**
   - Di Firebase Console, buka **Storage** di menu sebelah kiri.
   - Klik **Get Started** untuk mengaktifkan Firebase Storage.
   - Ikuti langkah-langkah yang diberikan untuk menyelesaikan setup.

5. **Setup Firestore Database**
   - Di Firebase Console, buka **Firestore Database** di menu sebelah kiri.
   - Klik **Create database** untuk membuat database Firestore.
   - Pilih mode **Production** atau **Test** (pilih **Test** jika Anda ingin mengizinkan akses baca/tulis tanpa batasan untuk sementara).
   - Setelah database dibuat, Anda dapat mengatur Rules untuk Firestore.

6. **Membuat Rules untuk Firestore**
   - Buka tab **Rules** di Firestore Database.
   - Ganti Rules default dengan Rules berikut untuk mengizinkan akses baca/tulis tanpa batasan:
     ```plaintext
     rules_version = '2';

     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```
   - Klik **Publish** untuk menyimpan perubahan Rules.

## Cara Membuat Cloudinary

1. **Buat Akun Cloudinary**
   - Buka [Cloudinary](https://cloudinary.com/) dan klik **Sign Up** untuk membuat akun gratis.
   - Isi formulir pendaftaran dengan detail yang diperlukan dan verifikasi akun Anda.

2. **Dapatkan Cloudinary Credentials**
   - Setelah login, Anda akan diarahkan ke dashboard Cloudinary.
   - Di dashboard, Anda dapat menemukan `Cloud Name`, `API Key`, dan `API Secret` di bagian **Account Details**.
   - Salin nilai-nilai tersebut untuk digunakan di file `.env`.

3. **Buat Upload Preset**
   - Di dashboard Cloudinary, buka **Settings** > **Upload**.
   - Scroll ke bagian **Upload presets** dan klik **Add upload preset**.
   - Beri nama preset Anda (misalnya, `ml_default`).
   - Atur opsi upload sesuai kebutuhan Anda (misalnya, izinkan format file tertentu, atur ukuran maksimal file, dll.).
   - Klik **Save** untuk menyimpan preset.
   - Salin nama upload preset yang telah dibuat (misalnya, `ml_default`) untuk digunakan di file `.env`.

4. **Isi Environment Variables**
   - Buka file `.env` di proyek Anda dan tambahkan variabel berikut:
     ```
     VITE_CLOUDINARY_CLOUD_NAME=nama_cloud_anda
     VITE_CLOUDINARY_API_KEY=api_key_anda
     VITE_CLOUDINARY_API_SECRET=api_secret_anda
     VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
     ```
   - Ganti `nama_cloud_anda`, `api_key_anda`, dan `api_secret_anda` dengan nilai yang Anda dapatkan dari dashboard Cloudinary.
   - Pastikan `VITE_CLOUDINARY_UPLOAD_PRESET` diisi dengan nama preset yang Anda buat (misalnya, `ml_default`).

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

## Kontribusi

Ini adalah proyek open-source. Jika ingin berkontribusi:
1. **Fork repo ini**.
2. **Buat branch baru** untuk fitur atau perbaikan (`git checkout -b fitur-baru`).
3. **Commit perubahan** (`git commit -m "Menambahkan fitur X"`).
4. **Push ke branch Anda** (`git push origin fitur-baru`).
5. **Buat Pull Request**.

## Lisensi
Proyek ini menggunakan lisensi **MIT**, sehingga bebas digunakan dan dimodifikasi.

---

Jika ada pertanyaan atau saran, silakan buat **issue** atau **pull request**. 🚀
