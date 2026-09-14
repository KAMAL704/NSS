(() => {
  /*
   * Published NSS SLIET profile directory.
   * Add a confirmed team member here to make their name searchable and card-ready.
   */
  const profiles = [
    { name: 'Dr. Tajinder Singh', role: 'Faculty · Programme Officer', session: '2026–27', teamRole: 'Faculty', number: 'NSS-FAC-001' },
    { name: 'Dr. Vinod Kumar Meena', role: 'Faculty Advisor', session: '2024–25', teamRole: 'Faculty', number: 'NSS-FAC-002' },
    { name: 'Kitanshu', role: 'Coordinator', session: '2026–27', teamRole: 'Coordinator', number: 'NSS-COO-001' },
    { name: 'Isha', role: 'Co-coordinator', session: '2026–27', teamRole: 'Co-coordinator', number: 'NSS-COO-002' },
    { name: 'Annu', role: 'Co-coordinator', session: '2026–27', teamRole: 'Co-coordinator', number: 'NSS-COO-003' },
    { name: 'Himanshu', role: 'Co-coordinator', session: '2026–27', teamRole: 'Co-coordinator', number: 'NSS-COO-004' },
    { name: 'Aditya Kumar', role: 'Co-coordinator', session: '2026–27', teamRole: 'Co-coordinator', number: 'NSS-COO-005' },
    { name: 'Somesh', role: 'Student Coordinator', session: '2025–26', teamRole: 'Coordinator', number: 'NSS-COO-006' },
    { name: 'Ajit Kumar', role: 'Student Coordinator', session: '2025–26', teamRole: 'Coordinator', number: 'NSS-COO-007' },
    { name: 'Vishal Meena', role: 'Student Advisor', session: '2026–27', teamRole: 'Student Advisor', number: 'NSS-ADV-001' },
    { name: 'Kamal', role: 'NSS Volunteer', session: '2026–27', teamRole: 'Volunteer', number: 'NSS-VOL-001' }
    
  ];

  const search = document.querySelector('#profile-search');
  const results = document.querySelector('#profile-results');
  const help = document.querySelector('#profile-search-help');
  if (!search || !results || !help) return;

  const fields = {
    initials: document.querySelector('#card-initials'),
    name: document.querySelector('#card-name'),
    role: document.querySelector('#card-role'),
    session: document.querySelector('#card-session'),
    teamRole: document.querySelector('#card-department'),
    number: document.querySelector('#card-number'),
    print: document.querySelector('#print-card')
  };

  const initialsFor = (name) => name.replace(/^Dr\.\s*/i, '').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'NS';

  function showProfile(profile) {
    fields.initials.textContent = initialsFor(profile.name);
    fields.name.textContent = profile.name;
    fields.role.textContent = profile.role;
    fields.session.textContent = profile.session;
    fields.teamRole.textContent = profile.teamRole;
    fields.number.textContent = profile.number;
    fields.print.disabled = false;
  }

  function renderResults(query = '') {
    const normalized = query.trim().toLowerCase();
    const matches = profiles.filter((profile) => profile.name.toLowerCase().includes(normalized));
    help.textContent = normalized
      ? `${matches.length} matching profile${matches.length === 1 ? '' : 's'} found.`
      : `${profiles.length} published team profiles.`;
    results.replaceChildren();

    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'profile-empty';
      empty.textContent = 'No published profile found. Try another name.';
      results.append(empty);
      return;
    }

    matches.forEach((profile) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'profile-result';
      button.innerHTML = `<span class="profile-result-initials" aria-hidden="true">${initialsFor(profile.name)}</span><strong>${profile.name}</strong><span aria-hidden="true">→</span>`;
      button.addEventListener('click', () => showProfile(profile));
      results.append(button);
    });
  }

  search.addEventListener('input', () => renderResults(search.value));
  fields.print?.addEventListener('click', () => window.print());
  renderResults();
})();
