import { ApplicationError } from '@/protocols';

export function listHotelsError(): ApplicationError {
  return {
    name: 'listHotelsError',
    message: 'Can not list hotels! Ticket may be not payed yet, or the type does not include hotel.',
  };
}
