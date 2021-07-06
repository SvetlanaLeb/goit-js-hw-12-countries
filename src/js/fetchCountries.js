export default class CountryApiService{
    constructor() {
        this.searchQuery = '';
    }

    fetchCountries() {
        
        const url = `https://restcountries.eu/rest/v2/name/${this.searchQuery}`
        return fetch(url).then(r => r.json()).then(( data ) => {
            return data;
        })
    } 
}