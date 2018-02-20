import {Component, Input} from '@angular/core';
import {UserProfile} from "../../providers/userstore";

/**
 * Generated class for the UserProfileComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
             selector: 'user-profile',
             template: `
               <h2>{{ user.displayName }}</h2>
               <p>email: {{ user.email }}</p>
               <p>userid: {{ user.userId }}</p>
             `
           })
export class UserProfileComponent {
  @Input() user: UserProfile;
  text: string;

  constructor() {
  }

}
