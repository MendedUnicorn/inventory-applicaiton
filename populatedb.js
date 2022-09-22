#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Item = require('./models/item');
const Category = require('./models/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = [];

function itemCreate(
  name,
  description,
  category,
  price,
  number_in_stock,
  img,
  cb
) {
  if (img) {
    itemdetail = { name, description, category, price, number_in_stock, img };
  } else {
    itemdetail = { name, description, category, price, number_in_stock };
  }
  var item = new Item(itemdetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Item: ' + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, description, cb) {
  var category = new Category({ name: name, description });

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New category: ' + category);
    categories.push(category);
    cb(null, category);
  });
}

// function bookCreate(title, summary, isbn, author, genre, cb) {
//   bookdetail = {
//     title: title,
//     summary: summary,
//     author: author,
//     isbn: isbn
//   }
//   if (genre != false) bookdetail.genre = genre

//   var book = new Book(bookdetail);
//   book.save(function (err) {
//     if (err) {
//       cb(err, null)
//       return
//     }
//     console.log('New Book: ' + book);
//     books.push(book)
//     cb(null, book)
//   }  );
// }

// function bookInstanceCreate(book, imprint, due_back, status, cb) {
//   bookinstancedetail = {
//     book: book,
//     imprint: imprint
//   }
//   if (due_back != false) bookinstancedetail.due_back = due_back
//   if (status != false) bookinstancedetail.status = status

//   var bookinstance = new BookInstance(bookinstancedetail);
//   bookinstance.save(function (err) {
//     if (err) {
//       console.log('ERROR CREATING BookInstance: ' + bookinstance);
//       cb(err, null)
//       return
//     }
//     console.log('New BookInstance: ' + bookinstance);
//     bookinstances.push(bookinstance)
//     cb(null, book)
//   }  );
// }

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          'Electronics',
          'Consumer electronics are products used in a domestic or personal context, in contrast to items used for business, industrial, or professional recording purposes. These can include television sets, video players and recorders (VHS, DVD, Blu-ray), videocams, audio equipment, mobile telephones and pagers, portable devices and computers and related devices',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'White Goods',
          'Household appliances to make your life smoother',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Computers',
          'Computers and computer parts. Everything ranging from full blown PCs and Laptops to internal components and cables.',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Toys',
          'Computers and computer parts. Everything ranging from full blown PCs and Laptops to internal components and cables.',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'TV',
          'TVs for everyone. Flat, fat or projectors.',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Gaming',
          'Gaming equipment for young and old. Laptops, Consoles, Games etc.',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Sound',
          'Home Theater systenms, speakers, headphones etc.',
          callback
        );
      },
      function (callback) {
        categoryCreate(
          'Phones',
          'Smart and dumb phones of any kind and brand.',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          'Iphone 14',
          'The iPhone 14 and the iPhone 14 Plus are Apple\'s new "affordable" flagship iPhones with pricing starting at $799, and the devices are being sold alongside the more expensive iPhone 14 Pro and iPhone 14 Pro Max.',
          [categories[0], categories[7]],
          1499,
          120,
          'https://www.elkjop.no/image/dv_web_D1800010021036571/414939/samsung-galaxy-s22-ultra-5g-smarttelefon-8128gb-phantom-black--pdp_zoom-3000--pdp_main-540.jpg',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Samsung Galaxu 22 Ultra',
          "The Samsung Galaxy S22 Ultra is the headliner of the S22 series. It's the first S series phone to include Samsun's S Pen.",
          [categories[0], categories[7]],
          1299,
          240,
          'https://www.elkjop.no/image/dv_web_D1800010021036571/414939/samsung-galaxy-s22-ultra-5g-smarttelefon-8128gb-phantom-black--pdp_zoom-3000--pdp_main-540.jpg',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'LG OLED65B1 65" 4K Ultra HD',
          "OLED DISPLAY: Watch your content come to life in over 8 million pixels. Each pixel turns on and off independently so you'll see your content with perfect black, over a billion rich colors and infinite contrast for a viewing experience like no other.",
          [categories[0], categories[4]],
          1499,
          120,
          'https://m.media-amazon.com/images/I/91+58iXPSsL._AC_SX466_.jpg',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'LEGO Star Wars 75252 Imperial Star Destroyer™',
          'Awesome star destroyer for you to build and play with.',
          [categories[3]],
          1499,
          120,
          'https://d189539ycils2q.cloudfront.net/media/catalog/product/cache/1c78372f5e21123f980a542bee09bf72/7/5/75252.webp',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'LG SIGNATURE Smart wi-fi Enabled Washer/Dryer Combo',
          'LG SIGNATURE stays true to the essence, delivering a new sense of life for the most discerning individual.',
          [categories[0], categories[1]],
          2479,
          43,
          'https://www.lg.com/us/images/washer-dryer-combos/md05776127/gallery/medium10.jpg',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Surface Pro 8',
          'Our most powerful Pro, combines the power of a laptop with the flexibility of a tablet.',
          [categories[0], categories[2]],
          999,
          112,
          'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWFY2f?ver=3d02&q=90&m=6&h=188&w=334&b=%23FFFFFFFF&l=f&o=t&aim=truehttps://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWFY2f?ver=3d02&q=90&m=6&h=188&w=334&b=%23FFFFFFFF&l=f&o=t&aim=true',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'PlayStation 5',
          'The most powerful console ever built.',
          [categories[0], categories[5]],
          599,
          2,
          'https://www.komplett.no/img/p/1200/1111557.jpg',
          callback
        );
      },
      function (callback) {
        itemCreate(
          'Klipsch RP-280F Premiere',
          'Powerful front facing speaker pair.',
          [categories[0], categories[6]],
          599,
          2,
          'https://www.komplett.no/img/p/1200/1111557.jpg',
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

// function createBookInstances(cb) {
//   async.parallel(
//     [
//       function (callback) {
//         bookInstanceCreate(
//           books[0],
//           'London Gollancz, 2014.',
//           false,
//           'Available',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[1],
//           ' Gollancz, 2011.',
//           false,
//           'Loaned',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[2],
//           ' Gollancz, 2015.',
//           false,
//           false,
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           'New York Tom Doherty Associates, 2016.',
//           false,
//           'Available',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           'New York Tom Doherty Associates, 2016.',
//           false,
//           'Available',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[3],
//           'New York Tom Doherty Associates, 2016.',
//           false,
//           'Available',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           'New York, NY Tom Doherty Associates, LLC, 2015.',
//           false,
//           'Available',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           'New York, NY Tom Doherty Associates, LLC, 2015.',
//           false,
//           'Maintenance',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(
//           books[4],
//           'New York, NY Tom Doherty Associates, LLC, 2015.',
//           false,
//           'Loaned',
//           callback
//         );
//       },
//       function (callback) {
//         bookInstanceCreate(books[0], 'Imprint XXX2', false, false, callback);
//       },
//       function (callback) {
//         bookInstanceCreate(books[1], 'Imprint XXX3', false, false, callback);
//       },
//     ],
//     // Optional callback
//     cb
//   );
// }

async.series(
  [createCategories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('items: ' + items);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
