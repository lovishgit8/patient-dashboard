document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation functionality
    const menuItems = document.querySelectorAll('.main-menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Here you would typically load the appropriate content
            // For this example, we're just showing the dashboard
        });
    });
    
    // Simulate loading data (in a real app, this would come from an API)
    simulateDataLoading();
    
    // Add event listeners for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Button click handling would go here
            console.log('Button clicked:', this.textContent);
        });
    });
    
    // Notification bell click
    document.querySelector('.notifications').addEventListener('click', function() {
        alert('You have 3 new notifications');
    });
});

function simulateDataLoading() {
    // In a real application, this would be API calls to your backend
    console.log('Loading data from server...');
    
    // Simulate loading appointments
    setTimeout(() => {
        console.log('Appointments data loaded');
    }, 500);
    
    // Simulate loading medications
    setTimeout(() => {
        console.log('Medications data loaded');
    }, 800);
    
    // Simulate loading test results
    setTimeout(() => {
        console.log('Test results loaded');
    }, 1200);
}