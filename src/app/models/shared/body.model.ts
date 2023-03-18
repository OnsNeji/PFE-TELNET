import { EntityParameter } from 'app/models/shared';

export class Body {
    public storedProcedureName: string;
    public entitiesParameters: Array<Array<EntityParameter>>;
    public outputIdParameterName: string;
    public cursorName: string;
}
