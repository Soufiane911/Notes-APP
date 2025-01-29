import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();
const port = 3001; // Changer le port ici

app.use(cors());
app.use(express.json());

// Route de test pour vérifier la connexion entre le front-end et le back-end
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected to the frontend!' });
});

// Route pour récupérer toutes les notes
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Route pour ajouter une nouvelle note
app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newNote = await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    res.json(newNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Route pour mettre à jour une note
app.put('/api/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Valid note ID is required' });
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Route pour supprimer une note
app.delete('/api/notes/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Valid note ID is required' });
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});