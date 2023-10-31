import ticketModel from '../models/tickets.models.js';
import { v4 as uuidv4 } from 'uuid';

const getTickets = async (req, res) => {
	try {
		const response = await ticketModel.find();

		res.status(200).send({ response: response });
	} catch (error) {
		res.status(500).send({ mensaje: `Error al consultar tickets ${error}` });
	}
};

const createTicket = async (req, res) => {
	try {
		const { amount, email } = req.body;

		if (!amount || !email) {
			return res.status(400).json({ mensaje: 'Se requiere amount y email en el cuerpo de la solicitud.' });
		}

		const ticket = {
			code: uuidv4(),
			amount: amount,
			purchaser: email,
		};

		await ticketModel.create(ticket);

		const ticketGenerado = await ticketModel.findOne({ code: ticket.code });

		res.status(201).json({ mensaje: 'Ticket generado con éxito', data: ticketGenerado });
	}

	catch (error) {
		res.status(500).json({ mensaje: `Error al crear el ticket: ${error}` });
	}
};

const ticketsController = { createTicket, getTickets };

export default ticketsController;
