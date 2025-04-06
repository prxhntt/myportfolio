const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const PORT = 3001;

const app = express();
app.use(express.static (__dirname));
app.use(express.urlencoded({extended:true} )
)


app.use(bodyParser.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/contact_form_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));


const submissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now }
});


const Submission = mongoose.model('Submission', submissionSchema);


app.post('/post', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const submission = new Submission({
            name,
            email,
            subject,
            message
        });

        await submission.save();
        res.status(200).send('Form Submitted Succesfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error submitting form');
    }
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});