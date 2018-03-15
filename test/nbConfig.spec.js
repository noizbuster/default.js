/* global describe, it, before */
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const _ = require('lodash');

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const nbConfig = require('./../lib/nb-config');
// const nbConfig = require('./../src');

let defaultObj = {
    value1: 'value1',
    value2: 'defaultvalue2',
    valueA: ['defaultarr1', 'defaultarr2', 'defaultarr3'],
    valueDeep: {
        valueAD: ['deep', 'value', 'also', 'removed'],
        valueD: 'valueDeep',
        valueI: 10
    }
};

let configObj = {
    value2: 'value2',
    valueA: ['arr1', 'arr2'],
    valueDeep: {
        valueAD: ['deepArr1', 'deepArr2'],
        valueI: '123'
    },
    valueN: 'newValue'
};

let correctConfig = {
    "value1": "value1",
    "value2": "value2",
    "valueA": [
        "arr1",
        "arr2"
    ],
    "valueDeep": {
        "valueAD": [
            "deepArr1",
            "deepArr2"
        ],
        "valueD": "valueDeep",
        "valueI": 10
    },
    "valueN": "newValue"
};

describe('Initialize configuration files for test', () => {
    it('Make /config directory', () => {
        delete process.env.NODE_ENV;
        fs.mkdirSync(path.join(__dirname, './../config'));
    });
});

describe('Functional Test without options', () => {
    let config;

    describe('Prepare Test', () => {
        it('Create ./config/default.yaml', () => {
            fs.writeFileSync(path.join(__dirname, './../config/default.yaml'), JSON.stringify(defaultObj, null, 4));
        });
        it('Create ./config/development.yaml', () => {
            fs.writeFileSync(path.join(__dirname, './../config/development.yaml'), JSON.stringify(configObj, null, 4));
        });
    });

    describe('Functional Test', () => {
        it('Create Instance of config by default', () => {
            config = new nbConfig();
            config.config.should.not.equal(undefined);
        });
        it('Check config is loaded well', () => {
            expect(_.isEqual(config.get(), correctConfig)).equals(true);
        });
        it('Cache test', () => {
            config = null;
            config = new nbConfig();
            expect(config.options.fromCache).equals(true);
            expect(_.isEqual(config.get(), correctConfig)).equals(true);
        });
    });

    describe('Delete files that were used for testing', () => {
        it('Delete ./config/default.yaml', () => {
            fs.unlinkSync(path.join(__dirname, './../config/default.yaml'));
        });
        it('Create ./config/development.yaml', () => {
            fs.unlinkSync(path.join(__dirname, './../config/development.yaml'));
        });
    })

});


describe('Functional Test With Basic options', () => {
    let config;

    describe('Prepare Test', () => {
        it('Create ./config/myProject.default.yaml', () => {
            fs.writeFileSync(path.join(__dirname, './../config/myProject.default.yaml'), JSON.stringify(defaultObj, null, 4));
        });
        it('Create ./config/myProject.production.yaml', () => {
            fs.writeFileSync(path.join(__dirname, './../config/myProject.production.yaml'), JSON.stringify(configObj, null, 4));
        });
    });

    describe('Functional Test', () => {
        it('Create Instance of config with moduleName', () => {
            config = new nbConfig('myProject');
            config.config.should.not.equal(undefined);
        });
        it('Check config is loaded well', () => {
            expect(_.isEqual(config.get(), defaultObj)).equals(true);
        });

        it('Create Instance of config with moduleName and NODE_ENV="production"', () => {
            config.clearCache();
            config = null;
            process.env.NODE_ENV = "production";
            config = new nbConfig('myProject');
            config.config.should.not.equal(undefined);
            expect(_.isEqual(config.get(), correctConfig)).equals(true);
        });

        it('Create Instance of config with moduleName and buildTarget parameter', () => {
            config = null;
            delete process.env.NODE_ENV;
            config = new nbConfig('myProject', 'production');
            config.config.should.not.equal(undefined);
            expect(_.isEqual(config.get(), correctConfig)).equals(true);
        });

        it('Cache test', () => {
            config = null;
            config = new nbConfig('myProject', 'production');
            expect(config.options.fromCache).equals(true);
            expect(_.isEqual(config.get(), correctConfig)).equals(true);
        });
    });

    describe('Delete files that were used for testing', () => {
        it('Delete ./config/default.yaml', () => {
            fs.unlinkSync(path.join(__dirname, './../config/myProject.default.yaml'));
        });
        it('Create ./config/development.yaml', () => {
            fs.unlinkSync(path.join(__dirname, './../config/myProject.production.yaml'));
        });
    })

});


describe('Clean up configuration files that were used for testing', () => {
    it('remove /config directory', () => {
        fse.removeSync(path.join(__dirname, './../config'));
    });
});
