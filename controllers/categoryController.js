const async = require('async');
const Item = require('../models/item');
const Category = require('../models/category');
const { body, validationResult } = require('express-validator');

exports.category_create_get = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return next(err);
    }
    res.render('category_form', {
      title: 'Add new category',
      categories,
    });
  });
};
exports.category_create_post = [
  body('name', 'Category needs to be at least 2 letters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body('description', 'Please enter a longer description')
    .trim()
    .isLength({ min: 10 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // rerender the form with same data as input before error
      Category.find().exec((err, categories) => {
        if (err) {
          return next(err);
        }
        res.render('category_form', {
          title: 'Add new category',
          categories,
          category,
          errors: errors.array(),
        });
      });
      return;
    }
    category.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/catalog/categories');
    });
  },
];
exports.category_update_get = (req, res, next) => {
  res.send('Not implemented yet');
};
exports.category_update_post = (req, res, next) => {
  res.send('Not implemented yet');
};
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('category_delete', {
        title: 'Delete Category',
        category: results.category,
        items: results.items,
      });
    }
  );
};
exports.category_delete_post = (req, res, next) => {
  // get all items and check if they are in the category
  console.log(req.body);
  async.parallel(
    {
      items(callback) {
        Item.find({ category: req.body.categoryid }).exec(callback);
      },
      category(callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.items.length > 0) {
        res.render('category_delte', {
          title: 'Delete Category',
          category: results.category,
          items: results.items,
        });
      }
      Category.findByIdAndRemove(req.body.categoryid).exec(
        (err, deletedCategory) => {
          if (err) {
            return next(err);
          }
          console.log('Deleted: ', deletedCategory);
          res.redirect('/catalog/categories');
        }
      );
    }
  );
};
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      items(callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('category_detail', {
        title: 'Category Details',
        items: results.items,
        category: results.category,
      });
    }
  );
};
exports.category_list = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return next(err);
    }
    res.render('category_list', {
      title: 'All Categories',
      categories,
    });
  });
};
