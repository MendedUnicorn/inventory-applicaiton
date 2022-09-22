const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

// all controlers

// item controller

// category controller

// routes

// item routes
// "/" - index
router.get('/', item_controller.index);
// Create
router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);
// Delete
router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);

// Update
router.get('/item/:id/update', item_controller.item_update_get);
router.post('/item/:id/update', item_controller.item_update_post);

// Details
router.get('/item/:id', item_controller.item_detail);
// List all
router.get('/items', item_controller.item_list);

// Category Routes
// Create
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);
// Delete
router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);

// Update
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);

// Details
router.get('/category/:id', category_controller.category_detail);
// List all
router.get('/categories', category_controller.category_list);

module.exports = router;
