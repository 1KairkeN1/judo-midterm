const competitors = [
  { id: 1, name: "Kairkenov Nurzhan", category: "Lightweight", wins: 5, isDisqualified: false },
  { id: 2, name: "Nametkul Nurislam", category: "Middleweight", wins: 3, isDisqualified: false },
  { id: 3, name: "Kenzhegulov Nursultan", category: "Lightweight", wins: 2, isDisqualified: false },
  { id: 4, name: "Kairkenov Bekzat", category: "Heavyweight", wins: 2, isDisqualified: false },
  { id: 5, name: "Abikey Adilbek", category: "Middleweight", wins: 1, isDisqualified: false },
  { id: 6, name: "Kasym Nurasyl", category: "Heavyweight", wins: 4, isDisqualified: false },
  { id: 7, name: "Baitai Abilmansur", category: "Lightweight", wins: 3, isDisqualified: false },
  { id: 8, name: "Li Danil", category: "Middleweight", wins: 0, isDisqualified: false },
  { id: 9, name: "Li Sergei", category: "Heavyweight", wins: 2, isDisqualified: false },
  { id: 10, name: "Yergaliev Yerassyl", category: "Lightweight", wins: 1, isDisqualified: false }
];

const MAX_WINS_LIMIT = 5;

const tableBody = document.getElementById('tournamentTableBody');
const searchInput = document.getElementById('searchInput');
const weightFilter = document.getElementById('weightFilter');
const emptyMessage = document.getElementById('emptyMessage');
const ruleMessage = document.getElementById('ruleMessage');
const totalPointsDisplay = document.getElementById('totalPointsDisplay');
const activeCountDisplay = document.getElementById('activeCountDisplay');

function render() {
  tableBody.textContent = '';
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedCategory = weightFilter.value;

  const filteredCompetitors = competitors.filter(comp => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (filteredCompetitors.length === 0) {
    emptyMessage.classList.remove('d-none');
  } else {
    emptyMessage.classList.add('d-none');
  }

  filteredCompetitors.forEach(comp => {
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.textContent = comp.id;

    const tdName = document.createElement('td');
    tdName.textContent = comp.name;

    const tdCategory = document.createElement('td');
    tdCategory.textContent = comp.category;

    const tdWins = document.createElement('td');
    tdWins.textContent = comp.wins;

    const tdStatus = document.createElement('td');
    const badge = document.createElement('span');
    if (comp.isDisqualified) {
      badge.className = 'badge bg-danger';
      badge.textContent = 'Disqualified';
    } else {
      badge.className = 'badge bg-primary';
      badge.textContent = 'Active';
    }
    tdStatus.appendChild(badge);

    const tdActions = document.createElement('td');
    
    const addWinBtn = document.createElement('button');
    addWinBtn.className = 'btn btn-sm btn-outline-primary me-2';
    addWinBtn.textContent = '+ Win';
    addWinBtn.dataset.action = 'addWin';
    addWinBtn.dataset.id = comp.id;

    const toggleStatusBtn = document.createElement('button');
    toggleStatusBtn.className = 'btn btn-sm btn-outline-danger';
    toggleStatusBtn.textContent = comp.isDisqualified ? 'Restore' : 'Disqualify';
    toggleStatusBtn.dataset.action = 'toggleStatus';
    toggleStatusBtn.dataset.id = comp.id;

    tdActions.appendChild(addWinBtn);
    tdActions.appendChild(toggleStatusBtn);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCategory);
    tr.appendChild(tdWins);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    tableBody.appendChild(tr);
  });

  calculateTotals();
}

function calculateTotals() {
  let totalWinsSum = 0;
  let activeCount = 0;

  for (const comp of competitors) {
    totalWinsSum += comp.wins;
    if (!comp.isDisqualified) {
      activeCount++;
    }
  }

  totalPointsDisplay.textContent = totalWinsSum * 10;
  activeCountDisplay.textContent = activeCount;
}

tableBody.addEventListener('click', function(event) {
  const button = event.target;
  if (!button.dataset.action) return;

  const compId = Number(button.dataset.id);
  const competitor = competitors.find(c => c.id === compId);

  if (!competitor) return;

  ruleMessage.classList.add('d-none');

  if (button.dataset.action === 'addWin') {
    if (competitor.isDisqualified) {
      ruleMessage.textContent = `Action Blocked: Cannot add wins because ${competitor.name} is disqualified.`;
      ruleMessage.classList.remove('d-none');
      return;
    }
    if (competitor.wins >= MAX_WINS_LIMIT) {
      ruleMessage.textContent = `Action Blocked: Competitor ${competitor.name} has already reached the maximum limit of ${MAX_WINS_LIMIT} wins.`;
      ruleMessage.classList.remove('d-none');
      return;
    }
    competitor.wins++;
  } else if (button.dataset.action === 'toggleStatus') {
    competitor.isDisqualified = !competitor.isDisqualified;
  }

  render();
});

searchInput.addEventListener('input', render);
weightFilter.addEventListener('change', render);

render();