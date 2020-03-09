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
		topHeadLines(country = "ru", cat = "sports",
			cb) {
			http.get(`${apiUrl}/top-headlines?country=${country}&category=${cat}&apiKey=${apiKey}`, cb);
		},
		everything(query, cb) {
			http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
		}
	}
})();

const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const categorySelect = form.elements['category'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e) => {
	e.preventDefault();
	loadNews();

});



//  init selects
document.addEventListener('DOMContentLoaded', function () {
	M.AutoInit();
	loadNews();
});

// load news func
function loadNews() {
	showLoader();
	const country = countrySelect.value;
	const searchText = searchInput.value;
	const category = categorySelect.value;

	if (!searchText) {
		newsService.topHeadLines(country, category, onGetResponse);
	} else {
		newsService.everything(searchText, onGetResponse);
	}


}

// func on get response from server
function onGetResponse(err, res) {
	removePreloader();
	if (err) {
		showAlert(err, 'errorr-msg');
		return;
	}

	if (!res.articles.length) {
		showAlert('there is no massages');
		return;
	}

	renderNews(res.articles);

}

// func render nerws
function renderNews(news) {
	const newsContainer = document.querySelector('.news-container .row');
	if (newsContainer.children.length) {
		clearContainer(newsContainer);
	}
	// because of html we create string
	let fragment = '';
	news.forEach(newsItem => {
		// saving our ready html template(materialize) to const el with iterating
		const el = newsTemplate(newsItem);
		// and adding el to string 
		fragment += el;
	});

	// shows on the web page like a html 
	newsContainer.insertAdjacentHTML('afterbegin', fragment);

}

// newsItem tem func
function newsTemplate({
	urlToImage,
	title,
	url,
	desc
}) {
	return `
		<div class="col s12 m12 l12">
			<div class="card">
				<div class="card-image">
					<img src="${urlToImage}">
					<span class="card-title">${title || ''}</span> 
				</div>
				<div <class="card-content">
					<p> ${desc || ''} </p> 
				</div>
				<div class="card-action">
          <a href="${url}">read more</a>
        </div>
			</div>
		</div>
	`;
}

function showAlert(msg, type = "sucsess") {
	M.toast({
		html: msg,
		classes: type
	});
}

function clearContainer(container) {
	let child = container.lastElementChild;
	while (child) {
		container.removeChild(child);
		child = container.lastElementChild;
	}
}

// show loader func
function showLoader() {
	document.body.insertAdjacentHTML(
		'afterbegin',
		`
		<div class="progress">
			<div class="indeterminate"></div>
		</div>
		`
	);
}
// remove preloader
function removePreloader() {
	const loader = document.querySelector('.progress');
	if (loader) {
		loader.remove();
	}
}