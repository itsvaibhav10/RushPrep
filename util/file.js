const fs = require('fs');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgridApi);

// Send Mail To USer
exports.sendMail = (from, to, subject, content) => {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    html: content,
  };
  // sgMail.send(msg);
  return;
};

// Delete Single File
exports.deleteFile = (filepath) => {
  console.log(filepath);
  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }
  });
};

// Delete Array of Files
exports.deleteFiles = (filesPathArray) => {
  filesPathArray.forEach((filePath) => {
    console.log(filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
  });
};

exports.changeDateFormat = (date) =>
  date.getFullYear() +
  '-' +
  (date.getMonth() + 1).toString().padStart(2, '0') +
  '-' +
  date.getDate();

exports.sortByMonth = (arr, prop) => {
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'june',
    'july',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  arr.sort(function (a, b) {
    return months.indexOf(a[prop]) - months.indexOf(b[prop]);
  });
};

exports.filterDuplicate = (array = []) => {
  const filteredArray = [];
  let flag;
  array.forEach((el) => {
    flag = false;
    for (const item of filteredArray) {
      if (item.toLowerCase() === el.toLowerCase()) {
        flag = true;
        continue;
      }
    }
    if (flag === false) filteredArray.push(el);
  });
  return filteredArray;
};
