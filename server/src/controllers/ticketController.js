import { Ticket } from '../models/Ticket.js';

export const getTickets = async (req, res) => {
  try {
    const { projectId, status, priority, search } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: 'projectId is required' });
    }

    const filter = { project: projectId };

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('reporter', 'name email avatar')
      .populate('assignee', 'name email avatar')
      .sort({ order: 1, createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('reporter', 'name email avatar')
      .populate('assignee', 'name email avatar')
      .populate('project', 'title key');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { title, description, status, priority, type, project, assignee } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    // Get current highest order in that status
    const highestOrderTicket = await Ticket.findOne({
      project,
      status: status || 'todo',
    }).sort({ order: -1 });

    const order = highestOrderTicket ? highestOrderTicket.order + 1 : 0;

    const ticket = await Ticket.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      type: type || 'bug',
      project,
      reporter: req.user._id,
      assignee: assignee || null,
      order,
    });

    const populated = await Ticket.findById(ticket._id)
      .populate('reporter', 'name email avatar')
      .populate('assignee', 'name email avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const fields = ['title', 'description', 'status', 'priority', 'type', 'assignee', 'order'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        ticket[field] = req.body[field];
      }
    });

    const updated = await ticket.save();
    const populated = await Ticket.findById(updated._id)
      .populate('reporter', 'name email avatar')
      .populate('assignee', 'name email avatar');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicketOrder = async (req, res) => {
  try {
    const { status, order } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (order !== undefined) ticket.order = order;

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.deleteOne();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
