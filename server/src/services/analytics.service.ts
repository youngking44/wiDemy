import User from '../models/user.model';

//USER ANALYTICS
export const getUserAnalytics = async () => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  const data = await User.aggregate([
    {
      $match: {
        createdAt: {
          $gte: lastYear,
        },
      },
      $project: {
        month: { $month: '$createdAt' },
      },
      $group: {
        _id: '$month',
        total: { $sum: 1 },
      },
      $sort: {
        _id: 1,
      },
    },
  ]);

  return data;
};
