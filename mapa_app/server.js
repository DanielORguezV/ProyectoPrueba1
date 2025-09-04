const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("./db");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de multer para subir KMZ/KML
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Ruta para subir capas (KMZ/KML)
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  const nombre = req.file.originalname;
  const archivo = "/uploads/" + req.file.filename;
  const tipo = path.extname(req.file.originalname).replace(".", "");
  await pool.query("INSERT INTO capas(nombre, archivo, tipo) VALUES($1,$2,$3)", [
    nombre,
    archivo,
    tipo,
  ]);
  res.json({ url: archivo });
});

// Ruta para agregar puntos al mapa
app.post("/puntos", async (req, res) => {
  const { nombre, descripcion, observaciones, lat, lng, imagen, capa } = req.body;
  await pool.query(
    "INSERT INTO puntos(nombre, descripcion, observaciones, lat, lng, imagen, capa) VALUES($1,$2,$3,$4,$5,$6,$7)",
    [nombre, descripcion, observaciones, lat, lng, imagen, capa]
  );
  res.json({ status: "ok" });
});

// Ruta para listar puntos
app.get("/puntos", async (req, res) => {
  const result = await pool.query("SELECT * FROM puntos");
  res.json(result.rows);
});

// Ruta para listar capas
app.get("/capas", async (req, res) => {
  const result = await pool.query("SELECT * FROM capas");
  res.json(result.rows);
});

// Ruta para usuarios (ejemplo simple)
app.post("/usuarios", async (req, res) => {
  const { nombre, email, password } = req.body;
  await pool.query("INSERT INTO usuarios(nombre,email,password) VALUES($1,$2,$3)", [
    nombre,
    email,
    password,
  ]);
  res.json({ status: "usuario creado" });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
