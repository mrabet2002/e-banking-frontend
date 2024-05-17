import { CONSTANTS } from './constants';

export class endpoints {
  static readonly login = () => `${CONSTANTS.BASE_URL}/auth/login`;
  static readonly register = () => `${CONSTANTS.BASE_URL}/auth/register`;
  static readonly accounts = () => `${CONSTANTS.BASE_URL}/accounts`;
  static readonly account = (accountId: string) => `${CONSTANTS.BASE_URL}/accounts/${accountId}`;

  static readonly credit = () => `${CONSTANTS.BASE_URL}/accounts/credit`;
  static readonly debit = () => `${CONSTANTS.BASE_URL}/accounts/debit`;
  static readonly transfer = () => `${CONSTANTS.BASE_URL}/accounts/transfer`;
}
