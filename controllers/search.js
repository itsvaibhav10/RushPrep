// ---------------   Modules Import  ---------------
const Master = require('../models/master');
const DocPdf = require('../models/doc');

const { sortByMonth, filterDuplicate } = require('../util/file');

exports.keywordSearched = async (req, res, next) => {
  try {
    const keywords = req.query.keywords.toLowerCase();
    const docType = req.query.docType.toLowerCase();
    const docs = await DocPdf.find({
      searchString: { $regex: '.*' + keywords + '.*' },
      docType: docType,
    }).lean();
    let fileName = '';
    if (docType === 'notes') fileName = 'searchnotes';
    else fileName = 'searchquestionpaper';
    res.render(`shop/${fileName}`, {
      pageTitle: 'Search Result',
      path: '/search',
      docs: docs,
      searchQuery: keywords,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.findItemDocs = async (req, res, next) => {
  try {
    const master = req.params.master;
    const item = req.params.item;
    const result = await Master.findOne().lean();
    const heading = result[master].find(
      (i) => i.title.toLowerCase() === item.toLowerCase()
    );
    const docs = await DocPdf.find({ [master]: item }).lean();
    const quesPaper = docs.filter(
      (doc) => doc.docType.toString() === 'quespaper'
    );
    const notes = docs.filter((doc) => doc.docType.toString() === 'notes');
    if (quesPaper.length > 0) sortByMonth(quesPaper, 'month');
    // const labFile = docs.filter((doc) => doc.docType.toString() === 'labfile');
    res.render('shop/store', {
      pageTitle: item.toUpperCase(),
      path: '/store',
      heading: heading ? heading : '',
      quesPaper: quesPaper ? quesPaper : [],
      notes: notes ? notes : [],
      // labFile: labFile ? labFile : [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.findCollegeDocs = async (req, res, next) => {
  try {
    const collegeName = req.params.item;
    const result = await Master.findOne().lean();
    const heading = result.college.find(
      (i) => i.title.toLowerCase() === collegeName.toLowerCase()
    );
    const docs = await DocPdf.find({ college: collegeName }).lean();
    if (docs.length > 0) {
      sortByMonth(docs, 'month');
      const subjects = docs.map((doc) => doc.subject);
      const filtered = filterDuplicate(subjects);
      res.render('shop/college', {
        pageTitle: collegeName.toUpperCase(),
        path: '/store',
        heading: heading ? heading : '',
        subjects: filtered,
        docs: docs,
      });
    } else {
      res.render('shop/college', {
        pageTitle: 'Store',
        path: '/store',
        heading: heading ? heading : '',
        subjects: [],
        docs: docs,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.findAllMasterItems = async (req, res, next) => {
  try {
    const master = req.params.master;
    const result = await Master.findOne().lean();
    const itemArray = result[master].map((m) => m.title);
    res.render('shop/allMasterList', {
      pageTitle: master,
      path: '/store',
      heading: master,
      items: itemArray ? itemArray : [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
