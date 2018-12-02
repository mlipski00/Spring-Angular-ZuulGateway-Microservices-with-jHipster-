import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ISpeaker } from 'app/shared/model/speaker.model';

@Component({
    selector: 'jhi-speaker-detail',
    templateUrl: './speaker-detail.component.html'
})
export class SpeakerDetailComponent implements OnInit {
    speaker: ISpeaker;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ speaker }) => {
            this.speaker = speaker;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
