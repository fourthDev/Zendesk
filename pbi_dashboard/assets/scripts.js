let client;

const BASE_URL = "https://app.powerbi.com/reportEmbed?reportId=4c93ee01-78b6-4936-b404-40c789e56803&autoAuth=true&&pageName=ReportSection4f8a486a5d47563c3e2d&$filter=CUSTOMER_GLOBAL/NET_SUITE_ACCOUNT_ID_C%20eq%20%27";
window.onload = function () {
  // Initialize the App
  client = ZAFClient.init();

  client.on("app.registered", async function (e) {
    $("#back-btn").hide();
    $("#open-new-tab-btn").hide();

    // Determine what context the app is loaded in
    $("#search-btn").click((e) => {
      e.preventDefault();
      var netsuiteID = document.querySelector("#netsuite-id").value;
      searchPbi(netsuiteID);
    });

    $("#back-btn").click((e) => {
      e.preventDefault();
      $("#input-form").show();
      $("#back-btn").hide();
      $("#open-new-tab-btn").hide();
    })
  });
};

var searchPbi = function searchPbi(netsuiteID) {
  return new Promise(function (resolve, reject) {
    var src_url = `${BASE_URL}${netsuiteID}'`;

    $("#input-form").hide();
    $("#back-btn").show();
    $("#open-new-tab-btn").show();
    $("#open-new-tab-btn").attr('href', src_url);
    $("iframe#search-frame").attr({
      width: 840, // iFrame width
      height: 591, // iFrame height
      src: src_url
    });

    resolve();
  });
};