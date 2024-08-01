const Autoclave = require("../schemas/schemaAutoclave");
const AutoclaveBrand = require("../schemas/schemaAutoclaveBrand");
const Lead = require("../schemas/schemaLead");
const LeadCalcAutoclave = require("../schemas/schemaCalcAutoclave");
const LeadCalcProject = require("../schemas/schemaCalcProject");
const LeadCalcWasher = require("../schemas/schemaCalcWasher");
const Recommendation = require("../schemas/schemaRecommendations");
const Washer = require("../schemas/schemaWasher");
const WasherBrand = require("../schemas/schemaWasherBrand");

const updateDatabase = async () => {
  await Lead.sync();
  await AutoclaveBrand.sync();
  await Autoclave.sync();
  await LeadCalcProject.sync();
  await LeadCalcAutoclave.sync();
  await LeadCalcWasher.sync();
  await Recommendation.sync();
  await WasherBrand.sync();
  await Washer.sync();
};

module.exports = updateDatabase;