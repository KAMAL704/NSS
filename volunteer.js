(() => {
  const form = document.querySelector('#volunteer-form');
  const result = document.querySelector('#profile-result');
  if (!form || !result) return;

  const storageKey = 'nss-sliet-volunteer-profile';
  const fields = {
    initials: document.querySelector('#card-initials'), name: document.querySelector('#card-name'),
    role: document.querySelector('#card-role'), session: document.querySelector('#card-session'),
    department: document.querySelector('#card-department'), number: document.querySelector('#card-number')
  };
  const initialsFor = (name) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'NV';
  const profileNumber = () => `NSS-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  function showProfile(profile, shouldScroll = true) {
    fields.initials.textContent = initialsFor(profile.name);
    fields.name.textContent = profile.name;
    fields.role.textContent = profile.role;
    fields.session.textContent = profile.session;
    fields.department.textContent = profile.department || 'Not added';
    fields.number.textContent = profile.number;
    result.hidden = false;
    if (shouldScroll) result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function fillForm(profile) {
    ['name', 'role', 'session', 'department'].forEach((key) => {
      if (profile[key] && form.elements[key]) form.elements[key].value = profile[key];
    });
    form.elements.consent.checked = true;
  }

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored && stored.name && stored.role && stored.session && stored.number) {
      fillForm(stored);
      showProfile(stored, false);
    }
  } catch (_) {
    localStorage.removeItem(storageKey);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    let oldProfile = null;
    try { oldProfile = JSON.parse(localStorage.getItem(storageKey)); } catch (_) { oldProfile = null; }
    const profile = {
      name: String(data.get('name') || '').trim(), role: String(data.get('role') || ''),
      session: String(data.get('session') || ''), department: String(data.get('department') || '').trim(),
      number: oldProfile?.number || profileNumber()
    };
    localStorage.setItem(storageKey, JSON.stringify(profile));
    showProfile(profile);
  });

  document.querySelector('#print-card')?.addEventListener('click', () => window.print());
  document.querySelector('#edit-profile')?.addEventListener('click', () => {
    result.hidden = true;
    form.querySelector('input[name="name"]')?.focus();
  });
})();
