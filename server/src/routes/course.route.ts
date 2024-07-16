import { Router } from 'express';
import {
  getAllCoursesHandler,
  getCourseContentHandler,
  getSingleCourseHandler,
  updateCourseHandler,
  uploadCourseHandler,
} from '../controllers/course.controller';
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middleware/verifyToken';

const router = Router();

router.post('/', verifyTokenAndAdmin, uploadCourseHandler);
router.get('/', getAllCoursesHandler);
router.get('/:id', getSingleCourseHandler);
router.put('/:id', verifyTokenAndAdmin, updateCourseHandler);
router.get('/course-content/:id', verifyTokenAndAuthorization, getCourseContentHandler);

export default router;
