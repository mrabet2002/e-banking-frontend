import {OperationType} from "./enums/operation-type.enum";

export interface Operation {
  id: number;
  accountId: string;
  amount: number;
  description: string;
  type: OperationType;
  date: string;
}
