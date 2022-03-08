// ---------------   Models  ---------------
const Master = require('../../models/master');
const DocPdf = require('../../models/doc');

// ---------------   Modules Import  ---------------
const { validationResult } = require('express-validator');

//  Master = [categoryType,subject,degree,college,stream]
// TODO: = "Master Views And Routes"

exports.getMasterItems = async (req, res, next) => {
  try {
    const type = req.params.type;
    let masterType = [];
    const result = await Master.findOne().lean();
    if (result && result[type]) {
      masterType = result[type];
    }
    res.render('admin/masters', {
      pageTitle: `${type} Masters`,
      path: `/admin/masters/${type}`,
      master: masterType,
      type: type,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.createNewMasterItem = async (req, res, next) => {
  try {
    const MasterType = req.body.MasterType;
    const newMasterTypeItem = req.body.newMasterTypeItem;
    const newMasterTypeItemDes = req.body.newMasterTypeItemDes;
    const newItem = {
      title: newMasterTypeItem,
      description: newMasterTypeItemDes,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.redirect(`/admin/masters/${MasterType}`);
    }
    const result = await Master.findOne();
    if (!result) {
      await Master.create({ [MasterType]: [newItem] });
    } else {
      result[MasterType].push(newItem);
      await result.save();
    }
    res.redirect(`/admin/masters/${MasterType}`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.editMasterItem = async (req, res, next) => {
  try {
    const masterType = req.body.masterType;
    const masterItemIndex = req.body.masterItemIndex;
    const editedMasterTitle = req.body.editedMasterTitle;
    const editedMasterDes = req.body.editedMasterDes;
    const result = await Master.findOne();
    const oldMasterItem = result[masterType][masterItemIndex].title;
    result[masterType][masterItemIndex].title = editedMasterTitle;
    result[masterType][masterItemIndex].description = editedMasterDes;
    const docs = await DocPdf.find({ [masterType]: oldMasterItem });
    if (docs) {
      docs.forEach(async (doc) => {
        doc[masterType] = editedMasterTitle;
        await doc.save();
      });
    }
    await result.save();
    res.redirect(`/admin/masters/${masterType}`);
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.deleteMasterItem = async (req, res, next) => {
  try {
    const masterType = req.body.masterType;
    const masterItemIndex = req.body.masterItemIndex;
    const result = await Master.findOne();
    result[masterType].splice(masterItemIndex, 1);
    await result.save();
    res.redirect('/admin/masterPublicationHouse');
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getDocsWithMasterFilter = async (req, res, next) => {
  try {
    const type = req.body.type;
    const item = req.body.item;
    const docs = await DocPdf.find({ [type]: item }).lean();
    const quesPaper = docs.filter(
      (doc) => doc.docType.toString() === 'quespaper'
    );
    const notes = docs.filter((doc) => doc.docType.toString() === 'notes');
    const labFile = docs.filter((doc) => doc.docType.toString() === 'labfile');
    res.render('admin/allDocs', {
      quesPaper: quesPaper ? quesPaper : [],
      notes: notes ? notes : [],
      labFile: labFile ? labFile : [],
      path: '/admin/index',
      pageTitle: 'Admin Panel',
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
