import Layout from '../models/layout.model';
import cloudinary from 'cloudinary';
import ErrorHandler from '../utils/errorHandler.utils';

// CREATE LAYOUT
export const createLayout = async (data: any) => {
  const isTypeExist = await Layout.findOne({ type: data.type });

  if (isTypeExist) {
    throw new ErrorHandler(
      `Layout of type '${data.type}' has already been created`,
      400,
    );
  }

  if (data.type === 'banner') {
    const { image, title, subTitle } = data;
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: 'layout',
    });

    const banner = {
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      title,
      subTitle,
    };

    const layout = await Layout.create({ type: 'banner', banner });
    return layout;
  }

  if (data.type === 'faq') {
    const { faq } = data;
    const layout = await Layout.create({ type: 'faq', faq });
    return layout;
  }

  if (data.type === 'categories') {
    const { categories } = data;
    const layout = await Layout.create({
      type: 'categories',
      categories,
    });
    return layout;
  }

  throw new ErrorHandler('Enter a valid layout type', 400);
};

// UPDATE LAYOUT
export const updateLayout = async (data: any) => {
  const layoutData = await Layout.findOne({ type: data.type });

  if (!layoutData) {
    throw new ErrorHandler(`Layout of type '${data.type}' does not exist`, 404);
  }

  if (data.type === 'banner') {
    const { image, title, subTitle } = data;
    const bannerData: any = await Layout.findOne({ type: 'banner' });

    await cloudinary.v2.uploader.destroy(bannerData?.banner?.image?.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: 'layout',
    });

    const banner = {
      image: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      title,
      subTitle,
    };

    bannerData.banner = banner;
    await bannerData.save();
    return bannerData;
  }

  if (data.type === 'faq') {
    const { faq } = data;
    const layout = await Layout.findByIdAndUpdate(
      layoutData._id,
      { faq },
      { new: true },
    );
    return layout;
  }

  if (data.type === 'categories') {
    const { categories } = data;

    const layout = await Layout.findByIdAndUpdate(
      layoutData._id,
      { categories },
      { new: true },
    );

    return layout;
  }

  throw new ErrorHandler('Enter a valid layout type', 400);
};

// GET LAYOUT
export const getLayout = async (type: string) => {
  const layout = await Layout.findOne({ type });

  if (!layout) {
    throw new ErrorHandler(`Layout of type '${type}' not found`, 404);
  }

  return layout;
};
