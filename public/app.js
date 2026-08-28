const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[char]));

async function getDashboard() {
  const response = await fetch('/api/dashboard');
  if (!response.ok) throw new Error('Unable to load dashboard');
  return response.json();
}

function render(data) {
  $('summary').innerHTML = `
    <div><strong>${data.totalEmails.toLocaleString()}</strong><small>Total emails</small></div>
    <div><strong>${data.unreadEmails.toLocaleString()}</strong><small>Unread</small></div>`;
  $('senders').innerHTML = data.topSenders.map(({ sender, count }) => `
    <button class="card" data-sender="${escapeHtml(sender)}" type="button">
      <b>${escapeHtml(sender)}</b><span>${count.toLocaleString()} emails</span>
    </button>`).join('');
  const maxCategory = Math.max(...data.categories.map(({ count }) => count));
  $('categories').innerHTML = data.categories.map(({ name, count }) => `
    <div class="category"><b>${escapeHtml(name)}</b><div class="bar"><i style="width:${count / maxCategory * 100}%"></i></div><span>${count.toLocaleString()}</span></div>`).join('');
  $('stats').innerHTML = [
    ['With attachments', data.stats.withAttachments],
    ['Older than 30 days', data.stats.olderThan30Days],
    ['Older than 90 days', data.stats.olderThan90Days],
    ['Large emails', data.stats.largeEmails]
  ].map(([label, count]) => `<div class="stat"><span>${label}</span><b>${count.toLocaleString()}</b></div>`).join('');
}

async function load() {
  $('summary').innerHTML = '<div class="loading">Loading your inbox…</div>';
  try { render(await getDashboard()); }
  catch (error) { $('summary').innerHTML = `<div class="loading">${escapeHtml(error.message)}</div>`; }
}

$('refresh').addEventListener('click', load);
$('senders').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-sender]');
  if (!button) return;
  const sender = button.dataset.sender;
  try {
    const response = await fetch(`/api/sender/${encodeURIComponent(sender)}`);
    const data = await response.json();
    $('toast').textContent = `${data.totalCount.toLocaleString()} emails from ${sender}`;
    $('toast').classList.add('show');
    setTimeout(() => $('toast').classList.remove('show'), 2500);
  } catch { $('toast').textContent = 'Could not load sender emails'; $('toast').classList.add('show'); }
});

load();
