// ---------------   Models  ---------------
const Master = require('../../models/master');
const DocPdf = require('../../models/doc');

// ---------------   Modules Import  ---------------
const { deleteFiles, deleteFile } = require('../../util/file');
const { validationResult } = require('express-validator');

exports.getNewDoc = async (req, res, next) => {
  try {
    const result = await Master.findOne().lean();
    res.render('admin/quespaperupload', {
      pageTitle: 'Question Paper Upload',
      path: '/admin/upload-quespaper',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      degree: result ? result.degree : [],
      college: result ? result.college : [],
      stream: result ? result.stream : [],
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
  const month = req.body.month;
  const year = req.body.year;
  const title = req.body.title;
  const keywords = req.body.keywords;
  const uploadDoc = req.files['uploadDoc'];
  const degree = req.body.degree ? req.body.degree : '';
  const college = req.body.college ? req.body.college : '';
  const stream = req.body.stream ? req.body.stream : '';
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (uploadDoc) {
      const filesPathArray = uploadDoc.map((d) => d.path);
      deleteFiles(filesPathArray);
    }
    const result = await Master.findOne().lean();
    return res.status(422).render('admin/quespaperupload', {
      editing: false,
      pageTitle: 'Question Paper Upload',
      path: '/admin/upload-quespaper',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      degree: result ? result.degree : [],
      college: result ? result.college : [],
      stream: result ? result.stream : [],
      errMsg: errors.array()[0].msg,
      oldInput: {
        keywords: keywords,
        category: category,
        subject: subject,
        month: month,
        year: year,
        title: title,
        degree: degree,
        stream: stream,
        college: college,
      },
    });
  }
  if (!uploadDoc) {
    const result = await Master.findOne().lean();
    return res.status(422).render('admin/quespaperupload', {
      editing: false,
      pageTitle: 'Question Paper Upload',
      path: '/admin/upload-quespaper',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      degree: result ? result.degree : [],
      college: result ? result.college : [],
      stream: result ? result.stream : [],
      errMsg: 'Files is Not Selected Properly',
      oldInput: {
        keywords: keywords,
        category: category,
        subject: subject,
        month: month,
        year: year,
        title: title,
        degree: degree,
        stream: stream,
        college: college,
      },
    });
  }
  const searchString = `question paper ${category} ${subject} ${college} ${month} ${year} ${title} ${keywords} ${degree} ${stream}`;
  const result = await DocPdf.create({
    userId: req.user._id,
    docType: docType,
    category: category,
    subject: subject,
    college: college,
    month: month,
    year: year,
    title: title,
    keywords: keywords,
    file: uploadDoc[0].path,
    degree: degree,
    stream: stream,
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

  res.render('admin/quespaperupload', {
    editing: editMode,
    oldInput: doc,
    pageTitle: 'Edit Question Paper',
    path: '/admin/edit-quespaper',
    category: result ? result.category : [],
    subject: result ? result.subject : [],
    degree: result ? result.degree : [],
    college: result ? result.college : [],
    stream: result ? result.stream : [],
    errMsg: '',
  });
};

exports.postEditDoc = async (req, res, next) => {
  const docId = req.body.docId;
  const category = req.body.category;
  const subject = req.body.subject;
  const docType = req.body.docType;
  const keywords = req.body.keywords;
  const uploadDoc = req.files['uploadDoc'];
  const month = req.body.month;
  const year = req.body.year;
  const title = req.body.title;
  const degree = req.body.degree ? req.body.degree : '';
  const college = req.body.college ? req.body.college : '';
  const stream = req.body.stream ? req.body.stream : '';
  const doc = await DocPdf.findById(docId);
  if (!doc) return res.redirect('/admin');

  if (uploadDoc) {
    deleteFile(doc.file);
    doc.file = uploadDoc[0].path;
  }
  const searchString = `question paper ${category} ${subject} ${college} ${month} ${year} ${title} ${keywords} ${degree} ${stream}`;
  doc.docType = docType;
  doc.category = category;
  doc.subject = subject;
  doc.degree = degree;
  doc.college = college;
  doc.stream = stream;
  doc.keywords = keywords;
  doc.month = month;
  doc.year = year;
  doc.title = title;
  doc.searchString = searchString;
  await doc.save();
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
