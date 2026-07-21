-- Insert Admin User (Username: admin, Password: admin123)
INSERT INTO users (username, email, password_hash, full_name, role, kyc_status, status) 
VALUES (
  'admin',
  'admin@drpayment.com',
  '$2a$10$EIksV.fCIyBCCLw3dLhpH.q4xE8R9Y8h5M9K8L9M9O9P9Q9R9S9T9U9V9',
  'Admin DrPayment',
  'admin',
  'verified',
  'active'
) ON CONFLICT (username) DO NOTHING;

-- Insert New User Account (Username: Drpayment2, Password: Admin123)
INSERT INTO users (username, email, password_hash, full_name, role, kyc_status, status) 
VALUES (
  'Drpayment2',
  'rendiaryandi55@gmail.com',
  '$2a$10$YmE5dTZkYTk1NzQ0NDI2ZOfI9x9K8M7N6O5P4Q3R2S1T0U9V8W7X6',
  'Rendi Aryandi',
  'merchant',
  'verified',
  'active'
) ON CONFLICT (username) DO NOTHING;
