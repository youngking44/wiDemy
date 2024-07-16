import Course from '../models/course.model';
import cloudinary from 'cloudinary';
import ErrorHandler from '../utils/errorHandler.utils';
import { redis } from '../utils/redis.utils';
import { getAllCoursesHandler } from '../controllers/course.controller';

export const uploadCourse = async (data: any) => {
  const thumbnail = data.thumbnail;

  if (thumbnail) {
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: 'courses',
    });

    data.thumbnail = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  const course = await Course.create(data);
  return course;
};

export const updateCourse = async (courseId: string, data: any) => {
  const thumbnail = data.thumbnail;

  if (thumbnail) {
    await cloudinary.v2.uploader.destroy(thumbnail.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
      folder: 'courses',
    });

    data.thumbnail = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const course = await Course.findByIdAndUpdate(courseId, { $set: data }, { new: true });

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  return course;
};

//GET SINGLE COURSE WITHOUT PURCHASING IT
export const getSingleCourse = async (id: string) => {
  const isCacheExist = await redis.get(id);

  if (isCacheExist) {
    return JSON.parse(isCacheExist);
  }

  const course = await Course.findById(id).select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  await redis.set(id, JSON.stringify(course));

  return course;
};

//GET ALL COURSES WITHOUT PURCHASING IT
export const getAllCourses = async () => {
  const isCacheExist = await redis.get('allCourses');

  if (isCacheExist) {
    return JSON.parse(isCacheExist);
  }

  const courses = await Course.find().select('-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links');
  await redis.set('allCourses', JSON.stringify(courses));

  return courses;
};

export const getCourseContent = async (courseId: string) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  const courseContent = course.courseData;
  return courseContent;
};
