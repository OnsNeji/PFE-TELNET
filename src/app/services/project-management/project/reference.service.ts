import { Injectable } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs/index';
import { Reference } from 'app/models/project-management/project';
import { Body, EntityParameter, OracleDbType, Direction } from 'app/models/shared';
import { GenericService, EntityParameterService } from 'app/services/shared';

@Injectable()
export class ReferenceService {

    public sortReferences = new Subject<any>();
    public savedReference = new ReplaySubject<any>(1);
    constructor(private genericService: GenericService,
        private entityParameterService: EntityParameterService) { }

    getTypesDocuments() {
        const body = new Body();
        body.storedProcedureName = 'GPTT.GetTypesDocuments';
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    getDocumentStates() {
        const body = new Body();
        body.storedProcedureName = 'GPTT.GetDocumentStates';
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    GetDocumentConfidentialities() {
        const body = new Body();
        body.storedProcedureName = 'GPTT.GetDocumentConfidentialities';
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    getReferencesProjects(title: string, referenceCode: string,
        status: string, docTypes: string, activities: string, startCreationDate: Date, endCreationDate: Date) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'title', title, OracleDbType.Varchar2, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'referenceCode', referenceCode, OracleDbType.Varchar2, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'states', status, OracleDbType.Varchar2, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'activities', activities, OracleDbType.Varchar2, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'types', docTypes, OracleDbType.Varchar2, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'startCreationDate', startCreationDate, OracleDbType.Date, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'endCreationDate', endCreationDate, OracleDbType.Date, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetReferences';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    getReferenceProject(referenceId: number) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'referenceId', referenceId, OracleDbType.Decimal, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetReference';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    getActivityAbbriviations(activityId: number) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'activityId', activityId, OracleDbType.Decimal, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetActivityAbbriviations';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    getActivityCode(activityId) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'activityId', activityId, OracleDbType.Varchar2, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetActivityCode';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return null;
        // return this.genericService
        //     .createService('/Data/Get', body);
    }

    saveReferenceGenerator(reference: Reference): any {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameters(entityParameters, reference);
        const body = new Body();
        body.storedProcedureName = 'GPTT.InsertOrUpdateReference';
        body.entitiesParameters = new Array(entityParameters);
        body.outputIdParameterName = 'referenceId';

        return null;
        // return this.genericService
        //     .createService('/Data/Save', body);
    }
}
