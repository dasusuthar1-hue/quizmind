const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.0 || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory Database for Questions and Subjects
let questionsDB = [
    {
        id: 1,
        subject: 'General Knowledge',
        questionText: 'Bharat ki rajdhani kya hai?',
        options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'],
        correctAnswer: 'Delhi'
    }
];

// API: Get all questions
app.get('/api/questions', (req, res) => {
    res.json({ success: true, data: questionsDB });
});

// API: Add bulk questions (Admin)
app.post('/api/questions/bulk', (req, res) => {
    const { password, questions } = req.body;
    
    // Password sync with 'Love12'
    if (password !== 'Love12') {
        return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
    }

    if (!Array.isArray(questions)) {
        return res.status(400).json({ success: false, message: 'Invalid format, expected array of questions' });
    }

    questions.forEach(q => {
        questionsDB.push({
            id: questionsDB.length + 1,
            subject: q.subject || 'General',
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer
        });
    });

    res.json({ success: { message: 'Questions added successfully', total: questionsDB.length } });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
