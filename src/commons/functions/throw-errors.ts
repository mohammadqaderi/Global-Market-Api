import { NotFoundException } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ThrowErrors {
  export function NotFound(item: string, id: number) {
    throw new NotFoundException(`${item} with id: ${id} does not found!`)
  }
}
