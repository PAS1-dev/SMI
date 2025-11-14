// ==================== Sélecteurs DOM ====================
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const birthDateInput = document.getElementById('birthDate');
const ageDisplay = document.getElementById('ageDisplay');
const resultsSection = document.getElementById('results');
const overdueSection = document.getElementById('overdueSection');
const currentSection = document.getElementById('currentSection');
const upcomingSection = document.getElementById('upcomingSection');
const emptyState = document.getElementById('emptyState');
const overdueCards = document.getElementById('overdueCards');
const currentCards = document.getElementById('currentCards');
const upcomingCards = document.getElementById('upcomingCards');
const overdueTitle = document.getElementById('overdueTitle');
const currentTitle = document.getElementById('currentTitle');
const upcomingTitle = document.getElementById('upcomingTitle');

// ==================== Gestion du menu ====================
function toggleMenu() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

menuBtn.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Gestion des sous-menus
const pniMenu = document.getElementById('pniMenu');
pniMenu.addEventListener('click', function() {
    this.classList.toggle('active');
    const submenu = this.nextElementSibling;
    submenu.classList.toggle('active');
});

// Fermer le menu en cliquant sur un lien (mobile)
document.querySelectorAll('.sidebar a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) toggleMenu();
    });
});

// ==================== Planning vaccinal ====================
const vaccineSchedule = [
    { ageInWeeks: 0, ageLabel: "Naissance", vaccines: [{ name: "HB₀ (Hépatite B)", dose: "0,5 ml", voie: "IM profonde", site: "Face antéro-externe cuisse gauche" }] },
    { ageInWeeks: 4, ageLabel: "1 mois", vaccines: [
        { name: "HB₁ (Hépatite B)", dose: "0,5 ml", voie: "IM profonde", site: "Face antéro-externe cuisse gauche" },
        { name: "BCG", dose: "0,05 ml", voie: "ID stricte", site: "Face externe bras gauche" },
        { name: "VPO₀ (Polio oral)", dose: "2 gouttes", voie: "Orale", site: "Bouche (sur la langue)" }
    ]},
    { ageInWeeks: 8, ageLabel: "8 semaines", vaccines: [
        { name: "Penta¹ (DTC-HB-Hib)", dose: "0,5 ml", voie: "IM profonde", site: "Face antérolatérale cuisse droite" },
        { name: "VPO₁ (Polio oral)", dose: "2 gouttes", voie: "Orale", site: "Bouche (sur la langue)" },
        { name: "Rota¹", dose: "2,5 ml", voie: "Orale", site: "Intérieur de la joue" },
        { name: "Prevenar₁", dose: "0,5 ml", voie: "IM", site: "Face antérolatérale cuisse gauche" }
    ]},
    { ageInWeeks: 12, ageLabel: "12 semaines", vaccines: [
        { name: "Penta² (DTC-HB-Hib)", dose: "0,5 ml", voie: "IM profonde", site: "Face antérolatérale cuisse droite" },
        { name: "VPO₂ (Polio oral)", dose: "2 gouttes", voie: "Orale", site: "Bouche (sur la langue)" },
        { name: "Rota²", dose: "2,5 ml", voie: "Orale", site: "Intérieur de la joue" }
    ]},
    { ageInWeeks: 16, ageLabel: "16 semaines", vaccines: [
        { name: "Penta³ (DTC-HB-Hib)", dose: "0,5 ml", voie: "IM profonde", site: "Face antérolatérale cuisse droite" },
        { name: "VPO₃ (Polio oral)", dose: "2 gouttes", voie: "Orale", site: "Bouche (sur la langue)" },
        { name: "VPI₁ (Polio injectable)", dose: "0,5 ml", voie: "IM", site: "Face antérolatérale cuisse gauche" },
        { name: "Rota³", dose: "2,5 ml", voie: "Orale", site: "Intérieur de la joue" },
        { name: "Prevenar₂", dose: "0,5 ml", voie: "IM", site: "Face antérolatérale cuisse gauche" }
    ]},
    { ageInMonths: 6, ageLabel: "6 mois", vaccines: [{ name: "Prevenar₃ (Accouchement Prématuré)", dose: "0,5 ml", voie: "IM", site: "Face antérolatérale cuisse gauche" }]},
    { ageInMonths: 9, ageLabel: "9 mois", vaccines: [
        { name: "RR₁ (Rougeole-Rubéole)", dose: "0,5 ml", voie: "S/C", site: "Deltoïde gauche" },
        { name: "VPI₂ (Polio injectable)", dose: "0,5 ml", voie: "IM", site: "Deltoïde droit" }
    ]},
    { ageInMonths: 12, ageLabel: "12 mois", vaccines: [{ name: "Prevenar₄", dose: "0,5 ml", voie: "IM", site: "Deltoïde droit" }]},
    { ageInMonths: 18, ageLabel: "18 mois", vaccines: [
        { name: "RR₂ (Rougeole-Rubéole)", dose: "0,5 ml", voie: "S/C", site: "Deltoïde droit" },
        { name: "VPO₄ (Polio oral)", dose: "2 gouttes", voie: "Orale", site: "Bouche (sur la langue)" },
        { name: "DTC", dose: "0,5 ml", voie: "IM", site: "Deltoïde gauche" }
    ]},
    { ageInMonths: 60, ageLabel: "5 ans", vaccines: [
        { name: "VPO₅ (Polio oral)", dose: "2 gouttes", voie: "Orale", site: "Bouche (sur la langue)" },
        { name: "DTC Rappel 2", dose: "0,5 ml", voie: "IM", site: "Deltoïde gauche" }
    ]},
    { ageInMonths: 132, ageLabel: "11 ans (Filles)", vaccines: [{ name: "HPV", dose: "0,5 ml", voie: "IM", site: "Deltoïde" }]}
];

// ==================== Limiter la date max à aujourd'hui ====================
birthDateInput.setAttribute('max', new Date().toISOString().split('T')[0]);

// ==================== Gestion de l'âge ====================
function getAgeComponents(birthDate, currentDate = new Date()) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        days += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

function formatAgeText({ years, months, days }) {
    if (years === 0 && months === 0 && days === 0) return 'Nouveau-né';
    const parts = [];
    if (years) parts.push(`${years} an${years > 1 ? 's' : ''}`);
    if (months) parts.push(`${months} mois`);
    if (days) parts.push(`${days} jour${days > 1 ? 's' : ''}`);
    return parts.join(' et ');
}

// ==================== Calcul des vaccins ====================
function daysBetween(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}

function addMonths(date, monthsToAdd) {
    const d = new Date(date);
    d.setMonth(d.getMonth() + monthsToAdd);
    return d;
}

function calculateVaccines(birthDate) {
    const today = new Date();
    const ageInDays = daysBetween(birthDate, today);

    const overdue = [];
    const current = [];
    const upcoming = [];

    vaccineSchedule.forEach(schedule => {
        let dueDate, windowEnd;

        if (schedule.ageInWeeks !== undefined) {
            dueDate = new Date(birthDate);
            dueDate.setDate(birthDate.getDate() + schedule.ageInWeeks * 7);
            windowEnd = new Date(dueDate);
            windowEnd.setDate(dueDate.getDate() + 28); // fenêtre 4 semaines
        } else {
            dueDate = addMonths(birthDate, schedule.ageInMonths);
            windowEnd = addMonths(dueDate, 1); // fenêtre ≈ 1 mois
        }

        const daysDue = daysBetween(birthDate, dueDate);
        const daysWindowEnd = daysBetween(birthDate, windowEnd);

        if (ageInDays >= daysDue && ageInDays < daysWindowEnd) {
            current.push(schedule);
        } else if (ageInDays >= daysWindowEnd) {
            let monthsLate = schedule.ageInWeeks !== undefined
                ? Math.floor((ageInDays - daysDue) / 30.44)
                : Math.floor(schedule.ageInMonths + (ageInDays - daysDue)/30.44 - schedule.ageInMonths);
            overdue.push({ ...schedule, monthsLate });
        } else {
            upcoming.push({ ...schedule, dueDate });
        }
    });

    return { overdue, current, upcoming };
}

// ==================== Création des cartes vaccinales ====================
const statusClassMap = { overdue: 'status-late', upcoming: 'status-date' };

function createVaccineCard(schedule, type, extra = '') {
    const card = document.createElement('div');
    card.className = `vaccine-card ${type}`;
    const statusHTML = extra ? `<span class="vaccine-status ${statusClassMap[type] || ''}">${extra}</span>` : '';

    const vaccinesList = schedule.vaccines.map(v => `
        <li>
            <div class="vaccine-name">${v.name}</div>
            <div class="vaccine-details">
                <div class="vaccine-detail-item"><span>Dose</span><span>${v.dose}</span></div>
                <div class="vaccine-detail-item"><span>Voie</span><span>${v.voie}</span></div>
                <div class="vaccine-detail-item"><span>Site</span><span>${v.site}</span></div>
            </div>
        </li>
    `).join('');

    card.innerHTML = `
        <div class="vaccine-header">
            <div class="vaccine-age">${schedule.ageLabel}</div>
            ${statusHTML}
        </div>
        <ul class="vaccine-list">${vaccinesList}</ul>
    `;

    return card;
}

// ==================== Affichage des résultats ====================
function displayResults(birthDate) {
    const { overdue, current, upcoming } = calculateVaccines(birthDate);

    const age = getAgeComponents(birthDate);
    ageDisplay.innerHTML = `Âge de l'enfant : <strong>${formatAgeText(age)}</strong>`;

    resultsSection.classList.remove('hidden');
    overdueCards.innerHTML = '';
    currentCards.innerHTML = '';
    upcomingCards.innerHTML = '';
    [overdueSection, currentSection, upcomingSection, emptyState].forEach(sec => sec.classList.add('hidden'));

    if (overdue.length) {
        overdueSection.classList.remove('hidden');
        overdueTitle.textContent = `Vaccins en retard (${overdue.length})`;
        overdue.forEach(schedule => overdueCards.appendChild(createVaccineCard(schedule, 'overdue', `en retard de ${schedule.monthsLate} mois`)));
    }

    if (current.length) {
        currentSection.classList.remove('hidden');
        currentTitle.textContent = `Vaccins à administrer maintenant (${current.length})`;
        current.forEach(schedule => currentCards.appendChild(createVaccineCard(schedule, 'current')));
    }

    if (upcoming.length) {
        upcomingSection.classList.remove('hidden');
        upcomingTitle.textContent = `Prochains vaccins (${upcoming.length})`;
        upcoming.forEach(schedule => upcomingCards.appendChild(createVaccineCard(schedule, 'upcoming', schedule.dueDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))));
    }

    if (!overdue.length && !current.length && !upcoming.length) emptyState.classList.remove('hidden');
}

// ==================== Form submission ====================
document.getElementById('vaccineForm').addEventListener('submit', e => {
    e.preventDefault();
    if (birthDateInput.value) displayResults(new Date(birthDateInput.value + 'T00:00:00'));
});

// ========================= Les Indicateurs PNI =========================
// Utility function to format numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Vaccine Needs Calculator
function calculateNeeds() {
    const population = parseFloat(document.getElementById('needs-population').value);
    const birthRate = parseFloat(document.getElementById('needs-birthrate').value);
    
    if (isNaN(population) || isNaN(birthRate) || population <= 0 || birthRate <= 0) {
        alert('Veuillez entrer des valeurs valides');
        return;
    }
    
    const children = Math.round((population * birthRate) / 100);
    
    document.getElementById('needs-result-number').textContent = formatNumber(children);
    document.getElementById('needs-calculation').textContent = 
        `(${formatNumber(population)} × ${birthRate}%) = ${formatNumber(children)} enfants`;
    document.getElementById('needs-result').classList.remove('hidden');
}

// Vaccine Order Calculator
function calculateOrder() {
    const children = parseFloat(document.getElementById('order-children').value);
    const doses = parseFloat(document.getElementById('order-doses').value);
    const cp = parseFloat(document.getElementById('order-cp').value);
    
    if (isNaN(children) || isNaN(doses) || isNaN(cp) || children <= 0 || doses <= 0 || cp <= 0) {
        alert('Veuillez entrer des valeurs valides');
        return;
    }
    
    const baseOrder = Math.round(children * doses * cp);
    
    // Calculer le safety stock (consommation de 2 mois)
    const monthlyConsumption = baseOrder / 12;
    const calculatedSafety = Math.ceil(monthlyConsumption * 2);
    
    // Limiter le safety stock à 25% de la base order
    const maxSafety = baseOrder * 0.25;
    const finalSafety = Math.min(calculatedSafety, maxSafety);
    const total = Math.ceil(baseOrder + finalSafety);
    
    document.getElementById('order-result-number').textContent = formatNumber(total);
    document.getElementById('order-base').textContent = formatNumber(baseOrder);
    document.getElementById('order-safety-display').textContent = formatNumber(finalSafety);
    document.getElementById('order-calculation').textContent = 
        `(${formatNumber(children)} × ${doses} × ${cp}) + ${formatNumber(finalSafety)} = ${formatNumber(total)} doses`;
    document.getElementById('order-result').classList.remove('hidden');
}

// Coverage Rate Calculator
function calculateCoverage() {
    const vaccinated = parseFloat(document.getElementById('coverage-vaccinated').value);
    const target = parseFloat(document.getElementById('coverage-target').value);
    
    if (isNaN(vaccinated) || isNaN(target) || vaccinated < 0 || target <= 0) {
        alert('Veuillez entrer des valeurs valides');
        return;
    }
    
    const coverage = ((vaccinated / target) * 100).toFixed(1);
    const badge = document.getElementById('coverage-badge');
    
    document.getElementById('coverage-result-number').textContent = coverage + '%';
    document.getElementById('coverage-vaccinated-display').textContent = formatNumber(vaccinated);
    document.getElementById('coverage-target-display').textContent = formatNumber(target);
    document.getElementById('coverage-calculation').textContent = 
        `(${formatNumber(vaccinated)} ÷ ${formatNumber(target)}) × 100 = ${coverage}%`;
    
    // Set badge
    badge.className = 'result-badge';
    if (coverage >= 95) {
        badge.classList.add('badge-success');
        badge.textContent = 'Excellent';
    } else if (coverage >= 80) {
        badge.classList.add('badge-warning');
        badge.textContent = 'Acceptable';
    } else {
        badge.classList.add('badge-danger');
        badge.textContent = 'Insuffisant';
    }
    
    document.getElementById('coverage-result').classList.remove('hidden');
}

// Dropout Rate Calculator
function calculateDropout() {
    const firstDose = parseFloat(document.getElementById('dropout-first').value);
    const lastDose = parseFloat(document.getElementById('dropout-last').value);
    
    if (isNaN(firstDose) || isNaN(lastDose) || firstDose <= 0 || lastDose < 0) {
        alert('Veuillez entrer des valeurs valides');
        return;
    }
    
    if (lastDose > firstDose) {
        alert('La dernière dose ne peut pas être supérieure à la première dose');
        return;
    }
    
    const dropoutRate = (((firstDose - lastDose) / firstDose) * 100).toFixed(1);
    const lost = firstDose - lastDose;
    const badge = document.getElementById('dropout-badge');
    
    document.getElementById('dropout-result-number').textContent = dropoutRate + '%';
    document.getElementById('dropout-first-display').textContent = formatNumber(firstDose);
    document.getElementById('dropout-last-display').textContent = formatNumber(lastDose);
    document.getElementById('dropout-lost').textContent = formatNumber(lost);
    document.getElementById('dropout-calculation').textContent = 
        `((${formatNumber(firstDose)} - ${formatNumber(lastDose)}) ÷ ${formatNumber(firstDose)}) × 100 = ${dropoutRate}%`;
    
    // Set badge
    badge.className = 'result-badge';
    if (dropoutRate <= 5) {
        badge.classList.add('badge-success');
        badge.textContent = 'Excellent - Continuité optimale';
    } else if (dropoutRate <= 10) {
        badge.classList.add('badge-warning');
        badge.textContent = 'Acceptable - Surveillance recommandée';
    } else {
        badge.classList.add('badge-danger');
        badge.textContent = 'Préoccupant - Intervention nécessaire';
    }
    
    document.getElementById('dropout-result').classList.remove('hidden');
}
