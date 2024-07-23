import mongoose, { InferSchemaType, Schema } from 'mongoose';

const reviewSchema = new Schema({
  user: Object,
  rating: { type: Number, default: 0 },
  comment: String,
  commentReplies: [Object],
});

const linkSchema = new Schema({
  title: String,
  url: String,
});

const commentSchema = new Schema({
  user: Object,
  question: String,
  questionReplies: [Object],
});

const courseDataSchema = new Schema({
  videoUrl: String,
  videoTitle: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  estimatedPrice: Number,
  thumbnail: { public_id: String, url: String },
  tags: { type: String, required: true },
  level: { type: String, required: true },
  demoUrl: { type: String, required: true },
  benefits: [{ title: String }],
  prerequisites: [{ title: String }],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  ratings: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 },
});

type CourseSchemaType = InferSchemaType<typeof courseSchema>;
const courseModel = mongoose.model<CourseSchemaType>('Course', courseSchema);

export default courseModel;
