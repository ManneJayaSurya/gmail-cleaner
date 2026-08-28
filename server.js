require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gmail Cleaner API is running' });
});

// Mock API - Phase 1 data
app.get('/api/dashboard', (req, res) => {
  res.json({
    totalEmails: 12482,
    unreadEmails: 1204,
    topSenders: [
      { sender: 'Amazon', count: 420 },
      { sender: 'LinkedIn', count: 286 },
      { sender: 'YouTube', count: 193 },
      { sender: 'Google', count: 151 },
      { sender: 'GitHub', count: 128 },
      { sender: 'Medium', count: 95 },
      { sender: 'Stripe', count: 87 },
      { sender: 'Slack', count: 72 }
    ],
    categories: [
      { name: 'Promotions', count: 3240 },
      { name: 'Social', count: 1180 },
      { name: 'Updates', count: 2410 },
      { name: 'Primary', count: 5652 }
    ],
    stats: {
      withAttachments: 342,
      olderThan30Days: 8234,
      olderThan90Days: 5123,
      olderThan1Year: 2341,
      largeEmails: 156
    }
  });
});

// Mock API - Emails from a specific sender
app.get('/api/sender/:senderName', (req, res) => {
  const senderName = req.params.senderName;
  const mockEmails = [
    {
      id: '1',
      from: senderName,
      subject: `Email from ${senderName} - 1`,
      timestamp: '2024-08-28T10:30:00Z',
      unread: true,
      hasAttachment: false,
      size: 45120
    },
    {
      id: '2',
      from: senderName,
      subject: `Email from ${senderName} - 2`,
      timestamp: '2024-08-27T14:15:00Z',
      unread: false,
      hasAttachment: true,
      size: 2560000
    },
    {
      id: '3',
      from: senderName,
      subject: `Email from ${senderName} - 3`,
      timestamp: '2024-08-25T09:45:00Z',
      unread: false,
      hasAttachment: false,
      size: 12304
    },
    {
      id: '4',
      from: senderName,
      subject: `Email from ${senderName} - 4`,
      timestamp: '2024-08-20T16:22:00Z',
      unread: true,
      hasAttachment: false,
      size: 67890
    },
    {
      id: '5',
      from: senderName,
      subject: `Email from ${senderName} - 5`,
      timestamp: '2024-08-15T11:00:00Z',
      unread: false,
      hasAttachment: false,
      size: 34567
    }
  ];

  res.json({
    sender: senderName,
    totalCount: 420,
    emails: mockEmails
  });
});

// Mock API - Emails by category
app.get('/api/category/:categoryName', (req, res) => {
  const categoryName = req.params.categoryName;
  const counts = {
    'Promotions': 3240,
    'Social': 1180,
    'Updates': 2410,
    'Primary': 5652
  };

  const mockEmails = [
    {
      id: '101',
      from: `sender_${Math.random().toString(36).substring(7)}@example.com`,
      subject: `${categoryName} email - 1`,
      timestamp: '2024-08-28T10:30:00Z',
      unread: true,
      hasAttachment: false,
      size: 45120
    },
    {
      id: '102',
      from: `sender_${Math.random().toString(36).substring(7)}@example.com`,
      subject: `${categoryName} email - 2`,
      timestamp: '2024-08-27T14:15:00Z',
      unread: false,
      hasAttachment: false,
      size: 12304
    },
    {
      id: '103',
      from: `sender_${Math.random().toString(36).substring(7)}@example.com`,
      subject: `${categoryName} email - 3`,
      timestamp: '2024-08-25T09:45:00Z',
      unread: false,
      hasAttachment: true,
      size: 2560000
    },
    {
      id: '104',
      from: `sender_${Math.random().toString(36).substring(7)}@example.com`,
      subject: `${categoryName} email - 4`,
      timestamp: '2024-08-20T16:22:00Z',
      unread: true,
      hasAttachment: false,
      size: 67890
    },
    {
      id: '105',
      from: `sender_${Math.random().toString(36).substring(7)}@example.com`,
      subject: `${categoryName} email - 5`,
      timestamp: '2024-08-15T11:00:00Z',
      unread: false,
      hasAttachment: false,
      size: 34567
    }
  ];

  res.json({
    category: categoryName,
    totalCount: counts[categoryName] || 0,
    emails: mockEmails
  });
});

// Mock API - Delete (trash) emails - Phase 1 just returns success
app.post('/api/trash', (req, res) => {
  const { emailIds } = req.body;
  if (!emailIds || emailIds.length === 0) {
    return res.status(400).json({ error: 'No emails specified' });
  }

  res.json({
    success: true,
    message: `Successfully moved ${emailIds.length} email(s) to trash`,
    trashedCount: emailIds.length
  });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Gmail Cleaner running on http://localhost:${PORT}`);
  console.log(`📱 Open your iPhone and visit: http://your-computer-ip:${PORT}`);
  console.log(`\n✅ Phase 1: Mock data enabled`);
  console.log(`❌ Phase 2: Google OAuth not yet implemented`);
  console.log(`❌ Phase 3: Real Gmail API not yet implemented\n`);
});
