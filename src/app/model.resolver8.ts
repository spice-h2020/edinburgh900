import { Injectable } from "@angular/core"; 
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"; 
import { Observable, of } from "rxjs"; 
import { Message } from "./messages/message.model";
import { MessageService } from "./messages/message.service";
import { Model } from "./repository.model" 
import { RestDataSource } from "./rest.datasource"; 
import { ScriptSet } from "./scriptSet.model";
import { CollectionArtwork } from "./collectionArtwork.model";



@Injectable() 
export class ModelResolver8  { 
    constructor( 
        private model8: Model, 
        private dataSource: RestDataSource,
        private messages: MessageService ) { } 
        
    resolve(route: ActivatedRouteSnapshot): Observable<CollectionArtwork[]> {
        if(this.model8.getCollectionArtworks().length == 0) {
            this.messages.reportMessage(new Message("Loading Artwork collection..."));
            return this.dataSource.getCollectionArtworkData();
        }
    } 
}