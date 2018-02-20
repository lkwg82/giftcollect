import {Component, Input} from '@angular/core';
import {UserProfile} from "../../providers/userstore";

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
}
