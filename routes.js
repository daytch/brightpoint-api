"use strict";
const member = require("./app/controller/member.ctrl");
const partner = require("./app/controller/partner.ctrl");
const voucher = require("./app/controller/voucher.ctrl");
const socialpoint = require("./app/controller/socialpoint.ctrl");
const fs = require("fs");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.route("/").get((req, response) => {
    response.writeHead(404, {
      "Content-Type": "text/html",
    });
    fs.readFile("html/index.html", null, function (error, data) {
      if (error) {
        response.writeHead(404);
        respone.write("Whoops! File not found!");
      } else {
        response.write(data);
      }
      response.end();
    });
    // response.write("Ok");
    // response.end();
  });

  // Function for Mobile
  app.post("/member/login", member.login);
  app.post("/member/profile", member.profile);
  app.post("/member/vouchers", member.vouchers);
  app.post("/member/transactions", member.transactions);
  app.post("/member/getoffers", member.getOffers);
  app.post("/member/promotionaloffers", member.getPromos);
  app.post("/member/offerdetail", member.getOfferDetails);
  app.post("/member/orders", member.getOrders);

  app.post("/partner/getallpartner", partner.getAll);
  app.post("/partner/detail", partner.detail);

  app.post("/voucher/purchase", voucher.purchase);
  app.post("/voucher/getall", voucher.getall);
  app.post("/voucher/detail", voucher.getdetail);

  app.post("/socialpoint/getall", socialpoint.getAllSocialPointGroup);
  app.post("/socialpoint/mygroup", socialpoint.getMyGroup);

  app.post("/tesf", function (req, res) {
    console.log(req.headers);
    console.log(req.body);
    return res.json({
      sts: "ok",
    });
  });
};
