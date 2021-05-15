//file: index.js
const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { data } = require("cheerio/lib/api/attributes");
 
const URL = `https://alonhadat.com.vn/du-an-bat-dong-san?fbclid=IwAR1y8jzzSi58mYbghBqtgw-wTnpVu856S5Zisx2_8q35RgeTbSLR8VarFEQ`;
 
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
  const tableContent = $(".list-project .content");
  let data = [];
  for (let i = 0; i < tableContent.length; i++) {
    let chaper = $(tableContent[i]);
    // Tìm bài viết ở mỗi chương
    const imagePage = chaper.find('.image').find("img");
    const namePage = chaper.find('.content').find('.title').find("a");
    const addressPage = chaper.find('.address');
    const descriptionPage = chaper.find('.brief');
    
    for (let j = 0; j < imagePage.length; j++) {

      const getImage = $(imagePage[j]).attr('src');
      const getName = $(namePage[j]).text().trim();
      const getAddress = $(addressPage[j]).text().trim();
      const getDescription = $(descriptionPage[j]).text().trim();

      data.push({
        imageInf: "https://alonhadat.com.vn" + getImage,
        nameInf: getName,
        addressInf: getAddress,
        description: getDescription,
      })
    }
    fs.writeFileSync('./crawl-json/data.json', JSON.stringify(data))
  }
  // Lưu dữ liệu về máy

})();