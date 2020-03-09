// Custom Http Module
function customHttp() {
	return {
		get(url, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', url);
				xhr.addEventListener('load', () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						cb(`Error. Status code: ${xhr.status}`, xhr);
						return;
					}
					const response = JSON.parse(xhr.responseText);
					cb(null, response);
				});

				xhr.addEventListener('error', () => {
					cb(`Error. Status code: ${xhr.status}`, xhr);
				});

				xhr.send();
			} catch (error) {
				cb(error);
			}
		},
		post(url, body, headers, cb) {
			try {
				const xhr = new XMLHttpRequest();
				xhr.open('POST', url);
				xhr.addEventListener('load', () => {
					if (Math.floor(xhr.status / 100) !== 2) {
						cb(`Error. Status code: ${xhr.status}`, xhr);
						return;
					}
					const response = JSON.parse(xhr.responseText);
					cb(null, response);
				});

				xhr.addEventListener('error', () => {
					cb(`Error. Status code: ${xhr.status}`, xhr);
				});

				if (headers) {
					Object.entries(headers).forEach(([key, value]) => {
						xhr.setRequestHeader(key, value);
					});
				}

				xhr.send(JSON.stringify(body));
			} catch (error) {
				cb(error);
			}
		},
	};
}
// Init http module
const http = customHttp();
// simple service
const newsService = (function () {
	const apiKey = '42474c8bfbbb419792ebc75020cc8593'; //got api key 
	const apiUrl = 'http://newsapi.org/v2'; // got api url

	return { // return responses  first get method is for search, second is for full news
		topHeadLines(country = "ua", cb) {
			http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`, cb);
		},
		everything(query, cb) {
			http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
		}
	}
})();


//  init selects
document.addEventListener('DOMContentLoaded', function () {
	M.AutoInit();
});