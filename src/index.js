document.addEventListener('DOMContentLoaded', () => {

})
// src/index.js

document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
    let editingDogId = null;

    // Fetch and render dogs on page load
    fetchDogs();

    // Handle form submission
    dogForm.addEventListener('submit', handleFormSubmit);

    function fetchDogs() {
        fetch('http://localhost:3000/dogs')
            .then(response => response.json())
            .then(dogs => renderDogs(dogs))
            .catch(error => console.error('Error fetching dogs:', error));
    }

    function renderDogs(dogs) {
        tableBody.innerHTML = ''; // Clear existing rows
        dogs.forEach(dog => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${dog.name}</td>
                <td>${dog.breed}</td>
                <td>${dog.sex}</td>
                <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', handleEditClick);
        });
    }

    function handleEditClick(event) {
        const dogId = event.target.dataset.id;
        editingDogId = dogId;

        // Fetch the specific dog's data
        fetch(`http://localhost:3000/dogs/${dogId}`)
            .then(response => response.json())
            .then(dog => {
                // Populate form with dog's current information
                dogForm.name.value = dog.name;
                dogForm.breed.value = dog.breed;
                dogForm.sex.value = dog.sex;
            })
            .catch(error => console.error('Error fetching dog:', error));
    }

    function handleFormSubmit(event) {
        event.preventDefault();

        if (!editingDogId) return;

        const updatedDog = {
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value
        };

        // Send PATCH request to update dog
        fetch(`http://localhost:3000/dogs/${editingDogId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedDog)
        })
        .then(response => response.json())
        .then(() => {
            // Reset form and editing ID
            dogForm.reset();
            editingDogId = null;
            // Refresh the dog list
            fetchDogs();
        })
        .catch(error => console.error('Error updating dog:', error));
    }
});