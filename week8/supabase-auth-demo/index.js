require('dotenv').config();
const express = require('express');
const supabase = require('./supabase-client');

const app = express();

app.use(express.json());
app.use(express.static('public'));

//Endpoint for registering a user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errorMessage: 'Bad request: missing email or password' });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ errorMessage: `Bad request: ${error.message}` });
        }
        res.status(201).json({
            successMessage: 'Created: user successfully registered',
            data
        });

    } catch (err) {
        res.status(500).json({ errorMessage: `Internal server error: ${err.message}`} );
    }
});

//Endpoint for logging in a user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ errorMessage: 'Bad request: missing email or password' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(400).json({ errorMessage: `Bad request: ${error.message}` });
        }
        res.status(200).json({
            successMessage: 'OK: user successfully logged in',
            data
        });

    } catch (err) {
        res.status(500).json({ errorMessage: `Internal server error: ${err.message}` });
    }
});

//Endpoint for retrieving all tasks pertaining to a user
app.get('/api/tasks', async (req, res) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json('Bad request: authorization header format is incorrect');
    }

    const token = authHeader.split(' ')[1];

    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError) {
        return res.status(401).json({ errorMessage: `Unauthorized: ${userError.message}` });
    } else if (!userData.user) {
        return res.status(401).json({ errorMessage: 'Unauthorized: invalid token' });
    }

    const userId = userData.user.id;

    const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

    if (tasksError) {
        return res.status(500).json({ errorMessage: `Internal server error: ${tasksError.message}` });
    }
    res.status(200).json({
        successMessage: 'OK: tasks successfully retrieved',
        data: tasksData
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}...`);
});