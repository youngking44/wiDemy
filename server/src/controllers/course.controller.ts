import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import {
  addAnswer,
  addCourseReview,
  addQuestion,
  deleteCourse,
  getAllCourses,
  getAlLCoursesByAdmin,
  getCourseContent,
  getSingleCourse,
  replyCourseReview,
  updateCourse,
  uploadCourse,
} from '../services/course.service';
import ErrorHandler from '../utils/errorHandler.utils';

//UPLOAD COURSE HANDLER
export const uploadCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await uploadCourse(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// UPDATE COURSE HANDLER
export const updateCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const course = await updateCourse(id, req.body);
    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//GET SINGLE COURSE WITHOUT PURCHASING IT HANDLER
export const getSingleCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const course = await getSingleCourse(id);

    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//GET ALL COURSES WITHOUT PURCHASING IT HANDLER
export const getAllCoursesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({ success: true, courses });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// GET ALL COURSES BY ADMIN HANDLER
export const getAllCoursesByAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courses = await getAlLCoursesByAdmin();
    res.status(200).json({ success: true, courses });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// GET PURCHASED COURSE CONTENT BY USER HANDLER
export const getCourseContentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const courseList = req.user?.courses;
    const courseExist = courseList?.find((course) => course.courseId === id);

    if (!courseExist) {
      throw new ErrorHandler(
        "You don't have permission to access this course",
        403,
      );
    }

    const courseContent = await getCourseContent(id);
    res.status(200).json({ success: true, courseContent });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// ADD QUESTION TO COURSE CONTENT HANDLER
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestionHandler = async (
  req: Request<{}, {}, IAddQuestionData>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await addQuestion(req.body, req.user);
    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// ADD ANSWER TO COURSE CONTENT QUESTION HANDLER
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswerHandler = async (
  req: Request<{}, {}, IAddAnswerData>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await addAnswer(req.body, req.user);
    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// ADD COURSE REVIEWS HANDLER
type AddReviewParamsType = {
  id: string;
};

interface IAddReviewBody {
  review: string;
  rating: number;
}

export const addCourseReviewHandler = async (
  req: Request<AddReviewParamsType, {}, IAddReviewBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { review, rating } = req.body;
    const data = { review, rating, courseId: id };
    const course = await addCourseReview(data, req.user);

    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

// REPLY COURSE REVIEW HANDLER
interface IReplyCourseReview {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const replyCourseReviewHandler = async (
  req: Request<{}, {}, IReplyCourseReview>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const course = await replyCourseReview(req.body, req.user);

    res.status(200).json({ success: true, course });
  } catch (err) {
    logger;
    next(err);
  }
};

//DELETE COURSE HANDLER
export const deleteCourseHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await deleteCourse(id);
    res.sendStatus(204);
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
