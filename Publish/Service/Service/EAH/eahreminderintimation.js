var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const ejs = require('ejs');
const pdf = require('html-pdf');
const Emailsendpassword = require('../../Common/Mailer');
const fs = require('fs');
const path = require("path");

var routes = function () {

    // router.route('/GetallUser')
    //     .get(function (req, res) {
    //         const TBL_USER_MST = datamodel.TBL_USER_MST();
    //         const EIRF_NON_D_USER_TRACKER = datamodel.EIRF_NON_D_USER_TRACKER();
    //         const TRD_Email_Status = datamodel.TRD_Email_Status();
    //         dataaccess.FindAll(TBL_USER_MST)
    //             .then(async function (result1) {
    //                 if (result1 != null) {
    //                     let string = JSON.stringify(result1)
    //                     let parse = JSON.parse(string)
    //                     let Array = []

    //                     parse.forEach(async (element) => {
    //                         var param = {
    //                             where: { EmpNo: element.EMPNO }

    //                         };

    //                         await dataaccess.FindOne(EIRF_NON_D_USER_TRACKER, param)
    //                             .then(async function (result2) {
    //                                 if (result2 != null) {
    //                                     let string2 = JSON.stringify(result2)
    //                                     let parse2 = JSON.parse(string2)
    //                                     console.log("parse2", parse2);
    //                                     // Array.push(parse2)
    //                                     eachreminder(element).then(() => {
    //                                         var values = {
    //                                             EmpId: element.EMPNO,
    //                                             EmailId: element.EMAILID,
    //                                             EmailStatus: 'Success',
    //                                             EmailType: 'Reminder',
    //                                             EmailDate: connect.sequelize.fn("NOW"),
    //                                             IsTrackedEmp: 'Yes'

    //                                         };
    //                                         dataaccess.Create(TRD_Email_Status, values)
    //                                             .then(function (result3) {
    //                                                 if (result3 != null) {

    //                                                 } else {

    //                                                 }
    //                                             })
    //                                     })


    //                                 }
    //                                 else {
    //                                     var param = {
    //                                         where: { EmpId: element.EMPNO }

    //                                     };
    //                                     await dataaccess.FindOne(TRD_Email_Status, param)
    //                                         .then(async function (result4) {
    //                                             if (result4 != null) {

    //                                             } else {
    //                                                 eachintimation(element).then(() => {
    //                                                     var values = {
    //                                                         EmpId: element.EMPNO,
    //                                                         EmailId: element.EMAILID,
    //                                                         EmailStatus: 'Success',
    //                                                         EmailType: 'Intimastion',
    //                                                         EmailDate: connect.sequelize.fn("NOW"),
    //                                                         IsTrackedEmp: 'Yes'

    //                                                     };
    //                                                     dataaccess.Create(TRD_Email_Status, values)
    //                                                         .then(function (result3) {
    //                                                             if (result3 != null) {

    //                                                             } else {

    //                                                             }
    //                                                         })
    //                                                 })

    //                                             }
    //                                         })


    //                                 }
    //                             });
    //                     })
    //                 }
    //                 else {

    //                 }
    //             });
    //     });



    return router;
};

async function getalluser() {
    datetime = ''
    const TBL_USER_MST = datamodel.TBL_USER_MST();
    const EIRF_NON_D_USER_TRACKER = datamodel.EIRF_NON_D_USER_TRACKER();
    const TRD_Email_Status = datamodel.TRD_Email_Status();
    dataaccess.FindAll(TBL_USER_MST)
        .then(async function (result1) {
            if (result1 != null) {
                let string = JSON.stringify(result1)
                let parse = JSON.parse(string)
                let Array = []

                parse.map(async (element) => {
                    element.datetimeIN = new Date();
                    var param = {
                        where: { EmpNo: element.EMPNO }

                    };

                    await dataaccess.FindOne(EIRF_NON_D_USER_TRACKER, param)
                        .then(async function (result2) {
                            if (result2 != null) {
                                
                                // eachreminder(element).then(() => {
                                var values = {
                                    EmpId: element.EMPNO,
                                    EmailId: element.EMAILID,
                                    EmailStatus: 'Success',
                                    EmailType: 'Reminder',
                                    EmailDate: connect.sequelize.fn("NOW"),
                                    IsTrackedEmp: 'Yes'

                                };
                                dataaccess.Create(TRD_Email_Status, values)
                                    .then(function (result3) {
                                        if (result3 != null) {
                                            var param2 = {
                                                where: {
                                                    EmpId: element.EMPNO,
                                                    EmailType:'Intimastion'
                                                }
            
                                            };
                                            dataaccess.FindOne(TRD_Email_Status, param2)
                                                .then(function (result3) {
                                                    if (result3 != null) {
                                                        let string1 = JSON.stringify(result3)
                                                        let parse1 = JSON.parse(string1)
                                                        element.datetime = parse1.EmailDate
                                                        console.log("datetime",element);
                                                    } else {
                                                        element.datetime = new Date();
                                                        console.log("datetime12",element);
                                                    }
            
                                                })
                                            setTimeout(() => {
                                                Emailsendpassword.Eahreminderandintimation('reminder', element,)
                                            }, 1000);
                                        } else {

                                        }
                                    })
                                // })


                            }
                            else {
                                var param = {
                                    where: { EmpId: element.EMPNO }

                                };
                                await dataaccess.FindOne(TRD_Email_Status, param)
                                    .then(async function (result4) {
                                        if (result4 != null) {

                                        } else {


                                            Emailsendpassword.Eahreminderandintimation('intimation', element)

                                            // eachintimation(element).then(() => {
                                            var values = {
                                                EmpId: element.EMPNO,
                                                EmailId: element.EMAILID,
                                                EmailStatus: 'Success',
                                                EmailType: 'Intimastion',
                                                EmailDate: connect.sequelize.fn("NOW"),
                                                IsTrackedEmp: 'Yes'

                                            };
                                            dataaccess.Create(TRD_Email_Status, values)
                                                .then(function (result3) {
                                                    if (result3 != null) {

                                                    } else {

                                                    }
                                                })
                                            // })

                                        }
                                    })


                            }
                        });
                })
            }
            else {

            }
        });
}

async function eachreminder(UserData) {
    return new Promise((resolve, reject) => {
        fs.readFile('eachreminder.ejs', 'utf8', function (err, templateContent) {
            if (err) {
                console.log("Error reading EJS template:", err);
            } else {
                // Render the template with student data
                const content = ejs.render(templateContent, { Data: UserData });

                // Generate PDF from the rendered HTML
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
                    if (err) {
                        console.log("Error creating PDF:", err);
                        reject()
                    } else {
                        stream.pipe(fs.createWriteStream('eachreminder.pdf'));
                        Emailsendpassword.Eahreminderandintimation('reminder', UserData.EMAILID)
                        console.log("PDF R created successfully.");
                        resolve()

                    }
                });
            }
        });
    })
}

function eachintimation(UserData) {
    return new Promise((resolve, reject) => {
        fs.readFile('eachintimation.ejs', 'utf8', function (err, templateContent) {
            if (err) {
                console.log("Error reading EJS template:", err);
            } else {
                // Render the template with student data
                const content = ejs.render(templateContent, { Data: UserData });

                // Generate PDF from the rendered HTML
                pdf.create(content, { format: 'Letter', orientation: 'landscape' }).toStream(function (err, stream) {
                    if (err) {
                        console.log("Error creating PDF:", err);
                        reject()
                    } else {
                        stream.pipe(fs.createWriteStream('Eahintimation.pdf'));
                        Emailsendpassword.Eahreminderandintimation('intimation', UserData.EMAILID)
                        console.log("PDF I created successfully.");

                        resolve()
                    }
                });
            }
        });
    })
}



module.exports = routes;

// module.exports.eachreminder = eachreminder
// module.exports.eachintimation = eachintimation
module.exports.getalluser = getalluser