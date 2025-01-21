const User = require('./models/User');
const Category = require('./models/Category');
const Transaction = require('./models/Transaction');
const dbClient = require('./utils/db');

async function testData() {
  const user = await User.findOne();
  if (user) {
    const cates = ['rent', 'salary', 'food', 'cloth', 'save'];
    const cateIds = {};
    for (const cate of cates) {
      const exist = await Category.findOne({ _id: user._id, name: cate });
      if (!exist) {
        const cat = new Category({
          userId: user._id,
          name: cate,
        });
        await cat.save();
        cateIds[cate] = cat._id;
      } else {
        cateIds[cate] = exist._id;
      }
    }

    for (let i = 0; i < 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      for (const cate of cates) {
        let type; let
          amount = null;
        if (cate === 'save') {
          type = 'savings';
          amount = 40000;
        } else if (cate === 'salary') {
          type = 'income';
          amount = 300000;
        } else {
          type = 'expense';
          amount = 35000;
        }

        const tran = new Transaction({
          amount,
          type,
          cateId: cateIds[cate],
          userId: user._id,
          date: new Date(date),
        });
        await tran.save();
      }
    }
    console.log('done');
  }
}

testData();
