require('dotenv').config();
const express = require('express');
const supabase = require('./supabaseClient');
const app = express();

app.use(express.json());

// API endpoints go here
app.get('/api/tasks', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*');

            if (error) {
                return res.json({ errorMessage: error.message });
            }
            res.json({ tasks: data });

    } catch (error) {
        res.json({ errorMessage: error.message });
    }
});

app.get('/api/tasks/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();

            if (error) {
                return res.json({errorMessage: error.message});
            }
            res.json({task: data});

    } catch (error) {
        res.json({errorMessage: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { title, description, completed } = req.body;
    if (!title){
        return res.json({ errorMessage: 'Post failed: Task is missing a title.' })
    }
    try{
        const newTask = {title, description};
        if (completed !== undefined){
            newTask.completed = completed;
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert([newTask])
            .select()
            .single()

        if (error) {
            return res.json({ errorMessage: error.message });
        }
        res.json({ task: data });

    } catch (error) {
        res.json({ errorMessage: error.message });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on post ${process.env.PORT}...`);
});