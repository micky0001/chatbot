const express = require('express');
const bodyParser = require('body-parser');
const stringSimilarity = require('string-similarity');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());
// Predefined questions and answers
const qaPairs = [
    { question: "What is your name?", answer: "I am your custom chatbot and my nickname is Nimra." },
    { question: "How are you?", answer: "I am fine and thanks for asking" },
    { question: "What can you do?", answer: "I can answer your predefined questions!" },
    { question: "Where are you busy whole day?", answer: "None of your bsuniess !" },
    { question: "Goodbye", answer: "Goodbye! Have a nice day!" }
];

// Helper function to find the answer based on the user's question
function findAnswer(userQuestion) {
    const normalizedQuestion = userQuestion.toLowerCase().trim();
    const questions = qaPairs.map(pair => pair.question.toLowerCase());

    // Find the best match using string similarity
    const bestMatch = stringSimilarity.findBestMatch(normalizedQuestion, questions);
    if (bestMatch.bestMatch.rating > 0.5) {
        return qaPairs[bestMatch.bestMatchIndex].answer;
    }

    return "Sorry, I don't understand that question.";
}

// POST route to handle chatbot interaction
app.post('/chatbot', (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Please send a message." });
    }

    // Find the answer to the user's question
    const answer = findAnswer(userMessage);

    // Send the answer back to the user
    res.json({ reply: answer });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
