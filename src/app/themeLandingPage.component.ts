import { Component, OnInit } from "@angular/core";
import { Model } from "./repository.model";
import { ActivatedRoute } from "@angular/router";
import { Script } from "./script.model";
import { Artwork } from "./artwork.model";
import { Theme } from "./theme.model";

@Component({
    selector: "paThemeLandingPage",
    templateUrl: "themeLandingPage.component.html"
})

export class ThemeLandingPageComponent implements OnInit {

    constructor(public model: Model, private activatedRoute: ActivatedRoute){}

    public handleMissingImage(event: Event) {
        (event.target as HTMLImageElement).src = 'assets/img/488199.png';
    }

    scripts: Script[];
    artworks: Artwork[] = [];
    themes: Theme[];

    selectedThemeId = null;
    selectedScripts: Script[] = [];
    selectedTheme: Theme = null;

    foo() {
        console.log(this.selectedScripts);
        console.log(this.scripts);
    }

    ngOnInit() {
        this.scripts = this.activatedRoute.snapshot.data.model1;
        this.artworks = this.activatedRoute.snapshot.data.model2;
        this.themes = this.activatedRoute.snapshot.data.model3;
        this.selectedThemeId = this.activatedRoute.snapshot.params.id;

        for(var script of this.scripts) {
            if(!script.removed && script.homepageartworkid != undefined && script.artworkids.length > 0 && script.stages.length > 0) {

                if(script.visible && (script.open || !this.statementOnlyScript(script))) {

                    if(script.themeids) {
                        if(script.themeids.includes(this.selectedThemeId)) {
                            console.log(script);
                            this.selectedScripts.push(script);
                        }
                    }
                }
            }
        }

        if(this.selectedThemeId) {
            this.selectedTheme = this.model.getTheme(this.selectedThemeId)
        }

        this.activatedRoute.queryParams
        .subscribe(params => {
            if(params.themenav == "false") {
                this.themeNav = null;
            }
            else {
                if(params.themenav) {
                    this.themeNav = params.themenav;
                }
                else {
                    this.themeNav = null;
                }
            }
        }
        );

    }

    themeNav: string = null;

    returrnString() {
        if(this.themeNav) {
            return 'themeLanding/'+this.themeNav;
        }
        else {
            return 'home';
        }
    }

    getArtworkFromId(_id: string) {
        let ind = this.model.getArtworks().findIndex(x => x._id == _id);
        if(ind > -1) {
            return [this.model.getArtworks()[ind]];
        }
        else {
            return [];
        }
    }

    getExhibitionsFromIds(_ids: string[]) {
        let exhibitions = [];
        for(var _id of _ids) {
            let ind = this.model.getExhibitions().findIndex(x => x._id == _id);
            if(ind > -1) {
                exhibitions.push(this.model.getExhibitions()[ind]);
            }
        }
        return exhibitions;
    }

    getThemesFromIds(_ids: string[]) {
        let themes = [];
        for(var _id of _ids) {
            let ind = this.model.getThemes().findIndex(x => x._id == _id);
            if(ind > -1) {
                themes.push(this.model.getThemes()[ind]);
            }
        }
        return themes;
    }

    statementOnlyScript(script: Script) {
        for(var stage of script.stages) {
            if(stage.stagetype != "statement") {
                return false;
            }
        }
        return true;
    }
    
}