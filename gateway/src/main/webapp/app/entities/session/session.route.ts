import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Session } from 'app/shared/model/session.model';
import { SessionService } from './session.service';
import { SessionComponent } from './session.component';
import { SessionDetailComponent } from './session-detail.component';
import { SessionUpdateComponent } from './session-update.component';
import { SessionDeletePopupComponent } from './session-delete-dialog.component';
import { ISession } from 'app/shared/model/session.model';

@Injectable({ providedIn: 'root' })
export class SessionResolve implements Resolve<ISession> {
    constructor(private service: SessionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Session> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Session>) => response.ok),
                map((session: HttpResponse<Session>) => session.body)
            );
        }
        return of(new Session());
    }
}

export const sessionRoute: Routes = [
    {
        path: 'session',
        component: SessionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sessions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'session/:id/view',
        component: SessionDetailComponent,
        resolve: {
            session: SessionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sessions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'session/new',
        component: SessionUpdateComponent,
        resolve: {
            session: SessionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sessions'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'session/:id/edit',
        component: SessionUpdateComponent,
        resolve: {
            session: SessionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sessions'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const sessionPopupRoute: Routes = [
    {
        path: 'session/:id/delete',
        component: SessionDeletePopupComponent,
        resolve: {
            session: SessionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Sessions'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
