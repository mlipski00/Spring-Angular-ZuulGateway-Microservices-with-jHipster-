import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ISession } from 'app/shared/model/session.model';
import { SessionService } from './session.service';
import { ISpeaker } from 'app/shared/model/speaker.model';
import { SpeakerService } from 'app/entities/speaker';

@Component({
    selector: 'jhi-session-update',
    templateUrl: './session-update.component.html'
})
export class SessionUpdateComponent implements OnInit {
    session: ISession;
    isSaving: boolean;

    speakers: ISpeaker[];
    startDateTime: string;
    endDateTime: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private sessionService: SessionService,
        private speakerService: SpeakerService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ session }) => {
            this.session = session;
            this.startDateTime = this.session.startDateTime != null ? this.session.startDateTime.format(DATE_TIME_FORMAT) : null;
            this.endDateTime = this.session.endDateTime != null ? this.session.endDateTime.format(DATE_TIME_FORMAT) : null;
        });
        this.speakerService.query().subscribe(
            (res: HttpResponse<ISpeaker[]>) => {
                this.speakers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.session.startDateTime = this.startDateTime != null ? moment(this.startDateTime, DATE_TIME_FORMAT) : null;
        this.session.endDateTime = this.endDateTime != null ? moment(this.endDateTime, DATE_TIME_FORMAT) : null;
        if (this.session.id !== undefined) {
            this.subscribeToSaveResponse(this.sessionService.update(this.session));
        } else {
            this.subscribeToSaveResponse(this.sessionService.create(this.session));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ISession>>) {
        result.subscribe((res: HttpResponse<ISession>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackSpeakerById(index: number, item: ISpeaker) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
