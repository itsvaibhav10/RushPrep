// ---------------   Imports  ---------------
const Master = require('../models/master');
const DocPdf = require('../models/doc');

// ---------------  Index  ---------------
exports.comingSoon = (req, res) => {
  return res.redirect('/home');
};

exports.getHome = async (req, res, next) => {
  try {
    const result = await Master.findOne().lean();
    res.render('shop/index', {
      pageTitle: 'Home',
      path: '/',
      category: result ? result.category : [],
      subject: result ? result.subject : [],
      college: result ? result.college : [],
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

// ---------------  AboutUs  ---------------
exports.getAboutUs = (req, res) => {
  res.render('shop/aboutus', {
    pageTitle: 'About Us',
    path: '/aboutus',
  });
};

// ---------------  Download Doc  ---------------
exports.downloadFile = async (req, res) => {
  const docId = req.params.docId;
  const doc = await DocPdf.findById(docId);
  if (!doc) return;
  let docName;
  if (doc.docType.toString().toLowerCase() === 'quespaper')
  docName = `${doc.month}-${doc.year}_${doc.title}_${doc.subject}_${doc.category}.pdf`;
  else docName = `${doc.title}_${doc.subject}_${doc.category}.pdf`;  
  res.download(doc.file, docName);
  doc.downloads++;
  await doc.save();
};
