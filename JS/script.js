const countryurl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/countries.php';
const cityurl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/cities.php';
const lanurl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/languages.php';
const photourl = 'http://www.randyconnolly.com/funwebdev/3rd/api/travel/images.php';
// TODO: **** change this to GCP bucket URL ****
const GCP_BUCKET_URL = '';

document.addEventListener('DOMContentLoaded', function () {

    // country API 
    fetch(countryurl).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject({ status: response.status, statusText: response.statusText })
        }
    })
        .then(data => {
            localStorage.setItem('countryStore', JSON.stringify(data));
            displayCountries(data);
            displayCountryFilters();
        });

    fetchResources('city', cityurl);
    fetchResources('lan', lanurl);
    fetchResources('photo', photourl);

    // refactored fetch call function
    function fetchResources(type, url) {
        fetch(url).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject({ status: response.status, statusText: response.statusText })
            }
        })
            .then(data => {
                localStorage.setItem(`${type}Store`, JSON.stringify(data));
            });
    }

    // fetch photo given paramName and value
    function fetchPhotos(paramName, paramValue) {
        console.log(`${photourl}?${paramName}=${paramValue}`);
        fetch(`${photourl}?${paramName}=${paramValue}`).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject({ status: response.status, statusText: response.statusText })
            }
        })
            .then(data => {
                displayPhotos(data);
            });
    }

    // take the json data and display the county name
    function displayCountries(countries) {
        let countryList = document.querySelector(".list");
        let ul = document.createElement("ul");
        ul.setAttribute('id', 'countryUnorderedList');
        for (let c of countries) {
            let li = document.createElement("li");
            li.textContent = c.name;
            li.setAttribute('value', c.iso);
            // add event listener to invidividual list items
            li.addEventListener('click', (e) => {
                if (e.target && e.target.nodeName.toLowerCase() == "li") {
                    displayCity(filterCitiesByCountry(e.target.getAttribute('value')));
                    fetchPhotos('iso', e.target.getAttribute('value'));
                }
            });
            ul.appendChild(li);
            countryList.appendChild(ul);
        }
    }


    // take the json data and display the city name
    function displayCity(cities) {

        let cityList = document.querySelector("#citylist");
        let ul = document.createElement("ul");
        ul.setAttribute('id', 'cityUnorderedList');
        for (let c of cities) {
            let li = document.createElement("li");
            li.innerHTML = c.name;
            li.setAttribute('value', c.id);
            li.addEventListener('click', (e) => {
                fetchPhotos('city', e.target.getAttribute('value'));
            });
            ul.appendChild(li);
            cityList.appendChild(ul);
        }
    }

    function displayPhotos(photos) {
        if (document.querySelector('.travel div')) {
            document.querySelector('.travel div').remove();
        };
        let travel = document.querySelector('.travel');
        let travelList = document.createElement('div');
        for (let p of photos) {
            let picture = document.createElement('picture');
            let sourceMobile = document.createElement('source');
            let sourceDesktop = document.createElement('source');

            sourceMobile.setAttribute('media', '(max-width: 767px)');
            sourceMobile.setAttribute('srcset', `/case-travel-master/images/square75/${p.filename}`);

            sourceDesktop.setAttribute('media', '(min-width: 768px)');
            sourceDesktop.setAttribute('srcset', `/case-travel-master/images/square150/${p.filename}`);

            // let imageMobile = document.createElement('img');
            let imageDesktop = document.createElement('img');
                // TODO: **** host the image folder in GCP bucket to access them ****
                // TODO: **** responsive design for images ****
            // imageMobile.setAttribute('src', `/case-travel-master/images/square75/${p.filename}`);
            // imageMobile.addEventListener('click', (e) => {
            //     // TODO: **** event listener to switch interface ****
            // });
            imageDesktop.setAttribute('src', `/case-travel-master/images/square150/${p.filename}`);
            imageDesktop.addEventListener('click', (e) => {
                // TODO: **** event listener to switch interface ****
            });

            picture.appendChild(sourceMobile);
            picture.appendChild(sourceDesktop);
            // picture.appendChild(imageMobile);
            picture.appendChild(imageDesktop);
            travelList.appendChild(picture);
        }
        travel.appendChild(travelList);
    }

    function displayCountryFilters() {
        // continent filter as select list 
        const countries = JSON.parse(localStorage.getItem('countryStore'));

        let select = document.createElement("select");
        let defaultOption = document.createElement("option");
        defaultOption.setAttribute('selected', true);
        select.appendChild(defaultOption);
        let countryfilters = document.querySelector(".countryfilters");
        let continentSet = new Set([]);
        for (let c of countries) {
            continentSet.add(c.continent);
        }

        continentSet.forEach((continent) => {
            let opt = document.createElement("option");
            opt.textContent = continent;
            opt.setAttribute('value', continent);
            select.appendChild(opt);
        })
        select.addEventListener('change', (e) => {
            displayCountries(filterCountriesByContinent(e.target.value));
        });
        countryfilters.appendChild(select);

        // photos filter as a checkbox
        const input = document.createElement("input");
        let label2 = document.createElement("label");
        input.innerHTML = "<br>Filter by photos<br>";
        input.type = "checkbox";
        countryfilters.appendChild(input);

        input.addEventListener('change', (e) => {

        });

        // input text filter 
        const text = document.createElement("input");
        text.id = "countryFilter";
        text.type = "text";

        text.addEventListener('keyup', (e) => {
            displayCountries(getFilteredCountriesBasedOnInput(e.target.value));
        });
        countryfilters.appendChild(text);

    }

    function getFilteredCountriesBasedOnInput(countryString) {
        if (document.querySelector("#countryUnorderedList")) {
            document.querySelector("#countryUnorderedList").remove();
        }
        return JSON.parse(localStorage.getItem('countryStore')).filter((entry) => {
            // make the search case insensitive
            return entry.name.toUpperCase().includes(countryString.toUpperCase());
        });
    }

    function filterCountriesByContinent(continent) {
        if (!continent) {
            document.querySelector("#countryUnorderedList").remove();
            return JSON.parse(localStorage.getItem('countryStore'));
        }
        if (document.querySelector("#countryUnorderedList")) {
            document.querySelector("#countryUnorderedList").remove();
        }
        return JSON.parse(localStorage.getItem('countryStore')).filter((entry) => {
            return entry.continent === continent;
        });
    }

    function filterCitiesByCountry(countryString) {
        if (document.querySelector("#cityUnorderedList")) {
            document.querySelector("#cityUnorderedList").remove();
        }
        return JSON.parse(localStorage.getItem('cityStore')).filter((entry) => {
            // make the search case insensitive
            return entry.iso.toUpperCase().includes(countryString.toUpperCase());
        });
    }
});