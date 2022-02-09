module.exports = {
  config: () => ({
    server_port: 8000,
    swat_scenarios: "../../catchment/Scenarios/",
    swat_scenarios_root: "../catchment/Scenarios/",
    swat_default_scenario: "Default",
    swat_models: "catchment/Scenarios/Default/TxtInOut/",
    swat_exe: "rev60.5.2_64rel.exe",
  }),
};
