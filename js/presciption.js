document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const requestRefillButtons = document.querySelectorAll('.request-refill-btn');
    const renewPrescriptionButtons = document.querySelectorAll('.renew-prescription-btn');
    const newPrescriptionBtn = document.getElementById('new-prescription-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    const prescriptionDetailsModal = document.getElementById('prescription-details-modal');
    const newPrescriptionModal = document.getElementById('new-prescription-modal');
    const newPrescriptionForm = document.getElementById('new-prescription-form');
    const statusFilter = document.getElementById('status-filter');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Sample prescription data (in a real app, this would come from an API)
    const prescriptionsData = {
        'velaula': {
            name: 'Velaula E8 75mg',
            prescriber: 'Dr. Emma Silver',
            date: 'Jan 15, 2024',
            dosage: '1 tablet daily',
            purpose: 'For management of type 2 diabetes',
            refills: 2,
            expiration: 'Apr 15, 2024',
            pharmacy: 'CVS Pharmacy - Main Street',
            notes: 'Take with morning meal. May cause mild dizziness. Avoid alcohol while taking this medication.',
            status: 'active'
        },
        'metformin': {
            name: 'Metformin 500mg',
            prescriber: 'Dr. Nick Brown',
            date: 'Dec 5, 2023',
            dosage: '2 tablets daily (morning and evening)',
            purpose: 'For management of type 2 diabetes',
            refills: 0,
            expiration: 'Mar 5, 2024',
            pharmacy: 'Walgreens - Oak Avenue',
            notes: 'Take with food to reduce stomach upset. Stay well hydrated while taking this medication.',
            status: 'active'
        },
        'lisinopril': {
            name: 'Lisinopril 10mg',
            prescriber: 'Dr. Anna Lopez',
            date: 'Aug 20, 2023',
            dosage: '1 tablet daily in the morning',
            purpose: 'For high blood pressure management',
            refills: 0,
            expiration: 'Nov 20, 2023',
            pharmacy: 'Rite Aid - Downtown',
            notes: 'Monitor blood pressure regularly. Report any persistent dry cough to your doctor.',
            status: 'expired'
        }
    };

    // Event Listeners
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prescriptionCard = this.closest('.prescription-card');
            const medicationName = prescriptionCard.querySelector('h3').textContent.toLowerCase().split(' ')[0];
            showPrescriptionDetails(medicationName);
        });
    });

    requestRefillButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const prescriptionCard = this.closest('.prescription-card');
            const medicationName = prescriptionCard.querySelector('h3').textContent;
            requestRefill(medicationName);
        });
    });

    renewPrescriptionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const prescriptionCard = this.closest('.prescription-card');
            const medicationName = prescriptionCard.querySelector('h3').textContent;
            renewPrescription(medicationName);
        });
    });

    newPrescriptionBtn.addEventListener('click', function() {
        newPrescriptionModal.style.display = 'flex';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            prescriptionDetailsModal.style.display = 'none';
            newPrescriptionModal.style.display = 'none';
        });
    });

    cancelBtn.addEventListener('click', function() {
        newPrescriptionModal.style.display = 'none';
    });

    statusFilter.addEventListener('change', filterPrescriptions);

    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === prescriptionDetailsModal) {
            prescriptionDetailsModal.style.display = 'none';
        }
        if (event.target === newPrescriptionModal) {
            newPrescriptionModal.style.display = 'none';
        }
    });

    // Form submission
    newPrescriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitNewPrescriptionRequest();
    });

    // Functions
    function showPrescriptionDetails(medicationKey) {
        const prescription = prescriptionsData[medicationKey];
        
        if (prescription) {
            document.getElementById('modal-prescription-name').textContent = prescription.name;
            document.getElementById('modal-medication').textContent = prescription.name;
            document.getElementById('modal-prescriber').textContent = prescription.prescriber;
            document.getElementById('modal-date').textContent = prescription.date;
            document.getElementById('modal-dosage').textContent = prescription.dosage;
            document.getElementById('modal-purpose').textContent = prescription.purpose;
            document.getElementById('modal-refills').textContent = prescription.refills;
            document.getElementById('modal-expiration').textContent = prescription.expiration;
            document.getElementById('modal-pharmacy').textContent = prescription.pharmacy;
            document.getElementById('modal-notes').textContent = prescription.notes;
            
            prescriptionDetailsModal.style.display = 'flex';
        }
    }

    function requestRefill(medicationName) {
        // In a real app, this would send a request to the server
        console.log(`Requesting refill for ${medicationName}`);
        alert(`Refill request for ${medicationName} has been submitted to your pharmacy.`);
    }

    function renewPrescription(medicationName) {
        // In a real app, this would send a request to the doctor
        console.log(`Requesting renewal for ${medicationName}`);
        alert(`Renewal request for ${medicationName} has been sent to your doctor.`);
    }

    function filterPrescriptions() {
        const status = statusFilter.value;
        const prescriptionCards = document.querySelectorAll('.prescription-card');
        
        prescriptionCards.forEach(card => {
            if (status === 'all') {
                card.style.display = 'block';
            } else {
                const cardStatus = card.classList.contains(status) ? status : 'other';
                card.style.display = cardStatus === status ? 'block' : 'none';
            }
        });
    }

    function submitNewPrescriptionRequest() {
        const medicationName = document.getElementById('medication-name').value;
        const prescriber = document.getElementById('prescriber').options[document.getElementById('prescriber').selectedIndex].text;
        const dosage = document.getElementById('dosage').value;
        const purpose = document.getElementById('purpose').value;
        const pharmacy = document.getElementById('pharmacy').options[document.getElementById('pharmacy').selectedIndex].text;
        
        // In a real app, this would send the data to the server
        console.log('New prescription request:', {
            medicationName,
            prescriber,
            dosage,
            purpose,
            pharmacy
        });
        
        alert(`Your request for ${medicationName} has been submitted to ${prescriber}.`);
        newPrescriptionModal.style.display = 'none';
        newPrescriptionForm.reset();
        
        // Simulate adding to UI (in a real app, this would come from the server response)
        // This is just for demonstration
        setTimeout(() => {
            alert(`New prescription for ${medicationName} has been approved by ${prescriber} and is now available under Current Prescriptions.`);
        }, 2000);
    }

    // Initialize
    filterPrescriptions();
});