const $ = (id) => document.getElementById(id);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
}[char]));
const showToast = (message) => {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 2500);
};

async function getDashboard() {
  const response = await fetch('/api/dashboard');
  if (!response.ok) throw new Error('Unable to load dashboard');
  return response.json();
}

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

async function load() {
  $('summary').innerHTML = '<div class="loading">Loading your inbox…</div>';
  try { render(await getDashboard()); }
  catch (error) {
    $('summary').innerHTML = `<div class="loading">${escapeHtml(error.message)}</div>`;
    $('senders').innerHTML = '';
    $('categories').innerHTML = '';
    $('stats').innerHTML = '';
  }
}

$('refresh').addEventListener('click', load);
$('senders').addEventListener('click', async (event) => {
  const button = event.target.closest('[data-sender]');
  if (!button) return;
  const sender = decodeURIComponent(button.dataset.sender);
  try {
    const response = await fetch(`/api/sender/${encodeURIComponent(sender)}`);
    if (!response.ok) throw new Error('Could not load sender emails');
    const data = await response.json();
    showToast(`${(data.totalCount ?? 0).toLocaleString()} emails from ${sender}`);
  } catch (error) { showToast(error.message || 'Could not load sender emails'); }
});

load();
