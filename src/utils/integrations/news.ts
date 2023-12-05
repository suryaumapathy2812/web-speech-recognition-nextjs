import axios from 'axios';

export type NewsArticle = {
  source: {
    id: string,
    name: string,
  }
  author: string,
  title: string,
  description: string,
  url: string,
  urlToImage: string,
  publishedAt: string,
  content: string,
}

export type NewsResponse = {
  "status": string,
  "totalResults": number,
  "articles": NewsArticle[]
}


export type NewsQuery = {
  q?: string,  // Keywords or phrases to search for in the article title and body.
  category?: string, // business entertainment general health science sports technology
  pageSize?: number, // The number of results to return per page (request). 5 is the default, 100 is the maximum.
  page?: number, // Use this to page through the results.
  sortBy?: string, // relevancy, popularity, publishedAt
}


function objectToQueryString(obj: any) {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  });
  return keyValuePairs.join('&');
}

const NEW_API_URL = 'https://newsapi.org/v2/';

export async function getNewsHeadLines(options: NewsQuery) {
  console.log('[NEWS_HEADLINES]', options)
  const requestParams = {
    q: options.q ?? '',
    category: options.category ?? '',
    language: 'en',
    country: 'in',
    pageSize: options.pageSize ?? 5,
    page: options.page ?? 1,
    sortBy: options.sortBy ?? 'relevancy',
  }
  const URL = `${NEW_API_URL}top-headlines?${objectToQueryString(requestParams)}&apiKey=${process.env.NEWS_API_KEY}`;
  const response = await axios.get(URL);
  console.log(response.data);
  return response.data.articles;
}

export async function getNewsByQuery(options: NewsQuery) {
  console.log('[NEWS_HEADLINES_BY_QUERY]', options)
  const requestParams = {
    q: options.q ?? '',
    category: options.category ?? '',
    language: 'en',
    country: 'in',
    pageSize: options.pageSize ?? 5,
    page: options.page ?? 1,
    sortBy: options.sortBy ?? 'relevancy',
  }
  const URL = `${NEW_API_URL}top-headlines?${objectToQueryString(requestParams)}&apiKey=${process.env.NEWS_API_KEY}`;
  const response = await axios.get(URL);
  console.log(response.data);
  return response.data.articles;
}