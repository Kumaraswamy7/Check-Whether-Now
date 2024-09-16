let countyapi="https://countriesnow.space/api/v0.1/countries";
const whetherapi="https://api.weatherapi.com/v1/current.json?key=03913c19b8384a86afc22937241609&q=Hyderabad";
let dataof="";
let countryname=[];
let cityname=[];
let selectedCountry="";
let selectedCity="";
let apiarr=[];
const drpdowncountry=document.querySelector(".select-opt-country");
const drpdowncity=document.querySelector(".select-opt-city");

function findcity(country){
  let count=0;
  drpdowncity.innerHTML = "";
  for(let k=0;k<dataof.length;k++){
  if(dataof[k].country===country){
    if(count===0){
      let cityarr=dataof[k].cities;
      for(let len=0;len<cityarr.length;len++){
       //console.log(cityarr[len]);
      let cityopt=document.createElement("option");
      cityopt.innerText=cityarr[len];
      drpdowncity.append(cityopt);
       if(len==cityarr.length-1){
  drpdowncity.addEventListener("change", function() {
    //console.log(drpdowncity.value);
  selectedCity = drpdowncity.value;
  getwhether(country,selectedCity);
  //console.log(selectedcity);
});
         break;
       }
      }
    count=1;
    }
  }
}
}
function find(countryname,i){
  //console.log(countryname,i);
  //console.log(dataof[i].cities)
  //console.log(drpdowncountry)
 
  let countryoptn=document.createElement("option");
   countryoptn.innerText=countryname;
   //countryoptn.value=countryname;
   drpdowncountry.append(countryoptn);
  // let cityopt=document.createElement("option");
  // cityopt.innerText=dataof[i].cities[i];
  // drpdowncity.append(cityopt);
  
}
function display(dataof){
 // console.log("displaying the country data");
  let message=[];
  for(let i=0;i<dataof.length;i++){
    let city=dataof[i];
    countryname.push(city.country);
    find(countryname[i],i);
  }
  //console.log(countryname);
}

const countryy=async ()=>{
  let apiofcountry=await fetch(countyapi)
  let countrydata=await apiofcountry.json();
  dataof=await countrydata.data;
  display(dataof);
}
function addtopage(whetherarr){
  apiarr=[];
  //console.log(whetherarr);
  for(let i=0;i<whetherarr.length;i++){
    if(i<whetherarr.length-1){
    apiarr[i]=document.querySelector(`.apidata${i+1}`);
    }
    if(i==0){
    for(let j=0;j<1;j++){
    apiarr[i].innerText=`${whetherarr[j]}`;
    }
    }
    else if(i>0){
    apiarr[i].innerText=`${whetherarr[i+1]}`;
    }
    //console.log(whetherarr);
  }
     //console.log(apiarr) 
}
async function selectcity(citynaame,countrynamee){
  const whetherarr=[];
//   drpdowncity.addEventListener("change", function() {
//   selectedCity = drpdowncity.value;
//   selectcity(selectedcity);
//   console.log(selectedcity);
// });
//console.log(citynaame);
  let whetherurl=`https://api.weatherapi.com/v1/current.json?key=03913c19b8384a86afc22937241609&q=${citynaame},${countrynamee}`;
  let citydata=await fetch(whetherurl);
  let cityy=await citydata.json();
  let cityof=cityy.current;
  //console.log(cityof);
  //console.log("real temp",cityof.temp_c);
  whetherarr.push(cityof.temp_c);
  //console.log("flees like",cityof.feelslike_c);
  whetherarr.push(cityof.feelslike_c);
 // console.log("text",cityof.condition.text);
  whetherarr.push(cityof.condition.text);
  //console.log("wind kph",cityof.wind_kph);
  whetherarr.push(cityof.wind_kph);
  //console.log("pressure",cityof.pressure_in);
  whetherarr.push(cityof.pressure_in);
 // console.log("wind_direction",cityof.wind_dir);
  whetherarr.push(cityof.wind_dir);
 // console.log("humidity",cityof.humidity);
    whetherarr.push(cityof.humidity);
 // console.log("cloud",cityof.cloud);
  whetherarr.push(cityof.cloud);
 // console.log("UV",cityof.uv);
  whetherarr.push(cityof.uv);
  addtopage(whetherarr);
}
 drpdowncountry.addEventListener("change", function() {
   selectedCountry = drpdowncountry.value;
   findcity(selectedCountry);
   
   // Get the value of the selected option
  //console.log("Selected country:", selectedCountry);
});
let getbtn=document.querySelector(".get-whether-btn button");
getbtn.addEventListener("click",(event)=>{
  event.preventDefault();
});
function getwhether(country,select2){
getbtn.addEventListener("click",(event)=>{
  event.preventDefault();
  //let selectedcityy=drpdowncity.value;
  drpdowncity.addEventListener("change", function() {
  selectedCity = drpdowncity.value;
  //selectcity(selectedcity);
  //console.log(selectedcity);
});
  selectcity(select2,country);
});
}

countryy();
