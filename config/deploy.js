/* eslint-env node */
'use strict';

module.exports = function(deployTarget) {

  var ENV = {
    build: {
      environment: deployTarget
    },
    'revision-data': {
      type: 'git-commit'
    },
    's3-index': {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      bucket: "esg-nex",
      region: "us-east-2",
      allowOverwrite: true
    },
    's3': {
      accessKeyId: process.env.AWS_KEY,
      secretAccessKey: process.env.AWS_SECRET,
      bucket: "esg-nex",
      region: "us-east-2"
    }
  };
  return ENV;
}
