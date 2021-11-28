// count api requests
var count = 0;

// store datasets
var datasets = [];

// handle api request
function responseReceivedHandler() {
  if (this.status == 200) {
    if (this.response.status == "REQUEST_NOT_PROCESSED") {
      document.getElementById('myChart-container').innerHTML ="<span class='error'>"+this.response.message+"<br></span>";
      document.getElementById('myChart-container').innerHTML +="<span class='error'>"+"You can register for an API key to increase your query limit per day. Follow the registration link from the "+"<a href='https://www.bls.gov/developers/' target=_blank>Getting Started Page</a>"+" to obtain an API key."+"</span>";
    }
    count ++;
    let api_data = this.response.Results.series[0].data;
    let x = [];
    let y = [];
    for (let i=api_data.length-1; i>=0; i--) {
      x.push(api_data[i].periodName + " " + api_data[i].year);
      y.push(api_data[i].value);
    }
    datasets.push(
      {
        label: names[series.indexOf(this.response.Results.series[0].seriesID)],
        data: y,
        borderColor: border[count-1],
        backgroundColor: bg[count-1],
        hidden: true
      }
    );
    if (count == code.length) {
      drawChart(x, datasets);
    }
  } else {
    console.log ("error");
  }
}

// chart color
Chart.defaults.color = "#C0C0C0";

// create the chart
function drawChart(x, datasets) {
  const labels = x;
  const data = {
    labels: labels,
    datasets: datasets
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: ''
        }
      }
    }
  };
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}

// put chart colors in lists 
const border = ['rgb(230,25,75)','rgb(60,180,75)','rgb(0,130,200)','rgb(245,130,48)','rgb(145,30,180)','rgb(70,240,240)','rgb(210,245,60)','rgb(250,190,212)','rgb(0,128,128)','rgb(220,190,255)','rgb(170,110,40)','rgb(255,200,100)','rgb(128,0,0)','rgb(170,255,195)','rgb(128,128,0)','rgb(255,215,180)','rgb(0,0,128)','rgb(90,49,0)','rgb(54, 162, 235)','rgb(255, 99, 132)','rgb(128,128,128)','rgb(0,0,0)'];
const bg = ['rgba(230,25,75,0.5)','rgba(60,180,75,0.5)','rgba(0,130,200,0.5)','rgba(245,130,48,0.5)','rgba(145,30,180,0.5)','rgba(70,240,240,0.5)','rgba(210,245,60,0.5)','rgba(250,190,212,0.5)','rgba(0,128,128,0.5)','rgba(220,190,255,0.5)','rgba(170,110,40,0.5)','rgba(255,200,100,0.5)','rgba(128,0,0,0.5)','rgba(170,255,195,0.5)','rgba(128,128,0,0.5)','rgba(255,215,180,0.5)','rgba(0,0,128,0.5)','rgba(90,49,0,0.5)','rgba(54, 162, 235,0.5)','rgba(255, 99, 132,0.5)','rgba(128,128,128,0.5)','rgba(0,0,0,0.5)'];

// list of sector codes
var code = ["00","05","06","07","08","10","20","30","31","32","40","41","42","43","44","50","55","60","65","70","80","90"];
var series = [];
for (let i=0; i<code.length; i++) {
  series.push("CEU" + code[i] + "00000001");
}

// list of sector names
var names = ["Total nonfarm","Total private","Goods-producing","Service-providing","Private service-providing","Mining and logging","Construction","Manufacturing","Durable Goods","Nondurable Goods","Trade, transportation, and utilities","Wholesale trade","Retail trade","Transportation and warehousing","Utilities","Information","Financial activities","Professional and business services","Education and health services","Leisure and hospitality","Other services","Government"]

// make get requests
function getData(series) {
  let endpoint = "https://api.bls.gov/publicAPI/v2/timeseries/data/";

  // enter api key
  let apiKey = "";
  let queryString = series + "?registrationkey=" + apiKey;
  url = endpoint + queryString;

  let xhr = new XMLHttpRequest();
  xhr.addEventListener("load", responseReceivedHandler);
  xhr.responseType = "json";
  xhr.open("GET", url);
  xhr.send();
}

for (let i=0; i<code.length; i++) {
  getData(series[i]);
}
