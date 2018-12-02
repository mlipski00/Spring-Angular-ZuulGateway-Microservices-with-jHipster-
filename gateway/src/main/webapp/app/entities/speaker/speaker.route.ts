import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Speaker } from 'app/shared/model/speaker.model';
import { SpeakerService } from './speaker.service';
import { SpeakerComponent } from './speaker.component';
import { SpeakerDetailComponent } from './speaker-detail.component';
import { SpeakerUpdateComponent } from './speaker-update.component';
import { SpeakerDeletePopupComponent } from './speaker-delete-dialog.component';
import { ISpeaker } from 'app/shared/model/speaker.model';

@Injectable({ providedIn: 'root' })
export class SpeakerResolve implements Resolve<ISpeaker> {
    constructor(private service: SpeakerService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Speaker> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Speaker>) => response.ok),
                map((speaker: HttpResponse<Speaker>) => speaker.body)
            );
        }
        return of(new Speaker());
    }
}

export const speakerRoute: Routes = [
    {
        path: 'speaker',
        component: SpeakerComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Speakers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'speaker/:id/view',
        component: SpeakerDetailComponent,
        resolve: {
            speaker: SpeakerResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Speakers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'speaker/new',
        component: SpeakerUpdateComponent,
        resolve: {
            speaker: SpeakerResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Speakers'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'speaker/:id/edit',
        component: SpeakerUpdateComponent,
        resolve: {
            speaker: SpeakerResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Speakers'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const speakerPopupRoute: Routes = [
    {
        path: 'speaker/:id/delete',
        component: SpeakerDeletePopupComponent,
        resolve: {
            speaker: SpeakerResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Speakers'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
