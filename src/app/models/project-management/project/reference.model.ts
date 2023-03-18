import { OracleDbType, Direction } from 'app/models/shared';

function type(value: number) { return Reflect.metadata('type', value); }
function dir(value: number) { return Reflect.metadata('dir', value); }
function persisted(value: boolean) { return Reflect.metadata('persisted', value); }


export class Reference {
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public referenceId = 0;
  @type(OracleDbType.Varchar2)
  @dir(Direction.Input)
  @persisted(true)
  public referenceCode: string;
  @type(OracleDbType.Varchar2)
  @dir(Direction.Input)
  @persisted(true)
  public title = '';
  @type(OracleDbType.Decimal)
  @dir(Direction.InputOutput)
  @persisted(true)
  public edition: number;
  @type(OracleDbType.Date)
  @dir(Direction.Input)
  @persisted(true)
  public creationDate: Date;
  @type(OracleDbType.Decimal)
  @dir(Direction.InputOutput)
  @persisted(true)
  public stateId: number;
  @persisted(false)
  public state: string;
  @type(OracleDbType.Varchar2)
  @dir(Direction.Input)
  @persisted(true)
  public note = '';
  @type(OracleDbType.Varchar2)
  @dir(Direction.Input)
  @persisted(true)
  public archiving = '';
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public userId = 0;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public activityId: number;
  @type(OracleDbType.Decimal)
  @dir(Direction.Input)
  @persisted(true)
  public typeId: number;
  @persisted(false)
  public type: string;
}
