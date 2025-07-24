var express = require('express');
var router = express.Router();
const https = require('https');
const axios = require('axios');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var connect = require('../../Data/Connect');
const { NOW, literal } = require('sequelize');
const { log } = require('console');
var sequelize = connect.Sequelize;


let globalData = [];
// Function to count rows and update global array
async function updateGlobalData(api, count, status) {
    const date = new Date().toISOString();
    globalData.push({ api, count, status, date });
}

async function generateToken() {
    try {
        const hrms_oauth2_clientid = "6kojghrgemee2rd2lmig1d55cf";
        const hrms_oauth2_client_secret_key = "11ei2v40lcmp05kcab29ra949sqi6gt5qs72t4f5ddo0gr8k7j4p";

        // Concatenate client id and secret key
        const concatenatedString = `${hrms_oauth2_clientid}:${hrms_oauth2_client_secret_key}`;

        // Convert string to UTF-8 bytes
        const utf8Bytes = Buffer.from(concatenatedString, 'utf-8');

        // Encode UTF-8 bytes to Base64
        const encodedString = utf8Bytes.toString('base64');
        console.log(encodedString);

        // Set headers
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${encodedString}`,
            'Accept': 'application/json'
        };

        const HRMS_API_PATH = "https://fiber.nuvamapis.com/oauth2/token";

        // Make a request to the HRMS API path to obtain the token
        const tokenResponse = await axios.post(HRMS_API_PATH, {}, { headers });

        // Extract the token from the response
        const jwtToken = tokenResponse.data.access_token;

        return jwtToken;
    } catch (error) {
        console.error("Error while generating token or fetching data:", error);
        throw error;
    }
}

// Function to fetch data using token
async function fetchEmpData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/employeeDetails?apiName=employeeDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveempdata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        // console.log("pushempdatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchEmpData', count, status);

        // Save all the data to the table
        await saveEmpDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveEmpDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            // Map the data to rename the key 'empNumber' to 'EMP_NUMBER'            
            const mappedData = data.map(item => ({
                EMP_NUMBER: item.empCode,
                EMP_ID: item.empCode,
                PAN: null,
                LOGIN_ID: item.login,
                EMP_TITLE: null,
                EMP_CALLING_NAME: item.firstName,
                EMP_SURNAME: item.lastName,
                EMP_FULL_NAME: item.fullName,
                GENDER: item.gender,
                ZONE: null,
                INFRA: item.infraName,
                CATEGORY: item.category,
                ENTITY: item.entityName,
                TYPE_OF_EMPLOYMENT: item.employmentType,
                EMP_BLOOD_GROUP: item.bloodGroup,
                EMP_RESIGN_DATE: item.lastWorkDate,
                DESIGNATION_NAME: item.internalDesignation,
                EXTERNAL_DESIGNATION: item.externalDesignation,
                COUNTRY: item.country,
                STATE: item.state,
                PINCODE: item.stateCode,
                EMP_DATE_JOINED: item.dateOfJoin,
                EMP_BIRTHDAY: item.birthDate,
                GRP_NAME: null,
                CLUSTER: item.businessGroup,
                SBU: item.sbu,
                LOB: item.lob,
                MIDDLE_NAME_FATHERS_NAME: item.middleName,
                EMPLOYMENT_STATUS: item.employeeStatus,
                SLOB: item.subLob,
                LOCATION: item.location,
                EMP_PER_TELEPHONE: null,
                EMP_PER_MOBILE: null,
                EMP_TEM_TELEPHONE: null,
                EMP_TEM_MOBILE: null,
                EMP_OFFICE_MOBILE: null,
                EMP_ACTIVE_ATT_FLG: null,
                EMP_ACTIVE_HRM_FLG: null,
                EMP_OFFICE_EMAIL: null,
                CONT_DURING_WRKN: null,
                EMP_PER_EMAIL: null,
                EMP_PER_ADDRESS1: null,
                EMP_PER_ADDRESS2: null,
                EMP_PER_ADDRESS3: null,
                EMP_TEM_ADDRESS1: null,
                EMP_TEM_ADDRESS2: null,
                EMP_TEM_ADDRESS3: null,
                EMG_CONTACT: null,
                LEADERSHIP_GRP: item.leadershipGroup,
                EXIT_REASON: item.exitReason,
                LEVEL1_NAME: null,
                LEVEL2_NAME: null,
                ARRIVAL_CONFORMATION_DATE: item.arrivalConfirmationDate,
                RA_ID: item.raECode,
                MARITAL_STATUS: item.maritalStatus,
                BG_CODE: item.businessGroupCode,
                SBU_CODE: item.sbuCode,
                LOB_CODE: item.lobCode,
                SUB_LOB_CODE: item.subLobCode,
                ENTITY_CODE: item.entityCode

            }));

            const TBL_HRMS_EMPLOYEE_INFORMATION = datamodel.TBL_HRMS_EMPLOYEE_INFORMATION();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMPLOYEE_INFORMATION""`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMPLOYEE_INFORMATION.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMPLOYEE_INFORMATION Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMPLOYEE_INFORMATION:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchRelData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empDependentDetails?apiName=empDependentDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrievereldata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushreldatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchRelData', count, status);

        // Save all the data to the table
        await saveRElDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveRElDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                // Check if dependents exist and if it's an array
                if (Array.isArray(item.dependents)) {
                    // Iterate over the nationality  list
                    for (const email of item.dependents) {
                        // Create an object for each email address
                        const emailData = {
                            EMP_DISPLAY_NUMBER: item.empCode,
                            EMP_CALLING_NAME: email.firstName,
                            PAN: null,
                            // DEPENDANT: email.dependent,
                            DEPENDANT: email.firstName,
                            EREL_RELATIONSHIP: email.relationshipToTheEmployee,
                            // EREL_BIRTHDAY: email.dateOfBirth,
                            EREL_BIRTHDAY: null,
                            EREL_TELEPHONE: null     // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`Dependents for employee '${item.empCode}' are not in the expected format.`);
                }
            }


            const TBL_HRMS_EMP_RELATIONINFORMATION = datamodel.TBL_HRMS_EMP_RELATIONINFORMATION();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_RELATIONINFORMATION"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_RELATIONINFORMATION.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_RELATIONINFORMATION Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_RELATIONINFORMATION:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchContData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empEmergencyDetails?apiName=empEmergencyDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrievContpdata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushContdatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchContData', count, status);

        // Save all the data to the table
        await saveContDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveContDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                if (Array.isArray(item.emergencyContact)) {
                    // Iterate over the nationality  list
                    for (const email of item.emergencyContact) {
                        // Create an object for each email address
                        const emailData = {
                            NAME: email.name,
                            RELATIONSHIP: email.relationship,
                            PRIMARY_EMERGENCY: email.primaryEmergency,
                            EMERGENCY_CONTACT_NUMBER: email.emergencyContactNumber,
                            EMPLOYEE_CODE: item.empCode      // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`emergencycontact for employee '${item.empCode}' are not in the expected format.`);
                }
            }


            const TBL_HRMS_EMP_EMERGENCY_CONTACT = datamodel.TBL_HRMS_EMP_EMERGENCY_CONTACT();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_EMERGENCY_CONTACT"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_EMERGENCY_CONTACT.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_EMERGENCY_CONTACT Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_EMERGENCY_CONTACT:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchVoiceData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empVoiceDetails?apiName=empVoiceDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveVoicedata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushVoicedatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchVoiceData', count, status);


        // Save all the data to the table
        await saveVoiceDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveVoiceDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                // Iterate over the nationality  list
                if (Array.isArray(item.contacts)) {
                    for (const email of item.contacts) {
                        // Create an object for each email address
                        const emailData = {
                            PHONE_TYPE: email.phoneType,
                            PHONE_NUMBER: email.phoneNumber,
                            AREA_CODE: email.areaCode,
                            COUNTRY_CODE: email.countryCode,
                            OFFICE_TELEPHONE_BOARD: email.officeTelephoneBoard,
                            OFFICE_EXTENSION: email.officeExtension,
                            OFFICE_TELEPHONE_DIRECT: email.officeTelephoneDirect,
                            EMPLOYEE_CODE: item.empCode     // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`contacts for employee '${item.empCode}' are not in the expected format.`);
                }
            }

            const TBL_HRMS_EMP_VOICE_DETAILS = datamodel.TBL_HRMS_EMP_VOICE_DETAILS();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_VOICE_DETAILS"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_VOICE_DETAILS.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_VOICE_DETAILS Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_VOICE_DETAILS:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchAddressData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empAddressDetails?apiName=empAddressDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveAddressdata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushAddressdatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchAddressData', count, status);

        // Save all the data to the table
        await saveAddressDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveAddressDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                if (Array.isArray(item.address)) {
                    // Iterate over the nationality  list
                    for (const email of item.address) {
                        // Create an object for each email address
                        const emailData = {
                            ADDRESS_TYPE: email.addressType,
                            STREET: email.street,
                            HOUSE_NUMBER: email.houseNumber,
                            EXTRA_ADDRESS_LINE: email.extraAddressLine,
                            CITY: email.city,
                            STATE: email.state,
                            PINCODE: email.pinCode,
                            COUNTRY: email.country,
                            EMPLOYEE_CODE: item.empCode    // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`address for employee '${item.empCode}' are not in the expected format.`);
                }
            }

            const TBL_HRMS_EMP_ADDRESS = datamodel.TBL_HRMS_EMP_ADDRESS();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_ADDRESS"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_ADDRESS.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_ADDRESS Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_ADDRESS:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchWorkExpData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empWorkExperienceDetails?apiName=empWorkExperienceDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveWorkExpdata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushWorkExpdatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchWorkExpData', count, status);

        // Save all the data to the table
        await saveWorkExpDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveWorkExpDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                if (Array.isArray(item.workExperience)) {
                    // Iterate over the nationality  list
                    for (const email of item.workExperience) {
                        // Create an object for each email address
                        const emailData = {
                            EMP_DISPLAY_NUMBER: item.empCode,
                            EMP_CALLING_NAME: null,
                            PAST_COMPANY: email.previousCompanyName   // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`workExperience for employee '${item.empCode}' are not in the expected format.`);
                }
            }

            const TBL_HRMS_EMP_WORKEX_DATA_EAH = datamodel.TBL_HRMS_EMP_WORKEX_DATA_EAH();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_WORKEX_DATA_EAH"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_WORKEX_DATA_EAH.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_WORKEX_DATA_EAH Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_WORKEX_DATA_EAH:", err);
                });


            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchEduData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empEducationDetails?apiName=empEducationDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveEdudata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushEdudatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchEduData', count, status);


        // Save all the data to the table
        await saveEduDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveEduDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                if (Array.isArray(item.education)) {
                    // Iterate over the nationality  list
                    for (const email of item.education) {
                        // Create an object for each email address
                        const emailData = {
                            UNIVERSITY: email.university,
                            OTHER_UNIVERSITY: email.otherUniversity,
                            ACHIEVED_SCORE_IN_PERCENTAGE: email.achievedScoreInPercentage,
                            HIGHEST_EDUCATION: email.highestEducation,
                            COURSE: email.course,
                            COURSE_TYPE: email.courseType,
                            SPECIALIZATION: email.specialization,
                            START_DATE: email.startDate,
                            END_DATE: email.endDate,
                            INSTITUTE: email.institute,
                            OTHER_INSTITUTE: email.otherInstitute,
                            EMPLOYEE_CODE: item.empCode     // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`education for employee '${item.empCode}' are not in the expected format.`);
                }
            }

            const TBL_HRMS_EMP_QUALIFICATION_DATA_EAH = datamodel.TBL_HRMS_EMP_QUALIFICATION_DATA_EAH();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_QUALIFICATION_DATA_EAH"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_QUALIFICATION_DATA_EAH.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_QUALIFICATION_DATA_EAH Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_QUALIFICATION_DATA_EAH:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchNationData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empNationalityDetails?apiName=empNationalityDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveNationdata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushNationdatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchNationData', count, status);

        // Save all the data to the table
        await saveNationDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveNationDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                if (Array.isArray(item.nationality)) {
                    // Iterate over the nationality  list
                    for (const email of item.nationality) {
                        // Create an object for each email address
                        const emailData = {
                            COUNTRY: email.country,
                            NATIONAL_ID_CARD_TYPE: email.nationalIdCardType,
                            NATIONAL_ID_NUMBER: email.nationalIdNumber,
                            EMPLOYEE_CODE: item.empCode   // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`nationality for employee '${item.empCode}' are not in the expected format.`);
                }
            }

            const TBL_HRMS_EMP_NATIONALITY = datamodel.TBL_HRMS_EMP_NATIONALITY();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_NATIONALITY"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_NATIONALITY.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_NATIONALITY Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_NATIONALITY:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchEmailIdData(token) {
    try {
        let pageNumber = 1;
        let allData = [];

        while (true) {
            // Set headers for data request;Bearer
            const dataHeaders = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
            };

            // Replace DATA_API_PATH with the URL of the data endpoint        
            const DATA_API_PATH = `https://fiber.nuvamapis.com/empMaster/empEmailDetails?apiName=empEmailDetails&userId=Application_PIT_EWM&pageNumber=${pageNumber}`;

            // Make a request to the data endpoint to obtain the data
            const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

            // Extract the data from the response
            const data = dataResponse.data;

            // console.log("retrieveEmaildata", data);

            // Append the data to the result
            allData.push(data);


            // If the data array is empty, break the loop
            if (!data.length) {
                break;
            }

            // Increment the page number for the next request
            pageNumber++;
        }

        console.log("pushEmaildatainarray", allData);

        // Flatten the array of arrays into a single array
        const flattenedData = [].concat(...allData);

        // Now, flattenedData contains all the data from all pages in a single array
        console.log("Flattened Data:", flattenedData);

        const count = flattenedData.length;

        // const count = allData.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchEmailIdData', count, status);


        // Save all the data to the table
        await saveEmailDataToTable(flattenedData);

        return allData;


    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveEmailDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            let mappedData = [];

            // Iterate over the input data
            for (const item of data) {
                if (Array.isArray(item.emailIds)) {
                    // Iterate over the emailIds list
                    for (const email of item.emailIds) {
                        // Create an object for each email address
                        const emailData = {
                            EMAIL_TYPE: email.emailType,
                            EMAIL_ADDRESS: email.emailAddress,
                            IS_PRIMARY: email.isPrimary,
                            EMPLOYEE_CODE: item.empCode  // Assuming this is the employee code for each email
                        };
                        // Push the email object to the mappedData array
                        mappedData.push(emailData);
                    }
                } else {
                    // Handle the case where dependents is not an array
                    console.error(`emailIds for employee '${item.empCode}' are not in the expected format.`);
                }
            }

            const TBL_HRMS_EMP_EMAIL = datamodel.TBL_HRMS_EMP_EMAIL();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_EMP_EMAIL"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_EMP_EMAIL.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_EMP_EMAIL Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_EMP_EMAIL:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function fetchComphierData(token) {
    try {
        // Set headers for data request;Bearer
        const dataHeaders = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900',
        };

        // Replace DATA_API_PATH with the URL of the data endpoint        
        const DATA_API_PATH = `https://fiber.nuvamapis.com/orgMaster/orgDetails?apiName=orgDetails&userId=Application_PIT_EWM`;

        // Make a request to the data endpoint to obtain the data
        const dataResponse = await axios.get(DATA_API_PATH, { headers: dataHeaders });

        // Extract the data from the response
        const data = dataResponse.data;

        console.log("retrieveCompdata", data);

        const count = data.length; // Count the data retrieved

        // Determine status
        const status = count > 0 ? 'Success' : 'Failure';

        // Update global data
        await updateGlobalData('fetchComphierData', count, status);

        // Save the data to the table
        await saveCompDataToTable(data);

        return data;
    } catch (error) {
        console.error("Error while fetching data:", error);
        throw error;
    }
}

async function saveCompDataToTable(data) {
    try {
        // Check if data is not empty
        if (data && data.length > 0) {

            // Map the data to rename the key 'empNumber' to 'EMP_NUMBER'            
            const mappedData = data.map(item => ({
                CLUSTER_ID: item.bgCode,
                CLUSTER_NAME: item.bgName,
                SBU_ID: item.sbuCode,
                SBU_NAME: item.sbuName,
                LOB_ID: item.lobCode,
                LOB_NAME: item.lobName,
                SUBLOB_ID: item.subLobCode,
                SUBLOB_NAME: item.subLobName
            }));

            const TBL_HRMS_COMPANY_HIERARCHY_MAPPING = datamodel.TBL_HRMS_COMPANY_HIERARCHY_MAPPING();

            const selectQuery1 = `TRUNCATE TABLE "TBL_HRMS_COMPANY_HIERARCHY_MAPPING"`;

            connect.sequelize.query(selectQuery1)
                .then(() => {
                    TBL_HRMS_COMPANY_HIERARCHY_MAPPING.bulkCreate(mappedData)
                })
                .then(result1 => {
                    console.log("New rows inserted in TBL_HRMS_COMPANY_HIERARCHY_MAPPING Successfully");
                })
                .catch(err => {
                    console.error("Error in TBL_HRMS_COMPANY_HIERARCHY_MAPPING:", err);
                });

            console.log('Data saved to table successfully.');
        } else {
            console.log('No data to save. Skipping truncate operation.');
        }
    } catch (error) {
        console.error('Error while saving data to table:', error);
        throw error;
    }
}

async function sendEmail(data) {
    try {
        // Function to generate email body
        const emailBody = generateEmailBody(data);

        // Generate token
        const token = await generateToken();

        // Define request headers
        // 'Authorization': `Bearer ${token}`
        const headers = {
            'Authorization': token,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'x-api-key': 'dR5O6UM5474n5R3hGy7A5apwpLBYQdBIREWlU900'
        };

        // Define request parameters
        const params = {
            'fromEmailId': 'RequestStatus_RTPR@nuvama.com',
            'toEmailIds': '',
            'ccEmailIds': '',
            'sendToAllTogether': 'true',
            'subject': 'HRMS API STATUS',
            'emailBody': emailBody
        };


        const HRMS_API_PATH = "https://fiber.nuvamapis.com/email/send";

        // Send POST request to the email sending endpoint
        const response = await axios.post(HRMS_API_PATH, params, { headers });

        console.log("Email sent successfully:", response.data);
        // const result = response.data;

        // const insertQuery = `INSERT INTO "TBL_HRMS_MAIL_LOG" ("RESPONSE","CREATED_DATE") VALUES ('${result}', CURRENT_TIMESTAMP)`;
        // await connect.sequelize.query(insertQuery, [result]);        

    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// Function to generate the email body from the global data array
function generateEmailBody(data) {
    let body = `<html>
                    <body>
                        <p>Dear Team,</p>
                        <p>Please find below the status report:</p>
                        <table border="1" style="border-collapse: collapse;">
                            <tr>
                                <th style="padding: 10px;">API</th>                                
                                <th style="padding: 10px;">Status</th>
                                <th style="padding: 10px;">Date</th>
                                <th style="padding: 10px;">Description</th>
                            </tr>`;

    // Populate the table rows with data
    for (const entry of data) {
        body += `<tr>
                    <td style="padding: 10px;">${entry.api}</td>                    
                    <td style="padding: 10px;">${entry.status}</td>
                    <td style="padding: 10px;">${entry.date}</td>
                    <td style="padding: 10px;">${entry.count}</td>
                </tr>`;
    }

    body += `        </table>
                    </body>
                </html>`;

    return body;
}

// Example usage
var getData = async function getData() {
    try {
        // Array to store results of each function
        // const results = [];

        // Array of functions to call sequentially
        const functions = [
            fetchEmpData,
            fetchRelData,
            fetchContData,
            fetchVoiceData,
            fetchAddressData,
            fetchWorkExpData,
            fetchEduData,
            fetchNationData,
            fetchComphierData,
            fetchEmailIdData
        ];

        let allFunctionsSuccessful = true;

        // Iterate over functions and call them sequentially
        for (const func of functions) {
            try {
                // Generate token for each function call
                const token = await generateToken();

                // Call the function with the generated token
                const result = await func(token);
                // results.push(result); // Save the result
                // console.log("final data:", result);
            } catch (error) {
                console.error('Error in function:', error);
                allFunctionsSuccessful = false;
                break; // Stop further execution if any function fails
            }
        }

        if (allFunctionsSuccessful) {
            console.log('All data fetched successfully.');

            // Send email with the collected data
            await sendEmail(globalData);

            // Return success message
            return { status: 200, message: 'Data fetched and email sent successfully.' };
        } else {
            throw new Error('Some functions failed to execute.');
        }

        // console.log("All data fetched successfully.");
        // Send email with the collected data
        // await sendEmail(globalData);

        // Return success message
        // return { status: 200, message: 'Data fetched and email sent successfully.' };
        // return results;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}



// Call the getData function
module.exports.getData = getData;








