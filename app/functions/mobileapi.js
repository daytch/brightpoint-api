const CryptoJS = require("crypto-js");
const config = require("../config/url.config");

const generateHeaderAuth = (method, params, url) => {
  let values = [];
  values.push(method);
  values.push(encodeURIComponent(url));
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      values.push(encodeURIComponent(key + "=" + params[key]));
    }
  }
  let signaturedValue = values.join("&");
  var hmac = CryptoJS.algo.HMAC.create(
    CryptoJS.algo.SHA256,
    config.consumer_secret
  );
  hmac.update(signaturedValue);
  var hash = hmac.finalize();
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  var headerAuth = "";
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      headerAuth = headerAuth.concat(key + '="' + params[key] + '",');
    }
  }
  headerAuth = headerAuth.concat("oauth_signature=" + '"' + hashInBase64 + '"');
  return headerAuth;
};

module.exports = { generateHeaderAuth };
