import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';
import { getAllCourses, getCourseContent, getSingleCourse, updateCourse, uploadCourse } from '../services/course.service';
import ErrorHandler from '../utils/errorHandler.utils';

export const uploadCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await uploadCourse(req.body);
    res.status(201).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const updateCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const course = await updateCourse(id, req.body);
    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//GET SINGLE COURSE WITHOUT PURCHASING IT
export const getSingleCourseHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const course = await getSingleCourse(id);

    res.status(200).json({ success: true, course });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

//GET ALL COURSES WITHOUT PURCHASING IT
export const getAllCoursesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json({ success: true, courses });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};

export const getCourseContentHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const courseList = req.user?.courses;
    const courseExist = courseList?.find((course) => course.courseId === id);

    if (!courseExist) {
      throw new ErrorHandler("You don't have permission to access this course", 403);
    }

    const courseContent = await getCourseContent(id);
    res.status(200).json({ success: true, courseContent });
  } catch (err) {
    logger.error(err);
    next(err);
  }
};
