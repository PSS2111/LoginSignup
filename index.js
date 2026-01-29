import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const userData = [];
app.set('view engine', 'ejs');
// recreate __dirname properly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// localStorage.setItem('userData', JSON.stringify(userData));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Signup.html'));
});

app.post('/signup', (req, res) => {
    userData.push(req.body);
    console.log(userData);
    res.sendFile(path.join(__dirname, 'public', 'Success.html'));
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = userData.find(u => u.email === email && u.password === password);
    if (user) {
       res.render('LoginSuccess', { name: user.username });
    } else {
        res.send('<h2>Login Failed!</h2><p>Invalid email or password.</p>');
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
