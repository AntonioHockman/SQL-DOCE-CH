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
   const sql = `SELECT employee.id, employee.first_name AS "first name", employee.last_name AS "last name", 
   role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
   FROM employee 
   LEFT JOIN role ON employee.role_id = role.id 
   LEFT JOIN department ON role.department_id = department.id 
   LEFT JOIN employee manager ON manager.id = employee.manager_id`;

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
        await pool.query("insert into department(name) values ($1)",[newDepartment])
        console.log(`New department added: ${newDepartment}`);
        menu()
}

async function addRole() {
  const departments = await pool.query("select id as value,name as name from department")
    const answer = await inquirer
       .prompt([
           {
               type:'input',
               name: 'add_role',
               message: 'What role are you adding?'
           },
           {
            type:'input',
            name: 'salary',
            message: 'What is the salary of the role?'
        },
        {
          type:'list',
          name: 'dept_id',
          message: 'What department does the role belong to?',
      
          choices: departments.rows
        }
       ]);
        await pool.query("insert into role (title, salary,department_id) values($1,$2,$3)",[answer.add_role,answer.salary,answer.dept_id])
        console.log("role was susccesfully added!")
        menu();
}

async function addEmployee() {
    const role = await pool.query('select id as value,title as name from role')
    const managers = await pool.query( "select id as value, first_name||' ' || last_name from employee")
    const answer = await inquirer
       .prompt([
           {
               type:'input',
               name: 'first_name',
               message: 'What is the first of employee?'
           },
           {
            type:'input',
            name: 'last_name',
            message: 'What is the last name of employee?'
        },
        {
          type:'list',
          name: 'role_id ',
          message: 'What is the employees role?',
          choices: role.rows
      },
      {
        type:'list',
        name: 'manaager_id ',
        message: 'What is the employees manager',
        choices: managers.rows
    }
       ]);
        await pool.query("insert into employee(first_name,last_name,role_id,manager_id",[answer.first_name,answer.last_name,answer.role_id,answer.manager_id])
        console.log('employee was sucessfully added!')
        //menu()

        async function updateEmployeeRole(employeeId, newRoleId) {
          try {
              // Update the employee's role with the new role ID
              const query = `
                  UPDATE employee
                  SET role_id = $1
                  WHERE id = $2
              `;
              await pool.query(query, [newRoleId, employeeId]);
      
              console.log('Employee role updated successfully');
          } catch (error) {
              console.error('Error updating employee role:', error);
          }
      }
      menu()
}




menu();