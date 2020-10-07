import { Notifications } from './notifications';

export class ElementsSchema {
    private elements: any;

    constructor(elements: string) {
        this.elements = elements;
    }
    public getElements(): IElements {
        return this.elements;
    }

    public validate(): Notifications {
        const notes: Notifications = new Notifications();
        if (this.elements.length === 0) {
            notes.addError('Elements Schema is empty');
            return notes;
        }
        if (!this.elementsIsValidJson(notes)) {
            return notes;
        }
        this.validateEntities(notes);
        this.validateEdges(notes);
        this.validateInvalidProperties(notes);
        return notes;
    }

    private elementsIsValidJson(notes: Notifications): boolean {
        try {
            this.elements = JSON.parse(this.elements);
            return true;
        } catch (e) {
            notes.addError('Elements Schema is not valid JSON');
            return false;
        }
    }

    private validateEntities(notes: Notifications): void {
        if (this.elements.entities === undefined) {
            notes.addError('Elements Schema does not contain property entities');
            return;
        }
        if (typeof this.elements.entities !== 'object') {
            notes.addError(`Entities is type ${typeof this.elements.entities} and not an object of Entity objects`);
            return;
        }
        Object.keys(this.elements.entities).filter((entityName: string) => {
            const entity: IEntity = this.elements.entities[entityName];

            let missingProps: Array<string> = [];
            if (entity.description === undefined) {
                missingProps.push('"description"');
            }
            if (entity.vertex === undefined) {
                missingProps.push('"vertex"');
            }
            if (entity.properties === undefined) {
                missingProps.push('"properties"');
            }
            if (entity.groupBy === undefined) {
                missingProps.push('"groupBy"');
            }
            if (missingProps.length > 0) {
                notes.addError(`${entityName} entity is missing [${missingProps.join(', ')}]`);
            }
        });
    }

    private validateEdges(notes: Notifications): void {
        if (this.elements.edges === undefined) {
            notes.addError('Elements Schema does not contain property edges');
        }
    }

    private validateInvalidProperties(notes: Notifications): void {
        const invalidProperties = Object.keys(this.elements).filter((key) => key !== 'entities' && key !== 'edges');

        if (invalidProperties.length > 0) {
            notes.addError(
                '["' + invalidProperties.join('", "').toString() + '"] are invalid Elements schema root properties'
            );
        }
    }
}

export interface IElements {
    entities: object;
    edges: object;
}

interface IEntity {
    description: string;
    vertex: string;
    properties: object;
    groupBy: Array<string>;
}