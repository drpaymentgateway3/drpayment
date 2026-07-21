# DrPayment Gateway - Complete Setup

## 🚀 INSTALASI & SETUP

### Prerequisites
- Node.js v14+
- PostgreSQL
- Git

### Step 1: Backend Setup

```bash
# Clone repository
git clone https://github.com/drpaymentgateway3/drpayment.git
cd drpayment

# Install dependencies
npm install

# Setup database
psql -U postgres -d drpayment -f config/database.sql

# Create .env file
cp .env.example .env

# Edit .env dengan konfigurasi Anda

# Run server
npm start
```

### Step 2: Frontend Setup

```bash
# Open new terminal
cd drpayment/client

# Install dependencies
npm install

# Start React app
npm start
```

## 🌐 Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Docs:** http://localhost:5000/api/documentation

## 📝 Admin Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`

**Your Account (Rendi Aryandi):**
- Username: `Drpayment2`
- Password: `Admin123`
- Email: `rendiaryandi55@gmail.com`

## 🎯 Features for Admin (Anda)

✅ **Dashboard Monitoring**
- Lihat semua user yang register
- Pantau transaksi real-time
- Statistik lengkap sistem
- Daily report

✅ **User Management**
- Daftar semua pengguna
- Tracking aktivitas user
- KYC verification status

✅ **Withdrawal Management**
- Approval/Reject withdrawal requests
- Monitor semua penarikan dana
- Settlement tracking

✅ **Real-time Notifications**
- Alert ketika ada user baru
- Withdrawal requests
- Transaction alerts

✅ **Financial Reports**
- Daily revenue tracking
- Commission calculations
- User volume analysis

## 📊 Admin Panel Menu

1. **🔐 Admin Monitor** - Real-time user monitoring
2. **📊 Dashboard** - Statistics & metrics
3. **👥 Users** - All registered users
4. **🆕 New Users** - Today's registrations
5. **💰 Withdrawals** - Withdrawal requests
6. **🔔 Notifications** - System alerts

## 🔄 Auto-Refresh

Dashboard akan auto-refresh setiap 30 detik untuk update real-time.

## 📥 Download Application

```bash
# Download Links
GET /api/downloads/download/web
GET /api/downloads/download/android
GET /api/downloads/download/ios
```

## 🛠️ API Endpoints (Admin)

```
GET  /api/admin/users
GET  /api/admin/statistics
GET  /api/admin/new-registrations
GET  /api/admin/withdrawals
PUT  /api/admin/withdrawal/:id
GET  /api/monitoring/daily-report
GET  /api/monitoring/user-activity
GET  /api/monitoring/notifications
```

## 💾 Database

Semua data tersimpan di PostgreSQL:
- Users
- Merchants
- Transactions
- KYC Documents
- Withdrawals
- Commissions
- Audit Logs

## 🚀 Production Deployment

### Deploy Backend
```bash
vercel deploy
# or
railway deploy
# or
heroku create
heroku deploy
```

### Deploy Frontend
```bash
cd client
vercel deploy
# or
netlify deploy --prod
```

## 📞 Support

Untuk pertanyaan, hubungi: support@drpayment.com

---

**Selamat! Aplikasi DrPayment sudah siap digunakan! 🎉**
