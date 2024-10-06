document.getElementById('donationForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission

    // Extract form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById('gender').value;
    const bloodType = document.getElementById('bloodType').value;
    const dob = document.getElementById('dob').value;
    const donationDay = document.getElementById('donationDay').value;
    const residence = document.getElementById('residence').value;

    // Validation
    const age = calculateAge(dob);
    if (!validateName(firstName, lastName) || !validateAge(age)) {
        return;
    }

    // If age is over 65, show a message and stop further processing
    if (age > 65) {
        document.getElementById('errorMessage').textContent = 
            `Donation is not allowed for those over 65, but you can undergo a blood test.`;
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }

    document.getElementById('errorMessage').style.display = 'none';

    // Calculate blood amount
    let bloodAmount = calculateBloodAmount(age, gender);
    let time;
    let successMessage;

    // Determine the message based on the day
    if (donationDay === "Sunday") {
        time = "11:30";
        successMessage = `Grazie, ${firstName} ${lastName} per aver prenotato il tuo prelievo. Puoi presentarti alle ${time} presso il centro prelievi di Bergamo. E’ previsto il prelievo di ${bloodAmount} cc di sangue.`;
    } else if (["Monday", "Wednesday", "Friday"].includes(donationDay)) {
        time = "10:30";
        successMessage = `Grazie, ${firstName} ${lastName} per aver prenotato il tuo prelievo. Puoi presentarti alle ${time} presso il centro prelievi di ${residence}. E’ previsto il prelievo di ${bloodAmount} cc di sangue.`;
    } else if (["Tuesday", "Thursday", "Saturday"].includes(donationDay)) {
        time = "8:30";
        successMessage = `Grazie, ${firstName} ${lastName} per aver prenotato il tuo prelievo. Puoi presentarti alle ${time} presso il centro prelievi di ${residence}. E’ previsto il prelievo di ${bloodAmount} cc di sangue.`;
    }

    // Display success message
    document.getElementById('successMessage').textContent = successMessage;
    document.getElementById('successMessage').style.display = 'block';

    // Display blood amount visual
    displayBloodAmountVisual(bloodAmount, bloodType);
});

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function calculateBloodAmount(age, gender) {
    let bloodAmount;
    if (age >= 18 && age < 25) bloodAmount = 150;
    else if (age >= 25 && age < 35) bloodAmount = 250;
    else if (age >= 35 && age <= 65) bloodAmount = 200;
    
    // Halve the blood amount if the donor is female
    if (gender === "Female") bloodAmount /= 2;

    return bloodAmount;
}

function displayBloodAmountVisual(bloodAmount, bloodType) {
    const bloodVisual = document.getElementById('bloodVisual');
    bloodVisual.innerHTML = '';  // Clear previous visual

    for (let i = 0; i < bloodAmount / 10; i++) {
        const circle = document.createElement('span');
        circle.className = `circle blood-${bloodType.toLowerCase()}`;
        circle.textContent = 'o';
        bloodVisual.appendChild(circle);
    }
}

// Validation for name and surname using regular expression
function validateName(firstName, lastName) {
    const namePattern = /^[a-zA-ZàèéìòùÀÈÉÌÒÙ'\- ]+$/;  // Regex pattern to allow letters, apostrophes, hyphens, and spaces

    if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        document.getElementById('errorMessage').textContent = 
            `Name and surname must only contain letters, spaces, apostrophes, and hyphens.`;
        document.getElementById('errorMessage').style.display = 'block';
        return false;
    }

    if (firstName.length < 2 || lastName.length < 2) {
        document.getElementById('errorMessage').textContent = 
            `First name and last name must have at least 2 characters each.`;
        document.getElementById('errorMessage').style.display = 'block';
        return false;
    }
    return true;
}

function validateAge(age) {
    if (age < 18 || age > 110) {
        document.getElementById('errorMessage').textContent = 
            `Age must be between 18 and 110 years.`;
        document.getElementById('errorMessage').style.display = 'block';
        return false;
    }
    return true;
}
