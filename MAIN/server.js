const pool = require("./db/connection.js");
const inquirer = require("inquirer");

function menu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: " What do you want to do ?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "QUIT",
        ],
      },
    ])
    .then(({ choice }) => {
      switch (choice) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "QUIT":
          pool.end();
          break;
      }
    });
}

async function viewDepartments() {
  const departments = await pool.query("SELECT * FROM department");
  console.table(departments.rows);
  menu();
}

function viewAllEmployees() {
   const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name" FROM employee `;
    //  role.title, department.name AS department, role.salary, manager.first_name || ' ' || manager.last_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`
  pool.query(sql, (err, { rows }) => {
    if (err) console.log(err);
    console.table(rows);
    menu();
  });
} //called a self join

async function viewRoles() {
  const roles = await pool.query(
    "select role.title, role.salary, department.name FROM role JOIN department ON role.department_id = department.id"
  );
  console.table(roles.rows);
  menu();
}

async function addDepartment() {
     const answer = await inquirer
        .prompt([
            {
                type:'input',
                name: 'add_department',
                message: 'What department are you adding?'
            }
        ]);
        const newDepartment = answer.add_department;
        // console.log(`New department added: ${newDepartment}`);

}

async function addRole() {
    const answer = await inquirer
       .prompt([
           {
               type:'input',
               name: 'add_role',
               message: 'What role are you adding?'
           }
       ]);
       const newDepartment = answer.add_role;

}

async function addEmployee() {
    const answer = await inquirer
       .prompt([
           {
               type:'input',
               name: 'add_employee',
               message: 'What is the first and last name of employee?'
           }
       ]);
       const newDepartment = answer.add_employee;

}



menu();