export type PersonEditableFields = {
    name : string;
    balance : number;
};

export type Person = PersonEditableFields & {
    id?: string;
};