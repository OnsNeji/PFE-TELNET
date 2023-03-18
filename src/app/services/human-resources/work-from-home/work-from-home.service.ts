import { Injectable } from '@angular/core';
import { WorkFromHomeRequest } from 'app/models/human-resources/work-from-home';
import { Body, Direction, EntityParameter, OracleDbType } from 'app/models/shared';
import { EntityParameterService, GenericService } from 'app/services/shared';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class WorkFromHomeService {

  public refreshWorkFomHomeRequest = new ReplaySubject<any>();
  public sortWorkFromHomeRequest = new Subject<any>();
  public refresh = new Subject<any>();
  constructor(private genericService: GenericService,
    private entityParameterService: EntityParameterService) { }

  getActivities() {
    const body = new Body();
    body.storedProcedureName = 'RHTT.GetActivities';
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }

  getStatus() {
    const body = new Body();
    body.storedProcedureName = 'RHTT.GetWorkHomeStatuses';
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }

  getWorkFromHomeRequests(userId: number, fromDate: Date, toDate: Date, resourceName: string, selectedActivitiesIds: string,
    selectedStatusesIds: string) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'userId', userId, OracleDbType.Decimal, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'startDate', fromDate, OracleDbType.Date, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'endDate', toDate, OracleDbType.Date, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'ressource', resourceName, OracleDbType.Varchar2, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'activities', selectedActivitiesIds, OracleDbType.Varchar2, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'states', selectedStatusesIds, OracleDbType.Varchar2, Direction.Input);

    const body = new Body();
    body.storedProcedureName = 'RHTT.GetWorkHome';
    body.entitiesParameters = new Array(entityParameters);
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }

  getWorkHomeRequestInProgress(workHomeRequestId: number) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'workHomeRequestId', workHomeRequestId, OracleDbType.Decimal, Direction.Input);

    const body = new Body();
    body.storedProcedureName = 'RHTT.GetWorkHomeRequestInProgress';
    body.entitiesParameters = new Array(entityParameters);
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }

  deleteWorkFromHomeRequest(workHomeRequestId: number, userId: number) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'workHomeRequestId', workHomeRequestId, OracleDbType.Decimal, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'userId', userId, OracleDbType.Decimal, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'result', 0, OracleDbType.Decimal, Direction.Output);

    const body = new Body();
    body.storedProcedureName = 'RHTT.DeleteWorkHome';
    body.entitiesParameters = new Array(entityParameters);
    body.outputIdParameterName = 'result';

    return null;
    // return this.genericService
    //   .createService('/Data/Delete', body);
  }

  updateStatusWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest, status: number) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'workHomeRequestId', workFromHomeRequest.workHomeRequestId, OracleDbType.Decimal, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'startDate', workFromHomeRequest.startDate, OracleDbType.Date, Direction.Input);
      this.entityParameterService.AddEntityParameter(entityParameters,
        'endDate', workFromHomeRequest.endDate, OracleDbType.Date, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'status', status, OracleDbType.Decimal, Direction.Input);
      this.entityParameterService.AddEntityParameter(entityParameters,
        'halfDay', workFromHomeRequest.halfDay, OracleDbType.Varchar2, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'result', 0, OracleDbType.Decimal, Direction.Output);

    const body = new Body();
    body.storedProcedureName = 'RHTT.UpdateStatusWorkHome';
    body.entitiesParameters = new Array(entityParameters);
    body.outputIdParameterName = 'result';

    return null;
    // return this.genericService
    //   .createService('/Data/Save', body);
  }

  getResources() {
    const body = new Body();
    body.storedProcedureName = 'RHTT.GetResources';
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }
  getReporters(userId: number) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'userId', userId, OracleDbType.Decimal, Direction.InputOutput);
    const body = new Body();
    body.storedProcedureName = 'RHTT.GetReporters';
    body.entitiesParameters = new Array(entityParameters);
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }
  insertOrUpdateWorkFromHomeRequest(workFromHomeRequest: WorkFromHomeRequest): any {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameters(entityParameters, workFromHomeRequest);

    const body = new Body();
    body.storedProcedureName = 'RHTT.InsertOrUpdateWorkFromHome';
    body.entitiesParameters = new Array(entityParameters);
    body.outputIdParameterName = 'workHomeRequestId';

    return null;
    // return this.genericService
    //   .createService('/Data/Save', body);
  }

  getReportingsTo(userId: number) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'userId', userId, OracleDbType.Decimal, Direction.Input);

    const body = new Body();
    body.storedProcedureName = 'RHTT.GetReportingsTo';
    body.entitiesParameters = new Array(entityParameters);
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }

  getUser(userId: number) {
    const entityParameters = new Array<EntityParameter>();
    this.entityParameterService.AddEntityParameter(entityParameters,
      'userId', userId, OracleDbType.Decimal, Direction.Input);

    const body = new Body();
    body.storedProcedureName = 'RHTT.GetUser';
    body.entitiesParameters = new Array(entityParameters);
    body.cursorName = 'curs';

    return null;
    // return this.genericService
    //   .createService('/Data/Get', body);
  }
  IsDateExistOrInProgressWorkHome(workHomeRequestId: number, userId: number, startDate: Date, endDate: Date): any {
    const entityParameters = new Array<EntityParameter>();

    this.entityParameterService.AddEntityParameter(entityParameters,
      'workHomeRequestId', workHomeRequestId, OracleDbType.Decimal, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'userId', userId, OracleDbType.Decimal, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'startDate', startDate, OracleDbType.Date, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'endDate', endDate, OracleDbType.Date, Direction.Input);
    this.entityParameterService.AddEntityParameter(entityParameters,
      'result', 0, OracleDbType.Decimal, Direction.Output);

    const body = new Body();
    body.storedProcedureName = 'RHTT.DateExistOrInProgressWorkHome';
    body.entitiesParameters = new Array(entityParameters);
    body.outputIdParameterName = 'result';

    return null;
    // return this.genericService
    //   .createService('/Data/Save', body);

  }
}


