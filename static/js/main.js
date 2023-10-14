// Fetch the data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);

// Fetch data from the Flask backend
function fetchData() {
    fetch('http://127.0.0.1:5000/fetchData')
        .then(response => response.json())
        .then(data => {
            renderTable(data.records);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please check the console for more details.');
        });
        
}

// Dynamically populate the table with the fetched data
function renderTable(records) {
    const table = document.getElementById('resourcesTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Assuming all records have the same fields
    const headers = Object.keys(records[0].fields);
    thead.innerHTML = '<tr>' + headers.map(header => `<th>${header}</th>`).join('') + '</tr>';

    tbody.innerHTML = records.map(record => {
        return '<tr>' + headers.map(header => `<td>${record.fields[header] || ''}</td>`).join('') + '</tr>';
    }).join('');
}
