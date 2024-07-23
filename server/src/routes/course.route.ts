import { Router } from 'express';
import {
  addAnswerHandler,
  addCourseReviewHandler,
  addQuestionHandler,
  deleteCourseHandler,
  getAllCoursesByAdminHandler,
  getAllCoursesHandler,
  getCourseContentHandler,
  getSingleCourseHandler,
  replyCourseReviewHandler,
  updateCourseHandler,
  uploadCourseHandler,
} from '../controllers/course.controller';
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from '../middleware/verifyToken';

const router = Router();

// UPLOAD COURSE ROUTE
router.post('/', verifyTokenAndAdmin, uploadCourseHandler);
// GET ALL COURSES ROUTE
router.get('/', getAllCoursesHandler);
// GET ALL COURSES BY ADMIN ROUTE
router.get('/admin', verifyTokenAndAdmin, getAllCoursesByAdminHandler);
// GET COURSE CONTENT ROUTE
router.get(
  '/course-content/:id',
  verifyTokenAndAuthorization,
  getCourseContentHandler,
);
// GET SINGLE COURSE ROUTE
router.get('/:id', getSingleCourseHandler);
// ADD QUESTION TO COURSE CONTENT ROUTE
router.put('/add-question', verifyTokenAndAuthorization, addQuestionHandler);
// ADD ANSWER TO COURSE CONTENT QUESTION ROUTE
router.put('/add-answer', verifyTokenAndAuthorization, addAnswerHandler);
// ADD REVIEW TO COURSE
router.put(
  '/add-review/:id',
  verifyTokenAndAuthorization,
  addCourseReviewHandler,
);
// COURSE REVIEW REPLY ROUTE
router.put('/add-review-reply', verifyTokenAndAdmin, replyCourseReviewHandler);
// UPDATE COURSE ROUTE
router.put('/:id', verifyTokenAndAdmin, updateCourseHandler);
// DELETE COURSE ROTE
router.delete('/:id', verifyTokenAndAdmin, deleteCourseHandler);

export default router;
