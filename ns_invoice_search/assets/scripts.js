"use strict";

var client;
var BASE_URL =
  "https://forms.na1.netsuite.com/app/site/hosting/scriptlet.nl?script=823&deploy=1&compid=897397&h=449eb6d8ac0a531e17cb&dGhpc0N1c3RvbWVySUQ=";

window.onload = function () {
  // Initialize the App
  client = ZAFClient.init();
  client.invoke("resize", {
    width: "100%",
    height: "300px"
  });
  client.on("app.registered", async function (e) {
    // Determine what context the app is loaded in
    document
      .querySelector("#search-btn")
      .addEventListener("click", function (e) {
        e.preventDefault();
        var invoiceID = document.querySelector("#invoice-id").value;
        searchInvoice(invoiceID);
      });
  });
};

var searchInvoice = function searchInvoice(invoiceID) {
  return new Promise(function (resolve, reject) {
    document.querySelector("iframe#search-frame").src = ""
      .concat(BASE_URL)
      .concat(invoiceID);
    resolve();
  });
};
