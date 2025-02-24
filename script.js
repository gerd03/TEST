document.addEventListener("DOMContentLoaded", function() {
    loadHistory();
});

document.getElementById("generateBtn").addEventListener("click", function() {
    const plateNumber = document.getElementById("plateNumber").value;
    const vehicleType = document.getElementById("vehicleType").value;
    const fuelType = document.getElementById("fuelType").value;

    if (!plateNumber) {
        alert("Please enter a plate number.");
        return;
    }

    const loadingAnimation = document.getElementById("loadingAnimation");
    const testResultDiv = document.getElementById("testResult");

    loadingAnimation.classList.remove("hidden");
    testResultDiv.classList.add("hidden");

    setTimeout(() => {
        loadingAnimation.classList.add("hidden");

        const testDate = getRandomTestDate();
        const expirationDate = new Date(testDate);
        expirationDate.setDate(expirationDate.getDate() + 61);

        const formattedTestDate = formatDate(testDate);
        const formattedExpiration = formatDate(expirationDate);

        const certificateNumber = "202507267000" + getRandomNumber(340, 450);
        const referenceCode = certificateNumber.slice(-3);
        const authenticationCode = generateAuthCode();

        let testResults = `
            <p><strong>DATE & TIME:</strong> ${formattedTestDate}</p>
            <p><strong>CERTIFICATE NUMBER:</strong> ${certificateNumber}</p>
            <p><strong>REFERENCE CODE:</strong> ${referenceCode}</p>
            <p><strong>AUTHENTICATION CODE:</strong> 2D${authenticationCode}0630C</p>
            <p><strong>EXPIRATION DATE:</strong> ${formattedExpiration}</p>
        `;

        if (vehicleType === "Motorcycle") {
            testResults += `
                <p><strong>CARBON MONOXIDE (CO):</strong> ${getRandomValue(0.04, 0.1)}</p>
                <p><strong>HYDROCARBONS (HC):</strong> ${getRandomInteger(200, 242)}</p>
                <p><strong>OPACITY (SMOKE DENSITY):</strong> ${getRandomValue(0.04, 0.08)}</p>
            `;
        } else {
            testResults += `
                <p><strong>OPACITY (SMOKE DENSITY):</strong> ${getRandomValue(0.52, 0.56)}</p>
            `;
        }

        testResultDiv.innerHTML = testResults;
        testResultDiv.classList.remove("hidden");

        saveToHistory(plateNumber, testResults);

    }, 2000);
});

function getRandomTestDate() {
    const randomDay = Math.floor(Math.random() * (23 - 1 + 1)) + 1; 
    return new Date(2025, 1, randomDay);
}

function formatDate(date) {
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAuthCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 15; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function getRandomValue(min, max) {
    return (Math.random() * (max - min) + min).toFixed(3);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveToHistory(plateNumber, details) {
    let history = JSON.parse(localStorage.getItem("testHistory")) || [];
    history.push({ plateNumber, details });
    localStorage.setItem("testHistory", JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    const history = JSON.parse(localStorage.getItem("testHistory")) || [];

    history.forEach((record) => {
        const listItem = document.createElement("li");
        listItem.textContent = record.plateNumber;
        listItem.addEventListener("click", function() {
            document.getElementById("testResult").innerHTML = record.details;
        });
        historyList.appendChild(listItem);
    });
}

document.getElementById("clearHistory").addEventListener("click", function() {
    localStorage.removeItem("testHistory");
    loadHistory();
});
