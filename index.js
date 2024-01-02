const puppeteer = require("puppeteer-extra");
const pluginStealth = require('puppeteer-extra-plugin-stealth');

async function NSW_Cessnock(){
    const browser = await puppeteer.launch();
    try{    
        const page1 = await browser.newPage();

        await page1.goto('https://www.vendorpanel.com.au/PublicTenders.aspx?profileGroupId=5415');

            //extracting tender links 
            const links = await page1.evaluate(()=>Array.from(document.querySelectorAll('#tList > tbody:nth-child(1) > tr > td:nth-child(2) > div:nth-child(2) > a:nth-child(2)'),(e)=>{
                const link = e.href;
                return link;
            }))

           console.log("total links : ",links.length); 

            //array for scraped data
            let scrapedData = [];


            //extracting date from each tender link
            let i = 1;
           for(const elm of links ){

                const page2 = await browser.newPage();
                await page2.goto(elm);
                
                await page2.screenshot({path:'home.png', fullPage:true});
                await page2.waitForSelector('body');
                // const element = await page2.$('.dhtmlwindow[style*="display: none"]');




                //pressing the preview button
                // await page2.click('#masterlayoutcontainer .lnkbtnblue');
                await page2.click('#tenderInfotbl > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > a:nth-child(1)');
                
                await page2.waitForTimeout(2000);

                //extracting data

                    //title
                    let title = '';
                    let numPart;
                    try{
                    titleNnum =  await page2.evaluate(()=>{
                            let titleELement = document.querySelector('#mstrlayoutcontainerPopUp tbody .OpportunityPreviewNameRowTenderPublic td');

                            if(titleELement){

                                titleELement = titleELement.innerText;

                                //removing the idNUmber
                                 const match = titleELement.match(/[A-Z]\d{4}-\d{2}/);
                                 
            
                                if (match) {
                                const [matchedText] = match;
                                const index = titleELement.indexOf(matchedText);
                            
                                // Extract the first part (before the numbers) and the second part (after the numbers)
                                const firstPart = titleELement.substring(0, index).trim();
                                const secondPart = titleELement.substring(index + matchedText.length).trim();
                                
                                titleELement = [secondPart,firstPart];
                                
                                }

                            }else{
                                titleELement =['','not found']; //returning both first part and the second part
                            }
                            
                            return titleELement;
                        })
                    }catch(error){
                        
                    }
                    title= titleNnum[0];
                    numPart = titleNnum[1];

                    //agency ""
                        let agency = "";


                    //atmID ""
                        let atmId = numPart;


                        // try{
                        //     atmId = await page2.evaluate(()=>{
                        //         let atmIdELement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(4) .opportunityPreviewContent');

                        //         atmIdELement? atmIdELement = atmIdELement.innerText : atmIdELement;

                        //         return atmIdELement;
                        //     })

                        // }catch(error){
                        //     console.log('atmId extraction',error);

                        // }
                        

                    //category 
                        let category = "not specified";

                    //location
                        let location = ["NSW"];

                        try{
                            const tempLocations = await page2.evaluate(()=>{
                                let locationElement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(6) div:nth-child(3) .opportunityPreviewContent ');

                                if(locationElement){

                                    locationElement = locationElement.innerHTML.split("<br>");
                                }
                                return locationElement
                            });
                            location = location.concat(tempLocations);

                        }catch(error){

                        }

                        

                    //region

                        const region = ["Cessnock City Council"];

                        // try{
                        //     const tempRegion = await page2.evaluate(()=>{
                        //         let regionELement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(3) div:nth-child(2) .opportunityPreviewContent ul li');

                        //         if(regionELement){

                        //             regionELement = regionELement.innerHTML.split("<br>");
                        //         }else{
                        //             regionELement = 'not specified';
                        //         }
                        //         return regionELement
                        //     });
                        //     region = region.concat(tempRegion);

                        // }catch(error){
                        //     console.log('region extraction',error);

                        // }

                    //idNumber

                        let idNumber = numPart;

                        // try{
                        //     idNumber = await page2.evaluate(()=>{
                        //         let idNumberELement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(4) .opportunityPreviewContent');

                        //         idNumberELement? idNumberELement = idNumberELement.innerText : idNumberELement=''

                        //         return idNumberELement;
                        //     })

                        // }catch(error){
                        //     console.log('idNumber extraction',error);
                        // }



                            //format date function
                            function formatCustomDate(inputDate) {

                                if(inputDate == "no date found"){
                                    return inputDate;
                                }else{
                                    const dateObj = new Date(inputDate);
                            
                                    // Get the day, month, and year
                                    const day = dateObj.getDate().toString().padStart(2, '0');
                                    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(dateObj);
                                    const year = dateObj.getFullYear();
                                
                                    // Combine the formatted parts
                                    const formattedDate = `${day} ${month} ${year}`;
                                
                                    return formattedDate;
                                }
                            }

                            //date verifier
                            function isDateValid(dateString) {
                                const date = new Date(dateString);
                                return !isNaN(date) && dateString.trim() !== '';
                              }
                            

                    //publishedDate
                        let publishedDate = "no date found";
                        try{
                            publishedDate = await page2.evaluate(()=>{
                                let publishedDateElement  = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(4) .opportunityPreviewInnerRow:nth-child(1) .opportunityPreviewContent');

                                publishedDateElement? publishedDateElement = publishedDateElement.innerText : publishedDateElement = "no date found";

                                return publishedDateElement;
                            })
                            // formatting the date
                            publishedDate = formatCustomDate(publishedDate);

                            if (isDateValid(publishedDate)) {
                               publishedDate;
                              } else {
                               publishedDate = "no date found";
                              }

                        }catch(error){
                            console.log("closing Date",error);
                        }

                        

                    //closingDate
                        let closingDate = "no date found";
                        try{
                            closingDate = await page2.evaluate(()=>{
                                let closingDateElement  = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(4) .opportunityPreviewInnerRow:nth-child(2) .opportunityPreviewContent');

                                closingDateElement? closingDateElement = closingDateElement.innerText : closingDateElement = "no date found";

                                return closingDateElement;
                            })
                            //formatting the date
                            closingDate = formatCustomDate(closingDate);

                            //varifiying the  date is a valid date
                            if (isDateValid(closingDate)) {
                                closingDate;
                               } else {
                                closingDate = "no date found";
                               }

                        }catch(error){
                            console.log("closing Date",error);
                        }

                        

                    //description
                        let description =';'
                        try{
                            description = await page2.evaluate(()=>{
                                let descriptionElement = document.querySelector('#mstrlayoutcontainerPopUp tbody tr:nth-child(7) .opportunityPreviewContent');

                                descriptionElement? descriptionElement = descriptionElement.innerText.replace(/\n+/g," ") : descriptionElement='';
                                return descriptionElement;
                            })
                        }catch(error){
                            console.log('description extraction',error);
                        }

                    //link
                        const link = await page2.url();

                    //updateDateTime
                        let updatedDateTime = "no date found";
                        try{
                                //updatedDateTime formattter
                                function formatDate(inputDate) {
                                    const dateObj = new Date(inputDate);
                                    
                                    // Create a new Intl.DateTimeFormat instance for the desired format
                                    const formatter = new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    });
                                    
                                    return formatter.format(dateObj);
                                    }
            
                            updatedDateTime = new Date().toLocaleDateString();
                            updatedDateTime = formatDate(updatedDateTime);

                        }catch(error){
                            console.log('updatedDateTime',error);
                        }

                        

                    //pushing the scraped data
                    scrapedData.push({
                        title,
                        agency,
                        atmId,
                        category,
                        location,
                        region,
                        idNumber,
                        publishedDate,
                        closingDate,
                        description,
                        link,
                        updatedDateTime,
                    });
                    
                    //counter for scraped links logged to the console
                    await page2.close();
                    console.log("scraped links: ", i);
                    i++;
                    
                }
                
                console.log(scrapedData);
                browser.close();
                
    }catch(error){
            console.log(error);
            browser.close();
        }


}

NSW_Cessnock();