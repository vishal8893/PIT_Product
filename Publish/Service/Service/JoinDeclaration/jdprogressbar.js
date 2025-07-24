var express = require('express');
var router = express.Router();
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
let FinalArray = []
var routes = function () {

    router.route('/getalltabledataforprogressbar')
        .post(function (req, res) {
            var encryptmodel = dataconn.decrypt(req.body.encryptmodel); 
                      
            FinalArray = []
            let userid = encryptmodel.Id
            getdatafromTBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO1(userid).then((Fibnalvalueout)=>{
                var EncryptLoginDetails = dataconn.encryptionAES(Fibnalvalueout);
                res.status(200).json({ Success: true, Message: 'Processbar Access', Data: EncryptLoginDetails });
            })

           

        });
    return router;


};

module.exports = routes;

function getdatafromTBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO1(id) {
    return new Promise((resolve, reject) => {
        const TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO();
        var param = {
            where: {
                EMPLOYEE_ID: id,
                IS_ACTIVE: true
            }

        };

        dataaccess.FindOne(TBL_JD_EMPLOYEE_TRADING_ACCOUNT_INFO, param)
            .then(function (result) {
                if (result != null) {
                    let R = JSON.stringify(result)
                    let P = JSON.parse(R)
                    let Fianalvalue = (P.STEP_ID / 5) * 100
                    let Fibnalvalueout = Fianalvalue.toFixed(0);
                    resolve(Fibnalvalueout)

                }
                else {
                    let Fibnalvalueout = 0;
                    resolve('0')
                    // reject()
                }
            });
    })
}

function getdatafromTBL_JD_EDU_DETAILS2(id) {
    const TBL_JD_EDU_DETAILS = datamodel.TBL_JD_EDU_DETAILS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EDU_DETAILS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_CONTACT_DETAILS3(id) {
    const TBL_JD_CONTACT_DETAILS = datamodel.TBL_JD_CONTACT_DETAILS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_CONTACT_DETAILS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_PAST_EMP_DETAILS4(id) {
    const TBL_JD_PAST_EMP_DETAILS = datamodel.TBL_JD_PAST_EMP_DETAILS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_PAST_EMP_DETAILS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO5(id) {
    const TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO6(id) {
    const TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMP_DP7(id) {
    const TBL_JD_EMP_DP = datamodel.TBL_JD_EMP_DP();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMP_DP, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMPLOYEE_RELATIVE_INFO8(id) {
    const TBL_JD_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMPLOYEE_RELATIVE_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO9(id) {
    const TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO10(id) {
    const TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMPLOYEE_RELATIVE_OTHERS_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_REL_DP11(id) {
    const TBL_JD_REL_DP = datamodel.TBL_JD_REL_DP();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_REL_DP, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS12(id) {
    const TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}


function getdatafromTBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO13(id) {
    const TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_10PERCENT_STAKE_ENTITY_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_10PERCENT_STAKE_OTHERS14(id) {
    const TBL_JD_10PERCENT_STAKE_OTHERS = datamodel.TBL_JD_10PERCENT_STAKE_OTHERS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_10PERCENT_STAKE_OTHERS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_STK_DP15(id) {
    const TBL_JD_STK_DP = datamodel.TBL_JD_STK_DP();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_STK_DP, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_JD_EMP_PHYSICAL_SHARE_HOLDING16(id) {
    const TBL_JD_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_JD_EMP_PHYSICAL_SHARE_HOLDING();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_JD_EMP_PHYSICAL_SHARE_HOLDING, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}
