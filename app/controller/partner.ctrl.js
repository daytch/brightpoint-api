const config = require("../config/url.config");
const axios = require("axios");
const mobileapi = require("../functions/mobileapi");

exports.getAll = async (req, res) => {
  let response = await getAllPartners(req.body.token);

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.detail = async (req, res) => {
  let response = await getPartnerDetail(req.body.token, req.body.rsn);
  
  res.status(200).json(response);
};

const getAllPartners = async (token) => {
  let url = config.mobile_api_url + "partners"; //?page=1&pageSize=10";
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  let resp = axios
    .get(url, {
      headers: {
        Authorization: "OAuth " + headerAuth,
        Accept: "application/json",
      },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp;
};

const getPartnerDetail = async (token, rsn) => {
  console.log("rsn : ", rsn);
  let url = config.mobile_api_url + "partners/" + rsn;
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  let resp = await axios
    .get(url, {
      headers: {
        Authorization: "OAuth " + headerAuth,
        Accept: "application/json",
      },
    })
    .catch((err) => {
      console.log(err);
    });
  return resp?.data;
};
