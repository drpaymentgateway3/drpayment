# DrPayment Gateway

🚀 **Complete Payment Gateway Solution** - Professional payment processing platform

## 📋 Features

✅ **User Management**
- User registration & authentication
- Role-based access control (Admin, Merchant, User)
- Secure JWT token authentication

✅ **Payment Processing**
- Transaction creation & management
- Multiple payment methods support
- Real-time commission calculation
- Transaction status tracking

✅ **KYC (Know Your Customer)**
- Document verification
- Identity verification
- Address proof submission

✅ **Withdrawal Management**
- Withdrawal request processing
- Bank account management
- Settlement tracking

✅ **Commission System**
- Automatic commission calculation
- Commission tracking & reporting
- Settlement management

✅ **Admin Panel**
- User management
- Transaction monitoring
- Withdrawal approvals
- System settings

✅ **API Documentation**
- Complete REST API endpoints
- Swagger/OpenAPI documentation
- Integration guides

## 🔐 Default Admin Account

```
Username: admin
Password: admin123
Role: Admin
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Backend Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Setup database
psql -U postgres -d drpayment -f config/database.sql

# Start server
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start React app
npm start
# App runs on http://localhost:3000
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Transactions
- `POST /api/transactions/create` - Create transaction
- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details

### Merchants
- `POST /api/merchants/create` - Create merchant account
- `GET /api/merchants/profile` - Get merchant profile
- `PUT /api/merchants/profile` - Update merchant profile

### Withdrawals
- `POST /api/withdrawals/request` - Request withdrawal
- `GET /api/withdrawals` - List withdrawals

### Commission
- `GET /api/commission/summary` - Get commission summary
- `GET /api/commission/history` - Get commission history

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Documentation
- `GET /api/documentation` - API documentation
- `GET /api/documentation/swagger` - Swagger spec

## 🔧 Configuration

Edit `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=drpayment
DB_USER=postgres
DB_PASSWORD=your_password

PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret

API_BASE_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
```

## 📊 Database Schema

- `users` - User accounts
- `merchants` - Merchant profiles
- `transactions` - Transaction records
- `kyc_documents` - KYC verification documents
- `withdrawals` - Withdrawal requests
- `commissions` - Commission tracking
- `settlements` - Settlement records
- `api_keys` - API key management
- `audit_logs` - System audit logs

## 🌐 Deployment

### Deploy Backend

**Vercel/Railway:**
```bash
vercel deploy
# or
railway deploy
```

**Traditional Server:**
```bash
npm install -g pm2
pm2 start server.js --name "drpayment"
pm2 save
```

### Deploy Frontend

**Vercel:**
```bash
cd client
vercel deploy
```

**Netlify:**
```bash
cd client
netlify deploy --prod
```

## 📝 License

MIT License - See LICENSE file

## 👥 Support

For support, email: support@drpayment.com

## 🔗 Links

- 🌐 Website: https://drpayment.com
- 📚 Documentation: https://docs.drpayment.com
- 🐛 Issues: https://github.com/drpaymentgateway3/drpayment/issues

---

**Made with ❤️ by DrPayment Team**
