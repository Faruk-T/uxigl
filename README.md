# UXI Design System & Enterprise Workspace (v2.5.0)

> **UXI** *(pronounced `/juː-eks-aɪ/` "Yu-Eks-Ay" or simply **"yook-see"** / **"Yuksi"**)*
> Next-Generation **Apple HIG Liquid Glass × Google Material You (M3)** Modular React Design System, integrated with **SheetGL** (60 FPS WebGL DataGrid) and **FileManGL** (WebGL2 Virtual File System).

---

## 🎙️ Marka Kimliği ve Telaffuz Rehberi (How to Pronounce UXI)

**UXI**, **UX** (*User Experience*) ve **UI** (*User Interface*) kavramlarının tek bir çatı altında birleşimini temsil eder:

1. **Harf Harf Okunuşu: `"Yu-Eks-Ay"` (`/juː - eks - aɪ/`) — *En Profesyonel & Global (Resmi Öneri)***
   - Tıpkı **UI** (*Yu-Ay*) ve **UX** (*Yu-Eks*) kavramlarının okunuşu gibi harflerin İngilizce tek tek telaffuz edilmesidir.
   - **Avantajı:** İsmin doğrudan UX ve UI birleşimi olduğunu dinleyenin zihninde anında kodlar. Global pazarda (GitHub, Product Hunt, ThemeForest vb.) geliştiricilerin %90'ı bu şekilde okur. Resmi tanıtımlarda, dokümantasyonda ve videolarda **"Yu-Eks-Ay"** (veya *"Yu-Eks-Ay Admin"*) kullanılmalıdır.
2. **Tek Kelime Gibi (İngilizce Fonetik): `"Yuksi"` veya `"Uksi"` (`/juːksi/` • `/ʊksi/`) — *En Akılda Kalıcı & Sempatik***
   - Kısaltmaları tek bir kelime gibi okuma eğiliminden (MUI paketine *"Mui"*, GUI'ye *"Gui"* veya Nuxt'a *"Nakst"* denmesi gibi) yola çıkan okunuştur.
   - **Avantajı:** Ekip içi günlük konuşmalarda (*"Abi Uksi'nin tablo bileşenini güncelledim"*) söylemesi çok pratiktir, ağızda yuvarlanmaz ve markaya samimi, akılda kalıcı bir karakter katar.
3. **Hibrit Okunuş: `"Yu-Eksi"` (`/juː - eksi/`) — *Ritmik & Modern***
   - İlk iki harfi İngilizce kısaltma gibi okuyup sonunu birleştirerek okumaktır.
   - **Avantajı:** Hem UX vurgusunu korur hem de *"Pixi (PixiJS)"* gibi popüler grafik kütüphanelerinin telaffuz ritmine benzer bir tını yakalar.

---

## 🔗 URL Route Haritası

| Route URL | Açıklama |
| :--- | :--- |
| `/` | **UXI Tanıtım Sayfası (Landing Page)** — SheetGL & FileManGL stilinde canlı önizlemeli vitrin |
| `/dashboard/overview` | **Komuta Merkezi — Genel Bakış** |
| `/dashboard/analytics` | **Canlı Analitik & Gelir Grafikleri** |
| `/dashboard/crm-orders` | **SheetGL 60 FPS WebGL Tablo (4 Kurumsal Senaryo)** |
| `/dashboard/file-manager` | **FileManGL WebGL2 Sanal Dosya Yöneticisi (VFS)** |
| `/dashboard/smart-cluster` | **Sunucu & Cihaz Kümesi Yönetimi** |
| `/components/inputs/*` | `button`, `input`, `switch`, `checkbox`, `slider` |
| `/components/surfaces/*` | `card`, `segmented-control`, `tabs-accordion`, `modal-command` |
| `/components/feedback/*` | `chips-badges`, `progress-avatar`, `datatable-statcard`, `filemangl-explorer` |
| `/docs/*` | `getting-started`, `theming-tokens`, `layout-shell`, `cli-shortcuts` |

---

## 🚀 Hızlı Kurulum

```bash
npm install
npm run dev
```

Üretim derlemesi için:

```bash
npm run build
```
