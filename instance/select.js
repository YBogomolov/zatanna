var conditions = require('./conditions');
var DAO        = require('..');

module.exports = function(Instance) {
    Instance.prototype._select = function(type, where, description) {
        var _fields = description && description.fields ? description.fields : parseFields(this.description.fields);
        var fields = [];
        for (var i = 0; i < _fields.length; i++) {
            if (_fields[i].toSQL) {
                fields.push(_fields[i]);
                continue;
            }
            fields.push('"' + this.description.table + '"."' + _fields[i] + '"');
        }

        var from = [ '"' + this.description.table + '"' ];
        var params = [];
        if (description && description.join) {
            for (var i = 0; i < description.join.length; i++) {
                from.push(description.join[i].toSQL(params));
            }
        }

        var fieldsPart = this.createFieldsForSelect(fields, params);
        var fromPart   = from.join(' ');
        var wherePart  = conditions.where(this.conditions, where, params);
        var groupPart  = description && description.group ? (' GROUP BY ' + description.group) : '';
        var orderPart  = description && description.order ? (' ORDER BY ' + description.order) : '';
        var limitPart  = description && description.limit ? (' LIMIT $' + params.push(description.limit)) : '';
        var offsetPart = description && description.offset ? (' OFFSET $' + params.push(description.offset)) : '';

        return this.dao[type]('SELECT ' + fieldsPart + ' FROM ' + fromPart + ' ' + wherePart + groupPart + orderPart + limitPart + offsetPart, params);
    };

    Instance.prototype.select = function(where, description) {
        return this._select('select', where, description);
    };

    Instance.prototype.selectOne = function(where, description) {
        return this._select('selectOne', where, description);
    };

    Instance.prototype.createFieldsForSelect = function(fields, params) {
        var result = [];
        for (var i = 0; i < fields.length; i++) {
            result.push(fields[i].toSQL ? fields[i].toSQL(params) : fields[i]);
        }
        return result.join(',');
    };
};

function parseFields(fields) {
    return fields.map(function(field) { return typeof(field) === 'string' ? field : field.name });
}