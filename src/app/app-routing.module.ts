import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage.component';
import { ContributionManagementComponent } from './contributionManagement.component';
import { OtherPeopleComponent } from './otherPeople.component';
import { ScriptAuthoringComponent } from './scriptAuthoring.component';
import { ThemeTableComponent } from './themeTable.component';
import { SlowLookingActivityComponent } from './slowLookingActivity.component';
import { ArtworkTableComponent } from './artworkTable.component';

const routes: Routes = [
  { path: 'home', component: HomepageComponent },
  { path: 'slowLooking/:id', component: SlowLookingActivityComponent },
  { path: 'management', component: ContributionManagementComponent },
  { path: 'otherPeople', component: OtherPeopleComponent },
  { path: 'authoring', component: ScriptAuthoringComponent },
  { path: 'themes', component: ThemeTableComponent, runGuardsAndResolvers: 'always'},
  { path: 'artworks', component: ArtworkTableComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }