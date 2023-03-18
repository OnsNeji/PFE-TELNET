import { OracleDbType, Direction } from 'app/models/shared';

function type(value: number) { return Reflect.metadata('type', value); }
function dir(value: number) { return Reflect.metadata('dir', value); }
function persisted(value: boolean) { return Reflect.metadata('persisted', value); }

export enum WorkHomeRequestStatus {
  InProgress = 1,
  Approved = 2,
  Rejected = 3
}

export enum WorkHomeRequestStatusLabel {
  InProgress = 'In Progress',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

export enum HalfDay {
  Morning = 'Morning',
  Afternoon = 'Afternoon',
}

export class WorkFromHomeRequest {
  @persisted(true)
  @type(OracleDbType.Decimal)
  @dir(Direction.InputOutput)
  public workHomeRequestId = 0;
  @persisted(true)
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  public userId: number;
  @persisted(false)
  public userNumber;
  @persisted(false)
  public userFullName;
  @persisted(false)
  public activityName: string;
  @persisted(true)
  @type(OracleDbType.Date)
  @dir(Direction.Input)
  public startDate: Date;
  @persisted(true)
  @type(OracleDbType.Date)
  @dir(Direction.Input)
  public endDate: Date;
  @persisted(true)
  @type(OracleDbType.Varchar2)
  @dir(Direction.Input)
  public motive = '';
  @persisted(true)
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  public state: number;
  @persisted(true)
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  public dayNumber = 0;
  @persisted(true)
  @type(OracleDbType.Varchar2)
  @dir(Direction.Input)
  public halfDay = '';
}
