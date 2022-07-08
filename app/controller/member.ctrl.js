const config = require("../config/url.config");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const mobileapi = require("../functions/mobileapi");

exports.login = async (param, res) => {
  let req = param.body;
  let response = await mobileApiLogin(req.email, req.password);

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.profile = async (req, res) => {
  let response = await getUserProfile(req.body.token, req.body.resourceID);

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.transactions = async (req, res) => {
  let response = await getTransactions(req.body.token, req.body.resourceID);
  
  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.vouchers = async (req, res) => {
  let response = await getVouchers(req.body.token, req.body.resourceID);
  
  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.getOffers = async (req, res) => {
  let response = await getOffers(req.body.token, req.body.resourceID);
  
  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.getOfferDetails = async (req, res) => {
  let response = await getOfferDetail(
    req.body.token,
    req.body.resourceID,
    req.body.RSN
  );
  res.json(response.data);
};

exports.getPromos = async (req, res) => {
  let response = await getPromos(req.body.token, req.body.resourceID);
  res.json(response.data);
};

exports.getOrders = async (req, res) => {
  let response = await getOrders(req.body.token, req.body.resourceID);
  res.json(response.data);
};

const mobileApiLogin = async (username, password) => {
  const encryptedIV = CryptoJS.enc.Base64.parse(config.IV);
  const encryptedKey = CryptoJS.enc.Base64.parse(config.KEY);

  const timestamp = Math.floor(Date.now() / 1000);
  const data = JSON.stringify({
    UserName: username,
    Password: password,
    Timestamp: timestamp,
  });

  const encryptedData = CryptoJS.AES.encrypt(data, encryptedKey, {
    iv: encryptedIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  var parameters = {
    data: encryptedData,
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
  };

  let authHeader = mobileapi.generateHeaderAuth(
    "POST",
    parameters,
    config.mobile_api_url + "oauth/token"
  );

  var resp = await axios
    .post(
      config.mobile_api_url + "oauth/token",
      {},
      {
        headers: { Authorization: "OAuth " + authHeader },
      }
    )
    .catch((err) => console.log(err));

  return resp;
};

const getUserProfile = async (token, resourceID) => {
  let url = config.mobile_api_url + "members/" + resourceID;
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getTransactions = async (token, resourceID) => {
  let url = config.mobile_api_url + "members/" + resourceID + "/transactions";
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getVouchers = async (token, resourceID) => {
  let url = config.mobile_api_url + "members/" + resourceID + "/vouchers";
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getOffers = async (token, resourceID, type) => {
  let url = config.mobile_api_url + "members/" + resourceID;
  switch (type) {
    case "featured":
      url = url + "/featured-offers";
      break;

    default:
      url = url + "/offers";
      break;
  }
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getOfferDetail = async (token, resourceID, RSN) => {
  let url = config.mobile_api_url + "members/" + resourceID + "/offers/" + RSN;
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getPromos = async (token, resourceID) => {
  let url =
    config.mobile_api_url +
    "members/" +
    resourceID +
    "/favorites/offers/non-personalized";
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getOrders = async (token, resourceID) => {
  let url =
    config.mobile_api_url +
    "members/" +
    resourceID +
    "/orders";
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  var resp = await axios
    .get(url, {
      headers: { Authorization: "OAuth " + headerAuth },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};
