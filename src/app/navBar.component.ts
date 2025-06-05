import { Component, OnInit } from "@angular/core";
import { ConfigSettings } from "./config";
import { CurrentUser } from "./currentUser.service";
import { Model } from "./repository.model";
import { User } from "./user.model";
import { ActivatedRoute } from "@angular/router";


@Component({
    selector: "paNavBar",
    templateUrl: "navBar.component.html"
})

export class NavBarComponent implements OnInit {

    constructor(public currentuser: CurrentUser, private model: Model, private activatedRoute: ActivatedRoute,){}

     ngOnInit() {
        
        //return to gallery rather than home page
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
                if(params.activitynav == "false") {
                    this.activityNav = null;
                }
                else {
                    if(params.activitynav) {
                        this.activityNav = params.activitynav;
                    }
                    else {
                        this.activityNav = null;
                    }
                }
            }
        );
     }
    
    foo() {
        console.log(this.themeNav);
        console.log(this.activityNav);
    }
    // configuration settings
    configSettings = new ConfigSettings;

    themeNav: string = null;

    activityNav: string = null;

    isAdmin() {
        return this.currentuser.getUserID() == 1;
    }

    isLoggedOut() {
        return this.currentuser.getUserID() == undefined;
    }

    getUsers(): User[] {
        return this.model.getUsers();
    }

    getCurrentUsername() {
        let user = this.currentuser.getUser();
        if(user.username != undefined) {
            return user.username;
        }
    }

}