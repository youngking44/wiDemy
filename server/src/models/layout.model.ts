import mongoose, { InferSchemaType, Schema } from 'mongoose';

const faqSchema = new Schema({
  question: String,
  answer: String,
});

const categorySchema = new Schema({
  title: String,
});

const bannerImageSchema = new Schema({
  public_id: String,
  url: String,
});

const LayoutSchema = new Schema(
  {
    type: String,
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
      image: bannerImageSchema,
      title: String,
      subTitle: String,
    },
  },
  { timestamps: true },
);

export type LayoutSchemaType = InferSchemaType<typeof LayoutSchema>;

const layoutModel = mongoose.model<LayoutSchemaType>('Layout', LayoutSchema);
export default layoutModel;
