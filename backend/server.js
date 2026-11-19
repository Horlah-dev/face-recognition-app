const express = require('express');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3001;

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ error: 'Invalid or expired token'});
        }

        req.user = decoded;
        next()
    })
} 

app.use(cors({ origin: [
    'http://localhost:5173',
    'https://face-recognition-app-1-yo8h.onrender.com',
    ]
    }));
app.use(express.json());


app.get('/', (req, res) => {
    res.json({ message: 'Face Recognition API is running' });
});

app.post('/test', (req, res) => {
    console.log(req.body);
    res.json({ received: req.body });
});

app.post('/api/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof email !== 'string' || !validator.isEmail(email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address'});
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at`,
            [name, email, passwordHash]
        );

        return res.status(201).json({
            message: 'Account created successfully',
            user: result.rows[0],
        });
    } catch (error){
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Email already registered'});
        }

        console.error('Registration error:', error.message);
        return res.status(500).json({ error: 'Unable to register user' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    try {
    const result = await pool.query(
        'SELECT id, name, email, password_hash FROM users WHERE email = $1',[email]
    );

    if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password'});
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        return res.status(401).json({ error: 'Invalid email or password'});
    }

        const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
    );

        return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    });
    } catch (error){
        console.error('Login error:', error.message);
        return res.status(500).json({ error: 'Unable to login' });
    }
    });

    app.get('/api/profile', authenticateToken, async (req, res) => {
        try {
            const result = await pool.query(
                'SELECT id, name, email, scan_count, created_at FROM users WHERE id = $1', [req.user.userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({ user: result.rows[0] });
        } catch (error) {
            console.error('Profile error:', error.message);
            return res.status(500).json({ error: 'Unable to load profile' });
        };
    });

    app.post('/api/scan', authenticateToken, async (req, res) => {
        try {
            const result = await pool.query(
                `UPDATE users
                SET scan_count = scan_count + 1
                WHERE id = $1
                RETURNING scan_count`, 
                [req.user.userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({ scan_count: result.rows[0].scan_count });
        } catch (error) {
            console.error('Scan count update error:', error.message);
            return res.status(500).json({ error: 'Unable to update scan count' });
        }
    })
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
