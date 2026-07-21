const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Download Android APK
router.get('/download/android', (req, res) => {
  try {
    const fileName = 'DrPayment-v1.0.apk';
    const filePath = path.join(__dirname, '../downloads', fileName);
    
    // Jika file tidak ada, kirim file dummy
    if (!fs.existsSync(filePath)) {
      return res.json({
        message: 'APK sedang dalam proses build',
        downloadUrl: 'https://github.com/drpaymentgateway3/drpayment/releases',
        version: '1.0.0',
        size: '45 MB',
        status: 'coming_soon'
      });
    }
    
    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download iOS IPA
router.get('/download/ios', (req, res) => {
  try {
    const fileName = 'DrPayment-v1.0.ipa';
    const filePath = path.join(__dirname, '../downloads', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.json({
        message: 'IPA sedang dalam proses build',
        downloadUrl: 'https://apps.apple.com/app/drpayment',
        version: '1.0.0',
        size: '48 MB',
        status: 'coming_soon'
      });
    }
    
    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download Web Version
router.get('/download/web', (req, res) => {
  try {
    res.json({
      message: 'Web Version Available',
      webUrl: 'https://drpayment.com',
      version: '1.0.0',
      features: ['Full Payment Processing', 'Real-time Dashboard', 'Commission Tracking', 'Withdrawal Management'],
      status: 'available',
      installationType: 'PWA (Progressive Web App)'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Download Info
router.get('/downloads/info', (req, res) => {
  res.json({
    application: 'DrPayment Gateway',
    version: '1.0.0',
    releaseDate: new Date().toISOString(),
    platforms: [
      {
        name: 'Android',
        url: '/api/downloads/download/android',
        size: '45 MB',
        minVersion: 'Android 6.0+',
        status: 'available'
      },
      {
        name: 'iOS',
        url: '/api/downloads/download/ios',
        size: '48 MB',
        minVersion: 'iOS 12.0+',
        status: 'available'
      },
      {
        name: 'Web',
        url: '/api/downloads/download/web',
        size: 'N/A',
        minVersion: 'Any Modern Browser',
        status: 'available'
      }
    ]
  });
});

module.exports = router;
