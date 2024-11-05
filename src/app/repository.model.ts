import { Activity } from "./activity.model";
import { Artwork } from "./artwork.model";
import { Script } from "./script.model";
import { Theme } from "./theme.model";
import { Stage } from "./stage.model";
import { RestDataSource } from "./rest.datasource";
import { Injectable } from "@angular/core";
import { CollectionArtwork } from "./collectionArtwork.model";
import { User } from "./user.model";
import { ExtraArtworks } from "./extraArtworks";
import { Exhibition } from "./exhibition.model";
import { ScriptSet } from "./scriptSet.model";

@Injectable()
export class Model {

    private locator = (x: any, id: number) => x.id == id;
    private themeLocator = (theme: Theme, id: string) => theme._id === id;
    private scriptsetLocator = (scriptset: ScriptSet, id: string) => scriptset._id === id;
    private scriptLocator = (script: Script, id: string) => script._id == id;
    private activityLocator = (activity: Activity, id: string) => activity._id == id;
    private artworkLocator = (artwork: Artwork, id: string) => artwork._id == id;
    private userLocator = (user: User, id: string) => user._id == id;
    private collectionArtworkLocator = (collectionArtwork: CollectionArtwork, id: string) => collectionArtwork._id == id;
    private stringLocator = (x: any, id: any) => x._id == id;
    private openAndVisible = (x: any) => (x.open && x.visible);
    private visible = (x: any) => (x.visible);
    private hasTheme = (x: any, _id: string) => x.themeids.find(e => e == _id);
    private scriptHasArtworkAndStage = (x: Script) => (x.homepageartworkid != undefined && x.artworkids.length > 0 && x.stages.length > 0);
    private dbArtworks: Artwork[] = new Array<Artwork>();
    private dbScripts: Script[] = new Array<Script>();
    private dbThemes: Theme[] = new Array<Theme>();
    private dbScriptSets: ScriptSet[] = new Array<ScriptSet>();
    private dbActivities: Activity[] = new Array<Activity>();
    private dbUsers: User[] = new Array<User>();
    private dbExhibitions: Exhibition[] = new Array<Exhibition>();
    private dbCollectionArtworks: CollectionArtwork[] = new Array<CollectionArtwork>();

    //selections from overview pape
    selectedArtwork = undefined;
    selectedTheme = undefined;
    selectedOverviewScript = undefined;
    selectedUser = undefined;
    selectedExhibition = undefined;

    //script selection from script wizard (authoring)
    selectedScript: Script = undefined;
    viewScript: string = "0";
    selectScript(_id: string) {
        this.viewScript = _id;
        this.selectedScript  = this.getScript(_id);
    }

    //scriptset selection
    selectedscriptset: ScriptSet = null;

    //Collection artwork selection
    selectedCollectionArtwork: CollectionArtwork = null;
    selectedCollectionArtworkId: string = null;

    //add artworks not in LDH//
    private extraArtworks = new ExtraArtworks;
    // private dbCollectionArtworks: CollectionArtwork[] = [];
    // new Array<CollectionArtwork>();


    constructor(private dbDataSource: RestDataSource) {

        this.dbDataSource.getExhibitionData().subscribe(data => this.dbExhibitions = data);
        this.dbDataSource.getUserData().subscribe(data => this.dbUsers = data);
        this.dbDataSource.getThemeData().subscribe(data => this.dbThemes = data);
        this.dbDataSource.getArtworkData().subscribe(data => this.dbArtworks = data);
        this.dbDataSource.getActivityData().subscribe(data => this.dbActivities = data);
        this.dbDataSource.getScriptData().subscribe(data => this.dbScripts = data);
        this.dbDataSource.getScriptSetData().subscribe(data => {this.dbScriptSets = data});
        this.dbDataSource.getCollectionArtworkData().subscribe(data => {this.dbCollectionArtworks = data});

    }

    // Collection
    getCollection() {
        return this.dbCollectionArtworks;
    }

    // Exhibition
    getExhibitions(): Exhibition[] {
        return this.dbExhibitions;
    }

    getExhibition(_id: string) {
        return this.dbExhibitions.find(x => x._id == _id);
    }

    saveExhibition(exhibition: Exhibition) {
        if (exhibition._id == undefined) {
            this.dbDataSource.saveExhibition(exhibition).subscribe(p => this.dbExhibitions.push(p));
        }
        else {
            this.dbDataSource.updateExhibition(exhibition).subscribe(() => {
                let index = this.dbExhibitions.findIndex(item => item._id == exhibition._id);
                this.dbExhibitions.splice(index, 1, exhibition);
            });
        } 
    }

    deleteExhibition(_id: string) {
        this.dbDataSource.deleteExhibition(_id).subscribe(() => {
            let index = this.dbExhibitions.findIndex(p => p._id == _id);
            if (index > -1) {
                this.dbExhibitions.splice(index, 1);
            }
        })
    }

    getScriptsOfAnExhibition(_id: string): Script[] {
        return this.getScripts().filter(x => x.exhibitionids.some(y => y == _id));
    }

    // Collection artwork
    getCollectionArtworks(): CollectionArtwork[] {
        return this.dbCollectionArtworks; 
    }

    getCollectionArtwork(_id: string) {
        return this.dbCollectionArtworks.find(x => this.collectionArtworkLocator(x, _id));
    }

    saveCollectionArtwork(collectionArtwork: CollectionArtwork) {
        if (collectionArtwork._id == undefined) {
            this.dbDataSource.saveCollectionArtwork(collectionArtwork).subscribe(p => 
                {
                    this.dbCollectionArtworks.push(p);
                    this.selectedCollectionArtwork = p;
                    this.selectedCollectionArtworkId = p._id;
                }
            );
            
        }
        else {
            this.dbDataSource.updateCollectionArtwork(collectionArtwork).subscribe(() => {
                let index = this.dbCollectionArtworks.findIndex(item => this.collectionArtworkLocator(item, collectionArtwork._id));
                this.dbCollectionArtworks.splice(index, 1, collectionArtwork);
            });
        } 
    }

    deleteCollectionArtwork(_id: string) {
        console.log(_id);
        this.dbDataSource.deleteCollectionArtwork(_id).subscribe(() => {
            let index = this.dbCollectionArtworks.findIndex(p => this.collectionArtworkLocator(p, _id));
            if (index > -1) {
                this.dbCollectionArtworks.splice(index, 1);
            }
        })
    }

    // User
    getUsers(): User[] {
        return this.dbUsers;
    }

    getUser(_id: string) {
        return this.dbUsers.find(x => this.stringLocator(x, _id));
    }

    saveUser(user: User) {
        if(user.id == 0 || user.id == null) {
            user.id = this.generateUserID();
        }
        if (user._id == undefined) {
            this.dbDataSource.saveUser(user).subscribe(p => this.dbUsers.push(p));
        }
        else {
            this.dbDataSource.updateUser(user).subscribe(() => {
                let index = this.dbUsers.findIndex(item => this.userLocator(item, user._id));
                this.dbUsers.splice(index, 1, user);
            });
        } 
    }

    deleteUser(_id: string) {
        this.dbDataSource.deleteUser(_id).subscribe(() => {
            let index = this.dbUsers.findIndex(p => this.stringLocator(p, _id));
            if (index > -1) {
                this.dbUsers.splice(index, 1);
            }
        })
    }

    // Script set
    getScriptSets(): ScriptSet[] {
        return this.dbScriptSets;
    }

    getScriptSet(_id: string) {
        return this.dbScriptSets.find(x => this.stringLocator(x, _id));
    }

    saveScriptSet(scriptset: ScriptSet) {
        if (scriptset._id == undefined) {
            this.dbDataSource.saveScriptSet(scriptset).subscribe(p => {
                this.dbScriptSets.push(p);
                this.selectedscriptset = p;
            });
        } 
        else {
            this.dbDataSource.updateScriptSet(scriptset).subscribe(() => {
                let index = this.dbScriptSets.findIndex(item => this.scriptsetLocator(item, scriptset._id));
                this.dbScriptSets.splice(index, 1, scriptset);
            });
        }
    }

    deleteScriptSet(_id: string) {
        this.dbDataSource.deleteScriptSet(_id).subscribe(() => {
            let index = this.dbScriptSets.findIndex(p => this.stringLocator(p, _id));
            if (index > -1) {
                this.dbScriptSets.splice(index, 1);
            }
        })
    }

    // Theme

    refreshThemes() {
        this.dbDataSource.getThemeData().subscribe(data => this.dbThemes = data);
    }

    getThemes(): Theme[] {
        return this.dbThemes;
    }

    getTheme(_id: string) {
        return this.dbThemes.find(x => this.stringLocator(x, _id));
    }

    saveTheme(theme: Theme) {
        if(theme.id == 0 || theme.id == null) {
            theme.id = this.generateThemeID();
        }
        if (theme._id == undefined) {
            this.dbDataSource.saveTheme(theme).subscribe(p => this.dbThemes.push(p));
        } 
        else {
            this.dbDataSource.updateTheme(theme).subscribe(() => {
                let index = this.dbThemes.findIndex(item => this.themeLocator(item, theme._id));
                this.dbThemes.splice(index, 1, theme);
            });
        }
    }

    deleteTheme(_id: string) {
        let deletedTheme = this.getTheme(_id);
        
        this.dbDataSource.deleteTheme(_id).subscribe(() => {
            let index = this.dbThemes.findIndex(p => this.themeLocator(p, _id));
            if (index > -1) {
                this.dbThemes.splice(index, 1);
            }
        })
        //shift higher theme ids down
        for(var theme of this.dbThemes) {
            if(theme.id > deletedTheme.id) {
                theme.id = theme.id-1;
                this.saveTheme(theme);
            }
        }
    }

    deleteThemeFromScripts(_id: string, theme: Theme) {
        let scripts = this.getScriptsAllOfTheme(_id);
        scripts.forEach((script) => {
            this.removeThemeFromScript(script, theme._id);
          });
    }

    getScriptsAllOfTheme(_id: string): Script[] {
        return this.getScripts().filter(x => x.themeids.includes(_id));
    }

    getDefaultThemeId() {
        return this.dbThemes[0]._id;
    }

    findIndexToUpdate(newItem: any) {
        return newItem._id === this;
    }

    updateThemePosition(theme: Theme, newPosition: number) {
        //if old position < new
        if(theme.id < newPosition) {
            for(var newTheme of this.dbThemes) {
                if(newTheme.id <= newPosition && newTheme.id > theme.id) {
                    let idnumber: number = +newTheme.id
                    newTheme.id = idnumber-1;
                    this.saveTheme(newTheme);
                }
            }
        }
        // if old position > new
        else if(theme.id > newPosition) {
            for(var newTheme of this.dbThemes) {
                if(newTheme.id >= newPosition && newTheme.id < theme.id) {
                    let idnumber: number = +newTheme.id
                    newTheme.id = idnumber+1;
                    this.saveTheme(newTheme);
                }
            }
        }
        //
        if(theme.id !== newPosition) {
            let idnumber: number = +newPosition
            theme.id = idnumber;
            this.saveTheme(theme);
        }
    }


    // Artwork

    refreshArtworks() {
        this.dbDataSource.getArtworkData().subscribe(data => this.dbArtworks = data);
    }

    getArtworks(): Artwork[] {
        return this.dbArtworks;
    }

    getArtwork(_id: string) {
        return this.dbArtworks.find(x => this.stringLocator(x, _id));
    }

    saveArtwork(artwork: Artwork) {
        if (artwork.id == 0 || artwork.id == null) {
            artwork.id = this.generateArtworkID();
        }
        if (artwork._id == undefined) {
            this.dbDataSource.saveArtwork(artwork).subscribe(p => {
                this.dbArtworks.push(p);
            });
        }
        else {
            this.dbDataSource.updateArtwork(artwork).subscribe(() => {
                let index = this.dbArtworks.findIndex(item => this.artworkLocator(item, artwork._id));
                this.dbArtworks.splice(index, 1, artwork);
            });
        }
    }

    deleteArtwork(_id: string) {
        this.dbDataSource.deleteArtwork(_id).subscribe(() => {
            let index = this.dbArtworks.findIndex(p => this.stringLocator(p, _id));
            if (index > -1) {
                this.dbArtworks.splice(index, 1);
            }
        })
    }

    addArtworkToScript(script: Script, artworkid: string) {
        //add theme
        script.artworkids.push(artworkid);
    }

    removeArtworkFromScript(script: Script, artworkid: string) {
        let index = script.artworkids.findIndex(x => x == artworkid);
        script.artworkids.splice(index, 1);
        if(script.homepageartworkid == artworkid) {
            script.homepageartworkid = undefined;
        }
    }

    addArtworkToIncludedArtworks(script: Script, stage: Stage, artworkid: string) {
        //find stage in script
        let index = script.stages.findIndex(x => x.id == stage.id);

        //add artworkid to stage
        script.stages[index].includeartworks.push(artworkid);
    }

    removeArtworkFromIncludedArtworks(script: Script, stage: Stage, artworkid: string) {
        //find stage in script
        let index = script.stages.findIndex(x => x.id == stage.id);
        //remove artworkid from stage
        let scriptindex = script.stages[index].includeartworks.findIndex(p => p == artworkid);
        if (scriptindex > -1) {
            script.stages[index].includeartworks.splice(scriptindex, 1);
        }
    }

    // Script

    refreshScripts() {
        this.dbDataSource.getScriptData().subscribe(data => this.dbScripts = data);
    }

    getScripts(): Script[] {
        return this.dbScripts;
    }

    getScriptsOfAnArtwork(_id: string): Script[] {
        return this.getScripts().filter(x => x.artworkids.some(y => y == _id));
    }

    removeExhibitionFromScripts(scripts: Script[], _id: string) {
        for(var script of scripts) {
            let index = script.exhibitionids.findIndex(p => p == _id);
            if(index > -1) {
                script.exhibitionids.splice(index, 1);
                this.saveScript(script);
            }
        }
    }

    removeArtworkFromScripts(scripts: Script[], _id: string) {
        for(var script of scripts) {
            //remove artwork from artworkids
            let index = script.artworkids.findIndex(p => p == _id);
            if (index > -1) {
                script.artworkids.splice(index, 1);

                //remove artwork from homepageartworkid
                if(script.homepageartworkid == _id) {
                    script.homepageartworkid = undefined;
                    //replace homepageartworkid if artworkids is not empty
                    if(script.artworkids.length > 0) {
                        script.homepageartworkid = script.artworkids[0];
                    }
                }

                //remove artwork from stages
                for(var stage of script.stages) {
                    this.removeArtworkFromIncludedArtworks(script, stage, _id);
                }

                this.saveScript(script);
            }   
            
        }
    } 

    getOpenVisibleScripts(): Script[] {
        return this.dbScripts.filter(x => this.openAndVisible(x));
    }

    getVisibleScripts(): Script[] {
        return this.dbScripts.filter(x => this.visible(x));
    }

    getVisibleRespondableScriptsOfTheme(_id: string): Script[] {
        let scripts = this.getVisibleScripts().filter(x => this.hasTheme(x, _id));
        scripts = scripts.filter(x => this.scriptHasArtworkAndStage(x));
        scripts = scripts.filter(x => !this.statementOnlyScript(x));
        return scripts;
    }

    statementOnlyScript(script: Script) {
        for(var stage of script.stages) {
            if(stage.stagetype != "statement") {
                return false;
            }
        }
        return true;
    }


    getScriptsOfTheme(_id: string): Script[] {
        let scripts = this.getOpenVisibleScripts().filter(x => this.hasTheme(x, _id));
        scripts = scripts.filter(x => this.scriptHasArtworkAndStage(x));
        return scripts;
    }

    getScript(_id: string): Script {
        return this.dbScripts.find(x => this.stringLocator(x, _id));
    }

    saveScript(script: Script, scriptCopy?: boolean) {
        if (script.id == 0 || script.id == null) {
            script.id = this.generateScriptID();
        }
        if (script._id == undefined) {
            this.dbDataSource.saveScript(script).subscribe(p => {
                this.dbScripts.push(p);
                //if new rather than copied script then automatically open it by selecting it as currrent script
                if(!scriptCopy) {
                    this.selectScript(p._id);
                }
            });
        }
        else {
            this.dbDataSource.updateScript(script).subscribe(() => {
                let index = this.dbScripts.findIndex(item => this.scriptLocator(item, script._id));
                this.dbScripts.splice(index, 1, script);
            });
        }
    }

    deleteScript(_id: string) {
        this.dbDataSource.deleteScript(_id).subscribe(() => {
            let index = this.dbScripts.findIndex(p => this.stringLocator(p, _id));
            if (index > -1) {
                this.dbScripts.splice(index, 1);
            }
        })
    }


    addExhibitionToScript(script: Script, exhibitionid: string) {
        //add theme
        script.exhibitionids.push(exhibitionid);
    }

    removeExhibitionFromScript(script: Script, exhibitionid: string) {
        let index = script.exhibitionids.findIndex(x => x == exhibitionid);
        if(index > -1) {
            script.exhibitionids.splice(index, 1);
        }
    }

    addThemeToScript(script: Script, themeid: string) {
        //add theme
        script.themeids.push(themeid);
    }

    removeThemeFromScript(script: Script, themeid: string) {
        let index = script.themeids.findIndex(x => x == themeid);
        script.themeids.splice(index, 1);
    }

    saveStage(stage: Stage, script: Script) {
        if (stage.id == 0 || stage.id == null) {
            stage.id = this.generateScriptStageId(script);
        }
        return stage.id;
    }

    // Activity

    refreshActivities() {
        this.dbDataSource.getActivityData().subscribe(data => this.dbActivities = data);
    }

    getActivity(id: number) {
        return this.dbActivities.find(x => this.locator(x, id));
    }

    getActivities(): Activity[] {
        return this.dbActivities;
    }
    
    getApprovedActivitiesOfAScript(scriptId: string): Activity[] {
        return this.getApprovedActivities().filter(x => x.script._id == scriptId);
    }

    getApprovedActivities(): Activity[] {
        return this.dbActivities.filter(x => x.approved);
    }

    getApprovedVisibleActivities(): Activity[] {
        return this.getApprovedActivities().filter(x => x.script.visible)
    }

    getUnapprovedActivities(): Activity[] {
        return this.dbActivities.filter(x => !x.approved);
    }

    saveActivity(activity: Activity) {
        if(activity.id == 0 || activity.id == null) {
            activity.id = this.generateActivityID();
        }
        if (activity._id == undefined) {
            this.dbDataSource.saveActivity(activity).subscribe(p => this.dbActivities.push(p));
        } 
        else {
            this.dbDataSource.updateActivity(activity).subscribe(() => {
                let index = this.dbActivities.findIndex(item => this.activityLocator(item, activity._id));
                this.dbActivities.splice(index, 1, activity);
            });
        }
    }

    deleteActivity(_id: string) {
        this.dbDataSource.deleteActivity(_id).subscribe(() => {
            let index = this.dbActivities.findIndex(p => this.stringLocator(p, _id));
            if (index > -1) {
                this.dbActivities.splice(index, 1);
            }
        })
    }
    
    addStageToScript(script: Script, stage: Stage) {
        script.stages.push(stage);
        this.saveScript(script);
    }


    removeStageFromScript(script: Script, stage: Stage) {
 
        // remove stage
        let index = script.stages.findIndex(x => this.locator(x, stage.id));
        script.stages.splice(index, 1);

        // save script
        this.saveScript(script);
    }

    moveScriptStage(script: Script, oldPosition: number, newPosition: number) {
        //move script stage position
        this.insertAndShiftStages(script.stages, oldPosition, newPosition);
        //save script
        this.saveScript(script);
    }

    insertAndShiftStages(arr: Stage[], from: number, to: number) {
        let cutOut = arr.splice(from, 1) [0]; // cut the element at index 'from'
        arr.splice(to, 0, cutOut);            // insert it at index 'to'
    }

    // ID generators
    private generateUserID(): number {
        let candidate = 1;
        while(this.dbUsers.find(element => element.id == candidate)) {
            candidate++;
        }
        return candidate;
    }

    private generateActivityID(): number {
        let candidate = 1;
        while(this.dbActivities.find(element => element.id == candidate)) {
            candidate++;
        }
        return candidate;
    }

    private generateThemeID(): number {
        let candidate = 1;
        while(this.dbThemes.find(element => element.id == candidate)) {
            candidate++;
        }
        return candidate;
    }

    generateScriptID(): number {
        let candidate = 0;
        for (var script of this.dbScripts) {
            if(script.id > candidate) {
                candidate = script.id;
            }
        }
        candidate = candidate+1;
        return candidate;
    }

    private generateArtworkID(): number {
        let candidate = 1;
        while(this.dbArtworks.find(element => element.id == candidate)) {
            candidate++;
        }
        return candidate;
    }

    private getScriptStageFromId(script: Script, id: number) {
        return script.stages.find(s => s.id == id);
    }

    generateScriptStageId(script: Script) {
        let candidate = 1;
        if(script.stages.length == 0) {
            return candidate;
        }
        while (this.getScriptStageFromId(script, candidate) !== undefined) {
            candidate++;
        }
        return candidate;
    }

}