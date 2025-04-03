const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const dbFile = path.join(__dirname, "students.json");

app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// Function to load JSON database
const loadDB = () => {
  if (!fs.existsSync(dbFile)) fs.writeFileSync(dbFile, JSON.stringify([]));
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
};

// Function to save JSON database
const saveDB = (data) => fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));

// Fetch student by Roll No
app.get("/student/:rollNo", (req, res) => {
  const students = loadDB();
  const student = students.find((s) => s.rollNo === req.params.rollNo);
  res.json(student || null);
});

// Add new student
app.post("/student", (req, res) => {
  const students = loadDB();
  const { rollNo, fullName, className, birthDate, address, enrollmentDate } = req.body;

  if (students.find((s) => s.rollNo === rollNo)) {
    return res.status(400).json({ message: "Roll No already exists" });
  }

  students.push({ rollNo, fullName, className, birthDate, address, enrollmentDate });
  saveDB(students);
  res.json({ message: "Student added successfully" });
});

// Update existing student
app.put("/student/:rollNo", (req, res) => {
  const students = loadDB();
  const index = students.findIndex((s) => s.rollNo === req.params.rollNo);

  if (index === -1) return res.status(404).json({ message: "Student not found" });

  students[index] = { ...students[index], ...req.body };
  saveDB(students);
  res.json({ message: "Student updated successfully" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
