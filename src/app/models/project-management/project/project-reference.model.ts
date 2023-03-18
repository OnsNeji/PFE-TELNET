import { OracleDbType, Direction } from 'app/models/shared';

function type(value: number) { return Reflect.metadata('type', value); }
function dir(value: number) { return Reflect.metadata('dir', value); }
function persisted(value: boolean) { return Reflect.metadata('persisted', value); }

export class ProjectReference {
    @type(OracleDbType.Decimal)
    @dir(Direction.Input)
    @persisted(true)
    public id: number;
    @type(OracleDbType.Varchar2)
    @dir(Direction.Input)
    @persisted(true)
    public reference: string;
    @type(OracleDbType.Varchar2)
    @dir(Direction.Input)
    @persisted(true)
    public title: string;
    @type(OracleDbType.Decimal)
    @dir(Direction.Input)
    @persisted(true)
    public edition: number;
    @type(OracleDbType.Date)
    @dir(Direction.Input)
    @persisted(true)
    public editionDate: Date;
    @type(OracleDbType.Date)
    @dir(Direction.Input)
    @persisted(true)
    public creationDate: Date;
    @type(OracleDbType.Date)
    @dir(Direction.Input)
    @persisted(true)
    public ObsolescenceDate: Date;
    @type(OracleDbType.Decimal)
    @dir(Direction.Input)
    @persisted(true)
    public status: number;
    @type(OracleDbType.Varchar2)
    @dir(Direction.Input)
    @persisted(true)
    public remark: string;
    @type(OracleDbType.Varchar2)
    @dir(Direction.Input)
    @persisted(true)
    public archivage: string;
    @type(OracleDbType.Decimal)
    @dir(Direction.Input)
    @persisted(true)
    public userId: number;
    @type(OracleDbType.Decimal)
    @dir(Direction.Input)
    @persisted(true)
    public activityId: number;
    @type(OracleDbType.Decimal)
    @dir(Direction.Input)
    @persisted(true)
    public type: number;
    @type(OracleDbType.Varchar2)
    @dir(Direction.Input)
    @persisted(true)
    public projectAbreviation: string;
}
