import { Resource } from '@shared/types';
import { toHandle } from '@/utils/fmt';

/*
size
columns
primary keys
foreign keys
indexes
unique constraints
*/
async function readTableResource(uri: string, schema: string, name: string): Promise<Resource> {
  return {
    uri,
    handle: toHandle(schema, name),
    mimeType: 'application/json',
    text: '',
  };
}

export default readTableResource;
