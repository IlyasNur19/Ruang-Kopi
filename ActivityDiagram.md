# 📊 Activity Diagram - RuangKopi

## 1. Alur Pengunjung (Visitor Flow)

```mermaid
flowchart TD
    Start([Pengunjung Mengakses Website]) --> Homepage[Melihat Homepage]
    Homepage --> Choice{Pilih Aksi}
    
    Choice --> Menu[Lihat Menu]
    Choice --> Gallery[Lihat Galeri]
    Choice --> Reservation[Reservasi]
    Choice --> Location[Lihat Lokasi]
    Choice --> Feedback[Kotak Gagasan]
    
    Menu --> FilterCategory{Filter Kategori?}
    FilterCategory -->|Ya| SelectCategory[Pilih Kategori]
    SelectCategory --> ViewMenuItems[Lihat Daftar Menu]
    FilterCategory -->|Tidak| ViewMenuItems
    ViewMenuItems --> BackToChoice{Lanjut?}
    
    Gallery --> ViewPhotos[Lihat Foto-foto]
    ViewPhotos --> BackToChoice
    
    Reservation --> CheckAvailability[Cek Ketersediaan Tempat]
    CheckAvailability --> Available{Tersedia?}
    Available -->|Hijau/Kuning| FillForm[Isi Form Reservasi]
    Available -->|Merah - Penuh| WaitOrBack[Tunggu / Kembali]
    WaitOrBack --> BackToChoice
    FillForm --> ValidateForm{Form Valid?}
    ValidateForm -->|Ya| GenerateWA[Generate Pesan WhatsApp]
    ValidateForm -->|Tidak| FillForm
    GenerateWA --> OpenWA[Buka WhatsApp]
    OpenWA --> SendMessage[Kirim Pesan Reservasi]
    SendMessage --> EndReservation([Selesai Reservasi])
    
    Location --> ViewMap[Lihat Google Maps]
    ViewMap --> CheckStatus[Cek Status Buka/Tutup]
    CheckStatus --> BackToChoice
    
    Feedback --> SelectTopic[Pilih Topik Feedback]
    SelectTopic --> WriteFeedback[Tulis Pesan Feedback]
    WriteFeedback --> SubmitFeedback[Kirim Feedback]
    SubmitFeedback --> FeedbackSuccess([Feedback Terkirim])
    
    BackToChoice -->|Ya| Choice
    BackToChoice -->|Tidak| EndVisit([Selesai])
```

---

## 2. Alur Reservasi Detail

```mermaid
flowchart TD
    Start([Mulai Reservasi]) --> OpenPage[Buka Halaman Reservasi]
    OpenPage --> CheckWidget[Lihat Widget Ketersediaan]
    
    CheckWidget --> StatusCheck{Status Tempat?}
    StatusCheck -->|Hijau - Tersedia| FormPage[Lanjut ke Form]
    StatusCheck -->|Kuning - Hampir Penuh| FormPage
    StatusCheck -->|Merah - Penuh| ShowFull[Tampilkan Pesan Penuh]
    ShowFull --> TryLater([Coba Lagi Nanti])
    
    FormPage --> InputName[Input Nama]
    InputName --> InputPhone[Input No. Telepon]
    InputPhone --> InputDate[Pilih Tanggal]
    InputDate --> InputTime[Pilih Jam]
    InputTime --> InputGuests[Pilih Jumlah Orang]
    InputGuests --> ReviewForm[Review Data]
    
    ReviewForm --> Confirm{Konfirmasi?}
    Confirm -->|Ya| BuildMessage[Susun Pesan Otomatis]
    Confirm -->|Tidak| InputName
    
    BuildMessage --> CreateWALink["Buat Link wa.me"]
    CreateWALink --> RedirectWA[Redirect ke WhatsApp]
    RedirectWA --> UserSendWA[User Kirim Pesan]
    UserSendWA --> WaitResponse[Tunggu Konfirmasi Admin]
    WaitResponse --> EndSuccess([Reservasi Selesai])
```

---

## 3. Alur Admin Login

```mermaid
flowchart TD
    Start([Admin Akses /admin]) --> CheckAuth{Sudah Login?}
    
    CheckAuth -->|Ya| Dashboard[Masuk Dashboard]
    CheckAuth -->|Tidak| LoginPage[Tampilkan Halaman Login]
    
    LoginPage --> InputEmail[Input Email]
    InputEmail --> InputPassword[Input Password]
    InputPassword --> SubmitLogin[Klik Login]
    
    SubmitLogin --> ValidateCreds{Kredensial Valid?}
    ValidateCreds -->|Ya| GenerateJWT[Generate JWT Token]
    GenerateJWT --> SaveToken[Simpan Token di LocalStorage]
    SaveToken --> Dashboard
    
    ValidateCreds -->|Tidak| ShowError[Tampilkan Error]
    ShowError --> LoginPage
    
    Dashboard --> AdminActions[Akses Panel Admin]
    AdminActions --> Logout{Logout?}
    Logout -->|Ya| ClearToken[Hapus Token]
    ClearToken --> LoginPage
    Logout -->|Tidak| AdminActions
```

---

## 4. Alur Admin - Kelola Menu

```mermaid
flowchart TD
    Start([Buka Menu Management]) --> LoadMenu[Load Daftar Menu dari API]
    LoadMenu --> ViewMenu[Tampilkan Daftar Menu]
    
    ViewMenu --> Action{Pilih Aksi}
    
    Action --> AddNew[Tambah Menu Baru]
    Action --> EditItem[Edit Menu]
    Action --> DeleteItem[Hapus Menu]
    Action --> ToggleAvail[Toggle Ketersediaan]
    
    AddNew --> OpenModal[Buka Modal Form]
    OpenModal --> FillDetails[Isi Detail Menu]
    FillDetails --> UploadImage{Upload Gambar?}
    UploadImage -->|Ya| UploadCloudinary[Upload ke Cloudinary]
    UploadCloudinary --> GetImageURL[Dapatkan Image URL]
    GetImageURL --> SaveMenu
    UploadImage -->|Tidak| SaveMenu[Simpan ke Database]
    SaveMenu --> RefreshList[Refresh Daftar Menu]
    RefreshList --> ViewMenu
    
    EditItem --> LoadItemData[Load Data Menu]
    LoadItemData --> OpenModal
    
    DeleteItem --> ConfirmDelete{Konfirmasi Hapus?}
    ConfirmDelete -->|Ya| DeleteFromDB[Hapus dari Database]
    DeleteFromDB --> DeleteImage[Hapus Gambar di Cloudinary]
    DeleteImage --> RefreshList
    ConfirmDelete -->|Tidak| ViewMenu
    
    ToggleAvail --> UpdateStatus[Update Status Available]
    UpdateStatus --> RefreshList
```

---

## 5. Alur Admin - Kelola Reservasi

```mermaid
flowchart TD
    Start([Buka Reservation Management]) --> LoadReservations[Load Daftar Reservasi]
    LoadReservations --> ViewList[Tampilkan Daftar Reservasi]
    
    ViewList --> FilterAction{Filter?}
    FilterAction -->|Status| FilterStatus[Filter by Status]
    FilterAction -->|Tanggal| FilterDate[Filter by Date]
    FilterAction -->|Tidak| SelectReservation
    FilterStatus --> ViewList
    FilterDate --> ViewList
    
    SelectReservation[Pilih Reservasi] --> ViewDetail[Lihat Detail]
    ViewDetail --> UpdateAction{Update Status?}
    
    UpdateAction -->|Ya| SelectStatus[Pilih Status Baru]
    SelectStatus --> StatusChoice{Status?}
    StatusChoice --> Pending[Pending]
    StatusChoice --> Confirmed[Confirmed]
    StatusChoice --> Completed[Completed]
    StatusChoice --> Cancelled[Cancelled]
    
    Pending --> SaveStatus[Simpan Status]
    Confirmed --> SaveStatus
    Completed --> SaveStatus
    Cancelled --> SaveStatus
    
    SaveStatus --> RefreshList[Refresh Daftar]
    RefreshList --> ViewList
    
    UpdateAction -->|Tidak| ViewList
```

---

## 6. Alur Admin - Kelola Galeri

```mermaid
flowchart TD
    Start([Buka Gallery Management]) --> LoadGallery[Load Gambar Galeri]
    LoadGallery --> ViewGallery[Tampilkan Grid Galeri]
    
    ViewGallery --> GalleryAction{Pilih Aksi}
    
    GalleryAction --> Upload[Upload Gambar Baru]
    GalleryAction --> Delete[Hapus Gambar]
    GalleryAction --> Reorder[Atur Urutan]
    
    Upload --> SelectFile[Pilih File Gambar]
    SelectFile --> DragDrop{Drag & Drop?}
    DragDrop -->|Ya| DropZone[Drop ke Area Upload]
    DragDrop -->|Tidak| FileInput[Klik Browse File]
    DropZone --> UploadProcess
    FileInput --> UploadProcess[Proses Upload]
    UploadProcess --> CloudinaryUpload[Upload ke Cloudinary]
    CloudinaryUpload --> SaveToDB[Simpan URL ke Database]
    SaveToDB --> RefreshGallery[Refresh Galeri]
    RefreshGallery --> ViewGallery
    
    Delete --> ConfirmDelete{Konfirmasi?}
    ConfirmDelete -->|Ya| DeleteCloudinary[Hapus dari Cloudinary]
    DeleteCloudinary --> DeleteDB[Hapus dari Database]
    DeleteDB --> RefreshGallery
    ConfirmDelete -->|Tidak| ViewGallery
    
    Reorder --> DragToReorder[Drag untuk Atur Urutan]
    DragToReorder --> SaveOrder[Simpan Urutan Baru]
    SaveOrder --> RefreshGallery
```

---

## 7. Alur Admin - Kelola Kotak Gagasan

```mermaid
flowchart TD
    Start([Buka Ideas Management]) --> LoadIdeas[Load Daftar Feedback]
    LoadIdeas --> ViewIdeas[Tampilkan Daftar Feedback]
    
    ViewIdeas --> FilterTopic{Filter Topik?}
    FilterTopic -->|Ya| SelectTopic[Pilih Topik]
    SelectTopic --> FilteredView[Tampilkan Hasil Filter]
    FilterTopic -->|Tidak| SelectIdea
    FilteredView --> SelectIdea
    
    SelectIdea[Pilih Feedback] --> ViewDetail[Lihat Detail Feedback]
    ViewDetail --> ReadInfo[Baca: Nama, Kontak, Topik, Pesan]
    
    ReadInfo --> UpdateStatus{Update Status?}
    UpdateStatus -->|Ya| ChooseStatus[Pilih Status]
    ChooseStatus --> Baru[Baru]
    ChooseStatus --> Dibaca[Dibaca]
    ChooseStatus --> Diproses[Diproses]
    ChooseStatus --> Selesai[Selesai]
    
    Baru --> SaveStatus[Simpan Status]
    Dibaca --> SaveStatus
    Diproses --> SaveStatus
    Selesai --> SaveStatus
    
    SaveStatus --> RefreshList[Refresh Daftar]
    RefreshList --> ViewIdeas
    
    UpdateStatus -->|Tidak| ViewIdeas
```

---

## 8. Flow Sistem Keseluruhan

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        Visitor[Pengunjung]
        Admin[Admin]
    end
    
    subgraph Pages["Halaman"]
        Home[Homepage]
        MenuPage[Menu Page]
        GalleryPage[Gallery Page]
        ReservationPage[Reservation Page]
        LocationPage[Location Page]
        FeedbackPage[Kotak Gagasan]
        AdminDashboard[Admin Dashboard]
    end
    
    subgraph API["Backend API (Express)"]
        AuthAPI["/api/auth"]
        MenuAPI["/api/menu"]
        GalleryAPI["/api/gallery"]
        ReservationAPI["/api/reservations"]
        SettingsAPI["/api/settings"]
        UploadAPI["/api/upload"]
        IdeasAPI["/api/ideas"]
    end
    
    subgraph External["External Services"]
        PostgreSQL[(PostgreSQL)]
        Cloudinary[Cloudinary]
        WhatsApp[WhatsApp API]
        GoogleMaps[Google Maps]
    end
    
    Visitor --> Home
    Visitor --> MenuPage
    Visitor --> GalleryPage
    Visitor --> ReservationPage
    Visitor --> LocationPage
    Visitor --> FeedbackPage
    
    Admin --> AdminDashboard
    
    Home --> SettingsAPI
    MenuPage --> MenuAPI
    GalleryPage --> GalleryAPI
    ReservationPage --> ReservationAPI
    ReservationPage --> WhatsApp
    LocationPage --> GoogleMaps
    FeedbackPage --> IdeasAPI
    
    AdminDashboard --> AuthAPI
    AdminDashboard --> MenuAPI
    AdminDashboard --> GalleryAPI
    AdminDashboard --> ReservationAPI
    AdminDashboard --> UploadAPI
    AdminDashboard --> IdeasAPI
    
    MenuAPI --> PostgreSQL
    GalleryAPI --> PostgreSQL
    ReservationAPI --> PostgreSQL
    AuthAPI --> PostgreSQL
    SettingsAPI --> PostgreSQL
    IdeasAPI --> PostgreSQL
    
    UploadAPI --> Cloudinary
    GalleryAPI --> Cloudinary
```

---

*Diagram dibuat menggunakan Mermaid untuk visualisasi alur aplikasi RuangKopi* ☕
