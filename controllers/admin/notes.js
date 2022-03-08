// ---------------   Models  ---------------
const Master = require('../../models/master');
const DocPdf = require('../../models/doc');

// ---------------   Modules Import  ---------------
const { deleteFiles, deleteFile } = require('../../util/file');
const { validationResult } = require('express-validator');

exports.getNewDoc = async (req, res, next) => {
  try {
    const result = await Master.findOne().lean();
    res.render('admin/notesUpload', {
      pageTitle: 'Notes Upload',
      path: '/admin/upload-notes',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      errMsg: '',
      editing: false,
      oldInput: null,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postNewDoc = async (req, res, next) => {
  const category = req.body.category;
  const subject = req.body.subject;
  const docType = req.body.docType;
  const title = req.body.title;
  const keywords = req.body.keywords;
  const uploadDoc = req.files['uploadDoc'];
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (uploadDoc) {
      const filesPathArray = uploadDoc.map((d) => d.path);
      deleteFiles(filesPathArray);
    }
    const result = await Master.findOne().lean();
    return res.status(422).render('admin/notesUpload', {
      editing: false,
      pageTitle: 'Notes Upload',
      path: '/admin/upload-notes',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      errMsg: errors.array()[0].msg,
      oldInput: {
        category: category,
        subject: subject,
        title: title,
        keywords: keywords,
      },
    });
  }
  if (!uploadDoc) {
    const result = await Master.findOne().lean();
    return res.status(422).render('admin/notesUpload', {
      editing: false,
      pageTitle: 'Notes Upload',
      path: '/admin/upload-notes',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      errMsg: 'Files is Not Selected Properly',
      oldInput: {
        category: category,
        subject: subject,
        title: title,
        keywords: keywords,
      },
    });
  }
  const searchString = `${docType} ${category} ${subject} ${title} ${keywords}`;
  const result = await DocPdf.create({
    userId: req.user._id,
    docType: docType,
    category: category,
    subject: subject,
    title: title,
    keywords: keywords,
    file: uploadDoc[0].path,
    searchString: searchString,
  });
  res.redirect('/admin/all-docs');
};

exports.getEditDoc = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/home');
  }
  const docId = req.params.docId;
  const result = await Master.findOne().lean();
  const doc = await DocPdf.findById(docId).lean();
  if (!doc) return res.redirect('/home');

  res.render('admin/notesUpload', {
    editing: editMode,
    oldInput: doc,
    pageTitle: 'Edit Notes',
    path: '/admin/edit-notes',
    category: result ? result.category : [],
    subject: result ? result.subject : [],    
    errMsg: '',
  });
};

exports.postEditDoc = async (req, res, next) => {
  const docId = req.body.docId;
  const category = req.body.category;
  const subject = req.body.subject;
  const docType = req.body.docType;
  const keywords = req.body.keywords;
  const title = req.body.title;
  const uploadDoc = req.files['uploadDoc'];
  const doc = await DocPdf.findById(docId);
  if (!doc) return res.redirect('/admin');
  const searchString = `${docType} ${category} ${subject} ${title} ${keywords}`;
  if (uploadDoc) {
    deleteFile(doc.file);
    doc.file = uploadDoc[0].path;
  }
  doc.docType = docType;
  doc.category = category;
  doc.subject = subject;
  doc.title = title;
  doc.keywords = keywords;
  doc.searchString = searchString;
  const result = await doc.save();
  res.redirect('/admin/all-docs');
};

exports.deleteDoc = async (req, res, next) => {
  try {
    const docId = req.params.docId;
    const doc = await DocPdf.findById(docId);
    if (!doc) {
      const err = new Error('Document not found.');
      err.httpStatusCode = 500;
      throw err;
    }
    deleteFile(doc.file);
    await DocPdf.deleteOne({ _id: docId });
    res.redirect('/admin/all-docs');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
