const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { data } = require("cheerio/lib/api/attributes");


postDetail = {
    getPostDetail: function(url) {
    dataApp.get('/get-data-post', (request, response) => {
    let result = [];
    const URL = request.query.link;

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
            const moreinfPageDetail = chaper.find('.moreinfor1').find('.infor').find("tr").find("td");
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
                for (let n = 0; n < moreinfPageDetail.length; n++) {
                    getMoreInf[n] = $(moreinfPageDetail[n]).text().trim();
                }
    
    
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
            result = data;
            response.send(result)
          
        }
        // Lưu dữ liệu về máy
    
    })();
});
}
}


module.exports = postDetail;
