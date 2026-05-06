/**
 * Fungsi untuk berpindah antar halaman/section
 * @param {string} pageId - ID dari section yang ingin ditampilkan
 * @param {Event} event - Event klik untuk mengubah status aktif menu
 */
function showPage(pageId, event) {
    // 1. Sembunyikan semua section
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 2. Tampilkan section yang dituju
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 3. Update status aktif pada menu sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Jika dipanggil dari klik menu (ada event), set menu tersebut jadi active
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    } else {
        // Jika dipanggil manual (misal dari tombol investigasi), cari menu yang sesuai
        const targetMenu = Array.from(navItems).find(item =>
            item.getAttribute('onclick').includes(pageId)
        );
        if (targetMenu) targetMenu.classList.add('active');
    }
}

/**
 * Inisialisasi Grafik menggunakan Chart.js
 */
function initCharts() {
    // --- 1. Dashboard Line Chart ---
    const dashElem = document.getElementById('dashboardChart');
    if(dashElem) {
        const ctxDash = dashElem.getContext('2d');
        new Chart(ctxDash, {
            type: 'line',
            data: {
                labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80'],
                datasets: [{
                    label: 'Aktivitas User',
                    data: [5, 35, 50, 45, 65, 58, 80, 115, 105, 135],
                    borderColor: '#000000', // Black
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0, // Straight lines for Lo-Fi
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // --- 2. Chart Analitik: Sebelum Deposit ---
    const prevElem = document.getElementById('chartSebelum');
    if(prevElem) {
        const ctxPrev = prevElem.getContext('2d');
        new Chart(ctxPrev, {
            type: 'bar',
            data: {
                labels: ['User Cancel', 'Error System'],
                datasets: [{
                    data: [88, 55],
                    backgroundColor: '#666666',
                    borderRadius: 0
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0, 0, 0, 0.1)' } } }
            }
        });
    }

    // --- 3. Chart Analitik: Sesudah Deposit ---
    const afterElem = document.getElementById('chartSesudah');
    if(afterElem) {
        const ctxAfter = afterElem.getContext('2d');
        new Chart(ctxAfter, {
            type: 'bar',
            data: {
                labels: ['User Cancel', 'Error System'],
                datasets: [{
                    data: [92, 18], 
                    backgroundColor: '#333333',
                    borderRadius: 0
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0, 0, 0, 0.1)' } } }
            }
        });
    }
}


// --- Event Management Logic ---

let events = [
    {
        id: 1,
        name: "Turnamen Futsal Amatir Jakarta",
        sport: "Futsal",
        desc: "Turnamen seru antar komunitas di Jakarta Selatan.",
        date: "2026-06-15",
        time: "15:00",
        location: "Jakarta Selatan",
        capacity: 16,
        price: 350000,
        participants: [
            { name: "Andi Susanto", status: "Lunas" },
            { name: "Budi Santoso", status: "Pending" }
        ]
    },
    {
        id: 2,
        name: "Fun Mabar Basket",
        sport: "Basket",
        desc: "Main santai cari keringat, terbuka untuk umum.",
        date: "2026-05-20",
        time: "19:00",
        location: "Jakarta Barat",
        capacity: 20,
        price: 50000,
        participants: [
            { name: "Citra Kirana", status: "Lunas" }
        ]
    }
];

function renderEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;

    const filter = document.getElementById('locationFilter').value;
    
    container.innerHTML = '';
    
    const filteredEvents = filter === 'Semua' 
        ? events 
        : events.filter(e => e.location === filter);

    if (filteredEvents.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada event di wilayah ini.</p>';
        return;
    }

    filteredEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-image">
                <i class="fa-solid fa-trophy"></i>
            </div>
            <div class="event-details">
                <div class="event-tag">${event.sport}</div>
                <h3 class="event-title">${event.name}</h3>
                <p class="event-info"><i class="fa-regular fa-calendar"></i> ${event.date} | ${event.time}</p>
                <p class="event-info"><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
                <p class="event-info"><i class="fa-solid fa-users"></i> ${event.participants.length} / ${event.capacity} Slot</p>
                <p class="event-info"><i class="fa-solid fa-tag"></i> ${event.price == 0 ? 'Gratis' : 'Rp ' + event.price.toLocaleString('id-ID')}</p>
            </div>
            <div class="event-actions">
                <button class="btn btn-primary" onclick="openOnsiteModal(${event.id})"><i class="fa-solid fa-plus"></i> On-Site</button>
                <button class="btn btn-muted" onclick="openParticipantModal(${event.id})"><i class="fa-solid fa-users-viewfinder"></i> Peserta</button>
                <button class="btn btn-danger" onclick="deleteEvent(${event.id})" style="background:var(--danger);color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterEvents() {
    renderEvents();
}

function openEventModal() {
    document.getElementById('eventModal').classList.add('active');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    document.getElementById('createEventForm').reset();
}

function deleteEvent(id) {
    if(confirm('Apakah Anda yakin ingin menghapus event ini?')) {
        const ev = events.find(e => e.id === id);
        if(ev) addLog('Admin', 'Hapus Event: ' + ev.name, 'Warning');
        events = events.filter(e => e.id !== id);
        renderEvents();
        renderDashboardEvents();
    }
}


function renderDashboardEvents() {
    const container = document.getElementById('dashEventsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    // Ambil maksimal 3 event pertama
    const activeEvents = events.slice(0, 3);
    
    if (activeEvents.length === 0) {
        container.innerHTML = '<p class="text-muted">Tidak ada event berjalan.</p>';
        return;
    }

    activeEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <div class="event-image">
                <i class="fa-solid fa-trophy"></i>
            </div>
            <div class="event-details">
                <div class="event-tag">${event.sport}</div>
                <h3 class="event-title">${event.name}</h3>
                <p class="event-info"><i class="fa-regular fa-calendar"></i> ${event.date} | ${event.time}</p>
                <p class="event-info"><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
                <p class="event-info"><i class="fa-solid fa-users"></i> ${event.participants.length} / ${event.capacity} Slot</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Handle Form Submission
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderEvents();
    renderDashboardEvents();
    renderTransactions();
    renderLogs();

    const form = document.getElementById('createEventForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validasi tanggal
            const inputDate = new Date(document.getElementById('eventDate').value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (inputDate < today) {
                alert('Tanggal event tidak boleh di masa lalu!');
                return;
            }

            const newEvent = {
                id: Date.now(),
                name: document.getElementById('eventName').value,
                sport: document.getElementById('eventSport').value,
                desc: document.getElementById('eventDesc').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                location: document.getElementById('eventLocation').value,
                capacity: parseInt(document.getElementById('eventCapacity').value),
                price: parseInt(document.getElementById('eventPrice').value) || 0,
                participants: []
            };

            events.push(newEvent);
            addLog('Admin', 'Tambah Event Baru: ' + newEvent.name, 'Berhasil');
            closeEventModal();
            renderEvents();
            renderDashboardEvents();
            alert('Event berhasil ditambahkan!');
        });
    }
});

// Participant Modal Logic
function openParticipantModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    document.getElementById('participantEventName').textContent = event.name;
    const tbody = document.getElementById('participantList');
    tbody.innerHTML = '';

    if (event.participants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted" style="text-align:center;">Belum ada peserta terdaftar.</td></tr>';
    } else {
        event.participants.forEach((p, index) => {
            const statusClass = p.status === 'Lunas' ? 'badge-success' : 'badge-warning';
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${p.name}</td>
                    <td><span class="badge ${statusClass}">${p.status}</span></td>
                </tr>
            `;
        });
    }

    document.getElementById('participantModal').classList.add('active');
}

function closeParticipantModal() {
    document.getElementById('participantModal').classList.remove('active');
}

// On-Site Order Modal Logic
function openOnsiteModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if(event.participants.length >= event.capacity) {
        alert('Maaf, kapasitas event ini sudah penuh!');
        return;
    }

    document.getElementById('onsiteEventName').textContent = event.name;
    document.getElementById('onsiteEventId').value = event.id;
    document.getElementById('onsiteOrderModal').classList.add('active');
}

function closeOnsiteModal() {
    document.getElementById('onsiteOrderModal').classList.remove('active');
    document.getElementById('onsiteOrderForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const onsiteForm = document.getElementById('onsiteOrderForm');
    if (onsiteForm) {
        onsiteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const eventId = parseInt(document.getElementById('onsiteEventId').value);
            const name = document.getElementById('onsiteName').value;
            const status = document.getElementById('onsiteStatus').value;
            
            const eventIndex = events.findIndex(e => e.id === eventId);
            if(eventIndex > -1) {
                events[eventIndex].participants.push({ name: name, status: status });
                addLog('Admin', 'Daftar On-Site: ' + name + ' ke event ' + events[eventIndex].name, 'Berhasil');
                closeOnsiteModal();
                renderEvents();
                renderDashboardEvents();
                alert('Pendaftaran On-Site berhasil ditambahkan!');
            }
        });
    }
});


// --- Transaksi & Refund Logic ---

let transactionHistory = [
    {
        id: "TRX-001",
        date: "04-05-2026",
        eventName: "Padelalala",
        sport: "Padel",
        participants: "Alphard, Zaky, Nabil, Irfan, Ali",
        status: "Lunas"
    },
    {
        id: "TRX-002",
        date: "05-05-2026",
        eventName: "Fun Mabar Basket",
        sport: "Basket",
        participants: "Citra Kirana, Dinda",
        status: "Lunas"
    }
];

let refundRequests = [
    {
        id: "REF-101",
        trxId: "TRX-003",
        userName: "Budi Santoso",
        amount: 150000,
        reason: "Cedera / Berhalangan hadir"
    },
    {
        id: "REF-102",
        trxId: "TRX-004",
        userName: "Maman",
        amount: 80000,
        reason: "Sistem Error saat booking"
    }
];

function renderTransactions() {
    const historyList = document.getElementById('transactionHistoryList');
    if (historyList) {
        historyList.innerHTML = '';
        if (transactionHistory.length === 0) {
            historyList.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Belum ada transaksi lunas.</td></tr>';
        } else {
            transactionHistory.forEach(trx => {
                historyList.innerHTML += `
                    <tr>
                        <td>${trx.date}</td>
                        <td>${trx.eventName} (${trx.sport})</td>
                        <td>${trx.participants}</td>
                        <td><span class="badge badge-success">${trx.status}</span></td>
                    </tr>
                `;
            });
        }
    }

    const refundContainer = document.getElementById('refundRequestsContainer');
    if (refundContainer) {
        refundContainer.innerHTML = '';
        if (refundRequests.length === 0) {
            refundContainer.innerHTML = '<p class="text-muted">Tidak ada permintaan refund saat ini.</p>';
        } else {
            refundRequests.forEach(ref => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.marginBottom = '15px';
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h4 style="margin-bottom: 5px;">Refund: ${ref.trxId} (User: ${ref.userName})</h4>
                            <p class="text-muted" style="margin-bottom: 5px; font-size: 14px;"><strong>Alasan:</strong> ${ref.reason}</p>
                            <p style="font-weight:bold;">Nominal: Rp ${ref.amount.toLocaleString('id-ID')}</p>
                        </div>
                        <div>
                            <button class="btn btn-primary" onclick="approveRefund('${ref.id}')"><i class="fa-solid fa-check"></i> Setujui Refund</button>
                        </div>
                    </div>
                `;
                refundContainer.appendChild(card);
            });
        }
    }
}

function approveRefund(refundId) {
    if(confirm('Setujui pengembalian dana untuk user ini?')) {
        const ref = refundRequests.find(r => r.id === refundId);
        if(ref) addLog('Admin', 'Setujui Refund: ' + ref.trxId + ' (' + ref.userName + ')', 'Berhasil');
        refundRequests = refundRequests.filter(r => r.id !== refundId);
        renderTransactions();
        alert('Refund berhasil disetujui dan dana telah dikembalikan!');
    }
}


// --- Log Aktivitas Logic ---

let activityLogs = [
    { time: "06-05 - 08:00", user: "Sistem", action: "Sistem Started", status: "Berhasil", statusClass: "badge-success" }
];

function addLog(user, action, status) {
    const now = new Date();
    const timeString = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth()+1).toString().padStart(2, '0')} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let statusClass = "badge-warning";
    if (status === "Berhasil") statusClass = "badge-success";
    if (status === "Error") statusClass = "text-danger"; // if using text color
    
    // We will use standard badge colors:
    if (status === "Error") statusClass = "badge-danger"; 

    activityLogs.unshift({
        time: timeString,
        user: user,
        action: action,
        status: status,
        statusClass: statusClass
    });
    
    renderLogs();
}

function renderLogs(filterStatus = "Semua") {
    const logList = document.getElementById('activityLogList');
    if (!logList) return;
    
    logList.innerHTML = '';
    
    const filteredLogs = filterStatus === "Semua" 
        ? activityLogs 
        : activityLogs.filter(log => log.status === filterStatus);
        
    if (filteredLogs.length === 0) {
        logList.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="text-align:center;">Tidak ada catatan aktivitas.</td></tr>';
        return;
    }
    
    filteredLogs.forEach(log => {
        let statusHtml = `<span class="badge ${log.statusClass}" style="background-color: var(--primary); color: #000000;">${log.status}</span>`;
        if (log.status === "Error") {
            statusHtml = `<span class="badge" style="background-color: var(--danger); color: #000000;">${log.status}</span>`;
        } else if (log.status === "Warning") {
            statusHtml = `<span class="badge" style="background-color: var(--warning); color: #000000;">${log.status}</span>`;
        } else if (log.status === "Berhasil") {
            statusHtml = `<span class="badge" style="background-color: var(--primary); color: #000000;">${log.status}</span>`;
        }

        logList.innerHTML += `
            <tr>
                <td>${log.time}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${statusHtml}</td>
            </tr>
        `;
    });
}

function filterLogs() {
    const status = document.getElementById('logStatusFilter').value;
    renderLogs(status);
}

function clearLogs() {
    if(confirm('Yakin ingin membersihkan semua histori aktivitas?')) {
        activityLogs = [];
        renderLogs();
    }
}
