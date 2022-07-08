const config = require("../config/url.config");
const axios = require("axios");
const mobileapi = require("../functions/mobileapi");

exports.getAllSocialPointGroup = async (req, res) => {
  let response = await getAllGroups(req.body.token);

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.getMyGroup = async (req, res) => {
  let response = await getGroup(req.body.token, req.body.resourceID);

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

const getAllGroups = async (token) => {
  let url = config.mobile_api_url + "social-points/groups";
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

const getGroup = async (token, resourceID) => {
  let url = config.mobile_api_url + "members/" + resourceID + "/social-points";
  const timestamp = Math.floor(Date.now() / 1000);

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("GET", parameters, url);

  try {
    let resp = await axios.get(url, {
      headers: {
        Authorization: "OAuth " + headerAuth,
        Accept: "application/json",
      },
    });
    // .catch((err) => {
    //   console.log(err);
    // });
    return resp;
  } catch (error) {
    return error;
  }
};
