// ---------------   Module Imports  ---------------
const express = require('express');
const adminController = require('../controllers/admin/admin');
const adminMastersController = require('../controllers/admin/masters');
const notesController = require('../controllers/admin/notes');
const quesController = require('../controllers/admin/quespaper');
const auth = require('../middleware/is-auth');
const { body } = require('express-validator');

// Initializing Router
const router = express.Router();

// ---------------  Admin CMS Routes  ---------------
router.get('/', auth.isAuthAdmin, adminController.getHome);
router.get('/all-docs', auth.isAuthAdmin, adminController.getDocs);

//  ----------  QuestionPaper Management Routes  ----------
router.get('/upload-quespaper', auth.isAuthAdmin, quesController.getNewDoc);
router.post(
  '/upload-quespaper',
  auth.isAuthAdmin,
  [
    body('category', `Please Select => Category`).not().isEmpty().trim(),
    body('subject', `Please Select => Subject`).not().isEmpty().trim(),
    body('college', `Please Select => college`).not().isEmpty().trim(),
    body('month', `Please Select => Month`).not().isEmpty().trim(),
    body('year', `Please Select => Year`).not().isEmpty().trim(),
    body('title', `Please Title => Title`).not().isEmpty().trim(),
    body('keywords', `Please Enter keywords For The Documents`)
      .not()
      .isEmpty()
      .trim(),
  ],
  quesController.postNewDoc
);
router.get(
  '/edit-quespaper/:docId',
  auth.isAuthAdmin,
  quesController.getEditDoc
);
router.post('/edit-quespaper', auth.isAuthAdmin, quesController.postEditDoc);
router.get(
  '/del-quespaper/:docId',
  auth.isAuthAdmin,
  notesController.deleteDoc
);
//  ----------  End Here  ----------

//  ----------  Notes Management Routes  ----------
router.get('/upload-notes', auth.isAuthAdmin, notesController.getNewDoc);
router.post(
  '/upload-notes',
  auth.isAuthAdmin,
  [
    body('category', `Please Select => Category`).not().isEmpty().trim(),
    body('subject', `Please Select => Subject`).not().isEmpty().trim(),
    body('title', `Please Enter Title`).not().isEmpty().trim(),
    body('keywords', `Please Enter keywords`).not().isEmpty().trim(),
  ],
  notesController.postNewDoc
);
router.get('/edit-notes/:docId', auth.isAuthAdmin, notesController.getEditDoc);
router.post('/edit-notes', auth.isAuthAdmin, notesController.postEditDoc);
router.get('/del-notes/:docId', auth.isAuthAdmin, notesController.deleteDoc);
//  ----------  End Here  ----------

//  ----------  Master Management Routes  ----------
router.get(
  '/masters/:type',
  auth.isAuthAdmin,
  adminMastersController.getMasterItems
);

router.post(
  '/add-master-item',
  auth.isAuthAdmin,
  body('newMasterTypeItem', 'Item Cant Be Empty').notEmpty(),
  adminMastersController.createNewMasterItem
);

router.post(
  '/edit-master-item',
  auth.isAuthAdmin,
  adminMastersController.editMasterItem
);

router.post(
  '/all-docs',
  auth.isAuthAdmin,
  adminMastersController.getDocsWithMasterFilter
);

//  ----------  End Here  ----------

module.exports = router;
