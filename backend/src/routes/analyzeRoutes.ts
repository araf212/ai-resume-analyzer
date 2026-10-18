import { Router } from 'express';
import { AnalyzeController } from '../controllers/analyzeController';
import { upload } from '../middleware/upload';

const router = Router();

// Health check
router.get('/health', AnalyzeController.getHealth);

// Sample data for quick testing
router.get('/sample', AnalyzeController.getSampleData);

// Main analysis route with file upload
router.post('/analyze', upload.single('resumeFile'), AnalyzeController.analyze);

export default router;
