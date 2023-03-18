import { Injectable } from '@angular/core';
import { EntityParameter, OracleDbType, Direction } from 'app/models/shared';
import { } from 'reflect-metadata';

@Injectable()
export class EntityParameterService {
    constructor() {
        // do nothing
    }

    AddEntityParameter(entityParameters: Array<EntityParameter>, name: string, value: any, dbType: OracleDbType, direction: Direction) {
        const entityParameter = new EntityParameter();
        entityParameter.name = name;
        entityParameter.value = !(value === null || value === undefined) ? value.toString() : '';
        entityParameter.dbType = dbType;
        entityParameter.direction = direction;
        entityParameters.push(entityParameter);

        return entityParameters;
    }

    AddEntityParameters(entityParameters: Array<EntityParameter>, object: any) {
        Object.entries(object).forEach(
            ([key, value]) => {
                const persisted: boolean = Reflect.getMetadata('persisted', object, key);
                if (persisted === true) {
                    this.AddEntityParameter(entityParameters, key, !(value === null || value === undefined) ? value.toString() : '',
                        Reflect.getMetadata('type', object, key), Reflect.getMetadata('dir', object, key));
                }
            });

        return entityParameters;
    }
}
