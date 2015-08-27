var cwd = process.cwd();

var assert = require("chai").assert;

var config   = require(cwd + '/test/env/config');
var DAO      = require(cwd);
var Instance = require(cwd + '/instance');

var organizations_description = { table  : 'Organizations', fields : [ 'id', 'name' ] };

describe('Instance', function() {
    it('Constructor', function() {
        var instance = new Instance(new DAO(config.db.main), organizations_description);

        assert.instanceOf(instance.dao, DAO, 'See valid dao');
        assert.equal(instance.description, organizations_description, 'See valid description');

        assert.isDefined(instance.conditions, 'See conditions')
    });
});