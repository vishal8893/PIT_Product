/// FindAll function to fetch list data with filtered filteredparameters as param
module.exports.FindAll = function (model, param) {
    return model.findAll(param);
}

/// FindAndCountAll function to fetch count of list data with filtered parameters as param
module.exports.FindAndCountAll = function (model, param) {
    return model.findAndCountAll(param);
}

/// FindOne function to fetch a record filtered with parameters as param
module.exports.FindOne = function (model, param) {
    return model.findOne(param);
}

/// Create function to insert a record
module.exports.Create = function (model, values) {
    return model.create(values);
}

/// BulkCreate function to insert bulk entries
module.exports.BulkCreate = function (model, values) {
    return model.bulkCreate(values, { returning: true });
}

/// Update function to Update a record with parameters
module.exports.Update = function (model, values, param) {
    return model.update(values, { where: param, returning: true });
}

/// Delete function to delete a perticular record
module.exports.Delete = function (model, param) {
    return model.destroy({ where: param });
}

/// Truncate function to Truncate a perticular table
module.exports.Truncate = function (model) {
    return model.destroy({ truncate: true });
}

/// CreateWithTransaction function to insert record with transaction 
module.exports.CreateWithTransaction = function (model, values, trans) {
    return model.create(values, { transaction: trans });
}

/// BulkCreateWithTransaction function to insert bulk records with transaction 
module.exports.BulkCreateWithTransaction = function (model, values, trans) {
    return model.bulkCreate(values, { transaction: trans, returning: true });
}

/// UpdateWithTransaction function to update a record with transaction 
module.exports.UpdateWithTransaction = function (model, values, param, trans) {
    return model.update(values, { where: param, returning: true }, { transaction: trans });
}

/// DeleteWithTransaction function to delete a record with transaction 
module.exports.DeleteWithTransaction = function (model, param, trans) {
    return model.destroy({ where: param }, { transaction: trans });
}
