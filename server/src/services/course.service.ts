import mongoose from 'mongoose';
import Course from '../models/course.model';
import cloudinary from 'cloudinary';
import ErrorHandler from '../utils/errorHandler.utils';
import { redis } from '../utils/redis.utils';
import { IUser } from '../types';
import sendMail from '../utils/sendMail.utils';
import Notification from '../models/notification.model';

//UPLOAD COURSE
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

// UPDATE COURSE HANDLER
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

  const course = await Course.findByIdAndUpdate(
    courseId,
    { $set: data },
    { new: true },
  );

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

  const course = await Course.findById(id).select(
    '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links',
  );

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  await redis.set(id, JSON.stringify(course), 'EX', 604800);

  return course;
};

//GET ALL COURSES WITHOUT PURCHASING IT
export const getAllCourses = async () => {
  const isCacheExist = await redis.get('allCourses');

  if (isCacheExist) {
    return JSON.parse(isCacheExist);
  }

  const courses = await Course.find().select(
    '-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links',
  );
  await redis.set('allCourses', JSON.stringify(courses));

  return courses;
};

// GET ALL COURSES BY ADMIN
export const getAlLCoursesByAdmin = async () => {
  const courses = await Course.find().sort({ createdAt: -1 });

  return courses;
};

// GET PURCHASED COURSE CONTENT BY USER
export const getCourseContent = async (courseId: string) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  const courseContent = course.courseData;
  return courseContent;
};

// ADD QUESTION TO COURSE CONTENT
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = async (data: IAddQuestionData, user: IUser) => {
  const { question, courseId, contentId } = data;
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ErrorHandler('Invalid content ID', 400);
  }

  const courseContent = course?.courseData?.find((content) =>
    content?._id?.equals(contentId),
  );

  if (!courseContent) {
    throw new ErrorHandler('Course content not found!', 404);
  }

  const newQuestion = {
    user,
    question,
    questionReplies: [],
  };

  courseContent.questions.push(newQuestion);
  await course.save();

  await Notification.create({
    userId: user._id,
    title: 'New Question Received',
    message: `You have a new question in ${courseContent.videoTitle}`,
  });

  return course;
};

// ADD ANSWER TO COURSE CONTENT QUESTION HANDLER
interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

export const addAnswer = async (data: IAddAnswerData, user: IUser) => {
  const { answer, courseId, contentId, questionId } = data;
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  if (!mongoose.Types.ObjectId.isValid(contentId)) {
    throw new ErrorHandler('Invalid content ID', 400);
  }

  const courseContent = course?.courseData?.find((content) =>
    content?._id?.equals(contentId),
  );

  if (!courseContent) {
    throw new ErrorHandler('Course content not found!', 404);
  }

  const question = courseContent.questions.find(
    (question) => question._id?.toString() === questionId,
  );

  if (!question) {
    throw new ErrorHandler('Question not found!', 404);
  }

  const newAnswer = {
    user,
    answer,
  };

  question.questionReplies.push(newAnswer);

  if (user?._id === question.user?._id) {
    //It simply means the logged-in user was the same user that asked the question, which means another question added by him.
    await Notification.create({
      userId: user._id,
      title: 'New Question Reply Received',
      message: `You have a new question reply from ${courseContent.videoTitle}`,
    });
  } else {
    const data = {
      name: question.user?.name,
      title: courseContent.videoTitle,
    };

    await sendMail({
      email: question.user.email,
      subject: 'Question Reply',
      template: 'activation-mail.ejs',
      data,
    });
  }

  await course.save();

  return course;
};

// ADD COURSE REVIEWS
interface IAddReviewData {
  review: string;
  courseId: string;
  rating: number;
}

export const addCourseReview = async (data: IAddReviewData, user: IUser) => {
  const { review, courseId, rating } = data;
  // Checking if the course is in the user purchased-list before he can make review on it.
  const userCourseExist = user?.courses.find(
    (item) => item.courseId === courseId,
  );

  if (!userCourseExist) {
    throw new ErrorHandler("You don't have access to this course", 403);
  }

  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  const newReview = {
    user,
    rating,
    comment: review,
  };

  course.reviews.push(newReview);

  let average = 0;
  course.reviews.forEach((rev) => (average += rev.rating));
  course.ratings = average / course.reviews.length;

  await course.save();

  const notification = {
    title: 'New Review Received',
    message: `${user.name} has made a review on ${course.name}`,
  };

  // Create Notification later

  return course;
};

// REPLY COURSE REVIEW HANDLER
interface IReplyCourseReview {
  comment: string;
  courseId: string;
  reviewId: string;
}

export const replyCourseReview = async (
  data: IReplyCourseReview,
  user: IUser,
) => {
  const { comment, courseId, reviewId } = data;
  const course = await Course.findById(courseId);

  if (!course) {
    throw new ErrorHandler('Course not found!', 404);
  }

  const review = course.reviews.find((rev) => rev._id?.toString() === reviewId);

  if (!review) {
    throw new ErrorHandler('Review not found!', 404);
  }

  const replyData = {
    user,
    comment,
  };

  review.commentReplies?.push(replyData);
  await course.save();

  return course;
};

// DELETE USER
export const deleteCourse = async (id: string) => {
  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    throw new ErrorHandler('Course not found', 404);
  }

  await redis.del(id);
  return course;
};
