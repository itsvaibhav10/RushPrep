// ---------------   Module Imports  ---------------
const express = require('express');
const homeController = require('../controllers/home');
const searchController = require('../controllers/search');
// const auth = require('../middleware/is-auth');
// const { body } = require('express-validator/check');

// Initializing Router
const router = express.Router();

// ---------------  Index  ---------------
router.get('/', homeController.comingSoon);
router.get('/home', homeController.getHome);

// ---------------  About US  ---------------
router.get('/aboutus', homeController.getAboutUs);

// ---------------  Download Doc  ---------------
router.get('/download-file/:docId', homeController.downloadFile);

// ---------------  College Docs  ---------------
router.get('/college/:item', searchController.findCollegeDocs);

// ---------------  Docs  ---------------
router.get('/find/:master', searchController.findAllMasterItems);

router.get('/:master/:item', searchController.findItemDocs);

// ---------------  Search Doc as Per Keyword  ---------------
router.get('/search-doc', searchController.keywordSearched);

module.exports = router;
