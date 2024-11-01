const { Pool } = require("pg");
const fs = require("fs");
const csvWriter = require("csv-writer").createObjectCsvWriter;
const csvParser = require("csv-parser");

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "UTM123",
  database: "HR",
  port: "5432",
});
// Obtener empleados
const getEmployees = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM employees");
    res.status(200).json(response.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener empleados.", error: error.message });
  }
};

// Obtener empleados
const createEmployees = async (req, res) => {};

// Exportar empleados a CSV
const exportEmployeesToCSV = async (req, res) => {
  try {
    const employees = await pool.query("SELECT * FROM employees");

    const csvWriterInstance = csvWriter({
      path: "employees.csv",
      header: [
        { id: "employee_id", title: "ID" },
        { id: "first_name", title: "Nombre" },
        { id: "last_name", title: "Apellido" },
        { id: "email", title: "Email" },
        { id: "phone_number", title: "Teléfono" },
        { id: "hire_date", title: "Fecha de Contratación" },
        { id: "job_id", title: "Job ID" },
        { id: "salary", title: "Salario" },
        { id: "commission_pct", title: "Comisión" },
        { id: "manager_id", title: "ID Manager" },
        { id: "department_id", title: "ID Departamento" },
      ],
    });

    await csvWriterInstance.writeRecords(employees.rows);
    res.status(200).send("Datos exportados a employees.csv");
  } catch (error) {
    console.error("Error al exportar empleados a CSV:", error);
    res.status(500).json({
      message: "Error al exportar empleados a CSV.",
      error: error.message,
    });
  }
};

// Importar empleados desde CSV
const importEmployeesFromCSV = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se proporcionó ningún archivo." });
  }

  const results = [];
  const filePath = req.file.path; // `req.file.path` debería estar disponible después de cargar el archivo

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        for (const employee of results) {
          await pool.query(
            `INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
              employee.first_name,
              employee.last_name,
              employee.email,
              employee.phone_number,
              employee.hire_date,
              employee.job_id,
              employee.salary,
              employee.commission_pct,
              employee.manager_id,
              employee.department_id,
            ]
          );
        }
        res.status(200).json({ message: "Empleados importados correctamente." });
      } catch (error) {
        res.status(500).json({ message: "Error al importar empleados.", error: error.message });
      } finally {
        fs.unlinkSync(filePath); // Elimina el archivo una vez que termina
      }
    });
};

module.exports = {
  getEmployees,
  createEmployees,
  exportEmployeesToCSV,
  importEmployeesFromCSV,
};
