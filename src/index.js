import './styles/style.scss'
import axios from 'axios'
import { get } from 'lodash';
var _ = require('lodash');

const loadBtn = document.querySelector('.load-btn');
const mainBox = document.querySelector('.main-box');
const body = document.querySelector('body');

const getNews = () => {
    
    body.style.display = "grid";

    axios.get("https://hacker-news.firebaseio.com/v0/newstories.json")
    .then(res => dividingArr(res.data))
    .catch(err => console.log(err));
};

const dividingArr = (arr) => getUrls(_.chunk(arr, 10));

const getUrls = (arrs) => {

    //latest ten news
    arrs[0].forEach(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(obj => getInfos(obj))
    .catch(err => console.log(err)));

    //previous ten news
    let i = 1;
    loadBtn.addEventListener('click', () => {
    let fetchMore = '';

        if(i <= 49) {
           fetchMore = arrs[i++];
        }

        fetchMore.forEach(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        .then(obj => getInfos(obj))
        .catch(err => console.log(err)));
        
    })
        
};

let news = '';
const getInfos = (obj) => {
    let author = _.get(obj, "data.by" );
    let title = _.get(obj, "data.title");
    let url = _.get(obj, "data.url");
    let timeStamp = _.get(obj, "data.time");

    let time = new Date((timeStamp)*1000);
    let month = time.getMonth()+1;
    let year = time.getFullYear();
    let date = time.getDate();
    let hour = time.getHours();
    let minutes = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();

    news += `<div class="container">
                <h2 class="title"><a target="_blank" href="${url}" class="link">${title}</a></h2>
                <span>
                    <p class="author">by: ${author}</p>
                    <p class="date">${date}/${month}/${year} ${hour}:${minutes}</p>
                </span>
            </div>`;

        document.querySelector('.main-box').innerHTML = news;

}

getNews()