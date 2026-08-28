const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[char]));
const showToast = (message) => {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 2500);
};

const dashboardData = {
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
    largeEmails: 156
  }
};

function render(data) {
  const senders = data.topSenders ?? [];
  const categories = data.categories ?? [];
  const stats = data.stats ?? {};
  $('summary').innerHTML = `
    <div><strong>${(data.totalEmails ?? 0).toLocaleString()}</strong><small>Total emails</small></div>
    <div><strong>${(data.unreadEmails ?? 0).toLocaleString()}</strong><small>Unread</small></div>`;
  $('senders').innerHTML = senders.map(({ sender, count }) => `
    <button class="card" data-sender="${encodeURIComponent(sender)}" type="button">
      <b>${escapeHtml(sender)}</b><span>${(count ?? 0).toLocaleString()} emails</span>
    </button>`).join('');
  const maxCategory = Math.max(1, ...categories.map(({ count = 0 }) => count));
  $('categories').innerHTML = categories.map(({ name, count = 0 }) => `
    <div class="category"><b>${escapeHtml(name)}</b><div class="bar"><i style="width:${count / maxCategory * 100}%"></i></div><span>${count.toLocaleString()}</span></div>`).join('');
  $('stats').innerHTML = [
    ['With attachments', stats.withAttachments ?? 0],
    ['Older than 30 days', stats.olderThan30Days ?? 0],
    ['Older than 90 days', stats.olderThan90Days ?? 0],
    ['Large emails', stats.largeEmails ?? 0]
  ].map(([label, count]) => `<div class="stat"><span>${label}</span><b>${count.toLocaleString()}</b></div>`).join('');
}

function load() {
  render(dashboardData);
}

$('refresh').addEventListener('click', load);
$('senders').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-sender]');
  if (!button) return;
  const sender = decodeURIComponent(button.dataset.sender);
  const senderData = dashboardData.topSenders.find((item) => item.sender === sender);
  showToast(`${(senderData?.count ?? 0).toLocaleString()} emails from ${sender}`);
});

load();
