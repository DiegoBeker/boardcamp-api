import { db } from "../database/database.connection.js"

export async function postCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if (customerExists.rows[0]) return res.status(409).send("This cpf already exists");

        await db.query(`
            INSERT INTO customers (name,phone,cpf,birthday)
            VALUES ($1,$2,$3,$4);
        `, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers`);
        res.send(customers.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);

        if (!customer.rows[0]) res.sendStatus(404);

        res.send(customer.rows[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export async function updateCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;
    try {
        const cpfExists = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        
        if (cpfExists.rows[0] && cpfExists.rows[0].id != id) return res.sendStatus(409);

        await db.query(`
            UPDATE customers 
            SET name=$1, phone=$2, cpf=$3, birthday=$4
            WHERE id=$5;
        `, [name, phone, cpf, birthday, id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error.message);
    }
}