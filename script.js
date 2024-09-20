document.addEventListener('DOMContentLoaded', function () {
    // Destination dropdown functionality
    const destButton = document.getElementById('destButton');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
    const destinationInput = document.getElementById('destination');

    // Show popup when clicking on "Select Destination" button
    destButton.addEventListener('click', function () {
        popup.style.display = 'block';
    });

    // Close popup when clicking on the close button
    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Handle destination selection
    const destinationItems = document.querySelectorAll('#popup ul li');
    destinationItems.forEach(item => {
        item.addEventListener('click', function () {
            destinationInput.value = item.textContent;
            popup.style.display = 'none';  // Close the popup after selection
        });
    });

    // Days counter functionality
    const daysCount = document.getElementById('daysCount');
    let days = 2;  // Default days set to 2

    // Increase days
    document.getElementById('increaseDays').addEventListener('click', function () {
        days++;
        daysCount.textContent = `${days} days`;
    });

    // Decrease days
    document.getElementById('decreaseDays').addEventListener('click', function () {
        if (days > 1) {  // Minimum trip duration is 1 day
            days--;
            daysCount.textContent = `${days} days`;
        }
    });

    // Handle option selection (e.g., whom you're going with, budget, interests)
    const selectionOptions = document.querySelectorAll('.options-group .option');
    selectionOptions.forEach(option => {
        option.addEventListener('click', function () {
            const parentGroup = this.parentElement;
            parentGroup.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Itinerary generation and PDF download
    const generateButton = document.getElementById('generateButton');
    generateButton.addEventListener('click', function () {
        const selectedDestination = document.getElementById('destination').value;
        const daysSelected = days;
        const goingWith = document.querySelector('#withGroup .selected');
        const budget = document.querySelector('#budgetGroup .selected');
        const interests = document.querySelectorAll('#interestGroup .selected');

        // Validation check to make sure all fields are selected
        if (!selectedDestination || !goingWith || !budget || interests.length === 0) {
            alert("Please fill in all the fields.");
            highlightEmptyFields(selectedDestination, goingWith, budget, interests);
            return;
        }

        // Generate the itinerary based on user selections
        const itinerary = generateItinerary(selectedDestination, daysSelected, goingWith.textContent, budget.textContent, interests);
        generatePDF(itinerary);  // Generate and download PDF

        alert("Your itinerary PDF has been generated!");
    });

    // Function to generate itinerary details
    function generateItinerary(destination, days, who, budget, interests) {
        // Some pre-defined places for each destination
        const places = {
            "Paris, France": ["Eiffel Tower", "Louvre Museum", "Notre Dame"],
            "Tokyo, Japan": ["Shibuya Crossing", "Tokyo Tower", "Meiji Shrine"],
            "New York, USA": ["Statue of Liberty", "Central Park", "Empire State Building"],
            "Maldives": ["Male Island", "Vaadhoo Island", "Banana Reef"],
            "Rome, Italy": ["Colosseum", "Vatican Museums", "Trevi Fountain"]
        };

        const selectedPlaces = places[destination];
        let itinerary = `Itinerary for your trip to ${destination}:\n\n`;
        for (let day = 1; day <= days; day++) {
            itinerary += `Day ${day}: Visit ${selectedPlaces[(day - 1) % selectedPlaces.length]}\n`;
        }
        itinerary += `\nYou are traveling with: ${who}\n`;
        itinerary += `Budget preference: ${budget}\n`;
        itinerary += `Interests: ${Array.from(interests).map(i => i.textContent).join(', ')}\n`;

        return itinerary;
    }

    // Function to generate PDF using jsPDF
    function generatePDF(itinerary) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(itinerary, 10, 10);
        doc.save('Itinerary.pdf');
    }

    // Function to highlight empty fields
    function highlightEmptyFields(destination, who, budget, interests) {
        if (!destination) {
            destinationInput.style.border = '2px solid red';
        }
        if (!who) {
            document.getElementById('withGroup').style.border = '2px solid red';
        }
        if (!budget) {
            document.getElementById('budgetGroup').style.border = '2px solid red';
        }
        if (interests.length === 0) {
            document.getElementById('interestGroup').style.border = '2px solid red';
        }

        // Remove border highlight after selection
        setTimeout(() => {
            destinationInput.style.border = '';
            document.getElementById('withGroup').style.border = '';
            document.getElementById('budgetGroup').style.border = '';
            document.getElementById('interestGroup').style.border = '';
        }, 2000);
    }
});
