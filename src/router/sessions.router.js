import { Router } from 'express';
import passport from 'passport';
import { createHash, isValidPassword, generateJWToken } from '../utils.js';
import userModel from '../models/users.js'


const router = Router();

// Register sin passport
/*router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body

          // Validaciones básicas
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send({ error: "Faltan campos obligatorios." });
        }

        // Verifica si ya existe un usuario con ese email
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send({ error: "El email ya está registrado." });
        }

        // DTO
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password
        }
        
        const user = await userModel.create(newUser)
        console.log(user);

        res.status(201).send({ result: "Success", payload: user._id })
    } catch (error) {
        console.error("No se pudo crear el usuario con moongose: " + error);
        res.status(500).send({ error: "No se pudo crear usuario con moongose", message: error });
    }
})*/

// Register con passport
router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/fail-register' }), async (req, res) => {
    res.send({ status: "success", message: "Usuario creado con extito con ID: " });
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }

        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }

        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);


        // Creamos la cookie y almacenamos el access_token en la cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie
        })

        res.send({ status: "Login success" });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

router.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

router.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default router;