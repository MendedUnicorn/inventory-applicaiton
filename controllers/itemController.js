const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');

const { body, validationResult } = require('express-validator');
const item = require('../models/item');

exports.index = (req, res, next) => {
  console.log('hit the route? ');
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('index', {
        title: 'The Busy Business Store Home',
        error: err,
        data: results,
      });
    }
  );
};

exports.item_create_get = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return next(err);
    }
    res.render('item_form', {
      title: 'Add new item',
      categories,
    });
  });
  //need to retrieve all the categories
};

exports.item_create_post = [
  //make sure categories are an array:

  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category == 'undefined' ? [] : [req.body.category];
    }
    next();
  },

  // sanetize
  body('name', 'Must provide a proper name.')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Enter a proper description')
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body('category.*').escape(),
  body('price', 'Enter price').isInt({
    allow_leading_zeroes: false,
    min: 1,
    max: 100000,
  }),
  body('number_in_stock', 'Enter a valid number').isInt({ min: 0, max: 1000 }),

  (req, res, next) => {
    const errors = validationResult(req);
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // there be errors - rerender form
      console.log(errors);
      Category.find().exec((err, categories) => {
        categories.forEach((category) => {
          if (item.category.includes(category._id)) {
            category.checked = 'true';
          }
        });

        res.render('item_form', {
          title: 'Add new item',
          categories,
          item,
          errors: errors.array(),
        });
      });
      return;
    }
    item.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(item.url);
    });
  },
  // create a new item
  //if unsuccessful, rerender form with the new items previously inputed data
  //if successful save
];

exports.item_update_get = (req, res, next) => {
  async.parallel(
    {
      categories(callback) {
        Category.find().exec(callback);
      },
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      results.categories.forEach((category) => {
        if (results.item.category.includes(category._id)) {
          category.checked = 'true';
        }
      });
      //console.log(results.categories);
      res.render('item_form', {
        title: 'Update Item',
        item: results.item,
        categories: results.categories,
      });
    }
  );
};
exports.item_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category == 'undefined' ? [] : [req.body.category];
    }
    next();
  },

  // sanetize
  body('name', 'Must provide a proper name.')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Enter a proper description')
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body('category.*').escape(),
  body('price', 'Enter price').isInt({
    allow_leading_zeroes: false,
    min: 1,
    max: 100000,
  }),
  body('number_in_stock', 'Enter a valid number').isInt({ min: 0, max: 1000 }),
  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category:
        typeof req.body.category == 'undefined' ? [] : req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Category.find().exec((err, categories) => {
        if (err) {
          return next(err);
        }
        categories.forEach((category) => {
          if (item.category.includes(category._id)) {
            category.checked = 'true';
          }
        });
        res.render('item_form', {
          title: 'Update Item',
          item,
          categories,
        });
      });
      return;
    }
    Item.findByIdAndUpdate(req.params.id, item, {}, (err, theitem) => {
      if (err) {
        return next(err);
      }
      console.log('updated: ', theitem);
      res.redirect(theitem.url);
    });
  },
];

exports.item_delete_get = (req, res, next) => {
  Item.findById(req.params.id).exec((err, item) => {
    if (err) {
      return next(err);
    }
    res.render('item_delete', {
      title: 'Delete item',
      item,
    });
  });
};
exports.item_delete_post = (req, res, next) => {
  console.log(req.body.itemid);
  Item.findByIdAndRemove(req.body.itemid).exec((err, deletedItem) => {
    if (err) {
      return next(err);
    }
    console.log('Deleted: ', deletedItem);
    res.redirect('/catalog/items');
  });
};

exports.item_detail = (req, res, next) => {
  Item.findById(req.params.id)
    .populate('category')
    .exec((err, item) => {
      if (err) {
        return next(err);
      }
      res.render('item_detail', {
        title: 'Product Details',
        item,
      });
    });
};

exports.item_list = (req, res, next) => {
  async.parallel(
    {
      items(callback) {
        Item.find().exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('item_list', {
        title: 'All items',
        items: results.items,
      });
    }
  );
};
