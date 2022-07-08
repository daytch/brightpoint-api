const config = require("../config/url.config");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const mobileapi = require("../functions/mobileapi");

exports.purchase = async (req, res) => {
  let response = await purchaseVoucher(
    req.body.token,
    req.body.resourceID,
    req.body.rsn,
    req.body.user,
    req.body.amount
  );
  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.getall = async (req, res) => {
  let response = await getAllVouchers(
    req.body.token,
    req.body.resourceID,
    req.body.status
  );

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

exports.getdetail = async (req, res) => {
  let response = await getDetail(
    req.body.token,
    req.body.resourceID,
    req.body.rsn
  );

  if (response?.data) {
    res.status(200).json(response.data);
  } else {
    res.status(500).json(response);
  }
};

const purchaseVoucher = async (token, resourceID, rsn, usr, amount) => {
  let url =
    config.mobile_api_url +
    "members/" +
    resourceID +
    "/offers/" +
    rsn +
    "/purchase";
  const timestamp = Math.floor(Date.now() / 1000);

  const contentData = {
    PaymentType: "LOYALTY",
    ContactDetails: {
      ShippingAddress: {
        Line1: usr.OrganisationDetails.Contact.Address.Line1,
        Line2: usr.OrganisationDetails.Contact.Address.Line2,
        Suburb: usr.OrganisationDetails.Contact.Address.Suburb,
        City: usr.OrganisationDetails.Contact.Address.City,
        Postcode: usr.OrganisationDetails.Contact.Address.Postcode,
      },
      Name: usr.OrganisationDetails.Contact.FamilyName,
      EmailAddress: usr.OrganisationDetails.Contact.EmailAddress,
      PhoneNumber: usr.OrganisationDetails.Contact.Phone.PhoneNumber,
    },
    PaymentAmount: amount,
  };

  var parameters = {
    oauth_consumer_key: config.consumer_key,
    oauth_signature_method: "HMAC-SHA256",
    oauth_timestamp: timestamp,
    oauth_token: token,
  };

  let headerAuth = mobileapi.generateHeaderAuth("POST", parameters, url);

  let resp = await axios
    .post(url, JSON.stringify(contentData), {
      headers: {
        Authorization: "OAuth " + headerAuth,
        Accept: "application/json",
      },
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
  return resp;
};

const getAllVouchers = async (token, resourceID, status) => {
  let url = config.mobile_api_url + "members/" + resourceID + "/vouchers";
  if (status !== "ALL") {
    url = url + "?status=" + status;
  }
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
      return err;
    });
  return resp;
};

const getDetail = async (token, resourceID, rsn) => {
  let url =
    config.mobile_api_url + "members/" + resourceID + "/vouchers/" + rsn;

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
      return err;
    });
  return resp;
};
