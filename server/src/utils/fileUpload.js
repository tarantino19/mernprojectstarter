import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import mime from 'mime-types';
import path from 'path';
import fs from 'fs';

// Initialize Express app
const app = express();

// Define storage using multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // Directory to store files
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
	},
});

// Set up Multer for file upload
const upload = multer({ storage });

// File schema in MongoDB
const fileSchema = new mongoose.Schema({
	filename: String,
	originalname: String,
	mimetype: String,
	path: String,
	size: Number,
	uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

// Upload a file
app.post('/upload', upload.single('file'), async (req, res) => {
	try {
		const { file } = req;
		if (!file) {
			return res.status(400).json({ message: 'No file uploaded' });
		}

		// Save file metadata to database
		const newFile = new File({
			filename: file.filename,
			originalname: file.originalname,
			mimetype: file.mimetype,
			path: file.path,
			size: file.size,
		});
		await newFile.save();

		res.status(201).json({
			message: 'File uploaded successfully',
			fileUrl: `/files/${file.filename}`, // This is the URL to access the file later
		});
	} catch (error) {
		res.status(500).json({ message: 'File upload failed', error });
	}
});

// Serve uploaded files (static route for file access)
app.get('/files/:filename', (req, res) => {
	const filePath = path.join(__dirname, 'uploads', req.params.filename);
	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			return res.status(404).json({ message: 'File not found' });
		}
		res.sendFile(filePath);
	});
});

// View a file's metadata (for frontend usage)
app.get('/file-metadata/:id', async (req, res) => {
	try {
		const file = await File.findById(req.params.id);
		if (!file) {
			return res.status(404).json({ message: 'File not found' });
		}
		res.json(file);
	} catch (error) {
		res.status(500).json({ message: 'Failed to retrieve file metadata', error });
	}
});

// Initialize database connection
mongoose
	.connect('mongodb://localhost:27017/fileuploads', { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
