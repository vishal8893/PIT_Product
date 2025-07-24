var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');

var routes = function () {

    //compliance rpt
    router.route('/Violationdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);

            if (Fromdate != '' && ToDate != '' && (Script === '' || Script === undefined)) {
                // try {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."CreatedDate" BETWEEN '${Fromdate}' AND '${ToDate}'                                                        
                           -- AND DATE(erp."CreatedDate" AT TIME ZONE 'UTC') BETWEEN $1 AND $2                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);

                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
                // } catch (error) {
                //     console.error("Error executing Sequelize query:", error);
                //     res.status(500).json({ Success: false, Message: 'Internal Server Error' });
                // }
            } else if (Script != '' && Fromdate != '' && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'                                                        
                            AND DATE(erp."CreatedDate") BETWEEN '${Fromdate}' AND '${ToDate}'                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && Fromdate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${Fromdate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined) {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            }

            // else if (ToDate != '') {

            //     let quiry = `SELECT erp.*, um."FIRSTNAME"
            //                 FROM public."eirf_rico_sos_processed" erp
            //                 LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            //                 WHERE (erp."IntradayVoil" IS NOT NULL
            //                 OR erp."NoApprovalVoil" IS NOT NULL 
            //                 OR erp."GreaterthanApprovedVoil" IS NOT NULL 
            //                 OR erp."LessthanApprovedVoil" IS NOT NULL 
            //                 OR erp."HoldingVoil" IS NOT NULL 
            //                 OR erp."RestrictedListVoil" IS NOT NULL 
            //                 OR erp."GreyListVoil" IS NOT NULL 
            //                 OR erp."UcLlistVoil" IS NOT NULL)
            //                 AND DATE(erp."CreatedDate") = '${ToDate}'
            //                 ORDER BY erp."TradeDate", erp."TransId";`;

            //     let result = await connect.sequelize.query(quiry);
            //     let Array = result[0];
            //     for (const item of Array) {
            //         const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
            //         const param = {
            //             where: {
            //                 VoilationId: parseInt(item.TransId)
            //             }
            //         };

            //         try {
            //             const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
            //             if (remarksResult != null && remarksResult.length > 0) {
            //                 item.Status = 'Clarification Provided';
            //                 item.remarkCreatedBy = remarksResult[0].CREATED_BY;
            //                 // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
            //             } else {
            //                 item.Status = 'Clarification Not Provided';
            //             }
            //         } catch (error) {
            //             // Handle error if needed
            //         }
            //     }
            //     res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: Array });
            // } else if (Fromdate != '') {
            //     let quiry = `SELECT erp.*, um."FIRSTNAME"
            //                 FROM public."eirf_rico_sos_processed" erp
            //                 LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            //                 WHERE (erp."IntradayVoil" IS NOT NULL
            //                 OR erp."NoApprovalVoil" IS NOT NULL 
            //                 OR erp."GreaterthanApprovedVoil" IS NOT NULL 
            //                 OR erp."LessthanApprovedVoil" IS NOT NULL 
            //                 OR erp."HoldingVoil" IS NOT NULL 
            //                 OR erp."RestrictedListVoil" IS NOT NULL 
            //                 OR erp."GreyListVoil" IS NOT NULL 
            //                 OR erp."UcLlistVoil" IS NOT NULL)
            //                 AND DATE(erp."CreatedDate") = '${Fromdate}'
            //                 ORDER BY erp."TradeDate", erp."TransId";`;

            //     let result = await connect.sequelize.query(quiry);
            //     let Array = result[0];
            //     for (const item of Array) {
            //         const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
            //         const param = {
            //             where: {
            //                 VoilationId: parseInt(item.TransId)
            //             }
            //         };

            //         try {
            //             const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
            //             if (remarksResult != null && remarksResult.length > 0) {
            //                 item.Status = 'Clarification Provided';
            //                 item.remarkCreatedBy = remarksResult[0].CREATED_BY;
            //                 // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
            //             } else {
            //                 item.Status = 'Clarification Not Provided';
            //             }
            //         } catch (error) {
            //             // Handle error if needed
            //         }
            //     }
            //     res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: Array });
            // } 


        });

    router.route('/Violationdata1')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);

            let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    router.route('/Violationdata2')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);


            let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND DATE(erp."CreatedDate") = '${Fromdate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    //user rpt
    router.route('/usrViolationdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);
            const EmpID = encryptmodel.userid;
            console.log("EmpID", EmpID);

            if (Fromdate != '' && ToDate != '' && (Script === '' || Script === undefined)) {
                // try {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."CreatedDate" BETWEEN '${Fromdate}' AND '${ToDate}'
                            AND erp."EmpId" = '${EmpID}'                                                        
                           -- AND DATE(erp."CreatedDate" AT TIME ZONE 'UTC') BETWEEN $1 AND $2                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);

                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
                // } catch (error) {
                //     console.error("Error executing Sequelize query:", error);
                //     res.status(500).json({ Success: false, Message: 'Internal Server Error' });
                // }
            } else if (Script != '' && Fromdate != '' && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'                                                        
                            AND DATE(erp."CreatedDate") BETWEEN '${Fromdate}' AND '${ToDate}'
                            AND erp."EmpId" = '${EmpID}'                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            AND erp."EmpId" = '${EmpID}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && Fromdate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${Fromdate}'
                            AND erp."EmpId" = '${EmpID}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined) {
                let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND erp."EmpId" = '${EmpID}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });

            }

            // else if (ToDate != '') {

            //     let quiry = `SELECT erp.*, um."FIRSTNAME"
            //                 FROM public."eirf_rico_sos_processed" erp
            //                 LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            //                 WHERE (erp."IntradayVoil" IS NOT NULL
            //                 OR erp."NoApprovalVoil" IS NOT NULL 
            //                 OR erp."GreaterthanApprovedVoil" IS NOT NULL 
            //                 OR erp."LessthanApprovedVoil" IS NOT NULL 
            //                 OR erp."HoldingVoil" IS NOT NULL 
            //                 OR erp."RestrictedListVoil" IS NOT NULL 
            //                 OR erp."GreyListVoil" IS NOT NULL 
            //                 OR erp."UcLlistVoil" IS NOT NULL)
            //                 AND DATE(erp."CreatedDate") = '${ToDate}'
            //                 ORDER BY erp."TradeDate", erp."TransId";`;

            //     let result = await connect.sequelize.query(quiry);
            //     let Array = result[0];
            //     for (const item of Array) {
            //         const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
            //         const param = {
            //             where: {
            //                 VoilationId: parseInt(item.TransId)
            //             }
            //         };

            //         try {
            //             const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
            //             if (remarksResult != null && remarksResult.length > 0) {
            //                 item.Status = 'Clarification Provided';
            //                 item.remarkCreatedBy = remarksResult[0].CREATED_BY;
            //                 // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
            //             } else {
            //                 item.Status = 'Clarification Not Provided';
            //             }
            //         } catch (error) {
            //             // Handle error if needed
            //         }
            //     }
            //     res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: Array });
            // } else if (Fromdate != '') {
            //     let quiry = `SELECT erp.*, um."FIRSTNAME"
            //                 FROM public."eirf_rico_sos_processed" erp
            //                 LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            //                 WHERE (erp."IntradayVoil" IS NOT NULL
            //                 OR erp."NoApprovalVoil" IS NOT NULL 
            //                 OR erp."GreaterthanApprovedVoil" IS NOT NULL 
            //                 OR erp."LessthanApprovedVoil" IS NOT NULL 
            //                 OR erp."HoldingVoil" IS NOT NULL 
            //                 OR erp."RestrictedListVoil" IS NOT NULL 
            //                 OR erp."GreyListVoil" IS NOT NULL 
            //                 OR erp."UcLlistVoil" IS NOT NULL)
            //                 AND DATE(erp."CreatedDate") = '${Fromdate}'
            //                 ORDER BY erp."TradeDate", erp."TransId";`;

            //     let result = await connect.sequelize.query(quiry);
            //     let Array = result[0];
            //     for (const item of Array) {
            //         const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
            //         const param = {
            //             where: {
            //                 VoilationId: parseInt(item.TransId)
            //             }
            //         };

            //         try {
            //             const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
            //             if (remarksResult != null && remarksResult.length > 0) {
            //                 item.Status = 'Clarification Provided';
            //                 item.remarkCreatedBy = remarksResult[0].CREATED_BY;
            //                 // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
            //             } else {
            //                 item.Status = 'Clarification Not Provided';
            //             }
            //         } catch (error) {
            //             // Handle error if needed
            //         }
            //     }
            //     res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: Array });
            // } 


        });

    router.route('/usrViolationdata1')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);
            const EmpID = encryptmodel.userid;
            console.log("EmpID", EmpID);

            let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            AND erp."EmpId" = '${EmpID}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    router.route('/usrViolationdata2')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);
            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);
            const EmpID = encryptmodel.userid;
            console.log("EmpID", EmpID);


            let quiry = `SELECT erp.*, um."FIRSTNAME"
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND DATE(erp."CreatedDate") = '${Fromdate}'
                            AND erp."EmpId" = '${EmpID}'     
                            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    //compliance dwnld
    router.route('/getViolationdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);

            if (Fromdate != '' && ToDate != '' && (Script === '' || Script === undefined)) {
                // try {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."CreatedDate" BETWEEN '${Fromdate}' AND '${ToDate}'                                                        
                           -- AND DATE(erp."CreatedDate" AT TIME ZONE 'UTC') BETWEEN $1 AND $2                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);

                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
                // } catch (error) {
                //     console.error("Error executing Sequelize query:", error);
                //     res.status(500).json({ Success: false, Message: 'Internal Server Error' });
                // }
            } else if (Script != '' && Fromdate != '' && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'                                                        
                            AND DATE(erp."CreatedDate") BETWEEN '${Fromdate}' AND '${ToDate}'                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && Fromdate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${Fromdate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined) {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            }


        });

    router.route('/getViolationdata1')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);

            let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    router.route('/getViolationdata2')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);


            let quiry = `SELECT erp.*, um."FIRSTNAME", v.*
            FROM public."eirf_rico_sos_processed" erp
            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
            WHERE (erp."IntradayVoil" IS NOT NULL
                   OR erp."NoApprovalVoil" IS NOT NULL 
                   OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                   OR erp."LessthanApprovedVoil" IS NOT NULL 
                   OR erp."HoldingVoil" IS NOT NULL 
                   OR erp."RestrictedListVoil" IS NOT NULL 
                   OR erp."GreyListVoil" IS NOT NULL 
                   OR erp."UcLlistVoil" IS NOT NULL)
                   AND DATE(erp."CreatedDate") = '${Fromdate}'       
            ORDER BY erp."TradeDate", erp."TransId";`;


            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    // user dwnld
    router.route('/getusrViolationdata')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);
            const EmpID = encryptmodel.userid;
            console.log("EmpID", EmpID);

            if (Fromdate != '' && ToDate != '' && (Script === '' || Script === undefined)) {
                // try {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."CreatedDate" BETWEEN '${Fromdate}' AND '${ToDate}'
                            AND erp."EmpId" = '${EmpID}'                                                         
                           -- AND DATE(erp."CreatedDate" AT TIME ZONE 'UTC') BETWEEN $1 AND $2                            
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);

                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
                // } catch (error) {
                //     console.error("Error executing Sequelize query:", error);
                //     res.status(500).json({ Success: false, Message: 'Internal Server Error' });
                // }
            } else if (Script != '' && Fromdate != '' && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'                                                        
                            AND DATE(erp."CreatedDate") BETWEEN '${Fromdate}' AND '${ToDate}'
                            AND erp."EmpId" = '${EmpID}'                             
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && ToDate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            AND erp."EmpId" = '${EmpID}' 
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined && Fromdate != '') {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND DATE(erp."CreatedDate") = '${Fromdate}'
                            AND erp."EmpId" = '${EmpID}' 
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            } else if (Script != undefined) {
                let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND erp."ScripName" = '${Script}'
                            AND erp."EmpId" = '${EmpID}' 
                            ORDER BY erp."TradeDate", erp."TransId";`;

                let result = await connect.sequelize.query(quiry);
                let Array = result[0];
                for (const item of Array) {
                    const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                    const param = {
                        where: {
                            VoilationId: parseInt(item.TransId)
                        }
                    };

                    try {
                        const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                        if (remarksResult != null && remarksResult.length > 0) {
                            item.Status = 'Clarification Provided';
                            item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                            // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                        } else {
                            item.Status = 'Clarification Not Provided';
                        }
                    } catch (error) {
                        // Handle error if needed
                    }
                }
                var EncryptLoginDetails = dataconn.encryptionAES(Array);
                res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });
            }


        });

    router.route('/getusrViolationdata1')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);
            const EmpID = encryptmodel.userid;
            console.log("EmpID", EmpID);

            let quiry = `SELECT erp.*, um."FIRSTNAME",v.*
                            FROM public."eirf_rico_sos_processed" erp
                            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
                            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
                            WHERE (erp."IntradayVoil" IS NOT NULL
                            OR erp."NoApprovalVoil" IS NOT NULL 
                            OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                            OR erp."LessthanApprovedVoil" IS NOT NULL 
                            OR erp."HoldingVoil" IS NOT NULL 
                            OR erp."RestrictedListVoil" IS NOT NULL 
                            OR erp."GreyListVoil" IS NOT NULL 
                            OR erp."UcLlistVoil" IS NOT NULL)
                            AND DATE(erp."CreatedDate") = '${ToDate}'
                            AND erp."EmpId" = '${EmpID}' 
                            ORDER BY erp."TradeDate", erp."TransId";`;

            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });

    router.route('/getusrViolationdata2')
        .post(async function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel);

            const Script = encryptmodel.scrip;
            console.log("script", Script);
            const Fromdate = encryptmodel.fromDate;
            console.log("fromdate", Fromdate);
            const ToDate = encryptmodel.toDate;
            console.log("todate", ToDate);
            const EmpID = encryptmodel.userid;
            console.log("EmpID", EmpID);


            let quiry = `SELECT erp.*, um."FIRSTNAME", v.*
            FROM public."eirf_rico_sos_processed" erp
            LEFT JOIN "TBL_USER_MST" um ON erp."EmpId" = um."EMPNO"
            LEFT JOIN "TBL_ViolationRemarksDetails" v ON erp."TransId" = v."VoilationId"
            WHERE (erp."IntradayVoil" IS NOT NULL
                   OR erp."NoApprovalVoil" IS NOT NULL 
                   OR erp."GreaterthanApprovedVoil" IS NOT NULL 
                   OR erp."LessthanApprovedVoil" IS NOT NULL 
                   OR erp."HoldingVoil" IS NOT NULL 
                   OR erp."RestrictedListVoil" IS NOT NULL 
                   OR erp."GreyListVoil" IS NOT NULL 
                   OR erp."UcLlistVoil" IS NOT NULL)
                   AND DATE(erp."CreatedDate") = '${Fromdate}' 
                   AND erp."EmpId" = '${EmpID}'       
            ORDER BY erp."TradeDate", erp."TransId";`;


            let result = await connect.sequelize.query(quiry);
            let Array = result[0];
            for (const item of Array) {
                const TBL_ViolationRemarksDetails = datamodel.TBL_ViolationRemarksDetails();
                const param = {
                    where: {
                        VoilationId: parseInt(item.TransId)
                    }
                };

                try {
                    const remarksResult = await dataaccess.FindAll(TBL_ViolationRemarksDetails, param);
                    if (remarksResult != null && remarksResult.length > 0) {
                        item.Status = 'Clarification Provided';
                        item.remarkCreatedBy = remarksResult[0].CREATED_BY;
                        // item.remarkroleby = await getRoleName(remarksResult[0].CREATED_BY);
                    } else {
                        item.Status = 'Clarification Not Provided';
                    }
                } catch (error) {
                    // Handle error if needed
                }
            }
            var EncryptLoginDetails = dataconn.encryptionAES(Array);
            res.status(200).json({ Success: true, Message: 'Violationdata List Table Access', Data: EncryptLoginDetails });


        });


    return router;
};

module.exports = routes;