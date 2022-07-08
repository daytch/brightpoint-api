const config = require("../config/url.config");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const parseString = require("xml2js").parseString,
  xml2js = require("xml2js");

exports.getPartners = async (param, res) => {
  let resp = await authenticate();
  let xmlData = resp.data;
  parseString(xmlData, function (err, result) {
    if (err) console.log(err);
    // here we log the results of our xml string conversion
    console.log(result);

    var json = result;
    var respStatus =
      json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
        "AuthenticateResult"
      ][0]["a:FaultCode"][0];
    if (respStatus == "0") {
      var userProp = {
        AccountEmailAddress:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountEmailAddress"][0],
        AccountID:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountID"][0],
        AccountName:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountName"][0],
        AccountOwnerDisplayValue:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountOwnerDisplayValue"][0],
        AccountOwnerRSN:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountOwnerRSN"][0],
        AccountOwnerType:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountOwnerType"][0],
        AccountRSN:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:AccountRSN"][0],
        Token:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:Token"][0],
        TokenExpiry:
          json["s:Envelope"]["s:Body"][0]["AuthenticateResponse"][0][
            "AuthenticateResult"
          ][0]["a:Value"][0]["b:TokenExpiry"][0],
      };
      getAllPartners(userProp.Token)
        .then((response) => {
          let xmlRes = response.data;

          parseString(xmlRes, function (err, result) {
            if (err) console.log(err);
            // here we log the results of our xml string conversion
            console.log(result);

            var json = result;
            var respStatus =
              json["s:Envelope"]["s:Body"][0]["SelectMembersResponse"][0][
                "SelectMembersResult"
              ][0]["a:FaultCode"][0];
            if (respStatus == "0") {
              var arrPartner=[];
              var ListPrtner =
                json["s:Envelope"]["s:Body"][0]["SelectMembersResponse"][0][
                  "SelectMembersResult"
                ][0]["a:Value"][0]["b:Items"][0]["b:MemberStub"];
                ListPrtner.forEach(item => {
                  console.log(item);
                });
            } else {
              res.status(200).json({
                status: "error",
                message:
                  json["s:Envelope"]["s:Body"][0]["SelectMembersResponse"][0][
                    "SelectMembersResult"
                  ][0]["a:FaultDescription"][0],
              });
            }
          });
          res.json(response);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      res.status(500).json({
        status: "error",
        message: "Authentication failed",
      });
    }
  });
};

const getAllPartners = (token) => {
  let xmlContent = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:poin="urn:simplicitycrm:loyalty/pointofsale" xmlns:sim="http://schemas.datacontract.org/2004/07/Simplicity.Service" xmlns:sim1="http://schemas.datacontract.org/2004/07/Simplicity.Loyalty">
  <soapenv:Header/>
  <soapenv:Body>
     <poin:SelectMembers>
        <poin:request>
           <sim:Token>${token}</sim:Token>
           <sim:Value>
              <sim1:PageNumber>1</sim1:PageNumber>
              <sim1:PageSize>10</sim1:PageSize>
              <!-- <sim1:ActiveMembership>?</sim1:ActiveMembership>
              <sim1:Audience_RSN>?</sim1:Audience_RSN>
              <sim1:CardOrVoucher>?</sim1:CardOrVoucher>
              <sim1:CompanyName>?</sim1:CompanyName>
              <sim1:CustomerAccountID>?</sim1:CustomerAccountID>
              <sim1:EmailAddress>?</sim1:EmailAddress>
              <sim1:FamilyName>?</sim1:FamilyName>
              <sim1:GivenName>?</sim1:GivenName>
              <sim1:ParentProgramRSN>?</sim1:ParentProgramRSN>
              <sim1:Partner_RSN>?</sim1:Partner_RSN>
              <sim1:PhoneLocal>?</sim1:PhoneLocal>
              <sim1:PostCode>?</sim1:PostCode>
              <sim1:ProgramCode>?</sim1:ProgramCode> -->
           </sim:Value>
        </poin:request>
     </poin:SelectMembers>
  </soapenv:Body>
</soapenv:Envelope>`;
  let resp = axios
    .post(config.soap_url, xmlContent, {
      headers: {
        "Content-type": 'text/xml; charset="utf-8"',
        SOAPAction:
          '"urn:simplicitycrm:loyalty/pointofsale/IPointOfSale/SelectMembers"',
      },
    })
    .catch((error) => {
      console.log(error);
    });
  return resp;
};

const authenticate = () => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:poin="urn:simplicitycrm:loyalty/pointofsale" xmlns:sim="http://schemas.datacontract.org/2004/07/Simplicity.Service.Interface">
   <soapenv:Header/>
   <soapenv:Body>
      <poin:Authenticate>
         <poin:request>
            <sim:AccountName>${config.email_partner}</sim:AccountName>
            <sim:SecurityCode>${config.password_partner}</sim:SecurityCode>
         </poin:request>
      </poin:Authenticate>
   </soapenv:Body>
</soapenv:Envelope>`;
  let resp = axios
    .post(config.soap_url, xmlContent, {
      headers: {
        "Content-type": 'text/xml; charset="utf-8"',
        SOAPAction:
          '"urn:simplicitycrm:loyalty/pointofsale/IPointOfSale/Authenticate"',
      },
    })
    .catch((error) => {
      console.log(error);
    });
  return resp;
};
