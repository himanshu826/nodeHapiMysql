const Config = require('../Config');
var db = require('../Config/dbConnection');

const Service = require('../Services').queries;
const TokenManager = require('../Lib/TokenManager');
const Modal = require('../Models');
const UniversalFunctions = require('../Utils/UniversalFunctions');

async function userRegisteration(payloadData) {
    let query = {
        email: payloadData.email,
        isDeleted: false
    };
    let check1 = await getRequired(Modal.Users, query, {}, {});
    if (check1.length)
        return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_EXIST)

    let register = await registerUser(payloadData);
    return await tokenUpdate(register);

}

async function registerUser(payloadData) {
    return new Promise((resolve, reject) => {

        let dataToSave = {
            email: payloadData.email,
        };

        if (payloadData.password) dataToSave.password = UniversalFunctions.CryptData(payloadData.password);

        if (payloadData.name) dataToSave.name = payloadData.name;
        if (payloadData.deviceToken) dataToSave.deviceToken = payloadData.deviceToken;
        if (payloadData.countryCode) dataToSave.countryCode = payloadData.countryCode;
        if (payloadData.phoneNumber) dataToSave.phoneNumber = payloadData.phoneNumber;

        Service.saveData(Modal.Users, dataToSave, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result)
            }
        })
    });
}

async function login(payloadData) {
    console.log("payloadDatapayloadData",payloadData)
    let f1 = await verifyUser(payloadData);
    if (!f1.isRegister)
        return f1;
    else {
        let f2 = await tokenUpdate(f1);

        let dataToSet = {};
        if (payloadData.deviceToken) dataToSet.deviceToken = payloadData.deviceToken;
        if (payloadData.location) dataToSet.location = payloadData.location;

        let data = await updateData(Modal.Users, { email: payloadData.email }, dataToSet, { lean: true });
        console.log("datadatadata",data)
        return data
    }
}
function verifyUser(payloadData) {

    return new Promise((resolve, reject) => {
        let getCriteria = {};

        getCriteria.email = payloadData.email;
        let project = {
            deviceToken: 0
        };
        Service.getData(Modal.Users, getCriteria, project, { lean: true }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result && result.length) {
                    if (payloadData.loginBy === 1 && result[0].password !== UniversalFunctions.CryptData(payloadData.password))
                        reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PASSWORD);
                    else if (result[0].isBlocked)
                        reject(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.BLOCKED);
                    else {
                        result[0].type = UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_TYPE.USER;
                        result[0].isRegister = true;
                        resolve(result[0])
                    }
                } else {
                    resolve({ isRegister: false });
                }
            }
        });
    });
}

function tokenUpdate(data) {
    let tokenData = {
        _id: data._id,
        type: Config.APP_CONSTANTS.DATABASE.USER_TYPE.USER
    };
    return new Promise((resolve, reject) => {
        TokenManager.setToken(tokenData, function (err, output) {
            if (err) {
                reject(err);
            } else {
                resolve(output)
            }
        });
    });
}

async function channel(payloadData){
    return new Promise(async(resolve, reject) => {
        let option = {lean: true}
        let getCriteria = {};

        if (payloadData.channelId) getCriteria._id = payloadData.channelId;

        let channels = await getRequired(Modal.Channels, getCriteria, {}, option);
        resolve(channels)
    });
}

function getRequired(collection, criteria, project, option) {
    return new Promise((resolve, reject) => {
        Service.getData(collection, criteria, project, option, (err, result) => {
            if (err) {
                reject(err);
            } else {
                if (result.length)
                    resolve(result);
                else resolve([])
            }
        });
    });
}

function updateData(collection, criteria, dataToUpdate, option) {
    return new Promise((resolve, reject) => {
        Service.findAndUpdate(collection, criteria, dataToUpdate, option, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log("resultresultresult",result)
                resolve(result)
            }
        });
    });
}

async function usersList(payloadData) {
    return new Promise(async (resolve, reject) => {
        db.query('SELECT user_id, username, email FROM users',
            function (error, results, fields) {
                if (error) throw error;
                resolve(results)
            });
    })

}

module.exports = {
    userRegisteration: userRegisteration,
    login:login,
    channel:channel,
    usersList: usersList
}
