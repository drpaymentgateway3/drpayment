-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'merchant', -- admin, merchant, user
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, inactive
  kyc_status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  api_key VARCHAR(255) UNIQUE,
  api_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  business_name VARCHAR(255),
  business_type VARCHAR(100),
  website VARCHAR(255),
  business_registration VARCHAR(255),
  logo_url VARCHAR(255),
  description TEXT,
  total_transactions DECIMAL(15,2) DEFAULT 0,
  total_commission DECIMAL(15,2) DEFAULT 0,
  balance DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KYC Documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  id_type VARCHAR(50), -- KTP, Passport, etc
  id_number VARCHAR(255),
  id_document_url VARCHAR(255),
  selfie_url VARCHAR(255),
  address_proof_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, verified, rejected
  rejection_reason TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  order_id VARCHAR(255),
  amount DECIMAL(15,2) NOT NULL,
  commission DECIMAL(15,2) DEFAULT 0,
  net_amount DECIMAL(15,2),
  payment_method VARCHAR(50), -- card, bank_transfer, e_wallet
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, success, failed
  transaction_id VARCHAR(255) UNIQUE,
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Withdrawals Table
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  amount DECIMAL(15,2) NOT NULL,
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  account_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, processing, completed, rejected
  withdrawal_date TIMESTAMP,
  completed_date TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commission Table
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  commission_amount DECIMAL(15,2) NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 2.5,
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, withdrawn
  completed_at TIMESTAMP,
  withdrawn_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settlement Table
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  settlement_date DATE,
  total_amount DECIMAL(15,2),
  total_commission DECIMAL(15,2),
  total_transactions INT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  key_name VARCHAR(255),
  api_key VARCHAR(255) UNIQUE NOT NULL,
  api_secret VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_merchants_user_id ON merchants(user_id);
CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_withdrawals_merchant_id ON withdrawals(merchant_id);
CREATE INDEX idx_commissions_merchant_id ON commissions(merchant_id);
CREATE INDEX idx_kyc_user_id ON kyc_documents(user_id);

-- Insert Admin User (Username: admin, Password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role, kyc_status) 
VALUES (
  'admin',
  'admin@drpayment.com',
  '$2a$10$EIksV.fCIyBCCLw3dLhpH.q4xE8R9Y8h5M9K8L9M9O9P9Q9R9S9T9U9V9',
  'Admin DrPayment',
  'admin',
  'verified'
) ON CONFLICT (username) DO NOTHING;
