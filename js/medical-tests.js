document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const viewTestButtons = document.querySelectorAll('.view-test-btn');
    const downloadButtons = document.querySelectorAll('.download-btn');
    const newTestBtn = document.getElementById('new-test-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal, .close-modal-btn');
    const testDetailsModal = document.getElementById('test-details-modal');
    const newTestModal = document.getElementById('new-test-modal');
    const newTestForm = document.getElementById('new-test-form');
    const testTypeFilter = document.getElementById('test-type-filter');
    const timeFilter = document.getElementById('time-filter');
    const testTypeSelect = document.getElementById('test-type');
    const specificTestSelect = document.getElementById('specific-test');
    const testPreferenceSelect = document.getElementById('test-preference');
    const specificDateGroup = document.getElementById('specific-date-group');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Sample test data
    const testsData = {
        'BT2023-0456': {
            name: 'Complete Blood Count',
            type: 'blood',
            date: 'Nov 15, 2023',
            doctor: 'Dr. Emma Silver',
            location: 'Main Hospital Lab',
            status: 'completed',
            results: [
                { parameter: 'WBC', value: '6.5', unit: '10^3/μL', range: '4.0-11.0', status: 'normal' },
                { parameter: 'RBC', value: '4.7', unit: '10^6/μL', range: '4.2-5.9', status: 'normal' },
                { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '12.0-16.0', status: 'normal' },
                { parameter: 'Hematocrit', value: '42.5', unit: '%', range: '37.0-47.0', status: 'normal' },
                { parameter: 'Platelets', value: '225', unit: '10^3/μL', range: '150-450', status: 'normal' }
            ],
            notes: 'All parameters within normal range. No abnormalities detected.'
        },
        'IMG2023-0789': {
            name: 'X-Ray Chest PA View',
            type: 'imaging',
            date: 'Nov 10, 2023',
            doctor: 'Dr. Nick Brown',
            location: 'Radiology Department',
            status: 'completed',
            results: [
                { parameter: 'Findings', value: 'No acute cardiopulmonary abnormality', unit: '', range: '', status: 'normal' },
                { parameter: 'Impression', value: 'Normal chest X-ray', unit: '', range: '', status: 'normal' }
            ],
            notes: 'No evidence of pneumonia, pneumothorax, or pleural effusion. Heart size normal.'
        },
        'BT2023-0455': {
            name: 'Lipid Profile',
            type: 'blood',
            date: 'Nov 5, 2023',
            doctor: 'Dr. Anna Lopez',
            location: 'Main Hospital Lab',
            status: 'completed',
            results: [
                { parameter: 'Total Cholesterol', value: '210', unit: 'mg/dL', range: '<200', status: 'abnormal' },
                { parameter: 'LDL Cholesterol', value: '145', unit: 'mg/dL', range: '<100', status: 'abnormal' },
                { parameter: 'HDL Cholesterol', value: '45', unit: 'mg/dL', range: '>40', status: 'normal' },
                { parameter: 'Triglycerides', value: '180', unit: 'mg/dL', range: '<150', status: 'abnormal' }
            ],
            notes: 'Elevated LDL and total cholesterol noted. Recommend dietary modifications and follow-up in 3 months.'
        },
        'UT2023-0321': {
            name: 'Urinalysis',
            type: 'urine',
            date: 'Nov 1, 2023',
            doctor: 'Dr. Emma Silver',
            location: 'Main Hospital Lab',
            status: 'completed',
            results: [
                { parameter: 'Color', value: 'Yellow', unit: '', range: 'Yellow', status: 'normal' },
                { parameter: 'Appearance', value: 'Clear', unit: '', range: 'Clear', status: 'normal' },
                { parameter: 'pH', value: '6.0', unit: '', range: '5.0-8.0', status: 'normal' },
                { parameter: 'Protein', value: 'Negative', unit: '', range: 'Negative', status: 'normal' },
                { parameter: 'Glucose', value: 'Negative', unit: '', range: 'Negative', status: 'normal' }
            ],
            notes: 'Normal urinalysis results. No signs of infection or abnormality.'
        },
        'BT2023-0444': {
            name: 'HbA1c',
            type: 'blood',
            date: 'Oct 25, 2023',
            doctor: 'Dr. Nick Brown',
            location: 'Main Hospital Lab',
            status: 'completed',
            results: [
                { parameter: 'HbA1c', value: '8.5', unit: '%', range: '4.0-5.6', status: 'critical' }
            ],
            notes: 'Elevated HbA1c indicates poor glucose control over past 3 months. Urgent follow-up recommended to adjust diabetes management plan.'
        }
    };

    // Test type options
    const testTypeOptions = {
        'blood': [
            'Complete Blood Count',
            'Lipid Profile',
            'HbA1c',
            'Basic Metabolic Panel',
            'Comprehensive Metabolic Panel',
            'Liver Function Test',
            'Thyroid Function Test'
        ],
        'imaging': [
            'X-Ray Chest PA View',
            'MRI Brain',
            'CT Abdomen',
            'Ultrasound Abdomen',
            'Mammogram',
            'Bone Density Scan'
        ],
        'urine': [
            'Urinalysis',
            'Urine Culture',
            'Microalbumin Urine Test',
            '24-Hour Urine Collection'
        ],
        'other': [
            'ECG',
            'Stress Test',
            'Pulmonary Function Test',
            'Allergy Test'
        ]
    };

    // Initialize Charts
    initTestTimelineChart();
    initTestTypesChart();

    // Event Listeners
    viewTestButtons.forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.closest('tr').querySelector('td:first-child').textContent;
            showTestDetails(testId);
        });
    });

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const testId = this.closest('tr').querySelector('td:first-child').textContent;
            downloadTestResults(testId);
        });
    });

    newTestBtn.addEventListener('click', function() {
        newTestModal.style.display = 'flex';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            testDetailsModal.style.display = 'none';
            newTestModal.style.display = 'none';
        });
    });

    cancelBtn.addEventListener('click', function() {
        newTestModal.style.display = 'none';
    });

    testTypeFilter.addEventListener('change', filterTests);
    timeFilter.addEventListener('change', filterTests);

    testTypeSelect.addEventListener('change', function() {
        updateSpecificTestOptions(this.value);
    });

    testPreferenceSelect.addEventListener('change', function() {
        specificDateGroup.style.display = this.value === 'specific' ? 'block' : 'none';
    });

    newTestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitNewTestRequest();
    });

    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === testDetailsModal) {
            testDetailsModal.style.display = 'none';
        }
        if (event.target === newTestModal) {
            newTestModal.style.display = 'none';
        }
    });

    // Functions
    function initTestTimelineChart() {
        const ctx = document.getElementById('tests-timeline-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Blood Tests',
                    data: [2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 0],
                    borderColor: '#4a6fa5',
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Imaging Tests',
                    data: [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                    borderColor: '#ff7e5f',
                    backgroundColor: 'rgba(255, 126, 95, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Urine Tests',
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Tests Performed Over Time',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Tests'
                        }
                    }
                }
            }
        });
    }

    function initTestTypesChart() {
        const ctx = document.getElementById('test-types-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Blood Tests', 'Imaging Tests', 'Urine Tests', 'Other Tests'],
                datasets: [{
                    data: [12, 5, 8, 3],
                    backgroundColor: [
                        '#4a6fa5',
                        '#ff7e5f',
                        '#28a745',
                        '#6c757d'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Test Types Distribution',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    function showTestDetails(testId) {
        const test = testsData[testId];
        
        if (test) {
            // Set basic test info
            document.getElementById('modal-test-name').textContent = test.name;
            document.getElementById('modal-test-id').textContent = testId;
            document.getElementById('modal-test-date').textContent = test.date;
            document.getElementById('modal-test-doctor').textContent = test.doctor;
            document.getElementById('modal-test-location').textContent = test.location;
            document.getElementById('modal-test-status').textContent = test.status.charAt(0).toUpperCase() + test.status.slice(1);
            document.getElementById('modal-test-notes').textContent = test.notes;
            
            // Populate results table
            const resultsTable = document.getElementById('modal-results-table');
            resultsTable.innerHTML = `
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Reference Range</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${test.results.map(result => `
                        <tr>
                            <td>${result.parameter}</td>
                            <td>${result.value}</td>
                            <td>${result.unit}</td>
                            <td>${result.range}</td>
                            <td>
                                <span class="status ${result.status}">
                                    ${result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            
            // Show the modal
            testDetailsModal.style.display = 'flex';
        }
    }

    function downloadTestResults(testId) {
        // In a real app, this would download the actual test report
        console.log(`Downloading test results for ${testId}`);
        alert(`Downloading test results for ${testId}`);
    }

    function filterTests() {
        const typeFilter = testTypeFilter.value;
        const timeFilterValue = timeFilter.value;
        
        // In a real app, this would filter the actual data from the server
        console.log(`Filtering tests by type: ${typeFilter} and time: ${timeFilterValue}`);
    }

    function updateSpecificTestOptions(testType) {
        specificTestSelect.innerHTML = '<option value="">Select specific test</option>';
        
        if (testType && testTypeOptions[testType]) {
            testTypeOptions[testType].forEach(test => {
                const option = document.createElement('option');
                option.value = test.toLowerCase().replace(/\s+/g, '-');
                option.textContent = test;
                specificTestSelect.appendChild(option);
            });
        }
    }

    function submitNewTestRequest() {
        const testType = testTypeSelect.options[testTypeSelect.selectedIndex].text;
        const specificTest = specificTestSelect.options[specificTestSelect.selectedIndex].text;
        const reason = document.getElementById('test-reason').value;
        const doctor = document.getElementById('test-doctor').options[document.getElementById('test-doctor').selectedIndex].text;
        const preference = testPreferenceSelect.options[testPreferenceSelect.selectedIndex].text;
        const date = testPreferenceSelect.value === 'specific' ? document.getElementById('test-date').value : 'N/A';
        
        // In a real app, this would send the data to the server
        console.log('New test request:', {
            testType,
            specificTest,
            reason,
            doctor,
            preference,
            date
        });
        
        alert(`Your request for ${specificTest} has been submitted to ${doctor}.`);
        newTestModal.style.display = 'none';
        newTestForm.reset();
        
        // Simulate adding to UI (in a real app, this would come from the server response)
        setTimeout(() => {
            alert(`Your ${specificTest} has been scheduled. You'll receive a confirmation shortly.`);
        }, 2000);
    }

    // Initialize specific test options
    updateSpecificTestOptions(testTypeSelect.value);
});