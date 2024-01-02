const { match } = require("assert");


let titleELement = 'T2024-03 Landslide Remedial Works Great North Road Cessnock LGA';
if(titleELement){

    // titleELement = titleELement.innerText;

    //removing the idNUmber
    // const match = titleELement.match(/T\d{4}-\d{2}/);
    const match = titleELement.match(/[A-Z]\d{4}-\d{2}/);


    console.log('matchm=', match);

    if (match) {
    const [matchedText] = match;
    const index = titleELement.indexOf(matchedText);

    // Extract the first part (before the numbers) and the second part (after the numbers)
    const firstPart = titleELement.substring(0, index).trim();
    const secondPart = titleELement.substring(index + matchedText.length).trim();
    
    titleELement = secondPart;
    numPart = match;
    
    }

}else{
    titleELement ='';
}
