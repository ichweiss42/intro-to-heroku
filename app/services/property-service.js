import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';

/*
    Prettify objects returned from Salesforce. This is optional, but it allows us to keep the templates independent
    from the Salesforce specific naming convention. This could also be done Salesforce-side by creating a custom REST service.
 */
let prettifyProperty = (property) => {
    let prettyProperty = {
        id: property.sfid,
        title: property.title__c,
        city: property.city__c,
        state: property.state__c,
        price: property.price__c,
        priceFormatted: "$" + property.price__c.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        beds: property.beds__c,
        baths: property.baths__c,
        description: property.description__c,
        picture: property.picture__c,
        thumbnail: property.thumbnail__c,
        likes: Math.floor(Math.random() * 20) + 1 // Likes are simulated: random number between 0 and 20. See "Favorites" for similar functionality.
    };
    prettyProperty.broker = property.broker__x_sfid ?
        {
            id: property.broker__x_sfid,
            name: property.broker__x_name,
            title: property.broker__x_title__c,
            picture: property.broker__x_picture__c
        } : {};
    return prettyProperty;
};

let prettifyFavorite = (favorite) => {
    return {
        id: favorite.favorite__x_sfid,
        property: prettifyProperty(favorite)
    };
};

@Injectable()
export class PropertyService {

    static get parameters() {
        return [Http];
    }

    constructor(http) {
        this.http = http;
    }

    findAll() {
        return this.http.get('/property').map(response => response.json().map(prettifyProperty));
    }

    findById(id) {
        return this.http.get('/property/' + id).map(response => prettifyProperty(response.json()));
    }

    getFavorites() {
        return this.http.get('/favorite').map(response => response.json().map(prettifyFavorite));
    }

    favorite(property) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/favorite', JSON.stringify({ 'property__x': property.id }), {headers: headers});
    }

    unfavorite(favorite) {
        return this.http.delete('/favorite/' + favorite.id);
    }

    like(property) {
    }

}