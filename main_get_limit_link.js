document.getElementById("btn").onclick = async function() {
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
       var currentUrl = tabs[0].url;
       
       try {
        let user_input_limit = parseFloat(document.getElementById("text").value);
           const links = await checkElementOnPage(currentUrl,user_input_limit);
           let urlElement = document.getElementById("link");
           urlElement.innerHTML = ''; // Очищаем содержимое элемента перед обновлением

           links.forEach(async link => {
               let limit = await get_limit(link);
               if (limit <= user_input_limit){
                    let linkElement = document.createElement('p');
                    linkElement.textContent = `${link} Limit: ${limit}`;
                    urlElement.appendChild(linkElement);
               }
               
               
           });
       } catch (error) {
           console.error(`Error: ${error}`);
       }
    });
};

async function checkElementOnPage(currentUrl,input_limit) {
    let all_stake_links = [];
 
    for (let page = 0; page < 1000; page++) {
        let url = `${currentUrl}?page=${page}`;

        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const links_event = doc.querySelectorAll('.post__title.fn.mb-1');
            if (links_event.length > 0) {
                links_event.forEach(link => {
                    let full_link = "https://expari.com" + link.getAttribute("href");
                    all_stake_links.push(full_link);
                });
            } else {
                break;
            }
        } catch (error) {
            console.error(`Error fetching page ${url}: ${error}`);
        }
    }
    
    return all_stake_links;
}

async function get_limit(data) {
    try {
        const response = await fetch(data);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const limitElement = 
        doc.querySelector('#app > div:nth-child(6) > div:nth-child(2) > div > div.col.col-xl-3.order-xl-3.col-lg-3.order-lg-3.col-md-12.col-sm-12.col-12 > div > div:nth-child(1) > div > table > tbody > tr:nth-child(5) > td.text-right > span');
        
        if (limitElement) {
            return limitElement.textContent;
        } else {
            return 'Not found';
        }
    } catch (error) {
        console.error(`Error fetching page ${data}: ${error}`);
        return 'Error';
    }
}
