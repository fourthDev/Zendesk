"use strict";

var client;
var BASE_URL =
  "https://897397.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=721&deploy=1&compid=897397&h=3738b49c2da75cd54e0c&dGhpc0N1c3RvbWVySUQ=";

window.onload = function () {
  // Initialize the App
  client = ZAFClient.init();
  client.invoke("resize", {
    width: "100%",
    height: "300px"
  });
  client.on("app.registered", async function (e) {
    // Determine what context the app is loaded in
    var appContext = await client.context();
    var appLocation = appContext.location; // Get the NetSuite Organization ID

    await showTransactions(appLocation);
  });
};

var showTransactions = function showTransactions(location) {
  return new Promise(async function (resolve, reject) {
    if (location == "organization_sidebar") {
      var _await$client$get = await client.get("organization"),
        organization = _await$client$get.organization;

      var transactionContainer = document.createElement("div");
      transactionContainer.className = "container";
      var transactionHeader = document.createElement("h4");
      transactionHeader.innerText = "".concat(
        organization.name,
        " Transaction History"
      );
      transactionContainer.appendChild(transactionHeader);
      var transactionFrame = document.createElement("iframe");
      transactionFrame.src = ""
        .concat(BASE_URL)
        .concat(organization.organizationFields.netsuite_id);
      transactionContainer.appendChild(transactionFrame);
      document
        .querySelector("main#app-container")
        .appendChild(transactionContainer);
      resolve();
    } else if (location == "user_sidebar") {
      var _await$client$get2 = await client.get("user"),
        user = _await$client$get2.user;

      user.organizations.forEach(function (org) {
        var transactionContainer = document.createElement("div");
        transactionContainer.className = "container";
        var transactionHeader = document.createElement("h4");
        transactionHeader.innerText = "".concat(
          org.name,
          " Transaction History"
        );
        transactionContainer.appendChild(transactionHeader);
        var transactionFrame = document.createElement("iframe");
        transactionFrame.src = ""
          .concat(BASE_URL)
          .concat(org.organizationFields.netsuite_id);
        transactionContainer.appendChild(transactionFrame);
        document
          .querySelector("main#app-container")
          .appendChild(transactionContainer);
      });
      resolve();
    }
  });
};
