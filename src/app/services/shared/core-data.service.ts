import { Injectable } from '@angular/core';
import { EntityParameterService } from './entity-parameter.service';
import { GenericService } from './generic.service';
import { EntityParameter, OracleDbType, Direction, Body } from 'app/models/shared';

@Injectable()

export class CoreDataService {
    constructor(private genericService: GenericService,
        private entityParameterService: EntityParameterService) { }
    getUser(userId: number) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'userId', userId, OracleDbType.Decimal, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetUser';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';
        return this.genericService
            .createService('/Data/Get', body);
    }

    getSubordinates(managerUserId: number) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'managerUserId', managerUserId, OracleDbType.Decimal, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetSubordinates';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'result';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getReporters(userId: number) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'userId', userId, OracleDbType.Decimal, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetReporters';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getReportingsTo(userId: number) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'userId', userId, OracleDbType.Decimal, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetReportingsTo';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getReportersByPeriod(userId: number, periodFrom: Date, periodTo: Date) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'userId', userId, OracleDbType.Decimal, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'periodFrom', periodFrom, OracleDbType.Date, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'periodTo', periodTo, OracleDbType.Date, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetReportersByPeriod';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getUsers() {
        const body = new Body();
        body.storedProcedureName = 'GPTT.GetUsers';
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getActiveUsers() {
        const body = new Body();
        body.storedProcedureName = 'GPTT.GetActiveUsers';
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getActivitiesActiveUsers(activitiesId: string) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'activitiesId', activitiesId, OracleDbType.Varchar2, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetActivitiesActiveUsers';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getActivitiesUsersByPeriod(activitiesId: string, periodFrom: Date, periodTo: Date) {
        const entityParameters = new Array<EntityParameter>();
        this.entityParameterService.AddEntityParameter(entityParameters,
            'activitiesId', activitiesId, OracleDbType.Varchar2, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'periodFrom', periodFrom, OracleDbType.Date, Direction.Input);
        this.entityParameterService.AddEntityParameter(entityParameters,
            'periodTo', periodTo, OracleDbType.Date, Direction.Input);

        const body = new Body();
        body.storedProcedureName = 'GPTT.GetActivitiesUsersByPeriod';
        body.entitiesParameters = new Array(entityParameters);
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

    getDepartments() {
        const body = new Body();
        body.storedProcedureName = 'GPTT.GetDepartments';
        body.cursorName = 'curs';

        return this.genericService
            .createService('/Data/Get', body);
    }

}
