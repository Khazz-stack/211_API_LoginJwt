const db = require("../models");
const bcrypt = require("bcrypt"); // Ganti dengan "bcryptjs" jika sebelumnya Anda menginstal bcryptjs
const jwt = require("jsonwebtoken");

const User = db.User;

async function register(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email and password wajib di isi" 
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: "Email sudah terdaftar" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Perbaikan: Menggunakan variabel newUser agar tidak bentrok dengan model User
        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registrasi berhasil",
            user: {
                id: newUser.id,
                email: newUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message 
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                message: "Email dan password wajib di isi"
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ 
                message: "Email atau password salah" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ 
                message: "Email atau password salah" 
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            "secretkey",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login berhasil",
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message 
        });
    }
}

module.exports = {
    register,
    login
};