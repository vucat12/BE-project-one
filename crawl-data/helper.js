//file: index.js
const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { data } = require("cheerio/lib/api/attributes");
 
const URL = `https://alonhadat.com.vn/nha-dat/can-ban/trang--2.html`;
 
const options = {
  uri: URL,
  transform: function (body) {
    //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
    return cheerio.load(body);
  },
};

 
(async function crawler() {
  try {
    // Lấy dữ liệu từ trang crawl đã được parseDOM
    var $ = await rp(options);
  } catch (error) {
    return error;
  }
 
  /* Phân tích các table và sau đó lấy các posts.
     Mỗi table là một chương 
  */
  const tableContent = $(".content-items");
  for (let i = 0; i < tableContent.length; i++) {
    let chaper = $(tableContent[i]);
    // Tìm bài viết ở mỗi chương
    let data = [];
    const titlePage = chaper.find('.content-item').find('.ct_title');
    const imagePage = chaper.find('.content-item').find('.thumbnail').find("a").find("img");
    const pricePage = chaper.find('.content-item').find('.text').find('.price-dis').find('.ct_price');
    const areaPage = chaper.find('.content-item').find('.text').find('.square-direct').find('.ct_dt');
    const addressPage = chaper.find('.content-item').find('.text').find('.price-dis').find('.ct_dis');
    const descriptionPage = chaper.find('.content-item').find('.text').find('.ct_brief');

    for (let j = 0; j < titlePage.length; j++) {
      const getTitle = $(titlePage[j]).text();
      const getImage = $(imagePage[j]).attr('src');
      const getPrice = $(pricePage[j]).text();
      const getArea = $(areaPage[j]).text();
      const getAddress = $(addressPage[j]).text();
      const getDescription = $(descriptionPage[j]).text();

      data.push({
        titleInf: getTitle,
        imageInf: "https://alonhadat.com.vn" + getImage,
        priceInf: getPrice.substring(5),
        areaInf: getArea.substring(11),
        addressInf: getAddress,
        descriptionInf: getDescription.substring(0, (getDescription.length - 20)),
      })
    }
  fs.writeFileSync('data1.json', JSON.stringify(data))
  }
  // Lưu dữ liệu về máy

})();