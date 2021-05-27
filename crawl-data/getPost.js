const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { data } = require("cheerio/lib/api/attributes");



const URL = "https://alonhadat.com.vn/ban-nha-mat-pho-giang-vo-100m-9tang-tmay-gia-nhinh-50-ty-8379938.html"

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
    const tableContent = $(".property");
    for (let i = 0; i < tableContent.length; i++) {
        let chaper = $(tableContent[i]);
        // Tìm bài viết ở mỗi chương
        let data = [];
        const titlePage = chaper.find('.title').find("h1");
        const datePage = chaper.find('.title').find('.date');
        const contentPage = chaper.find('.text-content');
        const pricePage = chaper.find('.moreinfor').find('.price').find('.value');
        const areaPage = chaper.find('.moreinfor').find('.square').find('.value');
        const addressPage = chaper.find('.address').find('.value');
        const moreinfPage = chaper.find('.moreinfor1').find('.infor').find("tr");
        const imagePage = chaper.find('.image-list').find("img");


        for (let j = 0; j < titlePage.length; j++) {
            const getTitle = $(titlePage[j]).text().trim();
            const getDate = $(datePage[j]).text().trim();
            const getContent = $(contentPage[j]).text().trim();
            const getPrice = $(pricePage[j]).text().trim();
            const getArea = $(areaPage[j]).text().trim();
            const getAddress = $(addressPage[j]).text().trim();
            //const getMoreInf = $(moreinfPage[j]).text().trim();
            let getMoreInf = [];

            for (let m = 0; m < moreinfPage.length; m++) {
                getMoreInf[m] = $(moreinfPage[m]).text().trim();
            }

            //     for (let n = 0; n < 4; n++) {
            //         getMoreInf[m][n] = $(moreinfPage[m]).find("td").text().trim();
            //     }
            //     getMoreInf[m][5] =$(moreinfPage[m]).find("td").find("img").attr('src');
            // }
            //
            let getImage = [];
            for (let k = 0; k < imagePage.length; k++) {
                getImage[k] = "https://alonhadat.com.vn" + $(imagePage[k]).attr('src');
            }
            data.push({
                titleInf: getTitle,
                dateInf: getDate,
                contentInf: getContent,
                priceInf: getPrice,
                areaInf: getArea,
                addressInf: getAddress,
                moreInf: getMoreInf,
                imageInf: getImage,
            })
        }
        fs.writeFileSync('data.json', JSON.stringify(data))
    }
    // Lưu dữ liệu về máy

})();