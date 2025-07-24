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
            getdatafromTBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO1(userid).
            then((Fibnalvalueout)=>{
                console.log("successFibnalvalueout",Fibnalvalueout);
                // if(Fibnalvalueout != null){
                console.log("successFibnalvalueout",Fibnalvalueout);
                var EncryptLoginDetails = dataconn.encryptionAES(Fibnalvalueout); 
                res.status(200).json({ Success: true, Message: 'Processbar Access', Data: EncryptLoginDetails });                
                // }else{
                //     let Fibnalvalueout1 = 0;
                //     console.log("falseFibnalvalueout",Fibnalvalueout);
                //     res.status(200).json({ Success: false, Message: 'Processbar Access', Data: Fibnalvalueout1 });
                // }
            })
           
                
             
            
        });
    return router;


};

module.exports = routes;

function getdatafromTBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO1(id) {
    return new Promise((resolve, reject) => {
    const TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            console.log("resultstep",result);
            if (result != null) {

                let R = JSON.stringify(result)
                let P = JSON.parse(R)
                let Fianalvalue = (P.STEP_ID / 7) * 100
                let Fibnalvalueout = Fianalvalue.toFixed(0);
                resolve(Fibnalvalueout)
                console.log("Fibnalvalueout",Fibnalvalueout);

            }
            else {
                let Fibnalvalueout = 0;
                resolve('0')
                console.log("resultelseFibnalvalueoutelse",Fibnalvalueout);
                // reject()
            }
        });

    })
}

function getdatafromTBL_EAH_EMPLOYEE_QUALIFICATION_INFO2(id) {
    const TBL_EAH_EMPLOYEE_QUALIFICATION_INFO = datamodel.TBL_EAH_EMPLOYEE_QUALIFICATION_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_QUALIFICATION_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO3(id) {
    const TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO = datamodel.TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_CONTACT_DETAILS_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_WORKEX_INFO4(id) {
    const TBL_EAH_EMPLOYEE_WORKEX_INFO = datamodel.TBL_EAH_EMPLOYEE_WORKEX_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_WORKEX_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO5(id) {
    const TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_ENTITY_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO6(id) {
    const TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_OTHERS_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMP_DP_ENTITY7(id) {
    const TBL_EAH_EMP_DP_ENTITY = datamodel.TBL_EAH_EMP_DP_ENTITY();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMP_DP_ENTITY, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMP_DP_OTHERS8(id) {
    const TBL_EAH_EMP_DP_OTHERS = datamodel.TBL_EAH_EMP_DP_OTHERS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMP_DP_OTHERS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_RELATIVE_INFO9(id) {
    const TBL_EAH_EMPLOYEE_RELATIVE_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_RELATIVE_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO10(id) {
    const TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_RELATIVE_ENTITY_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO11(id) {
    const TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO = datamodel.TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_RELATIVE_OTHER_TRADING_ACCOUNT_INFO, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_REL_DP_ENTITY12(id) {
    const TBL_EAH_REL_DP_ENTITY = datamodel.TBL_EAH_REL_DP_ENTITY();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_REL_DP_ENTITY, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_REL_DP_OTHERS13(id) {
    const TBL_EAH_REL_DP_OTHERS = datamodel.TBL_EAH_REL_DP_OTHERS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_REL_DP_OTHERS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP14(id) {
    const TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP = datamodel.TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_MATERIAL_FINANCIAL_RELATIONSHIP, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS15(id) {
    const TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS = datamodel.TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMPLOYEE_STAKE_TRADE_ACCOUNT_DETAILS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_10PERCENT_STAKE_OTHERS16(id) {
    const TBL_EAH_10PERCENT_STAKE_OTHERS = datamodel.TBL_EAH_10PERCENT_STAKE_OTHERS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_10PERCENT_STAKE_OTHERS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_10PERCENT_STAKE_ENTITY17(id) {
    const TBL_EAH_10PERCENT_STAKE_ENTITY = datamodel.TBL_EAH_10PERCENT_STAKE_ENTITY();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_10PERCENT_STAKE_ENTITY, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_STK_DP_ENTITY18(id) {
    const TBL_EAH_STK_DP_ENTITY = datamodel.TBL_EAH_STK_DP_ENTITY();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_STK_DP_ENTITY, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_STK_DP_OTHERS19(id) {
    const TBL_EAH_STK_DP_OTHERS = datamodel.TBL_EAH_STK_DP_OTHERS();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_STK_DP_OTHERS, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_EMP_PHYSICAL_SHARE_HOLDING20(id) {
    const TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING = datamodel.TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_EMP_PHYSICAL_SHARE_HOLDING, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}

function getdatafromTBL_EAH_COMMODITY_OTHER_EXCHANGE21(id) {
    const TBL_EAH_COMMODITY_OTHER_EXCHANGE = datamodel.TBL_EAH_COMMODITY_OTHER_EXCHANGE();
    var param = {
        where: {
            EMPLOYEE_ID: id,
            IS_ACTIVE: true
        }

    };

    dataaccess.FindOne(TBL_EAH_COMMODITY_OTHER_EXCHANGE, param)
        .then(function (result) {
            if (result != null) {

                FinalArray.push(1)

            }
            else {


            }
        });
}