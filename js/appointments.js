document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newAppointmentBtn = document.getElementById('new-appointment-btn');
    const newAppointmentModal = document.getElementById('new-appointment-modal');
    const appointmentDetailsModal = document.getElementById('appointment-details-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const viewPanes = document.querySelectorAll('.view-pane');
    const newAppointmentForm = document.getElementById('new-appointment-form');
    const appointmentDateInput = document.getElementById('appointment-date');
    const appointmentTimeSelect = document.getElementById('appointment-time');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthEl = document.getElementById('current-month');
    const calendarDaysEl = document.getElementById('calendar-days');
    const appointmentCardsContainer = document.querySelector('.appointment-cards');
    const appointmentsTableBody = document.querySelector('.appointments-table tbody');

    // Sample Data
    const appointments = [
        {
            id: 'apt-001',
            date: '2023-11-30',
            time: '10:00 AM',
            doctor: 'Dr. Smith',
            specialty: 'Cardiology',
            type: 'Follow-up',
            status: 'upcoming',
            reason: 'Cardiac checkup after medication adjustment'
        },
        {
            id: 'apt-002',
            date: '2023-12-05',
            time: '2:30 PM',
            doctor: 'Dr. Johnson',
            specialty: 'Primary Care',
            type: 'Annual Checkup',
            status: 'upcoming',
            reason: 'Routine annual physical examination'
        },
        {
            id: 'apt-003',
            date: '2023-11-15',
            time: '9:00 AM',
            doctor: 'Dr. Williams',
            specialty: 'Neurology',
            type: 'Consultation',
            status: 'completed',
            reason: 'Headache evaluation'
        }
    ];

    // Initialize date picker
    flatpickr(appointmentDateInput, {
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: function(selectedDates) {
            updateAvailableTimes(selectedDates[0]);
        }
    });

    // Event Listeners
    newAppointmentBtn.addEventListener('click', () => {
        newAppointmentModal.style.display = 'flex';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            newAppointmentModal.style.display = 'none';
            appointmentDetailsModal.style.display = 'none';
        });
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all view panes
            viewPanes.forEach(pane => pane.classList.remove('active'));
            // Show the selected view pane
            const viewId = button.getAttribute('data-view');
            document.getElementById(`${viewId}-view`).classList.add('active');
            
            // If calendar view is selected, render calendar
            if (viewId === 'calendar') {
                renderCalendar(currentMonth, currentYear);
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === newAppointmentModal || e.target === appointmentDetailsModal) {
            e.target.style.display = 'none';
        }
    });

    newAppointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        scheduleAppointment();
    });

    // Calendar Navigation
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Initialize the page
    renderAppointmentCards();
    renderAppointmentsTable();
    renderCalendar(currentMonth, currentYear);

    // Functions
    function renderAppointmentCards() {
        const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
        
        appointmentCardsContainer.innerHTML = upcomingAppointments.map(appointment => `
            <div class="appointment-card" data-id="${appointment.id}">
                <div class="appointment-card-header">
                    <span class="appointment-date">${formatDate(appointment.date)}</span>
                    <span class="appointment-status status-${appointment.status}">${appointment.status}</span>
                </div>
                <div class="appointment-details">
                    <h3 class="appointment-doctor">${appointment.doctor}</h3>
                    <p class="appointment-specialty">${appointment.specialty}</p>
                    <p class="appointment-time">
                        <i class="fas fa-clock"></i> ${appointment.time}
                    </p>
                    <p class="appointment-type">${appointment.type}</p>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-outline view-btn">View</button>
                    <button class="btn btn-outline cancel-btn">Cancel</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const appointmentId = this.closest('.appointment-card').getAttribute('data-id');
                showAppointmentDetails(appointmentId);
            });
        });
    }

    function renderAppointmentsTable() {
        const pastAppointments = appointments.filter(apt => apt.status === 'completed');
        
        appointmentsTableBody.innerHTML = pastAppointments.map(appointment => `
            <tr data-id="${appointment.id}">
                <td>${formatDate(appointment.date)}</td>
                <td>${appointment.doctor}</td>
                <td>${appointment.specialty}</td>
                <td><span class="appointment-status status-${appointment.status}">${appointment.status}</span></td>
                <td>
                    <button class="btn-icon view-btn"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon download-btn"><i class="fas fa-file-download"></i></button>
                </td>
            </tr>
        `).join('');

        // Add event listeners to the view buttons
        document.querySelectorAll('.appointments-table .view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const appointmentId = this.closest('tr').getAttribute('data-id');
                showAppointmentDetails(appointmentId);
            });
        });
    }

    function renderCalendar(month, year) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        currentMonthEl.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
        
        let calendarHTML = '';
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            calendarHTML += `<div class="calendar-day empty"></div>`;
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = currentDate.toDateString() === new Date().toDateString();
            
            // Find appointments for this day
            const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getDate() === day && 
                       aptDate.getMonth() === month && 
                       aptDate.getFullYear() === year;
            });
            
            calendarHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}">
                    <div class="calendar-day-number">${day}</div>
                    ${dayAppointments.map(apt => `
                        <div class="calendar-event" data-id="${apt.id}">
                            ${apt.time} - ${apt.doctor}
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        calendarDaysEl.innerHTML = calendarHTML;
        
        // Add event listeners to calendar events
        document.querySelectorAll('.calendar-event').forEach(event => {
            event.addEventListener('click', function() {
                const appointmentId = this.getAttribute('data-id');
                showAppointmentDetails(appointmentId);
            });
        });
    }

    function showAppointmentDetails(appointmentId) {
        const appointment = appointments.find(apt => apt.id === appointmentId);
        
        if (appointment) {
            document.getElementById('detail-date').textContent = formatDate(appointment.date);
            document.getElementById('detail-time').textContent = appointment.time;
            document.getElementById('detail-doctor').textContent = appointment.doctor;
            document.getElementById('detail-type').textContent = appointment.type;
            document.getElementById('detail-status').textContent = appointment.status;
            document.getElementById('detail-reason').textContent = appointment.reason;
            
            appointmentDetailsModal.style.display = 'flex';
        }
    }

    function updateAvailableTimes(selectedDate) {
        // In a real app, this would fetch available times from the server
        // For demo purposes, we'll generate some sample times
        const times = [
            '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
            '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'
        ];
        
        appointmentTimeSelect.innerHTML = '<option value="">Select time</option>';
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            appointmentTimeSelect.appendChild(option);
        });
    }

    function scheduleAppointment() {
        const formData = {
            type: document.getElementById('appointment-type').value,
            doctor: document.getElementById('appointment-doctor').value,
            date: document.getElementById('appointment-date').value,
            time: document.getElementById('appointment-time').value,
            reason: document.getElementById('appointment-reason').value
        };
        
        // In a real app, this would send data to the server
        console.log('Scheduling appointment:', formData);
        
        // For demo purposes, we'll add it to our local array
        const newAppointment = {
            id: 'apt-' + (appointments.length + 1),
            date: formData.date,
            time: formData.time,
            doctor: formData.doctor === 'dr-smith' ? 'Dr. Smith' : 'Dr. Johnson',
            specialty: formData.doctor === 'dr-smith' ? 'Cardiology' : 'Primary Care',
            type: formData.type,
            status: 'upcoming',
            reason: formData.reason
        };
        
        appointments.push(newAppointment);
        
        // Update the UI
        renderAppointmentCards();
        renderCalendar(currentMonth, currentYear);
        
        // Close the modal and reset the form
        newAppointmentModal.style.display = 'none';
        newAppointmentForm.reset();
        
        alert('Appointment scheduled successfully!');
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});