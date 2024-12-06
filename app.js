const express = require('express');
const app = express();

let timerMessage = ''; // Store the timer status

app.use(express.urlencoded({ extended: true })); // Parse form data

// Serve the HTML form and the frontend logic
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Timer App</title>
        </head>
        <body>
            <h1>Enter a Number to Start the Timer</h1>
            <form action="/start-timer" method="POST">
                <label for="duration">Duration (in seconds):</label>
                <input type="number" id="duration" name="duration" required>
                <button type="submit">Start Timer</button>
            </form>
            <h2 id="status">${timerMessage}</h2>

            <script>
                // Poll the server every second to get the timer status
                setInterval(async () => {
                    const response = await fetch('/status');
                    const data = await response.json();
                    document.getElementById('status').innerText = data.message || '';
                }, 1000);
            </script>
        </body>
        </html>
    `);
});

// Handle the timer logic
app.post('/start-timer', (req, res) => {
    const duration = parseInt(req.body.duration, 10); // Get the duration from the form input

    if (!duration || duration <= 0) {
        timerMessage = 'Invalid duration. Please enter a positive number.';
        return res.redirect('/');
    }

    // Set the timer started message
    timerMessage = `Timer started for ${duration} seconds!`;

    // Redirect back to the main page
    res.redirect('/');

    // Set the timer to update the message after the specified duration
    setTimeout(() => {
        timerMessage = `Timer of ${duration} seconds is complete!`;
    }, duration * 1000);
});

// Endpoint to provide the current timer status
app.get('/status', (req, res) => {
    res.json({ message: timerMessage });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Timer app running at http://localhost:${PORT}`);
});
