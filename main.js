document.getElementById("btn").onclick = async function() {
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
       var currentUrl = tabs[0].url;
        // let element = document.querySelector("#app > div:nth-child(6) > div:nth-child(2) > div > div > div > div > div.profile-section > div.col > div > div.offset-md-2.col-md-8.col-12 > div:nth-child(1) > div > ul > li:nth-child(1) > span:nth-child(2)");
        // let count_page = parseInt(element.textContent.trim())/20; // потом мб доделать
       try {
           let user_input_limit = parseFloat(document.getElementById("text").value);
           let result = await checkElementOnPage(currentUrl,user_input_limit);
           document.getElementById("profit").textContent = `Profit = ${result.profit}`;
           document.getElementById("udi").textContent = `UDI = ${result.udi}`;
       } catch (error) {
           console.error(`Error: ${error}`);
       }
    });
};

async function checkElementOnPage(currentUrl, input_limit) {
    let counter = 0;
    let PROFIT =0;
    let UDI = 0;
    let count_stake = 0;

    for (let page = 0; page < 1000; page++) {
        let url = `${currentUrl}?page=${page}`;
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const element = doc.querySelector('.post__title.fn.mb-1');
            if (element) {
                let links_event = doc.querySelectorAll('.post__title.fn.mb-1');
                for (let event_link = 0; event_link < links_event.length; event_link++ ) {
                    let el = links_event[event_link];
                    let full_link = "https://expari.com" + el.getAttribute("href");
                    let limit_stake = await get_limit_stake(full_link);
                    // let profit_stake = await get_profit_stake(full_link);
                    // let udi_stake = await get_udi_stake(full_link);

                    if (limit_stake <= input_limit) {
                        PROFIT += await get_profit_stake(full_link);
                        UDI += await get_udi_stake(full_link);
                        count_stake++;
                    }
    
                };
                counter++;
            } else {
                break;
            }
        } catch (error) {
            console.error(`Error fetching page ${url}: ${error}`);
        }
    }

    return {"profit": PROFIT, "udi": UDI, "roi":count_stake};
}

async function get_limit_stake(data) {
    let event_limit;
    try {
        const response = await fetch(data);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        event_limit = doc.querySelector('#app > div:nth-child(6) > div:nth-child(2) > div > div.col.col-xl-3.order-xl-3.col-lg-3.order-lg-3.col-md-12.col-sm-12.col-12 > div > div:nth-child(1) > div > table > tbody > tr:nth-child(5) > td.text-right > span').textContent;
        return event_limit;

    } catch (error) {
        console.error(`Error fetching page ${url}: ${error}`);
    }    
    
}

async function get_profit_stake(data) {
    try {
        const response = await fetch(data);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const status = doc.querySelector("#app > div:nth-child(6) > div:nth-child(2) > div > div.col.col-xl-3.order-xl-3.col-lg-3.order-lg-3.col-md-12.col-sm-12.col-12 > div > div:nth-child(1) > div > table > tbody > tr:nth-child(7) > td:nth-child(1) > span").textContent;
        if (is_valid_status_win_loss(status)){
                const event_profit = doc.querySelector('#app > div:nth-child(6) > div:nth-child(2) > div > div.col.col-xl-3.order-xl-3.col-lg-3.order-lg-3.col-md-12.col-sm-12.col-12 > div > div:nth-child(1) > div > table > tbody > tr:nth-child(7) > td.text-right > span').textContent;
            
                // const numberRegex = /-?\d+(\.\d+)?/g;

                // // Находим все числа в строке
                // const numbersArray = event_profit.match(numberRegex);

                // Печатаем только числа
                // if (numbersArray) {
                    return parseFloat(event_profit);
                // } 

        } else return 0;

    } catch (error) {
        console.error(`Error fetching page ${url}: ${error}`);
    }    
}

async function get_udi_stake(data) {
    try {
        const response = await fetch(data);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const event_udi = doc.querySelector('#app > div:nth-child(6) > div:nth-child(2) > div > div.col.col-xl-3.order-xl-3.col-lg-3.order-lg-3.col-md-12.col-sm-12.col-12 > div > div:nth-child(1) > div > table > tbody > tr:nth-child(6) > td.text-right > span').textContent;
        return parseFloat(event_udi);

    } catch (error) {
        console.error(`Error fetching page ${url}: ${error}`);
    }    
}

function is_valid_status_win_loss(status){

   if (status === "Выигрыш" || status === "Проигрыш") {
    return true;
   } else return false;

}

function is_valid_status_win_loss_return(status){

    if (status === "Выигрыш" || status === "Проигрыш" || status === "Отмена") {
     return true;
    } else return false;
 
 }

