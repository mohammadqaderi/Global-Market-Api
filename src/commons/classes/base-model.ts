export class BaseModel<T> {
  isSuccessful: boolean;
  data: T;
  errors: string[] | null;
  message: string | null;
}
