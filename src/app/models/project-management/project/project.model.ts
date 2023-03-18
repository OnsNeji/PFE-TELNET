import { OracleDbType, Direction } from 'app/models/shared';

function type(value: number) { return Reflect.metadata('type', value); }
function dir(value: number) { return Reflect.metadata('dir', value); }
function persisted(value: boolean) { return Reflect.metadata('persisted', value); }

export enum ProjectTypePhase {
  ProjectTelnet = 1,
  DATABOX = 3,
  Mecanic = 2
}

export enum ProjectStatus {
  InProgress = 1,
  Blocked = 2,
  Closed = 3,
  Planned = 4,
  Completed = 21
}

export enum ProjectStatusLabel {
  InProgress = 'In progress',
  Blocked = 'Blocked',
  Closed = 'Closed',
  Planned = 'Planned',
  Completed = 'Completed'
}

export class Project {
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public projectId = 0;
  @type(OracleDbType.Decimal)
  @dir(Direction.InputOutput)
  @persisted(true)
  public pifId = 0;
  @type(OracleDbType.NVarchar2)
  @dir(Direction.Input)
  @persisted(true)
  public name: string;
  @type(OracleDbType.NVarchar2)
  @dir(Direction.Input)
  @persisted(true)
  public abreviation: string;
  @type(OracleDbType.NVarchar2)
  @dir(Direction.Input)
  @persisted(true)
  public description: string;
  @type(OracleDbType.NVarchar2)
  @dir(Direction.Input)
  @persisted(true)
  public reference = '';
  @type(OracleDbType.Date)
  @dir(Direction.Input)
  @persisted(true)
  public plannedStartDate: Date;
  @type(OracleDbType.Date)
  @dir(Direction.Input)
  @persisted(true)
  public plannedEndDate: Date;
  @persisted(false)
  public realStartDate: Date;
  @persisted(false)
  public realEndDate: Date;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public cost: number;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public customerId: number;
  @persisted(true)
  @dir(Direction.Input)
  @type(OracleDbType.NVarchar2)
  public customerContact: string;
  @persisted(true)
  @dir(Direction.Input)
  @type(OracleDbType.NVarchar2)
  public customerPlace: string;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public categoryId: number;
  @persisted(false)
  public departmentId: number;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public activityId = 0;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public statusId: number;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public managerId = 0;
  @persisted(false)
  public customerName: string;
  @persisted(false)
  public categoryName: string;
  @persisted(false)
  public activityName: string;
  @persisted(false)
  public managerName: string;
  @persisted(false)
  public status: string;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public technologieId: number;
  @persisted(false)
  public SQAVisa: string;
  @persisted(false)
  public technologieName: string;
  @persisted(false)
  public state: string;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public companyId: number;
  @persisted(false)
  public companyName: string;
}
