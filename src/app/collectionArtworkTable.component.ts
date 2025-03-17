import { Component, OnInit } from "@angular/core";
import { Artwork } from "./artwork.model";
import { ConfigSettings } from "./config";
import { CurrentUser } from "./currentUser.service";
import { Model } from "./repository.model";
import { CollectionArtwork } from "./collectionArtwork.model";


@Component({
    selector: "paCollectionArtworkTable",
    templateUrl: "collectionArtworkTable.html"
})

export class CollectionArtworkTableComponent {

    constructor(public currentuser: CurrentUser, public model: Model){}

    public handleMissingImage(event: Event) {
        (event.target as HTMLImageElement).src = 'assets/img/488199.png';
    }

    filteredResults() {
        let results = this.getCollectionArtworks().filter(it => {
            return (it.name+it.artist+it.year).toLowerCase().includes(this.searchCollectionText.toLowerCase())});
        return results;
    }

    searchCollectionText = "";
    searchCollectionDisplayLimit = 16;

    // configuration settings
    configSettings = new ConfigSettings;

    unsetSelectedCollectionArtwork() {
        this.model.selectedCollectionArtwork = null;
        this.model.selectedCollectionArtworkId = null;
    }

    setSelectedCollectionArtwork(collectionArtwork: CollectionArtwork) {
        this.model.selectedCollectionArtwork = collectionArtwork;
        this.model.selectedCollectionArtworkId = collectionArtwork._id;
    }

    //delete confirmation

    deleteConfirmation_Id: string = null;

    confirmDelete(_id: string) {
        this.deleteConfirmation_Id = _id;
    }

    isLoggedIn() {
        return this.currentuser.getUserID() != undefined;
    }

    isAdmin() {
        return this.currentuser.getUserID() == 1;
    }

    getCollectionArtworks() {
        return this.model.getCollectionArtworks();
    }

    getCollectionArtwork(_id: string) {
        return this.model.getCollectionArtwork(_id);
    }

    saveCollectionArtwork(collectionArtwork: CollectionArtwork) {
        collectionArtwork.searchstring = collectionArtwork.artist+" "+collectionArtwork.name+" "+collectionArtwork.year;
        this.model.saveCollectionArtwork(collectionArtwork);
    }

    addCollectionArtwork() {
        let newCollectionArtwork: CollectionArtwork = new CollectionArtwork();
        newCollectionArtwork.artist = "";
        newCollectionArtwork.filelocation = "";
        newCollectionArtwork.name = "";
        newCollectionArtwork.year = "";
        newCollectionArtwork.searchstring = "";
        this.model.saveCollectionArtwork(newCollectionArtwork);
    }

    deleteCollectionArtwork(_id: string) {
        this.model.deleteCollectionArtwork(_id);
    }
}