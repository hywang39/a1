const countryurl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/countries.php';
const cityurl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/cities.php';
const lanurl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/languages.php';
const photourl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/images.php ';

document.addEventListener('DOMContentLoaded', function() {
    
    const countrydata = []; 
    const citydata = [];
    const landata = []; 
    const photodata = [];
    
    // country API 
    fetch(countryurl).then(function (response){
        console.dir(response);
        if (response.ok) {
        return response.json();
        } else {
            return Promise.reject({ status: response.status, statusText: response.statusText})
        }
        })
        .then(data => {
            console.dir(data);
            localStorage.setItem('countryStore', JSON.stringify(data));
            displayCountries(data);
            countrydata.push(data);
        }); 
                

    //add catch here?

        // city API 
        fetch(cityurl).then(function (response){
            console.dir(response);
            if (response.ok) {
            return response.json();
            } else {
                return Promise.reject({ status: response.status, statusText: response.statusText})
            }
        })
        .then(data => {
            console.dir(data);
            localStorage.setItem('cityStore', JSON.stringify(data));
            displayCity(data); 
            citydata.push(data);
        }); 

        // language API   
        fetch(lanurl).then(function (response){
            console.dir(response);
            if (response.ok) {
            return response.json();
            } else {
                return Promise.reject({ status: response.status, statusText: response.statusText})
            }
        })
        .then(data => {
            console.dir(data);
            localStorage.setItem('lanStore', JSON.stringify(data));
            //displayCity(data); 
            landata.push(data);
        }); 

        // photo API 
        fetch(photourl).then(function (response){
            console.dir(response);
            if (response.ok) {
            return response.json();
            } else {
                return Promise.reject({ status: response.status, statusText: response.statusText})
            }
            })
            .then(data => {
                console.dir(data);
                localStorage.setItem('photoStore', JSON.stringify(data));
                photodata.push(data);
            }); 


    // take the json data and display the county name
    function displayCountries(countries) {
                
            let countryList = document.querySelector(".list");
            let ul = document.createElement("ul");
            for(let c of countries) {
                let li = document.createElement("li");
                li.textContent = c.name; 
                ul.appendChild(li);
                countryList.appendChild(ul);
            }
                countryFilters(countries);

                countryList.addEventListener('click' , (e) => {
                   
                   if (e.target && e.target.nodeName.toLowerCase() == "li"){                   
                   
                   }     
        });
    }
        

    // take the json data and display the city name
    function displayCity(cities) {

            let cityList = document.querySelector("#citylist");
            //cityList.classList.toggle('hidden');
            let ul = document.createElement("ul");
            for(let c of cities) {
                let li = document.createElement("li");
                li.innerHTML = c.name; 
                ul.appendChild(li);
                cityList.appendChild(ul);
            }

        }

    function countryFilters(countries) {
        // continent filter as select list 
        const conts = []; 

        let form = document.createElement("form");

        let select = document.createElement("select");
        let countryfilters = document.querySelector(".countryfilters");

        for (let c of countries) {
            let opt = document.createElement("option");
            opt.textContent = c.continent; 
            select.appendChild(opt);
            form.appendChild(select);
            
        }

        

        // photos filter as a checkbox
        const input = document.createElement("input");
        let label2 = document.createElement("label");
        input.innerHTML = "<br>Filter by photos<br>";
        input.type = "checkbox";
        form.appendChild(input);
        
        
        input.addEventListener('change', (e) => {
            let countryList = document.querySelector(".list ul");
            countryList.classList.toggle('hidden');

            let newCountryList = document.querySelector(".list");
            let ul = document.createElement("ul");
            for(let c of countries) {
                let li = document.createElement("li");
                findMatches(c.name, photodata);
                displayMatches();

            }
        });
        
        // input text filter 
        const text = document.createElement("input");
        text.type = "text";
        text.innerHTML ="Search";
        form.appendChild(text);

        countryfilters.appendChild(form);

    }


});