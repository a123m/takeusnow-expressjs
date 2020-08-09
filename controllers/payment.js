const uniqid = require("uniqid");
// const User = require('../modals/user');
const checksum_lib = require("../utils/checksum/checksum");

exports.getRequest = async (req, res, next) => {
  try {
    const data = await req.body;
    console.log("data", data);
    // const userId = req.body.userId;
    // const TXN_AMOUNT = req.body.TXN_AMOUNT;
    // const { mobile_no, email } = await User.fetchAllById(userId);
    const ORDER_ID = uniqid();

    const PAYTM_MERCHANT_KEY = "Ja2RQba!9c%xTGgU";

    let params = {};

    (params["MID"] = "AKKjSc14534103346909"),
      (params["WEBSITE"] = "WEBSTAGING"),
      (params["CHANNEL_ID"] = "WEB"),
      (params["INDUSTRY_TYPE_ID"] = "Retail"),
      (params["ORDER_ID"] = ORDER_ID),
      (params["CUST_ID"] = "CUST0011"),
      (params["TXN_AMOUNT"] = "100"),
      (params["CALLBACK_URL"] =
        "http://192.168.43.116:8080/payment/paytm/response"),
      (params["EMAIL"] = "xyz@gmail.com"),
      (params["MOBILE_NO"] = "7777777777");

    checksum_lib.genchecksum(params, PAYTM_MERCHANT_KEY, function (
      err,
      checksum
    ) {
      if (err) throw err;
      let txn_url = "https://securegw-stage.paytm.in/order/process";

      let form_fields = "";
      for (let x in params) {
        form_fields +=
          "<input type='hidden' name='" + x + "' value='" + params[x] + "'/>";
      }

      form_fields +=
        "<input type='hidden' name='CHECKSUMHASH' value='" + checksum + "' />";

      var html =
        '<html><body><center><h1>Please wait! Do not refresh the page</h1></center><form method="post" action="' +
        txn_url +
        '" name="f1">' +
        form_fields +
        '</form><script type="text/javascript">document.f1.submit()</script></body></html>';
      // res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(html);
      res.end();
    });
  } catch (err) {
    next(err);
  }
};

exports.response = (req, res, next) => {
  try {
    const paytmResponse = req.body;
    const PAYTM_MERCHANT_KEY = "Ja2RQba!9c%xTGgU";

    var paytmChecksum = "";

    /**
     * Create an Object from the parameters received in POST
     * received_data should contains all data received in POST
     */
    var paytmParams = {};
    for (var key in paytmResponse) {
      if (key == "CHECKSUMHASH") {
        paytmChecksum = paytmResponse[key];
      } else {
        paytmParams[key] = paytmResponse[key];
      }
    }

    /**
     * Verify checksum
     */
    var isValidChecksum = checksum_lib.verifychecksum(
      paytmParams,
      PAYTM_MERCHANT_KEY,
      paytmChecksum
    );
    if (isValidChecksum) {
      console.log("Checksum Matched");
    } else {
      console.log("Checksum Mismatched");
    }
    let html = "";
    if (paytmResponse.RESPCODE === "01") {
      html =
        "<html><body><title>Done</title><center><h1>Thank You!</h1></center></body></html>";
      res.write(html);
      res.end();
    } else {
      let resMessage = paytmResponse.RESPMSG;
      html =
        `<html><body><title>Working</title><center><h1>` +
        resMessage +
        `</h1></center></body></html>`;
      res.write(html);
      res.end();
    }
  } catch (err) {
    next(err);
  }
};
