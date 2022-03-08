// ---------------   Models  ---------------
const DocPdf = require('../../models/doc');

// ---------------   Modules Import  ---------------

exports.getHome = async (req, res, next) => {
  try {    
    res.redirect('/admin/all-docs');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getDocs = async (req, res) => {
  const docs = await DocPdf.find().lean();
  const quesPaper = docs.filter(
    (doc) => doc.docType.toString() === 'quespaper'
  );
  const notes = docs.filter((doc) => doc.docType.toString() === 'notes');
  const labFile = docs.filter((doc) => doc.docType.toString() === 'labfile');
  res.render('admin/allDocs', {
    quesPaper: quesPaper ? quesPaper : [],
    notes: notes ? notes : [],
    labFile: labFile ? labFile : [],
    path: '/admin/all-docs',
    pageTitle: 'Admin Panel',
  });
};